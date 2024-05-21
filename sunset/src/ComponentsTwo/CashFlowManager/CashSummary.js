import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navigation from '../../pages/NavOfficial/Navigation';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './styles/Summary.scss'
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const CashSummary = () => {
    const [data, setData] = useState([]);

    const loadData = async () => {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "api/Products");
        setData(response.data);
      }; 
    
      useEffect(() =>{
        loadData();
      }, []);
    


  return (
    <div className="home">
        <div className='HomeDeco'>
        <Navigation />
            <div className="homeContainer">
                    <NavigationBar /> 
                    <div className='SummaryCash'>
                        <div><h3>Cash Summary</h3></div>
                        <div className='TableSummary'>
                            {data.map((val,index) =>{
                                return(
                                    <div key={val.id} className='TableDisplays'>
                                        <span>{index + 1}</span>
                                        <span>{val.name}</span>
                                        <span>{val.ProductStatus === 'sold' && <button 
                                        style={{
                                            padding:'2px 5px',
                                            borderRadius:'5px',
                                            color:'white',
                                            backgroundColor:'rgba(0, 128, 0, 0.833)',
                                            border:'none',
                    
                                        }}>Sold</button>}
                    
                                        {val.ProductStatus === 'available' && <button 
                                        style={{
                                            padding:'2px 5px',
                                            borderRadius:'5px',
                                            color:'white',
                                            backgroundColor:'rgba(15, 41, 187, 0.867)',
                                            border:'none',
                                            
                                        }}>Available</button>}</span>
                                        <span>{moment(val.DateSold).format('Do-MMMM-YYYY')}</span>
                                        <span style={{
                                            color:'blue',
                                            cursor:'pointer'
                                        }}><Link to={`/views/${val.id}_${val.name}`} style={{color:'blue',textDecoration:'none'}}><FontAwesomeIcon icon={faEye} /></Link></span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default CashSummary