import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../AuthContext/AuthContext';
import { motion } from 'framer-motion';
import { FaEdit } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom'
import 'slick-carousel/slick/slick-theme.css';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import SalesPersonsNavigation from '../../NavigationShow/SalesPersonsNavigation';
import axios from 'axios';
import './StockTaking.scss';
import StockSheet from '../../../components/BranchAnalyitcs/StockSheet/StockSheet';


const StockTaking = () => {

    const [analyticsData, setAnalyticsData] = useState([]);
    const { user } = useContext(AuthContext);
    const Branch = user?.Branch;
    const [query, setQuery] = useState('');
    const currentSeller = user?.fullname;


     
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/${Branch}?q=${query}`)
      .then(response => {
        setAnalyticsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching branch analytics:', error);
      });
  }, [Branch,query]);

  return (
    <div>
      <SalesPersonsNavigation />

      <motion.div className='StockTaking' 
         initial={{opacity:0, y:100}}
         animate={{opacity:1, y:0}}
         transition={{delay:1.5, duration:1.5,type:'spring'}}
      >
        <div className='StockTakeHeader'>
            <h3>Hello {currentSeller}</h3>
            <span>Click the <small> <FaEdit/></small> icon to proceed to stock taking</span>
        </div>

        <div className='DownloadStockSheet'>
            <StockSheet />
        </div>
        
        <div className='TableProducts'>
        <DataGrid
            style={{padding:'20px'}}
                rows={analyticsData.map((product, index) => ({ ...product, indexId: index + 1 }))}
                columns={[
                    { field: 'indexId', headerName: 'ID', width: 90 },
                    {
                        field: 'actions',
                        headerName: 'Action',
                        width: 100, 
                        renderCell: (params) => (
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'15px'}}>

                                    {/* Edit button */}
                                    <Link to={`/product_count/${params.row.id}`}>
                                    <button style={{ color: 'green', border: 'none', cursor: 'pointer' }}>
                                        <FaEdit
                                            style={{
                                                cursor: 'pointer',
                                                marginLeft: '4px',
                                            }} 
                                        />
                                    </button> 
                                </Link>

                            </div>
                        ),
                    },
                    {
                        field: 'imageUrl',
                        headerName: 'Image',
                        width: 120,
                        renderCell: (params) => (
                            <img
                                src={params.row.imageUrl}
                                alt={params.row.name}
                                style={{ width: '60px', height: '60px', objectFit: 'cover',borderRadius:'50%',padding:"5px 5px",background:'transparent' }}
                            />
                        ),
                    },
                    { field: 'name', headerName: 'Name', width: 200 },
                    { field: 'amountMl', headerName: 'Ml', width: 120 },
                    { field: 'BuyingPrice', headerName: 'Buying Price', width: 120 },
                    { field: 'price', headerName: 'Selling Price', width: 120 },
            
                    {
                        field: 'createdAt',
                        headerName: 'Created At',
                        width: 150,
                        renderCell: (params) => (
                            <span>
                                {moment(params.row.DateAdded).format('DD.MM.YYYY')}
                            </span>
                        ),
                    },
                    {
                        field: 'quantity',
                        headerName: 'In Stock',
                        width: 150,
                        renderCell: (params) => (
                            params.row.quantity > 0 ? (
                                <span style={{color:'green',background:'#dcfce7',padding:'10px 10px',fontWeight:'bold',borderRadius:"10px"}}>In stock</span>
                            ) : (
                                <span style={{color:'red',background:'#fee2e2',padding:'10px 10px',fontWeight:'bold',borderRadius:"10px"}}>Out of stock</span>
                            )
                        ),
                    },
              
                ]}
                pageSize={10}
                initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 10,
                        },
                    },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
          />
        </div>
      </motion.div>
    </div>
  )
}

export default StockTaking
