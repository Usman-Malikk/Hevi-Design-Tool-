import * as React from 'react';


import { Box } from "@mui/system";
import Footer from "app/components/footer/footer";
import MarqueeText from "app/components/marqueeText/marqueeText";
import NavigationBar from "app/components/navigation/navigationBar";
import { useState } from "react";


import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Grid, Typography } from '@mui/material';




// Accordion
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));






function Faqs() {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  let [change, setChange] = useState("")
  // Fake Data 
  let Data = [
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p17_596x_crop_center.jpg?v=1661172470",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p8-4_596x_crop_center.jpg?v=1662572061",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p5_596x_crop_center.jpg?v=1661159573",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p8-2_596x_crop_center.jpg?v=1661160724",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p19_596x_crop_center.jpg?v=1661173198",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p30_596x_crop_center.jpg?v=1661179185",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p17_596x_crop_center.jpg?v=1661172470",
      rating: 5,
    },
    {
      img: "https://cdn.shopify.com/s/files/1/0624/9329/4741/products/p17_596x_crop_center.jpg?v=1661172470",
      rating: 5,
    },
  ];




  // Accordion Info



  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>
      <Box sx={{ padding: { xs: '10px', md: "30px" }, margin: "10px" }}>
        <Typography sx={{ display: "flex", gap: "10px" }} variant="p">
          {" "}
          <span>Home</span>/<span>Faqs</span>{" "}
        </Typography>

        <Box>
          <Grid
            container
            display="flex"
            justifyContent={"center"}
            // padding="50px"
            sx={{ padding: { md: "50px", xs: "10px" } }}
            gap="50px"
          >
            <Grid item md="4" xs="12" display="flex" flexDirection={"column"} gap="20px">

              <Typography
                variant="h2"
                sx={{ fontFamily: "Archivo Narrow, sans-serif", textAlign: 'center' }}
              >
                F.A.Q's
              </Typography>

              <Typography varaint="p" textAlign="center">Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.</Typography>

            </Grid>
            <Grid item md="12">

              <div>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                  <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ color: 'gray' }}>
                    <Typography variant="h5" sx={{ fontFamily: "Archivo Narrow,sans-serif" }}>Faqs Qustion</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ color: 'gray' }}>
                  <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                    <Typography variant="h5" sx={{ fontFamily: "Archivo Narrow,sans-serif" }}>Faqs Qustion</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ color: 'gray' }}>
                  <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography variant="h5" sx={{ fontFamily: "Archivo Narrow,sans-serif" }}>Faqs Qustion</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
                      sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                      sit amet blandit leo lobortis eget.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>

            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Faqs;
