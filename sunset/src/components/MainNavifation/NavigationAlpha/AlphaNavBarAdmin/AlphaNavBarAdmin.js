import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faCogs,
  faSignOutAlt,
  faQuestionCircle,
  faArrowRight,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import profile from "./profile.jpg";
import "./AlphaNavBarAdmin.scss";
import { AuthContext } from "../../../../AuthContext/AuthContext";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import Branches from "../AlphaBottomNavigation/Branches";

const AlphaNavBarAdmin = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date().getHours());
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    setGreeting(getGreeting());
  }, [time]);

  const getGreeting = () => {
    if (time >= 5 && time < 12) {
      return "Good morning!";
    } else if (time >= 12 && time < 18) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const firstWordOfBusinessName = user?.businessName
    ? user.businessName.split(" ")[0]
    : "";
  const currentAdmin = user?.fullname
    ? user.fullname.split(" ")[0] +
      (user.fullname.split(" ")[1] ? " " + user.fullname.split(" ")[1] : "")
    : "";

  const [systemNotifications, setSystemNotifications] = useState([]);

  const [stockDepletionCount, setStockDepletionCount] = useState(0);
  const [openBranchesDialog, setBranchesDialogOpen] = useState(false);

  const handleOpenBranchesDialog = () => {
    setBranchesDialogOpen(true);
  };

  const handleCloseBranchesDialog = () => {
    setBranchesDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS +
            `api/Products/systemnotifications/${company_id}`
        );
        const notifications = res.data;

        // Calculate stock depletion count
        const depletionCount = notifications.filter(
          (productEvent) => productEvent.event_type === "Stock Depletion"
        ).length;

        setStockDepletionCount(depletionCount);
        setSystemNotifications(notifications);
        console.log("Fetched data:", notifications);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="AlphaNavBarAdmin">
      <nav>
        <label className="AlphaAccountLogo">
          {firstWordOfBusinessName || currentAdmin}
        </label>

        <div className="LastPart">
          <div
            className="Notifications"
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
          >
            <FontAwesomeIcon icon={faBell} style={{ color: "white" }} />
            <span className="NotificationCount">{stockDepletionCount}</span>
          </div>

          <img
            src={profile}
            alt="profile"
            className="user-pic"
            onClick={() => setMenuOpen(!isMenuOpen)}
          />

          <div
            className={`sub-menu-wrap-alpha ${
              isMenuOpen ? "open-menu-alpha" : ""
            }`}
          >
            <div className="sub-menu">
              <div className="user-Info">
                <img src={profile} alt="profile" className="user-pic" />
                <h3>{firstWordOfBusinessName}</h3>
              </div>
              <hr />
              <a href="/profile" className="sub-menu-link">
                <FontAwesomeIcon icon={faUser} className="IconSub" />
                <p>Edit profile</p>
                <span>
                  <FontAwesomeIcon icon={faArrowRight} className="MoveIcon" />
                </span>
              </a>
              <a href="" className="sub-menu-link">
                <FontAwesomeIcon icon={faCogs} className="IconSub" />
                <p>Settings & Privacy</p>
                <span>
                  <FontAwesomeIcon icon={faArrowRight} className="MoveIcon" />
                </span>
              </a>
              <a href="" className="sub-menu-link">
                <FontAwesomeIcon icon={faQuestionCircle} className="IconSub" />
                <p>Help & Support</p>
                <span>
                  <FontAwesomeIcon icon={faArrowRight} className="MoveIcon" />
                </span>
              </a>
              <a href="" className="sub-menu-link">
                <FontAwesomeIcon icon={faSignOutAlt} className="IconSub" />
                <button onClick={handleLogout}>Log Out</button>
                <span>
                  <FontAwesomeIcon icon={faArrowRight} className="MoveIcon" />
                </span>
              </a>
            </div>
          </div>

          <div
            className={`sub-menu-wrap-alpha ${
              isNotificationsOpen ? "open-menu-alpha" : ""
            }`}
          >
            <div className="sub-menu">
              <div className="ProductActivities">
                <h1>Latest Activities</h1>
                <div className="TransactionEvents">
                  {systemNotifications.map((productEvent) => {
                    return (
                      <ul
                        key={productEvent.product_id}
                        className="transaction-list"
                      >
                        {/* <li className='transaction-item'>
                                    {productEvent.event_type === 'Stock Flow' && (
                                        <div className='dot-line'> 
                                            <Link to={'/notifications'}>
                                                <p>{productEvent.quantity} {productEvent.product_name}(s) added by {productEvent.performed_by} @ Kshs {productEvent.added_stock_value} via {productEvent.payment_mode} in {productEvent.Branch} <span>{moment(productEvent.event_date).subtract(3, 'hours').fromNow()}</span></p> 
                                            </Link>
                                        </div>
                                    )}
                                    </li> */}
                        {/* <li className='transaction-item'>
                                    {productEvent.event_type === 'Sale' && (
                                        <div className='dot-line'>
                                            <Link to={'/notifications'}>
                                                <p>{productEvent.quantity} {productEvent.product_name}(s)  sold by {productEvent.performed_by} @ Kshs {productEvent.sold_stock_value} via {productEvent.payment_mode} in {productEvent.Branch} <span>{moment(productEvent.event_date).subtract(3, 'hours').fromNow()}</span></p> 
                                            </Link>
                                        </div>
                                    )}
                                    </li> */}
                        <li className="transaction-item">
                          {productEvent.event_type === "Stock Depletion" && (
                            <div className="dot-line">
                              <Link to={"/notifications"}>
                                <p
                                  style={{
                                    backgroundColor: "#fee2e2",
                                    color: "black",
                                  }}
                                >
                                  {productEvent.product_name}(s){" "}
                                  {productEvent.ml > 0 && (
                                    <small>{productEvent.ml}ml</small>
                                  )}{" "}
                                  selling @ Kshs {productEvent.price} has been
                                  depleted{" "}
                                  <span>
                                    <small>{productEvent.Branch}</small>
                                  </span>
                                </p>
                              </Link>
                            </div>
                          )}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="BranchesView">
        <button onClick={handleOpenBranchesDialog}>Select branch...</button>
        <Branches
          open={openBranchesDialog}
          handleClose={handleCloseBranchesDialog}
        />
      </div>
    </div>
  );
};

export default AlphaNavBarAdmin;
