const [productName, setProductName] = useState('');
const [productCategory, setProductCategory] = useState('');
const [quantity, setQuantity] = useState(1);
const [price, setPrice] = useState(0);
const [amountMl,setAmountml] = useState('');
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

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(process.env.REACT_APP_API_ADDRESS + 'api/Products/addProduct', {
      name: productName,
      category: productCategory,
      quantity: quantity,
      price: price,
      amountMl:amountMl
    });

    const { totalAmount } = response.data;
    setTotalAmount(totalAmount);
    setProductName('');
    setProductCategory('');
    setQuantity(1);
    setPrice(0);
    setAmountml(0);

    alert("Product added successfully")
    setTimeout(() => history('/index'),700);
  } catch (error) {
    console.error('Error submitting data:', error);
  }
};