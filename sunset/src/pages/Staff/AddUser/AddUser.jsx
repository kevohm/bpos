import React, { useContext, useEffect, useRef, useState } from "react";
import "./AddUserPage.scss";
import { Button } from "@mui/material";
import { AuthContext } from "../../../AuthContext/AuthContext";
import AlphaSideBarNav from "../../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import countyData from "./countyData.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CloudUpload } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Spinner from "../../../components/CompanyRegistration/Spinner";

const AddUser = () => {
  const { user } = useContext(AuthContext);

  const business_id = user?.company_id || user?.id;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const imagePreviewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [fullname, setFullName] = useState("");
  const [Branch, setBranch] = useState("");
  const [branch_id, setBranchId] = useState("");
  const [role, setRole] = useState("");
  const [job_role, setJobRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [userName, setUserName] = useState("");
  const [county, setCounty] = useState("");
  const [sub_county, setSubCounty] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState(""); 
  const [errors, setErrors] = useState({});
  const [Shops, setShops] = useState([]);

  const handleFileChange = (event, setterFunction, imagePreviewRef) => {
    const { files } = event.target;
    if (files.length > 0) {
      const file = files[0];
      setterFunction(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewRef.current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      setterFunction(null);
      imagePreviewRef.current.src = "";
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (fieldName, value) => {
    switch (fieldName) {
      case "fullname":
        setFullName(value);
        break;
      case "Branch":
        setBranch(value);
        const selectedBranch = Shops.find((shop) => shop.name === value);
        if (selectedBranch) {
          setBranchId(selectedBranch.id);
        }
        break;
      case "role":
        setRole(value);
        break;
      case "job_role":
        setJobRole(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "userName":
        setUserName(value);
        break;
      case "county":
        setCounty(value);
        break;
      case "sub_county":
        setSubCounty(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "cpassword":
        setCPassword(value);
        break;
      default:
        break;
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!isValidEmail(userName)) {
        throw new Error("Invalid email address");
      }
      if (password !== cpassword) {
        throw new Error("Passwords do not match");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fullname", fullname);
      formData.append("Branch", Branch);
      formData.append("business_id", business_id);
      formData.append("branch_id", branch_id);
      formData.append("role", role);
      formData.append("job_role", job_role);
      formData.append("mobile", mobile);
      formData.append("userName", userName);
      formData.append("county", county);
      formData.append("sub_county", sub_county);
      formData.append("password", password);
      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS +
          "/api/company_registration/user_registration",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("User added successfully.", {
          autoClose: 5000,
        });
      } else {
        throw new Error("Failed to register user.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/branch_operations/branches/${business_id}`
      )
      .then((response) => {
        setShops(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product groups:", error);
      });
  }, [business_id]);

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}

          <div>
            {loading && <Spinner />}
            <div className="AddUserPage">
              <p> Add New user </p>

              <div className="UserForm">
                <div className="imagePoint">
                  <img src="" ref={imagePreviewRef} alt="" />
                </div>
                <div className="EntryPoints">
                  <div className="EntriesA">
                    <div className="Entry">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer w-300 inline-block bg-teal-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-teal-700"
                      >
                        <CloudUpload className="inline-block mr-2" />
                        <span style={{ color: "white" }}>Upload Image</span>
                      </label>

                      <input
                        name="file"
                        id="file"
                        type="file"
                        className="FileInput"
                        accept="image/*"
                        onChange={(event) =>
                          handleFileChange(event, setFile, imagePreviewRef)
                        }
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="EntriesA">
                    <div className="Entry">
                      <label>
                        <span>Full name </span>
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          value={fullname}
                          onChange={(event) =>
                            handleChange("fullname", event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <div className="Entry">
                      <label>
                        <span>Branch / shop </span>
                        <select
                          name="Branch"
                          value={Branch}
                          onChange={(event) =>
                            handleChange("Branch", event.target.value)
                          }
                        >
                          <option value={""}>Select..</option>
                          {Shops.map((shop, index) => (
                            <option key={index} value={shop.name}>
                              {shop.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <input
                        type="text"
                        id="branch_id"
                        name="branch_id"
                        value={branch_id}
                        readOnly
                        style={{
                          border: "1px solid black",
                          outline: "none",
                          color: "black",
                        }}
                      />
                    </div>
                  </div>
                  <div className="EntriesA">
                    <div className="Entry">
                      <label>
                        <span>Role </span>
                        <select
                          placeholder="select.."
                          id="role"
                          name="role"
                          value={role}
                          onChange={(event) =>
                            handleChange("role", event.target.value)
                          }
                        >
                          <option value={""}>Select...</option>
                          <option value={"Super Admin"}>
                            Super administrator
                          </option>
                          <option value={"Admin"}>Administrator</option>
                          <option value={"NormalUser"}>Normal user</option>
                        </select>
                      </label>
                    </div>
                    <div className="Entry">
                      <label>
                        <span>Job role / task</span>
                        <select
                          placeholder="Select..."
                          id="job_role"
                          name="job_role"
                          value={job_role}
                          onChange={(event) =>
                            handleChange("job_role", event.target.value)
                          }
                        >
                          <option value={""}>Select...</option>
                          <option value={"Accountant"}>Accountant</option>
                          <option value={"Manager"}>Manager</option>
                          <option value={"Human resource"}>
                            Human resource
                          </option>
                          <option value={"Stock manager"}>Stock manager</option>
                          <option value={"Branch supervisor"}>
                            Branch supervisor
                          </option>
                          <option value={"Branch attendant"}>
                            Branch attendant
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="EntriesA">
                    <div className="Entry">
                      <label>
                        <span>Mobile number</span>
                        <input
                          id="Mobile"
                          name="mobile"
                          value={mobile}
                          onChange={(event) =>
                            handleChange("mobile", event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <div className="Entry">
                      <label>
                        <span>Email</span>
                        <input
                          type="email"
                          id="userName"
                          name="userName"
                          value={userName}
                          onChange={(event) =>
                            handleChange("userName", event.target.value)
                          }
                        />
                        {userName && !isValidEmail(userName) && (
                          <span style={{ color: "red" }}>
                            Invalid email address
                          </span>
                        )}
                      </label>
                    </div>
                  </div>

                  <h2>Address</h2>
                  <div className="EntriesA">
                    <div className="Entry">
                      <label>
                        <span>County</span>
                        <select
                          placeholder="County"
                          id="County"
                          name="County"
                          value={county}
                          onChange={(event) =>
                            handleChange("county", event.target.value)
                          }
                        >
                          <option value={""}>Select...</option>
                          {countyData.counties.map((countyObj, index) => (
                            <option key={index} value={countyObj.name}>
                              {countyObj.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="Entry">
                      <label>
                        <span>Sub County</span>
                        <select
                          placeholder="Sub county"
                          id="SubCounty"
                          name="SubCounty"
                          value={sub_county}
                          onChange={(event) =>
                            handleChange("sub_county", event.target.value)
                          }
                        >
                          <option value={""}>Select...</option>
                          {county &&
                            countyData.counties
                              .find((countyObj) => countyObj.name === county)
                              ?.subcounties.map((subcounty, index) => (
                                <option key={index} value={subcounty}>
                                  {subcounty}
                                </option>
                              ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="EntriesA">
                    <div className="PasswordInput">
                      <input
                        placeholder="password"
                        id="password"
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                          handleChange("password", event.target.value)
                        }
                      />
                      <Button
                        className="TogglePasswordVisibility"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                    </div>
                    <div className="PasswordInput">
                      <input
                        placeholder="confirm password"
                        id="cpassword"
                        name="cpassword"
                        type={passwordVisible ? "text" : "password"}
                        value={cpassword}
                        onChange={(event) =>
                          handleChange("cpassword", event.target.value)
                        }
                      />
                      <Button
                        className="TogglePasswordVisibility"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                      </Button>
                    </div>
                  </div>
                  <div className="EntriesA">
                    <div className="Buttons">
                      <button onClick={handleSubmit}>Send</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
