import React, { useContext, useState } from 'react'
import Modal from 'react-modal';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'; 
import Paper from '@mui/material/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { AuthContext } from '../../AuthContext/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

const IndividualReport = () => {
    const { user } = useContext(AuthContext);

    const [SoldBy, setSoldBy] = [user?.fullname]; 
    const [searchResults, setSearchResults] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const openModal = () => {
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };



  const handleSearch = () => {
    fetch(process.env.REACT_APP_API_ADDRESS + `api/search/IndividualSales?SoldBy=${SoldBy}`)
      .then((response) => response.json())
      .then((data) => setSearchResults(data))
      .catch((error) => console.error('Error:', error));
  };


  
 
  return (
    <div>
    <FontAwesomeIcon icon={faUser} />
    <button onClick={openModal} style={{border:'none'}}>Individual Sales Report <p>View Your sales report</p></button>

    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ content: { width: '1234px', border: 'none' } }}>
    <div className='Report'>

    <div className='SearchInputs'>

     
        <div className='SearchItem' style={{display:'none'}}>
            <label htmlFor="ProductStatus">SoldBy:</label>
            <input type="text" id="ProductStatus" value={SoldBy} onChange={(e) => setSoldBy(e.target.value)} />
            
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
        filename="individual_sales"
        sheet="sheet1"
        buttonText="Export to Excel"
        />

        </div>
         
        <TableContainer  component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table' id="table-to-export">
            <TableHead className='head'>

                <div style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start'}}>
                   <h2>Sales</h2>
                </div>

                <TableRow className='rows'>
                    <TableCell className="tableCell rows">#</TableCell>
                    <TableCell className="tableCell rows">Product Name</TableCell>
                    <TableCell className="tableCell rows">Quantity</TableCell>
                    <TableCell className="tableCell rows">Price</TableCell>
                    <TableCell className="tableCell rows">Payment</TableCell>
                    <TableCell className="tableCell rows">Balance</TableCell>
                    <TableCell className="tableCell rows">Branch</TableCell>
                    <TableCell className="tableCell rows">Status</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
            {searchResults.map((result,index) => (
                <TableRow key={result.id}>
                        
                        <TableCell className="tableCell rows">{index + 1}</TableCell>
                        <TableCell className="tableCell rows">{result.name}</TableCell>
                        <TableCell className="tableCell rows">{result.amountMl} ml</TableCell>
                        <TableCell className="tableCell rows">{result.price}</TableCell>
                        <TableCell className="tableCell rows">{result.Payment}</TableCell>
                        <TableCell className="tableCell rows">{result.Balance}</TableCell>
                        <TableCell className="tableCell rows">{result.Branch}</TableCell>
                        <TableCell className="tableCell rows">
                        {result.ProductStatus === 'sold' && <button 
                        style={{
                            padding:'2px 5px',
                            borderRadius:'5px',
                            color:'green',
                            backgroundColor:'rgba(0, 128, 0, 0.233)',
                            border:'none',
    
                        }}>Sold</button>}
    
                        {result.ProductStatus === 'available' && <button 
                        style={{
                            padding:'2px 5px',
                            borderRadius:'5px',
                            color:'rgb(0, 31, 204)',
                            backgroundColor:'rgba(15, 41, 187, 0.267)',
                            border:'none',
                            
                        }}>Available</button>}
                        </TableCell>
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

export default IndividualReport