import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./ProductsSalesPage.scss";
import "../StockOrder/OrderForm.scss";
import { AuthContext } from "../../AuthContext/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Pagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import SortIcon from "@mui/icons-material/Sort";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import jsPDF from "jspdf";
import moment from "moment";
import Swal from "sweetalert2";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AnimeOrder from "./animation/AnimeOrder";

const ProductsShow = ({ searchQuery, setSearchQuery }) => {
  const { user } = useContext(AuthContext);
  const id = user?.id;
  const [open, setOpen] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [sevenDays, setLastSevenDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [sold_count, setSoldCount] = useState("");
  const [total_amount, setTotalSevenDayAmount] = useState("");
  const [product, setProduct] = useState("");
  const [physical_count, setPhysicalCount] = useState("");
  const [order_count, setOrderCount] = useState("");
  const [BuyingPrice, setBuyingPrice] = useState("");
  const [Total_Amount, setTotalAmount] = useState("");
  const [order_status, setOrderStatus] = useState("");
  const [Admin_response, setAdminResponse] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amountMl, setAmountMl] = useState("");
  const [sold, setSold] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const Branch = user?.Branch;
  const company_id = user?.company_id;
  const order_personnel = user?.userName;
  const sender_name = user?.fullname;
  const today = moment().format("MMMM D, YYYY");
  const [sale_activity_date, setSaleActivityDate] = useState("");
  const [products, setProducts] = useState([]);
  const currentUser = user?.fullname;
  const [cart, setCart] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [startShiftDatetime, setStartShiftDatetime] = useState(
    localStorage.getItem("startShiftDatetime")
      ? new Date(localStorage.getItem("startShiftDatetime"))
      : null
  );
  const [endShiftDatetime, setEndShiftDatetime] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [orderMessage, setOrderMessage] = useState("");

  const handleAddToList = () => {
    const amountMlValue = parseFloat(amountMl);
    const buyingPriceValue = parseFloat(BuyingPrice);

    if (amountMlValue === 0 || buyingPriceValue === 0) {
      setOrderMessage("Kindly put a valid amountMl or BuyingPrice.");
      return; // Exit the function early
    }

    const Total_Amount = order_count * BuyingPrice; // Calculate total price
    const newEntry = {
      product,
      productId,
      physical_count,
      order_count,
      BuyingPrice,
      Total_Amount,
      productId: productId, // This line seems redundant
      quantity,
      amountMl,
      sold,
      sale_activity_date,
      sold_count: sevenDays.map((item) => item.sold_count).join(", "),
      total_amount: sevenDays.map((item) => item.total_amount).join(", "),
    };
    setOrderList((prevList) => [...prevList, newEntry]);
    setProduct("");
    setPhysicalCount("");
    setOrderCount("");
    setBuyingPrice("");
    setTotalAmount("");
    setProductId("");
    setQuantity("");
    setAmountMl("");
    setSold("");
    setSaleActivityDate("");
    setOrderMessage("");
    setSoldCount("");
    setTotalSevenDayAmount("");
  };

  const totalOrderCost = orderList.reduce(
    (total, item) =>
      total + parseFloat(item.order_count) * parseFloat(item.BuyingPrice),
    0
  );

  const generateUniqueCode = () => {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
    return timestamp + randomString; // Concatenate timestamp and random string
  };

  const PostOrder = () => {
    if (orderList.length === 0) {
      alert("Please add items to the order list before submitting.");
      return;
    }

    const order_serial = generateUniqueCode();

    const doc = new jsPDF();
    const headers = [
      [
        "Product",
        "Physical Count",
        "Order Count",
        "Buying Price",
        "Ml",
        "Estimated Total",
      ],
    ];

    const data = orderList.map((entry) => [
      entry.product,
      entry.physical_count,
      entry.order_count,
      entry.BuyingPrice,
      entry.amountMl,
      entry.Total_Amount,
    ]);

    // Create main order table
    doc.text(
      `${Branch} order submitted by ${sender_name} (${order_serial})`,
      10,
      10
    );
    doc.autoTable({
      startY: 20,
      head: headers,
      body: data,
      didDrawCell: (data) => {
        // Add borders to cells
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
      },
      headStyles: {
        fillColor: "#154a93", // Background color of header
        textColor: "#ffffff", // Text color of header
      },
    });

    // Calculate days since last sale activity
    const todayDate = moment();
    const analyticsStartY = doc.autoTable.previous.finalY + 10;
    const analyticsHeaders = [
      [
        "Product",
        "Last 7 days sale Count",
        "Sale Percentage",
        "Days Since Last Sale",
        "Decision",
      ],
    ];
    const analyticsData = orderList.map((entry) => {
      const saleDate = moment(entry.sale_activity_date);
      const daysSinceSale = todayDate.diff(saleDate, "days");
      let daysText = daysSinceSale + " days";
      let decision = daysSinceSale >= 7 ? "Resize" : "Purchase";
      let fillColor = decision === "Resize" ? "red" : "green";
      let textColor = "white";
      return [
        entry.product,
        `${entry.sold_count} @ KES ${entry.total_amount} /=`,
        `${((entry.sold / (entry.sold + entry.quantity)) * 100).toFixed(2)}%`,
        daysText,
        { content: decision, styles: { fillColor, textColor } },
      ];
    });

    doc.autoTable({
      startY: analyticsStartY,
      head: analyticsHeaders,
      body: analyticsData,
      didDrawCell: (data) => {
        // Add borders to cells
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
      },
      headStyles: {
        fillColor: "#154a93", // Background color of header
        textColor: "#ffffff", // Text color of header
      },
    });

    // Calculate and add Estimated Total Cost for this order
    const totalCost = orderList.reduce(
      (total, entry) => total + entry.Total_Amount,
      0
    );
    const totalCostY = doc.autoTable.previous.finalY + 10;

    doc.text(
      `Estimated Total Cost is Kshs ${totalCost.toFixed(2)} /=`,
      10,
      totalCostY,
      {
        fontSize: 10,
        paddingTop: 20,
      }
    );

    const fileName = `${today}_${Branch}_order_list.pdf`;
    doc.save(fileName);

    // Submit order
    orderList.forEach((order) => {
      axios
        .post(
          process.env.REACT_APP_API_ADDRESS + "api/adminfunctions/postrder",
          {
            order_personnel: order_personnel,
            Branch: Branch,
            product: order.product,
            physical_count: order.physical_count,
            order_count: order.order_count,
            BuyingPrice: order.BuyingPrice,
            Total_Amount: order.Total_Amount,
            order_status: order_status,
            Admin_response: Admin_response,
            company_id: company_id,
            productId: order.productId,
            quantity: order.quantity,
            amountMl: order.amountMl,
            sender_name: sender_name,
            sold: order.sold,
            order_serial: order_serial,
          }
        )
        .then(() => {
          console.log(`Order submitted successfully`);
        })
        .catch((error) => {
          toast.error(`Error submitting orders`);
        });
    });

    setOrderList([]);
  };

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS + `/api/analytics/available/${Branch}`
      )
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [Branch]);

  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      axios
        .get(
          `${process.env.REACT_APP_API_ADDRESS}/api/ProductSales/seven_days/${productId}`
        )
        .then((response) => {
          setLastSevenDays(response.data);
        })
        .catch((error) => {
          console.error("Error fetching sold products:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [productId]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
    axios
      .get(
        process.env.REACT_APP_API_ADDRESS +
          `/api/analytics/available/${Branch}?q=${searchQuery}`
      )
      .then((response) => {
        setProducts(response.data);
      });
  }, [searchQuery, Branch]);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      toast.error("Item is already in the cart", {
        position: "bottom-right",
        autoClose: 1000,
      });
    } else {
      const newProduct = { ...product, count: 1 };
      setCart([...cart, newProduct]);

      setCart([...cart, newProduct]);

      localStorage.setItem("cart", JSON.stringify([...cart, newProduct]));

      const itemCount = cart.reduce((count, item) => count + item.count, 0) + 1;
      localStorage.setItem("cartItemCount", itemCount);

      toast.success("Item added to cart", {
        position: "bottom-right",
        autoClose: 1000,
      });
    }
  };

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [amountMlMin, setAmountMlMin] = useState("");
  const [amountMlMax, setAmountMlMax] = useState("");
  const [priceFilter, setPriceFilter] = useState(null);
  const [amountMlFilter, setAmountMlFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  // Function to calculate filtered products
  const calculateFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearchQuery =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      const matchesPrice =
        !priceFilter ||
        (product.price >= priceFilter.min && product.price <= priceFilter.max);
      const matchesAmountMl =
        !amountMlFilter ||
        (product.amountMl >= amountMlFilter.min &&
          product.amountMl <= amountMlFilter.max);

      return (
        matchesSearchQuery && matchesCategory && matchesPrice && matchesAmountMl
      );
    });
  };

  // Calculate filtered products
  const filteredProducts = calculateFilteredProducts();
  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];
  const productsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = activeStep * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const [isVisible, setIsVisible] = useState(false);
  const productsRef = useRef(null);

  const handleScroll = () => {
    const top = productsRef.current.getBoundingClientRect().top;
    setIsVisible(top < window.innerHeight - 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFilterChange = (filterType, min, max) => {
    switch (filterType) {
      case "price":
        setPriceFilter({ min, max });
        break;
      case "amountMl":
        setAmountMlFilter({ min, max });
        break;
      case "category":
        setCategoryFilter(max);
        break;
      default:
        break;
    }
  };

  const handleFilterButtonClick = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    const shownBefore = localStorage.getItem("shownPopup");
    if (shownBefore === user?.id) {
      setHasShownPopup(true);
    } else {
      setHasShownPopup(false);
      localStorage.setItem("shownPopup", user?.id);
    }
  }, [user]);

  useEffect(() => {
    if (!startShiftDatetime && !hasShownPopup && user) {
      Swal.fire({
        title: "Start Shift",
        text: "Are you ready to start your shift?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, start my shift",
        cancelButtonText: "No, not now",
      }).then((result) => {
        if (result.isConfirmed) {
          const moment = require("moment-timezone");
          moment.tz.setDefault("Africa/Nairobi");
          const datetime = moment().format("YYYY-MM-DD HH:mm:ss");
          setTimeout(() => {
            window.location.href = `/index`;
          }, 500);
          setStartShiftDatetime(datetime);
          localStorage.setItem("startShiftDatetime", datetime);
          axios
            .put(
              process.env.REACT_APP_API_ADDRESS +
                `api/Auth/updateUserStartShift/${id}`,
              {
                startShiftDatetime: datetime,
              }
            )
            .then((response) => {})
            .catch((error) => {});
        }
      });
      setHasShownPopup(true);
    }
  }, [startShiftDatetime, hasShownPopup, user]);

  const handleStartShift = () => {
    const datetime = new Date();
    setStartShiftDatetime(datetime);
    localStorage.setItem("startShiftDatetime", datetime);
  };

  const handleEndShift = () => {
    Swal.fire({
      title: "End Shift",
      text: "Are you sure you want to end your shift?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, end my shift",
      cancelButtonText: "No, not now",
    }).then((result) => {
      if (result.isConfirmed) {
        const moment = require("moment-timezone");
        moment.tz.setDefault("Africa/Nairobi");
        const datetime = moment().format("YYYY-MM-DD HH:mm:ss");
        setTimeout(() => {
          window.location.href = `/user_profile/${id}`;
        }, 500);
        setEndShiftDatetime(datetime);

        axios
          .put(
            process.env.REACT_APP_API_ADDRESS +
              `api/Auth/updateUserEndShift/${id}`,
            {
              endShiftDatetime: datetime,
            }
          )
          .then((response) => {})
          .catch((error) => {});

        localStorage.removeItem("startShiftDatetime");
        setStartShiftDatetime(null);
        Swal.fire(
          "Shift Ended",
          "Your shift has ended. Proceed to download report.",
          "success"
        );
      }
    });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <motion.div
      ref={productsRef}
      className="ProductSalesPage"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1.5, type: "spring" }}
    >
      <div className="HomeProductSearch">
        <input
          placeholder="Search"
          type="search"
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="TopButtons">
        <div className="SwalFire">
          {!startShiftDatetime && (
            <div className="SwalFire">
              <button
                onClick={handleStartShift}
                style={{
                  backgroundColor: "#021e46",
                  padding: "10px 10px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Start Shift
              </button>
            </div>
          )}
          {startShiftDatetime && !endShiftDatetime && (
            <div className="SwalFire">
              <button
                onClick={handleEndShift}
                style={{
                  backgroundColor: "#021e46",
                  padding: "10px 10px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                End Shift
              </button>
            </div>
          )}
        </div>
        <div className="OrderButton">
          <button onClick={handleClickOpen}>Order stock</button>
        </div>
      </div>

      <div className="BranchHeader">
        <h1>Product Brands & Prices in {Branch}</h1>
        <span>Hello {currentUser}. Happy selling!</span>
      </div>

      <div className="FilterItem">
        <ul>
          <li>
            <button onClick={() => handleFilterChange("category", null, "")}>
              <span className="iconFilter">
                <AcUnitIcon />
              </span>
              <span>All</span>
            </button>
          </li>
          {uniqueCategories.map((category) => (
            <li key={category}>
              <button
                onClick={() => handleFilterChange("category", null, category)}
              >
                <span>
                  <WidgetsIcon />
                </span>
                <span>{category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {startShiftDatetime && (
        <div className="filterButton">
          <div className="buttonsactions">
            <button className="FilterAction" onClick={handleFilterButtonClick}>
              <SortIcon style={{ color: "red" }} /> Filter
            </button>
            <button className="OrderAction" onClick={handleClickOpen}>
              {" "}
              Order Stock
            </button>
          </div>
          {isFilterVisible && (
            <div className="Filters">
              <div className="FilterItem">
                <label>Filter by price</label>

                <div className="FiltertInputs">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Min"
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Max"
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>

                <button
                  onClick={() =>
                    handleFilterChange("price", priceMin, priceMax)
                  }
                >
                  Apply
                </button>
              </div>

              <div className="FilterItem">
                <label>Filter by Ml</label>
                <div className="FiltertInputs">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Min"
                    onChange={(e) => setAmountMlMin(e.target.value)}
                  />
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Max"
                    onChange={(e) => setAmountMlMax(e.target.value)}
                  />
                </div>
                <button
                  onClick={() =>
                    handleFilterChange("amountMl", amountMlMin, amountMlMax)
                  }
                >
                  Apply
                </button>
              </div>

              <div className="FilterItem">
                <label>Filter by category</label>
                <select
                  onChange={(e) =>
                    handleFilterChange("category", null, e.target.value)
                  }
                >
                  <option value="">All</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {startShiftDatetime && (
        <div className="ProductsDisplay">
          {currentProducts.map((product) => ( 
            <motion.div
              key={product.id}
              className="SingleProducts"
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: "300" }}
              whileHover={{
                scale: 1.02,
                originX: 0,
              }}
            >
              {/* <div className='ProductCount'><p>{product.quantity}</p></div> href={`/product_history/${product.id}`} */}
              <a href={`/product_history/${product.id}`} className="ImageLink">
                <img src={product.imageUrl} alt={product.name} loading="lazy" />
              </a>
              <div className="ProductDescptions">
                <div className="Description">
                  <div className="DescriptionA">
                    <span>
                      {product.ProductStatus === "Small" && (
                        <small>{product.name} - Small cup</small>
                      )}

                      {product.ProductStatus !== "Large" &&
                        product.ProductStatus !== "Small" && (
                          <small>
                            {product.name} - {product.amountMl} ml
                          </small>
                        )}

                      {product.ProductStatus === "Large" && (
                        <small>{product.name} - Large cup</small>
                      )}
                    </span>
                  </div>
                  <div className="DescriptionB">
                    <small>KES {product.price.toLocaleString()}</small>
                  </div>
                </div>

                <div className="ControlButtons">
                  <div className="cartButton">
                    {product.quantity < 1 ? (
                      <>
                        {product.category !== "Senator Keg" && (
                          <button disabled className="outOfStock">
                            Out of stock
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart({
                            ...product,
                            quantity: 1,
                            initialQuantity: product.quantity,
                          })
                        }
                        className="InStock"
                      >
                        Sell product
                      </button>
                    )}
                    {product.category === "Senator Keg" && (
                      <button
                        onClick={() =>
                          addToCart({
                            ...product,
                            quantity: 1,
                            initialQuantity: product.quantity,
                          })
                        }
                        className="InStock"
                      >
                        Sell product
                      </button>
                    )}
                  </div>
                  <div className="ViewMore">
                    <a href={`/product_history/${product.id}`}>
                      <VisibilityIcon className="ViewIcon" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {startShiftDatetime && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "25px",
          }}
        >
          <Stack spacing={4}>
            <Pagination
              count={totalPages}
              page={activeStep + 1}
              onChange={(event, page) => handleStepChange(page - 1)}
              className="mt-5"
              color="primary"
            />
          </Stack>
        </div>
      )}

      {startShiftDatetime && (
        <div className="StockOrder">
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle
              sx={{
                backgroundColor: "#032e69",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Stock ordering</span>{" "}
              <div>
                <AnimeOrder />
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="OrderForm">
                <div className="entriesOrder">
                  <div className="OrderFormA">
                    <div>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={products.map((item) => ({
                          id: item.id,
                          name: item.name,
                          BuyingPrice: item.BuyingPrice,
                          quantity: item.quantity,
                          amountMl: item.amountMl,
                          sold: item.sold,
                          sale_activity_date: item.sale_activity_date,
                        }))}
                        getOptionLabel={(option) =>
                          option ? `${option.name}(${option.amountMl}ml)` : ""
                        }
                        sx={{
                          width: 250,
                          border: "none",
                          outline: "none",
                          padding: "20px",
                        }}
                        value={product}
                        onChange={(event, value) => {
                          console.log("Options:", products);
                          console.log("Selected value:", value);

                          if (value) {
                            setProduct(value.name || "");
                            setProductId(value.id || "");
                            setBuyingPrice(value.BuyingPrice || "");
                            setQuantity(value.quantity || "");
                            setAmountMl(value.amountMl || "");
                            setSold(value.sold || "");
                            setSaleActivityDate(value.sale_activity_date || "");
                          } else {
                            setProduct("");
                            setProductId("");
                            setBuyingPrice("");
                            setQuantity("");
                            setAmountMl("");
                            setSold("");
                            setSaleActivityDate("");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Product name" />
                        )}
                      />
                    </div>

                    <div className="OrderFormEntry">
                      <label>Physical Count</label>
                      <input
                        id="physical_count"
                        value={physical_count}
                        onChange={(e) => setPhysicalCount(e.target.value)}
                      />
                    </div>

                    <div className="OrderFormEntry">
                      <label>Millimetre</label>
                      <input
                        id="amountMl"
                        value={amountMl}
                        onChange={(e) => setAmountMl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="OrderFormB">
                    <div className="OrderFormEntry">
                      <label>Order Count</label>
                      <input
                        id="order_count"
                        value={order_count}
                        onChange={(e) => setOrderCount(e.target.value)}
                      />
                    </div>

                    <div className="OrderFormEntry">
                      <label>Buying price</label>
                      <input
                        id="BuyingPrice"
                        value={BuyingPrice}
                        onChange={(e) => setBuyingPrice(e.target.value)}
                      />
                    </div>

                    <div className="OrderFormEntry">
                      <label>Sold</label>
                      <input
                        id="sold"
                        value={sold}
                        onChange={(e) => setSold(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "25px" }}>
                  {sevenDays.map((productsold) => {
                    return (
                      <div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span>Last 7 days Count:</span>
                          <span>
                            {productsold.sold_count} items @{" "}
                            {productsold.total_amount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                  {orderMessage && (
                    <p
                      style={{
                        color: "maroon",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {orderMessage}
                    </p>
                  )}
                </div>
                <div className="OrderForwardButton">
                  <button
                    onClick={() => {
                      handleAddToList();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>Loading...</span>
                    ) : (
                      <>
                        <span>
                          <AddIcon />
                        </span>
                        <span>Add to list</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="DisplayList">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Available</th>
                        <th>Order</th>
                        <th>Buying_rice</th>
                        <th>Total</th>
                        <th>id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map((entry, index) => (
                        <tr key={index}>
                          <td>{entry.product}</td>
                          <td>{entry.physical_count}</td>
                          <td>{entry.order_count}</td>
                          <td>{entry.BuyingPrice}</td>
                          <td>{entry.Total_Amount}</td>{" "}
                          <td>{entry.productId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="totalCost">
                    <span>Total Order Cost: {totalOrderCost}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions
              sx={{
                backgroundColor: "#e2e8f0",
                direction: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button sx={{ color: "red" }} onClick={handleClose} autoFocus>
                Cancel
              </Button>
              <Button
                sx={{ color: "white", backgroundColor: "#154a93" }}
                onClick={PostOrder}
                autoFocus
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsShow;
