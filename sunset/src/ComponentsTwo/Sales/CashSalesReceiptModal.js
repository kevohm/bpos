import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useSpring, animated } from '@react-spring/web';
import moment from 'moment';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import QRCode from 'qrcode.react';


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
const CashSalesReceiptModal = ({ cashSale, open, onClose }) => {
  // Add any additional data you want to display in the modal here
  const receiptData = [
    { label: 'Sale Code:', value: cashSale.paymentCode },
    { label: 'Amount:', value: cashSale.cash },
    { label: 'Transaction Date:', value: moment(cashSale.actionDate).format('YYYY-MM-DD') },
    // Add more data fields as needed
  ];

  // Convert receipt data to a string for QR code or display
  const receiptDataString = JSON.stringify(receiptData, function (key, value) {
    if (value instanceof Object && !Array.isArray(value)) {
      return Object.keys(value).map((k) => `${k}: ${value[k]}`).join(', ');
    }
    return value;
  });

  const productNamesArray = cashSale.names.split(',').map((name) => name.trim());
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
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  useEffect(() => {
    handlePrint();
  }, []);

  return (
    <Modal
      aria-labelledby="cash-sales-modal-title"
      aria-describedby="cash-sales-modal-description"
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
     
       <h4 style={{textAlign:'center',fontSize:'48px',fontWeight:'bold'}}>Sunset On The Rye : {cashSale.Branch} Branch</h4>
      <span style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',
      borderTop:'1px solid grey',borderBottom:'1px solid black',
      padding:'5px',borderStyle:'dotted',borderRight:'none',borderLeft:'none',fontWeight:'bold',fontSize:'32px'}}>
        <span>Cash sale receipt</span>
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
      <span>Total</span> <span>{cashSale.cash}</span>
    </div>

    <div style={{display:'flex',justifyContent:'space-between',paddingTop:'30px',paddingBottom:'30px'}}>

    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-evenly',fontSize:'32px',fontWeight:'bold'}}>
  
      <span>Sale Id: {cashSale.paymentCode}</span>
      <span>Attendant: {cashSale.SoldBy}</span>
      <span>Date: {moment(cashSale.actionDate).format('DD-MM-YYYY')}</span>
    </div>
    <div style={{fontWeight:'bold'}}><QRCode value={receiptDataString} /></div>
    </div>
   
    </div>

  </Box>
      </Fade>
    </Modal>
  );
};

CashSalesReceiptModal.propTypes = {
  cashSale: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CashSalesReceiptModal;
