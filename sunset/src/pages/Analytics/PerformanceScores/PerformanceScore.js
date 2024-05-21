import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './PerformanceScore.scss'

const PerformanceScore = () => {
    const [performanceScore,SetPerformanceScore] = useState([]);

    useEffect(() => {
      
      axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/stockperformance')
        .then(response => {
            SetPerformanceScore(response.data); 
        })
        .catch(error => {
          console.error('Error fetching product groups:', error);
        });
    }, []);
  return (
    <div>
        {performanceScore.map((val) =>{
            return(
                <div className='PerformanceScore'>
                    <span style={{backgroundColor:'green'}}> <p>Best Seller</p> {val.BestSoldProduct}</span>
                    <span style={{backgroundColor:'orange'}}><p>Least Seller</p> {val.LeastSoldProduct}</span>
                    <span style={{backgroundColor:'green'}}> <p>Best selling</p> {val.BestPerformingBranch}</span>
                    <span style={{backgroundColor:'orange'}}> <p>Least Selling</p> {val.LeastPerformingBranch}</span>
                </div>
            )
        })}
    </div>
  )
}

export default PerformanceScore;