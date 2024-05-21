import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'; 
import Paper from '@mui/material/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons'

const StockReport = () => {

    const [ProductStatus, setProductStatus] = useState(''); 
    const [searchResults, setSearchResults] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };



  const handleSearch = () => {
    fetch(process.env.REACT_APP_API_ADDRESS + `api/search/Stock?ProductStatus=${ProductStatus}`)
      .then((response) => response.json())
      .then((data) => setSearchResults(data))
      .catch((error) => console.error('Error:', error));
  };


  
 
  return (
    <div>
    <FontAwesomeIcon icon={faWarehouse} />
    <button onClick={openModal} style={{border:'none'}}>Stock Report <p>View the entire stock</p></button>

    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { width: '1234px', border: 'none' } }}>
    <div className='Report'>

    <div className='SearchInputs'>

     
        <div className='SearchItem'>
            <label htmlFor="ProductStatus">Status:</label>
            <select type="text" id="ProductStatus" value={ProductStatus} onChange={(e) => setProductStatus(e.target.value)}>
                <option>Select</option>
                <option>available</option>
                <option>sold</option>
            </select>
        </div>
    </div>

    <div className='SearchGo'>
        <button onClick={handleSearch}>Generate</button>
    </div>

      {searchResults.length > 0 && (
        <div className='Results'>

        <div className='Excel'>

        <ReactHTMLTableToExcel
        id="export-button"
        className="ExportButton"
        table="table-to-export"
        filename="Stock_report"
        sheet="sheet1"
        buttonText="Export to Excel"
        />

        </div>
         
        <TableContainer  component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table' id="table-to-export">
            <TableHead className='head'>

                <div style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start'}}>
                   <h2>Stock</h2>
                </div>

                <TableRow className='rows'>
                    <TableCell className="tableCell rows">#</TableCell>
                    <TableCell className="tableCell rows">Product Name</TableCell>
                    <TableCell className="tableCell rows">Quantity</TableCell>
                    <TableCell className="tableCell rows">Total Products</TableCell>
                    <TableCell className="tableCell rows">Branch</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
            {searchResults.map((result,index) => (
                <TableRow key={result.id}>
                        
                        <TableCell className="tableCell rows">{index + 1}</TableCell>
                        <TableCell className="tableCell rows">{result.name}</TableCell>
                        <TableCell className="tableCell rows">{result.amountMl} {result.ProductCategory !== 'Cigarettes' && <span>ml</span>}</TableCell>
                        <TableCell className="tableCell rows">{result.totalProducts}</TableCell>
                        <TableCell className="tableCell rows">{result.Branch}</TableCell>
                      
                    </TableRow>
              
            ))}
            </TableBody>
            </Table>

           
            </TableContainer>
      
          
        </div>
      )}
      </div>
    </Modal>
    </div>
  );
};

export default StockReport