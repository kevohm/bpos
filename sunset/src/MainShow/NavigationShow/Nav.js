import React, { useContext, useState } from "react";
import Button from "./Button";
import { IonIcon } from "@ionic/react";
import "./Nav.css";

import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const Nav = ({ setSearchQuery, cart }) => {
  const [open, setOpen] = useState(false);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const getCartItemCount = () => {
    const itemCount = localStorage.getItem("cartItemCount");
    return itemCount ? parseInt(itemCount, 10) : 0;
  };

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="shadow-md w-full fixed top-0 left-0 md:bg-white bg-blue-800 bg-opacity-100 z-10">
      <div className="md:flex items-center justify-between py-7 md:px-3 px-2">
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <div className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-grey-800 hidden md:flex">
            <span className="text-3xl text-orange-600 mr-1 pt-2">
              <IonIcon name="logo-ionic" />
            </span>
            <a href="/index">Sunset</a>
          </div>

          <div className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-grey-800 md:inline-flex">
            <a
              href="/cart"
              className="cart-icon-container"
              style={{ border: "none", outline: "none" }}
            >
              <button style={{ border: "none", outline: "none" }}>
                <AiOutlineShoppingCart className="nav-icons" />
              </button>
              <div className="cart-count ">
                <span>{getCartItemCount()}</span>
              </div>
            </a>
          </div>

          <div className="nav-container md:inline-flex">
            <input
              className="search-input text-white md:text-black"
              type="text"
              placeholder="Enter your drink here..."
              onChange={handleSearchInputChange}
            />
          </div>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <span style={{ color: "white" }}>
            <IonIcon name={open ? "close" : "menu"} />
          </span>
        </div>
        <ul
          className={`md:flex md:items-left md:pb-0 pb-12 absolute md:static bg-blue-800 md:bg-white md:z-auto left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          <li className="md:flex md:ml-8 text-xl md:my-0 my-7">
            <a
              href={"/index"}
              className="text-white md:text-black hover:text-grey-400 duration-500 items-center flex flex-col md:flex-row md:mx-5"
            >
              Home
            </a>

            <a
              href={"/report"}
              className="text-white md:text-black hover:text-grey-400 duration-500 items-center flex flex-col md:flex-row md:mx-5 mt-5 md:mt-0"
            >
              Report
            </a>

            <a
              href={"/productedits"}
              className="text-white md:text-black hover:text-grey-400 duration-500 items-center flex flex-col md:flex-row md:mx-5 mt-5 md:mt-0"
            >
              Add Stock
            </a>

            <a
              href={"/expenses"}
              className="text-white md:text-black hover:text-grey-400 duration-500 items-center flex flex-col md:flex-row md:mx-5 mt-5 md:mt-0"
            >
              Expenses
            </a>
          </li>

          <button
            onClick={handleLogout}
            className="bg-green-500 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-indigo-400 duration-500"
          >
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
