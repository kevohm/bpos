import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext";
import { useParams } from "react-router-dom";
import SalesPersonsNavigation from "../NavigationShow/SalesPersonsNavigation";
import "./userProfile.scss";
import moment from "moment";
import { motion } from "framer-motion";
import "jspdf-autotable";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import PROFILE from "./profile.png";
import UserProfile from "./ProfileReportPages/ProfilePage/UserProfile";
import Sales from "./ProfileReportPages/Sales/Sales";

const ReportProfile = () => {
  const { user } = useContext(AuthContext);
  const Branch = user?.Branch;
  const SoldBy = user?.fullname;
  const { id } = useParams();
  const [userInformation, setUserInformation] = useState({});
  const [expenseAnalysis, setExpenseAnalysis] = useState([]);
  const [productDataMpesa, setProductDataMpesa] = useState([]);
  const [productDataCash, setProductDataCash] = useState([]);
  const [productSaleCount, setProductSaleCount] = useState([]);
  const today = moment().format("MMMM D, YYYY");
  const currentUser = user?.fullname;

  const [activeTab, setActiveTab] = useState("Add Stock");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
  const duration = moment.duration(shiftedEndTime.diff(shiftedStartTime));
  const totalHoursWorked = duration.asHours();
  const hours = Math.floor(totalHoursWorked);
  const minutes = Math.floor((totalHoursWorked - hours) * 60);
  const seconds = Math.floor(((totalHoursWorked - hours) * 60 - minutes) * 60);
  const formattedTotalHoursWorked = `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <h3>Select to extend</h3>
      <Divider />
      <div>
        <label>Date & Time</label>
        <input />
      </div>
    </Box>
  );

  return (
    <div>
      <SalesPersonsNavigation />
      <motion.div
        className="userProfile"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1.5, type: "spring" }}
      >
        <div>
          <UserProfile />
          <Sales />
        </div>
      </motion.div>
    </div>
  );
};

export default ReportProfile;
