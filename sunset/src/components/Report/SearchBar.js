import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Document, Page } from 'react-pdf';
import Modal from 'react-modal';
import './Report.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons'

const Report = () => {
    const [DateSold, setDateSold] = useState(''); 
    const [Branch, setBranch] = useState(''); 
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
    // Perform a fetch request to the backend API
    fetch(process.env.REACT_APP_API_ADDRESS + `api/search?DateSold=${DateSold}&Branch=${Branch}&ProductStatus=${ProductStatus}`)
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
    <FontAwesomeIcon icon={faFlag} />
    <button onClick={openModal} style={{border:'none'}}>Generate Summary Report By Branch <p>View sales Summary by branch</p></button>

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
         
            {searchResults.map((result) => (
                <div key={result.id} className='resultsTab'>
                    <div className='ViewResults'>
                        <div className='ResultsHeader'>
                        <div className='HeaderResults'>
                          <span>Branch Name: </span><span>{result.Branch}</span>
                        </div>
                        <div className='HeaderResults'>
                          <span>Attendant on duty:</span><span>{result.SoldBy}</span>
                        </div>
                        </div>
                        {ProductStatus === 'available' && 
                        <div className='ResultItem'><span>Available Stock:</span><span>{result.stock}</span></div>
                        }
                        {ProductStatus === 'sold' && 
                        <div className='ResultItem'><span>Sold Stock:</span><span>{result.stock}</span></div>
                        }
                        <div className='ResultItem'><span>Mpesa Sales:</span><span>{result.MpesaTotals}</span></div>
                        <div className='ResultItem' ><span>Cash Sales:</span><span>{result.CashTotals}</span></div>
                        <div className='ResultItem'><span>Card Sales:</span><span>{result.CardTotals}</span></div>
                        <div className='ResultItem'><span>Balance Sale:</span><span>{result.balance}</span></div>
                        <div className='ResultItem'><span>Total Sales:</span><span>{result.TotalSales}</span></div>
                    </div>
                </div>
              
            ))}
      
          
        </div>
      )}
      </div>
    </Modal>
    </div>
  );
};

export default Report;