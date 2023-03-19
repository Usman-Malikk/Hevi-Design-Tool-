import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useAuth from "app/context/useContext/useContext";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

//* For Show AddToCart Products in Product List
import { useSelector, useDispatch } from "react-redux";
import {
  removeCartDataItem,
  updateQuantity,
} from "../../redux/slices/cartDetailSlice";
// Icon
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
//*BadgeStyling
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
//
import { useNavigate } from "react-router-dom";
import { ErrorToaster, SuccessToaster } from "../Toaster/toaster";
import { Services } from "app/apis/Auth/AuthServices";

// iCONS

import Logout from "@mui/icons-material/Logout";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

export default function NavigationBar() {
  let navigate = useNavigate();
  // Hamburger Functionalities

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [listItems, setListItems] = React.useState([
    { name: "Login", path: "/login", icon: <LockOpenIcon /> },
    { name: "Shop", path: "/shop", icon: <LocalMallIcon /> },
    { name: "Search", path: "/search", icon: <SavedSearchIcon /> },
    { name: "Faq's", path: "/faqs", icon: <HelpOutlineIcon /> },
    { name: "Cart", path: "/cart", icon: <ShoppingCartIcon /> },
  ]);

  let { user, signout, verifyToken } = useAuth();

  //*BadgeStyling
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  React.useEffect(() => {
    verifyToken();
  }, [URL]);
  React.useEffect(() => {
    if (user) {
      let list = [...listItems];
      let itemIndex = list.findIndex((item) => item.name === "Login");
      list.splice(itemIndex, 1);
      setListItems([
        { name: "Profile", path: "/user-profile", icon: <AccountCircleIcon /> },
        ...list,
      ]);
    }
  }, [user]);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ color: "black" }}>
        {listItems.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(text.path);
              }}
            >
              <ListItemIcon sx={{ color: "black" }}>{text.icon}</ListItemIcon>
              <ListItemText
                primary={text.name}
                sx={{ color: "black", fontWeight: "700" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {user && (
          <Button
            onClick={() => {
              signout();
            }}
            sx={{
              ml: "10px",
              border: "1px solid black",
              color: "black",
              fontWeight: "700",
            }}
          >
            <LogoutIcon />
            Logout
          </Button>
        )}
      </List>
    </Box>
  );

  // User Menu Drop Down

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const Signout = async () => {
    try {
      const result = await Services.logout(user);

      if (result.responseCode === 200) {
        SuccessToaster("User Logout Successfully");
        signout();
      } else {
        ErrorToaster("user doesn't logout");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
    }
  };

  //* User Menu Account Click
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //* View Cart overView
  const [CartView, setCartView] = React.useState(null);
  const openCart = Boolean(CartView);
  const handleClickCart = (event) => {
    setCartView(event.currentTarget);
  };
  const handleCloseCart = () => {
    setCartView(null);
  };

  const dispatch = useDispatch();
  //* For Show AddToCart Products in Product List
  const getCartData = useSelector((state) => state.cartDetailReducer.cartValue);
  //* For Remove Products From Cart List
  const removeCartItem = (id) => {
    dispatch(removeCartDataItem(id));
  };

  //* For Calculate Cart List total
  let totalAmount = 0;
  for (const index in getCartData) {
    const { price, quantity } = getCartData[index];
    totalAmount += price * quantity;
  }

  return (
    <Grid
      container
      mt={"-10px"}
      p={"10px"}
      display="flex"
      alignItems={"center"}
      justifyContent="center"
      maxWidth={false}
      disableGutters
      sx={{
        cursor: "pointer",
        transition: "0.2s ease-in-out",
        gap: { xs: "20px" },
        maxWidth: "2500px",
        display: "flex",
        borderBottom: "1px solid gray",
      }}
      // color={{sm:"black",md:"white"}}
    >
      <Grid
        item
        lg="3"
        xs="12"
        display={"flex"}
        sx={{ justifyContent: { xs: "space-evenly" } }}
      >
        {/* Ham burger Functionality */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
              width: "100%",
              justifyContent: "center",
            },
            gap: "20px",
          }}
        >
          <li
            onClick={() => {
              navigate("/shop");
            }}
          >
            Shop
          </li>

          <li
            onClick={() => {
              navigate("/faqs");
            }}
          >
            F.A.Q
          </li>
        </Box>
      </Grid>
      <Grid
        item
        lg="4"
        xs="12"
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: { md: "center" },
        }}
      >
        <div>
          {["left"].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button
                onClick={toggleDrawer(anchor, true)}
                sx={{ display: { sm: "block", md: "none" } }}
              >
                <MenuIcon sx={{ fontSize: "20px", color: "black" }} />
              </Button>
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <Typography
          className="HeaderLogo"
          sx={{
            fontFamily: " Abril Fatface, cursive",
            fontSize: { md: "40px", xs: "25px" },
            color: "#e46346",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          Ecommerce Store
        </Typography>
      </Grid>
      <Grid
        item
        lg="3"
        xs="1"
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: { xs: "space-evenly", md: "center", lg: "flex-end" },
          display: { md: "flex", xs: "none" },
        }}
      >
        {user === null && (
          <p
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </p>
        )}
        <Typography
          onClick={() => {
            navigate("/search");
          }}
          display={"flex"}
          alignItems="center"
        >
          <SearchIcon />
        </Typography>

        {/* View Cart -------------*/}

        <React.Fragment>
          <Box
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Tooltip title="Cart">
              <IconButton
                onClick={handleClickCart}
                size="small"
                aria-controls={openCart ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openCart ? "true" : undefined}
              >
                <StyledBadge
                  badgeContent={getCartData.length}
                  color="secondary"
                >
                  <ShoppingCartIcon sx={{ color: "black" }} />
                </StyledBadge>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={CartView}
            id="account-menu"
            open={openCart}
            onClose={handleCloseCart}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* CartList Display On Click Cart Icon    */}
            <Box
              sx={{
                padding: "20px",
                maxWidth: "600px",
                maxHeight: "700px",
                overflowY: "scroll",
                minHeight: "400px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  // fontWeight:"700",
                  paddingBottom: "10px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontFamily: " Abril Fatface, cursive",

                  color: "black",
                }}
              >
                Your Cart List <ShoppingBasketIcon sx={{ fontSize: "100%" }} />
              </Typography>
              <Grid
                container
                alignItems="center"
                justifyContent={"center"}
                gap="10px"
              >
                {/* Products here ----->  */}
                <Grid
                  item
                  xs="12"
                  sx={{
                    marginTop: "5px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                  }}
                >
                  {getCartData.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        minWidth: "450px",
                        position: "relative",
                        alignItems: "center",
                      }}
                    >
                      <CardMedia
                        component="img"
                        alt="green iguana"
                        image={item?.productImage}
                        // image="https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p8_596x_crop_center.jpg?v=1661160724"
                        sx={{
                          objectFit: "contain",
                          width: "200px",
                          height: "200px",
                        }}
                      />

                      {/* Cart Content -----------> */}
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                          padding: "30px",
                        }}
                      >
                        <Box
                          onClick={() => removeCartItem(item)}
                          width="100%"
                          display="flex"
                          justifyContent={"end"}
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                          }}
                        >
                          <ClearIcon />
                        </Box>
                        <Box display={"flex"} justifyContent="space-between">
                          Product name:
                          <span sx={{ fontWeight: "600" }}>
                            {item.productName}
                          </span>
                        </Box>

                        <Box display={"flex"} justifyContent="space-between">
                          Price per piece:
                          <span style={{ fontWeight: "600" }}>
                            {item.price}$
                          </span>{" "}
                        </Box>
                        {/* Available Colors */}

                        <Box
                          width={"100%"}
                          display="flex"
                          justifyContent={"space-between"}
                          alignItems="start"
                          gap="5px"
                        >
                          <span
                            style={{ fontWeight: "500", marginRight: "8px" }}
                          >
                            Color:
                          </span>{" "}
                          <Box display={"flex"} gap="5px">
                            <span style={{ fontWeight: "600" }}>
                              {item.color}
                            </span>{" "}
                          </Box>
                        </Box>

                        {/* Size */}
                        <Box
                          width={"100%"}
                          display="flex"
                          justifyContent={"space-between"}
                          alignItems="start"
                          gap="5px"
                        >
                          <span
                            style={{ fontWeight: "500", marginRight: "8px" }}
                          >
                            Size:
                          </span>{" "}
                          <Box display={"flex"} gap="5px">
                            <span style={{ fontWeight: "600" }}>
                              {item.size}
                            </span>{" "}
                            {/* <Box
                              sx={{
                                height: "17px",
                                width: "17px",
                                borderRadius: "50%",
                                background: "black",
                              }}
                            ></Box>
                            <Box
                              sx={{
                                height: "17px",
                                width: "17px",
                                borderRadius: "50%",
                                background: "gray",
                              }}
                            ></Box> */}
                          </Box>
                        </Box>
                        {/* Quantity */}

                        <Box
                          width={"100%"}
                          display="flex"
                          justifyContent={"space-between"}
                          alignItems="center"
                          gap="5px"
                        >
                          <span
                            style={{ fontWeight: "500", marginRight: "8px" }}
                          >
                            Quantity:
                          </span>{" "}
                          <Box display={"flex"} alignItems="center" gap="10px">
                            <Box
                              // onClick={() => dispatch(incrementQuantity(item.productId))}
                              sx={{
                                cursor: "pointer",
                                fontWeight: "700",
                                padding: "3px 10px",
                              }}
                            ></Box>
                            {item.quantity}
                            <Box
                              // onClick={() => dispatch(decrementQuantity(item.productId))}
                              sx={{
                                cursor: "pointer",
                                fontWeight: "700",
                                padding: "3px 10px",
                              }}
                            ></Box>
                          </Box>
                        </Box>

                        <Button
                          onClick={() => {
                            navigate(`/product/${item.productId}`);
                          }}
                          sx={{
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "0px",
                            border: "3px solid black",
                            gap: "10px",
                            ":hover": {},
                          }}
                        >
                          View product <VisibilityIcon />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Grid>

                {/* Total Order value */}

                <Box width="100%" padding="20px">
                  <Box display={"flex"} justifyContent="space-between">
                    <Typography variant="h5">Order Value</Typography>
                    <Typography variant="h5">{totalAmount}$</Typography>
                  </Box>
                  <Typography sx={{ color: "gray" }}>
                    Shipping and taxes will be calculated at checkout{" "}
                    <ShoppingCartCheckoutIcon />
                  </Typography>
                </Box>

                {/* extra items */}
                <Box
                  width={"100%"}
                  display="flex"
                  justifyContent={"center"}
                  alignItems="center"
                  gap="20px"
                >
                  <Button
                    onClick={() => {
                      navigate("/cart");
                    }}
                    sx={{
                      background: "black",
                      color: "white",
                      border: "2px solid black",
                      padding: "15px 20px",
                      borderRadius: "0px",
                      ":hover": {
                        background: "white",
                        color: "black",
                        border: "2px solid black",
                      },
                    }}
                  >
                    View Cart
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/checkout");
                    }}
                    sx={{
                      background: "white",
                      color: "black",
                      border: "2px solid black",
                      padding: "15px 20px",
                      borderRadius: "0px",
                      ":hover": {
                        background: "black",
                        color: "white",
                        border: "2px solid black",
                      },
                    }}
                  >
                    Proceed to checkout
                  </Button>
                </Box>
              </Grid>
            </Box>
          </Menu>
        </React.Fragment>

        {/*User Menu Icon --------------------------------------------------------------------------------------------------------->  */}

        {user !== null && (
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <AccountCircleIcon sx={{ color: "black" }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/user-profile");
                }}
              >
                <Avatar /> My Profile
              </MenuItem>
              <Divider />

              <MenuItem
                onClick={() => {
                  Signout();
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  );
}
