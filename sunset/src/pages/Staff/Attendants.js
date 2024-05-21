import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Attendants.scss";
import "./Register.scss";
import "./MyAttendants.scss";
import { AuthContext } from "../../AuthContext/AuthContext";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import moment from "moment";
import { FaEdit, FaPlus } from "react-icons/fa";
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Attendants = () => {
  const { user } = useContext(AuthContext);
  const business_id = user?.company_id || user?.id;
  const [companyAttendants, setCompanyAttendants] = useState([]);

  // structuring the attendants file name
  const firstWordOfBusinessName = user?.businessName ? user.businessName.split(" ")[0] : "";
  const currentDate = moment().format("DD_MM_YYYY");
  const fileName = `${firstWordOfBusinessName}_attendants_${currentDate}.pdf`;
  const currentAdmin = user?.fullname ? user.fullname.split(" ")[0] + (user.fullname.split(" ")[1] ? " " + user.fullname.split(" ")[1] : "") : "";

  const loadData = async () => {
    const response = await axios.get(
      process.env.REACT_APP_API_ADDRESS + `/api/user_operations/${business_id}`
    );
    setCompanyAttendants(response.data);
  };
  useEffect(() => {
    loadData();
  }, [business_id]); 

  const generatePDF = () => {
    const currentDate = moment().format("YYYY-MM-DD");
    const inSessionUsers = companyAttendants.filter(
      (val) =>
        val.role !== "Admin" &&
        moment(val.shift_start_time).isSame(moment(), "day") &&
        moment(val.shift_start_time).isAfter(val.shift_end_time)
    );
    const inSessionCount = inSessionUsers.length;
    return (
      <Document>
        <Page style={styles.page}>
          <View style={styles.table}>
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Text
                style={{
                  paddingLeft: 10,
                  marginRight: 10,
                  fontSize: 14,
                  color: "#172554",
                }}
              >
                DukaTrack Time In as at {moment().format("DD-MM-YYYY HH:mm:ss")}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.headerText}>Full Name</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.headerText}>Branch</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.headerText}>Time In</Text>
              </View>
              <View style={[styles.tableCell, styles.headerCell]}>
                <Text style={styles.headerText}>Location</Text>
              </View>
            </View>
            {inSessionUsers.map((val) => (
              <View key={val.id} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.rowtext}>
                    {val.fullname}
                    <Text
                      style={{
                        color:
                          val.shift_start_time > val.shift_end_time
                            ? "green"
                            : "red",
                        fontSize: 10,
                      }}
                    >
                      :{" "}
                      {val.shift_start_time > val.shift_end_time
                        ? "Shift on"
                        : "Shift ended"}
                    </Text>
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.rowtext}>
                    {val.Branch || "Not Assigned"}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.rowtext}>
                    {moment(val.shift_start_time)
                      .subtract(3, "hours")
                      .format("DD-MM-YYYY h:mm:ss a")}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.rowtext}>
                    {val.UserLocationName &&
                      val.UserLocationName.split(",").slice(0, 3).join(",")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text
              style={{ color: "#172554", fontWeight: "bold", fontSize: "14px" }}
            >
              Number of shops in session: {inSessionCount}
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "#172554",
                fontWeight: "normal",
                fontSize: "12px", 
                textAlign: "center",
              }}
            >
              Generated by @ {firstWordOfBusinessName || currentAdmin}
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}

          <div className="MyAttendants">
            <div className="TabContent">
              <div className="ActionButtons">
                <PDFDownloadLink
                  document={generatePDF()}
                  fileName={fileName}
                  className="Download"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Loading shifts..." : "Download shifts"
                  }
                </PDFDownloadLink>

                <button>
                  <Link to={"/add_user"} className="Link">
                    <FaPlus /> Create New
                  </Link>
                </button>
              </div>

              <DataGrid
                style={{ padding: "20px" }}
                rows={companyAttendants.map((user, index) => ({
                  ...user,
                  indexId: index + 1,
                }))}
                columns={[
                  // { field: "indexId", headerName: "ID", width: 70 },
                  {
                    field: "imageUrl",
                    headerName: "Image",
                    width: 100,
                    renderCell: (params) => (
                      <img
                        src={params.row.imageUrl}
                        alt={params.row.fullname}
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          padding: "5px 5px",
                          background: "transparent",
                        }}
                      />
                    ),
                  },
                  { field: "fullname", headerName: "Name", width: 150 },
                  {
                    field: "role",
                    headerName: "Role",
                    width: 130,
                    renderCell: (params) => (
                      <span
                        style={{
                          color:
                            params.row.role === "Admin" ? "#059669" : "#1e40af",
                        }}
                      >
                        {params.row.role === "Admin"
                          ? "Administrator"
                          : "Member"}
                      </span>
                    ),
                  },
                  {
                    field: "Branch",
                    headerName: "Current Shop",
                    width: 130,
                    renderCell: (params) => (
                      <span
                        style={{
                          color:
                            params.row.Branch === "null" ? "red" : "inherit",
                        }}
                      >
                        {params.row.Branch === "null"
                          ? "None"
                          : params.row.Branch}
                      </span>
                    ),
                  },

                  {
                    field: "shift_start_time",
                    headerName: "Time In",
                    width: 200,
                    renderCell: (params) => (
                      <span>
                        {moment(params.row.shift_start_time)
                          .subtract(3, "hours")
                          .format("DD-MM-YYYY h:mm:ss a")}
                      </span>
                    ),
                  },
                  {
                    field: "shift_end_time",
                    headerName: "Time out",
                    width: 200,
                    renderCell: (params) => (
                      <span>
                        {moment(params.row.shift_end_time)
                          .subtract(3, "hours")
                          .format("DD-MM-YYYY h:mm:ss a")}
                      </span>
                    ),
                  },

                  {
                    field: "status",
                    headerName: "Status",
                    width: 100,
                    renderCell: (params) => (
                      <span
                        style={{
                          backgroundColor:
                            params.row.status === "Active"
                              ? "#059669"
                              : "#ef4444",
                          color: "white",
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        {params.row.status}
                      </span>
                    ),
                  },

                  {
                    field: "created_at",
                    headerName: "Date added",
                    width: 200,
                    renderCell: (params) => (
                      <span>
                        {moment(params.row.created_at)
                          .format("DD-MM-YYYY h:mm:ss a")}
                      </span>
                    ),
                  },

                  {
                    field: "actions",
                    headerName: "Action",
                    width: 100,
                    renderCell: (params) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        {/* Edit button */}
                        <Link to={`/user_update/${params.row.id}`}>
                          <button 
                            style={{
                              color: "green",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <FaEdit
                              style={{
                                cursor: "pointer",
                                marginLeft: "4px",
                              }}
                            />
                          </button>
                        </Link>
                      </div>
                    ),
                  },
                ]}
                pageSize={10}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableDensitySelector
                disableColumnSelector
              />
            </div>

       
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  table: {
    display: "table",
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    display: "table-row",
    borderBottomColor: "#cbd5e1",
    borderBottomWidth: 0.3,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    display: "table-cell",
  },
  headerCell: {
    backgroundColor: "#172554",
    color: "white",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: "13px",
    color: "white",
  },
  rowtext: {
    fontWeight: "normal",
    fontSize: "10px",
  },
});

export default Attendants;
