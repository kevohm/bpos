/* eslint-disable no-lone-blocks */
import React, { useEffect, useRef, useState } from 'react';
import Navigation from '../../pages/NavOfficial/Navigation';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useSpring, animated } from '@react-spring/web';
import QRCode from 'qrcode.react';

import SwipeableViews from 'react-swipeable-views';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LOGO from './logo.jpg'
import CashSalesReceiptModal from './CashSalesReceiptModal';



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius:'10px',
  boxShadow: 24,
  p: 4,
};


const MyBarChart = ({  MpesaAnalytics }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={MpesaAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Mpesa" fill="green" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const BranchPerformance = ({ branchPerformance }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={branchPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Card" fill="orange" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CashPerformance = ({ cashPerformance }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={cashPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Cash" fill="blue" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const MpesaReceiptModal = ({ mpesaSales, open, onClose }) => {
  const qrData = [
    { label: 'Mpesa Reference:', value: mpesaSales.MpesaCode },
    { label: 'Mpesa Amount:', value: mpesaSales.mpesa },
    { label: 'Customer:', value: mpesaSales.customerName },
    { label: 'Customer Mobile:', value: mpesaSales.customerMobile },
    { label: 'Branch:', value: mpesaSales.Branch },
    { label: 'Attendant:', value: mpesaSales.SoldBy },
    { label: 'Sale code:', value: mpesaSales.paymentCode },
    { label: 'Date:', value: moment(mpesaSales.actionDate).format('YYYY-MM-DD') },
  ];

  const qrDataString = JSON.stringify(qrData, function (key, value) {
    if (value instanceof Object && !Array.isArray(value)) {
      // Omit the curly braces for non-array objects
      return Object.keys(value).map((k) => `${k}: ${value[k]}`).join(', ');
    }
    return value;
  });

  const productNamesArray = mpesaSales.names.split(',').map((name) => name.trim());
  const productNameCounts = {};
  productNamesArray.forEach((name) => {
    productNameCounts[name] = (productNameCounts[name] || 0) + 1;
  });

  // Create a new list with unique product names and their counts
  const productNamesWithCount = Object.keys(productNameCounts).map((name) => ({
    name,
    count: productNameCounts[name],
  }));

  const handlePrint = () => {
    // Wait for a short delay to ensure the modal content is displayed before printing
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  // Call handlePrint automatically when the component mounts to trigger the printing directly
  useEffect(() => {
    handlePrint();
  }, []);


  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div>
            
             <h4 style={{textAlign:'center',fontSize:'48px',fontWeight:'bold'}}>Sunset On The Rye : {mpesaSales.Branch} Branch</h4>
            <span style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',
            borderTop:'1px solid grey',borderBottom:'1px solid black',
            padding:'5px',borderStyle:'dotted',borderRight:'none',borderLeft:'none',fontWeight:'bold',fontSize:'32px'}}>
              <span>Mpesa sale receipt</span>
            </span>
          </div>

          <div style={{display:'flex',flexDirection:'column',paddingLeft:'0px'}}>

          <div style={{display:'flex',justifyContent:'space-between',paddingTop:'10px',fontSize:'32px',fontWeight:'bold'}}>
            <span>Description</span> <span>Count</span>
          </div>

          <div style={{borderBottom:'1px solid grey',padding:"10px"}}>
          {productNamesWithCount.map((product) => (
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'30px',fontWeight:'bold'}} key={product.name}><span>{`${product.name}`}</span> <span>{`${product.count}`}</span></div>
          ))}
          </div>
     
          <div style={{display:'flex',justifyContent:'space-between',padding:'10px',borderBottom:'1px solid grey',fontWeight:'bold',fontSize:'32px'}}>
            <span>Total</span> <span>{mpesaSales.mpesa}</span>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',paddingTop:'30px',paddingBottom:'30px'}}>

          <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly',fontSize:'32px',fontWeight:'bold'}}>
            <span>Mpesa Ref: {mpesaSales.MpesaCode}</span>
            <span>Sale Id: {mpesaSales.paymentCode}</span>
            <span>Attendant: {mpesaSales.SoldBy}</span>
            <span>Date: {moment(mpesaSales.actionDate).format('DD-MM-YYYY')}</span>
          </div>
          <div style={{fontWeight:'bold'}}><QRCode value={qrDataString} /></div>
          </div>
         
          </div>

        </Box>
      </Fade>
    </Modal>
  );
};





const Customers = () => {

  const [selectedCashSale, setSelectedCashSale] = useState(null);
const [isCashSaleModalOpen, setCashSaleModalOpen] = useState(false);


const handleOpenCashSaleModal = (cashSale) => {
  setSelectedCashSale(cashSale);
  setCashSaleModalOpen(true);
};

const handleCloseCashSaleModal = () => {
  setSelectedCashSale(null);
  setCashSaleModalOpen(false);
};


  const [selectedMpesaSale, setSelectedMpesaSale] = useState(null);

  const handleOpenModal = (mpesaSale) => {
    setSelectedMpesaSale(mpesaSale);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMpesaSale(null);
    setOpen(false);
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
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  {/* Analytics */}

  const [MpesaAnalytics, setMpesaAnalytics] = useState([]);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [cashPerformance, setCashPerformance] = useState([]);

  const [MpesaPayments,setMpesaPayments] = useState([]);
  const [CashPayments,setCashPayments] = useState([]);
  const [CardPayments,setCardPayments] = useState([]);

  const [queryMpesa, setQueryMpesa] = useState('');
  const [queryCash, setQueryCash] = useState('');
  const [queryCard, setQueryCard] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mpesaResponse = axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/mpesasales?q=${queryMpesa}`);
        const cashResponse = axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/cashsales?q=${queryCash}`);
        const cardResponse = axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/cardsales?q=${queryCard}`);
        
        const [mpesaData, cashData, cardData] = await Promise.all([mpesaResponse, cashResponse, cardResponse]);

        setMpesaPayments(mpesaData.data);
        setCashPayments(cashData.data);
        setCardPayments(cardData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [queryMpesa,queryCash,queryCard]);

 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mpesaAnalyticsData, branchPerformanceData,cashPerformanceData] = await Promise.all([
          axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/mpesaanalytics'),
          axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/cardanalytics'),
          axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/cashanalytics')
        ]);

        // Update the state with fetched data
        setMpesaAnalytics(mpesaAnalyticsData.data);
        setBranchPerformance(branchPerformanceData.data);
        setCashPerformance(cashPerformanceData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [queryMpesa]);

{/* Mpesa Receipt Modal */}

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div className="home">
    <div className='HomeDeco'>
    <Navigation />
    
    <div className="homeContainer">
      <NavigationBar /> 
    <div className="TabBar">
      <div className="TabButtons">
        <button
          className={activeTabIndex === 0 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(0)}
        >
          Mpesa Sales
        </button>
        <button
          className={activeTabIndex === 1 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(1)}
        >
          Cash Sales
        </button>
        <button
          className={activeTabIndex === 2 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(2)}
        >
          Credit Card Sales
        </button>
      </div>

      <SwipeableViews
              index={activeTabIndex}
              onChangeIndex={handleTabChange}
              enableMouseEvents
      >
      <div className="TabContent"> 
   
      <Paper sx={{ width: 'auto', overflow: 'hidden' }}>
      <div style={{
        marginBottom:'0px',
        display:'flex',
        justifyContent:'flex-start',
        alignItems:'flex-start'
      }}>
        <input 
          style={{
            padding:'6px',
            borderRadius:'10px',
            border:'1.5px solid grey',
            outline:'none',
            borderBottom:'none',
            borderBottomRightRadius:'0px',
            borderBottomLeftRadius:'0px',
            paddingBottom:'10px',
            paddingTop:'10px'
          }}
          placeholder='Search...'
          type="search"
          onChange={(e) => setQueryMpesa(e.target.value.toLowerCase())}
        />
      </div>
      <TableContainer sx={{ maxHeight: 440,width:'auto' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
            <StyledTableCell> Amount </StyledTableCell>
            <StyledTableCell>  Date </StyledTableCell>
            <StyledTableCell> Action </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MpesaPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mpesaSales) =>{
              return(
                <TableRow>
                  <TableCell>{mpesaSales.mpesa}</TableCell>
                  <TableCell>{moment(mpesaSales.actionDate).format('YYYY-MM-DD')}</TableCell>
                  <TableCell> 
                    
                  <button onClick={() => handleOpenModal(mpesaSales)} style={{ border: 'none', outline: 'none' }}>
                  <FontAwesomeIcon style={{ color: 'green', fontWeight: 'bold' }} icon={faReceipt} />
                  </button>
                 
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={MpesaPayments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    {selectedMpesaSale && (
      <MpesaReceiptModal
        mpesaSales={selectedMpesaSale}
        open={open}
        onClose={handleCloseModal}
      />
    )}

    <MyBarChart MpesaAnalytics={MpesaAnalytics} />
    </div>

        <div className="TabContent">

        <Paper sx={{ width: 'auto', overflow: 'hidden' }}>
        <div style={{
          marginBottom:'0px',
          display:'flex',
          justifyContent:'flex-start',
          alignItems:'flex-start'
        }}>
          <input 
            style={{
              padding:'6px',
              borderRadius:'10px',
              border:'1.5px solid grey',
              outline:'none',
              borderBottom:'none',
              borderBottomRightRadius:'0px',
              borderBottomLeftRadius:'0px',
              paddingBottom:'10px',
              paddingTop:'10px'
            }}
            placeholder='Search...'
            type="search"
            onChange={(e) => setQueryCash(e.target.value.toLowerCase())}
          />
        </div>
        <TableContainer sx={{ maxHeight: 440,width:'auto' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
              <StyledTableCell> Amount (KES) </StyledTableCell>
              <StyledTableCell> Transaction Date </StyledTableCell>
              <StyledTableCell> Action </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CashPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cashSales) =>{
                return(
                  <TableRow>
                    <TableCell>{cashSales.cash}</TableCell>
                    <TableCell>{moment(cashSales.actionDate).format('YYYY-MM-DD')}</TableCell>
                    <TableCell> 
                    <button
                    onClick={() => handleOpenCashSaleModal(cashSales)} // Update this line
                    style={{ border: 'none', outline: 'none' }}
                  >
                    <FontAwesomeIcon style={{ color: 'green', fontWeight: 'bold' }} icon={faReceipt} />
                  </button>
                  
                   
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={CashPayments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {isCashSaleModalOpen && (
        <CashSalesReceiptModal
          cashSale={selectedCashSale}
          open={isCashSaleModalOpen}
          onClose={handleCloseCashSaleModal}
        />
      )}
         

      <CashPerformance cashPerformance={cashPerformance} />
        </div>

        <div className="TabContent">
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <div style={{
          marginBottom:'0px',
          display:'flex',
          justifyContent:'flex-start',
          alignItems:'flex-start'
        }}>
          <input 
            style={{
              padding:'6px',
              borderRadius:'10px',
              border:'1.5px solid grey',
              outline:'none',
              borderBottom:'none',
              borderBottomRightRadius:'0px',
              borderBottomLeftRadius:'0px',
              paddingBottom:'10px',
              paddingTop:'10px'
            }}
            placeholder='Search...'
            type="search"
            onChange={(e) => setQueryCard(e.target.value.toLowerCase())}
          />
        </div>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
              <StyledTableCell> Name </StyledTableCell>
              <StyledTableCell> Mpesa Code </StyledTableCell>
              <StyledTableCell> Amount (KES) </StyledTableCell>
              <StyledTableCell> Transaction Date </StyledTableCell>
              <StyledTableCell> Action </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CardPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((CardPayments) =>{
                return(
                  <TableRow>
                    <TableCell>{CardPayments.customerName}</TableCell>
                    <TableCell>{CardPayments.paymentCode}</TableCell>
                    <TableCell>{CardPayments.card}</TableCell>
                    <TableCell>{moment(CardPayments.actionDate).format('YYYY-MM-DD')}</TableCell>
                    <TableCell> 
                      
                    <button onClick={() => handleOpenModal(CardPayments)} style={{ border: 'none', outline: 'none' }}>
                    <FontAwesomeIcon style={{ color: 'green', fontWeight: 'bold' }} icon={faReceipt} />
                    </button>
                   
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={CardPayments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {selectedMpesaSale && (
        <MpesaReceiptModal
          mpesaSales={selectedMpesaSale}
          open={open}
          onClose={handleCloseModal}
        />
      )}
                 
                 <BranchPerformance branchPerformance={branchPerformance}/>
        </div>

      
      </SwipeableViews>
    </div>
    </div>
    </div>
    </div>
  );
};

export default Customers;
