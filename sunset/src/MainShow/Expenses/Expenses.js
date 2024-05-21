import React, { useContext, useEffect, useState } from 'react';
import './Expenses.scss';
import Nav from '../NavigationShow/Nav';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent'; 
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide'; 
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { AuthContext } from '../../AuthContext/AuthContext';
import { motion } from 'framer-motion'
import SalesPersonsNavigation from '../NavigationShow/SalesPersonsNavigation';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExpenseForm = ({ handleClose }) => {
    const { user } = useContext(AuthContext);
    const [expenseAmount, setExpenseAmount] = useState(0); 
    const [description, setDescription] = useState('');
    const [expenseOptions, setExpenseOptions] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stockAmount,setStockAmount] = useState(0)
    const Branch = user?.Branch;
    const added_by = user?.fullname;
    const user_name = user?.userName;
    const company_id = user?.company_id;

    const moment = require('moment-timezone');
    moment.tz.setDefault('Africa/Nairobi');
    const date_added = moment().format('YYYY-MM-DD HH:mm:ss');

  const handleCancel = () => {
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null); 
  
      // Check if either expenseAmount or stockAmount is provided
      if (
        !(expenseAmount || stockAmount) || // Check if neither is provided
        (expenseAmount && isNaN(expenseAmount)) || // Check if expenseAmount is provided and a number
        (stockAmount && isNaN(stockAmount)) || // Check if stockAmount is provided and a number
        !description.trim()
      ) {
        setError('Please enter valid amount and description.');
        return;
      }
  
      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + 'api/expenses',
        {
          expenseAmount, 
          stockAmount, 
          description,
          added_by,
          Branch,
          company_id,
          date_added,
          user_name
        }
      );
  
      console.log('API Response:', response.data);
  
      if (response.data.success) {
        toast.success('Expense added successfully', {
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
  
  
  
 
  return (
    <div>
      <DialogTitle>{"Use this form to record an expense"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">

          <div style={{ display: "flex", flexDirection: 'column', gap: '10px' }}>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor='expenseOptions' className="block text-sm font-medium text-gray-700">Select expense type</label>
            <select 
              name='expenseOptions'
              id='expenseOptions'
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setExpenseOptions(e.target.value)}
            >
              <option>Select..</option>
              <option>General expenses</option>
              <option>Stock Purchase expense</option>
            </select>
          </div>

            {expenseOptions === 'General expenses' &&(
              <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor='expense_amount' className="block text-sm font-medium text-gray-700">General expense Amount</label>
              <input
                className="mt-1 block w-full p-2 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500"
                style={{border:'1px solid grey'}}
                type='number'
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            )}
           
            {expenseOptions === 'Stock Purchase expense' &&(
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor='expense_amount' className="block text-sm font-medium text-gray-700">Stock purchase Amount</label>
              <input
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                style={{border:'1px solid grey'}}
                type='number'
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
              />
            </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor='description' className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleCancel}
          className='bg-red-500 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-pink-500 duration-500'
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className='bg-green-500 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-indigo-400 duration-500'
        >
        {loading ? 'Submitting...' : 'Submit'}
        </button>
      </DialogActions>
    </div>
  );
};

const Expenses = () => {
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const added_by = user?.fullname;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
    /* Get the data using useEffect */
    useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `/api/expenses/${added_by}?q=${searchQuery}`)
          .then((response) => {
            setExpenses(response.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [searchQuery, added_by]);
      

  return (
    <div>
      <SalesPersonsNavigation />
      <motion.div className='Expenses' 
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{delay:1.5, duration:1.5,type:'spring'}}
      >
        <div className='topExpense'>
          <button
            className='bg-sky-900 text-white font-[Poppins] py-2 px-6 rounded md:ml-4 hover:bg-sky-700 duration-500'
            onClick={handleClickOpen}
          >
            Add expenses
          </button>
        </div>
        <div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <ExpenseForm handleClose={handleClose} />
          </Dialog>
        </div>
        <div>
        <div style={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start'}}>
        <input 
        placeholder='search ...' 
        style={{borderBottom:'1px solid grey',fontWeight:'bold'}}
        onChange={handleInputChange}
        value={searchQuery}
        />
        </div>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table" id="table-to-export-mpesa">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Attendant</TableCell>
                    <TableCell>date_added</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((expense,index) =>{
                    return(
                      
                      <TableRow>
                        <TableCell style={{textTransform:'uppercase'}}>{expense.unique_code}</TableCell>
                        <TableCell>
                            {expense.expense_amount} 
                        </TableCell>
                        <TableCell style={{ whiteSpace: 'nowrap'}}>{expense.description}</TableCell>
                        <TableCell>{expense.added_by}</TableCell>
                        <TableCell>{moment(expense.date_added).format('MMMM D, YYYY')}</TableCell>
                      
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </motion.div>
    </div>
  );
};

export default Expenses;
