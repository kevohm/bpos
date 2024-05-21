import React, { useContext, useEffect, useState } from "react";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import "./Calender.css";
import "./CaStyles.css";
import "./calenderComp.scss";
import AlphaSideBarNav from "../../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../../AuthContext/AuthContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Spinner from "../../../components/CompanyRegistration/Spinner";


const CalendarPage = () => {
  const { user } = useContext(AuthContext);

  const business_id = user?.company_id || user?.id;

  const [open, setOpen] = useState(false);
  const [employee_name, setEmployeeName] = useState("");
  const [event_type, setEventType] = useState("");
  const [branch, setBranch] = useState("");
  const [date_time, setDateTime] = useState("");
  const [to_date_time, setToDate] = useState("");
  const [comments, setComments] = useState("");
  const [userName, setUserName] = useState("");
  const [mobile, setMobile] = useState("");
  const [user_id, setUserId] = useState("");
  const [branch_id, setBranchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [companyAttendants, setCompanyAttendants] = useState([]);
  const [Shops, setShops] = useState([]);

  const handleChange = (fieldName, value) => {
    switch (fieldName) {
      case "employee_name":
        setEmployeeName(value);
        const selectedUser = companyAttendants.find(
          (user) => user.fullname === value
        );
        if (selectedUser) {
          setUserId(selectedUser.id);
          setMobile(selectedUser.mobile);
          setUserName(selectedUser.userName);
        }
        break;
      case "event_type":
        setEventType(value);
        break;
      case "branch":
        setBranch(value);
        const selectedBranch = Shops.find((shop) => shop.name === value);
        if (selectedBranch) {
          setBranchId(selectedBranch.id);
        }
        break;
      case "date_time":
        setDateTime(value);
        break;
      case "to_date_time":
        setToDate(value);
        break;
      case "comments":
        setComments(value);
        break;
      case "userName":
        setUserName(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "branch_id":
        setBranchId(value);
        break;
      default:
        break;
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = {
        employee_name,
        event_type,
        branch,
        date_time,
        to_date_time,
        comments,
        business_id,
        branch_id,
        mobile,
        userName,
        user_id,
      };

      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS +
          "/api/company_registration/company_schedules",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("User schedule added successfully.", {
          autoClose: 5000,
        });
      } else {
        throw new Error("Failed to add schedule.");
      }
    } catch (error) {
      toast.error("Failed to add schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderCell = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const eventsForDate = schedules.filter((schedule) => {
      const startDate = new Date(schedule.date_time);
      startDate.setHours(startDate.getHours() - 3); 
      const endDate = new Date(schedule.to_date_time);
      endDate.setHours(endDate.getHours() - 3);

      return (
        formattedDate >=
          startDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }) &&
        formattedDate <=
          endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
      );
    });

    if (eventsForDate.length > 0) {
      const displayEvents = eventsForDate.slice(0, 2); 
      const moreCount = eventsForDate.length - displayEvents.length;

      const moreItem = (
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {eventsForDate.map((event, index) => (
                  <p key={index}>
                    <b>{event.employee_name}</b> - <b>{event.event_type}</b>
                  </p>
                ))}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );

      return (
        <ul className="calendar-todo-list">
          {displayEvents.map((event, index) => (
            <li key={index}>
              <Badge /> <b>{event.employee_name}</b> - <b>{event.event_type}</b>
            </li>
          ))}
          {moreCount ? moreItem : null}
        </ul>
      );
    }

    return null;
  };

  // company user
  const fetchData = async () => {
    try {
      const [usersResponse, branchesResponse, schedulesResponse] =
        await Promise.all([
          axios.get(
            process.env.REACT_APP_API_ADDRESS +
              `/api/user_operations/${business_id}`
          ),
          axios.get(
            process.env.REACT_APP_API_ADDRESS +
              `api/branch_operations/branches/${business_id}`
          ),
          axios.get(
            process.env.REACT_APP_API_ADDRESS +
              `api/product_operations/schedules/${business_id}`
          ),
        ]);

      setCompanyAttendants(usersResponse.data);
      setShops(branchesResponse.data);
      setSchedules(schedulesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [business_id]);

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="calenderComp">
            <div className="addschedule">
              <button onClick={handleOpen}>Add Event</button>
            </div>

            <div>
              <Calendar bordered renderCell={renderCell} />
            </div>

            <div>
              {loading && <Spinner />}
              <div>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Add Event</DialogTitle>
                  <DialogContent>
                    <TextField
                      select
                      margin="dense"
                      id="employee_name"
                      name="employee_name"
                      label="Employee name"
                      fullWidth
                      value={employee_name}
                      onChange={(event) =>
                        handleChange("employee_name", event.target.value)
                      }
                    >
                      {companyAttendants.map((user, index) => (
                        <MenuItem key={index} value={user.fullname}>
                          {user.fullname}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      margin="dense"
                      id="event_type"
                      label="Event Type"
                      name="event_type"
                      fullWidth
                      value={event_type}
                      onChange={(event) =>
                        handleChange("event_type", event.target.value)
                      }
                    >
                      <MenuItem value="duty">duty</MenuItem>
                      <MenuItem value="leave">leave</MenuItem>
                    </TextField>

                    <TextField
                      select
                      margin="dense"
                      id="branch"
                      name="branch"
                      label="To or from Shop / branch"
                      fullWidth
                      value={branch}
                      onChange={(event) =>
                        handleChange("branch", event.target.value)
                      }
                    >
                      {Shops.map((shop, index) => (
                        <MenuItem key={index} value={shop.name}>
                          {shop.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      margin="dense"
                      id="date_time"
                      name="date_time"
                      label="From date time"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={date_time}
                      onChange={(event) =>
                        handleChange("date_time", event.target.value)
                      }
                    />

                    <TextField
                      margin="dense"
                      id="to_date_time"
                      name="to_date_time"
                      label="To date time"
                      type="datetime-local"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={to_date_time}
                      onChange={(event) =>
                        handleChange("to_date_time", event.target.value)
                      }
                    />

                    <TextField
                      autoFocus
                      margin="dense"
                      id="comments"
                      name="comments"
                      label="Any comments?"
                      type="text"
                      fullWidth
                      value={comments}
                      onChange={(event) =>
                        handleChange("comments", event.target.value)
                      }
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      color="primary"
                    >
                      Add
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
