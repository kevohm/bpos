import React, { useContext, useEffect, useState } from "react";
import "./AdminAnalytics.scss";
import "./Drawer.scss";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { FaArrowUp, FaArrowDown, FaArrowRight } from "react-icons/fa";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "./Reports/TableReports.scss";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toDate } from "date-fns-tz";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    <ResponsiveContainer width="100%" height={300}>
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
    <ResponsiveContainer width="100%" height={300}>
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

const ExpensesAnalysisChart = ({ DailyExpensesAdmin }) => {
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
  const dailySalesArray = Object.values(DailyExpensesAdmin);

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
  };

  // Group data by day
  const groupedData = dailySalesArray.reduce((acc, item) => {
    const key = item.day;
    if (!acc[key]) {
      acc[key] = {};
      acc[key].day = item.day; // Include day information in each group
    }
    acc[key][item.Branch] = item.amount;
    return acc;
  }, {});

  const stackedBars = branches.map((branch, index) => (
    <Bar key={index} dataKey={branch} stackId="a" fill={branchColors[branch]} />
  ));

  return (
    <ResponsiveContainer width="100%" height={300}>
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

function AdminAnalytics() {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  console.log(company_id);
  const [stockInformation, setStockInformation] = useState([]);
  const [DailySales, setDailySales] = useState("");
  const [DailyStockAdditions, setDailyStockAdditions] = useState("");
  const [DailyExpensesAdmin, setDailyExpensesAdmin] = useState("");
  const [BranchList, setBranchList] = useState([]);

  const [FromDate, setFromDate] = useState("");
  const [FromDateBranchStock, setFromDateBranchStock] = useState("");

  const [ToDate, setToDate] = useState("");
  const [ToDateBranchStock, setToDateBranchStock] = useState("");
  const [Branch, setBranch] = useState("");

  const [StockAdditionReport, setStockAdditionReport] = useState([]);
  const [StockAdditionBranchReport, setStockAdditionBranchReport] = useState(
    []
  );
  const [SalesReportFlow, setSalesReportFlow] = useState([]);
  const [SalesReportBranchFlow, setSalesReportBranchFlow] = useState([]);

  const [totalAddedStockValue, setTotalAddedStockValue] = useState(0);
  const [totalExpectedSaleValue, setTotalExpectedSaleValue] = useState(0);
  const [totalExpectedProfit, setTotalExpectedProfit] = useState(0);

  const [totalStockAddedBranch, setTotalStockAddedBranch] = useState(0);
  const [totalSaleValueBranch, setTotalSaleValueBranch] = useState(0);

  const [originalSaleValue, setOriginalSaleValue] = useState(0);
  const [currentSaleValue, setCurrentSaleValue] = useState(0);
  const [originalBranchSaleValue, setOriginalBranchSaleValue] = useState(0);
  const [currentBranchSaleValue, setCurrentBranchSaleValue] = useState(0);

  const [stockReportDrawer, setStockReportDrawer] = useState(false);
  const [salesReportDrawer, setSalesReportDrawer] = useState(false);
  const [branchStockReportDrawer, setBranchStockReportDrawer] = useState(false);
  const [branchSalesReportDrawer, setBranchSalesReportDrawer] = useState(false);

  const today = moment().format("MMMM D, YYYY");
  const isNarrowScreen = useMediaQuery("(max-width: 768px)");

  const [openStockAdditionReport, setOpenStockAdditionReport] =
    React.useState(false);

  const handleClickOpenStockAdditionView = () => {
    setOpenStockAdditionReport(true);
  };

  const handleCloseStockAdditionView = () => {
    setOpenStockAdditionReport(false);
  };

  const [openSalesReport, setOpenSalesReport] = React.useState(false);

  const handleClickOpenSales = () => {
    setOpenSalesReport(true);
  };

  const handleCloseSales = () => {
    setOpenSalesReport(false);
  };

  const [openBranchSalesReport, setBranchOpenSalesReport] =
    React.useState(false);
  const handleClickOpenBranchSales = () => {
    setBranchOpenSalesReport(true);
  };
  const handleCloseBranchSales = () => {
    setBranchOpenSalesReport(false);
  };

  const [openStockAdditionBranchReport, setOpenStockAdditionBranchReport] =
    React.useState(false);

  const handleClickOpenStockAdditionBranchView = () => {
    setOpenStockAdditionBranchReport(true);
  };

  const handleCloseStockAdditionBranchView = () => {
    setOpenStockAdditionBranchReport(false);
  };

  // main shop stock additions
  const getStockAdditionReport = () => {
    fetch(
      process.env.REACT_APP_API_ADDRESS +
        `api/search/stockadditionreport?FromDate=${FromDate}&ToDate=${ToDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        const calculatedData = data.map((item) => ({
          ...item,
          addedStockValue: (item.BuyingPrice * item.AddedQuantity).toFixed(2),
          expectedSaleValue: (item.price * item.AddedQuantity).toFixed(2),
        }));
        setStockAdditionReport(calculatedData);

        const totalAddedStock = calculatedData.reduce(
          (sum, item) => sum + parseFloat(item.addedStockValue),
          0
        );
        const totalExpectedSale = calculatedData.reduce(
          (sum, item) => sum + parseFloat(item.expectedSaleValue),
          0
        );
        const totalProfit = totalExpectedSale - totalAddedStock;

        setTotalAddedStockValue(totalAddedStock.toFixed(2));
        setTotalExpectedSaleValue(totalExpectedSale.toFixed(2));
        setTotalExpectedProfit(totalProfit.toFixed(2));
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    getStockAdditionReport();
  }, [FromDate, ToDate]);

  // Branch stock additions
  const handleSearchBranchStock = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ADDRESS}api/search/stockadditionbranchreport?FromDate=${FromDate}&ToDate=${ToDate}&Branch=${Branch}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStockAdditionBranchReport(data);
      const calculatedTotalStockAddedBranch = data.reduce(
        (acc, item) => acc + item.BuyingPrice * item.AddedQuantity,
        0
      );
      const calculatedTotalSaleValueBranch = data.reduce(
        (acc, item) => acc + item.price * item.AddedQuantity,
        0
      );
      setTotalStockAddedBranch(calculatedTotalStockAddedBranch);
      setTotalSaleValueBranch(calculatedTotalSaleValueBranch);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Main Shop sales report
  const handleSearchGenSales = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ADDRESS}api/search/salesreportflow?FromDate=${FromDate}&ToDate=${ToDate}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSalesReportFlow(data);
      const originalsale = data.reduce(
        (acc, item) => acc + item.BuyingPrice * item.count,
        0
      );
      const currentsale = data.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );
      setOriginalSaleValue(originalsale);
      setCurrentSaleValue(currentsale);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Branch Shop sales report
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

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/dailysales/${company_id}`
      )
      .then((response) => {
        setDailySales(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [company_id]);

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
          `api/groupAnalytics/dailyexpenses/${company_id}`
      )
      .then((response) => {
        setDailyExpensesAdmin(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
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

  const handleDateClick = (event) => {
    event.stopPropagation();
  };

  const toggleStockReportDrawer = (open) => {
    setStockReportDrawer(open);
  };

  const toggleSalesReportDrawer = (open) => {
    setSalesReportDrawer(open);
  };

  const toggleBranchStockReportDrawer = (open) => {
    setBranchStockReportDrawer(open);
  };

  const toggleBranchSalesReportDrawer = (open) => {
    setBranchSalesReportDrawer(open);
  };

  const handleDownloadPDF = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
        orientation: "landscape",
        unit,
        format: size,
    });

    const tableData = StockAdditionBranchReport.map((item) => {
        return [
            {
                content: item.name,
                styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
            },
            {
                content: item.BuyingPrice,
                styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
            },
            {
                content: item.price.toLocaleString(),
                styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
            },
            {
                content: `${
                    item.AddedQuantity <= 0
                        ? `${item.AddedQuantity}`
                        : `${item.AddedQuantity}`
                    }`,
                styles: {
                    fontStyle: "bold",
                    fontSize: 9,
                    textColor: item.AddedQuantity <= 0 ? "#991b1b" : "#047857",
                },
            },
            {
                content: item.added_by,
                styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
            },
        ];
    });

    const headers = [
        "Name",
        "Buying Price",
        "Selling Price",
        "Added Stock",
        "Added by",
    ];

    // Calculate total cost of goods
    const totalCost = StockAdditionBranchReport.reduce((acc, item) => {
        return acc + (item.BuyingPrice * item.AddedQuantity);
    }, 0);

    // Calculate expected total sale
    const expectedTotalSale = StockAdditionBranchReport.reduce((acc, item) => {
        return acc + (item.price * item.AddedQuantity);
    }, 0);

    // Calculate expected profit
    const expectedProfit = expectedTotalSale - totalCost;

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
        `Stock addition report from ${moment(FromDate).format(
            "MMMM D, YYYY"
        )} to ${moment(ToDate).format("MMMM D, YYYY")}`,
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

    // Add total cost, expected total sale, and expected profit on the left with some gap between them
    const startX = 40;
    const startY = jsPDFDoc.autoTable.previous.finalY + 20;
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.text(`Total Cost of Goods: ${totalCost}`, startX, startY);
    jsPDFDoc.text(`Expected Total Sale: ${expectedTotalSale}`, startX, startY + 20);
    jsPDFDoc.text(`Expected Profit: ${expectedProfit}`, startX, startY + 40);

    jsPDFDoc.save(`${Branch} ${today} stock_addition.pdf`);
};


  const handleDownloadPDFMajorStockAddition = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const tableData = StockAdditionReport.map((item) => {
      return [
        {
          content: item.name,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.BuyingPrice,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.price.toLocaleString(),
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },

        {
          content: `${
            item.AddedQuantity <= 0
              ? `${item.AddedQuantity}`
              : `${item.AddedQuantity}`
          }`,
          styles: {
            fontStyle: "bold",
            fontSize: 9,
            textColor: item.AddedQuantity <= 0 ? "#991b1b" : "#047857",
          },
        },
        {
          content: item.Branch,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
        {
          content: item.added_by,
          styles: { fontStyle: "normal", fontSize: 9, textColor: "black" },
        },
      ];
    });

    const headers = [
      "Name",
      "Buying Price",
      "Selling Price",
      "Added Stock",
      "Location",
      "Added by",
    ];

    const textWidth = jsPDFDoc.getTextWidth(`${Branch} Shop`);
    const pageWidth = jsPDFDoc.internal.pageSize.width;
    const middleX = (pageWidth - textWidth) / 2;

    const paddingTop = 30;
    const middleY = paddingTop + 20;

    jsPDFDoc.setFontSize(18);
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.text(`General Shop`, middleX, middleY, { align: "center" });

    const secondTextY = middleY + 30;
    jsPDFDoc.setFontSize(12);
    jsPDFDoc.setFont("helvetica", "normal");
    jsPDFDoc.text(
      `Stock addition report from ${moment(FromDate).format(
        "MMMM D, YYYY"
      )} to ${moment(ToDate).format("MMMM D, YYYY")}`,
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

    jsPDFDoc.save(`${today} stock_addition.pdf`);
  };

  const handleDownloadSalesReport = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const tableData = SalesReportFlow.map((item) => {
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
    jsPDFDoc.text(`General Shop`, middleX, middleY, { align: "center" });

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

    jsPDFDoc.save(`${today} sales_report.pdf`);
  };

  const handleDownloadBranchSalesReport = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const tableData = SalesReportBranchFlow.map((item) => {
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

  const GeneralStock = (
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
        <h3>Stock Addition Report</h3>
        <div className="InputsReport">
          <label htmlFor="FromDate">From</label>
          <input
            id="FromDate"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onClick={handleDateClick}
            value={FromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="InputsReport">
          <label htmlFor="ToDate">To</label>
          <input
            id="ToDate"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onClick={handleDateClick}
            value={ToDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="DownloadButton">
          <button onClick={getStockAdditionReport}>Get Report</button>
        </div>

        {StockAdditionReport.length > 0 && (
          <div className="ButtonsMore">
            <button
              onClick={handleClickOpenStockAdditionView}
              className="ViewReport"
            >
              View Report
            </button>
            <button
              className="DownloadReport"
              onClick={handleDownloadPDFMajorStockAddition}
            >
              Download
            </button>
          </div>
        )}

        <Dialog
          open={openStockAdditionReport}
          TransitionComponent={Transition}
          fullScreen={isNarrowScreen}
          keepMounted
          onClose={handleCloseStockAdditionView}
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
                onClick={handleCloseStockAdditionView}
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
                onClick={handleDownloadPDFMajorStockAddition}
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
                Added stock value <span>(Can include - deductions)</span>:
                <span
                  style={{
                    color: totalAddedStockValue < 1 ? "#b91c1c" : "inherit",
                  }}
                >
                  KES {parseFloat(totalAddedStockValue).toLocaleString()}
                </span>
              </p>
              <p>
                Sale stock value: KES{" "}
                {parseFloat(totalExpectedSaleValue).toLocaleString()}
              </p>
              <p>
                Profit estimate: KES{" "}
                {parseFloat(totalExpectedProfit).toLocaleString()}
              </p>
            </div>
          </div>

          <DataGrid
            style={{ padding: "20px" }}
            rows={StockAdditionReport.map((product, index) => ({
              ...product,
              indexId: index + 1,
            }))}
            columns={[
              { field: "indexId", headerName: "ID", width: 70 },
              { field: "name", headerName: "Name", width: 200 },
              { field: "BuyingPrice", headerName: "Buying Price", width: 120 },
              { field: "price", headerName: "Selling Price", width: 120 },
              { field: "Branch", headerName: "Location", width: 120 },
              {
                field: "AddedQuantity",
                headerName: "Added Stock",
                width: 100,
              },
              {
                field: "current_stock",
                headerName: "In Stock",
                width: 100,
              },
              {
                field: "added_by",
                headerName: "Added by",
                width: 150,
              },
              {
                field: "date_added",
                headerName: "Added At",
                width: 150,
                renderCell: (params) => {
                  // Parse the original date and time using moment
                  const originalDate = moment(params.row.date_added);

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
                    <Link to={`/product_history/${params.row.product_id}`}>
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

  const GeneralSales = (
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
        <h3>Sales report</h3>
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
          <button onClick={handleSearchGenSales}>Get Report</button>
        </div>

        {SalesReportFlow.length > 0 && (
          <div className="ButtonsMore">
            <button onClick={handleClickOpenSales} className="ViewReport">
              View Report
            </button>
            <button
              className="DownloadReport"
              onClick={handleDownloadSalesReport}
            >
              Download
            </button>
          </div>
        )}

        <Dialog
          open={openSalesReport}
          TransitionComponent={Transition}
          fullScreen={isNarrowScreen}
          keepMounted
          onClose={handleCloseSales}
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
                onClick={handleCloseSales}
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
                onClick={handleDownloadSalesReport}
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
                  KES {parseFloat(originalSaleValue).toLocaleString()}
                </span>
              </p>
              <p>
                Current Sale Value: KES{" "}
                {parseFloat(currentSaleValue).toLocaleString()}
              </p>
              <p>
                Profit estimate: KES{" "}
                {parseFloat(
                  currentSaleValue - originalSaleValue
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <DataGrid
            style={{ padding: "20px" }}
            rows={SalesReportFlow.map((product, index) => ({
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
                  // Parse the original date and time using moment
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

  const BranchStock = (
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
        <h3>Branch Stock Addition Report</h3>
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
          <label htmlFor="FromDate">From</label>
          <input
            id="FromDate"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onClick={handleDateClick}
            value={FromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="InputsReport">
          <label htmlFor="ToDate">To</label>
          <input
            id="ToDate"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            onClick={handleDateClick}
            value={ToDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="DownloadButton">
          <button onClick={handleSearchBranchStock}>Get Report</button>
        </div>
        {StockAdditionBranchReport.length > 0 && (
          <div className="ButtonsMore">
            <button
              onClick={handleClickOpenStockAdditionBranchView}
              className="ViewReport"
            >
              View Report
            </button>
            <button onClick={handleDownloadPDF} className="DownloadReport">
              Download
            </button>
          </div>
        )}

        <Dialog
          open={openStockAdditionBranchReport}
          TransitionComponent={Transition}
          fullScreen={isNarrowScreen}
          keepMounted
          onClose={handleCloseStockAdditionBranchView}
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
                onClick={handleCloseStockAdditionBranchView}
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
                onClick={handleDownloadPDF}
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
                Added stock value <span>(Can include - deductions)</span>:
                <span
                  style={{
                    color: totalStockAddedBranch < 1 ? "#b91c1c" : "inherit",
                  }}
                >
                  KES {parseFloat(totalStockAddedBranch).toLocaleString()}
                </span>
              </p>
              <p>
                Sale stock value: KES{" "}
                {parseFloat(totalSaleValueBranch).toLocaleString()}
              </p>
            </div>
          </div>
          <DataGrid
            style={{ padding: "20px" }}
            rows={StockAdditionBranchReport.map((product, index) => ({
              ...product,
              indexId: index + 1,
            }))}
            columns={[
              { field: "indexId", headerName: "ID", width: 70 },
              { field: "name", headerName: "Name", width: 200 },
              { field: "BuyingPrice", headerName: "Buying Price", width: 120 },
              { field: "price", headerName: "Selling Price", width: 120 },
              { field: "Branch", headerName: "Location", width: 120 },
              {
                field: "AddedQuantity",
                headerName: "Added Stock",
                width: 100,
              },
              {
                field: "current_stock",
                headerName: "In Stock",
                width: 100,
              },
              {
                field: "added_by",
                headerName: "Added by",
                width: 150,
              },
              {
                field: "date_added",
                headerName: "Added At",
                width: 150,
                renderCell: (params) => {
                  // Parse the original date and time using moment
                  const originalDate = moment(params.row.date_added);

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
                    <Link to={`/product_history/${params.row.product_id}`}>
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
                  // Parse the original date and time using moment
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

          <div className="AdminAnalytics">
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
                        <span>Total stock value:</span>
                        <small>
                          {totalStockValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </small>
                      </li>

                      <li>
                        <span>Available stock value:</span>
                        <small>
                          {stockInfo.currentStockValue.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
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
                          {stockInfo.soldStockValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          <strong>
                            {" "}
                            (<small>{percentageSold.toFixed(2)}%</small>{" "}
                            <small>{renderArrowIcon(percentageSold)} </small>)
                          </strong>
                        </small>
                      </li>
                    </ul>

                    <span>*Currency in Kenya Shillings*</span>
                  </div>
                );
              })}
            </div>

            <div className="ReportButtons">
              <div className="ButtonDownload">
                <CloudDownloadIcon className="DownloadIcon" />
                <button onClick={() => toggleStockReportDrawer(true)}>
                  Stock Addition Report
                </button>
              </div>
              <div className="ButtonDownload">
                <CloudDownloadIcon className="DownloadIcon" />
                <button onClick={() => toggleSalesReportDrawer(true)}>
                  General Sales Report
                </button>
              </div>
              <div className="ButtonDownload">
                <CloudDownloadIcon className="DownloadIcon" />
                <button onClick={() => toggleBranchStockReportDrawer(true)}>
                  Branch Addition Report
                </button>
              </div>
              <div className="ButtonDownload">
                <CloudDownloadIcon className="DownloadIcon" />
                <button onClick={() => toggleBranchSalesReportDrawer(true)}>
                  Branch Sales Report
                </button>
              </div>
            </div>

            <div>
              <SwipeableDrawer
                anchor={"right"}
                open={stockReportDrawer}
                onClose={() => toggleStockReportDrawer(false)}
                onOpen={() => toggleStockReportDrawer(true)}
              >
                {GeneralStock}
              </SwipeableDrawer>
            </div>

            <div>
              <SwipeableDrawer
                anchor={"right"}
                open={salesReportDrawer}
                onClose={() => toggleSalesReportDrawer(false)}
                onOpen={() => toggleSalesReportDrawer(true)}
              >
                {GeneralSales}
              </SwipeableDrawer>
            </div>
            <div>
              <SwipeableDrawer
                anchor={"right"}
                open={branchStockReportDrawer}
                onClose={() => toggleBranchStockReportDrawer(false)}
                onOpen={() => toggleBranchStockReportDrawer(true)}
              >
                {BranchStock}
              </SwipeableDrawer>
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

            <div className="GraphsSummary">
              <div className="SummaryDash">
                <div className="headerDash">
                  <h3>Daily Sales Summary</h3>
                </div>
                <SalesAnalysisChart DailySales={DailySales} />
              </div>
              <div className="SummaryDash">
                <div className="headerDash">
                  <h3>Daily Stock Purchase Summary</h3>
                </div>
                <StockChartAnalysis DailyStockAdditions={DailyStockAdditions} />
              </div>

              <div className="SummaryDash">
                <div className="headerDash">
                  <h3>Daily Expenses Summary</h3>
                </div>
                <ExpensesAnalysisChart
                  DailyExpensesAdmin={DailyExpensesAdmin}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
