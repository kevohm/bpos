import React, { useContext, useEffect, useState } from 'react'
import './TakeStock.scss'
import SalesPersonsNavigation from '../../NavigationShow/SalesPersonsNavigation'
import { motion } from 'framer-motion';
import { AuthContext } from '../../../AuthContext/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const TakeStock = ({ searchQuery }) => {

    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [productEvents, setProductsEvents] = useState([])
    const Branch = user?.Branch;
    const history = useNavigate();
    const editedBy = user?.fullname || 'Admin';
    const company_name = 'Admin';
    const product_id = id;

    const [productsInfo, setProductsInfo] = useState({
        name: '',
        category: '',
        BuyingPrice: '',
        DiscountedAmount: '',
        price: '',
        saleCategory: '',
        saleType: '',
        AddedQuantity: 0,
        OpeningStock:''
      });
    const [stockTake, setStockTake] = useState({
        OpeningStock:''
      });

    const { OpeningStock } = stockTake;

    
  const handleOnChangeStock = (e) => {
    const { name, value } = e.target;
    setStockTake({ ...stockTake, [name]: value });
  }

  const handleSubmit2 = (e) =>{

    const updatedStockInfo = {
      ...stockTake
    };
     
    if(!OpeningStock){
      alert("All values are required") 
    }else{
      if(!id){ 
        axios.post(process.env.REACT_APP_API_ADDRESS + "api/Products/addProduct", 
        productsInfo).then(() =>{
            setProductsInfo({})
      }).catch((err) => alert(err.response.data));
      alert("Case Details added successfully")
      }else{
        axios.put(process.env.REACT_APP_API_ADDRESS + `api/Products/productedit2/${id}`, 
        updatedStockInfo).then(() =>{
            setStockTake({OpeningStock:""});
            toast.success('Update Done successfully', { position: 'bottom-right' }); 
      }).catch((err) => {
        toast.error(err.response.data, { position: 'bottom-right' });
      });
      }
      
      setTimeout(() => history('/stock_take'),500);
    } 
  }



      useEffect(() => { 
        const fetchData = async () => {
          try {
            const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/Products/${id}`); 
            setStockTake(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
      }, [id,searchQuery]);

  return (
    <div>
        <SalesPersonsNavigation />

        <motion.div className='TakeStock' 
            initial={{opacity:0, y:100}}
            animate={{opacity:1, y:0}}
            transition={{delay:1.5, duration:1.5,type:'spring'}}
        >
            <div className='ProductBrief'>
                <div className='ProductImageShow'>
                    <img src={stockTake.imageUrl} alt='product_image'/>
                </div>
                <div className='BriefDetails'>
                    <ul>
                        <li>
                            <span>Product ID:</span><small>{stockTake.id}</small>
                        </li>
                        <li>
                            <span>Product location:</span><small>{stockTake.Branch}</small>
                        </li>
                        <li>
                            <span>Product Name:</span><small>{stockTake.name}</small>
                        </li>
                        <li>
                            <span>Product Name:</span><small>{stockTake.BuyingPrice}</small>
                        </li>
                        <li>
                            <span>Product Name:</span><small>{stockTake.price}</small>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='StockTakeForm'>
                <div className='form'>
                    <div className='FormInputOne'>
                        <label htmlFor='OpeningStock'>
                            Physical Count
                        </label>
                        <input 
                            name='OpeningStock'
                            id='OpeningStock'
                            placeholder='Input physical count'
                            value={stockTake.OpeningStock || ""} 
                            onChange={handleOnChangeStock}
                        />
                    </div>

                    <div className='FormInputOne'>
                        <button type='submit' onClick={handleSubmit2}>
                            Submit
                        </button>
                    </div>

                </div>
            </div>
        </motion.div>
    </div>
  )
}

export default TakeStock
