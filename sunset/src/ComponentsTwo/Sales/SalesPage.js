import React from 'react'
import Navigation from '../../pages/NavOfficial/Navigation'
import NavigationBar from '../../components/NavigationBar/NavigationBar'
import './Styles/SalesPage.scss'
import ProductsShow from '../../MainShow/Products/ProductsShow'

const SalesPage = () => {
  return (
    <div className="home">
    <div className='HomeDeco'>
    <Navigation />
    
    <div className="homeContainer">
      <NavigationBar />
    <div className='SalesPage'>
      <ProductsShow />
    </div>
    </div></div></div>
  )
}

export default SalesPage