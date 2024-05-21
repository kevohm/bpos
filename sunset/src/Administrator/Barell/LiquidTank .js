import React, { useState } from 'react';
import './LiquidTank.scss';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion'

const MAX_CAPACITY = 50000;

const LiquidTank = () => {
  const [liquidLevel, setLiquidLevel] = useState(25000); 

  const handleInputChange = (event) => {
    const newLevel = parseInt(event.target.value, 10) || 0;
    setLiquidLevel(Math.min(newLevel, MAX_CAPACITY));
  };

  return (
    <motion.div className="liquid-tank"
        animate={{x:0}}
        transition={{type:'spring',stiffness:'300'}}
        whileHover={{
        scale:1.02,
        originX:0
        }}
    >
      <div className="tank">
        <div className="liquid" style={{ height: `${(liquidLevel / MAX_CAPACITY) * 100}%` }}></div>
      </div>
      {/* <input
        type="range"
        min="0"
        max={MAX_CAPACITY}
        value={liquidLevel}
        onChange={handleInputChange}
        className="level-input"
      /> */}
      <p className="level-indicator">Keg Level: {liquidLevel} ml</p>
      <div className='BottomButtons'>
        <div className='InStock'><AddShoppingCartIcon className='inStockIcon'/></div>
        <div className='ViewMore'><VisibilityIcon className='ViewIcon'/></div>
      </div>
    </motion.div>
  );
};

export default LiquidTank;
