import React, { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Divider,
  Grid,
  Typography,
  FormControl,
  TextField,
  Box,
  Button,
  CardMedia,
  Tooltip,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import UserDraft from "../UserDraft/UserDraft";
import NavigationBar from "app/components/navigation/navigationBar";
import MarqueeText from "app/components/marqueeText/marqueeText";
import Footer from "app/components/footer/footer";
import { display } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// ICons
import EditNotificationsIcon from "@mui/icons-material/EditNotifications";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import TimelineIcon from "@mui/icons-material/Timeline";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect } from "react";
import { ProfileServices } from "app/apis/Profile/profile.Services";
import DeleteIcon from "@mui/icons-material/Delete";
import { ErrorToaster, SuccessToaster } from "app/components/Toaster/toaster";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "app/assets/Loader";
import EditIcon from "@mui/icons-material/Edit";
import { DraftOrderServices } from "app/apis/DraftOrder/DraftOrder.Services";
import { LoadingButton } from "@mui/lab";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  AddCustomiseData,
  AddDesignData,
  AddTextData,
  caluclatePrice,
  removeAll,
} from "app/redux/slices/DesignSlice";
import { removeAllData } from "app/redux/slices/cartDetailSlice";
import { newObjectId } from "app/views/CustomiseProduct/newObjectId";

function Profile() {
  const dispatch = useDispatch();
  const DesignInfo = useSelector((state) => state.DesignReducer?.DesignData);
  const TextData = useSelector((state) => state.DesignReducer?.TextData);
  const customDesign = useSelector(
    (state) => state.DesignReducer?.customiseDesignData
  );

  const TotalPrice = useSelector((state) => state.DesignReducer?.TotalPrice);
  console.log(
    "🚀 ~ file: C_product.js:72 ~ C_product ~ TotalPrice:",
    TotalPrice
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  //
  const navigate = useNavigate();

  // Use States
  const [order, setorder] = useState([]);
  const [DisplayType, setDisplayType] = useState("Orders");
  const [UserProfile, setUserProfile] = useState({});
  const [Loading, setLoading] = useState(false);
  const [ordernumber, setOrdernumber] = useState("");
  const [orderTime, setOrderTime] = useState("");

  const password = useRef({});
  password.current = watch("password", "");

  // Get User Profile
  const getUserProfile = async () => {
    setLoading(true);
    try {
      const result = await ProfileServices.getUserProfileInfo();
      if (result.responseCode === 200) {
        setUserProfile(result.data);
      } else {
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setLoading(false);
    }
  };

  // Get User order
  const getUserOrder = async () => {
    try {
      const result = await ProfileServices.getUserOrder();
      if (result.responseCode === 200) {
        setorder(result.data);
      } else {
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
    }
  };

  // Get user Draft Orders
  const [DraftLoading, setDraftLoading] = useState(false);
  const [DraftData, setDraftData] = useState([]);

  const getDraftOrder = async () => {
    setDraftLoading(true);
    try {
      const result = await DraftOrderServices.getDraftOrders();
      if (result.responseCode === 200) {
        setDraftData(result.data);
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setDraftLoading(false);
    }
  };

  // Handle Show
  const HandleShow = (Type) => {
    if (Type === "Draft") {
      setDisplayType(Type);
    } else {
      setDisplayType(Type);
    }
  };

  // Order Detail
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetaildata, setOrderDetaildata] = useState([]);

  const [OrderInfo, setOrderInfo] = useState();

  // Get Order Details
  const getOrderDetail = async (id, orderNo, orderDate, Data) => {
    setOrderInfo(Data);
    setOrdernumber(orderNo);
    setShowOrderDetail(true);
    setOrderTime(orderDate);
    try {
      setOrderDetailLoading(true);
      const result = await ProfileServices.getOrderDetailInfo(id);
      if (result.responseCode === 200) {
        setOrderDetaildata(result.data);
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const [ButtonLoadingEdit, setButtonLoadingEdit] = useState(false);
  // Delete Draft Order
  const DeleteDraftOrder = async (id) => {
    console.log("🚀 ~ file: Profile.js:171 ~ DeleteDraftOrder ~ id:", id);
    setButtonLoadingEdit(true);
    try {
      const result = await DraftOrderServices.deleteDraftOrder(id);
      if (result.responseCode === 200) {
        SuccessToaster("Design Deleted Successfully");
        getDraftOrder();
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setButtonLoadingEdit(false);
    }
  };

  // Edit Button Draft order
  const EditButton = (DesignData) => {
    dispatch(removeAll());
    console.log(
      "🚀 ~ file: Profile.js:193 ~ EditButton ~ DesignData:",
      DesignData
    );

    //  Set Data
    DesignData.design_details.map((Data) => {
      const uniqueID = newObjectId();
      if (Data.category_name === "HEVI Design") {
        let Design = {
          category_name: Data.category_name,
          category_id: Data.category_id,
          subcategory_id: Data.subcategory_id,
          subcategory_name: Data.subcategory_name,
          uniqueID: uniqueID,
          image: Data.image,
          price: Data.price,
          side: Data.side,
          sku: Data.sku,
          size: Data.size,
          xaxis: Data.left,
          yaxis: Data.top,
          rotate: Data.rotate,
        };
        dispatch(AddDesignData(Design));
      } else if (Data.category_name === "Monograms") {
        let Design = {
          category_name: Data.category_name,
          category_id: Data.category_id,
          subcategory_id: Data.subcategory_id,
          subcategory_name: Data.subcategory_name,
          uniqueID: uniqueID,
          image: Data.image,
          price: Data.price,
          side: Data.side,
          sku: Data.sku,
          size: Data.size,
          xaxis: Data.left,
          yaxis: Data.top,
          rotate: Data.rotate,
          value: Data.value,
          color: Data.color,
        };
        dispatch(AddTextData(Design));
      } else {
        const designInfo = {
          uniqueID: uniqueID,
          sku: Data.sku,
          size: Data.sku,
          id: "",
          category_id: 14,
          category_name: Data.category_name,
          subcategory_id: Data.subcategory_id,
          subcategory_name: Data.subcategory_name,
          image: Data.image,
          price: "",
          height: Data.height,
          width: Data.width,
          side: Data.side,
          xaxis: Data.left,
          yaxis: Data.top,
          rotate: Data.rotate,
        };
        dispatch(AddCustomiseData(designInfo));
      }
    });
    dispatch(caluclatePrice());
    navigate(`/customiseproduct/${DesignData.product_id}`, {
      state: {
        color: DesignData.color,
        size: DesignData.size,
        quantity: DesignData.qty,
        price: DesignData.price,
        type: "update",
        id: DesignData.id,
      },

      state: {
        productId: DesignData.product_id,
        categoryId: DesignData.category_id,
        categoryName: DesignData.category_name,
        productName: DesignData.product_name,
        image: DesignData.product_bannerimage,
        color: DesignData.color,
        size: DesignData.size,
        quantity: DesignData.qty,
        price: DesignData.price,
        type: "new",
        id: "99999999",
      },
    });
  };

  // Handle Back Button
  const HandleBack = () => {
    setOrderDetaildata([]);
    setShowOrderDetail(false);
    setDisplayType("Orders");
  };
  useEffect(() => {
    getUserOrder();
    getDraftOrder();
    getUserProfile();
  }, [URL]);

  return (
    <Box>
      <MarqueeText />
      <NavigationBar />
      <Fragment>
        {Loading ? (
          <Box
            margin="20px"
            mb="40px"
            height="200px"
            display={"flex"}
            alignItems="center"
          >
            <Loader />
          </Box>
        ) : (
          <Grid container padding="20px" display={"flex"} gap="10px">
            {/* User Profile Navbar */}
            <Grid
              item
              xs="12"
              display={"flex"}
              alignItems="center"
              gap="10px"
              sx={{
                background: "#3b3b3b0a",
                boxShadow:
                  " rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                padding: {
                  xs: "10px",
                  md: "20px",
                },
                justifyContent: {
                  xs: "space-between",
                  md: "start",
                },
              }}
            >
              <CardMedia
                component={"img"}
                sx={{
                  height: { xs: "50px", md: "100px" },
                  width: { xs: "50px", md: "100px" },
                  // borderRadius: "20px",
                }}
                image={
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                }
              />
              <Box display={"flex"} flexDirection="column">
                <Typography
                  variant="h5"
                  sx={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "700",
                    gap: {
                      xs: "0px",
                      md: "10px",
                    },

                    fontSize: {
                      xs: "13px",
                      md: "22px",
                    },
                  }}
                >
                  {UserProfile.first_name}{" "}
                  <Box
                    component={Link}
                    to="/edituserprofile"
                    state={{ user: UserProfile }}
                    sx={{ cursor: "pointer", color: "black" }}
                  >
                    <ModeEditIcon sx={{ color: "#e46346" }} />
                  </Box>
                </Typography>
                <Typography
                  variant="p"
                  sx={{
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: {
                      xs: "10px",
                      md: "15px",
                    },
                  }}
                >
                  <EmailIcon
                    sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      },
                    }}
                  />{" "}
                  {UserProfile.email_address}
                </Typography>
                {/* <Typography
                  variant="p"
                  sx={{
                    color: "gray",

                    alignItems: "center",
                    gap: "10px",
                    fontSize: {
                      xs: "10px",
                      md: "15px",
                    },
                    display: {
                      xs: "none",
                      md: "flex",
                    },
                  }}
                >
                  <LocalPhoneIcon />
                  11212221
                </Typography> */}
              </Box>
            </Grid>
            {/* View Order And View Draft Order */}
            <Grid item xs="12">
              {!showOrderDetail ? (
                <Box
                  sx={{
                    padding: "10px",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: {
                      xs: "center",
                      md: "start",
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      HandleShow("Orders");
                    }}
                    sx={{
                      background: DisplayType === "Orders" ? "black" : "",
                      padding: {
                        xs: "5px",
                        md: "10px",
                      },
                      fontSize: {
                        xs: "10px",
                        md: "15px",
                      },
                      cursor: "pointer",

                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: DisplayType === "Orders" ? "white" : "gray",
                      border: "1px solid black",
                      mr: "10px",
                      fontWeight: "700",
                      ":hover": { background: "none", color: "black" },
                    }}
                  >
                    View Order{" "}
                    <RemoveRedEyeIcon
                      sx={{
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    />{" "}
                  </Button>
                  /{" "}
                  <Button
                    onClick={() => {
                      HandleShow("Draft");
                    }}
                    sx={{
                      background: DisplayType === "Draft" ? "black" : "",
                      ml: "10px",
                      padding: {
                        xs: "5px",
                        md: "10px",
                      },
                      fontSize: {
                        xs: "10px",
                        md: "15px",
                      },
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: DisplayType === "Draft" ? "white" : "gray",
                      fontWeight: "700",
                      border: "1px solid gray",
                      ":hover": { background: "none", color: "black" },
                    }}
                  >
                    View Draft Design{" "}
                    <SaveAsIcon
                      sx={{
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    />{" "}
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    padding: "10px",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: {
                      md: "start",
                    },
                  }}
                >
                  <Button
                    onClick={() => {
                      HandleBack();
                    }}
                    sx={{
                      background: DisplayType === "Orders" ? "black" : "",
                      padding: {
                        xs: "5px",
                        md: "10px",
                      },
                      fontSize: {
                        xs: "10px",
                        md: "15px",
                      },
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: DisplayType === "Orders" ? "white" : "gray",
                      border: "1px solid black",
                      mr: "10px",
                      fontWeight: "700",
                      ":hover": { background: "none", color: "black" },
                    }}
                  >
                    <ArrowBackIcon /> Back
                  </Button>{" "}
                  <Typography
                    sx={{
                      color: "gray",
                      fontSize: {
                        xs: "10px",
                        md: "22px",
                      },
                    }}
                  >
                    Detail Info Of Order : #<b>{ordernumber}</b>
                  </Typography>
                </Box>
              )}

              {/* View Orders ----------> */}
              {DisplayType === "Orders" && !showOrderDetail && (
                <Box>
                  <Box sx={{ padding: "10px" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: "17px", md: "23px" } }}
                    >
                      Order History{" "}
                      <TimelineIcon
                        sx={{ fontSize: { xs: "13px", md: "23px" } }}
                      />
                    </Typography>
                    <Typography
                      variant="p"
                      sx={{
                        color: "gray",
                        // display: "flex",
                        gap: "10px",
                        fontSize: { xs: "10px", md: "18px" },
                      }}
                    >
                      In case your order hasn't deliverd, it can take 48 working
                      hours to deliver your product{" "}
                      <AccessTimeIcon
                        sx={{ fontSize: { xs: "13px", md: "18px" } }}
                      />
                    </Typography>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 500 }}
                      size="medium"
                      aria-label="a dense table"
                    >
                      <TableHead sx={{ background: "#3b3b3b0a" }}>
                        <TableRow>
                          {/* <TableCell sx={{ fontSize: "17px" }}>Product</TableCell> */}

                          <TableCell
                            align="left"
                            sx={{ fontSize: { xs: "12px", md: "20px" } }}
                          >
                            Order ID
                          </TableCell>

                          <TableCell
                            align="left"
                            sx={{ fontSize: { xs: "12px", md: "20px" } }}
                          >
                            Order Date
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ fontSize: { xs: "12px", md: "20px" } }}
                          >
                            Total Amount
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontSize: { xs: "12px", md: "20px" } }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order?.map((Data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="left">
                              <Box
                                onClick={() => {
                                  getOrderDetail(
                                    Data.id,
                                    Data.order_no,
                                    Data.order_date,
                                    Data
                                  );
                                }}
                                sx={{
                                  cursor: "pointer",
                                  width: "fit-content",
                                  display: "flex",
                                  padding: "10px",
                                  fontSize: "19px",
                                  transition: "0.1s ease-in-out",
                                  boxShadow:
                                    " rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                                  ":hover": {
                                    boxShadow:
                                      " rgba(0, 0, 0, 0.35) 0px 5px 15px;",
                                  },
                                }}
                              >
                                {Data.order_no}
                              </Box>
                            </TableCell>

                            <TableCell align="left">
                              {Data.order_date}
                            </TableCell>
                            <TableCell align="left">
                              {Data.total_amount}
                            </TableCell>
                            <TableCell align="left">
                              <Box
                                sx={{ display: "flex", justifyContent: "end" }}
                              >
                                <Typography
                                  sx={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    fontWeight: "700",
                                    background:
                                      Data.status === "Pending"
                                        ? "#ffff0014"
                                        : Data.status === "Dispatched"
                                        ? "#8bc34a24"
                                        : "#ff00002e",
                                    color:
                                      Data.status === "Pending"
                                        ? "#f1d800"
                                        : Data.status === "Dispatched"
                                        ? "#66cd32"
                                        : "#cd3232",
                                  }}
                                >
                                  {Data.status}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* View Draft Orders  ----------> */}
              {DisplayType === "Draft" && !showOrderDetail && (
                <Box>
                  <Box sx={{ padding: "10px" }}>
                    <Typography
                      variant="h4"
                      sx={{ fontSize: { xs: "17px", md: "23px" } }}
                    >
                      Draft Orders{" "}
                      <EditNotificationsIcon
                        sx={{ fontSize: { xs: "13px", md: "23px" } }}
                      />
                    </Typography>
                    <Typography
                      variant="p"
                      sx={{
                        display: "flex",
                        color: "gray",
                        gap: "10px",
                        fontSize: { xs: "10px", md: "18px" },
                      }}
                    >
                      Your all customise draft Orders
                      <AccessTimeIcon
                        sx={{ fontSize: { xs: "13px", md: "18px" } }}
                      />
                    </Typography>
                  </Box>

                  {DraftLoading ? (
                    <Box sx={{ margin: "50px 0px" }}>
                      <Loader />
                    </Box>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 500 }}
                        size="medium"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            >
                              Image
                            </TableCell>

                            <TableCell
                              align="left"
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            >
                              Color
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            >
                              Size
                            </TableCell>
                            <TableCell
                              align="left"
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            >
                              Data
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {DraftData.length !== 0 && (
                          <TableBody>
                            {DraftData.map((row) => (
                              <TableRow
                                key={row.name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell scope="row">
                                  <Box sx={{ display: "flex" }}>
                                    <CardMedia
                                      component={"img"}
                                      sx={{
                                        height: "70px",
                                        width: "70px",
                                        objectFit: "contain",
                                      }}
                                      image={row.product_bannerimage}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell align="left">
                                  {row.product_name}
                                </TableCell>
                                <TableCell align="left">{row.color}</TableCell>
                                <TableCell align="left">{row.size}</TableCell>
                                <TableCell align="left">
                                  {row.draftorder_date}
                                </TableCell>
                                <TableCell align="right">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "end",
                                      gap: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box
                                      onClick={() => {
                                        EditButton(row);
                                      }}
                                      sx={{
                                        background: "#8bc34a24",
                                        borderRadius: "10px",
                                        color: "#66cd32",
                                        padding: "10px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <EditIcon />
                                    </Box>
                                    <LoadingButton
                                      loading={ButtonLoadingEdit}
                                      onClick={() => {
                                        DeleteDraftOrder(row.id);
                                      }}
                                      sx={{
                                        background: "#ff00002e",
                                        borderRadius: "10px",
                                        color: "#cd3232",
                                        padding: "10px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <DeleteIcon />
                                    </LoadingButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
              {/* View Order Detail  */}

              {orderDetailLoading ? (
                <Box padding="20px">
                  <Loader />
                </Box>
              ) : (
                orderDetaildata.length !== 0 && (
                  <Box>
                    <Box sx={{ padding: "10px" }}>
                      <Typography
                        variant="h4"
                        sx={{ fontSize: { xs: "17px", md: "23px" } }}
                      >
                        Order Detail Information{" "}
                        <TimelineIcon
                          sx={{ fontSize: { xs: "13px", md: "23px" } }}
                        />
                      </Typography>
                      <Typography
                        variant="p"
                        sx={{
                          color: "gray",
                          display: "flex",
                          gap: "10px",
                          fontSize: { xs: "10px", md: "18px" },
                        }}
                      >
                        Order placed on {orderTime}
                        <AccessTimeIcon
                          sx={{ fontSize: { xs: "13px", md: "18px" } }}
                        />
                      </Typography>
                    </Box>
                    <Grid container gap="10px" justifyContent={"center"}>
                      <Grid
                        item
                        xs="12"
                        md="9"
                        display={"flex"}
                        flexDirection="column"
                      >
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 500 }}
                            size="medium"
                            aria-label="a dense table"
                          >
                            <TableHead sx={{ background: "#3b3b3b0a" }}>
                              <TableRow>
                                {/* <TableCell sx={{ fontSize: "17px" }}>Product</TableCell> */}

                                <TableCell
                                  align="left"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Product
                                </TableCell>

                                <TableCell
                                  align="left"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Sku
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Price
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Color
                                </TableCell>
                                <TableCell
                                  align="left"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Size
                                </TableCell>

                                <TableCell
                                  align="left"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Quantity
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontSize: { xs: "12px", md: "20px" } }}
                                >
                                  Total
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orderDetaildata?.map((Data, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="left">
                                    <Box
                                      sx={{
                                        width: "fit-content",
                                        display: "flex",
                                        padding: "10px",
                                        fontSize: "19px",
                                        transition: "0.1s ease-in-out",
                                        boxShadow:
                                          " rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                                      }}
                                    >
                                      <CardMedia
                                        component={"img"}
                                        sx={{
                                          height: {
                                            md: "100px",
                                            xs: "70px",
                                          },
                                          width: "100px",
                                          objectFit: "contain",
                                        }}
                                        image={Data?.product_bannerimage}
                                      />
                                    </Box>
                                  </TableCell>

                                  <TableCell align="left">
                                    {Data.product_sku}
                                  </TableCell>
                                  <TableCell align="left">
                                    {Data.price}
                                  </TableCell>
                                  <TableCell align="left">
                                    {Data.color}
                                  </TableCell>
                                  <TableCell align="left">
                                    {Data.size}
                                  </TableCell>
                                  <TableCell align="left">
                                    {Data.quantity}
                                  </TableCell>
                                  <TableCell align="right">
                                    {Data.quantity * Data.price}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box
                          component={Paper}
                          sx={{
                            mt: "10px",
                            padding: "10px",
                            borderRadius: "0px !important",
                          }}
                        >
                          {" "}
                          <Box
                            display={"flex"}
                            justifyContent="space-between"
                            sx={{ color: "gray" }}
                          >
                            <Typography variant="h7">Subtotal</Typography>
                            <Typography variant="p">
                              {OrderInfo.total}$
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent="space-between"
                            sx={{
                              color: "gray",
                              mt: "20px",
                              borderTop: "1px solid  lightgray",
                              padding: "10px",
                            }}
                          >
                            <Typography variant="h5" sx={{ color: "#e46346" }}>
                              Total
                            </Typography>
                            <Typography variant="p">
                              {OrderInfo.total}$
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs="2"
                        sx={{
                          display: {
                            md: "flex",
                            xs: "none",
                          },
                        }}
                        flexDirection="column"
                        gap="10px"
                      >
                        {/* Billing Status */}
                        <Box
                          width="100%"
                          display={"flex"}
                          flexDirection="column"
                          sx={{
                            boxShadow:
                              "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                            padding: "10px",
                            mt: "-50px",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              // fontWeight: 600,
                              mb: "15px",
                              color: "#e46346",
                              fontFamily: "Abril Fatface,cursive",
                            }}
                          >
                            Billing Address
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: "gray" }}>
                            Payment Status: {OrderInfo.status}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.billing_name}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.billing_address}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.billing_city}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.billing_country}
                          </Typography>
                        </Box>
                        {/* Shipping Status */}
                        <Box
                          width="100%"
                          display={"flex"}
                          flexDirection="column"
                          sx={{
                            boxShadow:
                              "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              mb: "15px",
                              color: "#e46346",
                              fontFamily: "Abril Fatface,cursive",
                            }}
                          >
                            Shipping Address
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: "gray" }}>
                            Delivered Status: {OrderInfo.status}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.shipping_name}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.shipping_address}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.shipping_city}
                          </Typography>
                          <Typography variant="p" sx={{ color: "gray" }}>
                            {OrderInfo.shipping_country}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )
              )}
            </Grid>
          </Grid>
        )}
      </Fragment>
      <Footer />
    </Box>
  );
}

export default Profile;
