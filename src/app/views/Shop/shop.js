import {
  Button,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import SampleCard from "app/components/Card/sampleCard/sampleCard";
import Footer from "app/components/footer/footer";
import MarqueeText from "app/components/marqueeText/marqueeText";
import NavigationBar from "app/components/navigation/navigationBar";
import React, { useEffect, useState } from "react";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { ProductServices } from "app/apis/Products/ProductsServices";
import { ErrorToaster, SuccessToaster } from "app/components/Toaster/toaster";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import Loader from "app/assets/Loader";
import { useSelector, useDispatch } from "react-redux";
import { removeAll } from "app/redux/slices/DesignSlice";

function Search() {
  const dispatch = useDispatch();
  let [change, setChange] = useState("");
  const [Loading, setLoading] = useState(false);
  const [ProductData, setProductData] = useState([]);
  const [page, setPage] = React.useState(1);
  const [Count, setCount] = useState(0);

  // Pagination

  const handleChange = (event, value) => {
    setPage(value);
    getAllProducts(value);
  };

  const getAllProducts = async (Page) => {
    setLoading(true);
    try {
      let result = await ProductServices.getAllProducts(Page);
      if (result.responseCode === 200) {
        const P_Count = result.count / 12;

        setCount(Math.ceil(P_Count));
        setProductData(result.data);
      } else {
        ErrorToaster("Oops something went wrong");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      window.scrollTo(0, 0);
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(removeAll());
    getAllProducts(1);
    window.scrollTo(0, 0);
  }, [URL]);
  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>
      <Box
        sx={{
          padding: { md: "30px", xs: "10px" },
          margin: { xs: "5px", md: "10px" },
        }}
      >
        <Typography
          sx={{
            display: "flex",
            gap: "10px",
            fontSize: { xs: "10px", md: "14px" },
          }}
          variant="p"
        >
          {" "}
          <span>Home</span>/<span>Shop</span>{" "}
        </Typography>

        <Box>
          <Grid
            container
            display="flex"
            justifyContent={"center"}
            width="100%"
            sx={{ padding: { md: "20px", xs: "0px", margin: "20px 0px" } }}
            gap="20px"
          >
            <Grid
              item
              xs="12"
              className={{ xs: "", md: "backgroundWithImage" }}
              sx={{ padding: { md: "0px", xs: "0px" }, color: "black" }}
            >
              <Grid container display="flex" justifyContent="center">
                <Grid
                  item
                  md="5"
                  xs="12"
                  display="flex"
                  textAlign={"center"}
                  flexDirection={"column"}
                  gap={{ md: "5px", xs: "10px" }}
                  sx={{
                    "&> .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input":
                      { color: "black" },
                    color: "black",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Archivo Narrow, sans-serif",
                      textAlign: "center",
                      fontSize: { md: "80px", xs: "30px" },
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Shop <ShoppingBagIcon sx={{ fontSize: "100%" }} />
                  </Typography>
                  <Typography
                    variant="p"
                    sx={{ fontSize: { xs: "12px", md: "14px" } }}
                  >
                    Enter some cool eye cathcing description
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* Render data here */}

            <Grid item md="12">
              <Grid container gap="0px">
                {Loading ? (
                  <Loader />
                ) : ProductData.length !== 0 ? (
                  ProductData.map((Product) => (
                    <Grid item md="3" xs="12" padding="">
                      <Box sx={{ padding: "10px" }}>
                        <SampleCard
                          name={Product.product_name}
                          description={Product.description}
                          Data={Product}
                          img={Product.product_image}
                        />
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Typography
                    variant="h3"
                    width={"100%"}
                    textAlign="center"
                    display={"flex"}
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    Oops no data found.... <MoodBadIcon fontSize="100%" />
                  </Typography>
                )}
              </Grid>
            </Grid>
            {ProductData.length !== 0 &&
              (Loading ? (
                <></>
              ) : (
                <Stack spacing={2}>
                  <Pagination
                    count={Count}
                    page={page}
                    size="large"
                    onChange={handleChange}
                  />
                </Stack>
              ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Search;
