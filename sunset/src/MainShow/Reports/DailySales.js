import React, { useContext, useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { AuthContext } from "../../AuthContext/AuthContext";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { motion } from "framer-motion";

const DailySales = () => {
  const today = moment().format("MMMM D, YYYY");

  const [activeTab, setActiveTab] = useState("Add Stock");
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const userName = user?.userName;
  const currentUser = user?.fullname;
  const SoldBy = user?.fullname;
  console.log("current user is", currentUser);

  const shift_start_time = user?.shift_start_time;
  const shift_end_time = user?.shift_end_time;

  const [productDataMpesa, setProductDataMpesa] = useState([]);
  const [productDataCash, setProductDataCash] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseAnalysis, setExpenseAnalysis] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/salesreport?shift_start_time=${shift_start_time}&shift_end_time=${shift_end_time}&SoldBy=${SoldBy}`
      )
      .then((response) => {
        setProductDataMpesa(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [SoldBy]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/salesreportcash?shift_start_time=${shift_start_time}&shift_end_time=${shift_end_time}&SoldBy=${SoldBy}`
      )
      .then((response) => {
        setProductDataCash(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [SoldBy]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/expenses/expensetoday?shift_start_time=${shift_start_time}&shift_end_time=${shift_end_time}&SoldBy=${SoldBy}`
      )
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/summaryanalysis?shift_start_time=${shift_start_time}&shift_end_time=${shift_end_time}&SoldBy=${SoldBy}`
      )
      .then((response) => {
        setExpenseAnalysis(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch, userName]);

  const downloadPDF = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const expenseData = expenseAnalysis.map((item, index) => [
      {
        content: item.totalMpesaSalesToday,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.totalCashSalesToday,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.totalExpensesToday,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.grandTotalSales,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.netTotalSales,
        styles: { fontStyle: "bold", textColor: "black" },
      },
    ]);

    const ExpensesHeaders = [
      "Mpesa Total",
      "Cash Total",
      "Expenses",
      "Grand Total",
      "Net sales",
    ];

    // Get the mpesa data and headers
    const tableData = productDataMpesa.map((item, index) => [
      index + 1,
      {
        content: item.productName,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.count,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.price,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.total,
        styles: { fontStyle: "bold", textColor: "black" },
      },
    ]);

    const headers = [
      "No.",
      "Product name",
      "Sold count",
      "Price / unit",
      "Mpesa amount",
    ];

    // Get the cash data and headers
    const tableData2 = productDataCash.map((item, index) => [
      index + 1,
      {
        content: item.productName,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.count,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.price,
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.productTotal,
        styles: { fontStyle: "bold", textColor: "black" },
      },
    ]);

    const headers2 = [
      "No.",
      "Product name",
      "Sold count",
      "Price / unit",
      "Cash amount",
    ];
    const padding = 10;
    // Add branch information at the top
    jsPDFDoc.text(`${Branch}, ${today} sales report`, 40, 20);
    jsPDFDoc.text(`Attendant: ${currentUser}`, 40, 40 + padding);

    jsPDFDoc.autoTable({
      head: [ExpensesHeaders],
      body: expenseData,
      startY: 60, // Set the starting Y position for the table
      headStyles: { fillColor: "#063992" }, // Set the header background color to orange
    });

    // Move to a new Y position for the Mpesa table
    const mpesaTableY = jsPDFDoc.autoTable.previous.finalY + 20;
    // Add the Mpesa table to the PDF document
    jsPDFDoc.autoTable({
      head: [headers],
      body: tableData,
      startY: mpesaTableY, // Set the starting Y position for the table
      headStyles: { fillColor: "#008000" }, // Set the header background color to orange
    });

    // Move to a new Y position for the second table
    const cashTableY = jsPDFDoc.autoTable.previous.finalY + 20;

    // Add the Cash table to the PDF document
    jsPDFDoc.autoTable({
      head: [headers2],
      body: tableData2,
      startY: cashTableY,
      headStyles: { fillColor: "#008000" },
    });

    // Save the PDF
    jsPDFDoc.save(`${Branch} ${today} sales.pdf`);
  };

  return (
    <motion.div
      className="TabBar"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1.5, type: "spring" }}
    >
      <div></div>
      <div className="TabButtons">
        <button
          className={activeTabIndex === 0 ? "ActiveTab" : ""}
          onClick={() => handleTabChange(0)}
        >
          Mpesa Analysis
        </button>
        <button
          className={activeTabIndex === 1 ? "ActiveTab" : ""}
          onClick={() => handleTabChange(1)}
        >
          Cash Analysis
        </button>
      </div>

      <SwipeableViews
        index={activeTabIndex}
        onChangeIndex={handleTabChange}
        enableMouseEvents
      >
        <div className="TabContent">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignContent: "flex-start",
              }}
            >
              <button
                onClick={downloadPDF}
                className="bg-sky-900 text-white font-[Poppins] py-2 px-6 rounded md:ml-0 hover:bg-sky-700 duration-500"
              >
                Download Report
              </button>
            </div>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                id="table-to-export-mpesa"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Amount(Mpesa)</TableCell>
                    <TableCell>Attendant</TableCell>
                    <TableCell>Branch</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDataMpesa
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((val, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{val.productName}</TableCell>
                          <TableCell>{val.count}</TableCell>
                          <TableCell>{val.price}</TableCell>
                          <TableCell>{val.total}</TableCell>
                          <TableCell>{val.SoldBy}</TableCell>
                          <TableCell>{val.Branch}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={productDataMpesa.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>

        <div className="TabContent">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table
                stickyHeader
                aria-label="sticky table"
                id="table-to-export-cash"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Amount(Cash)</TableCell>
                    <TableCell>Attendant</TableCell>
                    <TableCell>Branch</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productDataCash
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((val, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{val.productName}</TableCell>
                          <TableCell>{val.count}</TableCell>
                          <TableCell>{val.price}</TableCell>
                          <TableCell>{val.productTotal}</TableCell>
                          <TableCell>{val.SoldBy}</TableCell>
                          <TableCell>{val.Branch}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={productDataCash.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </SwipeableViews>
    </motion.div>
  );
};

export default DailySales;
