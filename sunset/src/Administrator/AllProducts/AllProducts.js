import React, { useContext, useEffect, useState } from "react";
import "./AllProducts.scss";
import "./KegReport.scss";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../AuthContext/AuthContext";
import { FaArrowUp, FaArrowDown, FaArrowRight } from "react-icons/fa";
import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DownloadIcon from "@mui/icons-material/Download";

const TransitionBottom = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AllProducts = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const isNarrowScreen = useMediaQuery("(max-width: 768px)");
  const [allProducts, setAllProducts] = useState([]);
  const [stockInformation, setStockInformation] = useState([]);
  const [FromDate, setFromDate] = useState("");
  const [ToDate, setToDate] = useState("");
  const [Branch, setBranch] = useState("");
  const [SalesReportBranchFlow, setSalesReportBranchFlow] = useState([]);
  const [KegReport, setKegReport] = useState([]);
  const [originalBranchSaleValue, setOriginalBranchSaleValue] = useState(0);
  const [currentBranchSaleValue, setCurrentBranchSaleValue] = useState(0);
  const [BranchList, setBranchList] = useState([]);
  const [openBranchSalesReport, setBranchOpenSalesReport] =
    React.useState(false);
  const today = moment().format("MMMM D, YYYY");
  const [branchStockReportDrawer, setBranchStockReportDrawer] = useState(false);
  const [branchSalesReportDrawer, setBranchSalesReportDrawer] = useState(false);

  const handleClickOpenBranchSales = () => {
    setBranchOpenSalesReport(true);
  };
  const handleCloseBranchSales = () => {
    setBranchOpenSalesReport(false);
  };
  const toggleBranchStockReportDrawer = (open) => {
    setBranchStockReportDrawer(open);
  };

  const toggleBranchSalesReportDrawer = (open) => {
    setBranchSalesReportDrawer(open);
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDateClick = (event) => {
    event.stopPropagation();
  };

  // System keg report
  const [openKeg, setOpenKeg] = React.useState(false);
  const handleClickOpenKeg = () => {
    setOpenKeg(true);
  };
  const handleCloseKeg = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/ProductSales/productsales/${company_id}`
      )
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [company_id]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/adminfunctions/stockinformation/${company_id}`
      )
      .then((response) => {
        setStockInformation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [company_id]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/analytics/branches/${company_id}`
      )
      .then((response) => {
        setBranchList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product groups:", error);
      });
  }, [company_id]);

  const handleKegSales = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ADDRESS}api/search/kegsales?FromDate=${FromDate}&ToDate=${ToDate}&Branch=${Branch}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setKegReport(data);
      console.log("Fetched data:", data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDownloadPDF = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    // Grouping sales data by product status and calculating counts, total amounts, and ML
    const summaryData = KegReport.reduce((summary, item) => {
      if (!summary[item.ProductStatus]) {
        summary[item.ProductStatus] = {
          count: 0,
          total: 0,
          ml: 0,
          remainingMl: 0,
          sellers: new Set(),
        };
      }
      summary[item.ProductStatus].count += item.count;
      summary[item.ProductStatus].total += item.total;
      const cupMl =
        item.ProductStatus.toLowerCase() === "small"
          ? parseInt(item.smallCupMl)
          : parseInt(item.LargeCupMl);
      summary[item.ProductStatus].ml += cupMl * item.count;
      summary[item.ProductStatus].remainingMl += cupMl * item.count;

      summary[item.ProductStatus].sellers.add(item.SoldBy);
      return summary;
    }, {});

    // Calculating totals for each column
    let totalCount = 0;
    let totalAmount = 0;
    let totalMl = 0;
    const totalSellers = new Set();

    // Adding summary data for each product status
    for (const status in summaryData) {
      totalCount += summaryData[status].count;
      totalAmount += summaryData[status].total;
      totalMl += summaryData[status].ml;
      summaryData[status].sellers.forEach((seller) => totalSellers.add(seller));
    }

    // Calculate total barrels sold and remaining milliliters
    const mlPerBarrel = 50000;
    let totalBarrels = Math.floor(totalMl / mlPerBarrel);
    let remainingMl = totalMl % mlPerBarrel;

    const textWidth = jsPDFDoc.getTextWidth(`${Branch} Shop`);
    const pageWidth = jsPDFDoc.internal.pageSize.width;
    const middleX = (pageWidth - textWidth) / 2;

    const paddingTop = 30;
    const middleY = paddingTop + 20;

    jsPDFDoc.setFontSize(18);
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.text(`${Branch} Shop`, middleX, middleY, { align: "center" });

    const secondTextY = middleY + 30;
    jsPDFDoc.setFontSize(12);
    jsPDFDoc.setFont("helvetica", "normal");
    jsPDFDoc.text(
      `Keg sales summary report from ${moment(FromDate).format(
        "MMMM D, YYYY"
      )} to ${moment(ToDate).format("MMMM D, YYYY")}`,
      middleX,
      secondTextY,
      { align: "center" }
    );

    const tableY = secondTextY + 30;

    // Creating table data array
    const tableData = [];

    // Adding summary data for each product status
    for (const status in summaryData) {
      let barrels = Math.floor(summaryData[status].remainingMl / mlPerBarrel);
      let remainingForBarrels = summaryData[status].remainingMl % mlPerBarrel;
      tableData.push([
        {
          content: status,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: summaryData[status].count,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: summaryData[status].total.toLocaleString(),
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: summaryData[status].ml,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: Array.from(summaryData[status].sellers).join(", "),
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
      ]);
    }

    // Adding totals row
    tableData.push([
      {
        content: "Total",
        styles: { fontStyle: "bold", fontSize: 9, textColor: "black" },
      },
      {
        content: totalCount,
        styles: { fontStyle: "bold", fontSize: 9, textColor: "black" },
      },
      {
        content: totalAmount.toLocaleString(),
        styles: { fontStyle: "bold", fontSize: 9, textColor: "black" },
      },
      {
        content: `${totalBarrels} barrels (${remainingMl} ml remaining)`,
        styles: { fontStyle: "bold", fontSize: 9, textColor: "black" },
      },
    ]);

    jsPDFDoc.autoTable({
      head: [["Type", "Count", "Total", "Ml", "Seller"]],
      body: tableData,
      startY: tableY,
      headStyles: {
        fontStyle: "bold",
        fillColor: "rgb(21, 74, 147)",
        textColor: "white",
      },
    });

    jsPDFDoc.save(`${Branch} ${today} keg_summary.pdf`);
  };

  const handleDownloadBranchSalesReport = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const tableData = KegReport.map((item) => {
      return [
        {
          content: item.sale_id,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.productName,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.price.toLocaleString(),
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.count,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.total,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.SoldBy,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.Branch,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
      ];
    });

    const headers = [
      "Sale code",
      "Name",
      "Selling Price",
      "Sold Stock",
      "Total",
      "Seller",
      "Shop",
    ];

    const textWidth = jsPDFDoc.getTextWidth(`${Branch} Shop`);
    const pageWidth = jsPDFDoc.internal.pageSize.width;
    const middleX = (pageWidth - textWidth) / 2;

    const paddingTop = 30;
    const middleY = paddingTop + 20;

    jsPDFDoc.setFontSize(18);
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.text(`${Branch} Shop`, middleX, middleY, { align: "center" });

    const secondTextY = middleY + 30;
    jsPDFDoc.setFontSize(12);
    jsPDFDoc.setFont("helvetica", "normal");
    jsPDFDoc.text(
      `Sales report from ${moment(FromDate).format("MMMM D, YYYY")} to ${moment(
        ToDate
      ).format("MMMM D, YYYY")}`,
      middleX,
      secondTextY,
      { align: "center" }
    );

    jsPDFDoc.autoTable({
      head: [headers],
      body: tableData,
      startY: 100,
      headStyles: {
        fontStyle: "bold",
        fillColor: "rgb(21, 74, 147)",
        textColor: "white",
      },
    });

    jsPDFDoc.save(`${Branch} ${today} sales_report.pdf`);
  };

  const handleSearchBranchSales = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ADDRESS}api/search/salesreportbranchflow?FromDate=${FromDate}&ToDate=${ToDate}&Branch=${Branch}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSalesReportBranchFlow(data);
      const originalsale = data.reduce(
        (acc, item) => acc + item.BuyingPrice * item.count,
        0
      );
      const currentsale = data.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );
      setOriginalBranchSaleValue(originalsale);
      setCurrentBranchSaleValue(currentsale);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const BranchSales = (
    <Box
      sx={{
        width: "70vw",
        "@media (min-width:767px)": {
          width: "30vw",
        },
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      role="presentation"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="Drawer">
        <h3>Branch Sales Report</h3>
        <div className="InputsReport">
          <label htmlFor="Branch">Branch</label>
          <select
            id="Branch"
            name="Branch"
            value={Branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Select...</option>
            {BranchList.map((val) => {
              return <option>{val.BranchName}</option>;
            })}
          </select>
        </div>
        <div className="InputsReport">
          <label htmlFor="date">From</label>
          <input
            id="date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onClick={handleDateClick}
            value={FromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="InputsReport">
          <label htmlFor="date">To</label>
          <input
            id="date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onClick={handleDateClick}
            value={ToDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="DownloadButton">
          <button onClick={handleSearchBranchSales}>Get Report</button>
        </div>

        {SalesReportBranchFlow.length > 0 && (
          <div className="ButtonsMore">
            <button onClick={handleClickOpenBranchSales} className="ViewReport">
              View Report
            </button>
            <button
              className="DownloadReport"
              onClick={handleDownloadBranchSalesReport}
            >
              Download
            </button>
          </div>
        )}

        <Dialog
          open={openBranchSalesReport}
          TransitionComponent={Transition}
          fullScreen={isNarrowScreen}
          keepMounted
          onClose={handleCloseBranchSales}
          PaperProps={{
            sx: {
              maxWidth: "100%",
            },
          }}
        >
          <AppBar
            sx={{
              position: "relative",
              backgroundColor: "#154a93",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Toolbar sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseBranchSales}
                aria-label="close"
              >
                <ArrowBackIosIcon sx={{ color: "#fff" }} />
              </IconButton>
              <Typography
                sx={{ ml: 0, flex: 1, color: "#fff", fontSize: "13px" }}
                variant="h6"
                component="div"
              >
                Added Stock
              </Typography>
            </Toolbar>
          </AppBar>

          <div className="TableTopReport">
            <div className="DownaloadBtn">
              <button
                onClick={handleDownloadBranchSalesReport}
                style={{
                  backgroundColor: "#10b981",
                  padding: "10px 15px",
                  color: "white",
                  borderRadius: "3px",
                  border: "none",
                  outline: "none",
                }}
              >
                Download
              </button>
            </div>

            <div className="ValueDisplay">
              <p>
                Initial Sale Value :
                <span>
                  KES {parseFloat(originalBranchSaleValue).toLocaleString()}
                </span>
              </p>
              <p>
                Current Sale Value: KES{" "}
                {parseFloat(currentBranchSaleValue).toLocaleString()}
              </p>
              <p>
                Profit estimate: KES{" "}
                {parseFloat(
                  currentBranchSaleValue - originalBranchSaleValue
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <DataGrid
            style={{ padding: "20px" }}
            rows={SalesReportBranchFlow.map((product, index) => ({
              ...product,
              indexId: index + 1,
            }))}
            columns={[
              { field: "sale_id", headerName: "Code", width: 200 },
              { field: "productName", headerName: "Name", width: 200 },
              { field: "price", headerName: "Selling Price", width: 120 },

              {
                field: "count",
                headerName: "Sold Stock",
                width: 100,
              },
              {
                field: "total",
                headerName: "Total",
                width: 100,
              },
              { field: "source", headerName: "Mode", width: 120 },
              {
                field: "SoldBy",
                headerName: "Seller",
                width: 150,
              },
              { field: "Branch", headerName: "Location", width: 120 },
              {
                field: "date_added",
                headerName: "Added At",
                width: 150,
                renderCell: (params) => {
                  const originalDate = moment(params.row.date);

                  // Subtract 3 hours
                  const adjustedDate = originalDate.subtract(3, "hours");

                  // Format the adjusted date in the 'DD.MM.YYYY' format
                  const formattedDate = adjustedDate.format("DD.MM.YYYY");

                  // Use formattedDate in your component
                  return <span>{formattedDate}</span>;
                },
              },
              {
                field: "actions",
                headerName: "Action",
                width: 100,
                renderCell: (params) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <Link to={`/product_history/${params.row.id}`}>
                      <button
                        style={{
                          color: "green",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <FaEdit
                          style={{
                            cursor: "pointer",
                            marginLeft: "4px",
                          }}
                        />
                      </button>
                    </Link>
                  </div>
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
        </Dialog>
      </div>
    </Box>
  );

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}

        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="AllProducts">
            <div className="filterProducts">
              {stockInformation.map((stockInfo) => {
                const currentStockValue = parseFloat(
                  stockInfo.currentStockValue
                );
                const soldStockValue = parseFloat(stockInfo.soldStockValue);
                const totalStockValue = currentStockValue + soldStockValue;
                const percentageCurrent =
                  (currentStockValue / totalStockValue) * 100 || 0;
                const percentageSold =
                  (soldStockValue / totalStockValue) * 100 || 0;

                const renderArrowIcon = (percentage) => {
                  if (percentage < 50) {
                    return <FaArrowDown style={{ color: "red" }} />;
                  } else if (percentage > 50) {
                    return <FaArrowUp style={{ color: "green" }} />;
                  } else {
                    return <FaArrowRight style={{ color: "orange" }} />;
                  }
                };

                return (
                  <div className="filterProducts">
                    <ul>
                      <li>
                        <span>Current stock value:</span>
                        <small>
                          {stockInfo.currentStockValue}{" "}
                          <strong>
                            {" "}
                            (<small>{percentageCurrent.toFixed(2)}%</small>{" "}
                            <small>{renderArrowIcon(percentageCurrent)} </small>
                            )
                          </strong>
                        </small>
                      </li>
                      <li>
                        <span>Sold stock value:</span>
                        <small>
                          {stockInfo.soldStockValue}{" "}
                          <strong>
                            {" "}
                            (<small>{percentageSold.toFixed(2)}%</small>{" "}
                            <small>{renderArrowIcon(percentageSold)} </small>)
                          </strong>
                        </small>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="ButtonsReports">
              <button onClick={() => toggleBranchSalesReportDrawer(true)}>
                Cumulative Sales
              </button>
              <button onClick={handleClickOpenKeg}>Keg report</button>

              <Dialog
                open={openKeg}
                TransitionComponent={TransitionBottom}
                keepMounted
                fullScreen={isNarrowScreen}
                onClose={handleCloseKeg}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle
                  sx={{
                    backgroundColor: "rgb(21, 74, 147)",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Keg sales report</span>

                  {KegReport.length > 0 && (
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                      }}
                      onClick={handleDownloadPDF}
                    >
                      <DownloadIcon />
                    </button>
                  )}
                </DialogTitle>

                <DialogContent>
                  <div className="KegReport">
                    <div className="SideAReport">
                      <div className="EntryPoints">
                        <label>Select branch</label>
                        <select
                          id="Branch"
                          name="Branch"
                          value={Branch}
                          onChange={(e) => setBranch(e.target.value)}
                        >
                          <option>Select...</option>
                          {BranchList.map((val) => {
                            return <option>{val.BranchName}</option>;
                          })}
                        </select>
                      </div>
                      <div className="EntryPoints">
                        <label>From:</label>
                        <input
                          id="FromDate"
                          type="date"
                          value={FromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>
                      <div className="EntryPoints">
                        <label>To:</label>
                        <input
                          id="ToDate"
                          type="date"
                          value={ToDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="SideBReport">
                      <button onClick={handleKegSales}>Get report</button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <SwipeableDrawer
                anchor={"right"}
                open={branchSalesReportDrawer}
                onClose={() => toggleBranchSalesReportDrawer(false)}
                onOpen={() => toggleBranchSalesReportDrawer(true)}
              >
                {BranchSales}
              </SwipeableDrawer>
            </div>

            <div>
              <DataGrid
                style={{ padding: "20px", outline: "none" }}
                rows={allProducts.map((product, index) => ({
                  ...product,
                  id: index + 1,
                }))}
                columns={[
                  { field: "sale_id", headerName: "ID", width: 80 },
                  {
                    field: "productName",
                    headerName: "Name",
                    width: 180,
                    renderCell: (params) => {
                      const currentSaleId = params.row.sale_id;
                      const productsWithSameSaleId = allProducts.filter(
                        (product) => product.sale_id === currentSaleId
                      );
                      return (
                        <div
                          style={{
                            background:
                              productsWithSameSaleId.length > 1
                                ? "#e0f2fe"
                                : "transparent",
                            color:
                              productsWithSameSaleId.length > 1
                                ? "black"
                                : "inherit",
                            padding: "5px",
                            display: "block",
                            fontWeight:
                              productsWithSameSaleId.length > 1
                                ? "700"
                                : "normal",
                            fontStyle:
                              productsWithSameSaleId.length > 1
                                ? "italic"
                                : "normal",
                          }}
                        >
                          {params.value}
                        </div>
                      );
                    },
                  },
                  {
                    field: "qty",
                    headerName: "Qty",
                    width: 150,
                    renderCell: (params) => (
                      <span
                        style={{
                          background: "#dcfce7",
                          padding: "5px 5px",
                          fontWeight: "600",
                          fontStyle: "oblique",
                        }}
                      >
                        {`${params.row.count} @ ${params.row.price} each`}
                      </span>
                    ),
                  },
                  {
                    field: "total",
                    headerName: "Total_paid",
                    width: 120,
                    renderCell: (params) => {
                      const currentSaleId = params.row.sale_id;
                      const productsWithSameSaleId = allProducts.filter(
                        (product) => product.sale_id === currentSaleId
                      );
                      return (
                        <div
                          style={{
                            background:
                              productsWithSameSaleId.length > 1
                                ? "#e0f2fe"
                                : "transparent",
                            color:
                              productsWithSameSaleId.length > 1
                                ? "black"
                                : "inherit",
                            padding: "5px",
                            display: "block",
                            fontWeight:
                              productsWithSameSaleId.length > 1
                                ? "700"
                                : "normal",
                            fontStyle:
                              productsWithSameSaleId.length > 1
                                ? "italic"
                                : "normal",
                          }}
                        >
                          {params.value}
                        </div>
                      );
                    },
                  },
                  { field: "SoldBy", headerName: "Seller", width: 170 },
                  { field: "Branch", headerName: "Location", width: 120 },
                  { field: "source", headerName: "Mode", width: 120 },
                  {
                    field: "date",
                    headerName: "",
                    width: 150,
                    renderCell: (params) => (
                      <span style={{ color: "#15803d", fontWeight: "700" }}>
                        {moment(params.row.date).subtract(3, "hours").fromNow()}
                      </span>
                    ),
                  },

                  {
                    width: 150,
                    renderCell: (params) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <button
                          style={{
                            color: "red",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={handleOpen}
                        >
                          <Link
                            to={`/product_history/${params.row.product_id}`}
                          >
                            <AppsIcon
                              style={{ fontSize: "25px", color: "#1d4ed8" }}
                            />
                          </Link>
                        </button>
                      </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
