import React, { useContext, useEffect, useState } from "react";
import "./StockAddition.scss";
import "./dataTable.scss";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import AddProduct from "./AddProduct";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../AuthContext/AuthContext";

const StockAddition = () => {
  const [productData, setProductData] = useState([]);
  const [query, setQuery] = useState("");
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id || user?.id;

  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/groupAnalytics/groupanalytics/${company_id}?q=${query}`
      )
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [company_id, query]);

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      Axios.delete(
        `${process.env.REACT_APP_API_ADDRESS}api/Products/deleteRecord/${id}`
      );
      toast.success("Product record deleted successfully");
    }
  };

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}

        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="StockAddition">
            <div className="infoTop">
              <h1>Products</h1>
              <button onClick={handleOpenProductDialog}>Add New Product</button>
              <AddProduct
                open={openProductDialog}
                handleClose={handleCloseProductDialog}
              />
            </div>
            <div slassName="dataTable">
              <DataGrid
                style={{ padding: "20px" }}
                rows={productData.map((product, index) => ({
                  ...product,
                  indexId: index + 1,
                }))}
                columns={[
                  { field: "indexId", headerName: "ID", width: 70 },
                  { field: "serialNumber", headerName: "Serial", width: 100 },
                  {
                    field: "imageUrl",
                    headerName: "Image",
                    width: 100,
                    renderCell: (params) => (
                      <img
                        src={params.row.imageUrl}
                        alt={params.row.name}
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
                  { field: "name", headerName: "Name", width: 200 },
                  {
                    field: "BuyingPrice",
                    headerName: "Buying Price",
                    width: 120,
                  },
                  { field: "price", headerName: "Selling Price", width: 120 },

                  {
                    field: "amountMl",
                    headerName: "Ml",
                    width: 120,
                    renderCell: (params) => {
                      const {
                        ProductStatus,
                        smallCupMl,
                        LargeCupMl,
                        amountMl,
                      } = params.row;
                      let mlToShow = amountMl;

                      if (ProductStatus === "Small") {
                        mlToShow = smallCupMl;
                      } else if (ProductStatus === "Large") {
                        mlToShow = LargeCupMl;
                      }

                      return <span>{mlToShow}</span>;
                    },
                  },

                  { field: "Branch", headerName: "Location", width: 120 },
                  {
                    field: "createdAt",
                    headerName: "Created At",
                    width: 150,
                    renderCell: (params) => (
                      <span>
                        {moment(params.row.DateAdded).format("DD.MM.YYYY")}
                      </span>
                    ),
                  },
                  {
                    field: "quantity",
                    headerName: "In Stock",
                    width: 100,
                    renderCell: (params) => {
                      const { quantity, category } = params.row;
                      if (category === "Senator Keg") {
                        return (
                          <span
                            style={{
                              color: "black",
                              backgroundColor: "#dcfce7",
                              padding: "10px",
                            }}
                          >
                            Keg
                          </span>
                        );
                      } else {
                        return (
                          <span>
                            {quantity > 0 ? (
                              <DoneIcon style={{ color: "green" }} />
                            ) : (
                              <ClearIcon style={{ color: "red" }} />
                            )}
                          </span>
                        );
                      }
                    },
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
                        <Link to={`/product_history/${params.row.id}`}>
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

                        {/* Delete button */}
                        <button
                          style={{
                            color: "red",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteProduct(params.row.id)}
                        >
                          <DeleteIcon />
                        </button>
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

export default StockAddition;
