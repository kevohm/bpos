import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Sales.scss";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AuthContext } from "../../../../AuthContext/AuthContext";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  Document,
  PDFDownloadLink,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import PdfModal from "./Modal ";

const Sales = () => {
  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const SoldBy = user?.fullname;
  const { id } = useParams();
  const today = moment().format("MMMM D, YYYY");
  const currentUser = user?.fullname;
  const [userInformation, setUserInformation] = useState({});
  const [expenseAnalysis, setExpenseAnalysis] = useState([]);
  const [productDataMpesa, setProductDataMpesa] = useState([]);
  const [productDataCash, setProductDataCash] = useState([]);
  const [productSaleCount, setProductSaleCount] = useState([]);
  const [pdfContent, setPdfContent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const pdfName = `${Branch} ${today} sales.pdf`;
  console.log(pdfName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Auth/staffmembers/${id}`
        );
        setUserInformation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  // getting the expenses
  useEffect(() => {
    if (
      userInformation.shift_start_time &&
      userInformation.shift_end_time &&
      Branch
    ) {
      const shiftedStartTime = moment(
        userInformation.shift_start_time
      ).toISOString();
      const shiftedEndTime = moment(
        userInformation.shift_end_time
      ).toISOString();

      axios
        .get(
          process.env.REACT_APP_API_ADDRESS +
            `api/groupAnalytics/summaryanalysis?shift_start_time=${shiftedStartTime}&shift_end_time=${shiftedEndTime}&SoldBy=${SoldBy}`
        )
        .then((response) => {
          setExpenseAnalysis(response.data);
        })
        .catch((error) => {
          console.error("Error fetching branch analytics:", error);
        });
    }
  }, [userInformation, SoldBy]);

  // Mpesa sales
  useEffect(() => {
    if (
      userInformation.shift_start_time &&
      userInformation.shift_end_time &&
      Branch
    ) {
      const shiftedStartTime = moment(
        userInformation.shift_start_time
      ).toISOString();
      const shiftedEndTime = moment(
        userInformation.shift_end_time
      ).toISOString();

      axios
        .get(
          process.env.REACT_APP_API_ADDRESS +
            `api/groupAnalytics/salesreport?shift_start_time=${shiftedStartTime}&shift_end_time=${shiftedEndTime}&SoldBy=${SoldBy}`
        )
        .then((response) => {
          setProductDataMpesa(response.data);
        })
        .catch((error) => {
          console.error("Error fetching branch analytics:", error);
        });
    }
  }, [userInformation, SoldBy]);

  // Cash sales

  useEffect(() => {
    if (
      userInformation.shift_start_time &&
      userInformation.shift_end_time &&
      Branch
    ) {
      const shiftedStartTime = moment(
        userInformation.shift_start_time
      ).toISOString();
      const shiftedEndTime = moment(
        userInformation.shift_end_time
      ).toISOString();

      axios
        .get(
          process.env.REACT_APP_API_ADDRESS +
            `api/groupAnalytics/salesreportcash?shift_start_time=${shiftedStartTime}&shift_end_time=${shiftedEndTime}&SoldBy=${SoldBy}`
        )
        .then((response) => {
          setProductDataCash(response.data);
        })
        .catch((error) => {
          console.error("Error fetching branch analytics:", error);
        });
    }
  }, [userInformation, SoldBy]);

  // Product sale count
  useEffect(() => {
    if (
      userInformation.shift_start_time &&
      userInformation.shift_end_time &&
      Branch
    ) {
      const shiftedStartTime = moment(
        userInformation.shift_start_time
      ).toISOString();
      const shiftedEndTime = moment(
        userInformation.shift_end_time
      ).toISOString();

      axios
        .get(
          process.env.REACT_APP_API_ADDRESS +
            `api/groupAnalytics/productsalecount?shift_start_time=${shiftedStartTime}&shift_end_time=${shiftedEndTime}&SoldBy=${SoldBy}`
        )
        .then((response) => {
          setProductSaleCount(response.data);
        })
        .catch((error) => {
          console.error("Error fetching branch analytics:", error);
        });
    }
  }, [userInformation, SoldBy]);

  const shiftedStartTime = moment(userInformation.shift_start_time).subtract(
    3,
    "hours"
  );
  const shiftedEndTime = moment(userInformation.shift_end_time).subtract(
    3,
    "hours"
  );

  const formattedStartTime = shiftedStartTime.format("DD-MMMM-YYYY HH:mm:ss");
  const formattedEndTime = shiftedEndTime.format("DD-MMMM-YYYY HH:mm:ss");

  useEffect(() => {
    const generatePDF = () => {
      const unit = "pt";
      const size = "A4";
      const padding = 10;

      const jsPDFDoc = new jsPDF({
        orientation: "landscape",
        unit,
        format: size,
      });

      let totalMpesa = 0;
      let totalCash = 0;

      // Sum up Mpesa and cash totals
      productDataMpesa.forEach((item) => {
        totalMpesa += parseFloat(item.productTotal);
      });

      productDataCash.forEach((item) => {
        totalCash += parseFloat(item.productTotal);
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

      const tableData = productDataMpesa.map((item, index) => [
        index + 1,
        {
          content: item.productName,
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: item.price,
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: item.mpesa_count,
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: item.cash_count,
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: item.both_methods,
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: item.mpesa_total,
          styles: { fontStyle: "bold", textColor: "black" },
        },
        {
          content: item.cash_total,
          styles: { fontStyle: "bold", textColor: "black" },
        },
      ]);

      const headers = [
        "No.",
        "Product name",
        "Price/unit",
        "Mpesa count",
        "Cash count",
        "Both sale",
        "Mpesa total",
        "Cash total",
      ];

      jsPDFDoc.setFontSize(13);
      jsPDFDoc.text(
        `${Branch} sales report between ${formattedStartTime} & ${formattedEndTime}`,
        40,
        20
      );
      jsPDFDoc.text(`Attendant: ${currentUser}`, 40, 40 + padding);

      jsPDFDoc.autoTable({
        head: [ExpensesHeaders],
        body: expenseData,
        startY: 60,
        headStyles: { fillColor: "#172554" },
      });

      const mpesaTableY = jsPDFDoc.autoTable.previous.finalY + 20;

      jsPDFDoc.autoTable({
        head: [headers],
        body: tableData,
        startY: mpesaTableY,
        headStyles: { fillColor: "#172554" },
      });

      // Add footer text
      jsPDFDoc.setFontSize(11);
      jsPDFDoc.setTextColor(0, 0, 255); // Set text color to blue
      const footerText = `Generated by www.liquourlogic.co.ke`;
      const textWidth =
        (jsPDFDoc.getStringUnitWidth(footerText) *
          jsPDFDoc.internal.getFontSize()) /
        jsPDFDoc.internal.scaleFactor;
      const startX = (jsPDFDoc.internal.pageSize.width - textWidth) / 2; // Calculate starting X position for centering
      const startY = jsPDFDoc.internal.pageSize.height - 10; // Y coordinate for the link
      jsPDFDoc.textWithLink(footerText, startX, startY, {
        url: "http://www.liquourlogic.co.ke",
      });

      // Save the PDF content
      const pdfContent = jsPDFDoc.output("blob");
      return pdfContent;
    };

    // Call generatePDF to generate the PDF content
    const content = generatePDF();

    setPdfContent(content);
  }, [
    productDataMpesa,
    productDataCash,
    productSaleCount,
    expenseAnalysis,
    Branch,
    today,
    currentUser,
  ]);

  return (
    <div className="Sales">
      <div className="Head">
        <h1>Sales section</h1>
      </div>
      <div className="SalesSection">
        <div className="SalesSummary">
          {expenseAnalysis.map((expenses) => {
            return (
              <ul>
                <li>
                  <span
                    style={{
                      backgroundColor: "#22c55e",
                    }}
                  >
                    Mpesa
                  </span>
                  <small>{expenses.totalMpesaSalesToday}</small>
                </li>
                <li>
                  <span>Cash</span>
                  <small>{expenses.totalCashSalesToday}</small>
                </li>
                <li>
                  <span>Total</span>
                  <small>{expenses.grandTotalSales}</small>
                </li>
                <li>
                  <span>Expenses</span>
                  <small>{expenses.totalExpensesToday}</small>
                </li>
                <li>
                  <span>Net sales</span>
                  <small>{expenses.netTotalSales}</small>
                </li>
              </ul>
            );
          })}

          <div className="downloadSales">
            <button onClick={() => setOpenModal(true)}>
              View Sales Report
            </button>
          </div>
        </div>
        <div className="PdfModal">
          <PdfModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            pdfContent={pdfContent}
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;
