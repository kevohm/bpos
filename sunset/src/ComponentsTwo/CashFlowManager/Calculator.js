import React, { useState, useEffect } from 'react';
import './styles/Calculator.scss';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState(''); // Set the default value to '0'
  const [mode, setMode] = useState('normal'); // Set the default mode to 'normal'
  const [numbers, setNumbers] = useState([]); // Array to store the entered numbers

  const [openCal, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCalc = () => {
    setOpen(false);
  };

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        setDisplayValue(eval(displayValue));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'sqrt') {
      try {
        setDisplayValue(Math.sqrt(parseFloat(displayValue)));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'square') {
      try {
        setDisplayValue(Math.pow(parseFloat(displayValue), 2));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'clear') {
      setDisplayValue('');
      setNumbers([]);
    } else if (value === 'sin') {
      try {
        setDisplayValue(Math.sin(parseFloat(displayValue)));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'cos') {
      try {
        setDisplayValue(Math.cos(parseFloat(displayValue)));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'tan') {
      try {
        setDisplayValue(Math.tan(parseFloat(displayValue)));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'log') {
      try {
        setDisplayValue(Math.log10(parseFloat(displayValue)));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'ln') {
      try {
        setDisplayValue(Math.log(parseFloat(displayValue)));
      } catch (error) {
        setDisplayValue('Error');
      }
    } else if (value === 'pi') {
      setDisplayValue(Math.PI);
    } else if (value === 'del') {
      setDisplayValue((prevDisplayValue) =>
        prevDisplayValue.slice(0, prevDisplayValue.length - 1)
      );
    } else if (value === 'mode') {
      setMode((prevMode) => (prevMode === 'normal' ? 'statistics' : 'normal'));
      setDisplayValue('');
      setNumbers([]);
    } else {
      if (mode === 'statistics') {
        setDisplayValue((prevDisplayValue) => prevDisplayValue + value);
        setNumbers((prevNumbers) => [...prevNumbers, parseFloat(value)]);
      } else {
        setDisplayValue((prevDisplayValue) => prevDisplayValue + value);
      }
    }
  };

  const calculateVariance = () => {
    const mean = calculateMean();
    const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    return sumSquaredDifferences / numbers.length;
  };

  const calculateMean = () => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
  };

  const calculateStandardDeviation = () => {
    const variance = calculateVariance();
    return Math.sqrt(variance);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/[0-9+\-*/.=]|Backspace|Delete|Enter|m/i.test(key)) {
        event.preventDefault();

        if (/[+\-*/.=]/.test(key)) {
          handleButtonClick(key);
        } else if (key === 'Enter' || key === '=') {
          handleButtonClick('=');
        } else if (key === 'Backspace' || key === 'Delete') {
          handleButtonClick('del');
        } else if (key === 'm' || key === 'M') {
          handleButtonClick('mode');
        } else {
          handleButtonClick(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="calculator">
      <input type="text" value={displayValue} readOnly />
      <div className="calculator-grid">
        <button onClick={() => handleButtonClick('7')}>7</button>
        <button onClick={() => handleButtonClick('8')}>8</button>
        <button onClick={() => handleButtonClick('9')}>9</button>
        <button onClick={() => handleButtonClick('+')} className="operator">
          +
        </button>
        <button onClick={() => handleButtonClick('4')}>4</button>
        <button onClick={() => handleButtonClick('5')}>5</button>
        <button onClick={() => handleButtonClick('6')}>6</button>
        <button onClick={() => handleButtonClick('-')} className="operator">
          -
        </button>
        <button onClick={() => handleButtonClick('1')}>1</button>
        <button onClick={() => handleButtonClick('2')}>2</button>
        <button onClick={() => handleButtonClick('3')}>3</button>
        <button onClick={() => handleButtonClick('*')} className="operator">
          ×
        </button>
        <button onClick={() => handleButtonClick('0')}>0</button>
        <button onClick={() => handleButtonClick('.')}>.</button>
        <button onClick={() => handleButtonClick('=')} className="equal">
          =
        </button>
        <button onClick={() => handleButtonClick('/')} className="operator">
          /
        </button>
        <button onClick={() => handleButtonClick('sqrt')}>√</button>
        <button onClick={() => handleButtonClick('square')}>x²</button>
        <button onClick={() => handleButtonClick('sin')}>sin</button>
        <button onClick={() => handleButtonClick('cos')}>cos</button>
        <button onClick={() => handleButtonClick('tan')}>tan</button>
        <button onClick={() => handleButtonClick('log')}>log</button>
        <button onClick={() => handleButtonClick('ln')}>ln</button>
        <button onClick={() => handleButtonClick('pi')}>π</button>
        <button onClick={() => handleButtonClick('del')} className="del">
          Del
        </button>
        <button onClick={() => handleButtonClick('clear')} className="clear">
        Clear
      </button>
        <div className="mode-dropdown">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="statistics">Statistics</option>
          </select>
        </div>
        {mode === 'statistics' && (
          <div className="statistics">
            <button onClick={() => handleButtonClick('mean')}>Mean</button>
            <button onClick={() => handleButtonClick('variance')}>Variance</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
