import React, { useContext, useEffect, useState } from "react";
import "./AlphaSideBarNav.scss";
import "./BranchDialog.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartBar,
  faBell,
  faUsers,
  faTree,
  faCalendar,
  faSignOutAlt,
  faFileAlt,
  faUser,
  faShoppingCart,
  faMoneyBillWave,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../AuthContext/AuthContext";
import axios from "axios";
import Dialog from "@mui/material/Dialog";

import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlphaSideBarNav = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [BranchPut, setBranchPut] = useState([]);
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/analytics/branches/${company_id}`
      )
      .then((response) => {
        setBranchPut(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product groups:", error);
      });
  }, [company_id]);

  return (
    <div className="AlphaSideBarNav">
      <ul>
        <span>Main</span>
        <li>
          <a href="/index">
            <FontAwesomeIcon icon={faHome} className="iconalpha" />
            <p>Homepage</p>
          </a>
        </li>
        <li>
          <a href="/index">
            <FontAwesomeIcon icon={faUser} className="iconalpha" />
            <p>Profile</p>
          </a>
        </li>
      </ul>
      <ul>
        <span>Lists</span>
        <li>
          <a href="/new_product">
            <FontAwesomeIcon icon={faShoppingCart} className="iconalpha" />
            <p>Add Product</p>
          </a>
        </li>
        <li>
          <a href="/stocksetup">
            <FontAwesomeIcon icon={faShoppingCart} className="iconalpha" />
            <p>List Products</p>
          </a>
        </li>
        <li>
          <a href="/sales">
            <FontAwesomeIcon icon={faMoneyBillWave} className="iconalpha" />
            <p>Sales</p>
          </a>
        </li>
        <li>
          <a href="/daily_sales">
            <FontAwesomeIcon icon={faMoneyBillWave} className="iconalpha" />
            <p>Daily Sales</p>
          </a>
        </li>
        <li>
          <a>
            <FontAwesomeIcon icon={faTree} className="iconalpha" />
            <button onClick={handleClickOpen}>Branches</button>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="BranchDialog">
                <div className="DialogSerachButton">
                  <input placeholder="Search" type="search" />
                </div>
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    paddingLeft: "50px",
                    paddingRight: "50px",
                  }}
                >
                  {BranchPut.map((val) => {
                    return (
                      <li
                        style={{
                          color: "#155e75",
                          textTransform: "lowercase",
                          fontSize: "18px",
                        }}
                      >
                        <a
                          href={`/analytics/${val.BranchName}`}
                          className="LinkBranch"
                        >
                          {val.BranchName}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Dialog>
          </a>
        </li>
        <li>
          <a href="/myattendants">
            <FontAwesomeIcon icon={faUsers} className="iconalpha" />
            <p>Users</p>
          </a>
        </li>
      </ul>
      <ul>
        <span>General</span>
        <li className="noti">
          <a href="/notifications">
            <FontAwesomeIcon icon={faBell} className="iconalpha" />
            <p>Notifications</p>
          </a>
        </li>
        <li>
          <a href="/notifications">
            <FontAwesomeIcon icon={faFileAlt} className="iconalpha" />
            <p>Notes</p>
          </a>
        </li>
        <li>
          <a href="/schedules">
            <FontAwesomeIcon icon={faCalendar} className="iconalpha" />
            <p>Calender</p>
          </a>
        </li>
      </ul>
      <ul>
        <span>Analytics</span>
        <li>
          <a href="/analytics">
            <FontAwesomeIcon icon={faChartBar} className="iconalpha" />
            <p>Charts</p>
          </a>
        </li>
        <li>
          <a href="/notifications">
            <FontAwesomeIcon icon={faHome} className="iconalpha" />
            <p>Logs</p>
          </a>
        </li>
      </ul>
      <ul>
        <span>Maintenance</span>
        <li>
          <a href="/home">
            <FontAwesomeIcon icon={faCogs} className="iconalpha" />
            <p>Settings</p>
          </a>
        </li>
        <li>
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="iconalpha" />
            <p>Logout</p>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AlphaSideBarNav;
