import React, { Fragment, useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArchiveIcon from "@mui/icons-material/Archive";
import LockIcon from "@mui/icons-material/Lock";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddressForm from "../../components/checkout/addressForm";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentForm from "../../components/checkout/paymentForm";
import SecurityUpdateGoodIcon from "@mui/icons-material/SecurityUpdateGood";
import Review from "../../components/checkout/review";
import PublicIcon from "@mui/icons-material/Public";
import Logo from "app/assets/Images/Logo.png";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CheckIcon from "@mui/icons-material/Check";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
// Components
import Footer from "../../components/footer/footer.js";
import MarqueeText from "../../components/marqueeText/marqueeText.js";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NavigationBar from "../../components/navigation/navigationBar.js";
import {
  Avatar,
  CardMedia,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Error from "../Error/error";
import { ErrorToaster, SuccessToaster } from "app/components/Toaster/toaster";
import { PunchOrderServices } from "./../../apis/PunchOrder/PunchOrderServices";
import { cartData, removeAllData } from "app/redux/slices/cartDetailSlice";

//* For Redux
import { useSelector, useDispatch } from "react-redux";
import { SwapCalls } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "app/utils";
import { LoadingButton } from "@mui/lab";
import { borderBottom, padding } from "@mui/system";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ProfileServices } from "app/apis/Profile/profile.Services";
import Loader from "app/assets/Loader";
import { removeAll } from "app/redux/slices/DesignSlice";
import StripeContainer from "app/components/Stripe/StripeContainer";
const steps = ["Billing Info", "Shipping Info", "Payment", "Done"];

const theme = createTheme();

export default function Checkout() {
  const TotalPrice = useSelector((state) => state.DesignReducer?.TotalPrice);
  const AllData = useSelector((state) => state.DesignReducer?.AllData);
  const [activeStep, setActiveStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [skipped, setSkipped] = useState(new Set());
  const [sameAddress, setSameAddress] = useState(false);

  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});

  const [paymentStatus, setPaymentStatus] = useState(false);
  const [orderPlaced, setorderPlaced] = useState(true);
  const [PageLoad, setPageLoad] = useState(false);
  const [UserData, setUserData] = useState();

  const navigate = useNavigate();
  //* For Return to Home screen
  const dispatch = useDispatch();
  const navigateHome = () => {
    dispatch(removeAllData());
    navigate("/");
  };
  //* Handle Skip Form
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  //* Handle Next Step---->
  const handleNext = () => {
    if (sameAddress && activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    //   let newSkipped = skipped;
    // setSkipped(newSkipped);
  };

  // Hannlde Previous Step--->
  const handleBack = () => {
    if (sameAddress) {
      setActiveStep(activeStep - 2);
    } else {
      setActiveStep(activeStep - 1);
    }
  };

  //* Handle Checkout Form User Billing Info
  const handleBillingDetail = async (formData) => {
    console.log("paymentContactInfo", formData);
    let obj = {
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      phoneNo: formData.phoneNo,
      address: formData.address,
      country: formData.country,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
    };
    setBillingAddress(obj);
    handleNext();
  };
  //* Handle Checkout Form Shipping Details
  const handleShippingDetail = (shipData) => {
    console.log(
      "🚀 ~ file: checkout.js:145 ~ handleShippingDetail ~ shipData:",
      shipData
    );
    console.log("handleShippingDetail", shipData);
    let obj = {
      firstName: shipData.ship_first_name,
      lastName: shipData.ship_last_name,
      email: shipData.ship_email,
      phoneNo: shipData.ship_phone,
      address: shipData.ship_address,
      country: shipData.ship_country,
      city: shipData.ship_city,
      state: shipData.ship_state,
      postalCode: shipData.ship_postalCode,
    };
    setShippingAddress(obj);
    // setShipTo(formData.ship_first_name + " " + formData.ship_last_name)
    handleNext();
  };

  //* Get CartData Info From Redux
  const cartInfo = useSelector((state) => state.cartDetailReducer?.cartValue);
  const keyId = useSelector((state) => state.cartDetailReducer?.stripe_keyid);
  console.log("🚀 ~ file: checkout.js:163 ~ Checkout ~ keyId:", keyId);

  let totalAmount = 0;
  for (const index in cartInfo) {
    const { price, quantity } = cartInfo[index];
    totalAmount += price * quantity;
  }

  const [loading, setLoading] = useState(false);

  //* Handle Place Order
  const punchOrder = async (billing, shipping, cart) => {
    setLoading(true);
    //* For Amount
    let totalAmount = 0;
    let totalQuantity = 0;
    let designData = [];
    console.log(
      "🚀 ~ file: checkout.js:182 ~ punchOrder ~ designData:",
      designData
    );
    for (const index in cart) {
      const { price, quantity, color, size, productId } = cart[index];
      totalAmount += price * quantity;
      totalQuantity += quantity;
      let cartData = {
        color,
        size,
        price,
        product_id: productId,
        qty: quantity,
        extradetail: AllData.length !== 0 ? JSON.stringify(AllData[0]) : "",
      };
      designData.push(cartData);
    }
    try {
      let shippingCharges = 10;
      let total = shippingCharges + totalAmount;
      let obj = {
        billing_info_fname: billing.firstName,
        billing_info_lname: billing.lastName,
        billing_info_email: billing.email,
        billing_info_phone: billing.phoneNo,
        billing_info_address: billing.address,
        billing_info_country: billing.country,
        billing_info_city: billing.city,
        billing_info_state: billing.state,
        billing_info_postalcode: billing.postalCode,
        shipping_info_fname: sameAddress
          ? billing.firstName
          : shipping.firstName,
        shipping_info_lname: sameAddress ? billing.lastName : shipping.lastName,
        shipping_info_email: sameAddress ? billing.email : shipping.email,
        shipping_info_phone: sameAddress ? billing.phoneNo : shipping.phoneNo,
        shipping_info_address: sameAddress ? billing.address : shipping.address,
        shipping_info_country: sameAddress ? billing.country : shipping.country,
        shipping_info_city: sameAddress ? billing.city : shipping.city,
        shipping_info_state: sameAddress ? billing.state : shipping.state,
        shipping_info_postalcode: sameAddress
          ? billing.state
          : shipping.postalCode,
        designData: JSON.stringify(designData),
        totalQuantity: totalQuantity,
        totalAmount: totalAmount,
        shippingCharges: shippingCharges,
        stripe_keyid: keyId !== "" ? keyId : "",
        total: total,
      };

      const { data } = await PunchOrderServices.punchOrder(obj);
      if (data === null) return;
      SuccessToaster("Order Placed Successfully");
      setorderPlaced(false);
    } catch (error) {
      console.log(error);
      ErrorToaster(error);
    } finally {
      setLoading(false);
      dispatch(removeAllData());
      dispatch(removeAll());
      handleNext();
    }
  };

  // Check Cart Data
  const checkCart = () => {
    if ((cartInfo.length === 0) & (AllData.length === 0)) {
      ErrorToaster("Oops! Your Cart Is Empty");
      navigate("/shop");
    }
  };

  // Radio Select
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // Radio Group Button
  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "size-radio-button-demo",
    inputProps: { "aria-label": item },
  });
  const getUserData = async () => {
    setPageLoad(true);
    try {
      const result = await ProfileServices.getUserProfileInfo();
      if (result.responseCode === 200) {
        setUserData(result.data);
        setValue("first_name", result.data.first_name);
        setValue("email", result.data.email_address);
        setValue("last_name", result.data.last_name);
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setPageLoad(false);
    }
  };
  useEffect(() => {
    getUserData();
    checkCart();
  }, [URL]);

  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>
      {PageLoad ? (
        <Box height="100px" display={"flex"} alignItems="center">
          <Loader />
        </Box>
      ) : (
        <Grid container display="flex" justifyContent={"center"}>
          {/* Left bar  */}
          <Grid
            item
            md="4"
            xs="12"
            sx={{
              ".css-nicjba-MuiContainer-root": { padding: "5px" },
            }}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppBar
                position="absolute"
                color="default"
                elevation={0}
                sx={{
                  position: "relative",
                  // borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
              ></AppBar>
              <Container
                component="main"
                sx={{
                  mb: 4,
                  // ml: "10px",
                  ".css-1caru4a-MuiStepper-root": {
                    paddingBottom: "20px",
                  },
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{ my: { xs: 2, md: 6 }, p: { xs: 2, md: 3 } }}
                >
                  <Typography
                    component="h1"
                    variant="h4"
                    align="center"
                    sx={{ fontSize: { xs: "18px", md: "20px" } }}
                  >
                    Checkout
                  </Typography>
                  <Stepper
                    activeStep={activeStep}
                    sx={{
                      pt: 3,
                      pb: 5,
                      ".css-1hv8oq8-MuiStepLabel-label  ": {
                        fontSize: {
                          xs: "8px",
                          md: "15px",
                        },
                      },
                      ".css-1hv8oq8-MuiStepLabel-label.Mui-active": {
                        color: "#e46346",
                        fontWeight: "700",
                      },
                      ".MuiSvgIcon-root": {
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      },
                    }}
                  >
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel
                          sx={{
                            fontSize: {
                              xs: "2px",
                              md: "15px",
                            },
                          }}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  <Fragment>
                    {/* <Typography component={"form"} onSubmit={handleSubmit(paymentInfo)}> */}
                    {activeStep === 0 && (
                      <FormControl
                        component={"form"}
                        onSubmit={handleSubmit(handleBillingDetail)}
                      >
                        <Grid container spacing={2}>
                          {/* First Name */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="First name"
                                disabled={true}
                                type="text"
                                value={UserData?.first_name}
                                // defaultValue={profileDetails?.first_name}
                                error={errors?.first_name?.message}
                                helperText={errors?.first_name?.message}
                                {...register("first_name", {
                                  required: "Please enter your first name.",
                                })}
                              />
                            </FormControl>
                          </Grid>

                          {/* Last Name */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                disabled={true}
                                variant="outlined"
                                label="Last name"
                                type="text"
                                value={UserData?.last_name}
                                error={errors?.last_name?.message}
                                helperText={errors?.last_name?.message}
                                {...register("last_name", {
                                  required: "Please enter your last name.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Email */}

                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Email"
                                type="text"
                                disabled={true}
                                // defaultValue={profileDetails?.last_name}
                                // InputLabelProps={{
                                //   shrink: profileDetails?.last_name && true,
                                // }}
                                value={UserData?.email_address}
                                // sx={{}}
                                error={errors?.email?.message}
                                helperText={errors?.email?.message}
                                {...register("email", {
                                  required: "Please enter your email.",
                                  pattern: {
                                    value: emailRegex,
                                    message:
                                      "Please enter a valid email address",
                                  },
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Telephone */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Phone Number"
                                type="text"
                                helperText={errors?.phoneNo?.message}
                                // defaultValue={profileDetails?.phoneNo}
                                // InputLabelProps={{
                                //   shrink: profileDetails?.phoneNo && true,
                                // }}
                                error={errors?.phoneNo?.message}
                                {...register("phoneNo", {
                                  required: "Please enter your Phone Number.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Address */}
                          <Grid item xs={12} md={12}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Address"
                                type="text"
                                helperText={errors?.address?.message}
                                // defaultValue={profileDetails?.last_name}
                                // InputLabelProps={{
                                //   shrink: profileDetails?.last_name && true,
                                // }}
                                error={errors?.address?.message}
                                {...register("address", {
                                  required: "Please enter your address.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Country */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Country"
                                type="text"
                                helperText={errors?.country?.message}
                                error={errors?.country?.message}
                                {...register("country", {
                                  required: "Please enter your country.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* City */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="City"
                                type="text"
                                helperText={errors?.city?.message}
                                error={errors?.city?.message}
                                {...register("city", {
                                  required: "Please enter your city.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* State */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="State"
                                type="text"
                                helperText={errors?.state?.message}
                                error={errors?.state?.message && true}
                                {...register("state", {
                                  required: "Please enter your state.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Postal Code */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Postal Code"
                                type="text"
                                helperText={errors?.postalCode?.message}
                                error={errors?.postalCode?.message && true}
                                {...register("postalCode", {
                                  required: "Please enter your postalCode.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <FormGroup
                              sx={{
                                "MuiTypography-root": {
                                  fontSize: { xs: "1px", md: "18px" },
                                },
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={sameAddress}
                                    onClick={() => {
                                      setSameAddress(!sameAddress);
                                    }}
                                  />
                                }
                                label="Shipping Address same as Billing Address?"
                              />
                            </FormGroup>
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            pt: 2,
                          }}
                        >
                          <Button
                            className="ButtonStyle"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            myStyle={{ mr: 1 }}
                          >
                            Back
                          </Button>
                          <Box sx={{ flex: "1 1 auto" }} />
                          <Button type="submit">Next</Button>
                        </Box>
                      </FormControl>
                    )}

                    {/* Active step -------------> s1 */}
                    {activeStep === 1 && (
                      <Box
                        component={"form"}
                        onSubmit={handleSubmit(handleShippingDetail)}
                      >
                        <Grid container spacing={2}>
                          {/* First Name */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="First name"
                                type="text"
                                // defaultValue={profileDetails?.first_name}
                                // InputLabelProps={{
                                //   shrink: profileDetails?.first_name && true,
                                // }}
                                error={errors?.ship_first_name?.message && true}
                                helperText={errors?.ship_first_name?.message}
                                {...register("ship_first_name", {
                                  required: "Please enter your first name.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Last Name */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Last name"
                                type="text"
                                // defaultValue={profileDetails?.last_name}
                                // InputLabelProps={{
                                //   shrink: profileDetails?.last_name && true,
                                // }}
                                error={errors?.ship_last_name?.message && true}
                                helperText={errors?.ship_last_name?.message}
                                {...register("ship_last_name", {
                                  required: "Please enter your last name.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Email */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Email"
                                type="email"
                                error={errors?.ship_email?.message}
                                helperText={errors?.ship_email?.message}
                                {...register("ship_email", {
                                  required: "Please enter your email.",
                                  pattern: {
                                    value: emailRegex,
                                    message: "Please enter a valid email",
                                  },
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Telephone */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Phone"
                                type="text"
                                // defaultValue={profileDetails?.phone}
                                // InputLabelProps={{
                                //   shrink: true,
                                // }}
                                error={errors?.ship_phone?.message && true}
                                helperText={errors?.ship_phone?.message}
                                {...register("ship_phone", {
                                  required: "Please enter your phone.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Address */}
                          <Grid item xs={12} md={12}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Address"
                                type="text"
                                multiline
                                error={errors?.ship_address?.message && true}
                                helperText={errors?.ship_address?.message}
                                {...register("ship_address", {
                                  required:
                                    "Please enter your shipping address.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Country */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Country"
                                type="text"
                                error={errors?.ship_country?.message && true}
                                helperText={errors?.ship_country?.message}
                                {...register("ship_country", {
                                  required: "Please enter your country.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* City */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="City"
                                type="text"
                                error={errors?.ship_city?.message && true}
                                helperText={errors?.ship_city?.message}
                                {...register("ship_city", {
                                  required: "Please enter your city.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* State */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="State"
                                type="text"
                                error={errors?.ship_state?.message && true}
                                helperText={errors?.ship_state?.message}
                                {...register("ship_state", {
                                  required: "Please enter your state.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                          {/* Postal Code */}
                          <Grid item xs={12} md={6}>
                            <FormControl
                              fullWidth
                              variant="outlined"
                              sx={{ my: 1 }}
                            >
                              <TextField
                                variant="outlined"
                                label="Postal Code"
                                type="number"
                                error={errors?.ship_postalCode?.message && true}
                                helperText={errors?.ship_postalCode?.message}
                                {...register("ship_postalCode", {
                                  required: "Please enter your postalCode.",
                                })}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            pt: 2,
                          }}
                        >
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            myStyle={{ mr: 1 }}
                          >
                            Back
                          </Button>
                          <Box sx={{ flex: "1 1 auto" }} />
                          <Button type="submit">Next</Button>
                        </Box>
                      </Box>
                    )}

                    {/* Active step 2------------------------------> */}

                    {activeStep === 2 && (
                      <Box sx={{ py: { xs: 0, md: 1 }, px: { xs: 0 } }}>
                        <Box
                          sx={{
                            // border: "1px solid #8080803b",
                            // padding: "10px",
                            // textAlign: "center",
                            width: "100%",
                            // background: "#80808021",
                            color: "black",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              textAlign: "left",
                              fontSize: {
                                xs: "15px",
                                md: "20px",
                              },
                              fontWeight: "700",
                              // width: "100%",
                            }}
                          >
                            Select Payment Method
                          </Typography>
                          <Typography
                            variant="p"
                            display={"flex"}
                            alignItems="center"
                            sx={{
                              color: "gray",
                              mt: "10px",
                              mb: "10px",
                              textAlign: "left",
                              fontSize: {
                                xs: "12px",
                                md: "20px",
                              },
                              // width: "100%",
                            }}
                          >
                            All transactions are secure and encrypted.{" "}
                            <LockIcon
                              sx={{
                                fontSize: {
                                  xs: "12px",
                                  md: "20px",
                                },
                              }}
                            />
                          </Typography>
                        </Box>

                        <Box marginTop={"10px"}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              border: "1px solid #8080803b",
                              padding: "10px",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                color: "gray",
                              }}
                            >
                              <Radio
                                {...controlProps("COD")}
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 18,
                                  },
                                }}
                              />
                              <Typography
                                sx={{ fontSize: { xs: "12px", md: "20px" } }}
                              >
                                Cash on delievery
                              </Typography>
                            </Box>

                            <ArchiveIcon
                              sx={{ fontSize: { xs: "12px", md: "20px" } }}
                            />
                          </Box>

                          {/* Online Payment Form  */}
                          <Box sx={{ color: "gray" }}>
                            <Box
                              sx={{
                                border: "1px solid #8080803b",
                                padding: {
                                  xs: "5px",
                                  md: "10px",
                                },
                              }}
                            >
                              {/* ALL BOXES -------------------> */}
                              <Box
                                sx={{
                                  display: "flex",
                                  width: "100%",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Box display={"flex"}>
                                  <Radio
                                    {...controlProps("Online Payment")}
                                    sx={{
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 18,
                                      },
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      fontSize: { xs: "12px", md: "20px" },
                                    }}
                                  >
                                    Online Payment Method
                                  </Typography>
                                </Box>
                                <CardMedia
                                  component={"img"}
                                  image={
                                    "data:image/png;base64,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"
                                  }
                                  sx={{
                                    height: "30px",
                                    width: "50px",
                                    objectFit: "contain",
                                  }}
                                />
                              </Box>
                              {selectedValue === "Online Payment" && (
                                <Box color="black" sx={{ mt: "20px" }}>
                                  <StripeContainer
                                    Total={
                                      TotalPrice !== 0
                                        ? totalAmount + TotalPrice
                                        : totalAmount
                                    }
                                    punchOrder={() => {
                                      punchOrder(
                                        billingAddress,
                                        shippingAddress,
                                        cartInfo
                                      );
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>

                        <LoadingButton
                          onClick={() => {
                            punchOrder(
                              billingAddress,
                              shippingAddress,
                              cartInfo
                            );
                          }}
                          loading={loading}
                          fullWidth
                          sx={{
                            background: "black",
                            color: "white",
                            fontWeight: "700",
                            display: {
                              xs: "block",
                              md: "none",
                            },
                            fontSize: {
                              xs: "17px",
                            },
                            // mb: "40px",
                            fontFamily: "Playfair Display, serif",

                            ":hover": {
                              border: "none",
                              color: "#e46346",
                            },
                          }}
                        >
                          Submit Order
                        </LoadingButton>
                        {/* Handle Back Buttin */}
                        <Box>
                          <Button sx={{ mt: "20px" }} onClick={handleBack}>
                            Back
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Final Message After Order */}
                    {activeStep === 3 && (
                      <Grid container display={"flex"} gap="30px">
                        <Grid item xs="12">
                          <Box
                            sx={{
                              width: "100%",

                              display: "flex",
                              alignItems: "center",
                              // justifyContent: "center",
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                width: "50px",
                                objectFit: "contain",
                                borderRadius: "10px",
                              }}
                              image={
                                "data:image/jpeg;base64,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"
                              }
                              alt="green iguana"
                            />
                            <Typography variant="h5" sx={{ color: "gray" }}>
                              Thank You! {billingAddress.firstName}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs="12">
                          <Box
                            sx={{
                              border: "1px solid #80808030",
                              padding: "10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              color: "gray",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography fontWeight={"600"}>
                              Your Order has been placed successfully{" "}
                              <CheckCircleOutlineIcon />
                            </Typography>
                            <Typography>
                              You’ll receive a confirmation email with your
                              order number shortly.
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs="12">
                          <Box
                            sx={{
                              border: "1px solid #80808030",
                              padding: "10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              color: "gray",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography fontWeight={"600"}>
                              Customer information <PermIdentityIcon />
                            </Typography>
                            <Grid
                              container
                              display={"flex"}
                              justifyContent={"space-between"}
                            >
                              {/* Left Side */}
                              <Grid item xs="12" sm="5">
                                <Typography sx={{ color: "black" }}>
                                  Contact Information
                                </Typography>
                                <Typography>{billingAddress.email}</Typography>
                                <Box sx={{ mt: "15px" }}>
                                  <Typography sx={{ color: "black" }}>
                                    Shipping Address
                                  </Typography>
                                  <Typography>
                                    {sameAddress
                                      ? billingAddress?.address
                                      : shippingAddress?.address}
                                  </Typography>
                                </Box>
                              </Grid>
                              {/* Right Side */}
                              <Grid item xs="12" sm="5">
                                <Typography sx={{ color: "black" }}>
                                  Payment Method
                                </Typography>
                                <Typography>
                                  Cash on delievery <MonetizationOnIcon />
                                </Typography>
                                <Box sx={{ mt: "15px" }}>
                                  <Typography sx={{ color: "black" }}>
                                    Billing Address
                                  </Typography>
                                  <Typography>
                                    {billingAddress.address}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs="12"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            onClick={() => {
                              navigate("/faqs");
                            }}
                            sx={{
                              color: "darkgray",
                              cursor: "pointer",
                              fontSize: {
                                xs: "10px",
                                md: "17px",
                              },

                              ":hover": { color: "black" },
                            }}
                          >
                            Need help? contact us{" "}
                          </Typography>
                          <Button
                            onClick={() => {
                              navigate("/");
                            }}
                            sx={{
                              background: "black",
                              color: "white",
                              padding: {
                                xs: "10px",
                                m: "23px",
                              },

                              fontWeight: "700",
                              border: "1px solid black",
                              ":hover": {
                                color: "black",
                                background: "white",
                                border: "1px solid black",
                              },
                            }}
                          >
                            Continue Shopping
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Fragment>
                </Paper>
              </Container>
            </ThemeProvider>
          </Grid>

          {/* Side Details */}
          {activeStep !== 3 && (
            <Grid
              // item
              sx={{
                display: {
                  md: "flex",
                  xs: "none",
                  height: "fit-content",
                },
                width: "530px",
                marginTop: "50px",
                marginBottom: "20px",
                border: "1px solid #8080802e",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  mt: "20px",
                  mb: "20px",
                  // borderBottom: "2px solid #64646412",
                  paddingBottom: "10px",
                }}
              >
                <Typography
                  variant="h4"
                  textAlign={"center"}
                  // sx={{ background: "black" }}
                >
                  {/* Order Details: */}
                </Typography>
                {cartInfo.length !== 0 && (
                  <Box display={"flex"} flexDirection="column" width={"100%"}>
                    {cartInfo.map((Item, index) => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                          borderBottom: "1px solid #8080802b",
                          // background: index % 2 === 0 ? "#80808021" : "",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {/* Image Banner */}
                          <Box
                            sx={{
                              height: "90px",
                              width: "90px",
                              // border: "2px solid #e46346",
                              display: "flex",
                              padding: "10px",
                              alignItems: "center",
                              margin: "10px",
                              justifyContent: "center",
                              borderRadius: "10px",
                              // boxShadow:
                              //   " rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                height: "70px",
                                width: "70px",
                                objectFit: "contain",
                                borderTopRightRadius: "10px",
                              }}
                              image={Item.productImage}
                              title="green iguana"
                            />
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              color: "gray",
                              fontSize: "10px",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "black",
                                fontWeight: "800",
                                fontSize: "18px",
                                fontFamily: "Playfair Display, serif",
                              }}
                            >
                              {Item.productName}
                            </Typography>
                            <Typography sx={{ fontSize: "13px" }}>
                              {Item.color}
                            </Typography>
                            <Typography sx={{ fontSize: "13px" }}>
                              Quantity :{Item.quantity}/-
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="h7"
                          sx={{ fontWeight: "700", paddingRight: "20px" }}
                        >
                          Price:{" "}
                          <span style={{ color: "#e46346" }}>
                            {Item.price}$
                          </span>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Right Side End Point */}
              <Box sx={{ width: "100%" }}>
                {/*text  */}
                <Box width="100%">
                  <Box width="100%" padding="20px">
                    <Box
                      display={"flex"}
                      justifyContent="space-between"
                      mb="20px"
                    >
                      <Typography variant="h5"> Total: </Typography>
                      <Typography variant="h5">
                        {totalAmount}{" "}
                        {TotalPrice !== 0 ? "+ " + TotalPrice + " =" : ""}{" "}
                        {TotalPrice !== 0 && TotalPrice + totalAmount}$
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "gray" }}>
                      We do free Shipping World Wide
                      <PublicIcon />
                    </Typography>
                    <Typography sx={{ color: "gray" }}>
                      it can take 48 working hours to deliver your product
                    </Typography>
                  </Box>
                </Box>
                {activeStep === 2 &&
                  activeStep !== 4 &&
                  (selectedValue !== "Online Payment") &&
                    (selectedValue !== "") &&
                    (
                      <LoadingButton
                        onClick={() => {
                          punchOrder(billingAddress, shippingAddress, cartInfo);
                        }}
                        loading={loading}
                        fullWidth
                        sx={{
                          background: "black",
                          color: "white",
                          fontWeight: "700",
                          fontSize: "20px",
                          // mb: "40px",
                          fontFamily: "Playfair Display, serif",
                          borderTopLeftRadius: "30px",
                          ":hover": {
                            border: "none",
                            color: "#e46346",
                          },
                        }}
                      >
                        Submit Order
                      </LoadingButton>
                    )}
              </Box>
              {/* Submit Button */}
            </Grid>
          )}
        </Grid>
      )}

      <Footer />
    </>
  );
}
