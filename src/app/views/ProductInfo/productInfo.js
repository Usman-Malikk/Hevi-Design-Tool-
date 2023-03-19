import {
  Box,
  Button,
  ButtonBase,
  CardMedia,
  Checkbox,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  ErrorToaster,
  SuccessToaster,
} from "app/components/Toaster/toaster.js";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/footer/footer.js";
import MarqueeText from "../../components/marqueeText/marqueeText.js";
import NavigationBar from "../../components/navigation/navigationBar.js";
import useAuth from "app/context/useContext/useContext.js";
import { ProductServices } from "app/apis/Products/ProductsServices.js";
import Loader from "app/assets/Loader.js";
import { removeAll } from "app/redux/slices/DesignSlice";

//* For Redux
import { useSelector, useDispatch } from "react-redux";
import { cartData } from "../../redux/slices/cartDetailSlice";

function ProductInfo() {
  let { user } = useAuth();
  const { id } = useParams();
  const [ProductID, setProductID] = useState(id);
  const [loading, setLoading] = useState(false);
  const [ProductData, setProductData] = useState({});
  const [SelectColor, setSelectColor] = useState("");
  const [SelectSize, setSelectSize] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [MainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [FilteredData, setFilteredData] = useState([]);
  const [FilterSize, setFilterSize] = useState([]);

  //* For Redux
  const checkCartData = useSelector(
    (state) => state.cartDetailReducer.cartValue
  );
  const dispatch = useDispatch();

  // Navigate-------------------------------------------------------------->
  const navigate = useNavigate();

  const getProductDetail = async (id) => {
    setLoading(true);
    try {
      let result = await ProductServices.getProductDetails(id);
      if (result.responseCode === 200) {
        setProductData(result.data[0]);
        setMainImage(
          result.data[0].product_details[0].product_detail_images[0].image
        );
        let variations = [];
        result.data[0].product_details.forEach((element) => {
          const index = variations.findIndex(
            (e) => e.color_id === element.color_id
          );
          if (index === -1) {
            let fit = [
              {
                fittype_id: element.fittype_id,
                fittype_name: element.fittype_name,
              },
            ];
            let obj = {
              fittype: fit,
              color_id: element.color_id,
              color_name: element.color_name,
              color_code: element.color_code,
            };
            variations.push(obj);
          } else {
            const updateFit = [...variations[index].fittype];
            const fitTypeIndex = updateFit.findIndex(
              (e) => e.fittype_id === element.fittype_id
            );
            if (fitTypeIndex === -1) {
              let obj = {
                fittype_id: element.fittype_id,
                fittype_name: element.fittype_name,
              };
              updateFit.push(obj);
            }
            variations[index].fittype = updateFit;
          }
          setFilteredData(variations);
        });
      } else {
        ErrorToaster("Oops and error occur!");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setLoading(false);
    }
  };

 

  // Checking Auth for CustomiseS
  const Location = useLocation();

  let CustomiseProduct = (id) => {
    if (SelectColor && SelectSize) {
      if (user) {
        navigate(`/customiseproduct/${id}`, {
          state: {
            productId: id,
            categoryId: ProductData.category_id,
            categoryName: ProductData.category_name,
            productName: ProductData.product_name,
            image: MainImage,
            color: SelectColor,
            size: SelectSize,
            quantity: quantity,
            price: ProductData.price,
            type: "new",
            id: "99999999",
          },
        });
      } else {
        ErrorToaster("Login first to customise product");
        navigate("/login");
      }
    } else {
      ErrorToaster("Please Select Size and Color first");
    }
  };

  //* For Click On Add To Cart
  const addToCart = (data, quantity, color, size) => {
    let obj = {
      categoryId: data.category_id,
      categoryName: data.category_name,
      price: data.price,
      productId: data.product_id,
      productImage: data?.product_details[0].product_detail_images[0].image,
      productName: data.product_name,
      quantity: quantity,
      color: color,
      size: size,
    };
    dispatch(cartData(obj));
    SuccessToaster("Product Added Successfully");
  };

  // Handle Main image
  const HandleImageChange = (Image) => {
    setMainImage(Image);
  };

  // Handle Quantity
  const handleQuantity = (quantity) => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }
  };

  // Handle Color
  const setColor = (Colors) => {
    setSelectColor(Colors.color_name);
    setSelectSize("");
    setFilterSize(Colors.fittype);
  };

  const HandleBuyNow = () => {
    if (SelectColor && SelectSize) {
      addToCart(ProductData, quantity, SelectColor, SelectSize);
      navigate("/checkout");
    } else {
      ErrorToaster("First Select Color And Size");
    }
  };
  useEffect(() => {
    dispatch(removeAll());
    window.scrollTo(0, 0);
    getProductDetail(id);
    SuccessToaster("Don't forgot to select Color and size!");
  }, []);
  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>

      {/* Navigation Control---------------->*/}

      <Box sx={{ padding: { md: "20px", xs: "10px" }, margin: "10px" }}>
        <Typography
          sx={{
            display: "flex",
            gap: "10px",
            fontSize: { xs: "10px", md: "14px" },
          }}
          variant="p"
        >
          {" "}
          <span>Home</span>/<span>Product info</span>{" "}
        </Typography>

        {loading ? (
          <Loader />
        ) : (
          <Grid container display="flex" gap="20px">
            {/* Left Side Images  */}
            <Grid item md="6">
              <Grid
                container
                gap="20px"
                display="flex"
                justifyContent={"center"}
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                  padding: "20px",
                }}
              >
                {MainImage ? (
                  <Grid item xs="12">
                    <CardMedia
                      component="img"
                      image={MainImage}
                      alt="green iguana"
                      sx={{
                        objectFit: "contain",
                        height: { xs: "200px", md: "500px" },
                      }}
                    />
                  </Grid>
                ) : (
                  <></>
                )}
                {/* Image=======================> */}
                {ProductData?.product_details?.map((Images) => {
                  return (
                    <Grid item sm="2" xs="3" sx={{ cursor: "pointer" }}>
                      <CardMedia
                        onClick={() => {
                          HandleImageChange(
                            Images.product_detail_images[0].image
                          );
                        }}
                        component="img"
                        height="100px"
                        image={Images.product_detail_images[0].image}
                        width="100%"
                        sx={{
                          objectFit: "contain",
                          alignSelf: "center",
                          justifySelf: "center",
                          boxShadow:
                            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                        }}
                        alt="green iguana"
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Right Side description */}
            <Grid item md="5" sm="12">
              <Grid
                container
                gap="10px"
                flexDirection={"column"}
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
                  padding: "20px",

                  fontWeight: "lighter",
                }}
              >
                <Typography variant="p">SKU NO:{ProductData.sku}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", md: "row" },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: { xs: "16px", md: "25px" } }}
                  >
                    {" "}
                    <b>{ProductData.product_name}</b>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    gap="20px"
                  >
                    <Typography variant="p">
                      {" "}
                      <span
                        style={{
                          fontWeight: "800",
                          marginRight: "5px",
                          fontSize: { xs: "7px" },
                        }}
                      >
                        Price:
                      </span>
                      <span style={{ fontSize: { xs: "10px", md: "20px" } }}>
                        {ProductData.price}/-
                      </span>
                    </Typography>
                    {/* If Quantity is 0 then we gonna show this */}
                    {ProductData.qty === 0 && (
                      <Typography
                        variant="p"
                        sx={{
                          background: "red",
                          padding: "3px",
                          borderRadius: "50%",
                          color: "white",
                        }}
                      >
                        {" "}
                        Sold
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="p" sx={{ fontSize: "14px", md: "20px" }}>
                  {ProductData.description}
                </Typography>
                <Box>
                  {/* Selected colors Here------------> */}
                  {SelectColor && (
                    <Box display="flex" sx={{ marginBottom: "10px" }}>
                      <Typography>
                        <span style={{ fontWeight: "800" }}>Color</span> :{" "}
                        {SelectColor}
                      </Typography>
                    </Box>
                  )}

                  {/* Colors Section here---------> */}
                  {FilteredData.length !== 0 && (
                    <Box display="flex">
                      {FilteredData.map((Colors) => (
                        <Box
                          sx={{
                            border: "1px solid Gray",
                            width: "content-fit",
                            padding: "10px",
                          }}
                        >
                          {/* <Checkbox color={Colors.color_name} /> */}
                          <Box
                            onClick={() => {
                              // setSelectColor(Colors.color_name);
                              setColor(Colors);
                            }}
                            style={{
                              backgroundColor: `${Colors.color_code}`,
                              border: "1px solid black",
                              cursor: "pointer",
                              padding: "10px",
                              borderRadius: "50%",
                            }}
                          ></Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Box>
                  {/* Select Size here -------------> */}
                  {SelectSize && (
                    <Box display="flex" sx={{ marginBottom: "10px" }}>
                      <Typography>
                        <span style={{ fontWeight: "800" }}>Size</span> :{" "}
                        {SelectSize}
                      </Typography>
                    </Box>
                  )}

                  {/* Render Sizes is here */}
                  {FilterSize.length !== 0 && (
                    <Box display="flex">
                      {FilterSize.map((Sizes) => (
                        <Box
                          sx={{
                            border: "1px solid Gray",
                            width: "content-fit",
                          }}
                        >
                          <Box
                            onClick={() => {
                              setSelectSize(Sizes.fittype_name);
                            }}
                            style={{
                              height: "100%",
                              cursor: "pointer",
                              width: "content-fit",
                              borderRadius: "50%",
                              textAlign: "center",
                              padding: "10px",
                            }}
                          >
                            {Sizes.fittype_name}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Quantity Section is here */}

                <Grid
                  container
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Grid
                    item
                    md="2"
                    sm="3"
                    xs="5"
                    sx={{
                      border: "1px solid black",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "content-fit",
                      ".css-17hb1g4-MuiButtonBase-root-MuiButton-root": {
                        minWidth: "30px",
                        padding: "10px",
                      },
                      ".css-n03wqv-MuiButtonBase-root-MuiButton-root": {
                        minWidth: "30px",
                        padding: "10px",
                      },
                    }}
                  >
                    <Button
                      onClick={() => handleQuantity(quantity)}
                      sx={{ color: "black", fontSize: "20px" }}
                    >
                      -
                    </Button>
                    {quantity}
                    <Button
                      onClick={() => {
                        setQuantity(quantity + 1);
                      }}
                      sx={{ color: "black", fontSize: "20px", width: "10px" }}
                    >
                      +
                    </Button>
                  </Grid>

                  <Grid
                    item
                    sm="4"
                    md="7"
                    textAlign={"center"}
                    sx={{
                      border: "1px solid black",
                      background: "black",
                      color: "white",
                      padding: "7px",
                      cursor: "pointer",
                      ":hover": { background: "white", color: "black" },
                    }}
                  >
                    {SelectColor && SelectSize ? (
                      <Button
                        sx={{
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                          fontWeight: "700",
                        }}
                        variant="p"
                        fullWidth
                        onClick={() =>
                          addToCart(
                            ProductData,
                            quantity,
                            SelectColor,
                            SelectSize
                          )
                        }
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        variant="p"
                        sx={{
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                          fontWeight: "700",
                          fontSize: {
                            xs: "10px",
                            md: "15px",
                          },
                        }}
                        onClick={() => {
                          ErrorToaster("Please select size and color");
                        }}
                      >
                        Select Size & Color First
                      </Button>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs="4"
                    md="2"
                    sx={{
                      border: "1px solid black",
                      background: "black",
                      color: "white",
                      padding: { xs: "3px", md: "7px" },
                      display: "flex",
                      justifyContent: "center",
                      ":hover": { background: "white", color: "black" },
                    }}
                  >
                    <Button
                      sx={{
                        color: "white",
                        width: "100%",
                        fontSize: {
                          xs: "10px",
                          md: "15px",
                        },
                        ":hover": { color: "black" },
                      }}
                      onClick={HandleBuyNow}
                    >
                      Buy Now
                    </Button>
                  </Grid>

                  {/* Product Customise Button */}
                  {ProductData.type === "Customizable" && (
                    <Grid
                      item
                      xs="12"
                      className="CustomiseProductImage"
                      onClick={() => {
                        CustomiseProduct(ProductID);
                      }}
                      sx={{
                        padding: "7px 10px",
                        color: "#fcf0e6",
                        letterSpacing: "3px",
                        fontWeight: "800",
                        fontSize: { xs: "10px", md: "20px" },
                        transition: "0.2s ease-in-out",
                        ":hover": {
                          background: "white",
                          color: "#e46346",
                          letterSpacing: "1px",
                          border: "3px solid #fcf0e6",
                        },
                        backgroundImage:
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSoHKQNAgseU2aTf1au3bbkai1-LlxmqraGQ&usqp=CAU",
                      }}
                    >
                      <Typography
                        to=""
                        sx={{
                          cursor: "pointer",
                          textAlign: "center",
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                        variant="p"
                      >
                        Customise your Product
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* Return 
        Policy---------------------> */}
      </Box>
      <Box width="100%" sx={{ background: "#fcf0e6", color: "#e46346" }}>
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          padding={{ xs: "50px", md: "100px" }}
        >
          <Grid
            item
            md="6"
            display={"flex"}
            flexDirection="column"
            gap="20px"
            alignItems={"center"}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h5">
              <b>THE PERFECT FIT OR YOUR MONEY BACK </b>
            </Typography>
            <Typography variant="p">
              We understand that creating your custom size can feel daunting.
              But not to worry, it's actually quite easy and completely
              risk-free. If you're not 100% happy with your fit, we'll remake
              your first shirt from scratch free of charge or give your money
              back.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </>
  );
}

export default ProductInfo;
