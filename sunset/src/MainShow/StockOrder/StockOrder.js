import React, { useContext, useEffect, useState } from 'react';
import './StockOrder.scss';
import './OrderForm.scss';
import SalesPersonsNavigation from '../NavigationShow/SalesPersonsNavigation';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import { AuthContext } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios' 
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const StockOrder = ({ searchQuery }) => { 

    const { user } = useContext(AuthContext);
    const history = useNavigate();
    const [open, setOpen] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [productId, setProductId] = useState('');
    const [product, setProduct] = useState('');
    const [sold, setSold] = useState('')
    const [physical_count, setPhysicalCount] = useState('');
    const [order_count, setOrderCount] = useState('');
    const [BuyingPrice, setBuyingPrice] = useState('');
    const [amountMl,setAmountMl] = useState('')
    const [products, setProducts] = useState([]);
    const [Total_Amount,setTotalAmount] = useState('');
    const [order_status,setOrderStatus] = useState('');
    const [Admin_response, setAdminResponse] = useState('');
    const [quantity, setQuantity] = useState('');
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const Branch = user?.Branch;
    const company_id = user?.company_id;
    const order_personnel = user?.userName;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddToList = () => {
        const Total_Amount = order_count * BuyingPrice; // Calculate total price
        const newEntry = {
            product,
            productId,
            physical_count,
            order_count,
            BuyingPrice,
            Total_Amount,
            sold
        };
        setOrderList(prevList => [...prevList, newEntry]);
        setProduct('');
        setPhysicalCount('');
        setOrderCount('');
        setBuyingPrice('');
        setSold('');
    };



    const totalOrderCost = orderList.reduce((total, item) => total + parseFloat(item.BuyingPrice), 0);

    const generateUniqueCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uniqueCode = '';
      
        for (let i = 0; i < 8; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          uniqueCode += characters.charAt(randomIndex);
        }
      
        return uniqueCode;
      };


    const PostOrder = () => {
        if (orderList.length === 0) {
            alert("Please add items to the order list before submitting.");
            return;
        }

        const order_serial = generateUniqueCode();
        console.log("The serial is:",order_serial)
        orderList.forEach(order => {
            axios.post(process.env.REACT_APP_API_ADDRESS + 'api/adminfunctions/postrder', {
                order_personnel: order_personnel,
                Branch: Branch,
                product: order.product,
                physical_count: order.physical_count,
                order_count: order.order_count,
                BuyingPrice: order.BuyingPrice,
                Total_Amount: order.Total_Amount,
                order_status: order_status,
                sold: order.sold,
                Admin_response: Admin_response, 
                company_id: company_id,
                order_serial: order_serial
            }).then(() => {
                console.log(`Order for ${order.product} submitted successfully`);
            }).catch(error => {
                console.error(`Error submitting order for ${order.product}:`, error);
            });
        });

        setOrderList([]);
        alert("Orders submitted successfully");
        setTimeout(() => history('/stock_order'), 700);
    };

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `/api/analytics/available/${Branch}`)
        .then((response) => {
            setProducts(response.data);
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
    }, [Branch]);
  

    return (
        <div>
            <SalesPersonsNavigation />
            <div className='StockOrder'>
                <div className='TopOrderPart'>
                    <h3>Order & tracks</h3>
                    <button onClick={handleClickOpen}>Order</button>
                </div>
            </div>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle sx={{ backgroundColor: '#032e69', color: 'white' }}>
                    {"Stock ordering"}
                </DialogTitle>
                <DialogContent>
                    <div className='OrderForm'>
                        <div className='entriesOrder'>
                            <div className='OrderFormA'>

                                <div>
                                    
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={products.map(item => ({ id: item.id, name: item.name, BuyingPrice: item.BuyingPrice, quantity: item.quantity,amountMl:item.amountMl,sold:item.sold }))}
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    sx={{ width: 200 }}
                                    value={product}
                                    onChange={(event, value) => {

                                        if (value) {
                                           
                                            setProduct(value.name || ''); 
                                            setProductId(value.id || ''); 
                                            setBuyingPrice(value.BuyingPrice || ''); 
                                            setSold(value.sold);
                                        } else {
                                          
                                            setProduct('');
                                            setProductId('');
                                            setBuyingPrice('');
                                            setSold('')
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Product name" />}
                                />

                                </div>

                                <div className='OrderFormEntry'>
                                    <label>Physical Count</label>
                                    <input 
                                        id='physical_count'
                                        value={physical_count}
                                        onChange={(e) => setPhysicalCount(e.target.value)}
                                    />
                                </div>

                                <div className='OrderFormEntry'>
                                    <label>Millimetre</label>
                                    <input 
                                        id='amountMl'
                                        value={amountMl}
                                        onChange={(e) => setAmountMl(e.target.value)}
                                    />
                                </div>

                            </div>
                            <div className='OrderFormB'>

                                <div className='OrderFormEntry'>
                                    <label>Order Count</label>
                                    <input 
                                        id='order_count'
                                        value={order_count}
                                        onChange={(e) => setOrderCount(e.target.value)}
                                    />
                                </div>

                                <div className='OrderFormEntry'>
                                    <label>Buying price</label>
                                    <input 
                                        id='BuyingPrice'
                                        value={BuyingPrice}
                                        onChange={(e) => setBuyingPrice(e.target.value)}
                                    />
                                </div>

                            </div>
                        </div>
                      
                        <div className='OrderForwardButton'>
                            <button onClick={() => { handleAddToList() }}><span><AddIcon /></span><span>Add to list</span></button>
                        </div>

                        <div className='DisplayList'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th> 
                            <th>Available</th>
                            <th>Order</th>
                            <th>Buying_rice</th>
                            <th>Total</th>
                            <th>id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.product}</td>
                                <td>{entry.physical_count}</td>
                                <td>{entry.order_count}</td>
                                <td>{entry.BuyingPrice}</td>
                                <td>{entry.Total_Amount}</td> {/* Display total price */}
                                <td>{entry.productId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='totalCost'>
                    <span>Total Order Cost: {totalOrderCost}</span>
                </div>
            </div>


                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={PostOrder} autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

          
        </div>
    );
};

export default StockOrder;
