import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import Modal from 'react-modal';
import './Report.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell'; 
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'; 
import Paper from '@mui/material/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const SalesTables = () => {

    const [DateSold, setDateSold] = useState(''); 
    const [Branch, setBranch] = useState(''); 
    const [searchResults, setSearchResults] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };



  const handleSearch = () => {
    // Perform a fetch request to the backend API
    fetch(process.env.REACT_APP_API_ADDRESS + `api/search/SalesTables?DateSold=${DateSold}&Branch=${Branch}`)
      .then((response) => response.json())
      .then((data) => setSearchResults(data))
      .catch((error) => console.error('Error:', error));
  };


  const [data, setData] = useState([]); 

  const loadData = async () => {
    const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "api/Auth/staffmembers");
    setData(response.data);
  }; 

  useEffect(() =>{
    loadData();
  }, []);


  
 
  return (
    <div>
    <FontAwesomeIcon icon={faChartSimple} />
    <button onClick={openModal} style={{border:'none'}}> Generate Sales Table By Branch
    <p>View Sales by Branch</p></button>

    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { width: '1234px', border: 'none' } }}>
    <div className='Report'>

    <div className='SearchInputs'>

        <div className='SearchItem'>
            <label htmlFor="DateAdded">Date:</label>
            <input type="date" id="DateAdded" value={DateSold} onChange={(e) => setDateSold(e.target.value)} />
        </div>
        <div className='SearchItem'>
            <label htmlFor="Branch">Branch:</label>
            <select type="text" id="Branch" value={Branch} onChange={(e) => setBranch(e.target.value)}>
              <option>Select...</option>
              {data.map((val) =>{
                return(
                  <option>{val.Branch}</option> 
                )
              })}
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
        filename="SalesData"
        sheet="sheet1"
        buttonText="Export to Excel"
        />

        </div>

        <TableContainer  component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table' id="table-to-export">
            <TableHead className='head'>

                <div style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start'}}>
                    {searchResults.map((val,index) =>{
                        return(
                            <div>
                                {index === 0 && <span>Branch:{val.Branch}</span>}
                            </div>
                        )
                    })}
                </div>

                <TableRow className='rows'>
                    <TableCell className="tableCell rows">Citation</TableCell>
                    <TableCell className="tableCell rows">Name</TableCell>
                    <TableCell className="tableCell rows">Quantity</TableCell>
                    <TableCell className="tableCell rows">Price</TableCell>
                    <TableCell className="tableCell rows">Status</TableCell>
                    <TableCell className="tableCell rows">Payed</TableCell>
                    <TableCell className="tableCell rows">Balance</TableCell>
                    <TableCell className="tableCell rows">Attendant</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
            {searchResults.map((result,index) => (
                <TableRow key={result.id}>
                        
                        <TableCell className="tableCell rows">{index + 1}</TableCell>
                        <TableCell className="tableCell rows">{result.name}</TableCell>
                        <TableCell className="tableCell rows">{result.amountMl}</TableCell>
                        <TableCell className="tableCell rows">{result.price}</TableCell>
                        <TableCell className="tableCell rows">{result.ProductStatus}</TableCell>
                        <TableCell className="tableCell rows">{result.Payment}</TableCell>
                        <TableCell className="tableCell rows">{result.Balance}</TableCell>
                        {index === 0 && 
                        <TableCell className="tableCell rows">{result.SoldBy}</TableCell>
                        }
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

export default SalesTables;