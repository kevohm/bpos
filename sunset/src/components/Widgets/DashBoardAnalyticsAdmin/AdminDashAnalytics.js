import React, { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import axios from "axios";
import { AuthContext } from "../../../AuthContext/AuthContext";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Link } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import "./AdminDashAnalytics.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const COLORS = ["#063992", "#ff9800", "red"];

const ProductChart = ({ selectedProduct }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={selectedProduct}
          dataKey="Percentage"
          nameKey="ProductStatus"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={(entry) => `${entry.ProductStatus} ${entry.Percentage}%`}
        >
          {selectedProduct.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const StockChartAnalysis = ({ DailyStockAdditions }) => {
  // Custom tick formatter function to extract only the date part
  const formatDateTick = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const TooltipFormatDateTick = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Convert DailySales object to an array
  const dailySalesArray = Object.values(DailyStockAdditions);

  // Extract unique branches
  const branches = Array.from(
    new Set(dailySalesArray.flatMap((item) => item.Branch))
  );

  const branchColors = {
    Bypass: "#14b8a6",
    Ruaka: "#f97316",
    RUIRU: "#22c55e",
    Fedha: "#3b82f6",
    Embu: "#eab308",
    Kayole: "#e11d48",
    "": "#4c0519",
  };

  // Group data by day
  const groupedData = dailySalesArray.reduce((acc, item) => {
    const key = item.day;
    if (!acc[key]) {
      acc[key] = {};
      acc[key].day = item.day; // Include day information in each group
    }
    acc[key][item.Branch] = item.purchase_value;
    return acc;
  }, {});

  const stackedBars = branches.map((branch, index) => (
    <Bar key={index} dataKey={branch} stackId="a" fill={branchColors[branch]} />
  ));

  return (
    <ResponsiveContainer width="100%" height={370}>
      <BarChart
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        data={Object.values(groupedData)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickFormatter={formatDateTick}
          angle={-10}
          height={60}
          axisLine={false}
        />
        <YAxis axisLine={false} />
        <Tooltip labelFormatter={TooltipFormatDateTick} />
        <Legend />
        {stackedBars}
      </BarChart>
    </ResponsiveContainer>
  );
};

const SalesAnalysisChart = ({ DailySales }) => {
  // Custom tick formatter function to extract only the date part
  const formatDateTick = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const TooltipFormatDateTick = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Convert DailySales object to an array
  const dailySalesArray = Object.values(DailySales);

  // Extract unique branches
  const branches = Array.from(
    new Set(dailySalesArray.flatMap((item) => item.Branch))
  );

  const branchColors = {
    Bypass: "#14b8a6",
    Ruaka: "#f97316",
    RUIRU: "#22c55e",
    Fedha: "#3b82f6",
    Embu: "#eab308",
    Kayole: "#e11d48",
    "": "#4c0519",
  };

  // Group data by day
  const groupedData = dailySalesArray.reduce((acc, item) => {
    const key = item.day;
    if (!acc[key]) {
      acc[key] = {};
      acc[key].day = item.day; // Include day information in each group
    }
    acc[key][item.Branch] = item.total_for_day;
    return acc;
  }, {});

  const stackedBars = branches.map((branch, index) => (
    <Bar key={index} dataKey={branch} stackId="a" fill={branchColors[branch]} />
  ));

  return (
    <ResponsiveContainer width="100%" height={370}>
      <BarChart
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        data={Object.values(groupedData)}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickFormatter={formatDateTick}
          angle={-10}
          height={60}
          axisLine={false}
        />
        <YAxis axisLine={false} />
        <Tooltip labelFormatter={TooltipFormatDateTick} />
        <Legend />
        {stackedBars}
      </BarChart>
    </ResponsiveContainer>
  );
};

const AdminDashAnalytics = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const [productData, setProductData] = useState([]);
  const [query, setQuery] = useState("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCloseProduct = () => {
    setOpenProduct(false);
  };
  const [openProduct, setOpenProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductCount, setSelectedProductCount] = useState(null);
  const [barChartSummary, setBarChartSummary] = useState("");
  const [salesAnalysis, setSalesAnalysis] = useState("");
  const [DailySales, setDailySales] = useState("");
  const [DailyStockAdditions, setDailyStockAdditions] = useState("");

  const handleOpenProduct = (name, amountMl) => {
    const productPercentEndpoint =
      process.env.REACT_APP_API_ADDRESS +
      `api/groupAnalytics/productpercent/${name}/${amountMl}`;
    const productCountEndpoint =
      process.env.REACT_APP_API_ADDRESS +
      `api/groupAnalytics/productcount/${name}/${amountMl}`;

    axios
      .all([axios.get(productPercentEndpoint), axios.get(productCountEndpoint)])
      .then(
        axios.spread((percentResponse, countResponse) => {
          setSelectedProduct(percentResponse.data);
          setSelectedProductCount(countResponse.data);
          setOpenProduct(true);
        })
      )
      .catch((error) => {
        console.error("Error fetching product details and count:", error);
      });
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/groupanalytics/${company_id}?q=${query}`
      )
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [company_id, query]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/dailystockaddition/${company_id}`
      )
      .then((response) => {
        setDailyStockAdditions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [company_id]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/dailysales/${company_id}`
      )
      .then((response) => {
        setDailySales(response.data);
        console.log("Fetched daily sales data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [company_id]);

  return (
    <div className="AdminDashAnalytics">
      <div className="ProductsDash">
        <div className="headerDash">
          {" "}
          <h3>Your Products</h3>
        </div>

        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            backgroundColor: "#fffefe",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
            padding: "1.5rem rem",
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
            "&::-webkit-scrollbar": {
              width: 0,
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <input
              style={{
                padding: "7px",
                border: "1px solid #0c4a6e",
                outline: "none",
                borderRadius: "30px",
                fontWeight: "bold",
                color: "black",
              }}
              type="search"
              placeholder="Search.."
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
            />
          </div>
          <TableContainer sx={{ maxHeight: 400, borderCollapse: "collapse" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {/* <TableCell sx={{ border: 'none' }}></TableCell>
                    <TableCell  sx={{ border: 'none' }}></TableCell>
                    <TableCell  sx={{ border: 'none' }}></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {productData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((val, index) => {
                    const productNameStyle =
                      val.quantity > 0
                        ? {
                            color: "#15803d",
                            fontWeight: "bold",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                          }
                        : {
                            color: "red",
                            fontWeight: "bold",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                          };

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            border: "none",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px",
                          }}
                        >
                          <TableCell
                            sx={{
                              border: "none",
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "35px",
                              alignItems: "center",
                              padding: "6px",
                            }}
                          >
                            <img
                              src={val.imageUrl}
                              alt=""
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                padding: "3px 5px",
                              }}
                            />
                            <button
                              onClick={() =>
                                handleOpenProduct(val.name, val.amountMl)
                              }
                              style={productNameStyle}
                            >
                              {val.name}
                            </button>
                            <span
                              style={{ color: "#15803d", fontWeight: "bold" }}
                            >
                              {val.Branch}
                            </span>
                          </TableCell>
                          <Link to={`/productedits/${val.id}`}>
                            <button
                              style={{
                                color: "#0c4a6e",
                                border: "none",
                                cursor: "pointer",
                              }}
                            >
                              <CreateIcon />
                            </button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <div>
          <Dialog
            open={openProduct}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseProduct}
          >
            {selectedProductCount &&
              selectedProductCount.map((val, index) => (
                <div key={index}>
                  <div
                    style={{
                      backgroundColor: "#082f49",
                      color: "white",
                      height: "3rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DialogTitle>
                      {" "}
                      <h5 style={{ textAlign: "center", fontWeight: "300" }}>
                        {val.name} ({val.amountMl + "ml"})
                      </h5>
                    </DialogTitle>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "#082f49",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                      paddingTop: "30px",
                      paddingBottom: "30px",
                    }}
                  >
                    <div style={{ color: "white", fontWeight: "bold" }}>
                      Total Sold: {val.Sold}
                    </div>
                    <div style={{ color: "white", fontWeight: "bold" }}>
                      Total Available: {val.Available}
                    </div>
                    <div style={{ color: "white", fontWeight: "bold" }}>
                      Total Archived: {val.Archived}
                    </div>
                    <div style={{ fontWeight: "bold", color: "white" }}>
                      Total: {val.Total}
                    </div>
                  </div>
                  <div>
                    <ProductChart selectedProduct={selectedProduct || []} />
                  </div>
                </div>
              ))}
          </Dialog>
        </div>
      </div>

      <div className="SummaryDash">
        <div className="summarySales">
          <div className="salesHeader">
            <h3>Daily Sales Summary</h3>
          </div>
          <div className="DashGraph">
            <SalesAnalysisChart DailySales={DailySales} />
          </div>
        </div>
        <div className="summarySales">
          <div className="salesHeader">
            <h3>Daily Stock Purchase Summary</h3>
          </div>
          <div className="DashGraph">
            <StockChartAnalysis DailyStockAdditions={DailyStockAdditions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashAnalytics;
