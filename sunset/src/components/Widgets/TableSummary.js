import React, { useContext, useEffect, useState } from "react";
import "./TableSummary.scss";
import { AuthContext } from "../../AuthContext/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TableSummary = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const [companyProfit, setCompanyProfit] = useState([]);
  const [salesDash, setSalesDash] = useState([]);
  const [cashAtHand, setCashAtHand] = useState([]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Number of items per slide for large screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Slide every 5 seconds
    arrows: false, // Hide navigation arrows
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/analytics/companyprofit/${company_id}`
      )
      .then((response) => {
        setCompanyProfit(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company profit:", error);
      });

    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/analytics/cashathand/${company_id}`
      )
      .then((response) => {
        setCashAtHand(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company profit:", error);
      });

    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/analytics/salesshow/${company_id}`
      )
      .then((response) => {
        setSalesDash(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  }, [company_id]);

  const renderData = (data, property) => {
    return data.map((val) => (
      <div key={val.id}>
        <span>
          {val[property].toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    ));
  };

  return (
    <div className="TableSummary">
      <Slider {...sliderSettings} className="custom-slider">
        <div className="widgetSummaryItem bg-teal-500">
          <div>
            <span>Cash at hand-{renderData(cashAtHand, "month")}</span>
            <small>{renderData(cashAtHand, "cash_at_hand")}</small>
          </div>
        </div>

        <div className="widgetSummaryItem bg-orange-500">
          <div>
            <PaymentsIcon className="WidgetIcos" />
          </div>
          <div>
            <span>Today Sales</span>
            <small>{renderData(salesDash, "TodaySales")}</small>
          </div>
        </div>

        <div className="widgetSummaryItem bg-green-500">
          <div>
            <TrendingUpIcon className="WidgetIcos" />
          </div>
          <div>
            <span>Today Stock In</span>
            <small>{renderData(salesDash, "stock_in")}</small>
          </div>
        </div>

        <div className="widgetSummaryItem bg-cyan-500">
          <div>
            <PointOfSaleIcon className="WidgetIcos" />
          </div>
          <div>
            <span>Today Expenses</span>
            <small>{renderData(salesDash, "TodayExpenses")}</small>
          </div>
        </div>

        <div className="widgetSummaryItem bg-sky-500 flex items-start">
          <div className="mr-2">
            <MonetizationOnIcon className="WidgetIcos" />
          </div>
          <div>
            <span>Today Profit </span>
            <small>{renderData(companyProfit, "daysProfit")}</small>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default TableSummary;
