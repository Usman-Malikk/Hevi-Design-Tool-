import { Button, colors, Grid, Typography } from "@mui/material";
import React from "react";
// MUI Icons

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Footer() {
  return (
    <Grid
      container
      display={"flex"}
      gap={"10px"}
      alignItems="center"
      sx={{ backgroundColor: "black", padding: 
      {
        xs:"20px",md:"50px"
      }, color: "white" }}
    >
      <Grid item md="5" xs="12">
        <Grid container gap="30px">
          <Grid item xs="12">
            <Typography
              variant="h3"
              sx={{ fontFamily: "Abril Fatface, cursive" }}
              className="HeaderLogo"
            >
              Logo
            </Typography>
          </Grid>
          <Grid item xs="12" display={"flex"} gap="20px">
            <li>
              <FacebookIcon />
            </li>
            <li>
              <TwitterIcon />
            </li>
            <li>
              <InstagramIcon />
            </li>
            <li>
              <MusicNoteIcon />
            </li>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md="5">
        <Grid container>
          <Grid container gap="30px">
            <Grid item xs="12">
              <Typography variant="h5" sx={{fontSize:
              {
                xs:"18px",md:"25px"
              }}}>
              <LocationOnIcon/> 8212 E. Glen Creek Street Orchard Park, NY 14127, United States
                of America
              </Typography>
            </Grid>
            <Grid item xs="12">
              <Typography
                variant="p"
                sx={{
                  transition: "2s ease-in-out",
                  cursor: "pointer",
                  ":hover": { textDecoration: "underline" },
                }}
              >
                Show on Google Maps
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md="12" sx={{marginBottom:{xs:"20px",md:"0px"}}}>
        <Grid container gap="0px" marginTop={"40px"} >
          <Grid item md="3" marginBottom={"40px"}>
            <Grid container gap={"20px"}>
                <Grid item xs="12">
                    <Typography variant="h5"><b>Company</b></Typography>
                </Grid>
                <Grid item xs="12" sx={{display:"flex",flexDirection:"column" ,gap:"5px"}}>

                
            <li>
              Our Story
            </li>
            <li>
              Careers
            </li>
            <li>
              Path
            </li>
            <li>
              Influencers
            </li>
            <li>
              Find a store
            </li>
            </Grid>
            </Grid>
          </Grid>

          <Grid item md="3">
          <Grid container gap={"20px"} sx={{display:{xs:"none",md:'block'}}} >
                <Grid item xs="12" >
                    <Typography variant="h5"><b>Company</b></Typography>
                </Grid>
                <Grid item xs="12" sx={{display:"flex",flexDirection:"column" ,gap:"5px"}}>

                <li>
              Our Story
            </li>
            <li>
              Careers
            </li>
            <li>
              Path
            </li>
            <li>
              Influencers
            </li>
            <li>
              Find a store
            </li>
            </Grid>
            </Grid>
          </Grid>

          <Grid item md="3">
          <Grid container gap={"20px"} sx={{display:{xs:"none",md:'block'}}}>
                <Grid item xs="12">
                    <Typography variant="h5"><b>Company</b></Typography>
                </Grid>
                <Grid item xs="12" sx={{display:"flex",flexDirection:"column" ,gap:"5px"}}>

                
                <li>
              Our Story
            </li>
            <li>
              Careers
            </li>
            <li>
              Path
            </li>
            <li>
              Influencers
            </li>
            <li>
              Find a store
            </li>
            </Grid>
            </Grid>
          </Grid>
          <Grid item md="3">
          <Grid container gap={"20px"}>
                <Grid item xs="12">
                    <Typography variant="h5"><b>NEWSLETTER</b></Typography>
                </Grid>
                <Grid item xs="12" sx={{display:"flex",flexDirection:"column" ,gap:"20px"}}>

                
            <li>
            Sign up for our newsletter and receive 10% off your first order!
            </li>
                
                    <Button variant="outlined" sx={{color:"white",border:"1px solid white",outline  :"none",borderRadius:"0px",":hover":{background:"white",color:"black",fontWeight:"900",border:"none"}}}  width="100%" alignItems="start">Email</Button>
                
            </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Footer;
