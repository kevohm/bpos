import React, { useContext, useEffect, useState } from 'react'
import './ProductEdits.scss'
import axios from 'axios'
import { AuthContext } from '../../AuthContext/AuthContext';
import { FaEdit } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'
import 'slick-carousel/slick/slick-theme.css';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';
import SalesPersonsNavigation from '../NavigationShow/SalesPersonsNavigation';
import { motion } from 'framer-motion'


const ProductEdits = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [stockReceipt, setStockReceipt] = useState([]);
  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const [query, setQuery] = useState('');
  const currentSeller = user?.fullname;
  const today = moment().format('MMMM D, YYYY'); 
 

  /* Get the data using useEffect */
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/${Branch}?q=${query}`)
      .then(response => {
        setAnalyticsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching branch analytics:', error);
      });
  }, [Branch,query]);

//   stock addition receipt
useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `api/adminfunctions/stockadditionreceipt/${Branch}`)
      .then(response => {
        setStockReceipt(response.data);
      })
      .catch(error => {
        console.error('Error fetching branch analytics:', error);
      });
  }, [Branch]);
  

  const downloadPDF = () => {
    const unit = 'pt';
    const size = 'A4'; 
  
    const jsPDFDoc = new jsPDF({
      orientation: 'portrait', 
      unit,
      format: size,
    });

    jsPDFDoc.setFillColor('white'); // Blue color
    jsPDFDoc.rect(0, 0, jsPDFDoc.internal.pageSize.getWidth(), jsPDFDoc.internal.pageSize.getHeight(), 'F');
  
    const lineHeight = 20;
    let currentY = 30;
    let totalCost = 0;
  
    // Title
    jsPDFDoc.setFontSize(18); 
    jsPDFDoc.setFont('helvetica', 'bold'); 
    jsPDFDoc.setTextColor('#154a93'); 
    jsPDFDoc.text(`${Branch} Shop`, 20, currentY);
    jsPDFDoc.setTextColor('black'); 
    currentY += lineHeight;
  
    // Subtitle
    jsPDFDoc.setFontSize(12); 
    jsPDFDoc.setFont('helvetica', 'normal');
    jsPDFDoc.setTextColor('black'); 
    jsPDFDoc.text(`Added stock receipt as at ${today}`, 20, currentY);
    jsPDFDoc.setTextColor('black'); 
    currentY += lineHeight * 2;
  
    // Table header
    jsPDFDoc.setFont('helvetica', 'bold');
    jsPDFDoc.text('Item', 20, currentY);
    jsPDFDoc.text('Price', 150, currentY);
    jsPDFDoc.text('Qty', 250, currentY);
    jsPDFDoc.text('Supplier', 350, currentY);
    jsPDFDoc.text('Total', 450, currentY);
   
    currentY += lineHeight;
  
    // Receipt items
    stockReceipt.forEach(item => {
        jsPDFDoc.setFont('helvetica', 'normal');
        jsPDFDoc.text(String(item.name), 20, currentY);
        jsPDFDoc.text(String(item.BuyingPrice), 150, currentY);
        jsPDFDoc.text(String(item.AddedQuantity), 250, currentY);
        jsPDFDoc.text(String(item.Supplier), 350, currentY);
        const totalPrice = item.BuyingPrice * item.AddedQuantity;

        jsPDFDoc.text(String(totalPrice.toLocaleString()), 450, currentY);

        currentY += lineHeight;

        totalCost += totalPrice;
    });
  
    // Total
    currentY += lineHeight * 2;
    jsPDFDoc.setFont('helvetica', 'bold');
    jsPDFDoc.text(`Total Cost: ${totalCost.toLocaleString()}`, 40, currentY);
    currentY += lineHeight * 1; // Increment currentY to add more space

    // Received and updated by
    jsPDFDoc.setFont('helvetica', 'bold');
    jsPDFDoc.setTextColor('#154a93'); // Set text color to blue
    jsPDFDoc.text(`Received and updated by: ${currentSeller}`, 40, currentY);
    jsPDFDoc.setTextColor('black'); 

    // Add disclaimer text
    jsPDFDoc.setFont('helvetica', 'italic','bold');
    jsPDFDoc.setFontSize(10);
    jsPDFDoc.setTextColor('#000000');
    const disclaimerText = "This receipt serves as confirmation of received stock. Please review for accuracy.";
    const disclaimerWidth = jsPDFDoc.getStringUnitWidth(disclaimerText) * 10;
    const pageWidth = jsPDFDoc.internal.pageSize.getWidth();
    const disclaimerX = (pageWidth - disclaimerWidth) / 2;
    const disclaimerY = jsPDFDoc.internal.pageSize.getHeight() - 20; // Adjust the Y-coordinate as needed
    jsPDFDoc.text(disclaimerText, disclaimerX, disclaimerY);

    // Save the PDF
    jsPDFDoc.save(`${Branch} ${today} additionreceipt.pdf`);
};


  

  return (
    <div> 
      <SalesPersonsNavigation />
      <motion.div className='ProductEdits'  
        initial={{opacity:0, y:100}}
        animate={{opacity:1, y:0}}
        transition={{delay:1.5, duration:1.5,type:'spring'}}
      >

            <div className='StockTakeHeader'>
                <h3>Hello {currentSeller}</h3>
                <span>Click the <small> <FaEdit/></small> icon to proceed to stock updates</span>
            </div>

            <div className='downloadStockAddedReceipt'>
                <button onClick={downloadPDF}>Download Receipt</button>
            </div>

          <div className='TableProducts'>
            <DataGrid
            style={{padding:'20px'}}
           
                rows={analyticsData.map((product, index) => ({ ...product, indexId: index + 1 }))}
                columns={[
                    { field: 'indexId', headerName: 'ID', width: 70 },
                    {
                        field: 'actions',
                        headerName: 'Action',
                        width: 100, 
                        renderCell: (params) => (
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'15px'}}>

                             
                                    <Link to={`/product_history/${params.row.id}`}>
                                    <button style={{ color: 'green', border: 'none', cursor: 'pointer' }}>
                                        <FaEdit
                                            style={{
                                                cursor: 'pointer',
                                                 marginLeft: '4px',
                                            }} 
                                        />
                                    </button>
                                </Link>


                            </div>
                        ),
                    },
                    {
                        field: 'imageAndName',
                        headerName: 'Product',
                        width: 200, // Adjust the width as needed
                        renderCell: (params) => (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={params.row.imageUrl}
                              alt={params.row.name}
                              style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%', marginRight: '10px' }}
                            />
                            <span>{params.row.name}</span>
                          </div>
                        ),
                    },
                    { field: 'amountMl', headerName: 'Ml', width: 120 },
                    { field: 'BuyingPrice', headerName: 'Buying Price', width: 120 },
                    { field: 'price', headerName: 'Selling Price', width: 120 },
                   
                    {
                        field: 'createdAt',
                        headerName: 'Created At',
                        width: 150,
                        renderCell: (params) => (
                            <span>
                                {moment(params.row.DateAdded).format('DD.MM.YYYY')}
                            </span>
                        ),
                    },
                    {
                        field: 'quantity',
                        headerName: 'In Stock',
                        width: 150,
                        renderCell: (params) => (
                            params.row.quantity > 0 ? (
                                <span style={{color:'green',background:'#dcfce7',padding:'10px 10px',fontWeight:'bold',borderRadius:"10px"}}>In stock</span>
                            ) : (
                                <span style={{color:'red',background:'#fee2e2',padding:'10px 10px',fontWeight:'bold',borderRadius:"10px"}}>Out of stock</span>
                            )
                        ),
                    },
              
                ]}
                pageSize={10}
                initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 10,
                        },
                    },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection= {false}
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
                    disableExportSelector
          />
          </div>
      </motion.div>
    </div>
  )
}

export default ProductEdits