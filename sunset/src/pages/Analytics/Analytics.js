import React, { useContext, useEffect, useState } from 'react'
import './Analytics.scss'
import '../Home/home.scss'
import '../../ComponentsTwo/StockManager/TabBar.scss'
import './PerformanceScores/Reports.scss'
import './Styles/StockReport.scss'
import './Styles/SalesReport.scss' 
import './Styles/DailySales.scss'
import './Styles/DailyIndividual.scss'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import Report from '../../components/Report/SearchBar'
import SalesTables from '../../components/Report/SalesTables'
import Navigation from '../NavOfficial/Navigation' 
import StockReport from '../../components/Report/StockReport'
import IndividualReport from '../../components/Report/IndividualReport'
import { AuthContext } from '../../AuthContext/AuthContext'
import AvailableProgress from '../../ComponentsTwo/StockManager/Charts/AvailableProgress'
import SoldProgress from '../../ComponentsTwo/StockManager/Charts/SoldProgress'
import PerformanceScore from './PerformanceScores/PerformanceScore'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import SwipeableViews from 'react-swipeable-views';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow'; 
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import MoneyAnalytics from './MoneyAnalytics'
import TableSummary from '../../components/Widgets/TableSummary'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const COLORS = ['#063992', '#ff9800','red']; // Blue for 'Available', Orange for 'Sold'

const ProductChart = ({selectedProduct}) =>{
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={selectedProduct}
          dataKey="Percentage"
          nameKey="ProductStatus"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={(entry) => `${entry.ProductStatus} ${entry.Percentage}%`}
        >
          {selectedProduct.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

const SummaryBarChart = ({ barChartSummary }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barChartSummary} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="TotalProducts" fill="blue" />
        <Bar dataKey="TotalSold" fill="green" />
        <Bar dataKey="TotalAvailable" fill="orange" />
        <Bar dataKey="TotalArchived" fill="orangered" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const SalesAnalysisChart = ({ salesAnalysis }) => {
  // Custom tick formatter function to extract only the date part
  const formatDateTick = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const TooltipFormatDateTick = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
 


  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesAnalysis} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tickFormatter={formatDateTick} angle={-10} height={60} />
        <YAxis />
        <Tooltip labelFormatter={TooltipFormatDateTick} />
        <Legend />
        <Bar dataKey="available" fill="orange" />
        <Bar dataKey="sold" fill="green" />
      </BarChart>
    </ResponsiveContainer>
  );
};



const Analytics = () => {

  const { user } = useContext(AuthContext);
  const [productData, setProductData] = useState([]);
  const [query, setQuery] = useState('');

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

      const handleCloseProduct = () => {
        setOpenProduct(false);
      };
      const [openProduct, setOpenProduct] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const [selectedProductCount, setSelectedProductCount] = useState(null);
      const [barChartSummary,setBarChartSummary] = useState('')
      const [salesAnalysis,setSalesAnalysis] = useState('');

      const handleOpenProduct = (name,amountMl) => {
        const productPercentEndpoint = process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/productpercent/${name}/${amountMl}`;
        const productCountEndpoint = process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/productcount/${name}/${amountMl}`;
      
        axios.all([
          axios.get(productPercentEndpoint),
          axios.get(productCountEndpoint)
        ])
        .then(axios.spread((percentResponse, countResponse) => {
          setSelectedProduct(percentResponse.data);
          setSelectedProductCount(countResponse.data);
          setOpenProduct(true);  
        }))
        .catch(error => {
          console.error('Error fetching product details and count:', error);
        });
      };
 
      useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/groupanalytics?q=${query}`)
          .then(response => {
            setProductData(response.data); 
          })
          .catch(error => {
            console.error('Error fetching branch analytics:', error);
          });
      }, [query]);


      useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/salesanalysischart`)
          .then(response => {
            setSalesAnalysis(response.data);
          })
          .catch(error => {
            console.error('Error fetching branch analytics:', error);
          });
      }, [query]);



      useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `api/groupAnalytics/barchartsummary`)
          .then(response => {
            setBarChartSummary(response.data);
          })
          .catch(error => {
            console.error('Error fetching branch analytics:', error);
          });
      }, []);

      const [openStockReport, setOpenStockReport] = React.useState(false);
      const handleOpenReport = () => setOpenStockReport(true);
      const handleCloseReport = () => setOpenStockReport(false);

      const [openSalesReport, setOpenSalesReport] = React.useState(false);
      const handleOpenSalesReport = () => setOpenSalesReport(true);
      const handleCloseSalesReport = () => setOpenSalesReport(false);

      const [openDailySales, setOpenDailySales] = React.useState(false);
      const handleOpenDailySales = () => setOpenDailySales(true);
      const handleCloseDailySales = () => setOpenDailySales(false);

      const [openDailyIndividual, setOpenDailyIndividual] = React.useState(false);
      const handleOpenDailyIndividual = () => setOpenDailyIndividual(true);
      const handleCloseDailyIndividual = () => setOpenDailyIndividual(false);



   

      const deleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete the product?')) {
          Axios.delete(`${process.env.REACT_APP_API_ADDRESS}api/Products/deleteRecord/${id}`); 
          toast.success('Product record deleted successfully');
        }
      };


  return (
    <div className='home'>
    <div className='HomeDeco'>
    <Navigation /> 
    <div className="homeContainer">
      <NavigationBar />

      <div className='MainAnalytics'>
      <div className="TabBar"> 
      <div className="TabButtons"> 
        <button
          className={activeTabIndex === 0 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(0)}
        >
          Product Analysis
        </button>
        <button
          className={activeTabIndex === 1 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(1)}
        >
          Sales Analysis
        </button>
        <button
          className={activeTabIndex === 2 ? 'ActiveTab' : ''}
          onClick={() => handleTabChange(2)}
        >
          Cash Flow Analysis
        </button>
      </div>

      <SwipeableViews
      index={activeTabIndex}
      onChangeIndex={handleTabChange}
      enableMouseEvents
      >
      <div className="TabContent" style={{display:'flex',flexDirection:'column',gap:'15px'}}> 
      
        <div>
          <AvailableProgress />
          <SoldProgress />
        </div>

        

        {/** Table to show products and product analytics */}

    <Paper sx={{ width: '100%', overflow: 'hidden'}}>
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
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
    </div>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
        <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Price / unit</TableCell>
            <TableCell>Amount (Ml)</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Action</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        {productData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, index) => {
            const productNameStyle = val.quantity > 0 ? { color: 'green',fontWeight: 'bold',border:'none',outline:'none',cursor:'pointer' } : { color: 'red',fontWeight: 'bold',border:'none',outline:'none',cursor:'pointer' };
        
            return (
                <TableRow key={index}> 
                  <TableCell>{index + 1}</TableCell>    
                    <TableCell><button onClick={() => handleOpenProduct(val.name,val.amountMl)} style={productNameStyle}>{val.name}</button></TableCell>
                    <TableCell>{val.quantity}</TableCell>
                    <TableCell>{val.price}</TableCell>
                    <TableCell>{val.amountMl + 'ml'}</TableCell>
                    <TableCell>{val.Branch}</TableCell>
                    <TableCell>
                      <button style={{color:'red',border:'none',cursor:'pointer'}} onClick={() => deleteProduct(val.id)}><DeleteIcon /></button>
                      <Link to={`/productedits/${val.id}`}>
                      <button style={{color:'green',border:'none',cursor:'pointer'}}><CreateIcon /></button>
                      </Link>
                    </TableCell>
                </TableRow>
            );
        })}
        </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={productData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>

        <div>
        <Dialog
        open={openProduct}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseProduct}
        aria-describedby="alert-dialog-slide-description"
      >
       
        {selectedProductCount && selectedProductCount.map((val, index) => (
          <div key={index}>
            <div style={{backgroundColor:'#063992',color:'white',height:'3rem',display:"flex",justifyContent:'center',alignItems:'center'}}>
              <DialogTitle> <h5 style={{textAlign:'center',fontWeight:'300'}}> 
              {val.name} ({val.amountMl + 'ml'})  Analysis</h5></DialogTitle>
            </div>
            <div style={{display:'flex', justifyContent:'center',alignItems:'center',gap:'15px',paddingLeft:'30px',
            paddingRight:'30px',paddingTop:'30px',paddingBottom:'30px'}}>
              <div style={{color:'#063992',fontWeight:'bold'}}>Total Sold: {val.Sold}</div>
              <div style={{color:'red',fontWeight:'bold'}}>Total Available: {val.Available}</div>
              <div style={{color:'#ff9800',fontWeight:'bold'}}>Total Archived: {val.Archived}</div>
              <div style={{fontWeight:'bold'}}>Total: {val.Total}</div>
            </div> 
            <div><ProductChart selectedProduct={selectedProduct || []} /></div>
          </div>
        ))}

       
      </Dialog>
      
      
    </div>

    <div>
          <SummaryBarChart barChartSummary={barChartSummary}/>
    </div>

    </div>


      <div className="TabContent"> 

        <div>
          <PerformanceScore />
        </div>

        <div style={{marginTop:'20px'}}>
          <SalesAnalysisChart salesAnalysis={salesAnalysis}/>
        </div>

      </div>


      <div className="TabContent"> 
          <div className='Reports'>
              <div className='ReportPartA'>
                <button onClick={handleOpenReport}>Stock Report (addition & transfer) </button>
                <button onClick={handleOpenSalesReport}>Sales Report</button>
                <button onClick={handleOpenDailySales}>Daily Sales Report</button>
                <button onClick={handleOpenDailyIndividual}>Daily Individual Sales</button>
              </div>
          </div>

          <div>
            <Dialog
            open={openStockReport}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseReport}
            aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle style={{backgroundColor:'#063992',color:'white',display:'flex',justifyContent:'center'}}>General Stock report</DialogTitle>
              <div className='StockReport'>
                <div className='topDating'>

                  <div className='DateEntry'>
                    <label htmlFor='DateAdded'>From:</label>
                    <input 
                      type='date'
                      id='DateAdded'
                      name='DateAdded'
                    />
                  </div>

                  <div className='DateEntry'>
                    <label htmlFor='DateAdded'>To</label>
                    <input 
                      type='date'
                      id='DateAdded'
                      name='DateAdded'
                    />
                  </div>

                  <div className='DateEntry'>
                    <label>Search</label>
                    <button>Go</button>
                  </div>

                </div>
              </div>
            </Dialog>
          </div>

          <div>
            <Dialog
            open={openSalesReport}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseSalesReport}
            aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle style={{backgroundColor:'#063992',color:'white',display:'flex',justifyContent:'center'}}>General Sales report</DialogTitle>
              <div className='SalesReport'>
                <div className='topDating'>

                  <div className='DateEntry'>
                    <label htmlFor='DateAdded'>From:</label>
                    <input 
                      type='date'
                      id='DateAdded'
                      name='DateAdded'
                    />
                  </div>

                  <div className='DateEntry'>
                    <label htmlFor='DateAdded'>To</label>
                    <input 
                      type='date'
                      id='DateAdded'
                      name='DateAdded'
                    />
                  </div>

                  <div className='DateEntry'>
                  <label htmlFor='Branch'>Branch Name</label>
                  <select 
                    id='Branch'
                    name='Branch'
                  >
                    <option>Select...</option>
                  </select>
                  </div>

                  <div className='DateEntry'>
                    <label>Search</label>
                    <button>Go</button>
                  </div>

                </div>
              </div>
            </Dialog>
          </div>

          <div>
            <Dialog
            open={openDailySales}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDailySales}
            aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle style={{backgroundColor:'#063992',color:'white',display:'flex',justifyContent:'center'}}>Daily Sales report</DialogTitle>
              <div className='SalesReport'>
              <div className='topDating'>

                <div className='DateEntry'>
                  <label htmlFor='DateAdded'>From:</label>
                  <input 
                    type='date'
                    id='DateAdded'
                    name='DateAdded'
                  />
                </div>

                <div className='DateEntry'>
                  <label htmlFor='DateAdded'>To</label>
                  <input 
                    type='date'
                    id='DateAdded'
                    name='DateAdded'
                  />
                </div>

                <div className='DateEntry'>
                <label htmlFor='Branch'>Branch Name</label>
                <select 
                  id='Branch'
                  name='Branch'
                >
                  <option>Select...</option>
                </select>
                </div>

                <div className='DateEntry'>
                  <label>Search</label>
                  <button>Go</button>
                </div>

              </div>
            </div>
            </Dialog>
          </div>

          
            <div>
            <Dialog
            open={openDailyIndividual}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDailyIndividual}
            aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle style={{backgroundColor:'#063992',color:'white',display:'flex',justifyContent:'center'}}>Daily individual Sales report</DialogTitle>
              <div className='SalesReport'>
              <div className='topDating'>

                <div className='DateEntry'>
                  <label htmlFor='DateAdded'>From:</label>
                  <input 
                    type='date'
                    id='DateAdded'
                    name='DateAdded'
                  />
                </div>

                <div className='DateEntry'>
                  <label htmlFor='DateAdded'>To</label>
                  <input 
                    type='date'
                    id='DateAdded'
                    name='DateAdded'
                  />
                </div>

                <div className='DateEntry'>
                <label htmlFor='Branch'>Branch Name</label>
                <select 
                  id='Branch'
                  name='Branch'
                >
                  <option>Select...</option>
                </select>
                </div>

                <div className='DateEntry'>
                  <label>Search</label>
                  <button>Go</button>
                </div>

              </div>
            </div>
            </Dialog>
          </div>
          
         
          
            <div style={{paddingTop:'30px'}}>
              <MoneyAnalytics />
            </div>
          
      
       </div>

      </SwipeableViews>
      </div>

  {/** 
        <div className='SalesReport'>
          <h3>Click on any section below to view any report</h3>
          <div className='salesItems'>
         
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {user && user.role === 'Admin' &&(
            <div className='SalesItem'>
              <Report /> 
            </div>
            )}

            {user && user.role === 'Admin' &&(
            <div className='SalesItem'>
              <SalesTables />
            </div>
            )}
            
            {user && user.role === 'Admin' &&(
            <div className='SalesItem'>
              <StockReport />
            </div>
            )}

            {user && user.role === 'NormalUser' &&(
            <div className='SalesItem'>
              <IndividualReport />
            </div>
            )}
            </div>
          </div>
        </div>
      */}



      </div>
    </div>
    </div>
    </div>
  )
}

export default Analytics