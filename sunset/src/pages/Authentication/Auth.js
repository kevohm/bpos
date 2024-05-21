import React, { useContext, useState } from 'react';
import './Auth.scss';
import Login from './login.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'; 

const Auth = () => {
  const [open, setOpen] = React.useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_API_ADDRESS + 'api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        const { token } = await response.json();

        // Call the login function from AuthContext with the token
        login(token);

        // Redirect to the desired page after successful authentication
        navigate('/index');
      } else {
        setError('Invalid username or password');
        setOpen(true); // Show the Snackbar when there is an error
      }
    } catch (error) {
      setError('An error occurred');
      setOpen(true); // Show the Snackbar when there is an error
      console.error('Login error:', error);
    }
  };

  return (
    <div className="Auth">

    <div className='Headers'><span><a href='/'>Sunset</a></span></div>
      
      <div className="LoginPage">
        <div className="LoginImage">
          <img src={Login} alt="" />
        </div>

        <div className="FormLog">
          <div className='FormSelf'>
          <div className="businessName">
            <span>Sign in</span>
          </div>

          <div className="Entry">
         
            <input 
            id="userName" 
            name="userName" 
            type="email" 
            value={userName} 
            placeholder='Username'
            onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div className="Entry">

          <div className="PasswordShow">
          <div className="InputWithButton">
            <input
              id="password"
              name="password"
              type={passwordShown ? 'text' : 'password'}
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={togglePassword}>
              <FontAwesomeIcon icon={passwordShown ? faEye : faEyeSlash} className='IconShow'/>
            </button>
          </div>
        </div>
        
          </div>

          <div className="SubmitButton">
              <button
                type="submit"
                onClick={handleFormSubmit}
                >
              Sign in
            </button>
            <span>Forgot password?</span>
          </div>

          <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={error && <p>{error}</p>} action={action} anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}/>
          </div>
        </div>
      </div>
      </div>

    </div>
  );
};

export default Auth;
