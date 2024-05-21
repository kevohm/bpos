import React, { useState } from 'react'
import './ClientSignUp.scss'
import './CheckBoxContainer.scss'
import { motion } from 'framer-motion' 
import AlphaNavigation from '../../NavigationAlpha/AlphaNavigation';

const Checkbox = ({ label, isChecked, onChange }) => {
    return (
      <motion.label className="checkbox-label" 
      animate={{x:0}}
      transition={{type:'spring',stiffness:'300'}}
      whileHover={{
      scale:1.2,
      originX:0,
    }}
      >
        <input type="checkbox" checked={isChecked} onChange={onChange} />
        {label}
      </motion.label>
    );
  };

const ClientSingUp = () => {

    const [checkboxes, setCheckboxes] = useState({
        LiquorShop: false,
        Restaurant: false,
        Supermarket: false,
        Pharmacy: false,
        Hospital: false,
        LawFirm: false,
        Construction: false,
        RealEstate: false,
        Hardware: false,
        KilimoManager: false,
      });

      const handleCheckboxChange = (checkboxName) => {
        setCheckboxes((prevCheckboxes) => ({
          ...prevCheckboxes,
          [checkboxName]: !prevCheckboxes[checkboxName],
        }));
      };

      
  return (
    <div>
        <AlphaNavigation />
        <div className='split-screen2'>
            <motion.div className='leftScreen'
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{delay:1.0, duration:1.0}}
            >
                <section className='copy'>
                    <h1>Hello, Friend!</h1>
                    <p>Start your management revolution with us.</p>
                </section>
            </motion.div>
            <motion.div className='rightScreen' 
                initial={{x:'100vw'}}
                animate={{x:0}}
                transition={{type:'spring', delay: 1.0, stiffness:'50'}}
            >
                <form>
                    <section className='copy'>
                        <h2>Request for a quote</h2>
                        <div className='login-container'>
                            <p>Already have an account? <a href='/public/client-login'><strong>Sign In</strong></a></p>
                        </div>
                    </section>
                    <div className='input-container'>
                        <div className='name'>
                            <label htmlFor='fullname'>Company Name</label>
                            <motion.input
                                type='text'
                                id='fullname'
                                name='fullname'
                                placeholder='Your name'
                                animate={{x:0}}
                                transition={{type:'spring',stiffness:'300'}}
                                whileHover={{
                                scale:1.1,
                                }}
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <div className='email'>
                            <label htmlFor='email'>Company Email</label>
                            <motion.input 
                                type='email'
                                id='email'
                                name='email'
                                placeholder='example@gmail.com'
                                animate={{x:0}}
                                transition={{type:'spring',stiffness:'300'}}
                                whileHover={{
                                scale:1.1,
                                }}
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <div className='password'>
                            <label htmlFor='password'>Company Size (Staff members)</label>
                            <motion.input 
                                id='password'
                                name='password'
                                placeholder='Number of staff'
                                animate={{x:0}}
                                transition={{type:'spring',stiffness:'300'}}
                                whileHover={{
                                scale:1.1,
                                }}
                            />
                        </div>
                    </div> 

                    <div className='input-container'>
                        <div className='password'>
                            <label htmlFor='password'>Company Size (Number of branches)</label>
                            <motion.input 
                                id='password'
                                name='password'
                                placeholder='Number of branches'
                                animate={{x:0}}
                                transition={{type:'spring',stiffness:'300'}}
                                whileHover={{
                                scale:1.1,
                                }}
                            />
                        </div>
                    </div> 

                    <div className="checkbox-container">
                        <span>Which of our modules are you interested in?</span>
                        {Object.entries(checkboxes).map(([key, value]) => (
                            <Checkbox
                            key={key}
                            label={key}
                            isChecked={value}
                            onChange={() => handleCheckboxChange(key)}
                            />
                        ))}
                    </div>  


                    {/* <div className='input-control'>
                        <div className='cta'>
                            <label className='checkbox-container'>
                                <input type='checkbox'/>
                                <span className='checkmark'></span>
                                Sign up for email updates.
                            </label>
                        </div>
                    </div>
                    */}
                    <motion.button className='signup-btn' type='submit' 
                        animate={{x:0}}
                        transition={{type:'spring',stiffness:'300'}}
                        whileHover={{
                            scale:1.1,
                        }}
                    >Request for a Quote</motion.button>
                    {/* <section className='copy'>
                        <div className='legal'>
                            <p>
                                <span>
                                    By continuing, you agree to accept our <br />
                                    <a href='/privacy-policy'>Privacy Policy</a> &amp; <a href='/service-terms'>Terms of Service</a>.
                                </span>
                            </p>
                        </div>
                    </section> */}
                </form>
            </motion.div>
        </div>
    </div>
  )
}

export default ClientSingUp
