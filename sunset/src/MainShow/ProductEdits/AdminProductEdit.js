import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AdminProductEdit.scss";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../AuthContext/AuthContext";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Slide from "@mui/material/Slide";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./ProductEditDialog.scss";
import moment from "moment";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
} from "recharts";
import SalesPersonsNavigation from "../NavigationShow/SalesPersonsNavigation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SummaryAreaChart = ({ productEvents }) => {
  const preprocessData = (data) => {
    return data.map((item) => ({
      ...item,
      day_month: new Date(item.event_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
    }));
  };

  const processedData = preprocessData(productEvents);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={processedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day_month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="sold_stock_value"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="added_stock_value"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const AdminProductEdit = ({ searchQuery }) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [productEvents, setProductsEvents] = useState([]);
  const [productOrders, setProductsOrders] = useState([]);
  const Branch = user?.Branch;
  const company_id = user?.company_id || user?.id;
  const history = useNavigate();
  const [open, setOpen] = React.useState(false);
  const isNarrowScreen = useMediaQuery("(max-width: 768px)"); // True for screens up to 768px
  const isWideScreen = useMediaQuery("(min-width: 769px)"); // True for screens larger than 768px

  const paddingValue = isNarrowScreen ? "0px" : isWideScreen ? "30px" : "16px";

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [productEditOptions, setProductEditOptions] = useState("");

  const [productsInfo, setProductsInfo] = useState({
    name: "",
    category: "",
    BuyingPrice: "",
    DiscountedAmount: "",
    price: "",
    saleCategory: "",
    saleType: "",
    AddedQuantity: 0,
    OpeningStock: "",
    Branch: "",
    Supplier: "",
    amountMl: "",
  });

  const [stockTake, setStockTake] = useState({
    OpeningStock: "",
  });

  const editedBy = user?.fullname || "Admin";
  const company_name = "Admin";
  const product_id = id;

  const { price } = productsInfo;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProductsInfo({ ...productsInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    const updatedProductInfo = {
      ...productsInfo,
      editedBy: editedBy,
      company_name: company_name,
      product_id: product_id,
    };

    if (!price) {
      alert("All values are required");
    } else {
      if (!id) {
        axios
          .post(
            process.env.REACT_APP_API_ADDRESS + "api/Products/addProduct",
            productsInfo
          )
          .then(() => {
            setProductsInfo({});
          })
          .catch((err) => alert(err.response.data));
        alert("Added successfully");
      } else {
        axios
          .put(
            process.env.REACT_APP_API_ADDRESS +
              `api/Products/productedit/${id}`,
            updatedProductInfo
          )
          .then(() => {
            setProductsInfo({
              name: "",
              category: "",
              BuyingPrice: "",
              DiscountedAmount: "",
              price: "",
              saleCategory: "",
              saleType: "",
              AddedQuantity: "",
              Branch: "",
              amountMl: "",
            });
            toast.success("Update Done successfully", {
              position: "top-right",
            });
          })
          .catch((err) => {
            toast.error(err.response.data, { position: "top-right" });
          });
      }

      setTimeout(() => {
        window.location.href = `/product_history/${id}`;
      }, 700);
    }
  };

  useEffect(() => { 
    const fetchData = async () => { 
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Products/${id}`
        );
        setProductsInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Products/productevents/${id}`
        );
        setProductsEvents(res.data);
        console.log("Fetched data:", res.data); // Log the fetched data
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Products/productorders/${id}`
        );
        setProductsOrders(res.data);
        console.log("Fetched data:", res.data); // Log the fetched data
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  // getting branch data

  const [BranchPut, setBranchPut] = useState([]);
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/analytics/branches/${company_id}`
      )
      .then((response) => {
        setBranchPut(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product groups:", error);
      });
  }, [company_id]);

  // Stock transfer

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_API_ADDRESS + `api/Products/${id}`
        );
        setStockTransfer(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id, searchQuery]);

  const [transferStock, setStockTransfer] = useState({
    Branch: "",
    ToBranch: "",
    name: "",
    transferQuantity: "",
    amountMl: "",
  });

  const handleOnChangeTransfer = (e) => {
    const { name, value } = e.target;
    setStockTransfer({ ...transferStock, [name]: value });
  };

  const handleStockTransfer = (e) => {
    const updatedTransfer = {
      ...transferStock,
    };
    if (!price) {
      alert("All values are required");
    } else {
      if (id) {
        axios
          .put(
            process.env.REACT_APP_API_ADDRESS +
              `api/adminfunctions/transferstock`,
            transferStock
          )
          .then(() => {
            setStockTransfer({
              Branch: "",
              ToBranch: "",
              name: "",
              transferQuantity: "",
              amountMl: "",
            });
            toast.success("Transfer successful", { position: "bottom-right" });
          })
          .catch((err) => {
            toast.error(err.response.data, { position: "bottom-right" });
          });
      }
      setTimeout(() => history(" "), 700);
    }
  };

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "NormalUser" && <SalesPersonsNavigation />}
        {user && user.role === "Admin" && <AlphaSideBarNav />}

        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="AdminProductEdit">
            <div className="TopProductNews">
              <div className="ProductDetails">
                <div className="ProductDetailsTop">
                  <div className="EditProductImage">
                    <img src={productsInfo.imageUrl} alt="product_iamge" />
                  </div>
                  <div className="producteditPath">
                    <h1>{productsInfo.name}</h1>
                    <button onClick={handleClickOpen}>Update</button>
                  </div>
                </div>

                <div className="ProductDetailsBottom">
                  <span>
                    Product location: <small>{productsInfo.Branch}</small>
                  </span>
                  <span>
                    Product ID: <small>{productsInfo.id}</small>
                  </span>

                  {user && user.role === "Admin" && (
                    <span>
                      Buying price:<small>KES {productsInfo.BuyingPrice}</small>
                    </span>
                  )}

                  <span>
                    Selling price: <small>KES {productsInfo.price}</small>
                  </span>

                  {productsInfo.ProductStatus === "Small" && (
                    <span>
                      Cup type<small>Small</small>
                    </span>
                  )}

                  {productsInfo.ProductStatus === "Large" && (
                    <span>
                      Cup type<small>Large</small>
                    </span>
                  )}

                  {productsInfo.category === "Senator Keg" &&
                    user.role === "Admin" && (
                      <span>
                        Volume: <small>{productsInfo.amountMl} ML</small>
                      </span>
                    )}

                  {productsInfo.category !== "Senator Keg" && (
                    <span>
                      Volume: <small>{productsInfo.amountMl} ML</small>
                    </span>
                  )}

                  {user && user.role === "Admin" && (
                    <span>
                      Product count:<small>{productsInfo.quantity}</small>
                    </span>
                  )}
                </div>

                <div className="StockTransfer">
                  <h1>Stock Transfer</h1>
                  <div className="TransferForm">
                    <div className="transferinput">
                      <label>Product name</label>
                      <input
                        placeholder="name"
                        type="text"
                        id="name"
                        name="name"
                        value={transferStock.name}
                        onChange={handleOnChangeTransfer}
                      />
                    </div>

                    <div className="transferinput">
                      <label>Amount Ml</label>
                      <input
                        placeholder="name"
                        id="amountMl"
                        name="amountMl"
                        value={transferStock.amountMl}
                        onChange={handleOnChangeTransfer}
                      />
                    </div>

                    <div className="transferinput">
                      <label>Transfer from:</label>
                      <input
                        placeholder="name"
                        type="text"
                        id="Branch"
                        name="Branch"
                        value={transferStock.Branch}
                        onChange={handleOnChangeTransfer}
                      />
                    </div>

                    <div className="transferinput">
                      <label>Select outlet to transfer to</label>
                      <select
                        id="ToBranch"
                        name="ToBranch"
                        value={transferStock.ToBranch || ""}
                        onChange={handleOnChangeTransfer}
                      >
                        <option value="">Select...</option>
                        {BranchPut.map((val) => {
                          return <option>{val.BranchName}</option>;
                        })}
                      </select>
                    </div>
                    <div className="transferinput">
                      <label>Input quantity to transfer</label>
                      <input placeholder="quantity" type="number" />
                    </div>
                    <div className="TransferButton">
                      <button onClick={handleStockTransfer}>Transfer</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ProductActivities">
                <h1>Latest Activities</h1>
                <div className="TransactionEvents">
                  {productEvents.map((productEvent) => {
                    return (
                      <ul
                        key={productEvent.product_id}
                        className="transaction-list"
                      >
                        <li className="transaction-item">
                          {productEvent.event_type === "Stock Flow" && (
                            <div className="dot-line">
                              <p>
                                {productEvent.quantity} item(s) added by{" "}
                                {productEvent.performed_by} @ Kshs{" "}
                                {productEvent.added_stock_value}{" "}
                                <span>
                                  {moment(productEvent.event_date)
                                    .subtract(3, "hours")
                                    .fromNow()}
                                </span>
                              </p>
                            </div>
                          )}
                        </li>
                        <li className="transaction-item">
                          {productEvent.event_type === "Sale" && (
                            <div className="dot-line">
                              <p>
                                {productEvent.quantity} item(s) sold by{" "}
                                {productEvent.performed_by} @ Kshs{" "}
                                {productEvent.sold_stock_value}{" "}
                                <span>
                                  {moment(productEvent.event_date)
                                    .subtract(3, "hours")
                                    .fromNow()}
                                </span>
                              </p>
                            </div>
                          )}
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="ProductOrders">
              <h1>Product orders</h1>
              <DataGrid
                style={{ padding: "20px" }}
                rows={productOrders.map((product, index) => ({
                  ...product,
                  id: product.order_id,
                  indexId: index + 1,
                }))}
                columns={[
                  { field: "indexId", headerName: "ID", width: 70 },
                  { field: "order_serial", headerName: "Serial", width: 100 },
                  {
                    field: "physical_count",
                    headerName: "Physical count",
                    width: 120,
                  },
                  {
                    field: "order_count",
                    headerName: "Order count",
                    width: 120,
                  },

                  {
                    field: "Total_Amount",
                    headerName: "Estimated amount",
                    width: 120,
                  },
                  {
                    field: "order_date",
                    headerName: "ordered At",
                    width: 150,
                    renderCell: (params) => (
                      <span>
                        {moment(params.row.DateAdded).format("DD.MM.YYYY")}
                      </span>
                    ),
                  },
                  {
                    field: "order_status",
                    headerName: "Status",
                    width: 100,
                    renderCell: (params) => {
                      let cellStyle = {};
                      switch (params.value) {
                        case "Pending":
                          cellStyle = { color: "blue" };
                          break;
                        case "Accepted":
                          cellStyle = { color: "green" };
                          break;
                        case "Rejected":
                          cellStyle = { color: "red" };
                          break;
                        default:
                          break;
                      }

                      return <div style={cellStyle}>{params.value}</div>;
                    },
                  },

                  {
                    field: "Admin_response",
                    headerName: "Response",
                    width: 120,
                  },
                  // (user.role === 'Admin') && { field: 'quantity', headerName: 'System', width: 120 },
                  {
                    field: "actions",
                    headerName: "Action",
                    width: 100,
                    renderCell: (params) => {
                      if (params.row.order_status === "Rejected") {
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "15px",
                            }}
                          >
                            <Link>
                              <button
                                style={{
                                  color: "green",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Resend
                              </button>
                            </Link>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    },
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

            <div className="ProductActivityGraph">
              <h1>Summar analysis</h1>
              <SummaryAreaChart productEvents={productEvents} />
            </div>

            <div className="formEdit">
              <Dialog
                fullScreen={isNarrowScreen}
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                sx={{
                  padding: paddingValue,
                }}
              >
                <AppBar
                  sx={{ position: "relative", backgroundColor: "#154a93" }}
                >
                  <Toolbar>
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close"
                    >
                      <ArrowBackIosIcon sx={{ color: "#fff" }} />
                    </IconButton>
                    <Typography
                      sx={{ ml: 0, flex: 1, color: "#fff", fontSize: "13px" }}
                      variant="h6"
                      component="div"
                    >
                      Product Update
                    </Typography>
                  </Toolbar>
                </AppBar>
                <div className="ProductEditDialog">
                  <div className="TopPartEdit">
                    <ul className="EntryOne">
                      <li>
                        <label>Quantity</label>
                        <input
                          placeholder="New quantity"
                          name="AddedQuantity"
                          id="AddedQuantity"
                          value={productsInfo.AddedQuantity}
                          onChange={handleOnChange}
                        />
                      </li>
                      <li>
                        <label>Buying Price</label>
                        <input
                          placeholder="b.p"
                          name="BuyingPrice"
                          id="BuyingPrice"
                          value={productsInfo.BuyingPrice || " "}
                          onChange={handleOnChange}
                        />
                      </li>
                      <li>
                        <label>Selling Price</label>
                        <input
                          placeholder="s.p"
                          name="price"
                          id="price"
                          value={productsInfo.price || " "}
                          onChange={handleOnChange}
                        />
                      </li>
                      <li>
                        <label>Amount (Ml)</label>
                        <input
                          placeholder="Amount..250ml"
                          name="amountMl"
                          id="amountMl"
                          value={productsInfo.amountMl}
                          onChange={handleOnChange}
                        />
                      </li>
                      <li>
                        <label>Supplier name</label>
                        <input
                          placeholder="Supplier"
                          name="Supplier"
                          id="Supplier"
                          value={productsInfo.Supplier || " "}
                          onChange={handleOnChange}
                        />
                      </li>
                      {/* <li>
              <label>Payment mode</label>
              <select 
                  name='payment_mode'
                  id='payment_mode'
                  value={productsInfo.payment_mode || " "}
                  onChange={handleOnChange}
              >
                <option value="">Select mode...</option>
                <option>Cash</option>
                <option>Mpesa</option>
                <option>Bank transfer</option>
              </select>
            </li> */}
                    </ul>

                    <div className="SummaryTwo">
                      <section>
                        <h1>Summary</h1>
                      </section>
                      <div className="SummaryList">
                        <ul>
                          <li>
                            <p>New entry</p>
                            <span>{productsInfo.AddedQuantity}</span>
                          </li>
                          <li>
                            <p>Total amount</p>
                            <span>
                              {productsInfo.AddedQuantity *
                                productsInfo.BuyingPrice}
                            </span>
                          </li>
                          <li>
                            <p>Paid through</p>
                            <span
                              style={{ color: "#047857", fontWeight: "bold" }}
                            >
                              {productsInfo.payment_mode}
                            </span>
                          </li>
                          {/* <li>
                    <button>Print</button>
                </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="BottomSave">
                    <button onClick={() => handleSubmit()}>Save</button>
                  </div>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
