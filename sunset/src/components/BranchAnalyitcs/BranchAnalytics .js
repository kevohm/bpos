import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import "./BranchAnalytics.scss";
import moment from "moment";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlphaSideBarNav from "../MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import AlphaNavBarAdmin from "../MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import { AuthContext } from "../../AuthContext/AuthContext";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaArrowUp, FaArrowDown, FaArrowRight } from "react-icons/fa";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Swal from "sweetalert2";
import BranchPdf from "./BranchPdf";
import Barcode from "react-barcode";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BranchAnalytics = () => {
  const { user } = useContext(AuthContext);
  const { Branch } = useParams();
  const history = useNavigate();
  const barcodesRef = useRef(null);
  const editedBy = user?.fullname || user?.businessName;
  const today = moment().format("MMMM D, YYYY");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [query, setQuery] = useState("");
  const [stockSummary, setStockSummary] = useState([]);
  const [companyProfit, setCompanyProfit] = useState([]);
  const [salesDash, setSalesDash] = useState([]);
  const [cashAtHand, setCashAtHand] = useState([]);
  const [stockInformation, setStockInformation] = useState([]);
  const [stockPerformence, setStockPerformce] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/adminfunctions/branchprofit/${Branch}`
      )
      .then((response) => {
        setCompanyProfit(response.data);
        console.log("profit", response.data);
      })
      .catch((error) => {
        console.error("Error fetching company profit:", error);
      });

    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/adminfunctions/branchcashtotals/${Branch}`
      )
      .then((response) => {
        setCashAtHand(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cash at hand:", error);
      });

    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/adminfunctions/branchsales/${Branch}`
      )
      .then((response) => {
        setSalesDash(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  }, [Branch]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS + `api/analytics/${Branch}?q=${query}`
      )
      .then((response) => {
        setAnalyticsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch, query]);

  const handleQuantityChange = (productId, event) => {
    const newQuantities = {
      ...quantities,
      [productId]: Number(event.target.value),
    };
    setQuantities(newQuantities);
  };

  const handlePrint = () => {
    if (barcodesRef.current) {
      const content = barcodesRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = content;
      window.print();
      document.body.innerHTML = originalContent;
    }
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/expenses/stockanalysis/${Branch}`
      )
      .then((response) => {
        setStockSummary(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch]);

  // Stock Performance
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `api/Products/stockperformance/${Branch}`
      )
      .then((response) => {
        setStockPerformce(response.data);
      })
      .catch((error) => {
        console.error("Error fetching branch analytics:", error);
      });
  }, [Branch]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/adminfunctions/branchstockinformation/${Branch}`
      )
      .then((response) => {
        setStockInformation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [Branch]);

  const renderData = (data, property) => {
    return data.map((val) => (
      <div key={val.id}>
        <span>
          {val[property].toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    ));
  };

  const downloadPDF = () => {
    const unit = "pt";
    const size = "A4";

    const jsPDFDoc = new jsPDF({
      orientation: "landscape",
      unit,
      format: size,
    });

    const stockData = stockSummary.map((item, index) => [
      {
        content: item.stock_value_buying.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.stock_value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.total_items.toLocaleString(),
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.total_available.toLocaleString(),
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.total_sold.toLocaleString(),
        styles: { fontStyle: "bold", textColor: "black" },
      },
      {
        content: item.sale_rate,
        styles: {
          fontStyle: "bold",
          textColor: item.sale_rate < 1 ? "red" : "green",
        },
      },
      {
        content: item.sale_percentage,
        styles: { fontStyle: "bold", textColor: "black" },
      },
    ]);

    const stockHeaders = [
      "Stock value (BP)",
      "Stock Value (SP)",
      "Total Items",
      "total available",
      "told sold",
      "Sale rate",
      "sale %",
    ];

    // Get the table data and headers
    const tableData = analyticsData.map((item) => {
      const hasOpeningStock =
        item.OpeningStock !== null &&
        item.OpeningStock !== undefined &&
        item.OpeningStock !== "";
      const openingStockAsNumber = hasOpeningStock
        ? parseFloat(item.OpeningStock)
        : null; // Convert OpeningStock to a number if it's not null

      const isMismatched =
        hasOpeningStock && openingStockAsNumber !== item.quantity;

      return [
        {
          content: item.name,
          styles: {
            fontStyle: "bold",
            textColor: "black",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
        {
          content: item.OpeningStock,
          styles: {
            fontStyle: "bold",
            textColor: isMismatched ? "red" : "black",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
        {
          content: item.quantity,
          styles: {
            fontStyle: "bold",
            textColor: isMismatched ? "red" : "black",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
        {
          content: item.price.toLocaleString(),
          styles: {
            fontStyle: "bold",
            textColor: "black",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
        {
          content: item.amountMl.toLocaleString(),
          styles: {
            fontStyle: "bold",
            textColor: "black",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
        {
          content: item.sold,
          styles: {
            fontStyle: "bold",
            textColor: "black",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
        {
          content: item.quantity === 0 ? "Sold Out" : "In Stock",
          styles: {
            fontStyle: "bold",
            textColor: item.quantity === 0 ? "red" : "green",
            fillColor: isMismatched ? "#fee2e2" : "white",
          },
        },
      ];
    });

    const headers = [
      "Name",
      "Opening_stock",
      "Available stock",
      "Price / unit",
      "Amount (Ml)",
      "sold stock",
      "Status",
    ];
    const padding = 10;

    const textWidth = jsPDFDoc.getTextWidth(`${Branch} Shop`);
    const pageWidth = jsPDFDoc.internal.pageSize.width;
    const middleX = (pageWidth - textWidth) / 2;

    const paddingTop = 30;
    const middleY = paddingTop + 20;

    jsPDFDoc.setFontSize(18);
    jsPDFDoc.setFont("helvetica", "bold");
    jsPDFDoc.text(`${Branch} Shop`, middleX, middleY, { align: "center" });

    const secondTextY = middleY + 30;
    jsPDFDoc.setFontSize(12);
    jsPDFDoc.setFont("helvetica", "normal");
    jsPDFDoc.text(`Stock report as at ${today}`, middleX, secondTextY, {
      align: "center",
    });

    jsPDFDoc.autoTable({
      head: [stockHeaders],
      body: stockData,
      startY: 100,
      headStyles: {
        fontStyle: "bold",
        fillColor: "rgb(21, 74, 147)",
        textColor: "white",
      },
    });

    const stockTableY = jsPDFDoc.autoTable.previous.finalY + 20;

    jsPDFDoc.autoTable({
      head: [headers],
      body: tableData,
      startY: stockTableY,
      headStyles: {
        fontStyle: "bold",
        fillColor: "rgb(21, 74, 147)",
        textColor: "white",
      },
    });

    // Save the PDF
    jsPDFDoc.save(`${Branch} ${today} stock.pdf`);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete the product?")) {
      axios.delete(
        `${process.env.REACT_APP_API_ADDRESS}api/Products/deleteRecord/${id}`
      );
      toast.success("Product record deleted successfully");
    }
  };

  const [productsInfo, setProductsInfo] = useState({});

  // stock harmonizing
  const handleHarmonizeStock = (e) => {
    const updatedProductInfo = {
      ...productsInfo,
      Branch: Branch,
      editedBy: editedBy,
    };

    if (!Branch) {
      alert("Branch is required");
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This will harmonize the stock. Are you sure you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "No, cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .put(
              process.env.REACT_APP_API_ADDRESS +
                `api/Products/stockharmony/${Branch}`,
              updatedProductInfo
            )
            .then(() => {
              setProductsInfo({});
              toast.success("Stock harmonized successfully", {
                position: "top-right",
              });
            })
            .catch((err) => {
              toast.error(err.response.data, { position: "top-right" });
            });

          setTimeout(() => history(`/analytics/${Branch}`), 700);
        } else {
          console.log("Operation cancelled");
        }
      });
    }
  };

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div className="BranchAnalytics">
            <div className="BranchDesc">
              <h1 style={{ textAlign: "center" }}>{Branch} Outlet</h1>
            </div>

            <div className="TopBar">
              <div className="TableSummary">
                <Slider {...sliderSettings} className="custom-slider">
                  <div className="widgetSummaryItem bg-teal-500">
                    <div>
                      <span>
                        Cash at hand-{renderData(cashAtHand, "month")}
                      </span>
                      <small>{renderData(cashAtHand, "cash_at_hand")}</small>
                    </div>
                  </div>

                  <div className="widgetSummaryItem bg-orange-500">
                    <div>
                      <PaymentsIcon className="WidgetIcos" />
                    </div>
                    <div>
                      <span>Today Sales</span>
                      <small>{renderData(salesDash, "TodaySales")}</small>
                    </div>
                  </div>

                  <div className="widgetSummaryItem bg-green-500">
                    <div>
                      <TrendingUpIcon className="WidgetIcos" />
                    </div>
                    <div>
                      <span>Today Stock In</span>
                      <small>{renderData(salesDash, "stock_in")}</small>
                    </div>
                  </div>

                  <div className="widgetSummaryItem bg-cyan-500">
                    <div>
                      <PointOfSaleIcon className="WidgetIcos" />
                    </div>
                    <div>
                      <span>Today Expenses</span>
                      <small>{renderData(salesDash, "TodayExpenses")}</small>
                    </div>
                  </div>

                  <div className="widgetSummaryItem bg-sky-500 flex items-start">
                    <div className="mr-2">
                      <MonetizationOnIcon className="WidgetIcos" />
                    </div>
                    <div>
                      <span>Today Profit </span>
                      <small>{renderData(companyProfit, "daysProfit")}</small>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>

            <div className="filterProducts">
              {stockInformation.map((stockInfo) => {
                const currentStockValue = parseFloat(
                  stockInfo.currentStockValue
                );
                const soldStockValue = parseFloat(stockInfo.soldStockValue);
                const totalStockValue = currentStockValue + soldStockValue;
                const percentageCurrent =
                  (currentStockValue / totalStockValue) * 100 || 0;
                const percentageSold =
                  (soldStockValue / totalStockValue) * 100 || 0;

                const renderArrowIcon = (percentage) => {
                  if (percentage < 50) {
                    return <FaArrowDown style={{ color: "red" }} />;
                  } else if (percentage > 50) {
                    return <FaArrowUp style={{ color: "green" }} />;
                  } else {
                    return <FaArrowRight style={{ color: "orange" }} />;
                  }
                };

                return (
                  <div className="filterProducts">
                    <ul>
                      <li>
                        <span>Current stock value:</span>
                        <small>
                          {stockInfo.currentStockValue.toLocaleString()}{" "}
                          <strong>
                            {" "}
                            (<small>{percentageCurrent.toFixed(2)}%</small>{" "}
                            <small>{renderArrowIcon(percentageCurrent)} </small>
                            )
                          </strong>
                        </small>
                      </li>
                      <li>
                        <span>Sold stock value:</span>
                        <small>
                          {stockInfo.soldStockValue.toLocaleString()}{" "}
                          <strong>
                            {" "}
                            (<small>{percentageSold.toFixed(2)}%</small>{" "}
                            <small>{renderArrowIcon(percentageSold)} </small>)
                          </strong>
                        </small>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="BranchStock">
              <div className="MostMoving">
                <header className="flex justify-between space-x-10 items-center">
                  <BranchPdf
                    data={stockPerformence.sort(
                      (a, b) => b.total_count - a.total_count
                    )}
                  />
                </header>
                <div className="performaceList" style={{ display: "none" }}>
                  <ul>
                    {stockPerformence
                      .sort((a, b) => b.total_count - a.total_count)
                      .map((performance, index) => {
                        const label = index + 1;

                        return (
                          <li>
                            <p style={{ color: "#c2410c" }}>{label}</p>
                            <p>{performance.product_name}</p>
                            <span>
                              {performance.total_count} sold in the last 5 days
                              @Kshs{performance.price}.
                            </span>
                            <span>
                              <b>Total:{performance.total_amount}</b>
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>

              {user &&
                (user.JobRole === "Manager" ||
                  user.JobRole === "Super Admin") && (
                  <div className="DownloadPdf">
                    <Button variant="contained" onClick={downloadPDF}>
                      PDF <PictureAsPdfIcon className="pdficon" />
                    </Button>

                    <div className="BranchButtons">
                      <button onClick={handleHarmonizeStock}>
                        Harmonize stock
                      </button>
                    </div>
                  </div>
                )}

              <div
                style={{
                  marginBottom: "30px",
                  display: "flex",
                  flexDirection: "column",
                  border: "0.5px solid grey",
                  borderRadius: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                  marginTop:'30px'
                }}
              >
                <h1 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Generate Barcodes
                </h1>
                <div>
                  <Autocomplete
                    multiple
                    sx={{
                      minWidth: "300px",
                    }}
                    id="product"
                    options={analyticsData}
                    getOptionLabel={(option) => option.name}
                    value={selectedProducts}
                    onChange={(event, newValue) => {
                      setSelectedProducts(newValue);

                      newValue.forEach((product) => {
                        if (!quantities[product.id]) {
                          setQuantities((prev) => ({
                            ...prev,
                            [product.id]: 1,
                          }));
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Products" />
                    )}
                  />
                </div>
                {selectedProducts.map((product) => (
                  <div key={product.id}>
                    <div
                      style={{
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        display: "flex",
                        justifyContent:'flex-start',
                        alignItems:'flex-start',
                        gap: "20px",
                      }}
                    >
                      <div>
                        <span style={{fontSize:'13px',textTransform:'lowercase'}}>{product.name}</span>
                      </div>
                      <div>
                        <label htmlFor={`quantity-${product.id}`}>Qty:</label>
                        <input
                          type="number"
                          id={`quantity-${product.id}`}
                          value={quantities[product.id] || ""}
                          min="1"
                          onChange={(event) =>
                            handleQuantityChange(product.id, event)
                          }
                          style={{
                            width: "50px",
                            border: "1px solid grey",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    width: "350mm",
                    height: "auto",
                    margin: "auto",
                    display: "none",
                  }}
                  ref={barcodesRef}
                >
                  {selectedProducts.map((product) => (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {[...Array(quantities[product.id] || 0)].map(
                        (_, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              {product.name}:{product.price}
                            </div>
                            <div>
                              <Barcode
                                value={`${product.id.toString()}-${
                                  product.amountMl
                                }ml`}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button onClick={handlePrint} style={{backgroundColor:'#172554',color:'white',border:'none',outline:'none',padding:'5px 5px', borderRadius:'5px'}}>Print Barcodes</button>
                </div>
              </div>
              <DataGrid
                style={{ padding: "20px" }}
                rows={analyticsData.map((product, index) => ({
                  ...product,
                  indexId: index + 1,
                }))}
                columns={[
                  { field: "indexId", headerName: "ID", width: 70 },
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
                  { field: "amountMl", headerName: "Ml", width: 120 },
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
                    renderCell: (params) =>
                      params.row.quantity > 0 ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : (
                        <ClearIcon style={{ color: "red" }} />
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

            <div className="SalesAnalysis"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchAnalytics;
