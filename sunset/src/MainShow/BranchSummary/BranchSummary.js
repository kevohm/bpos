import React, { useContext, useEffect, useState } from 'react'
import './BranchSummary.scss'
import axios from 'axios';
import { AuthContext } from '../../AuthContext/AuthContext';

export const BranchSummary = () => {
    
    const { user } = useContext(AuthContext);
    const Branch = user?.Branch;
    const SoldBy = user?.fullname;

    const [salesDash, setSalesDash] = useState([]);


    useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `api/expenses/branchanalysis/${SoldBy}/${Branch}`)
          .then(response => {
            setSalesDash(response.data);
          })
          .catch(error => {
            console.error('Error fetching sales data:', error);
          });
      }, [Branch,SoldBy]); 

    const renderData = (data, property) => {
        return data.map(val => (
          <div key={val.id}>
            <span>{val[property].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        ));
      };


  return (
    <div className='BranchSummary'>
        <div className='grid grid-cols-2 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-scroll'>
            <div 
                className='bg-blue-600 p-4 text-white rounded-md hidden lg:block sm:block md:block' 
                style={{height:'90px'}}
            >
                <span className='text-lg font-bold'>Total sales</span>
                <small className='font-bold text-lg'>{renderData(salesDash, 'total_sales')}</small>
            </div>
    
            <div 
                className='bg-green-600 p-4 text-white rounded-md hidden lg:block sm:block md:block'
                style={{height:'90px'}}
            >
                <span className='text-lg font-bold'>Total value</span>
                <small className='font-bold text-lg'>{renderData(salesDash, 'total_value')}</small>
            </div>
    
            <div 
                className='bg-yellow-600 p-4 text-white rounded-md'
                style={{height:'90px'}}
            >
                <span className='text-lg font-bold'>Cash today</span>
                <small className='font-bold text-lg'>{renderData(salesDash, 'CashToday')}</small>
            </div>
    
            <div 
                className='bg-purple-600 p-4 text-white rounded-md'
                style={{height:'90px'}}
            >
                <span className='text-lg font-bold'>Mpesa today</span>
                <small className='font-bold text-lg'>{renderData(salesDash, 'MpesaToday')}</small>
            </div>

            <div 
            className='bg-red-600 p-4 text-white rounded-md hidden lg:block sm:block md:block'
            style={{height:'90px'}}
            >
                <span className='text-lg font-bold'>Branch profit</span>
                <small className='font-bold text-lg'>{renderData(salesDash, 'BranchProfit')}</small>
            </div>
        </div>
    </div>
  )
}
