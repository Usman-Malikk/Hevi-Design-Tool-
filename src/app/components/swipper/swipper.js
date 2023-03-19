import React from "react";
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";
import { Box, Button, Typography } from "@mui/material";
import LogoImage from "../../assets/Images/Logo.png";
function Swipper() {
  // Swiper Responisveness

  return (
    <>
      <Swiper
        style={{ height: "80vh" }}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          {" "}
          <Box className="SwiperDiv" sx={{ backgroundImage: LogoImage }}>
            <Typography
              variant="p"
              sx={{
                fontWeight: { xs: "100" },
                letterSpacing: { xs: "10px" },
                color: "white",
              }}
            >
              Express Yourself
            </Typography>
            <Typography
              variant="h1"
              component="h2"
              m={"20px"}
              sx={{
                fontSize: { lg: "120px", xs: "40px" },
                fontWeight: { sm: "900", xs: "800" },
              }}
            >
              Love for style...
            </Typography>
            <Typography
              variant="h7"
              sx={{
                fontSize: { lg: "30px", xs: "15px" },
                letterSpacing: { lg: "10px", xs: "5px" },
              }}
            >
              All the spring 2022 ready to wear clothes
            </Typography>
            <div className="SwipperButtonCont">
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderRadius: "0px",
                  border: "1px solid white ",
                  fontSize: { lg: "25px", sm: "15px" },
                  padding: { lg: "20px", sm: "10px" },
                }}
              >
                Outlined
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "black",
                  background: "white",
                  borderRadius: "0px",
                  border: "1px solid white ",
                  fontSize: { lg: "25px", sm: "15px" },
                  fontWeight: "700",
                  padding: { lg: "20px", sm: "10px" },
                }}
              >
                Outlined
              </Button>
            </div>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Box className="SwiperDiv">
            <Typography
              variant="p"
              sx={{
                fontWeight: { xs: "100" },
                letterSpacing: { xs: "10px" },
                color: "white",
              }}
            >
              Express Yourself
            </Typography>
            <Typography
              variant="h1"
              component="h2"
              m={"20px"}
              sx={{
                fontSize: { lg: "120px", xs: "40px" },
                fontWeight: { sm: "900", xs: "800" },
              }}
            >
              Love for style...
            </Typography>
            <Typography
              variant="h7"
              sx={{
                fontSize: { lg: "30px", xs: "15px" },
                letterSpacing: { lg: "10px", xs: "5px" },
              }}
            >
              All the spring 2022 ready to wear clothes
            </Typography>
            <div className="SwipperButtonCont">
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderRadius: "0px",
                  border: "1px solid white ",
                  fontSize: { lg: "25px", sm: "15px" },
                  padding: { lg: "20px", sm: "10px" },
                }}
              >
                Outlined
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "black",
                  background: "white",
                  borderRadius: "0px",
                  border: "1px solid white ",
                  fontSize: { lg: "25px", sm: "15px" },
                  fontWeight: "700",
                  padding: { lg: "20px", sm: "10px" },
                }}
              >
                Outlined
              </Button>
            </div>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Box className="SwiperDiv">
            <Typography
              variant="p"
              sx={{
                fontWeight: { xs: "100" },
                letterSpacing: { xs: "10px" },
                color: "white",
              }}
            >
              Express Yourself
            </Typography>
            <Typography
              variant="h1"
              component="h2"
              m={"20px"}
              sx={{
                fontSize: { lg: "120px", xs: "40px" },
                fontWeight: { sm: "900", xs: "800" },
              }}
            >
              Love for style...
            </Typography>
            <Typography
              variant="h7"
              sx={{
                fontSize: { lg: "30px", xs: "15px" },
                letterSpacing: { lg: "10px", xs: "5px" },
              }}
            >
              All the spring 2022 ready to wear clothes
            </Typography>
            <div className="SwipperButtonCont">
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderRadius: "0px",
                  border: "1px solid white ",
                  fontSize: { lg: "25px", sm: "15px" },
                  padding: { lg: "20px", sm: "10px" },
                }}
              >
                Outlined
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "black",
                  background: "white",
                  borderRadius: "0px",
                  border: "1px solid white ",
                  fontSize: { lg: "25px", sm: "15px" },
                  fontWeight: "700",
                  padding: { lg: "20px", sm: "10px" },
                }}
              >
                Outlined
              </Button>
            </div>
          </Box>
        </SwiperSlide>
      </Swiper>
      {/* <Box height="100%" width="100%">
        <img src={LogoImage} style={{ height: "100px", width: "100px" }} />
      </Box> */}
    </>
  );
}

export default Swipper;
