import React, { useEffect, useState } from 'react'
import './ProductReg.scss'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

 
const ProductReg = () => { 
 
    const history = useNavigate();

    const [ProductName, setProductName] = useState('');
    const [ProductCategory, setProductCategory] = useState('');
    const [Quantity, setQuantity] = useState(0);
    const [Price, setPrice] = useState(0);
    const [amountMl,setAmountml] = useState('');
    const [Branch,setBranch] = useState('')
    const [totalAmount, setTotalAmount] = useState(0);

    const handleProductNameChange = (event) => {
    setProductName(event.target.value);
    };

    const handleProductCategoryChange = (event) => {
    setProductCategory(event.target.value);
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

    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post(process.env.REACT_APP_API_ADDRESS + 'api/Products/addProduct', {
        name: ProductName,
        category: ProductCategory,
        quantity: Quantity,
        price: Price,
        amountMl:amountMl,
        Branch:Branch
        });

        const { totalAmount } = response.data;
        setTotalAmount(totalAmount);
        setProductName('');
        setProductCategory('');
        setQuantity(0);
        setPrice(0);
        setAmountml(0);
        setBranch('');

        window.alert('Product added successfully'); 
        history.push('/index'); 
    } catch (error) {
        console.error('Error submitting data:', error);
    }
    };


    const [dataBranch, setDataBranch] = useState([]); 

    const loadData = async () => {
      const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "api/analytics/branches");
      setDataBranch(response.data);
    }; 
  
    useEffect(() =>{
      loadData();
    }, []);



  return (
    <div className='RegistrationForm'> 
        <form  onSubmit={handleSubmit}>
            <div className='InputDesign'>

            <div className='Inputs'>
                <label htmlFor='ProductName'>Product Name</label>
                <input 
                    className='form-control'
                    type='text'
                    id='ProductName'
                    name='ProductName'
                    placeholder='Tusker etc'
                    value={ProductName || " "}
                    onChange={handleProductNameChange}
                />
            </div>

            <div className='Inputs'>
            <label htmlFor='ProductCategory'>Product Category</label>
            <select 
                className='form-control'
                id='ProductCategory'
                name='ProductCategory'
                value={ProductCategory || " "}
                onChange={handleProductCategoryChange}
            >
                <option>Select...</option>
                
                <option>Beer</option>
                <option>Wine</option>
                <option>Vodka</option>
                <option>Gin</option>
                <option>Liquor</option>
                <option>Tequila</option>
                <option>Whisky</option>
                <option>Spirits</option>
                <option>Brandy</option>
                <option>Rums</option>
                <option>Cigarettes</option>
                <option>Other Items</option>
            </select>
            </div>

            </div>

            <div className='InputDesign'>
            
            <div className='Inputs'>
                <label htmlFor='Quantity'>Number of Items / Packets</label>
                <input 
                    type="number"
                    id='Quantity'
                    name='Quantity'
                    value={Quantity || " "}
                    onChange={handleQuantityChange}
                    min="1"
                />
            </div>

            <div className='Inputs'>
                <label htmlFor='Price'>Product Price</label>
                <input 
                    type="number"
                    id='Price'
                    name='Price'
                    min="0"
                    value={Price || " "}
                    onChange={handlePriceChange}
                />
            </div>
            </div>
            
            <div className='InputDesign'>
            {ProductCategory !== 'Cigarettes' &&
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
            }

            <div className='Inputs'>
            <label htmlFor='Branch'>Distribute to Branch</label>
            <select 
                className='form-control'
                id='Branch'
                name='Branch'
                value={Branch || " "}
                onChange={handleBranch}
            >
                <option>Select...</option>

                {dataBranch.map((val) =>{
                    return(
                        <option>{val.id}</option>
                    )
                })}

            </select>
            </div>
            </div>
            
           

            <div className='Buttons'>
                <button className='SubmitButton' type='submit'>Add Product</button>
            </div>

        </form>
    </div>
  )
}

export default ProductReg