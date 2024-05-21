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
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import './ProductSales.scss'
import './SalesProducts.scss'
import './Topstyle.scss'
import './ProductChecout.scss'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ToastStyle.scss'
import Discounted from './Discounted';

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
    window.print();
  };
  
  useEffect(() => {
    if (open) {
      // Use setTimeout to ensure the modal content is loaded before printing
      setTimeout(() => {
        handlePrint();
      }, 1000);
    }
  }, [open]);


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




const ProductList = () => {
  const {id} = useParams();
  const [cart, setCart] = useState({});
  const [paymentAmount, setPaymentAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Mpesa');
  const [mpesa, setMpesa] = useState('');
  const [cash, setCash] = useState('');
  const [card, setCard] = useState('');
  const [query, setQuery] = useState(""); 
  const [customerName,setCustomerName] = useState('');
  const [customerMobile,setCustomerMobile] = useState('');
  const [Amount,setAmount] = useState('');
  const [queryArchive, setQueryArchive] = useState('');
  
  const [open, setOpen] = React.useState(false);
  const [openCart, setOpenCart] = React.useState(false);

  const [openInvoice, setOpenInvoice] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);
  const handleOpenPayment = () => setOpenPayment(true);
  const handleClosePayment = () => setOpenPayment(false);
 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [archivedData, setArchivedData] = useState([]);
  const [showInvoicedProducts, setShowInvoicedProducts] = useState(false);

  const [selectedMpesaSale, setSelectedMpesaSale] = useState(null);

  const handleOpenModal = (mpesaSale) => {
    setSelectedMpesaSale(mpesaSale);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMpesaSale(null);
    setOpen(false);
  };




  const calculateTotalPayment = () => {
    let total = 0;
    Object.values(cart).forEach(({ price, quantity }) => {
      total += price * quantity;
    });
    return total;
  };

  const [totalPayment, setTotalPayment] = [calculateTotalPayment()];



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [MpesaPayments,setMpesaPayments] = useState([]);

  const [queryMpesa, setQueryMpesa] = useState('');
 
 // Function to fetch Mpesa payments and handle adding a new sale
const fetchDataAndAddMpesaSale = async () => {
  try {
    // Fetch the Mpesa payments
    const mpesaResponse = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/mpesasales?q=${queryMpesa}`);
    
    // Extract the latest Mpesa sale data from the response (assuming the response is sorted by date)
    const latestMpesaSale = mpesaResponse.data[0]; // Adjust this based on your API response structure
    
    // If there's new Mpesa sale data, add it to the state
    if (latestMpesaSale) {
      handleAddMpesaSale(latestMpesaSale);
      
      // Trigger the receipt modal to open
      handlePrintLatestReceipt();
    }
    
    // Update the Mpesa payments state
    setMpesaPayments(mpesaResponse.data);

    // Fetch and update Cash and Card payments as needed...
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Use useEffect to fetch data and add Mpesa sale when the component mounts or when queries change
useEffect(() => {
  fetchDataAndAddMpesaSale();
}, [queryMpesa]);

// Your handleAddMpesaSale and handlePrintLatestReceipt functions...





  const [latestMpesaSale, setLatestMpesaSale] = useState(null);

  const handleAddMpesaSale = (newMpesaSale) => {
    setMpesaPayments([...MpesaPayments, newMpesaSale]);
    setLatestMpesaSale(newMpesaSale); // Set the latest sale
  };
  const handlePrintLatestReceipt = () => {
    if (latestMpesaSale) {
      setSelectedMpesaSale(latestMpesaSale);
      setOpen(true);
      
     
    }
  };
  useEffect(() => {
    handlePrintLatestReceipt();
  }, [latestMpesaSale]);


  const { user } = useContext(AuthContext);

  const SoldBy = user?.fullname;

  const ArchivedBy = user?.fullname;

  const Branch = user?.Branch;



  const handleClickOpenCart = () => {
    setOpenCart(true);
  };

  const handleCloseCart = () => {
    setOpenCart(false);
  };



  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/archive/${Branch}?q=${queryArchive}`)
      .then(response => {
        setArchivedData(response.data);
      })
      .catch(error => {
        console.error('Error fetching branch analytics:', error);
      });
  }, [Branch,queryArchive]);

  
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try { 
        const response = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `/api/analytics/available/${Branch}?q=${query}`
        );
        const groupedProducts = response.data.reduce((grouped, product) => {
          const key = `${product.name}_${product.amountMl}`;
          if (!grouped[key]) {
            grouped[key] = { ...product, count: 1, quantity: 0, serialNumbers: [product.serialNumber] };
          } else {
            grouped[key].count++;
            grouped[key].serialNumbers.push(product.serialNumber);
          }
          return grouped;
        }, {});
        setCart(groupedProducts);
        setLoading(false);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching available products:', error);
        setErrorMessage('Error fetching available products. Please try again later.');
        setLoading(false);
      }
    };
    

    fetchAvailableProducts();
  }, [query,Branch]);

 

  const handleProductQuantityChange = (productName, amountMl, quantity) => {
    const productKey = `${productName}_${amountMl}`;
    const availableCount = cart[productKey]?.count || 0;
    
    let message = '';

    if (quantity > availableCount) {
      message = `Only ${availableCount} ${productName} available. Quantity not updated.`;
      
      // Display the error toast for exceeding available quantity
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'quantity-change-toast',
      });
      
      return;
    } else {
      const currentQuantity = cart[productKey]?.quantity || 0;
      const addedQuantity = quantity - currentQuantity;

      if (addedQuantity > 0) {
        message = `${addedQuantity} ${productName}, ${amountMl} ml added to cart successfully.`;
      }

      setCart((prevCart) => {
        const updatedProduct = {
          ...prevCart[productKey],
          quantity,
          selectedQuantity: quantity,
        };
        return {
          ...prevCart,
          [productKey]: updatedProduct,
        };
      });
    }

    if (message) {
      toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'quantity-change-toast',
      });
    }

    setErrorMessage2('');
  };
  
  
  

  const handleQuantityIncrease = (productName, amountMl) => {
    const availableCount = cart[`${productName}_${amountMl}`]?.count || 0;
    setCart((prevCart) => {
      const key = `${productName}_${amountMl}`;
      const currentQuantity = prevCart[key]?.quantity || 0;
      if (currentQuantity < availableCount) {
        const updatedCart = {
          ...prevCart,
          [key]: { ...prevCart[key], quantity: currentQuantity + 1 },
        }; 
        
      
        toast.success(`${currentQuantity + 1} ${productName}, ${amountMl} ml added to cart successfully `, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
  
        return updatedCart;
      } else {
        setErrorMessage2(`Maximum of ${availableCount} for ${productName} - ${amountMl} ml.`);
        return prevCart;
      }
    });
  };

  const handleQuantityDecrease = (productName, amountMl) => {
    setCart((prevCart) => {
      const key = `${productName}_${amountMl}`;
      const currentQuantity = prevCart[key]?.quantity || 0;
      
      // Decrease the quantity, ensuring it doesn't go below zero
      const updatedQuantity = Math.max(0, currentQuantity - 1);
  
      // If the quantity becomes zero, trigger a success toast notification
      if (updatedQuantity === 0) {
        toast.warning(`${productName} - ${amountMl} ml: Product removed from cart.`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false, 
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
  
      return {
        ...prevCart,
        [key]: { ...prevCart[key], quantity: updatedQuantity },
      };
    });
  };

  const handleSellButtonClick = () => {
    const selectedProducts = Object.values(cart).filter(({ quantity }) => quantity > 0);
  
    if (selectedProducts.length === 0) {
      // No products selected for selling
      setErrorMessage('Please select at least one product to sell.');
      setSuccessMessage('');
      return;
    }
  
    // Check if each selected product has the required properties
    const hasRequiredProperties = selectedProducts.every(
      (product) => 'price' in product && 'amountMl' in product && 'name' in product
    );
  
    if (!hasRequiredProperties) {
      setErrorMessage('Selected products are missing required properties.');
      setSuccessMessage('');
      return;
    }
  
    // Create an array of products to sell, each with its own serial number
    const productsToSell = [];
    selectedProducts.forEach((product) => {
      const { quantity, serialNumbers } = product;
      serialNumbers.slice(0, quantity).forEach((serialNumber) => {
        productsToSell.push({
          name: product.name,
          amountMl: product.amountMl, 
          price: product.price,
          serialNumber: serialNumber,
        });
      });
    });
  
    axios
      .put(process.env.REACT_APP_API_ADDRESS + '/api/ProductSales/SellProducts', {
        mpesa: parseFloat(mpesa),
        cash: parseFloat(cash),
        card: parseFloat(card),
        productsToSell: productsToSell,
        SoldBy:SoldBy,
        Branch:Branch,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.errorMessage) {
          setErrorMessage(response.data.errorMessage);
          setSuccessMessage('');
        } else {
          setErrorMessage('');
          setSuccessMessage(response.data.message);

          toast.success('Sale made successfully', {
            autoClose: 2000,
            onClose: () => {
              window.location.reload();
            },
          });
        }
      })
      .catch((error) => {
        console.error('Error selling products:', error);
        setErrorMessage('An error occurred while selling products.');
        setSuccessMessage('');
      });
  };
  
  
  
  const handleArchiveProducts = () => {
    const selectedProducts = Object.values(cart).filter(({ quantity }) => quantity > 0);
  
    if (selectedProducts.length === 0) {
   
      setErrorMessage('Please select at least one product to archive.');
      setSuccessMessage('');
      return;
    }
  
   
    const hasRequiredProperties = selectedProducts.every(
      (product) => 'price' in product && 'amountMl' in product && 'name' in product
    );
  
    if (!hasRequiredProperties) {
      setErrorMessage('Selected products are missing required properties.');
      setSuccessMessage('');
      return;
    }
  
 
    const productsToArchive = [];
    selectedProducts.forEach((product) => {
      const { quantity, serialNumbers } = product;
      serialNumbers.slice(0, quantity).forEach((serialNumber) => {
        productsToArchive.push({
          name: product.name,
          amountMl: product.amountMl,
          price: product.price,
          serialNumber: serialNumber,
        });
      });
    });
  
 
    axios
      .put(process.env.REACT_APP_API_ADDRESS + '/api/ProductSales/archiveproducts', {
        productsToArchive: productsToArchive,
        ArchivedBy: ArchivedBy, 
        Branch: Branch,
        customerName: customerName,
        customerMobile: customerMobile,
        totalPayment:totalPayment,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.errorMessage) {
          setErrorMessage(response.data.errorMessage);
          setSuccessMessage('');
        } else {
          setErrorMessage('');
          setSuccessMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error archiving products:', error);
        setErrorMessage('An error occurred while archiving products.');
        setSuccessMessage('');
      });
  };
  
  




  if (loading) {
    return <div>Loading...</div>;
  }

  

  const hasSelectedProducts = () => {
    return Object.values(cart).some(({ quantity }) => quantity > 0);
  };


 

  return (
    <div>
      <div>
        <Discounted />
      </div>

    {/* Search Button */}

    <div className='TopSalesPart'>

      <div className='SearchPart'>
        <div className='Search'>
          <input 
          placeholder='Search'
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
        </div>
      </div>

      <div className='CartSide'>

      <div className='cart-icon-container'>
            <button onClick={handleClickOpenCart}><AddShoppingCartIcon /></button>
            <div className='cart-count'> 
            {hasSelectedProducts() && (
              <span>
                {Object.values(cart)
                  .filter(({ quantity }) => quantity > 0)
                  .reduce((total, { quantity }) => total + quantity, 0)}
              </span>
            )}</div>
      </div>

     
      <div className='InvoiceButton'>
            <button   onClick={() => setShowInvoicedProducts(!showInvoicedProducts)}>Receipt</button>
            
      </div>

      </div>

    </div>

      {/* Products show */}
      <div className='SalesDiv'>
      {Object.values(cart).map(({ name, amountMl, count, quantity,category,Branch,price,imageUrl }) => (

        <div className='item-container' key={`${name}_${amountMl}`}>
          <div  className='item'> 

          <span>
            <div className="flex justify-center">
              <img 
              src={imageUrl} 
              alt={name} 
              className="w-35 h-40"
              />
            </div>
            <button>{Branch}</button>
            <small>{name}</small> 
            <small>{category} - {amountMl} ml</small>
            <small style={{fontWeight:'bold'}}>Kshs {price}</small>
             <small>{count >= 1 && ` ${count} left`}</small>
          </span>
      <div className='Controls'>
        <div className='quantity-controls'>
          <button onClick={() => handleQuantityDecrease(name, amountMl)}>-</button>
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => handleProductQuantityChange(name, amountMl, parseInt(e.target.value))}
            style={{width:'50px',display:'flex',justifyContent:'center',alignContent:'center',border:'1px solid gray',borderRadius:'10px',paddingLeft:'10%',outline:'none'}}
          />
          <button onClick={() => handleQuantityIncrease(name, amountMl)} disabled={quantity >= count}>+</button>
        </div>
        </div>

        </div>

          {errorMessage2 && errorMessage2.includes(`${name} - ${amountMl} ml`) && (
            <div style={{ color: 'red',fontWeight:'bold',fontSize:'12px' }}>{errorMessage2}</div>
          )}

        </div>
      ))}
    </div>
  
    {/* Product Checkout */}
      <Dialog
      open={openCart}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseCart}
      aria-describedby="alert-dialog-slide-description"
      style={{width:'auto'}}
     
  >
      <DialogTitle style={{backgroundColor:"#1e1e2c",color:"white",
                          display:'flex',justifyContent:'flex-start',alignItems:'flex-start'}}>
          Cart
      </DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">

          {hasSelectedProducts() && (
            <div className='ProductChecout'>

              <h2>Products summary</h2>

              <div className='ProductListings'>
              {Object.values(cart)
                .filter(({ quantity }) => quantity > 0)
                .map(({ name, amountMl,quantity,price }) => {
                  return (
                    <div key={`${name}_${amountMl}`} className='ProductItem'>
                    <div className='SellImage'>
                     
                    </div>
                    <div className='SaleDetails'>
                      <span>
                        Name:{name} ({amountMl} ml) 
                      </span>
                      <span style={{fontWeight:'bold'}}>Kshs {price} ( {quantity} )</span>
                     
                      </div>
                    </div>
                  );
              })}

              <div className='ProductTotal'>
              <button onClick={handleOpenPayment}>
              <span>Checkout </span>
              <span>(KSH {calculateTotalPayment().toLocaleString()})</span>
              </button> 
              </div>

              </div>
            
              
            </div>
          )}

          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <button onClick={handleCloseCart} style={{
            border:'none',outline:'none',color:'black',padding:'5px 10px',borderRadius:'10px'
          }}>Proceed to Add/Remove</button>
      </DialogActions>
  </Dialog>
      

      
    <div>
      <Modal
      open={openPayment}
      onClose={handleClosePayment}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{width:'auto'}}
    >
      <Box sx={style}>
        
        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          gap:'10px'
        }}>

        <div>
        <h4>Total Amount Required: KES {calculateTotalPayment().toLocaleString()}.00</h4>
        </div>
        <div>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}     style={{
          border:'1px solid grey',
          outlineColor:'grey',
          height:'2.0rem',
          borderRadius:'5px',
          paddingLeft:'10px',
          paddingRight:'10px',
          width:'100%'
        }}>
          <option value="Mpesa">Mpesa</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Invoice">Pay Later</option>
        </select>
      </div>

      {paymentMethod === 'Invoice' && (
        <div>
          <div style={{
            display:'flex',
            flexDirection:'column',
            gap:'5px'
          }}>
            <label htmlFor='customerName'>Customer Name</label>
            <input 
            style={{
              border:'1px solid grey',
              outlineColor:'grey',
              height:'1.7rem',
              borderRadius:'5px',
              paddingLeft:'10px',
              paddingRight:'10px'
            }}
            name='customerName'
            id='customerName'
            onChange={(e) => setCustomerName(e.target.value)}
          />
          </div>

          <div style={{
            display:'flex',
            flexDirection:'column',
            gap:'5px'
            
          }}>
            <label htmlFor='CustomerMobile'>Customer Number</label>
            <input 
            style={{
              border:'1px solid grey',
              outlineColor:'grey',
              height:'1.7rem',
              borderRadius:'5px',
              paddingLeft:'10px',
              paddingRight:'10px'
            }}
            name='CustomerMobile'
            id='CustomerMobile'
            onChange={(e) => setCustomerMobile(e.target.value)}
          />
          </div>
          <div style={{
            display:'flex',
            flexDirection:'column',
            gap:'5px'
            
          }}>
            <label htmlFor='Amount'>Amount to Pay</label>
            <input 
            style={{
              border:'1px solid grey',
              outlineColor:'grey',
              height:'1.7rem',
              borderRadius:'5px',
              paddingLeft:'10px',
              paddingRight:'10px'
            }}
            name='Amount'
            id='Amount'
            value={totalPayment}
            onChange={(e) => setTotalPayment(e.target.value)}
          />
          </div>

        </div>
      )}

      {paymentMethod === 'Mpesa' && (
      <div>
      <div style={{
        display:'flex',
        flexDirection:'column',
        gap:'5px'
      }}>

        <label htmlFor='Mpesa'> Mpesa Amount </label>
        <input 
          style={{
            border:'1px solid grey',
            outlineColor:'grey',
            height:'1.7rem',
            borderRadius:'5px',
            paddingLeft:'10px',
            paddingRight:'10px'
          }}
          name='Mpesa'
          id='Mpesa'
          type="number" min="0" value={mpesa} onChange={(e) => setMpesa(e.target.value)}
        />
      </div>

      <div style={{
        display:'none',
        flexDirection:'column',
        gap:'5px'
      }}>

        <label htmlFor='customerName'> Customer Name </label>
        <input 
          style={{
            border:'1px solid grey',
            outlineColor:'grey',
            height:'1.7rem',
            borderRadius:'5px',
            paddingLeft:'10px',
            paddingRight:'10px'
          }}
        />
      </div>
      <div style={{
        display:'none',
        flexDirection:'column',
        gap:'5px'
      }}>

        <label htmlFor='customerName'> Customer Number </label>
        <input 
          style={{
            border:'1px solid grey',
            outlineColor:'grey',
            height:'1.7rem',
            borderRadius:'5px',
            paddingLeft:'10px',
            paddingRight:'10px'
          }}
        />
      </div>

      <div style={{display:'flex',justifyContent:'center',alignContent:'center',paddingTop:'10px'}}>
          <button style={{
            backgroundColor:'#10c458',color:'white',border:'none',outline:'none',padding:'5px 10px',borderRadius:'10px',cursor:'pointer'
          }}>Pay Via Mpesa</button>
      </div>

      </div>
      )}
          

      {paymentMethod === 'Cash' && (
            <div style={{
              display:'flex',
              flexDirection:'column',
              gap:'5px'
            }}>
              <label htmlFor='Cash' style={{borderBottom:'10px'}}>Cash Payment</label>
              <input 
                style={{
                  border:'1px solid grey',
                  outlineColor:'grey',
                  height:'1.7rem',
                  borderRadius:'5px',
                  paddingLeft:'10px',
                  paddingRight:'10px'
                }}
                id='Cash' name='Cash' type="number" min="0" value={cash} onChange={(e) => setCash(e.target.value)}
              />
            </div>
      )}
      {paymentMethod === 'Card' && (    
            <div style={{
              display:'flex',
              flexDirection:'column',
              gap:'5px'
            }}>
              <label htmlFor='Card'> Card Payment </label>
              <input 
                style={{
                  border:'1px solid grey',
                  outlineColor:'grey',
                  height:'1.7rem',
                  borderRadius:'5px',
                  paddingLeft:'10px',
                  paddingRight:'10px'
                }}
                name='Card' id='Card' type="number" min="0" value={card} onChange={(e) => setCard(e.target.value)}
              />
            </div>
            )}

            {paymentMethod === 'Invoice' && (
              <div>
                {/* ... Invoice input fields ... */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button style={{
                    backgroundColor:'orangered',
                    color:'white',
                    border:'none',
                    outline:'none',
                    borderRadius:'5px',
                    padding:'10px 20px',
                    fontWeight:'bold',
                    cursor:'pointer'
                  }} onClick={handleArchiveProducts}>Invoice Products</button>
                </div>
              </div>
            )}
          
            {paymentMethod !== 'Invoice' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <button style={{
                    backgroundColor: 'green',
                    border: 'none',
                    outline: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer'
                  }} onClick={handleSellButtonClick}>Submit Sale</button>
                </div>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'center',alignContent:'center'}}>
            {errorMessage && <div style={{ color: 'red',fontSize:'12px' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green',fontSize:'12px' }}>{successMessage}</div>}
            </div>
        </Typography>
      </Box>
    </Modal>
      </div>
      <div style={{display:'none'}}>
      {showInvoicedProducts && (
      <div style={{marginTop:'20px'}}>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{display:'flex',justifyContent:'flex-start'}}>
      <input 
        style={{
          padding:'7px',
          border:'1px solid grey',
          outline:'none',
          borderRadius:'6px',
          fontWeight:'bold'
        }}
        type='search'
        placeholder='Search..'
        onChange={(e) => setQueryMpesa(e.target.value.toLowerCase())}
      />
    </div>
          <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Mpesa</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Receipt</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {MpesaPayments
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((mpesaSales, index) => {
                              return (
                                  <TableRow key={mpesaSales.id}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>{mpesaSales.mpesa}</TableCell>
                                      <TableCell>{moment(mpesaSales.actionDate).format('YYYY-MM-DD')}</TableCell>
                                      <TableCell> <button onClick={() => handleOpenModal(mpesaSales)} style={{ border: 'none', outline: 'none',cursor:'pointer',color:'green' }}>
                                      Receipt
                                      </button></TableCell>
                                  </TableRow>
                              );
                          })}
                  </TableBody>
              </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
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
  </div>
  )}
  </div>
    
    </div>
  );
};

export default ProductList;
