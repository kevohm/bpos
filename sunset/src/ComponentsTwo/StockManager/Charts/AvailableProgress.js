import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgressBar = ({ percentage }) => {
  let barColor;
  if (percentage > 50) {
    barColor = 'orange';
  } else if (percentage > 20) {
    barColor = 'orangered';
  } else {
    barColor = 'red';
  }

  const progressBarStyle = {
    width: '100%',
    height: '30px',
    backgroundColor: 'lightgray',
    position: 'relative',
  };

  const fillerStyle = {
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: barColor,
  };

  const labelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'black',
    fontWeight: 'bold',
  };

  return (
    <div style={progressBarStyle}>
        <div style={fillerStyle}>
            <span style={labelStyle}>A:{percentage}%</span>
        </div>
    </div>
  );
};

const AvailableProgress = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/stockcomparison');
      const availablePercentage = response.data.find(
        (item) => item.ProductStatus === 'available'
      )?.Percentage;
      setPercentage(availablePercentage || 0);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return <ProgressBar percentage={percentage} />;
};

export default AvailableProgress;
