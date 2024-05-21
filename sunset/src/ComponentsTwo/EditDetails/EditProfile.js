import React from 'react'
import './EditProfile.scss'
import Navigation from '../../pages/NavOfficial/Navigation'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import { Link } from 'react-router-dom'

const EditProfile = () => {
  return (
    <div className="home">
        <div className='HomeDeco'>
            <Navigation />
            
            <div className="homeContainer">
            <NavigationBar /> 

                <div className='EditForm'>
                    <div className='FormUpdate'>
                        <div className='EditEntries'>
                            <label htmlFor='Name'>Name</label>
                            <input />
                        </div>
                        <div className='EditEntries'>
                            <label htmlFor='Email'>Email</label>
                            <input />
                        </div>
                        <div className='EditEntries'>
                            <label htmlFor='Phone'>Phone</label>
                            <input />
                        </div>
                        <div className='EditEntries'>
                            <label htmlFor='Password'>New Password</label>
                            <input />
                        </div>

                        <div className='ButtonUpdate'>
                            <button>Update</button>
                        </div>
                    </div>

                    <div className='Suggestions'>
                            <Link to={'/messages'} className='LinkSuggestions'>
                                <span>Suggest a feature</span> <br /> <span>To be added for your convinience</span>
                            </Link>
                            <div className='borderCenter'></div>
                            <div className='DeleteAccount'>
                                <button>Delete my Account</button>
                            </div>
                    </div>

                  

                </div>

            </div>
        </div>
    </div>
  )
}

export default EditProfile