import React, { useContext, useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views';
import { AuthContext } from '../../AuthContext/AuthContext';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const MoneyAnalytics = () => {

  const downloadCombinedPDF = () => {
    const doc = new jsPDF();

    // Define the columns for the PDF table for Mpesa sales
    const mpesaColumns = [
      { title: 'No.', dataKey: 'no' },
      { title: 'Product Name', dataKey: 'productName' },
      { title: 'Qty', dataKey: 'qty' },
      { title: 'Amount(Mpesa)', dataKey: 'amountMpesa' },
      { title: 'Attendant', dataKey: 'attendant' },
      { title: 'Branch', dataKey: 'branch' },
    ];

    // Define the columns for the PDF table for Cash sales
    const cashColumns = [
      { title: 'No.', dataKey: 'no' },
      { title: 'Product Name', dataKey: 'productName' },
      { title: 'Qty', dataKey: 'qty' },
      { title: 'Amount(Cash)', dataKey: 'amountCash' },
      { title: 'Attendant', dataKey: 'attendant' },
      { title: 'Branch', dataKey: 'branch' },
    ];

    // Map your data to rows for the PDF table for Mpesa sales
    const mpesaRows = productDataMpesa
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((val, index) => ({
        no: index + 1,
        productName: val.uniqueNames,
        qty: val.counts,
        amountMpesa: val.mpesa,
        attendant: val.SoldBy,
        branch: val.branch,
      }));

    // Calculate and add the total Amount(Mpesa)
    const totalMpesa = productDataMpesa.reduce((total, val) => total + parseFloat(val.mpesa), 0).toLocaleString();
    mpesaRows.push({ no: '', productName: 'Total', qty: '', amountMpesa: totalMpesa, attendant: '', branch: '' });

    // Map your data to rows for the PDF table for Cash sales
    const cashRows = productDataCash
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((val, index) => ({
        no: index + 1,
        productName: val.uniqueNames,
        qty: val.counts,
        amountCash: val.cash,
        attendant: val.SoldBy,
        branch: val.branch,
      }));

    // Calculate and add the total Amount(Cash)
    const totalCash = productDataCash.reduce((total, val) => total + parseFloat(val.cash), 0).toLocaleString();
    cashRows.push({ no: '', productName: 'Total', qty: '', amountCash: totalCash, attendant: '', branch: '' });

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    // Add the Mpesa table to the PDF document
    doc.autoTable(mpesaColumns, mpesaRows, { startY: 10 });
    doc.text(`Date: ${formattedDate}`, 14, doc.autoTable.previous.finalY + 20, { fontSize: 10 });
    // Add a page break
    doc.addPage();

    // Add the Cash table to the PDF document
    doc.autoTable(cashColumns, cashRows, { startY: 10 });
    doc.text(`Date: ${formattedDate}`, 14, doc.autoTable.previous.finalY + 20, { fontSize: 10 });

    
    doc.save('combined_sales.pdf');
    
  };



    const [activeTab, setActiveTab] = useState('Add Stock');
    const [activeTabIndex, setActiveTabIndex] = useState(0);
  
    const handleTabChange = (index) => {
      setActiveTabIndex(index);
    };
  
    const handleTabClick = (tabName) => {
      setActiveTab(tabName);
    };


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    const { user } = useContext(AuthContext);
    const Branch = user?.Branch;
    const [productDataMpesa, setProductDataMpesa] = useState([]);
    const [productDataCash, setProductDataCash] = useState([]);

    useEffect(() => {
      axios.get(process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/salesreport/${Branch}`)
        .then(response => {
          setProductDataMpesa(response.data);
        })
        .catch(error => {
          console.error('Error fetching branch analytics:', error);
        });
    }, [Branch]);

    
    useEffect(() => {
      axios.get(process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/salesreportcash/${Branch}`)
        .then(response => {
          setProductDataCash(response.data);
        })
        .catch(error => {
          console.error('Error fetching branch analytics:', error);
        });
    }, [Branch]);



  return (
    <div className="TabBar">
      <div className="TabButtons">
        <button
          className={activeTabIndex === 0 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(0)}
        >
          Mpesa Analysis
        </button>
        <button
          className={activeTabIndex === 1 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(1)}
        >
          Cash Analysis
        </button>
        <button
          className={activeTabIndex === 2 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(2)}
        >
          Credit Card Analysis
        </button>
      </div>

      <SwipeableViews
      index={activeTabIndex}
      onChangeIndex={handleTabChange}
      enableMouseEvents
      >

      <div className="TabContent">
      
    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
    <div style={{display:'flex',justifyContent:'flex-start',alignContent:'flex-start'}}>
    <button onClick={downloadCombinedPDF}>Download PDF</button>
      <ReactHTMLTableToExcel
        id="export-button"
        className="ExportButton"
        table="table-to-export-mpesa"
        filename="mpesa sales"
        sheet="sheet1"
        buttonText="Download Report"
        />
      </div>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table" id="table-to-export-mpesa">
        <TableHead>
        <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Amount(Mpesa)</TableCell>
            <TableCell>Attendant</TableCell>
            <TableCell>Branch</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {productDataMpesa.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, index) => {
          
            return (
                <TableRow key={index}> 
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{val.uniqueNames}</TableCell>
                    <TableCell>{val.counts}</TableCell>
                    <TableCell>{val.mpesa}</TableCell>
                    <TableCell>{val.SoldBy}</TableCell>
                    <TableCell>{val.branch}</TableCell>
                </TableRow>
            );
        })}
        </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={productDataMpesa.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
        </Paper>
      </div>
      
      <div className="TabContent">
        
      <Paper sx={{ width: '100%', overflow: 'hidden'}}>
      <div style={{display:'flex',justifyContent:'flex-start',alignContent:'flex-start'}}>
      <ReactHTMLTableToExcel
        id="export-button"
        className="ExportButton"
        table="table-to-export-cash"
        filename="cash sales"
        sheet="sheet1"
        buttonText="Download Report"
        />
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" id="table-to-export-cash">
          <TableHead>
          <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Amount(Cash)</TableCell>
              <TableCell>Attendant</TableCell>
              <TableCell>Branch</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
          {productDataCash.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, index) => {
            
              return (
                  <TableRow key={index}> 
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{val.uniqueNames}</TableCell>
                      <TableCell>{val.counts}</TableCell>
                      <TableCell>{val.cash}</TableCell>
                      <TableCell>{val.SoldBy}</TableCell>
                      <TableCell>{val.branch}</TableCell>
                  </TableRow>
              );
          })}
          </TableBody>
          </Table>
          </TableContainer> 
          <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={productDataCash.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
          </Paper>
      </div>

      <div className="TabContent">card</div>

      </SwipeableViews>
    </div>
  )
}

export default MoneyAnalytics