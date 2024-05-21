import React, { useEffect, useState } from "react";
import { navLinks } from "../../../constants";
import { IoCloseSharp } from "react-icons/io5";
import { FiAlignRight } from "react-icons/fi";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FaEye, FaEyeSlash, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { useAuth } from "../../../AuthContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import LOGO from "./LOGO.png";
import "./LOGO.scss";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Spinner from "../../CompanyRegistration/Spinner";
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';


const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));


const AnotherHeader = () => {
  const [active, setActive] = useState("Home");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [navToggle, setToggle] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [isDialog, setIsDialog] = React.useState(true);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_ADDRESS + `api/branch_operations`
    );
    setData(response.data);
  };
  useEffect(() => {
    loadData();
  }, []);

  

  const toggle = () => {
    setOpen(!open);
    setIsDialog(!isDialog);
    setToggle(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLocationChange = (e) => {
    setLocationName(e.target.value);
  };
  const getUserLocation = async () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const name = await getLocationName(latitude, longitude);
          setLocationName(name);
          setUserLocation({ latitude, longitude });
          setLongitude(longitude);
          setLatitude(latitude);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error("Error getting location name:", error);
      return "";
    }
  };

 
  const displayedLocationName = locationName
    ? locationName.split(",")[0]
    : "";

    useEffect(() => {
    }, [locationName, displayedLocationName]);
    

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!locationName) {
      setError("Please select a location before logging in");
      setOpenSnack(true);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        process.env.REACT_APP_API_ADDRESS + "api/Auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            password,
            Branch: selectedBranch,
            locationName: locationName,
          }),
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        navigate("/index");
      } else {
        setError("Invalid username or password");
        setOpenSnack(true);
      }
    } catch (error) {
      setError("An error occurred");
      setOpenSnack(true);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const dialogContent = (
    <div>
      {loading && <Spinner />}
      <div className="MessageApp">
        <div className="TopMessage">
          <h1>Welcome</h1>
          <p>Let's start with your location</p>
          <span
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
            className="text-emerald-800"
          >
            Location:{displayedLocationName}
          </span>
        </div>

        <label style={{ display: "none" }}>
          Location
          <input
            placeholder="Enter your location"
            name="locationName"
            value={locationName}
            onChange={handleLocationChange}
          />
        </label>
        <Button
          style={{
            backgroundColor: "#ecfdf5",
            color: "#065f46",
            marginTop: "20px",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={getUserLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <FaSpinner className="spin" spin={true} />
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaMapMarkerAlt /> Get current location
            </span>
          )}
        </Button>
        {error && (
          <p
            style={{
              color: "#b91c1c",
              marginTop: "10px",
              marginBottom: "0",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
        <Stack
          sx={{ width: 400, padding: "10px", border: "none", outline: "none" }}
        >
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            options={data.map((option) => option.BranchName)}
            onChange={(event, value) => setSelectedBranch(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select shop" />
            )}
          />
        </Stack>
        <div className="Entries">
          <label>User name</label>
          <input
            placeholder="doe@mail.com"
            name="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="Entries">
          <label>Password</label>
          <div className="PasswordInput">
            <input
              placeholder="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="TogglePasswordVisibility"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </Button>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <h1 style={{color:'#1e3a8a',fontSize:'14px',fontWeight:'500'}}>Dont Have An Account, <a href="/public/sign_up" style={{color:'red'}}>Click Here</a> To Create One</h1>
            <h2 style={{color:'#1e3a8a',fontSize:'13px',fontWeight:'500'}}>Forgot password?</h2>
          </div>
        <div className="Entries" style={{ marginTop: "20px" }}>
          <button type="submit" onClick={handleFormSubmit}>
            Login
          </button>
        </div>
        <div>
          <Snackbar
            open={openSnack}
            autoHideDuration={5000}
            onClose={handleClose}
            message={error && <p>{error}</p>}
            action={action}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            ContentProps={{
              style: {
                backgroundColor: "#b91c1c",
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  const drawerContent = (
    <div>
      {loading && <Spinner />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          paddingTop: "2vh",
          paddingBottom: "1vh",
          borderRadius: "50px",
        }}
        role="presentation"
      >
        <Puller />
        <div className="MessageApp">
          <div className="TopMessage">
            <h1>Welcome</h1>
            <p>Let's start with your username</p>
            <span
              style={{ paddingTop: "10px", paddingBottom: "10px" }}
              className="text-emerald-800"
            >
              Location:{displayedLocationName}
            </span>
          </div>
          <Button
            style={{
              backgroundColor: "#ecfdf5",
              color: "#065f46",
              marginTop: "20px",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={getUserLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="spin" spin={true} />
            ) : (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaMapMarkerAlt /> Get current location
              </span>
            )}
          </Button>
          {error && (
            <p
              style={{
                color: "#b91c1c",
                marginTop: "10px",
                marginBottom: "0",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          <Stack
            sx={{
              width: 300,
              padding: "10px",
              border: "none",
              outline: "none",
            }}
          >
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={data.map((option) => option.BranchName)}
              onChange={(event, value) => setSelectedBranch(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select shop" />
              )}
            />
          </Stack>
          <div className="Entries">
            <label>User name</label>
            <input
              placeholder="doe@mail.com"
              name="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="Entries">
            <label>Password</label>
            <div className="PasswordInput">
              <input
                placeholder="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="TogglePasswordVisibility"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <h1 style={{color:'#1e3a8a',fontSize:'14px',fontWeight:'500'}}>Dont Have An Account, <a href="/public/sign_up" style={{color:'red'}}>Click Here</a> To Create One</h1>
            <h2 style={{color:'#1e3a8a',fontSize:'13px',fontWeight:'500'}}>Forgot password?</h2>
          </div>
          <div className="Entries" style={{ marginTop: "20px",marginBottom:'20px' }}>
            <button type="submit" onClick={handleFormSubmit}>
              Login
            </button>
          </div>
          <div>
            <Snackbar
              open={openSnack}
              autoHideDuration={5000}
              onClose={handleClose}
              message={error && <p>{error}</p>}
              action={action}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              ContentProps={{
                style: {
                  backgroundColor: "#b91c1c",
                },
              }}
            />
          </div>
        </div>
      </Box>
    </div>
  );

  return (
    <div className="bg-[#0c0c1d] z-50 flex items-center justify-center pt-2 pb-2 h-[100px] pl-0 pr-0 sm:pl-4 sm:pr-4">
      <div className="flex py-2 justify-center items-center container">
        <div className="mb-4 md:mb-0 ml-2">
          <img src={LOGO} alt="" className="logo" />
        </div>
        <div className="list-none flex justify-center sm:flex hidden items-center flex-grow">
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={`font-poppins font-normal cursor-pointer text-[16px] ${
                active === nav.title ? "text-[#ffd32f]" : "text-white"
              } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </div>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <div
            className="w-[28px] h-[28px] object-contain text-[#174993]"
            onClick={() => setToggle(!navToggle)}
          >
            {navToggle ? (
              <IoCloseSharp className="text-[#ffd32f]" />
            ) : (
              <FiAlignRight className="text-[#ffd32f]" />
            )}
          </div>

          <div
            className={`${
              !navToggle ? "hidden" : "flex"
            } p-6  bg-[#fff] absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl DukaNav z-[5000]`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col">
              {navLinks.map((nav, index) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer ${
                    active === nav.title
                      ? "text-[#174993] text-sm lg:text-[14px]"
                      : "text-black text-sm lg:text-[14px]"
                  } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                  onClick={() => setActive(nav.title)}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
              <div className="flex flex-col gap-2 lg:gap-5">
                <button
                  onClick={toggle}
                  className="text-sm lg:text-[14px] mt-3 p-2 bg-[#032e69] border-white rounded-md text-center text-white sm:block"
                >
                  Login
                </button>
                <button className="text-sm lg:text-[14px] mt-3 p-2 bg-[#032e69] border-white rounded-md text-center text-white sm:block">
                  <a href={"/public/sign_up"}>Sign up</a>
                </button>
                <button className="text-sm lg:text-[14px] mt-3 p-2 bg-[#032e69] border-white rounded-md text-center text-white sm:block">
                  Get Quote
                </button>
              </div>
            </ul>
          </div>
        </div>

        <div className="flex gap-5">
          <button
            onClick={toggle}
            className="bg-white text-[#174993] w-[74px] p-1 text-center rounded-md hidden sm:block"
          >
            Login
          </button>

          <button className="bg-[#ffd32f] hover:bg-[#ffd32f]-600 p-1 text-center rounded-md hidden sm:block">
            <a href={"/public/sign_up"}>Sign up</a>
          </button>

          <button className="bg-[#ffd32f] hover:bg-[#ffd32f]-600 p-1 text-center rounded-md hidden sm:block">
            Get Quote
          </button>
        </div>
      </div>

      <div>
        {matches ? (
          <Dialog open={open} onClose={toggle}>
            {dialogContent}
          </Dialog>
        ) : (
          <SwipeableDrawer anchor="bottom" open={open} onClose={toggle}>
            {drawerContent}
          </SwipeableDrawer>
        )}
      </div>
    </div>
  );
};

export default AnotherHeader;
