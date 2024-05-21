import React, { useContext, useEffect, useState } from "react";
import "./SystemNotifications.scss";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { motion } from "framer-motion";

const SystemNotifications = () => {
  const { user } = useContext(AuthContext);
  const [systemNotifications, setSystemNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Products/systemnotifications`
        );
        setSystemNotifications(res.data);
        console.log("Fetched data:", res.data); // Log the fetched data
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="SystemNotifications">
            <div className="ProductActivities">
              <div className="TransactionEvents">
                {systemNotifications.map((productEvent) => {
                  return (
                    <ul
                      key={productEvent.product_id}
                      className="transaction-list"
                    >
                      <li className="transaction-item">
                        {productEvent.event_type === "Stock Flow" && (
                          <div className="dot-line">
                            <motion.p
                              animate={{ x: 0 }}
                              transition={{ type: "spring", stiffness: "150" }}
                              whileHover={{
                                scale: 1.01,
                              }}
                            >
                              {productEvent.quantity}{" "}
                              {productEvent.product_name}(s) added{" "}
                              {moment(productEvent.event_date)
                                .subtract(3, "hours")
                                .fromNow()}{" "}
                              @ Kshs {productEvent.added_stock_value}.{" "}
                              <span>
                                <small>{productEvent.performed_by}</small>
                                <small>{productEvent.Branch}</small>
                              </span>
                            </motion.p>
                          </div>
                        )}
                      </li>
                      <li className="transaction-item">
                        {productEvent.event_type === "Sale" && (
                          <div className="dot-line">
                            <motion.p
                              animate={{ x: 0 }}
                              transition={{ type: "spring", stiffness: "150" }}
                              whileHover={{
                                scale: 1.01,
                              }}
                            >
                              {productEvent.quantity}{" "}
                              {productEvent.product_name}(s) sold{" "}
                              {moment(productEvent.event_date)
                                .subtract(3, "hours")
                                .fromNow()}{" "}
                              @ Kshs {productEvent.sold_stock_value}.{" "}
                              <span>
                                <small>{productEvent.performed_by}</small>
                                <small>{productEvent.Branch}</small>
                              </span>
                            </motion.p>
                          </div>
                        )}
                      </li>
                      <li className="transaction-item">
                        {productEvent.event_type === "Stock Depletion" && (
                          <div className="dot-line">
                            <motion.p
                              animate={{ x: 0 }}
                              transition={{ type: "spring", stiffness: "150" }}
                              whileHover={{
                                scale: 1.01,
                              }}
                              className="depleted"
                            >
                              {productEvent.product_name}(s) selling @ Kshs{" "}
                              {productEvent.price} has been depleted{" "}
                              <span>
                                <small>{productEvent.Branch}</small>
                                {productEvent.ml > 0 && (
                                  <small>{productEvent.ml}ml</small>
                                )}
                              </span>
                            </motion.p>
                          </div>
                        )}
                      </li>
                    </ul>
                  );
                })}
              </div>
            </div>
            <div className="MessageSender">
              <motion.button
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: "150" }}
                whileHover={{
                  scale: 1.1,
                }}
              >
                <AddPhotoAlternateIcon className="sendMessageIcon" />
              </motion.button>

              <motion.input
                placeholder="message.."
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: "150" }}
                whileHover={{
                  scale: 1.01,
                }}
              />
              <motion.button
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: "300" }}
                whileHover={{
                  scale: 1.1,
                }}
              >
                <SendIcon className="sendMessageIcon" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemNotifications;
