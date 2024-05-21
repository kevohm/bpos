import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./StockSheet.scss";

const StockSheet = () => {
  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const [analyticsData, setAnalyticsData] = useState([]);
  const [query, setQuery] = useState("");
  const today = moment().format("MMMM D, YYYY");
  const timetoday = moment().format("hh:mm:ss a");
  const [stockSummary, setStockSummary] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS + `api/analytics/${Branch}?q=${query}`
      )
      .then((response) => {
        setAnalyticsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch, query]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/expenses/stockanalysis/${Branch}`
      )
      .then((response) => {
        setStockSummary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch]);

  const downloadPDF = () => {
    const unit = "pt";
    const size = "A4";
    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const costOfGoods = analyticsData.reduce((total, item) => {
      return total + item.OpeningStock * item.BuyingPrice;
    }, 0);

    const tableData = analyticsData
    .map(item => [
      {
        content: item.name,
        styles: { fontStyle: "bold", textColor: "black" }
      },
      {
        content: item.OpeningStock,
        styles: { fontStyle: "bold", textColor: "black" }
      },
      {
        content: item.price.toLocaleString(),
        styles: { fontStyle: "bold", textColor: "black" }
      },
      {
        content: item.amountMl.toLocaleString(),
        styles: { fontStyle: "bold", textColor: "black" }
      }
    ]);
  

    const headers = ["Name", "Opening_stock", "Price / unit", "Amount (Ml)"];
    const padding = 10;

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
    jsPDFDoc.text(`Stock report as at ${today} done by ${timetoday}`, middleX, secondTextY, {
      align: "center",
    });

    const costOfGoodsY = middleY + 60;

    jsPDFDoc.setTextColor("#172554");
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.text(
      `Cost of Goods: ${costOfGoods.toFixed(2)}`,
      middleX,
      costOfGoodsY,
      { align: "center" }
    );
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.setTextColor("black");

    const stockTableY = secondTextY + 50;

    jsPDFDoc.autoTable({
      head: [headers],
      body: tableData,
      startY: stockTableY,
      headStyles: {
        fontStyle: "bold",
        fillColor: "rgb(21, 74, 147)",
        textColor: "white",
      },
    });

    jsPDFDoc.save(`${Branch} ${today} stock.pdf`);
  };

  return (
    <div className="StockSheet">
      <button onClick={downloadPDF}>DownloadPdf</button>
    </div>
  );
};

export default StockSheet;
