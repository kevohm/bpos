import React from 'react'
import '../Home/home.scss'
import './Orders.scss'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import SideBar from '../../components/SideBar/SideBar'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Navigation from '../NavOfficial/Navigation'

const Orders = () => {
  return (
    <div className='home'>
    <div className='HomeDeco'>
    <Navigation />
    <div className="homeContainer">
      <NavigationBar />

      <div className='Orders'>
        <div className='OrdersTable'>
        <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table'>
            <TableHead className='head'>
              <TableRow className='rows'>
                <TableCell className="tableCell rows">#</TableCell>
                <TableCell className="tableCell rows">Product Name</TableCell>
                <TableCell className="tableCell rows">Order Id</TableCell>
                <TableCell className="tableCell rows">Order Time</TableCell>
                <TableCell className="tableCell rows">Ordered By</TableCell>
                <TableCell className="tableCell rows">Status</TableCell>
                <TableCell className="tableCell rows">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell className="tableCell rows">1</TableCell>
                <TableCell className="tableCell rows">Tusker Lager</TableCell>
                <TableCell className="tableCell rows">102</TableCell>
                <TableCell className="tableCell rows">10:20pm</TableCell>
                <TableCell className="tableCell rows">Samuel M W</TableCell>
                <TableCell className="tableCell rows">In Line</TableCell>
                <TableCell className="tableCell rows">
                <button style={{
                  background:'purple',
                  padding:'3px 5px',
                  border:'none',
                  borderRadius:'5px',
                  color:'white'
                }}>View</button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> 
      </div>
      </div>

      <div className='OrderSummary'>
          <h3>Order Statistics</h3>

          <div className='Statistics'>
            <div className='Orders1'>
              <p>Total Orders: </p>
              <p>Total Delivered</p>
              <p>Total In Line</p>
            </div>
            <div className='Orders1'>
              <p>Average delivery Time: </p>
            </div>
          </div>
      </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Orders