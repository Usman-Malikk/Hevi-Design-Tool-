// Imports
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";

import MarqueeText from "../../components/marqueeText/marqueeText.js";
import NavigationBar from "../../components/navigation/navigationBar";
import SwiperBanner from "../../components/swipper/swipper.js";
import ExploreCard from "../../components/Card/exploreCard/exploreCard";
import SampleCard from "../../components/Card/sampleCard/sampleCard";
import Footer from "../../components/footer/footer.js";
import { CardMedia, Grid, Tab, Tabs, Typography } from "@mui/material";

// Imports Swiper
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules

import { Autoplay, Navigation } from "swiper";
import { CategoriesServices } from "app/apis/Categories/CategoriesServices.js";
import {
  ErrorToaster,
  SuccessToaster,
} from "app/components/Toaster/toaster.js";
import Loader from "app/assets/Loader.js";

function Home() {
  const [Categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productByCategory, setProductByCategory] = useState([]);
  // Sample Swiper Dummy Data
  let Data = [
    {
      id: 1,
      product_name: "abc",
      Description: "sajdjbn",
      qty: 100,
      price: 1212,
    },
  ];

  // getcategories---------->
  const getCategories = async () => {
    setLoading(true);
    try {
      let result = await CategoriesServices.getCategories();
      if (result.responseCode === 200) {
        console.log(
          "🚀 ~ file: home.js:57 ~ getCategories ~ result.data",
          result.data
        );
        setCategories(result.data);
        getProductsById(result.data[0].id);
      } else {
        ErrorToaster("Oops and Error Occue");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setLoading(false);
    }
  };

  // Get Prducts by iD------>
  const getProductsById = async (ID) => {
    setProductsLoading(true);
    try {
      let result = await CategoriesServices.getProductByCategoryID(ID);
      if (result.responseCode === 200) {
        // console.log("🚀 ~ file: home.js:91 ~ getProductsById", result.data);
        setProductByCategory(result.data);
      } else {
        ErrorToaster("Oops and Error Occur!");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setProductsLoading(false);
    }
  };

  // Tabs Change
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getCategories();
  }, [URL]);
  return (
    <>
      {/* Navbar -----------------------------------------------------> */}
      <Box
        sx={{
          md: "fi",
          color: { xs: "black" },
          ":hover": { color: "black", background: "white" },
        }}
        width="100%"
      >
        <MarqueeText />
        <NavigationBar />
      </Box>

      {/* Banner of  Pictures -------------------->*/}
      <SwiperBanner />

      {/* Categories Section-------------------------------------------->   */}
      <Box
        conatiner
        sx={{ padding: { lg: "40px", xs: "20px" }, paddingBottom: "0px" }}
      >
        <Box
          sx={{
            mb: {
              xs: "10px",
              md: "30px",
            },
          }}
        >
          <Typography sx={{ fontSize: { md: "30px", xs: "15px" } }}>
            Available Categories
          </Typography>
          <Typography variant="p" sx={{ fontSize: { xs: "12px", md: "20px" } }}>
            Discover our latest collection.
          </Typography>
        </Box>
        {/* Categories Section------>   */}
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Categories Tabs---------------> */}

            <Box display={"flex"} justifyContent="center">
              <Box
                sx={{
                  width: {
                    xs: "250px",
                    md: "900px",
                  },
                  padding: {
                    xs: "5px",
                    md: "10px",
                  },
                  bgcolor: "background.paper",
                  // border: "1px solid lightgray",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                  sx={{
                    ".MuiButtonBase-root": {
                      fontSize: {
                        xs: "10px",
                        md: "20px",
                      },
                      color: "gray,",
                      fontWeight: "600",
                    },
                    ".css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected":
                      {
                        fontWeight: "700",
                        color: "black",
                        fontSize: {
                          xs: "10px",
                          md: "20px",
                        },
                      },
                    fontSize: "20px",
                  }}
                >
                  {Categories.map((Item) => (
                    <Tab
                      label={`${Item.name}`}
                      onClick={() => {
                        getProductsById(Item.id);
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
            </Box>

            {/* Products of category */}
            <Grid container gap="0px" mt={"10px"}>
              {productByCategory.length !== 0 &&
                (productsLoading ? (
                  <Loader />
                ) : (
                  productByCategory.map((Item) => {
                    return (
                      <Grid item xs="12" lg="3">
                        <Box sx={{ padding: "10px" }}>
                          <SampleCard
                            name={Item.product_name}
                            Data={Item}
                            description={Item.description}
                            img={Item.product_image}
                          />
                        </Box>
                      </Grid>
                    );
                  })
                ))}
            </Grid>
          </>
        )}
      </Box>

      {/* marqueee ========> */}
      <Box padding={"10px"}>
        <marquee
          loop="infinite"
          className="marqueeText Marqueetext2"
          scrollamount="7"
        >
          <div className="Marqueeh1">
            <Typography
              className="blackodd"
              variant="h1"
              sx={{ fontSize: { md: "100px", xs: "30px" } }}
            >
              {" "}
              * Feel Authentic
            </Typography>
            <Typography
              className="whiteodd"
              variant="h1"
              sx={{ fontSize: { md: "100px", xs: "30px" } }}
            >
              {" "}
              * Feel Classy
            </Typography>
            <Typography
              className="blackodd"
              variant="h1"
              sx={{ fontSize: { md: "100px", xs: "30px" } }}
            >
              {" "}
              * Feel Authentic
            </Typography>
            <Typography
              className="whiteodd"
              variant="h1"
              sx={{ fontSize: { md: "100px", xs: "30px" } }}
            >
              {" "}
              * Feel Classy
            </Typography>
            <Typography
              className="blackodd"
              variant="h1"
              sx={{ fontSize: { md: "100px", xs: "30px" } }}
            >
              {" "}
              * Feel Authentic
            </Typography>
            <Typography
              className="whiteodd"
              variant="h1"
              sx={{ fontSize: { md: "100px", xs: "30px" } }}
            >
              {" "}
              * Feel Classy
            </Typography>
          </div>
        </marquee>
      </Box>

      {/* Exploreeeeeeeeeeeeeeeeeee Card Images===============================================> */}
      <ExploreCard />

      {/* Image  with Caption---------------------------> */}

      <Box
        width="100%"
        height="70vh"
        position={"relative"}
        marginTop={"50px"}
        sx={{ marginBottom: { xs: "10px", md: "50px" } }}
      >
        <CardMedia
          component="img"
          height="100%"
          image={
            "https://cdn.shopify.com/s/files/1/0624/9329/4741/files/shop-the-look_1920x800_crop_center.jpg?v=1662464598"
          }
          width="100%"
          sx={{
            objectFit: "cover",
            alignSelf: "center",
            justifySelf: "center",
          }}
          alt="green iguana"
        />
        <Box
          position={"absolute"}
          sx={{
            height: "100%",
            width: "100%",
            zIndex: "111111",
            background: "#00000045",
            top: "0px",
          }}
        ></Box>
        <Box
          variant="h2"
          position={"absolute"}
          sx={{
            zIndex: "222222222",
            top: "100px",
            color: "white",
            width: "100%",
            trasnform: "translateX('-50%')",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              gap: "25px",
              fontWeight: "600",
              fontSize: {
                xs: "30px",
                md: "70px",
              },
              display: "flex",
              flexDirection: "column",
            }}
          >
            Some text Here <span> lil description here</span>
          </Typography>
        </Box>
      </Box>

      {/* New In dressed -------------------------------------------------------------------------> */}
      <Box conatiner sx={{ padding: { lg: "40px", xs: "20px" } }}>
        <Box>
          <Typography sx={{ fontSize: { md: "30px", xs: "14px" } }}>
            NEW IN DRESSES & JUMPSUITS
          </Typography>
          <Typography variant="p" sx={{ fontSize: { md: "20px", xs: "12px" } }}>
            Best dresses for the upcoming fall season
          </Typography>
        </Box>

        {/* Swipper New Arrival  */}
        <Swiper
          slidesPerView={5}
          spaceBetween={20}
          navigation={true}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 0,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 1,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 3,
              spaceBetween: 2,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 1,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 2,
            },
            1400: {
              slidesPerView: 5,
              spaceBetween: 2,
            },
          }}
          freeMode={true}
          // autoplay={{
          //   delay: 1000,
          //   disableOnInteraction: false,
          // }}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {Data.map((e) => {
            return (
              <SwiperSlide>
                <Box sx={{ padding: "20px" }}>
                  <SampleCard
                    name={e.product_name}
                    description={e.description}
                    Data={e}
                    img={
                      "http://api-designtool.baitalkhairkitchen.com/storage/product-category/WSXdNbfIBPXOyZ4eT0oyGQGLhAZF2N99GbrB8UBg.png"
                    }
                  />
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      {/* Footer --------------------------------------------------------------------------------->  */}
      <Footer />
    </>
  );
}

export default Home;
