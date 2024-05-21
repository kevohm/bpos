import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './OrderEdit.scss';
import AlphaSideBarNav from '../../../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav';
import AlphaNavBarAdmin from '../../../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin';
import { AuthContext } from '../../../../AuthContext/AuthContext';
import moment from 'moment';
import { toast } from 'react-toastify';

const OrderEdit = () => {
    const { user } = useContext(AuthContext);
    const { order_id } = useParams();
    const history = useNavigate();

    const [singleOrder, setSingleOrder] = useState({
        order_personnel: "",
        Branch: "",
        product: "",
        physical_count: '',
        order_count: '',
        BuyingPrice: '',
        Total_Amount: '',
        order_status: "",
        order_serial: "",
        product_id: '',
        quantity: "",
        amountMl: "",
        sender_name: "",
        order_date: "",
        soldCount: '',
        to_buy: '',
    });

    useEffect(() => { 
      const fetchData = async () => {
        try {
          const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/userorders/order/${order_id}`); 
          setSingleOrder(res.data[0]);
          console.log(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }, [order_id]); 


    const [stockUpdate, setStockUpdate] = useState({
      order_status: "",
      to_buy: '',
     })

     const handleOnChange = (e) =>{
      const {name, value} = e.target
      setStockUpdate({...stockUpdate,[name]:value})
    }
     

    const UpdateOrder = (e) =>{
      if(!order_id){
        toast.error("Input all values") 
      }else{
        if(!order_id){ 
          axios.post(process.env.REACT_APP_API_ADDRESS + "", 
          stockUpdate).then(() =>{
            setStockUpdate({Station:""})
        }).catch((err) => toast.err(err.response.data));
        toast.success("Update a sucess")
        }else{
          axios.put(process.env.REACT_APP_API_ADDRESS + `api/userorders/orderupdate/${order_id}`, 
          stockUpdate).then(() =>{
            setStockUpdate({order_status: "",to_buy: '',})
        }).catch((err) => toast.err(err.response.data));
        window.alert("Stock order updated successfuly")
        }
        setTimeout(() => history(`/single_order/${order_id}`),100);
      }
    }

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
                <div className='OrderEdit'>

                  <div className='OrderEditTopPart'>
                  <div className='LeftOderEdit'>

                    <div className='UserDetails'>
                      <span>Sender:</span><span>{singleOrder.sender_name}</span>
                    </div>
                    <div className='UserDetails'>
                      <span>Branch:</span><span>{singleOrder.Branch}</span>
                    </div>
                    <div className='UserDetails'>
                      <span>Order date:</span><span>{moment(singleOrder.order_date).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')}</span>
                    </div>
 
                    <div className='Mathematical'>
                      <span>Initial Order Total:</span>
                      <span style={{fontWeight:'bold'}}>KES {(parseInt(singleOrder.BuyingPrice) * parseInt(singleOrder.order_count)).toLocaleString()}.00 /=</span>
                    </div>

                    <div className='Mathematical'>
                      <span>Bought Order Total:</span>
                      <span style={{fontWeight:'bold'}}>KES {(parseInt(singleOrder.BuyingPrice) * parseInt(singleOrder.to_buy)).toLocaleString()}.00 /=</span>
                    </div>

                  </div>
                  <div className='RightOderEdit'>
                    <div className='Product'>
                      <span>Product:</span><span>{singleOrder.product}</span>
                    </div>
                    <div className='Product'>
                      <span>Declared physical count:</span><span>{singleOrder.physical_count}</span>
                    </div>
                    <div className='Product'>
                      <span>System declared:</span><span>{singleOrder.quantity}</span>
                    </div>
                    <div className='Product'>
                      <span>Ordered count:</span><span>{singleOrder.order_count}</span>
                    </div>
                    <div className='Product'>
                      <span>Current status:</span><span>  {singleOrder.order_status === "Pending" && (
                            <span className="loading-dots" style={{ animation: 'loading 2s infinite',color:"red",paddingLeft:'10px' }}>Pending ...</span>                                           
                        )}
                        {singleOrder.order_status === "Reviewed" && (
                            <span style={{ color: 'blue' }}>
                                Reviewed<span role="img" aria-label="warning">⚠️</span>
                            </span>
                        )}
                        {singleOrder.order_status === "Approved" && (
                            <span style={{ color: 'green' }}>
                                Approved<span role="img" aria-label="tick">✅</span>
                            </span>
                        )}</span>
                    </div>
                  </div>
                  </div>

                <div className='EditOrderBottom'>
                  <div className='OrderEtry'>
                    <label>Order status</label>
                    <select 
                      name='order_status'
                      id='order_status'
                      value={stockUpdate.order_status}
                      onChange={handleOnChange}
                    >
                      <option value={''}>Select</option>
                      <option>Pending</option>
                      <option>Reviewed</option>
                      <option>Approved</option>
                    </select>
                  </div>
                  <div className='OrderEtry'>
                    <label>Bought count</label>
                    <input 
                     name='to_buy'
                     id='to_buy'
                     value={stockUpdate.to_buy}
                     onChange={handleOnChange}
                    />
                  </div>

                  <div className='SubmitOrderEdit'>
                    <button onClick={UpdateOrder}>Update</button>
                  </div>
                </div>

                </div>
    </div>
    </div>
    </div>
  )
}

export default OrderEdit
