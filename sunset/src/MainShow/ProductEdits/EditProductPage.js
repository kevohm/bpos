import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../AuthContext/AuthContext';
import Nav from '../NavigationShow/Nav';
import SidebarShow from '../sideBar/SideBarShow';
import './EditProduct.scss'
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';


const EditProductPage = ({ searchQuery }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const history = useNavigate();

  const [productEditOptions, setProductEditOptions] = useState('')

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

  const editedBy = user?.fullname
  const { price } = productsInfo;
 
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProductsInfo({ ...productsInfo, [name]: value });
  }

  const handleOnChangeStock = (e) => {
    const { name, value } = e.target;
    setStockTake({ ...stockTake, [name]: value });
   
  }
  
  

  const handleSubmit = (e) =>{

    const updatedProductInfo = {
      ...productsInfo,
      editedBy: editedBy,
    };
     
    if(!price){
      alert("All values are required") 
    }else{
      if(!id){ 
        axios.post(process.env.REACT_APP_API_ADDRESS + "api/Products/addProduct", 
        productsInfo).then(() =>{
            setProductsInfo({})
      }).catch((err) => alert(err.response.data));
      alert("Case Details added successfully")
      }else{
        axios.put(process.env.REACT_APP_API_ADDRESS + `api/Products/productedit/${id}`, 
        updatedProductInfo).then(() =>{
            setProductsInfo({name:"",
                            category:"",
                            BuyingPrice:"",
                            DiscountedAmount:"",
                            price:"",saleCategory:"",
                            saleType:"",AddedQuantity:"",
                            OpeningStock:""});
            toast.success('Update Done successfully', { position: 'top-right' }); 
      }).catch((err) => {
        toast.error(err.response.data, { position: 'top-right' });
      });
      }
      
      setTimeout(() => history('/index'),700);
    } 
  }

  const handleSubmit2 = (e) =>{

    const updatedStockInfo = {
      ...stockTake
    };
     
    if(!price){
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
            toast.success('Update Done successfully', { position: 'top-right' }); 
      }).catch((err) => {
        toast.error(err.response.data, { position: 'top-right' });
      });
      }
      
      setTimeout(() => history('/index'),700);
    } 
  }



  

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/Products/${id}`); 
        setProductsInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id,searchQuery]);  


  


  return (
    <div>
        <Nav />
{/*         
        <SidebarShow /> */}

        <div className='EditMain'>

        <div className='BranchName'> 
          <span>{productsInfo.Branch}</span>
        </div>

        <div className='Editproduct'>

        

        <div className='EditViewImage'>

            <div className='ImagerHeader'>
                <h2>{productsInfo.name} : <span>{productsInfo.quantity}</span></h2>
            </div>

           <div className='ImageItself'><img src={productsInfo.imageUrl} alt={productsInfo.name}/></div> 
          
          

        </div>

        <div className='EditParticulars'>

            <div className='FormEdit'> 
                <form className='FormIputs'>
                    <div className='EditInput'>
                        <label htmlFor='name'>Product Name:</label>
                        <input 
                            name='name'
                            id='name'
                            value={productsInfo.name || " "}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor='productEditOptions' className="block text-sm font-medium text-gray-800">Select stock edit type</label>
                      <select 
                        name='productEditOptions'
                        id='productEditOptions'
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        onChange={(e) => setProductEditOptions(e.target.value)}
                      >
                        <option>Select..</option>
                        <option>New Product Quantity</option>
                        <option>Stock taking</option>
                      </select>
                    </div>

                    {productEditOptions === "New Product Quantity" &&(
                      <div className='EditInput'>
                        <label htmlFor='AddedQuantity'>New Product Quantity:</label>
                        <input 
                        name='AddedQuantity'
                        id='AddedQuantity' 
                        value={productsInfo.AddedQuantity} 
                        onChange={handleOnChange}
                        /> 
                      </div> 
                    )}
                   
                    {productEditOptions === "Stock taking" &&(
                    <div className='EditInput'>
                      <label htmlFor='OpeningStock'>Stock taking(current stock count):</label>
                      <input 
                      name='OpeningStock'
                      id='OpeningStock' 
                      value={stockTake.OpeningStock || ""} 
                      onChange={handleOnChangeStock}
                      /> 
                    </div>
                    )}


                    {user && user.role === 'Admin' &&(
                    <div className='EditInput'>
                        <label htmlFor='name'>Product buring price:</label>
                        <input 
                            name='BuyingPrice'
                            id='BuyingPrice'
                            value={productsInfo.BuyingPrice || " "}
                            onChange={handleOnChange}
                        />
                    </div>
                    )}
                    {user && user.role === 'Admin' &&(
                    <div className='EditInput'>
                        <label htmlFor='name'>Product price:</label>
                        <input 
                            name='price'
                            id='price'
                            value={productsInfo.price || " "}
                            onChange={handleOnChange}
                        />
                    </div>
                    )}

                    {user && user.role === 'Admin' &&(
                    <div className='EditInput'>
                        <label htmlFor='name'>Product discount:</label>
                        <input 
                            name='DiscountedAmount'
                            id='DiscountedAmount'
                            value={productsInfo.DiscountedAmount || " "}
                            onChange={handleOnChange}
                        />
                    </div>
                    )}

                    {productEditOptions !== "Stock taking" &&(
                    <div className='ButtonEdit'><button onClick={() => handleSubmit()}>Save changes</button></div>
                    )}

                    {productEditOptions === "Stock taking" &&(
                      <div className='ButtonEdit'><button onClick={() => handleSubmit2()}>Save stock</button></div>
                    )}

                </form>
            </div>

            


        </div>
        
        </div>
  
     

      

      </div>
    </div>
  );
};

export default EditProductPage;
