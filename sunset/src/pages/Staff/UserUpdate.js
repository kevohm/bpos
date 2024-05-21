import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./UserUpdate.scss";
import { AuthContext } from "../../AuthContext/AuthContext";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button, Snackbar } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import countyData from "./AddUser/countyData.json";

const UserUpdate = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.id;
  const [selectedCounty, setSelectedCounty] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
  };
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Check if all fields are filled
    for (let key in formData) {
      if (!formData[key]) {
        errors[key] = "This field is required";
        isValid = false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userName)) {
      errors.userName = "Invalid email address";
      isValid = false;
    }

    if (formData.password !== formData.cpassword) {
      errors.cpassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [userDetails, setUserDetails] = useState({
    image: "",
    fullname: "",
    role: "",
    jobRole: "",
    mobile: "",
    userName: "",
    password: "",
    cpassword: "",
  });

  const [formData, setFormData] = useState({
    image: "",
    fullname: "",
    role: "",
    jobRole: "",
    mobile: "",
    userName: "",
    password: "",
    cpassword: "",
  });

  const history = useNavigate();
  const { id } = useParams();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const { fullname } = userDetails;
  const UpdateEvent = (e) => {
    if (!fullname) {
      toast.error("All values are required");
    } else {
      if (!id) {
        axios
          .post(
            process.env.REACT_APP_API_ADDRESS + "api/Auth/register",
            userDetails
          )
          .then(() => {
            setUserDetails({ Station: "" });
          })
          .catch((err) => toast.err(err.response.data));
        toast.success("Case Details added successfully");
      } else {
        axios
          .put(
            process.env.REACT_APP_API_ADDRESS + `api/Auth/updateUser/${id}`,
            userDetails
          )
          .then(() => {
            setUserDetails({
              fullname: "",
              userName: "",
              password: "",
              Branch: "",
            });
          })
          .catch((err) => toast.err(err.response.data));
        window.alert("User details updated successfully");
      }

      setTimeout(() => history("/myattendants"), 100);
    }
  };

  const [data, setData] = useState([]);
  const loadData = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_ADDRESS + `api/analytics/branches/${company_id}`
    );
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Auth/staffmembers/${id}`
        );
        setUserDetails(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="AddUserPage">
            <p> Update user details </p>

            <div className="UserForm">
              <div className="imagePoint">
                <img
                  src={
                    formData.image ? URL.createObjectURL(formData.image) : ""
                  }
                  alt="profile"
                />
              </div>
              <div className="EntryPoints">
                <div className="EntriesA">
                  <div className="Entry">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer w-300 inline-block bg-teal-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-teal-700"
                    >
                      <CloudUpload className="inline-block mr-2" />
                      <span style={{ color: "white" }}>Upload Image</span>
                    </label>

                    <input
                      id="file-upload"
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      style={{ display: "none" }}
                    />
                    {errors.image && (
                      <div className="error">{errors.image}</div>
                    )}
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
                        value={formData.fullname}
                        onChange={handleInputChange}
                      />
                    </label>
                    {errors.fullname && (
                      <div className="error">{errors.fullname}</div>
                    )}
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
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value={""}>Select...</option>
                        <option value={"Super Admin"}>
                          Super administrator
                        </option>
                        <option value={"Admin"}>Administrator</option>
                        <option value={"NormalUser"}>Normal user</option>
                      </select>
                    </label>
                    {errors.role && <div className="error">{errors.role}</div>}
                  </div>
                  <div className="Entry">
                    <label>
                      <span>Job role / task</span>
                      <select
                        placeholder="Select..."
                        id="JobRole"
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleInputChange}
                      >
                        <option value={""}>Select...</option>
                        <option value={"Accountant"}>Accountant</option>
                        <option value={"Manager"}>Manager</option>
                        <option value={"Human resource"}>Human resource</option>
                        <option value={"Stock manager"}>Stock manager</option>
                        <option value={"Branch supervisor"}>
                          Branch supervisor
                        </option>
                        <option value={"Branch attendant"}>
                          Branch attendant
                        </option>
                      </select>
                    </label>
                    {errors.jobRole && (
                      <div className="error">{errors.jobRole}</div>
                    )}
                  </div>
                </div>
                <div className="EntriesA">
                  <div className="Entry">
                    <label>
                      <span>Mobile number</span>
                      <input
                        id="Mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </label>
                    {errors.mobile && (
                      <div className="error">{errors.mobile}</div>
                    )}
                  </div>
                  <div className="Entry">
                    <label>
                      <span>Email</span>
                      <input
                        type="email"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                      />
                    </label>
                    {errors.userName && (
                      <div className="error">{errors.userName}</div>
                    )}
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
                        onChange={handleCountyChange}
                        value={selectedCounty}
                      >
                        <option value={""}>Select...</option>
                        {countyData.counties.map((county, index) => (
                          <option key={index} value={county.name}>
                            {county.name}
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
                      >
                        <option value={""}>Select...</option>
                        {selectedCounty &&
                          countyData.counties
                            .find((county) => county.name === selectedCounty)
                            .subcounties.map((subcounty, index) => (
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
                      value={formData.password}
                      onChange={handleInputChange}
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
                      value={formData.cpassword}
                      onChange={handleInputChange}
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
                    <button onClick={UpdateEvent}>Update Details</button>
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

export default UserUpdate;
