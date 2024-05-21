import React from 'react' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGauge } from '@fortawesome/free-solid-svg-icons'
import { faWarehouse,faFileInvoice,faSort,faPerson,faListCheck,faChartSimple,faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import LogoutButton from '../../AuthContext/LogoutButton'


function SideBar() {
  return (
    <div className='sidebar'> 
        <div className='top'>
            <button>Sunset <br/> on the rye</button>
        </div>
        <hr/>
        <div className="center">
            <ul>
            
            <a href="/index" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faGauge} className='icon'/>
              <span>Dashboard</span>
            </li>
            </a>

            <a href="/productsale" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faWarehouse} className='icon'/>
              <span>Product Sale</span>
            </li>
            </a>

            <a href="/inventory" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faWarehouse} className='icon'/>
              <span>Inventory</span>
            </li>
            </a>

            <a href="/distribution" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faFileInvoice} className='icon'/>
              <span>Distribution</span>
            </li>
            </a>

            <a href="/orders" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faSort} className='icon'/>
              <span>Orders</span>
            </li>
            </a>

            <a href="/staff" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faPerson} className='icon'/>
              <span>Staff</span>
            </li>
            </a>

            <a href="/humanresource" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faListCheck} className='icon'/>
              <span>Human Resource</span>
            </li>
            </a>

            <a href="/analytics" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faChartSimple} className='icon'/>
              <span>Reporting & Analytics</span>
            </li>
            </a>

            <a href="/Auth" style={{ textDecoration: "none" }}>
            <li>
            <FontAwesomeIcon icon={faRightFromBracket} className='icon'/>
              <span><LogoutButton /></span>
            </li>
            </a>


            </ul>
        </div>
    </div>
  )
}

export default SideBar