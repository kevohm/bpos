import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Archived.scss';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';

const Archived = () => {
    const [archivedData, setArchivedData] = useState([]);
    const { Branch } = useParams();
    const [query, setQuery] = useState("");

    useEffect(() => {
        axios.get(process.env.REACT_APP_API_ADDRESS + `api/analytics/archive/${Branch}?q=${query}`)
          .then(response => {
            setArchivedData(response.data);
          })
          .catch(error => {
            console.error('Error fetching branch analytics:', error);
          });
      }, [Branch,query]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className='Archive'>
            <div>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Code</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Branch</TableCell>
                                    <TableCell>Attendant</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Invoice</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {archivedData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((val, index) => {
                                        return (
                                            <TableRow key={val.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{val.InvoiceCode}</TableCell>
                                                <TableCell>{val.customerName}</TableCell>
                                                <TableCell>{val.Branch}</TableCell>
                                                <TableCell>{val.InvoicedBy}</TableCell>
                                                <TableCell>{moment(val.invoiceDate).format('YYYY-MM-DD')}</TableCell>
                                                <TableCell>Invoice</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={archivedData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
            <div>

        
        </div>
        </div>
    );
};

export default Archived;
