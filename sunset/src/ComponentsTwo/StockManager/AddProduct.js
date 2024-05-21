import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../AuthContext/AuthContext';

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

const AddProduct = ({ open, handleClose }) => { 
  const { user } = useContext(AuthContext);
  const company_id = user?.id
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

  const [smallCupMl,setSmallCupMl] = useState('');
  const [LargeCupMl,setLargeCupMl] = useState('');
  const [smallCupSp, setSmallCupSp] = useState('');
  const [LargeCupSp, setLargeCupSp] = useState('');
  const [selectedCup, setSelectedCup] = useState('');

  const handleChangeSelectedCup = (event) => {
    setSelectedCup(event.target.value);
    };


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

    const handleSmallCupMl = (event) => {
      setSmallCupMl(Number(event.target.value));
  };

  const handleLargeCupMl = (event) => {
    setLargeCupMl(Number(event.target.value));
  };

  const handleSmallCupSp = (event) => {
    setSmallCupSp(Number(event.target.value));
  };

  const handleLargeCupSp = (event) => {
    setLargeCupSp(Number(event.target.value));
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
      
      const debounceFetch = setTimeout(() => {
        fetchCategories();
      }, 300);

      return () => clearTimeout(debounceFetch); 
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
    const response = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/branches/${company_id}`);
    setData(response.data);
  }; 

  useEffect(() =>{
    loadData();
  }, [company_id]);
  

  const handleFileChange = (event) => {
    const { files } = event.target;
    if (files.length > 0) {
        const file = files[0];
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {  
            imagePreviewRef.current.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
      setFile(null);
        imagePreviewRef.current.src = '';
    }
};
  

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData();
    formData.append('name', ProductName);
    formData.append('category', selectedCategory);
    formData.append('quantity', Quantity);
    formData.append('SellingPrice', SellingPrice);
    formData.append('amountMl', amountMl);
    formData.append('Branch', Branch);
    formData.append('BuyingPrice', BuyingPrice);
    formData.append('DiscountedAmount', DiscountedAmount);
    formData.append('smallCupMl',smallCupMl);
    formData.append('LargeCupMl',LargeCupMl);
    formData.append('smallCupSp',smallCupSp);
    formData.append('LargeCupSp',LargeCupSp);
    formData.append('company_id',company_id);

    // Append the image file to the FormData object
    formData.append('file', file);

    const response = await axios.post(
      process.env.REACT_APP_API_ADDRESS + 'api/Products/addProduct',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    setSmallCupMl(0);
    setLargeCupMl(0);
    setSmallCupSp(0);
    setLargeCupSp(0);
    setFile('');
    
    toast.success('Product added successfully', {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 500, 
    });

    history.push('/stocksetup');

  } catch (error) {
    console.error('Error submitting data:', error);

    toast.error('Error adding product. Please try again.', {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 500,
    });
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
      <AppBar sx={{ position: 'relative',backgroundColor:'#032e69' }}>
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
                {/* <div className='EntryPoint'>
                  <label>Count</label>
                  <input 
                    type="number"
                    id='Quantity'
                    name='Quantity'
                    min="1"
                    value={Quantity || " "}
                    onChange={handleQuantityChange}
                  />
                </div> */}

                {selectedCategory === "Senator Keg" ? (
                      <div className='EntryPoint'>
                        <label>Count</label>
                        <input 
                          type="number"
                          id='Quantity'
                          name='Quantity'
                          min="1"
                          placeholder='Disabled'
                          value={Quantity || " "}
                          onChange={handleQuantityChange}
                          disabled 
                        />
                      </div>
                    ) : (
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
                )}

                
                {/* Other Products Ml */}
                {selectedCategory !== "Senator Keg" && (
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
                )}
            

                {/* Senator keg barrel ML */}
                {selectedCategory === "Senator Keg" && (
                    <div className='EntryPoint'>
                    <label>Barrel Ml</label>
                    <input 
                      type="number"
                      min="1"
                      id='amountMl'
                      name='amountMl'
                      value={amountMl || " "}
                      onChange={handleAmountMl}
                    />
                  </div>
                )}
             

              </div>

              <div className='FormDetailEntry'>
              {selectedCategory === 'Senator Keg' &&(
                        <div className='EntryPoint'>
                          <label>Select cup size</label>
                          <select 
                          value={selectedCup} 
                          onChange={handleChangeSelectedCup}
                          >
                            <option>select...</option>
                            <option>Small</option>
                            <option>Large</option>
                          </select>
                        </div>
                      )}
              </div>

                 {/* Keg Addition: Barrel, small, large cup. 150 ml & 400 ml */}

                 {selectedCategory === "Senator Keg" && (
                 <div className='FormDetailEntry'> 
                  <div className='KegEntry'>
                  {selectedCup === "Small" && (
                    <div className='EntryPoint'>
                      <label>Small cup Ml</label>
                      <input 
                        type="number"
                        min="1"
                        id='smallCupMl'
                        name='smallCupMl'
                        value={smallCupMl || " "}
                        onChange={handleSmallCupMl}
                      />
                    </div>
                  )}
                  {selectedCup === "Large" && (
                    <div className='EntryPoint'>
                      <label>Large Cup Ml</label>
                      <input 
                        type="number"
                        min="1"
                        id='LargeCupMl'
                        name='LargeCupMl'
                        value={LargeCupMl || " "}
                        onChange={handleLargeCupMl}
                      />
                    </div>
                  )}
                  </div>

                  <div className='KegEntry'>
                  {selectedCup === "Small" && (
                    <div className='EntryPoint'>
                      <label>Small cup SP</label>
                      <input 
                        type="number"
                        min="1"
                        id='smallCupSp'
                        name='smallCupSp'
                        value={smallCupSp || " "}
                        onChange={handleSmallCupSp}
                      />
                    </div>
                  )}
                  {selectedCup === "Large" && (
                    <div className='EntryPoint'>
                      <label>Large Cup SP</label>
                      <input 
                        type="number"
                        min="1"
                        id='LargeCupSp'
                        name='LargeCupSp'
                        value={LargeCupSp || " "}
                        onChange={handleLargeCupSp}
                      />
                    </div>
                  )}
                  </div>
                </div> 
                )}

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
                {selectedCategory === "Senator Keg" ? (
                    <div className='EntryPoint'>
                      <label>S.P</label>
                      <input 
                        type="number"
                        id='SellingPrice'
                        name='PriSellingPricece'
                        min="0"
                        placeholder='Disabled'
                        value={SellingPrice || ""}
                        onChange={handlePriceChange}
                        disabled 
                      />
                    </div>
                  ) : (
                    <div className='EntryPoint'>
                      <label>S.P</label>
                      <input 
                        type="number"
                        id='SellingPrice'
                        name='PriSellingPricece'
                        min="0"
                        value={SellingPrice || ""}
                        onChange={handlePriceChange}
                      />
                    </div>
                  )}


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

export default AddProduct
