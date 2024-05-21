import React, { useContext, useEffect, useState } from "react";
import "./HomePageNotifications.scss";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../../AuthContext/AuthContext";
import { motion } from "framer-motion";

const HomePageNotifications = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;
  const [systemNotifications, setSystemNotifications] = useState([]);

  //Getting daily sales per branch dataset
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS +
            `api/Products/systemnotifications/${company_id}`
        );
        setSystemNotifications(res.data);
        console.log("Fetched data:", res.data); // Log the fetched data
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [company_id]);

  return (
    <div className="HomePageNotifications">
      <h3>Latest activities</h3>
      <div className="ProductActivities">
        <div className="TransactionEvents">
          {systemNotifications.map((productEvent) => {
            return (
              <ul key={productEvent.product_id} className="transaction-list">
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
                        {productEvent.quantity} {productEvent.product_name}(s)
                        added{" "}
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
                        {productEvent.quantity} {productEvent.product_name}(s)
                        sold{" "}
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
    </div>
  );
};

export default HomePageNotifications;
