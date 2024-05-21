import React, { useState } from "react";
import "./Bars.scss";

const Bars = () => {
  const [businessName, setBusinessName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [yourMobile, setYourMobile] = useState("");
  const [yourLocation, setYourLocation] = useState("");
  const [numberBranches, setNumberBranches] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (businessName.trim() === "") {
      newErrors.businessName = "Business name is required";
    }
 
    if (userName.trim() === "") {
      newErrors.userName = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userName)) {
      newErrors.userName = "Email is invalid";
    }

    if (password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (yourMobile.trim() === "") {
      newErrors.yourMobile = "Mobile number is required";
    } else if (!/^\d+$/.test(yourMobile)) {
      newErrors.yourMobile = "Mobile number should contain only digits";
    }

    if (yourLocation.trim() === "") {
      newErrors.yourLocation = "Location is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (validateForm()) {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_ADDRESS + "api/Auth/addBusiness",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              businessName,
              userName,
              password,
              yourMobile,
              yourLocation,
              numberBranches,
            }),
          }
        );

        if (response.ok) {
      
          setBusinessName("");
          setUserName("");
          setPassword("");
          setYourMobile("");
          setYourLocation("");
          setNumberBranches("");
          setErrors({});
        } else {
         
          console.error("Form submission failed.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }
  };

  return (
    <div className="Registration">
      <div className="gradient-box">
        <div className="Form">
          <div className="businessName">
            <span>LiquorLogic</span> 
          </div>
          <div className="Entry">
            <label htmlFor="businessName">
              Business Name <span>*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{ border: errors.businessName ? "2px solid red" : "" }}
            />
            {errors.businessName && (
              <span style={{ color: "red" }}>{errors.businessName}</span>
            )}
          </div>

          <div className="Entry">
            <label htmlFor="userName">
              Your Email <span>*</span>
            </label>
            <input
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ border: errors.userName ? "2px solid red" : "" }}
            />
            {errors.userName && (
              <span style={{ color: "red" }}>{errors.userName}</span>
            )}
          </div>

          <div className="Entry">
            <label htmlFor="yourMobile">
              Your Mobile <span>*</span>
            </label>
            <input
              id="yourMobile"
              name="yourMobile"
              value={yourMobile}
              onChange={(e) => setYourMobile(e.target.value)}
              style={{ border: errors.yourMobile ? "2px solid red" : "" }}
            />
            {errors.yourMobile && (
              <span style={{ color: "red" }}>{errors.yourMobile}</span>
            )}
          </div>

          <div className="Entry">
            <label htmlFor="yourLocation">
              Your Location <span>*</span>
            </label>
            <input
              id="yourLocation"
              name="yourLocation"
              onChange={(e) => setYourLocation(e.target.value)}
              style={{ border: errors.yourLocation ? "2px solid red" : "" }}
            />
            {errors.yourLocation && (
              <span style={{ color: "red" }}>{errors.yourLocation}</span>
            )}
          </div>

          <div className="Entry">
            <label htmlFor="numberBranches"> Number of Branches if any </label>
            <input
              id="numberBranches"
              name="numberBranches"
              value={numberBranches}
              onChange={(e) => setNumberBranches(e.target.value)}
            />
          </div>

          <div className="Entry">
            <label htmlFor="password">
              {" "}
              Password <span>*</span>
            </label>
            <input
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: errors.password ? "2px solid red" : "" }}
            />
            {errors.password && (
              <span style={{ color: "red" }}>{errors.password}</span>
            )}
          </div>

          <div className="SubmitButton">
            <button type="submit" onClick={handleSubmit}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bars;
