import React, { useContext, useEffect, useState } from 'react';
import './styles/CashFlow.scss';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaArrowUp, FaArrowDown, FaArrowRight } from 'react-icons/fa';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AlphaSideBarNav from '../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav';
import AlphaNavBarAdmin from '../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin';
import { AuthContext } from '../../AuthContext/AuthContext';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const CashFlow = () => {

  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useNavigate();
  const [stockInformation, setStockInformation] = useState([]);
  const [financeDate, setFinanceData] = useState([]);
  const isNarrowScreen = useMediaQuery('(max-width: 768px)'); 
  const isWideScreen = useMediaQuery('(min-width: 769px)'); 
  const paddingValue = isNarrowScreen ? '0px' : isWideScreen ? '30px' : '16px';
  const [open, setOpen] = React.useState(false);
  const [openCustomer, setOpenCustomer] = React.useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [financeInfo, setFianceInfo] = useState({
    name: '',
    cashIn :0,
    cashOut :0
  });
  const added_by = user?.fullname || 'Admin';

    // Get the current date in the format "YYYY-MM-DD" 
    const getCurrentDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    // Set the initial state to the current date
    const [selectedDate, setSelectedDate] = useState(getCurrentDate());
    // Handle changes in the date input
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };

    // submitting cash in cash out
    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setFianceInfo({ ...financeInfo, [name]: value });
    }

    const handleSubmit = (e) =>{
  
      const updatedProductInfo = {
        ...financeInfo,
        selectedDate:selectedDate,
        added_by: added_by,
      };
       
        if(!id){ 
          axios.post(process.env.REACT_APP_API_ADDRESS + "api/adminfunctions/postcashflow", 
          updatedProductInfo).then(() =>{
                  setFianceInfo({
                    name: '',
                    cashIn :'',
                    cashOut :'',
                  })
        }).catch((err) => alert(err.response.data));
        toast.success('Added successfully', { position: 'top-right' }); 
        }else{
          axios.put(process.env.REACT_APP_API_ADDRESS + `api/adminfunctions/productedit`, 
          updatedProductInfo).then(() =>{
            setFianceInfo({  });
              toast.success('Update Done successfully', { position: 'top-right' }); 
        }).catch((err) => {
          toast.error(err.response.data, { position: 'top-right' });
        });
        }
        setTimeout(() => window.location.reload(), 700);
    }

  // Getting stock information
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `/api/adminfunctions/stockinformation`)
      .then((response) => {
        setStockInformation(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

// getting cashflow
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `/api/adminfunctions/cashflow`)
      .then((response) => {
        setFinanceData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  
  return (
    <div className="home">
    <div className='HomeDeco'>
        {user && user.role === 'Admin' &&(
        <AlphaSideBarNav />
        )}
            <div className="homeContainer">
                {user && user.role === 'Admin' &&(
                <AlphaNavBarAdmin /> 
                )}

                <div className='CashFlow'>

                <div className='filterProducts'>

                        {stockInformation.map((stockInfo) => {
                        const currentStockValue = parseFloat(stockInfo.currentStockValue);
                        const soldStockValue = parseFloat(stockInfo.soldStockValue);
                        const totalStockValue = currentStockValue + soldStockValue;
                        const percentageCurrent = (currentStockValue / totalStockValue) * 100 || 0;
                        const percentageSold = (soldStockValue / totalStockValue) * 100 || 0;

                        const renderArrowIcon = (percentage) => {
                            if (percentage < 50) {
                            return <FaArrowDown style={{ color: 'red' }} />;
                            } else if (percentage > 50) {
                            return <FaArrowUp style={{ color: 'green' }} />;
                            } else {
                            return <FaArrowRight style={{ color: 'orange' }} />;
                            }
                        };

                                return (
                                <div className='filterProducts'>
                                    <ul>

                                    <li>
                                        <span>Total stock value:</span>
                                        <small> 
                                        {totalStockValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}
                                        </small>
                                    </li>

                                    <li>
                                        <span>Available stock value:</span>
                                        <small> 
                                        {stockInfo.currentStockValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}  <strong> (<small>{percentageCurrent.toFixed(2)}%</small> <small>{renderArrowIcon(percentageCurrent)} </small>)</strong>
                                        </small>
                                    </li>
                                    <li>
                                        <span>Sold stock value:</span>
                                        <small> 
                                        {stockInfo.soldStockValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}  <strong> (<small>{percentageSold.toFixed(2)}%</small> <small>{renderArrowIcon(percentageSold)} </small>)</strong>
                                        </small>
                                    </li>
                                    </ul>

                                    <span>*Currency in Kenya Shillings*</span>
                                </div>
                                );
                            })}

                </div>
                

                <div className='MoneyInOut'>
                    <div className='CashAtHand'>
                          {/* <span>Cash at hand</span>
                          <span>0</span> */}
                    </div>
                    <div className='Transaction'>

                      <div className='ButtonsTransActions'>
                        <button className='buttonCashIn' onClick={handleOpenCustomer}>+ Add Cash In</button>
                        <button className='buttonCashOut' onClick={handleClickOpen}> - Add Cash Out </button>
                      </div>

                      <div>
                       
                        <Dialog
                          fullScreen={isNarrowScreen}
                          open={openCustomer}
                          onClose={handleOpenCustomer}
                          TransitionComponent={Transition}
                          sx={{
                            padding: paddingValue
                          }}
                        >
                          <AppBar sx={{ position: 'relative',backgroundColor:'#082f49' }}>
                            <Toolbar>
                              <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleCloseCustomer}
                                aria-label="close"
                              >
                                <ArrowBackIosIcon sx={{color:'#fff'}}/>
                              </IconButton>
                              <Typography sx={{ ml: 0, flex: 1,color:'#fff',fontSize:'13px' }} variant="h6" component="div">
                                Add cash (credit)
                              </Typography>
                            
                            </Toolbar>
                          </AppBar>
                          <div className='ProductEditDialog'>

                          <div className='TopPartEdit'>
                          <ul className='EntryOne'>
                            <li>
                              <label>Name</label>
                              <input 
                                name='name'
                                id='name' 
                                value={financeInfo.name}
                                onChange={handleOnChange}
                              />
                            </li>
                            <li>
                              <label>Cash in Amount</label>
                              <input 
                                name='cashIn'
                                id='cashIn'
                                value={financeInfo.c}
                                onChange={handleOnChange}
                              />
                            </li>
                            <li>
                              <label htmlFor='event_date'>Date</label>
                              <input 
                                type="date"
                                name='event_date'
                                id='event_date'
                                value={selectedDate}
                                onChange={handleDateChange}
                              />
                            </li>
                          </ul>
                          
                          <div className='SummaryTwo'>
                            <section>
                              <h1>Summary</h1>
                            </section>
                            <div className='SummaryList'>
                              <ul>
                                <li>
                                  <p>Credited</p>
                                  <span>{Number(financeInfo.cashIn).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}</span>
                                </li>
                          
                              </ul>
                            </div>
                          </div>
                          </div>
                            <div className='BottomSave'>
                                <button onClick={() => handleSubmit()}>
                                    Credit
                                </button>
                            </div>
                          </div>
                        </Dialog>
                        
                        <Dialog
                          fullScreen={isNarrowScreen}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Transition}
                          sx={{
                            padding: paddingValue
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
                                Cash out (debit)
                              </Typography>
                            
                            </Toolbar>
                          </AppBar>
                          <div className='ProductEditDialog'>

                          <div className='TopPartEdit'>
                          <ul className='EntryOne'>
                            <li>
                              <label>Name</label>
                              <input 
                                name='name'
                                id='name' 
                                value={financeInfo.name}
                                onChange={handleOnChange}
                              />
                            </li>
                            <li>
                              <label>Cash Out Amount</label>
                              <input 
                                name='cashOut'
                                id='cashOut'
                                value={financeInfo.cashOut}
                                onChange={handleOnChange}
                              />
                            </li>
                            <li>
                              <label htmlFor='event_date'>Date</label>
                              <input 
                                type="date"
                                name='event_date'
                                id='event_date'
                                value={selectedDate}
                                onChange={handleDateChange}
                              />
                            </li>
                          </ul>
                          
                          <div className='SummaryTwo'>
                            <section>
                              <h1>Summary</h1>
                            </section>
                            <div className='SummaryList'>
                              <ul>
                                <li>
                                  <p>Debited</p>
                                  <span>{Number(financeInfo.cashOut).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}</span>
                                </li>
                          
                              </ul>
                            </div>
                          </div>
                          </div>
                            <div className='BottomSave'>
                                <button onClick={() => handleSubmit()}>
                                    Debit
                                </button>
                            </div>
                          </div>
                        </Dialog>
                      </div>

                  </div>
              
                </div>

                <div className='flowTable'>
                <DataGrid
                    style={{padding:'20px',fontWeight:'bold'}}
                        rows={financeDate.map((product, index) => ({ ...product, indexId: index + 1 }))}
                        columns={[
                              { field: 'finance_code', headerName: 'Code', width: 150 },
                          
                            { field: 'name', headerName: 'Name', width: 300 },
                            {
                              field: 'cashIn',
                              headerName: 'Cash In',
                              width: 150,
                              renderCell: (params) => <span>{params.row.cashIn.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}</span>,
                            },
                            {
                              field: 'cashOut',
                              headerName: 'Cash Out',
                              width: 200,
                              renderCell: (params) => <span>{params.row.cashOut.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2,})}</span>,
                            },
                            {field: 'added_by', headerName:'Posted by:', width: 200},
                            {
                              field: 'createdAt',
                              headerName: 'Date',
                              width: 150,
                              renderCell: (params) => (
                                  <span>
                                      {moment(params.row.event_date).format('DD.MM.YYYY')}
                                  </span>
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
                            checkboxSelection
                            disableRowSelectionOnClick
                            disableColumnFilter
                            disableDensitySelector
                            disableColumnSelector
                />
                </div>

                
                <div className='GraphsMoneyFlow'>
                </div>
                
              </div>
            </div>
        </div>
    </div>
  )
}

export default CashFlow