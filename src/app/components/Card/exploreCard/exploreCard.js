import { Button, CardMedia, Grid, Typography } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { Box } from "@mui/system";
import React from "react";

function ExploreCard() {
  return (
    <Grid container gap="20px" padding={"0px"} justifyContent={"center"}>
       <Grid item md="5">
      <Box position={"relative"}>
          <CardMedia
            component="img"
            height="100%"
            image={
              "https://cdn.shopify.com/s/files/1/0624/9329/4741/files/gallery01_750x_crop_center.jpg?v=1661431699"
            }
            
            width="100%"
            sx={{
              objectFit: "contain",
              alignSelf: "center",
              justifySelf: "center",
              background:"black"
            }}
            alt="green iguana"
          />
          <Box position={"absolute" } sx={{height:"100%",width:"100%" ,zIndex:"111111",background:"#00000045",top:"0px"}}></Box>
        <Box variant="h2" position={"absolute" } sx={{zIndex:"222222222",bottom:{md:"100px",xs:"0px"},color:"white"}} >

            <Box sx={{padding:"50px" ,display:"flex",flexDirection:"column"} } gap="10px">
                <Typography variant="h3" sx={{fontWeight:"600"}}>Some text Here</Typography>
                <Typography variant="p">Lil description here</Typography>
                <Button sx={{background:"black",width:"fit-content",color:"white"}}>Explore More</Button>
            </Box>
        </Box>
        </Box>
    
        
      </Grid>
      <Grid item md="5">
      <Box position={"relative"}>
          <CardMedia
            component="img"
            height="100%"
            image={
              "https://cdn.shopify.com/s/files/1/0624/9329/4741/files/gallery02_750x_crop_center.jpg?v=1661431699"
            }
            
            width="100%"
            sx={{
              objectFit: "contain",
              alignSelf: "center",
              justifySelf: "center",
              background:"black"
            }}
            alt="green iguana"
          />
          <Box position={"absolute" } sx={{height:"100%",width:"100%" ,zIndex:"111111",background:"#00000045",top:"0px"}}></Box>
        <Box variant="h2" position={"absolute" } sx={{zIndex:"222222222",bottom:{md:"100px",xs:"0px"},color:"white"}} >

            <Box sx={{padding:"50px" ,display:"flex",flexDirection:"column"}  } gap="10px">
                <Typography variant="h3" sx={{fontWeight:"600",fontSize:{md:"50px",sm:"10px"}}}>Some text Here</Typography>
                <Typography variant="p"> Lil description here</Typography>
                <Button sx={{background:"black",width:"fit-content",color:"white"}}>Explore More</Button>
            </Box>
        </Box>
        </Box>
    
        
      </Grid>
    </Grid>
  );
}

export default ExploreCard;
