import React, { useEffect, useRef, useState } from 'react';
import './TabBar.scss';
import Navigation from '../../pages/NavOfficial/Navigation';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp,faFileExcel,faDownload,faBarcode } from '@fortawesome/free-solid-svg-icons'
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button'; 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import SwipeableViews from 'react-swipeable-views';
import Switch from '@mui/material/Switch';
import WidgetApp from '../../components/Widgets/WidgetApp';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PieChartComponent from './Charts/PieChartComponent ';
import AvailableProgress from './Charts/AvailableProgress';
import SoldProgress from './Charts/SoldProgress';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper', 
  border: '2px solid #fff',
  boxShadow: 24,
  p: 4,
  borderRadius:'10px'
};

const MyBarChart = ({ productsAnalytics }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={productsAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="TotalAdded" fill="green" />
        <Bar dataKey="TotalSold" fill="#063992" />
        <Bar dataKey="TotalAvailable" fill="orange" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const BranchPerformance = ({ branchPerformance }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={branchPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Branch" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="TotalAvailable" fill="orange" />
        <Bar dataKey="TotalSold" fill="#063992" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const TabBar = () => {

    const [open, setOpen] = React.useState(false);
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);
    const qrReaderRef = useRef(null);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
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


  {/* Analytics */}

  const [productsAnalytics, setProductsAnalytics] = useState([]);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [category,setCategory] = useState([]);
  const [stockShow,setStockShow] = useState([]);


  useEffect(() => {
    
    axios.get(process.env.REACT_APP_API_ADDRESS + 'api/groupAnalytics/stockshow')
      .then(response => {
        setStockShow(response.data);
      })
      .catch(error => {
        console.error('Error fetching product groups:', error);
      });
  }, []);

  useEffect(() => {
    
    axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/productanalysis')
      .then(response => {
        setProductsAnalytics(response.data);
      })
      .catch(error => {
        console.error('Error fetching product groups:', error);
      });
  }, []);

  useEffect(() => {
    
    axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/branchperformance')
      .then(response => {
        setBranchPerformance(response.data);
      })
      .catch(error => {
        console.error('Error fetching product groups:', error);
      });
  }, []);


  useEffect(() => {
    
    axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/categories')
      .then(response => {
        setCategory(response.data);
      })
      .catch(error => {
        console.error('Error fetching product groups:', error);
      });
  }, []);


  const history = useNavigate();

  const [ProductCategory, setProductCategory] = useState('');
  const [DiscountedAmount,setDiscountedAmount] = useState(0); 
  const [saleType,setSaleType] = useState("")
  const [saleCategory,setSaleCategory] = useState(''); 
  const [BuyingPrice,setBuyingPrice] = useState(0)
  const [ProductName, setProductName] = useState('');
  const [Quantity, setQuantity] = useState(0);
  const [SellingPrice, setPrice] = useState(0);
  const [amountMl,setAmountml] = useState('');
  const [Branch,setBranch] = useState('');
  const [file,setFile] = useState('')
  const [totalAmount, setTotalAmount] = useState(0);
  const [productDecsription,setProductDecsription] = useState('');

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedProductImageUrl, setSelectedProductImageUrl] = useState('');
  const [manualEntry, setManualEntry] = useState(false);



  const handleProductCategoryChange = (event) => {
    setProductCategory(event.target.value);
    };

  const handleProductDescription = (event) => {
    setProductDecsription(event.target.value);
    };

  const handleSaleCategory = (event) =>{
    setSaleCategory(event.target.value);
  }

  const handleBuyingPrice = (event) =>{
    setBuyingPrice(event.target.value);
  }

  const handleDiscountedAmount = (event) =>{
    setDiscountedAmount(event.target.value);
  }
  const handleSaleType = (event) =>{
    setSaleType(event.target.value);
  }

  useEffect(() => {
    // Fetch product names and image URLs from the server
    axios.get(process.env.REACT_APP_API_ADDRESS + '/api/Products')
      .then(response => {
        setAllProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };
  

  const handleQuantityChange = (event) => {
  setQuantity(Number(event.target.value));
  };

  const handlePriceChange = (event) => {
  setPrice(Number(event.target.value));
  };

  const handleAmountMl = (event) => {
      setAmountml(Number(event.target.value));
  };

  const handleBranch = (event) => {
      setBranch(event.target.value);
      };

 
 const handleSaleImage = (e) => {
          setFile(e.target.files[0]);
   };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const formData = new FormData();
  
      // Append product details to the FormData object
      formData.append('name', ProductName);
      formData.append('category', ProductCategory);
      formData.append('quantity', Quantity);
      formData.append('SellingPrice', SellingPrice);
      formData.append('amountMl', amountMl);
      formData.append('Branch', Branch);
      formData.append('saleCategory', saleCategory);
      formData.append('saleType', saleType);
      formData.append('BuyingPrice', BuyingPrice);
      formData.append('DiscountedAmount', DiscountedAmount);
      formData.append('productDecsription',productDecsription);
  
      // Append the image file to the FormData object
      formData.append('file', file);
  
      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + 'api/Products/addProduct',
        formData, // Send the FormData object
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the correct content type
          },
        }
      );
  
      const { totalAmount } = response.data;
      setTotalAmount(totalAmount);
      setProductName('');
      setProductCategory('');
      setQuantity(0);
      setPrice(0);
      setAmountml(0);
      setBranch('');
      setSaleCategory('');
      setSaleType('');
      setBuyingPrice(0);
      setDiscountedAmount(0);
      setFile('');
      setProductDecsription('');
  
      window.alert('Product added successfully');
      history.push('/index');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
        


  const [isSwitchedOn, setIsSwitchedOn] = useState(false);

  const handleSwitchToggle = () => {
    setIsSwitchedOn(!isSwitchedOn);
  };

 
  const handleScan = (data) => {
    if (data) {
      setBarcode(data);
      if (scanning) {
        qrReaderRef.current.pause();
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning barcode:', error);
  };

  const startScanning = () => {
    setScanning(true);
    qrReaderRef.current && qrReaderRef.current.openImageDialog();
  };

  const stopScanning = () => {
    setScanning(false);
    qrReaderRef.current && qrReaderRef.current.pause();
  };

  const toggleScanning = () => {
    if (scanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };


  const [openCustomer, setOpenCustomer] = React.useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);


  {/* Adding a category */}

  const [cat_name,setCat_name] = useState('');
  const [description,setDescription] = useState('');

  const SubmitCategory = () =>{
    axios.post(process.env.REACT_APP_API_ADDRESS + 'api/Products/category', 
    {cat_name:cat_name,description:description,
  }).then(() => {
    
  });
  alert("Category added")
  setTimeout(() => history('/stocksetup'),700);
  };

  const [data, setData] = useState([]); 

  const loadData = async () => {
    const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "api/analytics/branches");
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
    <div className="TabBar">
      <div className="TabButtons">
        <button
          className={activeTabIndex === 0 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(0)}
        >
          Add Stock
        </button>
        <button
          className={activeTabIndex === 1 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(1)}
        >
          All
        </button>
        <button
          className={activeTabIndex === 2 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(2)}
        >
          Analytics
        </button>
      </div>

      <SwipeableViews
              index={activeTabIndex}
              onChangeIndex={handleTabChange}
              enableMouseEvents
      >
      <div className="TabContent">  
        <div className='AddStock'>
        
            <div className='MessageBar'>
                <span>Add your stock for the first time by filling the relevant inputs provided below</span>
            </div>

            <div className='FormSection'>


              <div className='ButtonCat'>

                <button onClick={handleOpenCustomer}>Add Category</button>

                <div className='saleCategory'>
                  <select 
                    id='saleCategory'
                    name='saleCategory'
                    value={saleCategory || ""}
                    onChange={handleSaleCategory}
                  >
                    <option>Select type...</option>
                    <option>Full sale</option>
                    <option>Tot sale</option>
                    <option>Part sales</option>
                  </select>
                </div>

                <div className='ProductImages'>
                  <input 
                    type="file" 
                    onChange={handleSaleImage} 
                    class="block w-full text-sm text-gray-900 border border-dotted border-gray-800 
                    rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none 
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                    aria-describedby="user_avatar_help" 
                    id="user_avatar"
                    placeholder='Product image'
                  />
                </div>
                
                <Modal
                      open={openCustomer}
                      onClose={handleCloseCustomer}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      
                    >
                      <Box sx={style}>
                        
                        <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{
                          display:'flex',
                          flexDirection:'column',
                          justifyContent:'center',
                          gap:'10px'
                        }}>
                            <div style={{
                              display:'flex',
                              flexDirection:'column',
                              gap:'5px'
                            }}>
                              <label htmlFor='customerName'> Enter Category </label>
                              <input 
                                style={{
                                  border:'1px solid grey',
                                  outlineColor:'grey',
                                  height:'2.0rem',
                                  borderRadius:'5px',
                                  paddingLeft:'10px',
                                  paddingRight:'10px'
                                }}
                                placeholder='beer,vodka...'
                                value={cat_name}
                                onChange={(e) =>{
                                  setCat_name(e.target.value);
                                  }}
                              />
                            </div>

                            <div style={{
                              display:'flex',
                              flexDirection:'column',
                              gap:'5px'
                            }}>
                              <label htmlFor='customerName'> Category description </label>
                              <textarea 
                                style={{
                                  border:'1px solid grey',
                                  outlineColor:'grey',
                                  borderRadius:'5px',
                                  paddingLeft:'10px',
                                  paddingRight:'10px',
                                  paddingTop:'10px'
                                }}
                                rows={4}
                                value={description}
                                onChange={(e) =>{
                                  setDescription(e.target.value);
                                  }}
                              />
                            </div>

                            <div style={{
                              display:'flex',
                              justifyContent:'center'
                            }}>
                              <button style={{
                                backgroundColor:'rgb(2, 199, 77)',
                                border:'none',
                                outline:'none',
                                padding:'10px 10px',
                                borderRadius:'10px',
                                color:'white',
                                cursor:'pointer',
                                fontSize:'bold'
                              }} onClick={SubmitCategory}> Submit Category </button>
                            </div>
      
                        </Typography>
                      </Box> 
                </Modal>


              </div>

                <div className='PartOneEntry'>

                    <div className='EntryProd'>
                      <label htmlFor='ProductName'>Product Name</label>
                      <input 
                          id='ProductName'
                          name='ProductName'
                          placeholder='Tusker etc'
                          value={ProductName || " "}
                          onChange={handleProductNameChange}
                      />
                    </div>

                    <div className='EntryProd'>
                      <label htmlFor='ProductCategory'>Product Category</label>
                      <select
                      id="ProductCategory"
                      name="ProductCategory" 
                      value={ProductCategory}
                      onChange={handleProductCategoryChange}
                      >
                        <option value="">Select...</option>
                            {category.map((val) =>{
                                return(
                                    <option>{val.cat_name}</option>
                                )
                            })}
                      </select>
                    </div>

                    <div className='EntryProd'>
                      <label htmlFor='Branch'>Distribute to Branch</label>
                      <select
                          name='Branch'
                          id='Branch'
                          value={Branch || " "}
                          onChange={handleBranch}
                      >
                      <option>Select...</option>
                      {data.map((val) =>{
                          return(
                              <option>{val.BranchName}</option>
                          )
                      })}
                      </select>
                    </div>

                </div>

                <div className='PartTwoInputs'>
                 
                    
                    <div className='Inputs'>
                    <label htmlFor='Quantity'>Number of Items / Packets</label>
                    <input 
                        type="number"
                        id='Quantity'
                        name='Quantity'
                        min="1"
                        value={Quantity || " "}
                        onChange={handleQuantityChange}
                    />
                </div>

                
                <div className='Inputs'>
                    <label htmlFor='amountMl'>Amout on Bottle (ML)</label>
                    <input 
                        type="number"
                        min="1"
                        id='amountMl'
                        name='amountMl'
                        value={amountMl || " "}
                        onChange={handleAmountMl}
                    />
                </div>

                <div className='Inputs'>
                  <label htmlFor='BuyingPrice'>Buying Price</label>
                  <input 
                      type="number"
                      min="0"
                      id='BuyingPrice'
                      name='BuyingPrice'
                      value={BuyingPrice || ""}
                      onChange={handleBuyingPrice}
                  />
                </div>
                
                </div>

                <div className='PartTwoInputs'>
                    <div className='Inputs'>
                        <label htmlFor='saleType'>Sale Type</label>
                        <select
                            name='saleType'
                            id='saleType'
                            value={saleType || ""}
                            onChange={handleSaleType}
                        >
                            <option>Select..</option>
                            <option>Retail</option>
                            <option>Wholesale</option>
                            <option>Discounted</option>
                        </select>
                    </div>

                    <div className='Inputs'>
                        <label htmlFor='SellingPrice'>Selling Price</label>
                        <input 
                            type="number"
                            id='SellingPrice'
                            name='PriSellingPricece'
                            min="0"
                            value={SellingPrice || " "}
                            onChange={handlePriceChange}
                        />
                    </div>

                    <div className='Inputs'>
                        <label htmlFor='DiscountedAmount'>Discount (if any)</label>
                        <input 
                            name='DiscountedAmount'
                            id='DiscountedAmount'
                            value={DiscountedAmount || ""}
                            onChange={handleDiscountedAmount}
                        />
                    </div>

                </div>

                <div className='PartThreeInputs'>

                    
                    
                    

                    {/** 
                    <div className='inputs'>
                    <label htmlFor="productDecsription" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your message
                    </label>
                    <textarea
                      name='productDecsription'
                      id="productDecsription"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Leave a comment..."
                      value={productDecsription}
                      onChange={handleProductDescription}
                    ></textarea>
                  </div>
                  */}

                </div>

            </div>
            <div>
                <div className='bottomSec'>
                    <span>
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                    <button onClick={handleClickOpen}>Import Products</button>
                        <div>
                        <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                      >
                       
                        <DialogContent style={{backgroundColor:'#e0f3f8d8'}}>
                          <DialogContentText id="alert-dialog-slide-description">
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <div>
                                        <h3 style={{textAlign:'center'}}>Select Source</h3>
                                    </div>
                                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:'15px'}}>
                                        <button style={{
                                            backgroundColor:'transparent',
                                            border:'2px solid grey',
                                            borderRadius:'15px',
                                            padding:'15px 25px',
                                            cursor:'pointer'
                                        }}><FontAwesomeIcon icon={faFileExcel} /> From Excel work file</button>
                                        <button style={{
                                            backgroundColor:'transparent',
                                            border:'2px solid grey',
                                            borderRadius:'15px',
                                            padding:'15px 25px',
                                            cursor:'pointer'
                                        }}><FontAwesomeIcon icon={faDownload} /> Transfer from another shop</button>
                                    </div>
                                    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',marginTop:'10px'}}>
                                        <span>Importing from excel?</span>
                                        <p style={{textAlign:'center'}}>Columns should be named in lower case as (productname,productcategory..)</p>
                                    </div>
                                </div>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions style={{backgroundColor:'#e0f3f8d8'}}>
                          <Button onClick={handleClose}>close</Button>
                        </DialogActions>
                      </Dialog>
                        </div>
                    </span>
                    <button onClick={handleSubmit}>Save Product</button>
                </div>
            </div>
        </div>
        </div>

        <div className="TabContent">
              <div className='AllItems'>

              {/** 
                  <div className='ItemOne'>
                      <span>View By Category</span>
                      <span>
                          <Switch {...label} 
                          checked={isSwitchedOn}
                          onChange={handleSwitchToggle}
                          />
                      </span>
                  </div> 
              */}  

                   {stockShow.map((val) =>{
                    return(
                      <div className='ItemOne'>
                        <span>All items</span>
                        <span>{val.totalProducts}</span>
                      </div> 
                    )
                   })}
                  
                   {stockShow.map((val) =>{
                    return(
                      <div className='ItemOne'>
                        <span>Stock value</span>
                        <span>{val.stockvalue}</span>
                      </div>   
                    )
                   })}

                   {stockShow.map((val) =>{
                    return(
                      <div className='ItemOne'>
                        <span>Available items</span>
                        <span>{val.availableProducts}</span>
                      </div>
                    )
                   })}

                   {stockShow.map((val) =>{
                    return(
                      <div className='ItemOne'>
                        <span>Sold items</span>
                        <span>{val.soldProducts}</span>
                      </div>
                    )
                   })}

                   {stockShow.map((val) =>{
                    return(
                      <div className='ItemOne'>
                        <span>Profit estimate</span>
                        <span>{val.profitestimate}</span>
                      </div>
                    )
                   })}
 
                  <div className='ItemOne'>
                      <span>Stock Transfer</span>
                      <button>Transfer</button>
                  </div> 
 
                  <div>
                  <PieChartComponent />
                  <AvailableProgress />
                  <SoldProgress />
                  </div>
                  
                  {isSwitchedOn && 
                    <div>
                      <h4 style={{textAlign:'left',fontWeight:'normal'}}>Categories</h4>
                      <WidgetApp />
                    </div>
                  }
              </div>
        </div>

        <div className="TabContent">
              
                 <MyBarChart productsAnalytics={productsAnalytics} />
                 <BranchPerformance branchPerformance={branchPerformance}/>
        </div>

      
      </SwipeableViews>
    </div>
    </div>
    </div>
    </div>
  );
};

export default TabBar;
