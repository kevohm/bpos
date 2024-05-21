import React from 'react'
import Nav from '../NavigationShow/Nav'
import SidebarShow from '../sideBar/SideBarShow'
import DailySales from './DailySales'
import './ReportView.scss'
import SalesPersonsNavigation from '../NavigationShow/SalesPersonsNavigation'

const ReportView = () => {
  return (
    <div>
        <SalesPersonsNavigation />
        <div className='ReportView'>
            <DailySales />
        </div>
    </div>
  )
}

export default ReportView