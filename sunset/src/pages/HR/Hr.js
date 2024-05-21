import React from 'react'
import './Hr.scss'
import '../Home/home.scss'
import SideBar from '../../components/SideBar/SideBar'
import NavigationBar from '../../components/NavigationBar/NavigationBar'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Navigation from '../NavOfficial/Navigation'

const Hr = () => {
  return (
    <div className='home'>
    <div className='HomeDeco'>
    <Navigation />
    <div className="homeContainer">
      <NavigationBar />

      <div className='HumanResource'>
        <div className='Laeve'>
          <h3>Leave Requests</h3>

          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table'>
                <TableHead className='head'>
                  <TableRow className='rows'>
                    <TableCell className="tableCell rows">#</TableCell>
                    <TableCell className="tableCell rows">Citation</TableCell>
                    <TableCell className="tableCell rows">Reaquest date</TableCell>
                    <TableCell className="tableCell rows">Return date</TableCell>
                    <TableCell className="tableCell rows">status</TableCell>
                    <TableCell className="tableCell rows">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell className="tableCell rows"></TableCell>
                    <TableCell className="tableCell rows"></TableCell>
                    <TableCell className="tableCell rows"></TableCell>
                    <TableCell className="tableCell rows"></TableCell>
                    <TableCell className="tableCell rows"></TableCell>
                    <TableCell className="tableCell rows"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        <div className='Sales'>
          <h3>Sales performance</h3>

          <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table'>
              <TableHead className='head'>
                <TableRow className='rows'>
                  <TableCell className="tableCell rows">#</TableCell>
                  <TableCell className="tableCell rows">Date</TableCell>
                  <TableCell className="tableCell rows">Cash Payment</TableCell>
                  <TableCell className="tableCell rows">Mpesa Payment</TableCell>
                  <TableCell className="tableCell rows">Card Payment</TableCell>
                  <TableCell className="tableCell rows">Branch</TableCell>
                  <TableCell className="tableCell rows">Attendant</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell className="tableCell rows"></TableCell>
                  <TableCell className="tableCell rows"></TableCell>
                  <TableCell className="tableCell rows"></TableCell>
                  <TableCell className="tableCell rows"></TableCell>
                  <TableCell className="tableCell rows"></TableCell>
                  <TableCell className="tableCell rows"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        </div>

        <div className='Summary'> 
          

          <div className='Table'>
          <div className='TableSummary'>
          <h3>Summary</h3>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table'>
              <TableHead className='head'>
                <TableRow className='rows'>
                  <TableCell className="tableCell rows">Summary</TableCell>
                  <TableCell className="tableCell rows">Amount</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell className="tableCell rows">Cash</TableCell>
                  <TableCell className="tableCell rows">10000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="tableCell rows">Mpesa</TableCell>
                  <TableCell className="tableCell rows">10000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="tableCell rows">Credit Sales</TableCell>
                  <TableCell className="tableCell rows">10000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="tableCell rows">Total Sales</TableCell>
                  <TableCell className="tableCell rows">10000</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
          </div>

          <div className='Border'></div>

          <div className='Performance'>
            <h3>Product performance</h3>
            <div className='Individuals'>
              <p>Highest selling Product: </p>
              <p>Lowest Selling Product: </p>
              
              <p>Highest selling Branch: </p>
              <p>Lowest selling Branch: </p>

              <p>Highest Selling Attendant: </p>
              <p>Lowest Selling Attendant: </p>
            </div>
          </div>
        </div>
        
        </div>

      </div>
    </div>
    </div>
    </div>
  )
}

export default Hr