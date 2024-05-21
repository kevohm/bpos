import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import './UserProfile.scss';
import profile from './profile.png'
import { AuthContext } from '../../../../AuthContext/AuthContext';
import moment from 'moment';
import { useParams } from 'react-router-dom';
 
const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const {id} = useParams();
    const [userInformation, setUserInformation] = useState({
        userName:'',
        password:'',
        confirmPassword: ''
    })
 
    const [error, setError] = useState('');
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUserInformation({ ...userInformation, [name]: value });
      }

// user information
    useEffect(() => {  
        const fetchData = async () => { 
          try {
            const res = await axios.get(process.env.REACT_APP_API_ADDRESS + `api/Auth/staffmembers/${id}`); 
            setUserInformation(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchData();
      }, [id]);

      const shiftedStartTime = moment(userInformation.shift_start_time).subtract(3, 'hours');
      const shiftedEndTime = moment(userInformation.shift_end_time).subtract(3, 'hours');
      const duration = moment.duration(shiftedEndTime.diff(shiftedStartTime));
      const totalHoursWorked = duration.asHours();
      const hours = Math.floor(totalHoursWorked);
      const minutes = Math.floor((totalHoursWorked - hours) * 60);
      const seconds = Math.floor(((totalHoursWorked - hours) * 60 - minutes) * 60);
      const formattedTotalHoursWorked = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      const handleSubmit = (e) => {
        e.preventDefault();
        if (userInformation.password !== userInformation.confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
            
        }
    };


  return (
    <div className='UserProfileMain'> 
        <div className='TimeShift'>
            <div className='ShiftClass'>
                <span>Shift status</span>
                <small
                    style={{ color: userInformation.shift_start_time > userInformation.shift_end_time ? 'green' : 'red' }}
                >{userInformation.shift_start_time > userInformation.shift_end_time ? 'Shift on' : 'Shift ended'}
                </small>
            </div>
            <div className='ShiftClass'>
                <span>Shift start</span>
                <small>: {moment(userInformation.shift_start_time).subtract(3, 'hours').format('h:mm:ss a')}</small>
            </div>
            <div className='ShiftClass'>
                <span>Shift end</span>
                <small
                style={{ color: userInformation.shift_start_time > userInformation.shift_end_time ? 'red' : 'inherit', fontWeight: userInformation.shift_start_time > userInformation.shift_end_time ? 'bold' : 'inherit' }}
                >: {userInformation.shift_start_time > userInformation.shift_end_time ? 'Ongoing' : moment(userInformation.shift_end_time).subtract(3, 'hours').format('h:mm:ss a')}</small>
            </div>
            <div className='ShiftClass'>
                <span>Shift length</span>
                <small>{formattedTotalHoursWorked}</small>
            </div>
        </div>
        <div className='Head'>
            <h1>User section</h1>
        </div>
        <div className='UserProfile'>
        
        <div className='ProfilePicture'>
            <img src={profile} alt='Profile'/>
        </div>

        <div className='PersonalInformation'>
            <div className='PersonalTop'>
                <div className='Header'><h1>Personal Information</h1></div>
                <div className='PersonalA'>
                    <div className='NameDetails'>
                        <h3>Name</h3>
                        <span>{userInformation.fullname}</span>
                    </div>
                    <div className='Contact'>
                        <h3>outlet</h3>
                        <span>{userInformation.Branch}</span>
                    </div>
                </div>
                <div className='PersonalA'>
                    <div className='NameDetails'>
                        <h3>User name</h3>
                        <span>{userInformation.userName}</span>
                    </div>
                  
                </div>
            </div>

            <div className='PersonalTop'>
                <div className='Header'><h1>Company Information</h1></div>
                <div className='PersonalA'>
                    <div className='NameDetails'>
                        <h3>Current company</h3>
                        <span>{userInformation.company_name}</span>
                    </div>
                </div>
            
            </div>


        </div>

        <div className='ChangePassword'>
            <div className='Header'><h1>Change password</h1></div>
            <div className='PasswordForm'>

                <div className='InputA'>
                    <lable>User name</lable>
                    <input 
                        type='email'
                        name='userName'
                        id='userName' 
                        value={userInformation.userName} 
                        onChange={handleOnChange}
                    />
                </div>

                <div className='InputA'>
                    <lable>New password</lable>
                    <input 
                        type='password'
                        name='password'
                        id='password' 
                        value={userInformation.password} 
                        onChange={handleOnChange}
                    />
                </div>

                <div className='InputA'>
                    <lable>Re-type new password</lable>
                    <input 
                        type='password'
                        name='confirmPassword'
                        value={userInformation.confirmPassword}
                        onChange={handleOnChange}
                    />
                </div>
                {error && <div><span style={{color:'red'}}>{error}</span></div>}
                <div className='submitButton'>
                    <button onClick={handleSubmit}>Change password</button>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default UserProfile
