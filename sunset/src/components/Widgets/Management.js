import React, { useContext } from "react";
import "./Management.scss";
import "./Suspended.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faCashRegister,
  faChartSimple,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Popover from "@mui/material/Popover";
import Slide from "@mui/material/Slide";
import { AuthContext } from "../../AuthContext/AuthContext";
import AdminDashAnalytics from "./DashBoardAnalyticsAdmin/AdminDashAnalytics";
import HomePageNotifications from "../../Administrator/SystemNotifications/HomePageNotifications";

const Management = () => {
  const [openCal, setOpen] = React.useState(false);

  const { user } = useContext(AuthContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCalc = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="HomeDashboard">
      <div className="Management">
        {user && user.role === "Admin" && (
          <div className="Viewmanager">
            <Link to={"/stocksetup"} className="Linked">
              <div className="IconView">
                <FontAwesomeIcon icon={faGear} />
              </div>
              <div className="LinkView">
                <span>Stock Manager</span>
                <p>Add, manage, track, distribute, view.</p>
              </div>
            </Link>
          </div>
        )}

        {user && user.role === "Admin" && (
          <div className="Viewmanager">
            <Link to={"/stockorders"} className="Linked">
              <div className="IconView">
                <FontAwesomeIcon icon={faGear} />
              </div>
              <div className="LinkView">
                <span>Stock Orders</span>
                <p>Manage,approve & dispatch</p>
              </div>
            </Link>
          </div>
        )}

        {user && user.role === "Admin" && (
          <div className="Viewmanager">
            <Link to={"/sales"} className="Linked">
              <div className="IconView">
                <FontAwesomeIcon icon={faGear} />
              </div>
              <div className="LinkView">
                <span>Sales</span>
                <p>
                  Sell products,track your performance, balances and customers
                </p>
              </div>
            </Link>
          </div>
        )}

        {user && user.role === "Admin" && (
          <div className="Viewmanager">
            <Link to={"/cashflow"} className="Linked">
              <div className="IconView">
                <FontAwesomeIcon icon={faCashRegister} />
              </div>
              <div className="LinkView">
                <span>Cash Flow Manager</span>
                <p>Manage Cash in, cash out, and cash in hand</p>
              </div>
            </Link>
          </div>
        )}

        {user && user.role === "Admin" && (
          <div className="Viewmanager">
            <Link to={"/analytics"} className="Linked">
              <div className="IconView">
                <FontAwesomeIcon icon={faChartSimple} />
              </div>
              <div className="LinkView">
                <span>Reports and Analytics</span>
                <p>Sales analysis, branch comparisons, trends.</p>
              </div>
            </Link>
          </div>
        )}

        {user && user.role === "Admin" && (
          <div className="Viewmanager">
            <Link to={"/myattendants"} className="Linked">
              <div className="IconView">
                <FontAwesomeIcon icon={faPerson} className="icon" />
              </div>
              <div className="LinkView">
                <span>My Attendants</span>
                <p>Add,Manage,Monitor your attendants.</p>
              </div>
            </Link>
          </div>
        )}

        {/* Suspended button */}
        <div className="SuspendedButton">
          {/* <button aria-describedby={id} onClick={handleClick} className="SuspendedButtonIcon">
        <FontAwesomeIcon icon={faBars} />
      </button> */}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <div className="SuspendedContent">
              <div className="SuspendedHeader">
                <span>Quick Actions</span>
              </div>
              <div className="SuspendedActions">
                <Link to={"/index"} className="SuspendedAction">
                  <span>Home</span>
                </Link>
                {user && user.role === "NormalUser" && (
                  <Link to={"/sales"} className="SuspendedAction">
                    <span>Sell</span>
                  </Link>
                )}
                {user && user.role === "Admin" && (
                  <Link to={"/cashflow"} className="SuspendedAction">
                    <span>Cash Flow</span>
                  </Link>
                )}
                {user && user.role === "Admin" && (
                  <Link to={"/stocksetup"} className="SuspendedAction">
                    <span>Re-stock</span>
                  </Link>
                )}
                <Link to={"/customers"} className="SuspendedAction">
                  <span>Customers</span>
                </Link>
                <button className="SuspendedAction" onClick={handleClickOpen}>
                  <span>Calculator</span>
                </button>
              </div>
            </div>
          </Popover>
        </div>
        <div>
          <HomePageNotifications />
        </div>
      </div>
      <div className="AnalyticsCharts">
        <AdminDashAnalytics />
      </div>
    </div>
  );
};

export default Management;
