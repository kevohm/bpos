import React, { useEffect, useState } from 'react'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import Navigation from '../../pages/NavOfficial/Navigation'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './styles/Views.scss'

const Views = () => {

    const {id} = useParams();
    const [views, SetViews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/Products/${id}`);
            SetViews(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
      }, [id]); 


  return (
    <div className="home">
    <div className='HomeDeco'>
    <Navigation />
        <div className="homeContainer">
            <NavigationBar /> 
        <div className='Views'>
            <div className='TopSection'>
                <h4>Single Product View</h4>
            </div>
            <div className='BottomSection'>
                <div className='SideA'>
                    <span>Product Name: {views.name}</span>
                    <span>serial number: {views.serialNumber}</span>
                    <span>Product price: {views.price}</span>
                    <span>Product quantity: {views.amountMl}</span>
                    <span>Product Category: {views.category}</span>
                    <span>Added Date: {moment(views.DateAdded).format('Do-MMMM-YYYY')}</span>
                    <span>Product Status:  <span>{views.ProductStatus === 'sold' && <button 
                    style={{
                        padding:'2px 5px',
                        borderRadius:'5px',
                        color:'white',
                        backgroundColor:'rgba(0, 128, 0, 0.833)',
                        border:'none',

                    }}>Sold</button>}

                    {views.ProductStatus === 'available' && <button 
                    style={{
                        padding:'2px 5px',
                        borderRadius:'5px',
                        color:'white',
                        backgroundColor:'rgba(15, 41, 187, 0.867)',
                        border:'none',
                        
                    }}>Available</button>}</span></span>
                    <span>Added by: {views.AddedBy}</span>
                    
                </div>
                <div className='SideB'>
                    <span>Branch: {views.Branch}</span>
                    <span>Amount Paid: {views.Payment}</span>
                    <span>Mpesa: {views.Mpesa}</span>
                    <span>Cash: {views.Cash}</span>
                    <span>Card: {views.Card}</span>
                    <span>Balance: <span style={{color:'red'}}>{views.Balance}</span></span>
                    <span>Sold by: {views.SoldBy}</span>
                    <span>Date sold: {moment(views.DateSold).format('Do-MMMM-YYYY')}</span>
                </div>
            </div>
            <div className='CustomerDetails'>
                <h4>Customer Details</h4>
            </div>
        </div>
    </div>
    </div>
    </div>

  )
}

export default Views