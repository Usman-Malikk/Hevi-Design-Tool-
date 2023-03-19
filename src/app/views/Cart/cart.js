import * as React from "react";

import { Box } from "@mui/system";
import Footer from "app/components/footer/footer";
import MarqueeText from "app/components/marqueeText/marqueeText";
import NavigationBar from "app/components/navigation/navigationBar";
import { useState } from "react";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import PublicIcon from "@mui/icons-material/Public";
import {
  Button,
  CardMedia,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { ErrorToaster } from "app/components/Toaster/toaster";
import useAuth from "app/context/useContext/useContext";

//* For Show Cart Items from Redux Store
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  cartData,
  removeCartDataItem,
} from "app/redux/slices/cartDetailSlice";

// Accordion
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function Cart() {
  let { user } = useAuth();

  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  //* For Show Cart Items from Redux Store
  const dispatch = useDispatch();
  const getCartData = useSelector((state) => state.cartDetailReducer.cartValue);

  //* For Handle Items Quantity
  const addQuantity = (id) => {
    let obj = {
      id: id,
    };
    dispatch(incrementQuantity(obj));
  };

  const subtractQuantity = (id) => {
    let obj = {
      id: id,
    };
    dispatch(decrementQuantity(obj));
  };

  //* For Total Amount Calculation
  let totalAmount = 0;
  for (const index in getCartData) {
    const { price, quantity } = getCartData[index];
    totalAmount += price * quantity;
  }

  let [change, setChange] = useState("");

  // Accordion Info
  let navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      ErrorToaster("Login first before checkout!");
      navigate("/login");
    }
  };

  const DeleteItem = (Id) => {
    console.log("🚀 ~ file: cart.js:132 ~ DeleteItem ~ Id:", Id);
    dispatch(removeCartDataItem(Id));
  };
  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>
      <Box sx={{ padding: { xs: "10px", md: "40px" }, margin: "10px" }}>
        <Typography
          sx={{
            display: "flex",
            gap: "10px",
            fontSize: { xs: "12px", md: "15px" },
          }}
          variant="p"
        >
          {" "}
          <span>Home</span>/<span>Checkout</span>{" "}
        </Typography>

        <Box>
          <Grid
            container
            display="flex"
            justifyContent={"center"}
            sx={{ padding: { md: "20px", xs: "10px" } }}
            gap="50px"
          >
            <Grid
              item
              xs="12"
              display="flex"
              flexDirection={"column"}
              gap="20px"
              textAlign={"center"}
              alignItems="center"
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Archivo Narrow, sans-serif",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: { xs: "20px", md: "40px" },
                }}
              >
                Your Cart <ShoppingCartIcon sx={{ fontSize: "50px" }} />
              </Typography>

              <Typography
                variant="h5"
                textAlign="center"
                sx={{ fontSize: { xs: "18px", md: "25px" }, color: "gray" }}
              >
                your happiness is our priority...!
              </Typography>
            </Grid>

            {getCartData.length !== 0 && (
              <Grid
                item
                md="7"
                lg="6"
                sm="12"
                sx={{ overflow: { lg: "hidden", xs: "scroll" } }}
              >
                <TableContainer
                  component={Paper}
                  sx={{
                    boxShadow:
                      "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                  }}
                >
                  <Table sx={{}} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Product</b>
                        </TableCell>
                        <TableCell>
                          <b>Quantity</b>
                        </TableCell>
                        <TableCell>
                          <b>Price</b>{" "}
                        </TableCell>
                        <TableCell>
                          <b>Total</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCartData.map((row) => (
                        <TableRow
                          key={row.productName}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          {/* For Images */}
                          <TableCell>
                            <Box display={"flex"}>
                              <Box
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <CancelIcon
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    DeleteItem(row);
                                  }}
                                />
                              </Box>
                              <CardMedia
                                component="img"
                                image={row?.productImage}
                                sx={{
                                  objectFit: "contain",

                                  height: { xs: "100px" },
                                  width: "100px",
                                }}
                              />
                              <Box display={"flex"} flexDirection="column">
                                <Typography variant="p">
                                  Product:{" "}
                                  <span style={{ fontWeight: "600" }}>
                                    {row.productName}
                                  </span>{" "}
                                </Typography>
                                <Typography variant="p">
                                  Color:{" "}
                                  <span style={{ fontWeight: "600" }}>
                                    {row.color}
                                  </span>
                                </Typography>
                                <Typography variant="p">
                                  Size:{" "}
                                  <span style={{ fontWeight: "600" }}>
                                    {row.size}
                                  </span>
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          {/* For Quantity */}
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                border: "2px solid black",
                                width: "fit-content",
                              }}
                            >
                              <Button
                                onClick={() => subtractQuantity(row.productId)}
                              >
                                -
                              </Button>
                              <Typography>{row.quantity}</Typography>
                              <Button
                                onClick={() => addQuantity(row.productId)}
                              >
                                +
                              </Button>
                            </Box>
                          </TableCell>
                          <TableCell>{row.price}</TableCell>
                          <TableCell>{row.price * row.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            <Grid
              item
              md="3"
              sx={{
                boxShadow:
                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;",
                height: "fit-content",
                padding: "30px",
              }}
            >
              <Box
                width={"100%"}
                display={"flex"}
                flexDirection="column"
                justifyContent={"center"}
                alignItems="center"
                sx={{}}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "14px", md: "25px" },
                    mb: "10px",
                    fontWeight: "700",
                  }}
                >
                  Cart Total Value:
                </Typography>
                <Grid
                  container
                  flexDirection={"column"}
                  sx={{ gap: { xs: "12px", md: "30px" } }}
                >
                  <Grid item sm="12">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "600" }}>
                        Total Bill:
                      </Typography>
                      <Typography sx={{ color: "gray" }}>
                        {totalAmount}$
                      </Typography>
                    </Box>
                    {/* <Box width="100%" padding="20px">
                      <Box display={"flex"} justifyContent="space-between">
                        <Typography variant="h5">Order Value</Typography>
                        <Typography variant="h5">{totalAmount}$</Typography>
                      </Box>
                      <Typography sx={{ color: "gray" }}>
                        Shipping and taxes will be calculated at checkout{" "}
                      </Typography>
                    </Box> */}
                  </Grid>
                  <Grid item xs="12" s>
                    <Box
                      width={"100%"}
                      sx={{ display: { md: "flex", xs: "none" } }}
                      justifyContent="space-between"
                    >
                      <Typography sx={{ fontWeight: "600" }}>
                        Shipping:
                        <LocalShippingIcon />
                      </Typography>
                      <Typography sx={{ color: "gray" }}>
                        Shipping is free globally <PublicIcon />
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Check Out Button */}
                  <Grid item sm="12">
                    <Button
                      variant="outlined"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "#e46346",
                        color: "white",
                        width: "100%",
                        fontSize: { xs: "10px", md: "15px" },
                        padding: "10px 20px",
                        borderRadius: "0px",
                        borderTopLeftRadius: "20px",
                        border: "1px solid #e46346",
                        fontWeight: "700",
                        ":hover": {
                          color: "#e46346",
                          background: "white",
                          border: "1px solid #e46346",
                        },
                      }}
                      onClick={handleCheckout}
                    >
                      proceed to check out
                      <ShoppingCartCheckoutIcon
                        sx={{ display: { xs: "none", md: "block" } }}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Cart;
