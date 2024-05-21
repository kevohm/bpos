import React from 'react'
import Navigation from '../../pages/NavOfficial/Navigation'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import './Messages.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Messages = () => {
  return (
    <div className="home">
    <div className='HomeDeco'>
    <Navigation />
    
    <div className="homeContainer">
      <NavigationBar /> 

    <div className='Messages'>

        <div className='messageConsole'></div>

        <div className='messageSend'>
            <div className='SendTop'>
                <span>Read quick guide</span>
                <span>WhatsApp</span>
            </div>

            <div className='SendBottom'>
                <input 
                    placeholder='Send a message'
                />
                <span><FontAwesomeIcon icon={faPaperPlane} className='icon'/></span>
            </div>
        </div>
    </div>

    </div>
    </div>
    </div>
  )
}

export default Messages