import React, { useEffect, useState } from "react";
import "./ClientLogin.scss";
import { useAuth } from "../../../../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import AlphaNavigation from "../../NavigationAlpha/AlphaNavigation";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

const ClientLogin = () => {
  const [open, setOpen] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        process.env.REACT_APP_API_ADDRESS + "api/Auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, password, Branch: selectedBranch }),
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        navigate("/index");
      } else {
        setError("Invalid username or password");
        setOpen(true);
      }
    } catch (error) {
      setError("An error occurred");
      setOpen(true);
      console.error("Login error:", error);
    }
  };

  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_ADDRESS + `api/auth/loginbranches`
    );
    setData(response.data);
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div style={{}}>
        <AlphaNavigation />
      </div>

      <div className="split-screen">
        <motion.div
          className="leftScreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.0 }}
        >
          <section className="copy">
            <h1>Welcome Back!</h1>
            <p>To stay connected, please sign in.</p>
          </section>
        </motion.div>
        <motion.div
          className="rightScreen"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", delay: 1.0, stiffness: "50" }}
        >
          <form>
            <section className="copy">
              <h2>Sign In</h2>
              <div className="login-container">
                <p>
                  No account yet?{" "}
                  <a href="/public/client-signup">
                    <strong>Get a quote</strong>
                  </a>
                </p>
              </div>
            </section>

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={data.map((item) => item.BranchName)}
              sx={{ width: 300 }}
              value={selectedBranch}
              onChange={(event, value) => setSelectedBranch(value)}
              renderInput={(params) => <TextField {...params} label="Outlet" />}
            />

            <div className="input-container">
              <div className="email">
                <label htmlFor="email">Email</label>
                <motion.input
                  type="email"
                  id="userName"
                  name="userName"
                  placeholder="example@gmail.com"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: "300" }}
                  whileHover={{
                    scale: 1.1,
                  }}
                />
              </div>
            </div>
            <div className="input-container">
              <div className="password">
                <label htmlFor="password">Password</label> 
                <motion.input
                  id="password"
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  value={password}
                  placeholder="Must be at least 6 characters"
                  onChange={(e) => setPassword(e.target.value)}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: "30" }}
                  whileHover={{
                    scale: 1.1,
                  }}
                />
                {/* <button type="button" onClick={togglePassword}>
                                  <FontAwesomeIcon icon={passwordShown ? faEye : faEyeSlash} className='IconShow'/>
                              </button> */}
              </div>
            </div>
            <div className="input-control">
              <div className="cta">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me.
                </label>
              </div>
            </div>

            <motion.button
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: "300" }}
              whileHover={{
                scale: 1.1,
              }}
              className="signup-btn"
              type="submit"
              onClick={handleFormSubmit}
            >
              Sign In
            </motion.button>
            <div>
              <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={error && <p>{error}</p>}
                action={action}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              />
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientLogin;
