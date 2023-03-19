import { LoadingButton } from "@mui/lab";
import {
  Button,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ProductServices } from "app/apis/Products/ProductsServices";
import Loader from "app/assets/Loader";
import SampleCard from "app/components/Card/sampleCard/sampleCard";
import Footer from "app/components/footer/footer";
import MarqueeText from "app/components/marqueeText/marqueeText";
import NavigationBar from "app/components/navigation/navigationBar";
import { ErrorToaster, SuccessToaster } from "app/components/Toaster/toaster";

import SearchOffIcon from "@mui/icons-material/SearchOff";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeAll } from "app/redux/slices/DesignSlice";

function Search() {
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  let [Page, setPage] = useState(1);
  const [change, setChange] = useState("");
  const [show, setshow] = useState(false);
  const [SearchData, setSearchData] = useState([]);
  const [Count, setCount] = useState(0);
  const [searchCount, setsearchCount] = useState(0);
  const [ShowError, setShowError] = useState(false);
  // Fake Data
  const getFilteredProduct = async (data, value) => {
    setShowError(false);
    setshow(false);
    setLoading(true);
    try {
      let SearchData = data.search;
      setChange(data.search);
      let result = await ProductServices.getFilteredProduct(
        searchChange,
        value
      );
      if (result.responseCode === 200) {
        if (result.productCount !== 0) {
          setSearchData(result.data);
          const countData = result.productCount / 10;
          setsearchCount(result.productCount);
          setCount(Math.ceil(countData));
        } else {
          setShowError(true);
          setSearchData([]);
        }
      } else {
        ErrorToaster("Oops somthing went wrong");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setLoading(false);
      setshow(true);
    }
  };

  const handleChange = (event, value) => {
    console.log("valuee", value);
    setPage(value);
    getFilteredProduct(SearchData, value);
  };
  const [searchChange, setSearchChange] = useState("");
  const handleSearchChange = (value) => {
    setSearchChange(value);
  };

  useEffect(() => {
    dispatch(removeAll());
  }, [URL]);
  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>
      <Box sx={{ padding: { md: "30px", xs: "10px" }, margin: "10px" }}>
        <Typography
          sx={{
            display: "flex",
            gap: "10px",
            fontSize: { xs: "10px", md: "14px" },
          }}
          variant="p"
        >
          {" "}
          <span>Home</span>/<span>Search</span>{" "}
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
                  flexDirection={"column"}
                  gap={{ md: "20px", xs: "10px" }}
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
                    Search
                  </Typography>

                  {/* Search Box */}
                  <Box
                    display="flex"
                    component={"form"}
                    onSubmit={handleSubmit(getFilteredProduct)}
                  >
                    <TextField
                      fullWidth
                      id="fullWidth"
                      onChange={(event) => {
                        handleSearchChange(event.target.value);
                      }}
                      style={{ color: "white" }}
                      sx={{
                        color: "white",
                        border: "1px solid white",
                        ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input":
                          { color: "black" },
                      }}
                      placeholder="Search for anything"
                      // {...register("search", {
                      //   required: "kindly enter something before search",
                      // })}
                    />
                    <LoadingButton
                      type="submit"
                      sx={{
                        background: "black",
                        color: "white",
                        width: { xs: "100px", md: "200px" },
                        fontSize: { xs: "12px", md: "14px" },
                        ":hover": {
                          color: "black",
                          background: "white",
                          fontWeight: "900",
                          padding: {},
                        },
                      }}
                    >
                      Search
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md="12">
              {show && (
                <Box
                // display={"flex"}
                // flexDirection="column"
                // gap="0px"
                // width={"100%"}
                // alignItems="start"
                >
                  <Typography
                    variant="p"
                    sx={{ fontSize: { xs: "13px", md: "16px" } }}
                  >
                    Search result for: {change}{" "}
                  </Typography>
                  <br></br>
                  <Typography
                    variant="p"
                    sx={{ fontSize: { xs: "13px", md: "16px" } }}
                  >
                    Show result {searchCount > 10 ? 10 : searchCount}/
                    {searchCount}{" "}
                  </Typography>
                </Box>
              )}

              <Grid container gap="0  px">
                {Loading ? (
                  <Loader />
                ) : (
                  SearchData.map((product) => {
                    return (
                      <Grid item md="3" xs="12" padding="">
                        <Box sx={{ padding: "10px" }}>
                          {
                            <SampleCard
                              name={product.product_name}
                              description={product.description}
                              Data={product}
                              img={product.product_image}
                            />
                          }
                        </Box>
                      </Grid>
                    );
                  })
                )}

                {ShowError && (
                  <Box width="100%">
                    <Typography
                      variant="h4"
                      fullWidth
                      textAlign={"center"}
                      sx={{
                        color: "gray",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "center",
                        fontSize: { xs: "14px", md: "20px" },
                      }}
                    >
                      No product found{" "}
                      <SearchOffIcon sx={{ width: "50px", height: "50px" }} />{" "}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            {SearchData.length !== 0 &&
              (Loading ? (
                <></>
              ) : (
                <Stack spacing={2}>
                  <Pagination
                    count={Count}
                    page={Page}
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
