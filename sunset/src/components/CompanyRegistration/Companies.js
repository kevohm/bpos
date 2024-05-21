import React, { useRef, useState } from "react";
import "./Companies.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Spinner from "./Spinner";

const Companies = () => {
  
  const imagePreviewRef = useRef(null);
  const [file, setFile] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [userName, setUserName] = useState("");
  const [mobile_contact, setMobileContact] = useState("");
  const [address, setAddress] = useState("");
  const [business_type, setBusinessType] = useState("");
  const [service_type, setServiceType] = useState("");
  const [pricing_type, setPricingType] = useState("");
  const [shops_count, setShopsCount] = useState("");
  const [employees_count, setEmployeesCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

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

  const handleChange = (fieldName, value) => {
    switch (fieldName) {
      case "businessName":
        setBusinessName(value);
        break;
      case "userName":
        setUserName(value);
        break;
      case "mobile_contact":
        setMobileContact(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "business_type":
        setBusinessType(value);
        break;
      case "service_type":
        setServiceType(value);
        break;
      case "pricing_type":
        setPricingType(value);
        break;
      case "shops_count":
        setShopsCount(value);
        break;
      case "employees_count":
        setEmployeesCount(value);
        break;
        case "password":
          setPassword(value);
          break;
      default:
        break;
    }
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("businessName", businessName);
      formData.append("userName", userName);
      formData.append("mobile_contact", mobile_contact);
      formData.append("address", address);
      formData.append("business_type", business_type);
      formData.append("service_type", service_type);
      formData.append("pricing_type", pricing_type);
      formData.append("shops_count", shops_count);
      formData.append("employees_count", employees_count);
      formData.append("password", password);
      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + "/api/company_registration",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status === 200) {
        toast.success(
          "Your account has been added successfully. Proceeding to login",
          {
            autoClose: 5000,
          }
        );
      } else {
        throw new Error("Failed to register company.");
      }
    } catch (error) {
      console.error("Error registering company:", error);
      toast.error("Failed to register your company. Please try again.");
    }
    finally {
      setLoading(false); 
    }
  };

  return (
    <div className="Companies">
     {loading && <Spinner />} 
      <div className="Form">
        <div className="Entries">
          <div className="CompanyLogo">
            <img
              src=""
              ref={imagePreviewRef}
              alt=""
              className={file ? "selectedImage" : ""}
            />
          </div>
          <div className="SideA">
            <div className="Entry">
              <label htmlFor="file">Company Logo</label>
              <input
                name="file"
                id="file"
                type="file"
                className="FileInput"
                accept="image/*"
                onChange={(event) =>
                  handleFileChange(event, setFile, imagePreviewRef)
                }
              />
            </div>
            <div className="Entry">
              <label>Company name</label>
              <input
                name="businessName"
                id="businessName"
                value={businessName}
                onChange={(event) =>
                  handleChange("businessName", event.target.value)
                }
              />
            </div>
            <div className="Entry">
              <label>User name</label>
              <input
                name="userName"
                id="userName"
                value={userName}
                onChange={(event) =>
                  handleChange("userName", event.target.value)
                }
              />
            </div>
            <div className="Entry">
              <label>Mobile contact</label>
              <input
                name="mobile_contact"
                id="mobile_contact"
                value={mobile_contact}
                onChange={(event) =>
                  handleChange("mobile_contact", event.target.value)
                }
              />
            </div>
            <div className="Entry">
              <label>Company address</label>
              <input
                name="address"
                id="address"
                value={address}
                onChange={(event) =>
                  handleChange("address", event.target.value)
                }
              />
            </div>
          </div>
          <div className="SideB">
            <div className="Entry">
              <label>Business type</label>
              <input
                name="business_type"
                id="business_type"
                placeholder="liquor, restaurant etc..."
                value={business_type}
                onChange={(event) =>
                  handleChange("business_type", event.target.value)
                }
              />
            </div>
            <div className="Entry">
              <label>Service type</label>
              <select
                name="service_type"
                id="service_type"
                value={service_type}
                onChange={(event) =>
                  handleChange("service_type", event.target.value)
                }
              >
                <option>Select..</option>
                <option value="product">Product selling</option>
                <option value="service">Service offering</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="Entry">
              <label>Pricing type</label>
              <select
                name="pricing_type"
                id="pricing_type"
                value={pricing_type}
                onChange={(event) =>
                  handleChange("pricing_type", event.target.value)
                }
              >
                <option>Select..</option>
                <option value="basic">Basic (500 per user)</option>
                <option value="standard">Standard (1000 per user)</option>
                <option value="premium">Premium (1500 per user)</option>
              </select>
            </div>
            <div className="Entry">
              <label>Number of shops / branches</label>
              <input
                name="shops_count"
                id="shops_count"
                type="number"
                value={shops_count}
                onChange={(event) =>
                  handleChange("shops_count", event.target.value)
                }
              /> 
            </div>
            <div className="Entry">
              <label>Number of employees</label>
              <input
                name="employees_count"
                id="employees_count"
                type="number"
                value={employees_count}
                onChange={(event) =>
                  handleChange("employees_count", event.target.value)
                }
              />
            </div>
            <div className="Entry">
              <label>Password</label>
              <input
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  handleChange("password", event.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="Button">
          <button onClick={handleSubmit}>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default Companies;
