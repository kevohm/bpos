import React, { useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import './AddProductForm.scss'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) { 
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper', 
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
    borderRadius:'10px'
  };

const StocAdditionMainDialog = ({ open, handleClose }) => { 

  const isNarrowScreen = useMediaQuery('(max-width: 768px)');
  const imagePreviewRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openCustomer, setOpenCustomer] = React.useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const history = useNavigate();
  const fetchCancelToken = useRef(null);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [file,setFile] = useState('');
  const [key, setKey] = useState(0); 
  const [ProductName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amountMl,setAmountml] = useState('');
  const [Quantity, setQuantity] = useState(0);
  const [BuyingPrice,setBuyingPrice] = useState(0)
  const [SellingPrice, setPrice] = useState(0);
  const [DiscountedAmount,setDiscountedAmount] = useState(0); 
  const [Branch,setBranch] = useState('');

  const handleProductCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    };

  const handleBuyingPrice = (event) =>{
    setBuyingPrice(event.target.value);
  }

  const handleDiscountedAmount = (event) =>{
    setDiscountedAmount(event.target.value);
  }

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

  const handleCloseCustomer = () => {
    setOpenCustomer(false);
    setKey((prevKey) => prevKey + 1); // Increment the key to force a re-render
  };


  useEffect(() => {
    if (!initialFetchComplete) {
      fetchCategories();
    }
  }, [initialFetchComplete]);
  
  {/* Adding a category */}
  const [cat_name,setCat_name] = useState('');
  const [description,setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    fetchCancelToken.current = axios.CancelToken.source();

    try {
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS + 'api/analytics/categories', {
        cancelToken: fetchCancelToken.current.token,
      });

      setCategories(response.data);
      setInitialFetchComplete(true);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openCustomer) {
      // Debounce the fetch function to avoid multiple rapid requests
      const debounceFetch = setTimeout(() => {
        fetchCategories();
      }, 300);

      return () => clearTimeout(debounceFetch); // Cleanup debounce on unmount or re-render
    }
  }, [openCustomer]);

  const SubmitCategory = () => {
    setLoading(true);
  
    axios
      .post(process.env.REACT_APP_API_ADDRESS + 'api/Products/category', {
        cat_name: cat_name,
        description: description,
      })
      .then(() => {
        // Fetch only the newly added category instead of all categories
        axios
          .get(process.env.REACT_APP_API_ADDRESS + `api/analytics/categories/${cat_name}`)
          .then((response) => {
            // Update the state with the new category
            setCategories((prevCategories) => [...prevCategories, response.data]);
            setSelectedCategory(cat_name); // Set the selected category to the newly added one
            alert('Category added');
  
            // Close the "Add Category" modal
            handleCloseCustomer();
  
            // Stop loading immediately upon successful category submission
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching newly added category:', error);
            // Stop loading in case of an error
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error submitting category:', error);
        // Stop loading in case of an error
        setLoading(false);
      });
  };
  
  const [data, setData] = useState([]); 

  const loadData = async () => {
    const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "api/analytics/branches");
    setData(response.data);
  }; 

  useEffect(() =>{
    loadData();
  }, []);

  const handleFileChange = (event) => {
    const { files } = event.target;

    if (files.length > 0) {
        const file = files[0];
        setFile(file);

        // Read the file and set it as the source of the image preview
        const reader = new FileReader();
        reader.onload = (e) => {
           
            imagePreviewRef.current.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
      setFile(null);
        // Clear the image preview when no file is selected
        imagePreviewRef.current.src = '';
    }
};


const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData();

    // Append product details to the FormData object
    formData.append('name', ProductName);
    formData.append('category', selectedCategory);
    formData.append('quantity', Quantity);
    formData.append('SellingPrice', SellingPrice);
    formData.append('amountMl', amountMl);
    formData.append('Branch', Branch);
    formData.append('BuyingPrice', BuyingPrice);
    formData.append('DiscountedAmount', DiscountedAmount);

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
    setProductName('');
    setSelectedCategory('');
    setQuantity(0);
    setPrice(0);
    setAmountml(0);
    setBranch('');
    setBuyingPrice(0);
    setDiscountedAmount(0);
    setFile('');

    window.alert('Product added successfully');
    history.push('/index');
  } catch (error) {
    console.error('Error submitting data:', error);
  }
};



  return (
   
     
    <Dialog
      key={key}
      fullScreen={isNarrowScreen}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          maxWidth: '100%', 
        },
      }}

    >
      <AppBar sx={{ position: 'relative',backgroundColor:'#082f49' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <ArrowBackIosIcon sx={{color:'#fff'}}/>
          </IconButton>
          <Typography sx={{ ml: 0, flex: 1,color:'#fff',fontSize:'13px' }} variant="h6" component="div">
            New Product
          </Typography>
         
        </Toolbar>
      </AppBar>
      <div className='AddProductForm'>
        <div className='AddProductTop'>
          <div className='ProductImage'>
          <img  
            src='' 
            ref={imagePreviewRef} 
            alt=''
            className={file ? 'selectedImage' : ''}
          />
            <div className='ImageSelctor'>
              <label htmlFor='file'> <CameraAltIcon className='CameraIcon'/></label>  
              <input 
                name='file'
                id='file'
                type='file' 
                className='FileInput' 
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className='ProductForm'>
            <div className='TopAddition'>
              <div className='TopAdditionDesc'>
                <span>New Product</span>
                <h2>Product Details</h2>
              </div>
             <div className='TopAdditionCat'>
             {initialFetchComplete && (
            <button onClick={handleOpenCustomer}>Add category</button>
            )}
             </div>
            </div>
            <div className='FormDetails'>
              <div className='FormDetailEntry'>
                <div className='EntryPoint'>
                  <label>Name</label>
                  <input 
                    id='ProductName'
                    name='ProductName'
                    placeholder='Tusker etc'
                    value={ProductName || " "}
                    onChange={handleProductNameChange}
                    />
                </div>
                <div className='EntryPoint'>
                  <label>Category</label>
                  <select value={selectedCategory} onChange={handleProductCategoryChange}>
                    <option value="">Select...</option>
                    {categories.map((val) => (
                      <option key={val.cat_name} value={val.cat_name}>
                        {val.cat_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='FormDetailEntry'>
              <div className='EntryPoint'>
                  <label>Count</label>
                  <input 
                    type="number"
                    id='Quantity'
                    name='Quantity'
                    min="1"
                    value={Quantity || " "}
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className='EntryPoint'>
                  <label>Ml</label>
                  <input 
                    type="number"
                    min="1"
                    id='amountMl'
                    name='amountMl'
                    value={amountMl || " "}
                    onChange={handleAmountMl}
/>
                </div>
              </div>
              <div className='FormDetailEntry'>
                <div className='EntryPoint'>
                  <label>B.P</label>
                  <input 
                    type="number"
                    min="0"
                    id='BuyingPrice'
                    name='BuyingPrice'
                    value={BuyingPrice || ""}
                    onChange={handleBuyingPrice}
                  />
                </div>
                <div className='EntryPoint'>
                  <label>S.P</label>
                  <input 
                    type="number"
                    id='SellingPrice'
                    name='PriSellingPricece'
                    min="0"
                    value={SellingPrice || " "}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
              <div className='FormDetailEntry'>
                <div className='EntryPoint'>
                  <label>Discount</label>
                  <input 
                   name='DiscountedAmount'
                   id='DiscountedAmount'
                   value={DiscountedAmount || ""}
                   onChange={handleDiscountedAmount}
                  />
                </div>
                <div className='EntryPoint'>
                  <label>Location</label>
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

              <div className='FormSummary'>
                  <div className='SummaryItem'>
                  <span>Added Count:</span><span>{Quantity}</span>
                  </div>
                  <div className='SummaryItem'>
                  <span>Stock Value (B.P):</span><span>{BuyingPrice * Quantity}</span>
                  </div>
                  <div className='SummaryItem'>
                  <span>Stock Value (S.P):</span><span>{SellingPrice * Quantity}</span>
                  </div>
                  <div className='SummaryItem'>
                  <span>Profit estimate:</span><span>{(SellingPrice * Quantity) - (BuyingPrice * Quantity)}</span>
                  </div>
                    
                 
              </div>
            </div>
          </div>
        </div>
        <div className='AddProductBottom'>
          <div className='CancelButton'>
            <span>Close on save</span>
            <button  onClick={handleClose}>Cancel</button>
          </div>
          <div className='SubmitButton'>
            <button onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>

      {/* Category modal */}
      <Modal
            open={openCustomer}
            onClose={handleCloseCustomer}  
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
                              <label htmlFor='customerName' 
                              style={{
                                color:'#6b7280',fontSize:'12xpx'
                              }}
                              >Category name</label>
                              <input 
                                style={{
                                  border:'1px solid transparent',
                                  outline:'none',
                                  background:'#f0f9ff',
                                  height:'2.0rem',
                                  borderRadius:'5px',
                                  paddingLeft:'10px',
                                  paddingRight:'10px',
                                  color:'black',
                                  fontWeight:'700'
                                }}
                                placeholder='enter category'
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
                              <label htmlFor='customerName'  
                              style={{
                                color:'#6b7280',fontSize:'12xpx'
                              }}
                              > Category description </label>
                              <textarea 
                                style={{
                                  border:'1px solid transparent',
                                  outline:'none',
                                  background:'#f0f9ff',
                                  borderRadius:'5px',
                                  paddingLeft:'10px',
                                  paddingRight:'10px',
                                  color:'black',
                                  fontWeight:'700'
                                }}
                                placeholder='desc..'
                                rows={4}
                                value={description}
                                onChange={(e) =>{
                                  setDescription(e.target.value);
                                  }}
                              />
                            </div>

                            {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                              <CircularProgress />
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                              <button
                                style={{
                                  background: '#bae6fd',
                                  color: 'black',
                                  padding: '8px 12px',
                                  border: 'none',
                                  outline: 'none',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                }}
                                onClick={SubmitCategory}
                                >
                              Save
                            </button>
                            </div>
                                )}


                        </Typography>
                      </Box> 
      </Modal>
    </Dialog>
  )
}

export default StocAdditionMainDialog
