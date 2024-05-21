import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../AuthContext/AuthContext';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  
const Branches = ({ open, handleClose }) => {
    const [BranchPut,setBranchPut] = useState([]);
    const { user } = useContext(AuthContext);
    const company_id = user?.company_id || user?.id;

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/branches/${company_id}`) 
          .then(response => {
            setBranchPut(response.data);
          }) 
          .catch(error => {
            console.error('Error fetching branches', error);
          });
      }, [company_id]);  


  return (
    <div>
        <Dialog
            open={open}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            
            <DialogContent>
            <AppBar sx={{ width:'100%',backgroundColor:'#082f49' }}>
                <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <ArrowBackIosIcon sx={{color:'#fff'}}/>
                </IconButton>
                <Typography sx={{ ml: 0, flex: 1,color:'#fff',fontSize:'13px' }} variant="h6" component="div">
                    Select Shop Outlet
                </Typography>
                
                </Toolbar>
            </AppBar>
            <div className='BranchDialog'>

            <div className='DialogSerachButton'>
                <input 
                    placeholder='Search'
                    type='search'
                />
            </div>
            <ul style={{margin:'2rem 2rem'}}>
                {BranchPut.map((val) =>{
                    return(
                    <Link to={`/analytics/${val.BranchName}`} className='LinkBranch'>
                        <li>    
                            {val.BranchName}
                        </li>
                    </Link>
                    )
                })}
            </ul>
            </div>
            </DialogContent>
           
        </Dialog>
    </div>
  )
}

export default Branches
