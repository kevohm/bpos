import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AlphaSideBarNav from '../../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav';
import AlphaNavBarAdmin from '../../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin';
import { AuthContext } from '../../../AuthContext/AuthContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import './SingleOrderView.scss'
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import './ResponseForm.scss'
import SalesPersonsNavigation from '../../NavigationShow/SalesPersonsNavigation';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const SingleOrderView = () => {
    const { user } = useContext(AuthContext);
    const { order_serial } = useParams();
    const user_name = user?.fullname;
    const [admin_total,setAdminTotal] = useState(0); 
    const [admin_response, setAdminResponse] = useState('');
    const [supplier, setSupplier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const history = useNavigate();
    const [receipt,setReceipt] = useState('');
    const [user_response,setUserResponse] = useState('');
    const [user_total,setUserTotal] = useState(0); 
    const imagePreviewRef = useRef(null);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const handleFileChange = (event) => {
        const { files } = event.target;
    
        if (files.length > 0) {
            const file = files[0];
            setReceipt(file);
    
            // Read the file and set it as the source of the image preview
            const reader = new FileReader();
            reader.onload = (e) => {
               
                imagePreviewRef.current.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
          setReceipt(null);
            // Clear the image preview when no file is selected
            imagePreviewRef.current.src = '';
        }
    };
    const handleUserResponse = (event) => {
        setUserResponse(event.target.value);
        };
    const handleUserTotal = (event) =>{
        setUserTotal(event.target.value);
    }
        
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const [OrderInfo, setOrderInfo] = useState([]);
      useEffect(() => { 
        const fetchData = async () => {
          try {
            const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/userorders/allorders/${order_serial}`); 
            setOrderInfo(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
      }, [order_serial]);

      const [orderResponse,setOrderResponse] = useState({})
      
      useEffect(() => { 
        const fetchData = async () => {
          try {
            const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/userorders/order_respose/${order_serial}`); 
            setOrderResponse(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
      }, [order_serial]); 

      const handleSubmit = async () => {
        try {
          setLoading(true);
          setError(null); 
          if (
            !(admin_total) || 
            !admin_response.trim()
          ) {
            setError('Please enter valid amount and description.');
            return;
          }
          const response = await axios.post(
            process.env.REACT_APP_API_ADDRESS + 'api/userorders/submit_response',
            {
              order_serial, 
              admin_response, 
              supplier,
              admin_total,
            }
          );
          console.log('API Response:', response.data);
      
          if (response.data.success) {
            toast.success('Order response added successfully', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
            setTimeout(() => {
              // Reload the page after the delay
              window.location.reload();
            }, 3000);
          } else {
            setError('An error occurred while submitting the expense.');
          }
        } catch (error) {
          setError('An error occurred while submitting the expense.');
        } finally {
          setLoading(false);
        }
      };

      const UpdateOrder = async (event) => {
        event.preventDefault();
        try {
          const formData = new FormData();
          formData.append('user_response', user_response);
          formData.append('user_total', user_total);
          formData.append('user_name', user_name);
          formData.append('receipt', receipt);

          const response = await axios.put(
            process.env.REACT_APP_API_ADDRESS + `api/userorders/edit_response/${order_serial}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          
          setUserResponse('');
          setUserTotal(0);
          setReceipt('');
          if (response.data.success) {
            toast.success('Response sent successfully', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 500,
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else {
            toast.error('Error adding product. Please try again.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 500,
            });
          }
        } catch (error) {
          console.error('Error submitting data:', error);
        
          toast.error('Error adding product. Please try again.', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 500,
          });
        }
      };

      
      const generatePDF = () => {
        const today = new Date().toLocaleDateString();
        const doc = new jsPDF();
    
        // Check if OrderInfo is not empty
        if (OrderInfo.length > 0) {
            const Branch = OrderInfo[0].Branch;
            const order_serial = OrderInfo[0].order_serial;
    
            // Add header
            doc.setFontSize(15);
            doc.text(`Date: ${today}`, 15, 20);
            doc.text(`Branch: ${Branch}`, 15, 30);
    
            // Add table headers
            const headers = [['Product', 'Amount (ml)', 'Quantity']];
    
            // Prepare table data from OrderInfo
            const tableData = OrderInfo.map(({ product, amountMl, to_buy }) => [product, amountMl, to_buy]);
    
            // AutoTable options
            const options = {
                startY: 50,
                headStyles: { fillColor: '#172554', textColor: '#ffffff' } // Apply styles only to the header row
            };
    
            // Add table
            doc.autoTable({
                head: headers,
                body: tableData,
                startY: 50,
                ...options
            });
    
            // Add footer text
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 255); // Set text color to blue
    
            const footerText = `Generated by www.liquourlogic.co.ke | Order Serial: ${order_serial}`;
            const textWidth = doc.getStringUnitWidth(footerText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            const startX = (doc.internal.pageSize.width - textWidth) / 2; // Calculate starting X position for centering
            const startY = doc.internal.pageSize.height - 10; // Y coordinate for the link
            doc.textWithLink(footerText, startX, startY, { url: 'http://www.liquourlogic.co.ke' });
    
            // Save the PDF
            doc.save(`${Branch}_order.pdf`);
        } else {
            console.error('OrderInfo is empty. Cannot generate PDF.');
        }
    };
    
    
    

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
                 {user && user.role === 'NormalUser' && (
                    <div style={{paddingBottom:'50px'}}><SalesPersonsNavigation /></div>
                )}
                <div className='SingleOrderView'>
                    <div className='OrderHeader'>
                        <h1>Inspect the orders and respond accordingly</h1>
                    </div>
                    <div className='Responses'>
                    <div className='Senderdetails'>
                        {OrderInfo.length > 0 && (
                            <span>
                                <small>Branch: {OrderInfo[0].Branch}</small>
                                <small>Ordered by: {OrderInfo[0].order_personnel}</small>
                                <small style={{color:'#1d4ed8'}}>Order total: {OrderInfo.reduce((total, order) => total + parseFloat(order.Total_Amount), 0).toLocaleString()}</small>
                                <small style={{color:'maroon'}}>Bought order total:{orderResponse.admin_total ? orderResponse.admin_total.toLocaleString() : '0'}</small>
                                <small>Supplied from <small style={{textTransform:'lowercase'}}>{orderResponse.supplier}</small></small>
                            </span>
                        )}
                    
                        <span>
                        {OrderInfo.length > 0 && (
                            <span>
                                Order Date:
                                <small>{moment(OrderInfo[0].order_date).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}</small>
                            </span>
                        )}
                            <span>Dispatch time:
                              <small>{moment(orderResponse.dispatch_time).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}</small>
                            </span>
                            <span>Arrival time:
                            <small>{moment(orderResponse.arrival_time).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}</small>
                            </span>
                        </span>
                    </div>

                    
                        <div className='ResponseActions'>
                          <button onClick={handleClickOpen}>Give your response</button>
                          <button onClick={generatePDF}>Download Order</button>
                        </div>
                     
                      <div className='ResponseView'>
                        
                        <div className='Receipt'> 
                            <img src={orderResponse.imageUrl} alt='receipt'/>
                        </div>

                        <div className='Responses'>
                          <div className='AdminReponse'>
                            <span>
                                Admin ***:
                                <small>{orderResponse.admin_response}</small>
                            </span>
                          </div>
                          <div className='UserResponse'>
                              <span>
                                  {orderResponse.user_name} ***:
                                  <small>{orderResponse.user_response}</small>
                              </span>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className='OrdersTable'>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>

                                    <TableCell>#</TableCell>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Physical count</TableCell>
                                    <TableCell>Order count</TableCell>
                                    <TableCell>Declared</TableCell>
                                    <TableCell>Sold</TableCell>
                                    <TableCell>Bought count</TableCell>
                                    <TableCell>Buying Price</TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {OrderInfo
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const formattedAmount = parseFloat(row.Total_Amount).toLocaleString();
                                    return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.product}</TableCell>
                                    <TableCell>
                                    <small style={{display:'flex'}}>
                                        {row.order_status === "Pending" && (
                                            <span className="loading-dots" style={{ animation: 'loading 2s infinite',color:"red",paddingLeft:'10px' }}>Pending ...</span>                                           
                                        )}
                                        {row.order_status === "Reviewed" && (
                                            <span style={{ color: 'blue' }}>
                                                Reviewed<span role="img" aria-label="warning">⚠️</span>
                                            </span>
                                        )}
                                        {row.order_status === "Approved" && (
                                            <span style={{ color: 'green' }}>
                                                Approved<span role="img" aria-label="tick">✅</span>
                                            </span>
                                        )}
                                    </small>
                                    </TableCell>
                                    <TableCell>{row.physical_count}</TableCell>
                                    <TableCell>{row.order_count}</TableCell>
                                    <TableCell style={{ color: row.quantity ? 'black' : 'red' }}>
                                        {row.quantity || 'Empty Shelf'}
                                    </TableCell>
                                    <TableCell>{row.soldCount}</TableCell>
                                    <TableCell>{row.to_buy}</TableCell>
                                    <TableCell>{row.BuyingPrice}</TableCell>
                                    <TableCell>
                                        <span style={{backgroundColor:'#dbeafe',padding:'5px 10px',borderRadius:'5px',fontWeight:'bold'}}>{formattedAmount}</span> 
                                    </TableCell>
                                    {user && user.role === 'Admin' &&(
                                    <TableCell> <Link to={`/single_order/${row.order_id}`}><button style={{padding:'5px 10px',backgroundColor:'#172554',color:'#ffd412',borderRadius:'5px'}}>Act</button></Link></TableCell>
                                    )}
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={OrderInfo.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    </div>
                </div>
            </div>

            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Fill to send your response"}</DialogTitle>
              <DialogContent>
              <div className='ResponseForm'>
                            <div className='responseOrder'>
                            {user && user.role === 'Admin' &&(
                                <div className='responseEntry'>
                                    <label>Admin comments</label>
                                    <input 
                                        name='admin_response'
                                        id='admin_response'
                                        value={admin_response}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                    />
                                </div>
                            )}
                             {user && user.role === 'NormalUser' && (
                                <div className='responseEntry'>
                                    <label>User comments</label>
                                    <input 
                                        name='user_response'
                                        id='user_response'
                                        value={user_response}
                                        onChange={handleUserResponse}
                                    />
                                </div>
                             )}
                                {user && user.role === 'Admin' &&(
                                <div className='responseEntry'>
                                    <label>Supplier</label>
                                    <input 
                                        name='supplier'
                                        id='supplier'
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                    />
                                </div>
                                )}
                                {user && user.role === 'Admin' &&(
                                <div className='responseEntry'>
                                    <label>Total incurred</label>
                                    <input 
                                        name='admin_total'
                                        id='admin_total'
                                        value={admin_total}
                                        onChange={(e) => setAdminTotal(e.target.value)}
                                    />
                                </div>
                                )}
                                 {user && user.role === 'NormalUser' && (
                                <div className='responseEntry'>
                                    <label>Cash total</label>
                                    <input 
                                        name='user_total'
                                        id='user_total'
                                        value={user_total}
                                        onChange={handleUserTotal}
                                    />
                                </div>
                                 )}
                                {user && user.role === 'NormalUser' && (
                                <div className='responseEntry' style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                    <label>Take a picture of the receipt & upload</label>
                                    <input 
                                        name='receipt'
                                        id='receipt'
                                        type='file'
                                        onChange={handleFileChange}
                                    />
                                     <img  
                                        src='' 
                                        ref={imagePreviewRef} 
                                        alt=''
                                        className={receipt ? 'selectedImage' : ''}
                                    />
                                </div>
                                )}


                                <div>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                </div>
                            </div>

                            <div className='responseActions'>
                              {user && user.role === 'Admin' &&(
                                  <button onClick={handleSubmit}> {loading ? 'Submitting...' : 'Submit'}</button>
                              )}
                               {user && user.role === 'NormalUser' && (
                                <button onClick={UpdateOrder}>update</button>
                               )}
                            </div>
                          
                        </div>
              </DialogContent>
              <DialogActions>
                
              </DialogActions>
            </Dialog>
        </div>
    </div>
  )
}

export default SingleOrderView
