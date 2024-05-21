import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import moment from 'moment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import { useSpring, animated } from '@react-spring/web';
import QRCode from 'qrcode.react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastStyle.scss'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const style = {
    position: 'absolute', 
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
    borderRadius:'10px'
  };
  
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
  


const MpesaReceiptModal = ({ val, openInvoice, onClose }) => {
    const qrData = [
      { label: 'Invoice Reference:', value: val.InvoiceCode },
      { label: 'Customer Name:', value: val.customerName },
      { label: 'Mobile:', value: val.CustomerMobile },
      { label: 'Branch:', value: val.Branch },
      { label: 'Attendant:', value: val.InvoicedBy },
      { label: 'Date:', value: moment(val.invoiceDate).format('YYYY-MM-DD') },
    ];
  
    const qrDataString = JSON.stringify(qrData, function (key, value) {
      if (value instanceof Object && !Array.isArray(value)) {
        
        return Object.keys(value).map((k) => `${k}: ${value[k]}`).join(', ');
      }
      return value;
    });
  
    const productNamesArray = val.names.split(',').map((name) => name.trim());
    const productNameCounts = {};
    productNamesArray.forEach((name) => {
      productNameCounts[name] = (productNameCounts[name] || 0) + 1;
    });
  
   
    const productNamesWithCount = Object.keys(productNameCounts).map((name) => ({
      name,
      count: productNameCounts[name],
    }));
  
    const handlePrint = () => {
  
      setTimeout(() => {
        window.print();
      }, 1000);
    };
  
   
    useEffect(() => {
      handlePrint();
    }, []);
  
  
    return (
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={openInvoice}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={openInvoice}>
          <Box sx={style}>
            <div>
               <h4 style={{textAlign:'center'}}>Sunset On The Rye : {val.Branch} Branch</h4>
              <span style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',borderTop:'1px solid grey',borderBottom:'1px solid black',padding:'5px',borderStyle:'dotted',borderRight:'none',borderLeft:'none'}}>
                <span>Invoice</span>
              </span>
            </div>
  
            <div style={{display:'flex',flexDirection:'column',paddingLeft:'0px'}}>
  
            <div style={{display:'flex',justifyContent:'space-between',paddingTop:'10px'}}>
              <span>Description</span> <span>Count</span>
            </div>
  
            <div style={{borderBottom:'1px solid grey',padding:"10px"}}>
            {productNamesWithCount.map((product) => (
              <div style={{display:'flex',justifyContent:'space-between'}} key={product.name}><span>{`${product.name}`}</span> <span>{`${product.count}`}</span></div>
            ))}
            </div>
       
            <div style={{display:'flex',justifyContent:'space-between',padding:'10px',borderBottom:'1px solid grey',fontWeight:'bold'}}>
              <span>Total</span> <span>{val.totalPayment.toLocaleString()}</span>
            </div>
  
            <div style={{display:'flex',justifyContent:'space-between',paddingTop:'30px',paddingBottom:'30px'}}>
  
            <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly'}}>
              <span>Invoice Number: {val.InvoiceCode}</span>
              <span>Attendant: {val.InvoicedBy}</span>
              <span>Date: {moment(val.invoiceDate).format('DD-MM-YYYY')}</span>
            </div>
            <div><QRCode value={qrDataString} /></div>
            </div>
           
            </div>
  
          </Box>
        </Fade>
      </Modal>
    );
  };
const Invoice = () => {
  return (
    <div>Invoice</div>
  )
}

export default Invoice