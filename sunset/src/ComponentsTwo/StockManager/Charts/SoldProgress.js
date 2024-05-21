import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgressBar = ({ percentage }) => {
  const barColor = `rgba(46, 204, 113, ${percentage / 100})`;

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
            <span style={labelStyle}>S:{percentage}%</span>
        </div>
    </div>
  );
};

const SoldProgress = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/stockcomparison');
      const soldPercentage = response.data.find(
        (item) => item.ProductStatus === 'sold'
      )?.Percentage;
      setPercentage(soldPercentage || 0);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return <ProgressBar percentage={percentage} />;
};

export default SoldProgress;
