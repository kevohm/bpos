import React, { useContext, useState } from "react";
import "./ProfileSettings.scss";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../AuthContext/AuthContext";
import { CloudUpload } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ProfileSettings = () => {
  const { user } = useContext(AuthContext);
  const business_id = user?.id;
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [operations_description, setOperations] = useState("");
  const [payment_method, setPaymentMethods] = useState("");
  const [paybill_number, setPaybill] = useState(""); 
  const [account_number, setAccount] = useState("");
  const [till_number, setTillNumber] = useState("");

  const [Branch, setBranch] = useState("");
  const [branch_id, setBranchId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (fieldName, value) => {
    switch (fieldName) {
      case "name":
        setName(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "operations_description":
        setOperations(value);
        break;
      case "payment_method":
        setPaymentMethods(value);
        break;
      case "paybill_number":
        setPaybill(value);
        break;
      case "account_number":
        setAccount(value);
        break;
      case "till_number":
        setTillNumber(value);
        break;
      case "Branch":
        setBranch(value);
        break;
      case "branch_id":
        setBranchId(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
   
      const formData = {
        name,
        location,
        operations_description,
        business_id,
        payment_method,
        paybill_number,
        account_number,
        till_number,
      };
      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + "/api/company_registration/new_branch",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(
          "Branch added successfully. Proceed to register its operator",
          {
            autoClose: 5000,
          }
        );
      } else {
        throw new Error("Failed to register the branch.");
      }
    } catch (error) {
      console.error("Error registering branch:", error);
      toast.error("Failed to register your branch. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="ProfileSettings">
            <div className="AccountSettings">
              <h2>Account details</h2>
              <div className="account">
                <div className="AccountImage">
                  <img src="" alt="profile" />
                </div>
                <div className="AccountForm">
                  <div className="AccounttEntries">
                    <div className="imageUpload">
                      <label
                        htmlFor="accountlogo"
                        className="relative cursor-pointer w-300 inline-block bg-teal-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-teal-700"
                      >
                        <CloudUpload className="inline-block mr-2" />
                        <span style={{ color: "white" }}>
                          Upload Company Logo
                        </span>
                      </label>
                      <input
                        type="file"
                        name="accountlogo"
                        id="accountlogo"
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  <div className="AccounttEntries">
                    <div className="AccountEntry">
                      <label>Company name</label>
                      <input type="text" name="BusinessName" />
                    </div>
                    <div className="AccountEntry">
                      <label>Account Email</label>
                      <input type="text" name="userName" />
                    </div>
                  </div>

                  <div className="AccounttEntries">
                    <div className="AccountEntry">
                      <label>Number of Shops</label>
                      <input type="text" name="shops_count" />
                    </div>
                    <div className="AccountEntry">
                      <label>Number of employees</label>
                      <input type="text" name="employees_count" />
                    </div>
                  </div>

                  <div className="AccounttEntries">
                    <div className="AccountEntry">
                      <label>Billable mobile</label>
                      <input type="text" name="billable_mobile" />
                    </div>
                    <div className="AccountEntry">
                      <label>Contact mobile</label>
                      <input type="text" name="mobile" />
                    </div>
                  </div>

                  <div className="AccounttEntries">
                    <div className="AccountEntry">
                      <label>Account Password</label>
                      <input type="text" name="password" />
                    </div>
                    <div className="AccountEntry">
                      <label>Confirm Account Password</label>
                      <input type="text" name="cpassword" />
                    </div>
                  </div>

                  <div className="AccounttEntries">
                    <div className="Buttons">
                      <button>Submit details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="BranchSettings">
              <h2>Branch / outlet Details</h2>
              <div className="BranchEntries">
                <div className="BranchEntry">
                  <div className="SingleEntry">
                    <label>Branch / outlet name</label>
                    <input
                      name="name"
                      id="name"
                      value={name}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                    />
                  </div>
                  <div className="SingleEntry">
                    <label>Location description</label>
                    <input
                      name="location"
                      id="location"
                      value={location}
                      onChange={(event) =>
                        handleChange("location", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="BranchEntry">
                  <div className="SingleEntry">
                    <label>Branch Operations</label>
                    <textarea
                      rows={4}
                      placeholder="Description"
                      name="operations_description"
                      value={operations_description}
                      onChange={(event) =>
                        handleChange(
                          "operations_description",
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <h3>Payment methods</h3>
                <p>
                  As of now, we offer two methods of payments that is mpesa and
                  cash payments
                </p>
                <div className="Paymentmethod">
                  <label>Payment methods</label>
                  <select
                    name="payment_method"
                    value={payment_method}
                    onChange={(event) =>
                      handleChange("payment_method", event.target.value)
                    }
                  >
                    <option value={""}>Select...</option>
                    <option value={"Cash"}>Cash payments</option>
                    <option value={"Mpesa"}>Mpesa payments</option>
                    <option value={"Both"}>Both methods</option>
                  </select>
                </div>

                <div className="MethodA">
                  <label>Selected Method</label>
                  <input value={payment_method} />
                </div>

                {(payment_method === "Mpesa" || payment_method === "Both") && (
                  <div className="MethodB">
                    <div className="MpesaDetails">
                      <div className="DetailA">
                        <label>Mpesa paybill</label>
                        <input
                          type="number"
                          name="paybill_number"
                          value={paybill_number}
                          onChange={(event) =>
                            handleChange("paybill_number", event.target.value)
                          }
                        />
                      </div>
                      <div className="DetailA">
                        <label>Mpesa Account Number</label>
                        <input
                          name="account_number"
                          value={account_number}
                          onChange={(event) =>
                            handleChange("account_number", event.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="MpesaDetails">
                      <div className="DetailA">
                        <label>Mpesa Till Number</label>
                        <input
                          type="number"
                          name=""
                          value={till_number}
                          onChange={(event) =>
                            handleChange("till_number", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="SubmitButton">
                  <button onClick={handleSubmit}>Submit details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
