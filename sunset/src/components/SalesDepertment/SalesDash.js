import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from '../NavigationBar/NavigationBar';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Navigation from '../../pages/NavOfficial/Navigation';
import { AuthContext } from '../../AuthContext/AuthContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



 
const SalesDash = () => {


    const [data,setData] = useState([])
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalEntries, setTotalEntries] = useState(0);
    const [query, setQuery] = useState('');

    const { user } = useContext(AuthContext);

    const Branch = user?.Branch
 

      useEffect(() => {
        const fetchData = async () => {
          setCurrentPage(1); // Reset currentPage to 1 when a new search query is made
      
          const res = await axios.get(
            process.env.REACT_APP_API_ADDRESS +
              `api/AvailableProducts/Sales/${Branch}?q=${query}`,
            {
              params: {
                page: 1, // Always fetch the first page of data for a new search query
                pageSize: pageSize,
              }, 
            }
          );
          const formattedData = res.data.map((item, index) => ({
            ...item,
            count: index + 1 + (1 - 1) * pageSize, // Use currentPage as 1
          }));
          setData(formattedData);
          setTotalEntries(res.headers['x-total-count']);
        };
      
        if (query.length === 0 || query.length > 2) fetchData();
      }, [query, pageSize]);

      const slicedData = data.slice(0, 20); 


      const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
      };
    
      const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
      };

    
   
      function handlePrintClick() {
        window.print();
      }
    


  return (
   

      <div className='Sales' style={{paddingLeft:'30px',paddingRight:'30px'}}>
        <div className='AvailableProdcts'>
 
            <div>
            <div style={{
                display:'flex',
                justifyContent:'flex-start',
                alignItems:'center',
                marginBottom:'10px'
            }}>
            <input 
                style={{padding:'10px 20px',border:'none',background:'rgba(0, 0, 0, 0.178)',color:'black',fontWeight:'bold',outline:'none',borderRadius:'20px'}}
                type='search'
                placeholder='Search...'
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                />
            </div>
            <TableContainer>
              <Table>
                <TableHead className='head'>
                  <TableRow className='rows'>
                    <TableCell className="tableCell rows">#</TableCell>
                    <TableCell className="tableCell rows">Product Name</TableCell>
                    <TableCell className="tableCell rows">Serial Numbe</TableCell>
                    <TableCell className="tableCell rows">Price</TableCell>
                    <TableCell className="tableCell rows">Status</TableCell>
                    <TableCell className="tableCell rows">Balance</TableCell>
                    <TableCell className="tableCell rows">Action</TableCell>
                    <TableCell className="tableCell rows">Branch</TableCell> 
                  </TableRow>
                </TableHead>
                <TableBody>
                {slicedData.map((val) =>{
                  return(
                    <TableRow key={val.id}>
                    {user.Branch === val.Branch &&(
                      <TableCell className="tableCell rows">{val.count}</TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                      <TableCell className="tableCell rows">{val.name}</TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                      <TableCell className="tableCell rows">{val.serialNumber}</TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                    <TableCell className="tableCell rows">{val.price}</TableCell>
                    )}
                    {user.Branch === val.Branch &&(
                    <TableCell className="ProductStatus">
                    {val.ProductStatus === 'sold' && <button 
                    style={{
                        padding:'2px 5px',
                        borderRadius:'5px',
                        color:'green',
                        backgroundColor:'rgba(0, 128, 0, 0.233)',
                        border:'none',

                    }}>Sold</button>}

                    {val.ProductStatus === 'available' && <button 
                    style={{
                        padding:'2px 5px',
                        borderRadius:'5px',
                        color:'rgb(0, 31, 204)',
                        backgroundColor:'rgba(15, 41, 187, 0.267)',
                        border:'none',
                        
                    }}>Available</button>}

                    </TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                    <TableCell className="tableCell rows" >
                     {val.Balance >=0 && <span style={{color:'green',fontWeight:'bold',fontSize:'18px'}}>{val.Balance}</span>} 
                     {val.Balance < 0 && <span style={{color:'red',fontWeight:'bold',fontSize:'18px'}}>{val.Balance}</span>} 
                    </TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                    <TableCell className="tableCell rows">
                    <Link to={`/update/${val.id}`} >
                    <button 
                    style={{
                      color:'white',
                      backgroundColor:'purple',
                      padding:'5px 10px',
                      borderRadius:'5px',
                      cursor:'pointer',
                      border:'none'
                    }} 
                    >
                    Pay
                    </button>
                    </Link>
                    </TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                    <TableCell className="tableCell rows" style={{display:'none'}}>
                    <div>
                    <button onClick={handleOpen}
                    style={{
                      color:'white',
                      backgroundColor:'green',
                      padding:'5px 10px',
                      borderRadius:'5px',
                      cursor:'pointer',
                      border:'none'
                    }} 
                    >
                      {val.Balance >= 0 ? 'Receipt' : val.Balance < 0 ? 'Invoice':null } 
                    </button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>

                        <div className="bar-sale-receipt">
                        <div className="header">
                          <h2>Sunset <br/> on the rye</h2>
                          <p>Date: {new Date().toLocaleDateString()}</p>
                        </div>
                        <hr />
                        <div className="items">
                            <div  className="item">
                              <div className="name">{val.ProductName}</div>
                              <div className="price">Kshs{val.Price}/=</div>
                            </div>
                        </div>
                        <hr />
                        <div className="subtotal">
                          <div>Subtotal:</div>
                          <div>Kshs{val.Payment}/=</div>
                        </div>
                        <hr />
                        <div className="total">
                          <div>Total:</div>
                          <div>Kshs{val.Payment}/=</div>
                        </div>
                        <button className="print-button" onClick={handlePrintClick}>Print</button>
                      </div>
                      </Box>
                    </Modal>
                  </div>
                    </TableCell>
                    )}

                    {user.Branch === val.Branch &&(
                    <TableCell className="tableCell rows">{val.Branch}</TableCell>
                    )}

                  </TableRow>

                  )
                })}
                 
                </TableBody>
                </Table>

                <div style={{display:'flex',justifyContent:'center',gap:'10px',marginTop:'10px'}}>

                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  style={{
                    border:'none',
                    padiding:'10px 15px'
                  }}
                >
                  Previous
                </button>

                <span>{currentPage}</span>

                <button
                  onClick={handleNextPage}
                  disabled={data.length < pageSize}
                  style={{
                    border:'none',
                    padiding:'10px 15px'
                  }}
                >
                  Next
                </button>
              </div>
            </TableContainer>
            </div>
        </div>
      </div>
  )
}

export default SalesDash