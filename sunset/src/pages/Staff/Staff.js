import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../Home/home.scss'
import './Staff.scss'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark,faTrash,faUserPen } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import Navigation from '../NavOfficial/Navigation';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    borderRadius:'10px',
    transition:'2s',
    boxShadow: 24,
    p: 4,
  };

const Staff = () => {


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [fullname,setFullName] = useState([]);
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState(''); 
    const [phoneNumber, setPhone] = useState(''); 
    const [residence,setResidence] = useState('');
    const [JobRole,setJobRole] = useState('');
    const [Branch,setBranch] = useState('');

    const history = useNavigate();

    const SubmitEvent = () =>{
        axios.post(process.env.REACT_APP_API_ADDRESS + 'api/Auth/register', 
        {fullname:fullname,userName:userName,role:role,password:password,
            phoneNumber:phoneNumber,residence:residence,JobRole:JobRole,Branch:Branch,
      }).then(() => {
        
      });
      alert("User added successfully")
      setTimeout(() => history('/index'),700);
      };

      const [data, setData] = useState([]); 

      const loadData = async () => {
        const response = await axios.get(process.env.REACT_APP_API_ADDRESS + "api/Auth/staffmembers");
        setData(response.data);
      }; 
    
      useEffect(() =>{
        loadData();
      }, []);

    const deletePersonalRecord = (id) =>{
    if(window.confirm("Are you sure you want to delete the client details?")){
      axios.delete(process.env.REACT_APP_API_ADDRESS + `api/Auth/staffmembers/${id}`);
      toast.success("Staff record deleted successfully");
      setTimeout(() => loadData(), 300)
    }
   }
    


  return (
    <div className='home'>
    <div className='HomeDeco'>
    <Navigation />
    <div className="homeContainer">
      <NavigationBar />
                <div style={{
                    marginTop:'20px',
                    paddingRight:'30px',
                    paddingLeft:'30px'
                }}>
                <div style={{
                    display:'flex',
                    justifyContent:'flex-end',
                    paddingLeft:'50px',
                    paddingRight:'50px'
                }}>
                <button onClick={handleOpen} style={{
                    padding:'10px 20px',
                    borderRadius:'10px',
                    backgroundColor:'purple',
                    color:'white',
                    cursor:'pointer',
                    border:'none',
                    fontWeight:'500'
                }}>Add Users</button>
                </div>
                <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                
                <Box sx={style}>
                <div style={{
                    display:'flex',
                    justifyContent:'space-between'
                }}>
                <div><p style={{fontWeight:'bold',color:'grey'}}>Add employee</p></div>
                <button style={{
                    border:'none',
                    cursor:'pointer',
                    color:'red',
                    fontWeight:'bold',
                    fontSize:'20px'
                }} 
                onClick={handleClose}
                ><FontAwesomeIcon icon={faXmark} /></button>
                
                </div>
                <hr />

                <div className='Staff'>
                <div className='Register'>
                
                <form>
                    <div className='Input'>
                        <label htmlFor='fullname'>Full Name</label>
                        <input 
                            name='fullname'
                            id='fullname'
                            value={fullname || " "}
                            onChange={(e) =>{
                              setFullName(e.target.value);
                          }}
                        />
                    </div>

                    <div className='Input'>
                        <label htmlFor='phoneNumber'>Phone Number</label>
                        <input 
                            name='phoneNumber'
                            id='phoneNumber'
                            value={phoneNumber || ""}
                            onChange={(e) =>{
                            setPhone(e.target.value);
                            }}
                        />
                    </div>

                    <div className='Input'>
                        <label htmlFor='userName'>User Name</label>
                        <input 
                            name='userName'
                            id='userName'
                            value={userName || ""}
                            onChange={(e) =>{
                            setUserName(e.target.value);
                            }}
                        />
                    </div>

                    <div className='Input'>
                        <label htmlFor='residence'>Residence</label>
                        <input 
                            name='residence'
                            id='residence'
                            value={residence || ""}
                            onChange={(e) =>{
                            setResidence(e.target.value);
                            }}
                        />
                    </div>

                    <div className='Input' style={{display:'none'}}>
                        <label htmlFor='role'>User Role</label>
                        <select 
                            name='role'
                            id='role'
                            value={role || ""}
                            onChange={(e) =>{
                            setRole(e.target.value);
                            }}
                        >
                            <option>Select...</option>
                            <option>Admin</option>
                            <option>Normal User</option>
                        </select>
                    </div>

                    <div className='Input'>
                    <label htmlFor='JobRole'>Job Role </label>
                    <select 
                        name='JobRole'
                        id='JobRole'
                        value={JobRole || ""}
                        onChange={(e) =>{
                        setJobRole(e.target.value);
                        }}
                    >
                        <option>Select...</option>
                        <option>Manager</option>
                        <option>Accountant</option>
                        <option>Attendant</option>
                        <option>Cashier</option>
                        <option>Security</option>
                        
                    </select>
                    </div>

                    <div className='Input'>
                        <label htmlFor='Branch'> Branch Name  </label>
                        <input
                        id="Branch"
                        name="Branch"
                        value={Branch || ""}
                        onChange={(e) =>{
                        setBranch(e.target.value);
                        }}
                        />
                    </div>
                    
                    <div className='Input'>
                        <label htmlFor='password'> Password  </label>
                        <input
                        type='password'
                        id="password"
                        name="password"
                        value={password || ""}
                        onChange={(e) =>{
                        setPassword(e.target.value);
                        }}
                        />
                    </div>

                <div className='Buttons'>
                    <button className='SubmitButton' onClick={SubmitEvent}>Add User</button>
                </div>

                </form>
                </div>
                </div>
                </Box>
                
                </Modal>

                <div  className='Table'>
                <TableContainer  component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table'>
                    <TableHead className='head'>
                        <TableRow className='rows'>
                            <TableCell className="tableCell rows">#</TableCell>
                            <TableCell className="tableCell rows">Name</TableCell>
                            <TableCell className="tableCell rows">User Name</TableCell>
                            <TableCell className="tableCell rows">Job Category</TableCell>
                            <TableCell className="tableCell rows">Phone</TableCell>
                            <TableCell className="tableCell rows">Branch</TableCell>
                            <TableCell className="tableCell rows">Action</TableCell>
                        </TableRow>
                    </TableHead>
        
                    <TableBody>
                    {data.map((val,index) =>{
                        return(
                            <TableRow key={val.id}>
                             <TableCell className="tableCell rows">{index + 1}</TableCell>
                                <TableCell className="tableCell rows">{val.fullname}</TableCell>
                                <TableCell className="tableCell rows">{val.userName}</TableCell>
                                <TableCell className="tableCell rows">{val.JobRole}</TableCell>
                                <TableCell className="tableCell rows">{val.phoneNumber}</TableCell>
                                <TableCell className="tableCell rows">{val.Branch}</TableCell>
                                <TableCell className="tableCell rows">
                                
                                <Link to={`/updateUser/${val.id}`}>
                                    <FontAwesomeIcon icon={faUserPen} style={{color:'purple',paddingRight:'5px',fontSize:'18px'}}/>
                                </Link>

                                <button onClick={() => deletePersonalRecord(val.id)} style={{
                                    border:'none',
                                    backgroundColor:'transparent',
                                    cursor:'pointer',
                                }}>
                                    <FontAwesomeIcon icon={faTrash} style={{color:'red',paddingLeft:'5px',fontSize:'18px'}}/>
                                </button>
                                    
                                </TableCell>
                            </TableRow>
                        )
                        
                    })}
                       
        
                    </TableBody>
                </Table>
                </TableContainer>
                </div>

            </div>
      </div>
      </div>
      </div>
   

  )
}

export default Staff