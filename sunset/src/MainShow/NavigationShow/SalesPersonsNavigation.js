import React, { useContext, useEffect, useState } from "react";
import "./SalesPersonsNavigation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const pathVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

const SalesPersonsNavigation = ({ setSearchQuery }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const id = user?.id;
  const user_id = user?.id;

  const [userInformation, setUserInformation] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
  });
  const firstWordOfBusinessName = user?.Branch ? user.Branch.split(" ")[0] : "";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const getCartItemCount = () => {
    const itemCount = localStorage.getItem("cartItemCount");
    return itemCount ? parseInt(itemCount, 10) : 0;
  };
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const [userDetails, setUserDetails] = useState([]);

  const loadData = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_ADDRESS +
        `/api/user_operations/single_user/${user_id}`
    );
    setUserDetails(response.data);
    console.log("the data is", response.data);
  };
  useEffect(() => {
    loadData();
  }, [user_id]);

  // user information
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

  const shiftedStartTime = moment(userInformation.shift_start_time).subtract(
    3,
    "hours"
  );
  const shiftedEndTime = moment(userInformation.shift_end_time).subtract(
    3,
    "hours"
  );

  return (
    <motion.div
      className={`SalesPersonsNavigation ${menuVisible ? "show" : ""}`}
      initial={{ y: -250 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 120 }}
    >
      <div className="TopNavItemsSeller">
        <div className="AlphaLogo">
          <motion.span
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          >
            
              {userDetails.map((user, index) => (
                <a href="/index" key={index}>
                  {user.imageUrl && user.imageUrl.length > 0 && (
                    <img
                      src={user.imageUrl[0]}
                      alt=""
                    />
                  )}
                </a>
              ))}
           
          </motion.span>
        </div>

        <div className="productSearch">
          <input
            placeholder="Search"
            type="search"
            onChange={handleSearchInputChange}
          />
        </div>

        <div className="Notifications">
          <div>
            <a
              href="/cart"
              className="cart-icon-container"
              style={{ border: "none", outline: "none" }}
            >
              <button style={{ border: "none", outline: "none" }}>
                <ShoppingCartIcon
                  style={{ color: "#021e46", fontSize: "35px" }}
                />
              </button>
              <div className="cart-count">
                <span>{getCartItemCount()}</span>
              </div>
            </a>
          </div>
          <FontAwesomeIcon
            icon={faBars}
            className="toggle"
            onClick={toggleMenu}
          />
        </div>
      </div>

      <div className={`AphaNavList ${menuVisible ? "show" : ""}`} id="nav-menu">
        <FontAwesomeIcon
          icon={faTimes}
          className="close"
          onClick={toggleMenu}
        />
        <ul className="nav_list">
          <motion.li
            className="nav_item"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: "300" }}
            whileHover={{
              scale: 1.2,
              originX: 0,
            }}
          >
            <a href="/index" className="nav_link">
              Home
            </a>
          </motion.li>
          <motion.li
            className="nav_item"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: "300" }}
            whileHover={{
              scale: 1.2,
              originX: 0,
            }}
          >
            <a href="/stockorders" className="nav_link">
              Order View
            </a>
          </motion.li>

          <motion.li
            className="nav_item"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: "300" }}
            whileHover={{
              scale: 1.2,
              originX: 0,
            }}
          >
            <a href="/productedits" className="nav_link">
              Stock Additions
            </a>
          </motion.li>

          <motion.li
            className="nav_item"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: "300" }}
            whileHover={{
              scale: 1.2,
              originX: 0,
            }}
          >
            <a href="/stock_take" className="nav_link">
              Stock Taking
            </a>
          </motion.li>

          <motion.li
            className="nav_item"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: "300" }}
            whileHover={{
              scale: 1.2,
              originX: 0,
            }}
          >
            <a href="/expenses" className="nav_link">
              Expenses
            </a>
          </motion.li>

          {shiftedStartTime.isBefore(shiftedEndTime) && (
            <motion.li
              className="nav_item"
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: "300" }}
              whileHover={{
                scale: 1.2,
                originX: 0,
              }}
            >
              <a href={`/user_profile/${id}`} className="nav_link">
                Reports
              </a>
            </motion.li>
          )}

          {/* <motion.li
            className="nav_item"
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: "300" }}
            whileHover={{
              scale: 1.2,
              originX: 0,
            }}
          >
            <a href="/chats" className="nav_link">
              Chatbox
            </a>
          </motion.li> */}

          <li className="nav_item">
            <a href="/" className="nav_link">
              <motion.button
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: "300" }}
                whileHover={{
                  scale: 1.1,
                }}
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </a>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default SalesPersonsNavigation;
