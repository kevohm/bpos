import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarShow from '../sideBar/SideBarShow';
import Nav from '../NavigationShow/Nav';
import './Payment.scss'
import { FiCheckCircle } from 'react-icons/fi';
import BottomMenu from '../../components/NavigationBar/BottomNav/BottomMenu';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../AuthContext/AuthContext';
import { motion } from 'framer-motion'
import SalesPersonsNavigation from '../NavigationShow/SalesPersonsNavigation';
import { Reciept } from './Receipt/Reciept';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PaymentPage = ({ selectedCup }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const cart = JSON.parse(localStorage.getItem('cart'));
  const navigate = useNavigate();
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [mpesaAmount, setMpesaAmount] = useState('');
  const [customerMobile,setCustomerMobile] = useState('')
  const { user } = useContext(AuthContext);
  const SoldBy = user?.fullname;
  const Branch = user?.Branch;
  const company_id = user?.company_id
  const [cupQuantities, setCupQuantities] = useState({});

  const handlePaymentModeChange = (event) => {
    setPaymentMode(event.target.value);
  };

  const calculateProductTotal = (product) => {
    if (product.category === 'Senator Keg') {
      return product.price * product.quantity;
    } else {
      return product.price * product.quantity;
    }
  };
  
  

  const calculateGrandTotal = () => {
    return cart.reduce((total, product) => {
      const productPrice = product.price * product.quantity;
      return total + productPrice;
    }, 0);
  };

  const activeTransactions = new Set(); // Set to store active transaction IDs

  const handleCompletePayment = async () => {
      let transactionKey; // Declaring transactionKey outside the try block
  
      try {
          // Check if a similar transaction is in progress
          const cartItemIds = cart.map(item => item.id); // Assuming each item has an 'id' property
          transactionKey = JSON.stringify(cartItemIds); // Create a unique key for the current transaction
          if (activeTransactions.has(transactionKey)) {
              toast.error('Kindly wait, a similar transaction is underway.', {
                  position: toast.POSITION.BOTTOM_RIGHT,
              });
              return; // Exit the function if a similar transaction is in progress
          }
  
          // Add current transaction to active transactions
          activeTransactions.add(transactionKey);
  
          // Calculate total amount to pay and other necessary steps...
          const totalAmountToPay = paymentMode === 'both'
              ? parseFloat(cashAmount) + parseFloat(mpesaAmount)
              : paymentMode === 'cash'
                  ? parseFloat(cashAmount)
                  : parseFloat(mpesaAmount);
      
          const tolerance = 0.001;
      
          if (Math.abs(totalAmountToPay - calculateGrandTotal()) < tolerance) {
          
              const paymentData = {
                  cart: cart.map(item => ({
                      ...item,
                      ProductStatus: item.category === 'Senator Keg' ? (item.LargeCupMl ? 'Large' : 'Small') : undefined,
                      serialNumber: item.serialNumber,
                      smallCupMl: item.smallCupMl,
                      LargeCupMl: item.LargeCupMl,
                  })),
                  paymentMode,
                  cashAmount: paymentMode === 'both' ? cashAmount : paymentMode === 'cash' ? cashAmount : 0,
                  mpesaAmount: paymentMode === 'both' ? mpesaAmount : paymentMode === 'mpesa' ? mpesaAmount : 0,
                  SoldBy,
                  Branch,
                  customerMobile,
                  company_id
              };
      
              const response = await axios.post(process.env.REACT_APP_API_ADDRESS + '/api/ProductSales/completepayment', paymentData);
      
              if (response.status === 200) {
                  localStorage.removeItem('cart');
                  localStorage.removeItem('cartItemCount');
                  setTimeout(() => navigate('/thank-you'), 500);
                  toast.success('Products sold successfully.', {
                      position: toast.POSITION.BOTTOM_RIGHT,
                  });
                  
                  
                  // After successful payment, set paymentComplete to true
                  setPaymentComplete(true);
                  // handleReceiptPrint(document.body);
                  return {
                      customerMobile,
                      paymentMode,
                      cashAmount,
                      mpesaAmount
                  };
      
              } else {
                  console.error('Error completing payment:', response.data);
              }
          } else {
              toast.error('Funds are insufficient.', {
                  position: toast.POSITION.BOTTOM_RIGHT,
              });
          }
  
      } catch (error) {
          // Handle errors...
          console.error('Error completing payment:', error);
      } finally {
          // Remove transaction from active transactions
          activeTransactions.delete(transactionKey);
      }
  };
  
  
  
  

// const handleReceiptPrint = (reciept) => {
//   setPaymentComplete(true);
//   const pdfWidth = 210;
//   const pdfHeight = 297;
//   html2canvas(reciept).then(canvas => {
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
//     const imgWidth = pdfWidth;
//       const imgHeight = canvas.height * imgWidth / canvas.width;
//     // Add image to PDF
//     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//     // Save PDF
//     pdf.save("printed-document.pdf");
//     // Print PDF
//     pdf.autoPrint();
//   }).catch(err=>console.log(err))
//   console.log("Receipt printed successfully!");
// };


  return (
    <div>
      <SalesPersonsNavigation setSearchQuery={setSearchQuery} />
      
      <motion.div className='PaymentCheckout'
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:1.5, duration:1.5,type:'spring'}}
      >

      <div className='ChechoutOrder'>
      
        <div className='Headers'>
          <FiCheckCircle className="IconTick"/> 
          <h2>Complete Order</h2>
        </div>   
        <div>
          <h3>{calculateProductTotal}</h3>
        </div> 
        <div style={{display:'none'}}>
       
        </div>
        <div className='AmountsOrder'>
          <div className='PaymentComplete'>

            <div className='PaymentInputs'>
                <label>
                Mode of payment
                </label>
                <motion.select
                value={paymentMode}
                onChange={handlePaymentModeChange}
                animate={{x:0}}
                transition={{type:'spring',stiffness:'300'}}
                whileHover={{
                  scale:1.03,
                }}
              >
                <option value="">Select...</option>
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="both">Both</option>
              </motion.select>   
            </div>
      
            {paymentMode === 'cash' || paymentMode === 'both' ? (
            <div className='PaymentInputs'>
                <label>
                Amount in Cash
                </label>
                <motion.input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                animate={{x:0}}
                transition={{type:'spring',stiffness:'300'}}
                whileHover={{
                  scale:1.03,
                }}
              />
              
            
            </div>
        ) : null}

        {paymentMode === 'mpesa' || paymentMode === 'both' ? (
          <div className='PaymentInputs'>
              <label>
                Amount via M-Pesa
              </label>
              <motion.input
                type="number"
                value={mpesaAmount}
                onChange={(e) => setMpesaAmount(e.target.value)}
                animate={{x:0}}
                transition={{type:'spring',stiffness:'300'}}
                whileHover={{
                  scale:1.03,
                }}
              />
          </div>
        ) : null}

            <div className='PaymentInputs'>
              <label htmlFor='customerMobile'>Customer Mobile</label>
              <motion.input 
                name='customerMobile'
                id='customerMobile'
                type='text'
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder='07...'
                animate={{x:0}}
                transition={{type:'spring',stiffness:'300'}}
                whileHover={{
                  scale:1.03,
                }}
              />
            </div>

          </div>

          <div className='CompleteButtons'>
            <button className='buttonAddMore'>Prompt</button>
            <button onClick={handleCompletePayment} className='buttonComplete'>Pay</button>
          </div>
          


        </div>
      

      </div>

   

   

   
    </motion.div>
  
    </div>
  );
};

export default PaymentPage;
