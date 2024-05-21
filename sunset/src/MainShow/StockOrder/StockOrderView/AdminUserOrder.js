import React, { useContext, useState, useEffect } from "react";
import "./AdminUserView.scss";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DeliverAnimation from "../DeliverAnimation";
import AlphaSideBarNav from "../../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../../AuthContext/AuthContext";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import SalesPersonsNavigation from "../../NavigationShow/SalesPersonsNavigation";

const AdminUserOrder = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const Branch = user?.Branch;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS +
            `api/adminfunctions/order/${company_id}`
        );
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [company_id]);

  const [BranchOrders, setBranchOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS +
            `api/adminfunctions/branchorders/${Branch}`
        );
        setBranchOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [Branch]);

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          {user && user.role === "NormalUser" && <SalesPersonsNavigation />}
          <div className="AdminUserView">
            <div className="OrderDeliver">
              <DeliverAnimation />
            </div>

            {user && user.role === "Admin" && (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Branch</TableCell>
                        <TableCell>Personel</TableCell>
                        <TableCell>Order Total</TableCell>
                        <TableCell>order date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Orders.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).map((row) => {
                        const adjustedDate = moment(row.order_date).subtract(
                          3,
                          "hours"
                        );
                        const formattedDate = adjustedDate.format(
                          "YYYY-MM-DD HH:mm:ss"
                        );
                        const formattedAmount = parseFloat(
                          row.total_amount
                        ).toLocaleString();
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            <TableCell>{row.order_serial}</TableCell>
                            <TableCell>{row.Branch}</TableCell>
                            <TableCell>{row.sender_name}</TableCell>
                            <TableCell>
                              <span
                                style={{
                                  backgroundColor: "#dbeafe",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formattedAmount}
                              </span>
                            </TableCell>
                            <TableCell>{formattedDate}</TableCell>
                            <TableCell>
                              {" "}
                              <Link to={`/order_view/${row.order_serial}`}>
                                <button
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#172554",
                                    color: "#ffd412",
                                    borderRadius: "5px",
                                  }}
                                >
                                  view
                                </button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={Orders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}

            {user && user.role === "NormalUser" && (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Code</TableCell>
                        <TableCell>Branch</TableCell>
                        <TableCell>Personel</TableCell>
                        <TableCell>Order Total</TableCell>
                        <TableCell>order date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {BranchOrders.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).map((row) => {
                        const adjustedDate = moment(row.order_date).subtract(
                          3,
                          "hours"
                        );
                        const formattedDate = adjustedDate.format(
                          "YYYY-MM-DD HH:mm:ss"
                        );
                        const formattedAmount = parseFloat(
                          row.total_amount
                        ).toLocaleString();
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.code}
                          >
                            <TableCell>{row.order_serial}</TableCell>
                            <TableCell>{row.Branch}</TableCell>
                            <TableCell>{row.sender_name}</TableCell>
                            <TableCell>
                              <span
                                style={{
                                  backgroundColor: "#dbeafe",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  fontWeight: "bold",
                                }}
                              >
                                {formattedAmount}
                              </span>
                            </TableCell>
                            <TableCell>{formattedDate}</TableCell>
                            <TableCell>
                              {" "}
                              <Link to={`/order_view/${row.order_serial}`}>
                                <button
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#172554",
                                    color: "#ffd412",
                                    borderRadius: "5px",
                                  }}
                                >
                                  view
                                </button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={Orders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserOrder;
