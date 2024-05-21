import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import AlphaNavBarAdmin from "../../components/MainNavifation/NavigationAlpha/AlphaNavBarAdmin/AlphaNavBarAdmin";
import AlphaSideBarNav from "../../components/MainNavifation/NavigationAlpha/AlphaSideBarNav/AlphaSideBarNav";
import "./ProductRegistration.scss";
import { Modal, Button, TextField, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Spinner from "../../components/CompanyRegistration/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0f766e",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const AddSizesModal = ({ open, handleClose, sizes, setSizes }) => {
  const [sizeName, setSizeName] = useState("");
  const [size, setSize] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddSize = () => {
    const newSize = { sizeName, size, buyingPrice, sellingPrice, quantity };
    setSizes([...sizes, newSize]);
    setSizeName("");
    setSize("");
    setQuantity("");
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "20px",
        }}
      >
        <h1
          style={{ marginBottom: "20px", marginTop: "20px", fontWeight: "500" }}
        >
          Add Size
        </h1>
        <TextField
          label="Size Name"
          variant="outlined"
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
          fullWidth
          style={{ marginBottom: "20px" }}
        />
        <TextField
          label="Size"
          variant="outlined"
          value={size}
          onChange={(e) => {
            const inputValue = e.target.value;
            const regex = /^\d*\.?\d*$/;
            if (regex.test(inputValue) || inputValue === "") {
              setSize(inputValue);
            }
          }}
          fullWidth
          style={{ marginBottom: "20px" }}
        />

        <TextField
          label="Buying price"
          variant="outlined"
          value={buyingPrice}
          onChange={(e) => {
            const inputValue = e.target.value;
            const regex = /^\d*\.?\d*$/;
            if (regex.test(inputValue) || inputValue === "") {
              setBuyingPrice(inputValue);
            }
          }}
          fullWidth
          style={{ marginBottom: "20px" }}
        />

        <TextField
          label="Selling price"
          variant="outlined"
          value={sellingPrice}
          onChange={(e) => {
            const inputValue = e.target.value;
            const regex = /^\d*\.?\d*$/;
            if (regex.test(inputValue) || inputValue === "") {
              setSellingPrice(inputValue);
            }
          }}
          fullWidth
          style={{ marginBottom: "20px" }}
        />

        <TextField
          label="Quantity"
          variant="outlined"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          style={{ marginBottom: "20px" }}
        />
        <div style={{ display: "flex" }}>
          <button
            onClick={handleAddSize}
            style={{
              width: "100%",
              backgroundColor: "#0f766e",
              color: "white",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            Add Size
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AddSubSizesModal = ({
  open,
  handleClose,
  subSizes,
  setSubSizes,
  sizes,
}) => {
  const [subSizeName, setSubSizeName] = useState("");
  const [subSize, setSubSize] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [SubQuantity, setSubQuantity] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);

  const handleSizeChange = (event) => {
    const size = event.target.value;
    setSelectedSize(size);
    // Find the index of the selected size
    const selectedIndex = sizes.findIndex((s) => s.size === size);
    setSelectedSizeIndex(selectedIndex);
    const selectedSizeData = sizes.find((s) => s.size === size);
    if (selectedSizeData) {
      const { quantity } = selectedSizeData;
      setSubQuantity(quantity);
    }
  };

  const handleSubSizeChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (regex.test(inputValue) || inputValue === "") {
      setSubSize(inputValue);
      if (selectedSize && inputValue !== "" && inputValue !== "0") {
        const selectedSizeData = sizes.find((s) => s.size === selectedSize);
        if (selectedSizeData) {
          const { size, quantity } = selectedSizeData;
          const calculatedSubQuantity = (size / inputValue) * quantity;
          setSubQuantity(calculatedSubQuantity);
        }
      }
    }
  };

  const handleAddSubSize = () => {
    // Make sure a size is selected
    if (selectedSizeIndex !== null) {
      const newSubSize = {
        subSizeName,
        subSize,
        buyingPrice,
        sellingPrice,
        SubQuantity,
        sizeIndex: selectedSizeIndex,
      };
      setSubSizes([...subSizes, newSubSize]);
      handleClose();
    } else {
      // Handle error, no size selected
      console.error("No size selected for sub-size.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "5px",
          padding: "20px",
        }}
      >
        <h1
          style={{ marginBottom: "20px", marginTop: "20px", fontWeight: "500" }}
        >
          Add Sub Size
        </h1>
        <Select value={selectedSize} onChange={handleSizeChange}>
          {sizes.map((size) => (
            <MenuItem key={size.size} value={size.size}>
              {size.size} - {size.quantity}
            </MenuItem>
          ))}
        </Select>
        {selectedSize && (
          <TextField
            variant="outlined"
            value={selectedSizeIndex}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
        )}
        {selectedSize && (
          <TextField
            label="Sub Size Name"
            variant="outlined"
            value={subSizeName}
            onChange={(e) => setSubSizeName(e.target.value)}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
        )}
        {selectedSize && (
          <TextField
            label="Sub Size"
            variant="outlined"
            value={subSize}
            onChange={handleSubSizeChange}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
        )}
        {selectedSize && (
          <TextField
            label="Buying price"
            variant="outlined"
            value={buyingPrice}
            onChange={(e) => {
              const inputValue = e.target.value;
              const regex = /^\d*\.?\d*$/;
              if (regex.test(inputValue) || inputValue === "") {
                setBuyingPrice(inputValue);
              }
            }}
            fullWidth
            style={{ marginBottom: "20px" }}
          />
        )}
        {selectedSize && (
          <TextField
            label="Selling price"
            variant="outlined"
            value={sellingPrice}
            onChange={(e) => {
              const inputValue = e.target.value;
              const regex = /^\d*\.?\d*$/;
              if (regex.test(inputValue) || inputValue === "") {
                setSellingPrice(inputValue);
              }
            }}
            fullWidth
            style={{ marginBottom: "20px" }}
          />
        )}
        {selectedSize && (
          <TextField
            label="Sub quantity"
            variant="outlined"
            value={SubQuantity}
            onChange={(e) => {
              const inputValue = e.target.value;
              const regex = /^\d*\.?\d*$/;
              if (regex.test(inputValue) || inputValue === "") {
                setSubQuantity(inputValue);
              }
            }}
            disabled
            fullWidth
            style={{ marginBottom: "20px" }}
          />
        )}
        {selectedSize && (
          <div style={{ display: "flex" }}>
            <button
              onClick={handleAddSubSize}
              style={{
                width: "100%",
                backgroundColor: "#0f766e",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              Add Sub Size
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const AddProducts = () => {
  const { user } = useContext(AuthContext);
  const service_type = user?.service_type;
  const business_id = user?.id;
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const imagePreviewRef = useRef(null);
  const imagePreviewRefTwo = useRef(null);
  const imagePreviewRefThree = useRef(null);
  const imagePreviewRefFour = useRef(null);
  const [subSizes, setSubSizes] = useState([]);
  const [file, setFile] = useState("");
  const [fileTwo, setFileTwo] = useState("");
  const [fileThree, setFileThree] = useState("");
  const [fileFour, setFileFour] = useState("");
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [product_name, setProductName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [Branch, setBranch] = useState("");
  const [Description, setDescription] = useState("");
  const [openAddSizesModal, setOpenAddSizesModal] = useState(false);
  const [openAddSubSizesModal, setOpenAddSubSizesModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cat_name, setCat_name] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const fetchCancelToken = useRef(null);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [Shops, setShops] = useState([]);
  const [branch_id, setBranchId] = useState("");
  const [businessType, setBusinessType] = useState("");

  // service

  const [service_name, setService] = useState("");
  const [serviceSellingPrice, setServicSellingPrice] = useState("");

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

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCategory("");
  };

  const handleOpenAddSizesModal = () => {
    setOpenAddSizesModal(true);
  };

  const handleCloseAddSizesModal = () => {
    setOpenAddSizesModal(false);
  };

  const handleOpenAddSubSizesModal = () => {
    setOpenAddSubSizesModal(true);
  };

  const handleCloseAddSubSizesModal = () => {
    setOpenAddSubSizesModal(false);
  };

  const handleChange = (fieldName, value) => {
    switch (fieldName) {
      case "product_name":
        setProductName(value);
        break;
      case "category":
        setCategory(value);
        if (value === "Others") {
          setOpenModal(true);
        }
        break;
      case "Branch":
        setBranch(value);
        const selectedBranch = Shops.find((shop) => shop.name === value);
        if (selectedBranch) {
          setBranchId(selectedBranch.id);
        }
        break;
      case "Description":
        setDescription(value);
        break;
      case "serviceSellingPrice":
        setServicSellingPrice(value);
        break;
      case "service_name":
        setService(value);
        break;
      default:
        break;
    }
  };

  const handleSubmitService = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("service_name", service_name);
      formData.append("category", category);
      formData.append("Branch", Branch);
      formData.append("Description", Description);
      formData.append("serviceSellingPrice", serviceSellingPrice);
      formData.append("business_id", business_id);
      formData.append("branch_id", branch_id);
      formData.append("file", file);

      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + "/api/newproducts/new_service",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Service has been added successfully.", {
          autoClose: 5000,
        });
      } else {
        throw new Error("Failed to register service.");
      }
    } catch (error) {
      console.error("Error registering service:", error);
      toast.error("Failed to register the service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product_name", product_name);
      formData.append("category", category);
      formData.append("Branch", Branch);
      formData.append("Description", Description);
      formData.append("business_id", business_id);
      formData.append("branch_id", branch_id);
      formData.append("file", file);
      formData.append("fileTwo", fileTwo);
      formData.append("fileThree", fileThree);
      formData.append("fileFour", fileFour);

      console.log("Sizes data:", sizes);
      console.log("SubSizes data:", subSizes);

      sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][sizeName]`, size.sizeName);
        formData.append(`sizes[${index}][size]`, size.size);
        formData.append(`sizes[${index}][buyingPrice]`, size.buyingPrice);
        formData.append(`sizes[${index}][sellingPrice]`, size.sellingPrice);
        formData.append(`sizes[${index}][quantity]`, size.quantity);
        formData.append(`sizes[${index}][sizeIndex]`, size.index);
      });
      subSizes.forEach((subSize, index) => {
        formData.append(`subSizes[${index}][subSizeName]`, subSize.subSizeName);
        formData.append(`subSizes[${index}][subSize]`, subSize.subSize);
        formData.append(`subSizes[${index}][buyingPrice]`, subSize.buyingPrice);
        formData.append(
          `subSizes[${index}][sellingPrice]`,
          subSize.sellingPrice
        );
        formData.append(`subSizes[${index}][SubQuantity]`, subSize.SubQuantity);
        formData.append(
          `subSizes[${index}][selectedSizeIndex]`,
          subSize.sizeIndex
        );
      });

      const response = await axios.post(
        process.env.REACT_APP_API_ADDRESS + "/api/newproducts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("The product has been added successfully.", {
          autoClose: 5000,
        });
      } else {
        throw new Error("Failed to register product.");
      }
    } catch (error) {
      console.error("Error registering product:", error);
      toast.error("Failed to register the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // shops
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

  // categories
  useEffect(() => {
    if (!initialFetchComplete) {
      fetchCategories();
    }
  }, [initialFetchComplete]);

  const fetchCategories = async () => {
    setLoading(true);
    fetchCancelToken.current = axios.CancelToken.source();

    try {
      const response = await axios.get(
        process.env.REACT_APP_API_ADDRESS + "api/analytics/categories",
        {
          cancelToken: fetchCancelToken.current.token,
        }
      );

      setCategories(response.data);
      setInitialFetchComplete(true);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const SubmitCategory = () => {
    axios
      .post(process.env.REACT_APP_API_ADDRESS + "api/Products/category", {
        cat_name: cat_name,
      })
      .then((response) => {
        setCategories((prevCategories) => [...prevCategories, response.data]);
        setSelectedCategory(response.data.cat_name);
        alert("Category added");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error submitting category:", error);
      });
  };

  return (
    <div className="home">
      <div className="HomeDeco">
        {user && user.role === "Admin" && <AlphaSideBarNav />}
        <div className="homeContainer">
          {user && user.role === "Admin" && <AlphaNavBarAdmin />}
          <div>
            {loading && <Spinner />}
            <div className="ProductRegistration">
              <div className="ProductHeader">
                {(businessType === "Product" || service_type === "product") && (
                  <h1>New Product</h1>
                )}
                {(businessType === "Service" || service_type === "service") && (
                  <h1>New Service</h1>
                )}
                {service_type === "both" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <label
                      style={{
                        color: "#0f766e",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Select Type
                    </label>
                    <select
                      style={{
                        width: "200px",
                        border: "1px solid grey",
                        outline: "none",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                      value={businessType}
                      onChange={(e) => {
                        setBusinessType(e.target.value);
                      }}
                    >
                      <option>Select...</option>
                      <option value={"Product"}>Product</option>
                      <option value={"Service"}>Service</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="AddProduct">
                <div className="ProductImage">
                  <div className="MainImage">
                    <img
                      src=""
                      ref={imagePreviewRef}
                      alt=""
                      className={file ? "selectedImage" : ""}
                    />
                    <div className="ImageSelector">
                      <label htmlFor="file">
                        {" "}
                        <CameraAltIcon className="iconImage" />{" "}
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
                      />
                    </div>
                  </div>
                  {(businessType === "Product" ||
                    service_type === "product") && (
                    <div className="OtherImages">
                      <div className="images">
                        {" "}
                        <img
                          src=""
                          ref={imagePreviewRefTwo}
                          alt=""
                          className={fileTwo ? "selectedImage" : ""}
                        />
                        <div className="ImageSelector">
                          <label htmlFor="fileTwo">
                            {" "}
                            <CameraAltIcon className="iconImage" />{" "}
                          </label>
                          <input
                            name="fileTwo"
                            id="fileTwo"
                            type="file"
                            className="FileInput"
                            accept="image/*"
                            onChange={(event) =>
                              handleFileChange(
                                event,
                                setFileTwo,
                                imagePreviewRefTwo
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="images">
                        {" "}
                        <img
                          src=""
                          ref={imagePreviewRefThree}
                          alt=""
                          className={fileThree ? "selectedImage" : ""}
                        />
                        <div className="ImageSelector">
                          <label htmlFor="fileThree">
                            {" "}
                            <CameraAltIcon className="iconImage" />{" "}
                          </label>
                          <input
                            type="file"
                            name="fileThree"
                            id="fileThree"
                            accept="image/*"
                            onChange={(event) =>
                              handleFileChange(
                                event,
                                setFileThree,
                                imagePreviewRefThree
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="images">
                        {" "}
                        <img
                          src=""
                          ref={imagePreviewRefFour}
                          alt=""
                          className={fileFour ? "selectedImage" : ""}
                        />
                        <div className="ImageSelector">
                          <label htmlFor="fileFour">
                            {" "}
                            <CameraAltIcon className="iconImage" />{" "}
                          </label>
                          <input
                            type="file"
                            name="fileFour"
                            id="fileFour"
                            accept="image/*"
                            onChange={(event) =>
                              handleFileChange(
                                event,
                                setFileFour,
                                imagePreviewRefFour
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ProductDetails">
                  {(businessType === "Product" ||
                    service_type === "product") && (
                    <div className="producT">
                      <div className="productEntries">
                        <div className="PEntry">
                          <label>Product name</label>
                          <input
                            name="product_name"
                            value={product_name}
                            onChange={(event) =>
                              handleChange("product_name", event.target.value)
                            }
                          />
                        </div>
                        <div className="PEntry">
                          <label>Select category</label>
                          <select
                            name="categories"
                            value={category}
                            onChange={(event) =>
                              handleChange("category", event.target.value)
                            }
                          >
                            <option value="">Select...</option>
                            {categories.map((val) => (
                              <option key={val.cat_name} value={val.cat_name}>
                                {val.cat_name}
                              </option>
                            ))}
                            <option
                              value="Others"
                              style={{ background: "#0f766e", color: "white" }}
                            >
                              Others
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="productEntries">
                        <div className="PEntry">
                          <label>Select Shop / outlet</label>
                          <select
                            name="Branch"
                            value={Branch}
                            onChange={(event) =>
                              handleChange("Branch", event.target.value)
                            }
                          >
                            <option value="">Select...</option>
                            {Shops.map((shop, index) => (
                              <option key={index} value={shop.name}>
                                {shop.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="PEntry">
                          <label>Description</label>
                          <textarea
                            rows={3}
                            placeholder="Description"
                            name="Description"
                            value={Description}
                            onChange={(event) =>
                              handleChange("Description", event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                        <h1
                          style={{
                            fontWeight: "500",
                            color: "#115e59",
                            textAlign: "center",
                            fontSize: "20px",
                          }}
                        >
                          Let's now register some product sizes
                        </h1>
                        <p
                          style={{
                            fontWeight: "400",
                            color: "grey",
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          The sizes will be listed for your review
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{
                            width: "200px",
                            backgroundColor: "#0f766e",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            outline: "none",
                            borderRadius: "5px",
                          }}
                          onClick={handleOpenAddSizesModal}
                        >
                          Add sizes
                        </button>
                      </div>
                      <div className="TableSizes" style={{ marginTop: "20px" }}>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                          >
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Size name</StyledTableCell>
                                <StyledTableCell align="right">
                                  Size
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Buying price
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Selling price
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Count(Qty)
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sizes.map((size, index) => (
                                <TableRow key={index}>
                                  <TableCell>{size.sizeName}</TableCell>
                                  <TableCell align="right">
                                    {size.size}
                                  </TableCell>
                                  <TableCell align="right">
                                    {size.buyingPrice}
                                  </TableCell>
                                  <TableCell align="right">
                                    {size.sellingPrice}
                                  </TableCell>
                                  <TableCell align="right">
                                    {size.quantity}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>

                      <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                        <h1
                          style={{
                            fontWeight: "500",
                            color: "#115e59",
                            textAlign: "center",
                            fontSize: "20px",
                          }}
                        >
                          Let's now register some product sub sizes
                        </h1>
                        <p
                          style={{
                            fontWeight: "400",
                            color: "grey",
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          The sub sizes will be listed for your review
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          style={{
                            width: "200px",
                            backgroundColor: "#0f766e",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            outline: "none",
                            borderRadius: "5px",
                          }}
                          onClick={handleOpenAddSubSizesModal}
                        >
                          Add sub sizes
                        </button>
                      </div>
                      <div className="TableSizes" style={{ marginTop: "20px" }}>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                          >
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Sub size name</StyledTableCell>
                                <StyledTableCell align="right">
                                  Sub size
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Buying price
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Selling price
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  Quantity
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {subSizes.map((subSize, index) => (
                                <TableRow key={index}>
                                  <TableCell>{subSize.subSizeName}</TableCell>
                                  <TableCell align="right">
                                    {subSize.subSize}
                                  </TableCell>
                                  <TableCell align="right">
                                    {subSize.buyingPrice}
                                  </TableCell>
                                  <TableCell align="right">
                                    {subSize.sellingPrice}
                                  </TableCell>
                                  <TableCell align="right">
                                    {subSize.SubQuantity}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "30px",
                          marginBottom: "70px",
                        }}
                      >
                        <button
                          onClick={handleSubmit}
                          style={{
                            width: "200px",
                            backgroundColor: "#ea580c",
                            color: "white",
                            padding: "10px",
                            border: "none",
                            outline: "none",
                            borderRadius: "5px",
                          }}
                        >
                          Submit details
                        </button>
                      </div>
                    </div>
                  )}
                  {(businessType === "Service" ||
                    service_type === "service") && (
                    <div className="producT">
                      <div className="productEntries">
                        <div className="PEntry">
                          <label>Service name</label>
                          <input
                            name="product_name"
                            value={service_name}
                            onChange={(event) =>
                              handleChange("service_name", event.target.value)
                            }
                          />
                        </div>
                        <div className="PEntry">
                          <label>Category</label>
                          <select
                            name="categories"
                            value={category}
                            onChange={(event) =>
                              handleChange("category", event.target.value)
                            }
                          >
                            <option value="">Select...</option>
                            {categories.map((val) => (
                              <option key={val.cat_name} value={val.cat_name}>
                                {val.cat_name}
                              </option>
                            ))}
                            <option
                              value="Others"
                              style={{ background: "#0f766e", color: "white" }}
                            >
                              Others
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="productEntries">
                        <div className="PEntry">
                          <label>Select Shop / outlet</label>
                          <select
                            name="Branch"
                            value={Branch}
                            onChange={(event) =>
                              handleChange("Branch", event.target.value)
                            }
                          >
                            <option value="">Select...</option>
                            {Shops.map((shop, index) => (
                              <option key={index} value={shop.name}>
                                {shop.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="PEntry">
                          <label>Selling Price</label>
                          <input
                            type="number"
                            name="serviceSellingPrice"
                            value={serviceSellingPrice}
                            onChange={(event) =>
                              handleChange(
                                "serviceSellingPrice",
                                event.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="productEntries">
                        <div className="PEntry">
                          <label>Description</label>
                          <textarea
                            rows={3}
                            placeholder="Description"
                            name="Description"
                            value={Description}
                            onChange={(event) =>
                              handleChange("Description", event.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingTop: "25px",
                          paddingBottom:'50px'
                        }}
                      >
                        <button
                          style={{
                            backgroundColor: "#ea580c",
                            padding: "5px 10px",
                            border: "none",
                            outline: "none",
                            color:'white',
                            borderRadius:'5px'
                          }}
                          onClick={handleSubmitService}
                        >
                          Submit service
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
          }}
        >
          <div style={{ marginBottom: "30px", marginTop: "15px" }}>
            <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>
              Register a new category
            </h1>
          </div>
          <input
            placeholder="New Category"
            value={cat_name}
            onChange={(e) => {
              setCat_name(e.target.value);
            }}
            style={{
              width: "300px",
              border: "none",
              borderBottom: "1px solid grey",
              paddingLeft: "5px",
              color: "grey",
              outline: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={SubmitCategory}
              variant="contained"
              color="success"
            >
              Add
            </Button>
          </div>
        </div>
      </Modal>
      <AddSizesModal
        open={openAddSizesModal}
        handleClose={handleCloseAddSizesModal}
        sizes={sizes}
        setSizes={setSizes}
      />
      <AddSubSizesModal
        open={openAddSubSizesModal}
        handleClose={handleCloseAddSubSizesModal}
        subSizes={subSizes}
        setSubSizes={setSubSizes}
        sizes={sizes}
      />
    </div>
  );
};

export default AddProducts;
