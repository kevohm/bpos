import React, { useEffect, useState } from 'react'
import './Products.scss'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'; 
import Paper from '@mui/material/Paper';
import axios from 'axios';

const Products = () => { 

    const [data,setData] = useState([])

    const loadData = async () => {
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS +  "api/Sales/StockAnalysis");
      setData(response.data);
    }; 
  
    useEffect(() =>{
      loadData();
    }, []);

  return ( 
    <div className='Table'>
        <TableContainer  component={Paper} className='TableContainer'>
        <Table className='TableBody'>
            <TableHead className='head'>
                <TableRow className='TableCell'>
                    <TableCell>Citation</TableCell>
                    <TableCell className="tableCell rows">Total Stock</TableCell>
                    <TableCell className="tableCell rows">Total Purchases</TableCell>
                    <TableCell className="tableCell rows">Available Today</TableCell>
                    <TableCell className="tableCell rows">Sold Today</TableCell>
                    <TableCell className="tableCell rows">Total Purchase Amount</TableCell>
                </TableRow>
            </TableHead>

            <TableBody> 
            {data.map((val) =>{
                return(
                    <TableRow key={val.id}>
                        <TableCell className="tableCell rows">Products</TableCell>
                        <TableCell className="tableCell rows">{val.count_stock}</TableCell>
                        <TableCell className="tableCell rows">{val.total_sold}</TableCell>
                        <TableCell className="tableCell rows">{val.count_available}</TableCell>
                        <TableCell className="tableCell rows">{val.count_sold}</TableCell>
                        <TableCell className="tableCell rows">{val.TotalMoneyPaid}</TableCell>
                    </TableRow>
                )
            })}
               
             

            </TableBody>
        </Table>
        </TableContainer>
    </div>
  )
}

export default Products