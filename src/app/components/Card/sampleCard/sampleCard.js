import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialobox from "../../UI/DialogBox/Dialog.js";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function SampleCard(props) {
  const { description, name, Data } = props;
  let navigate = useNavigate();
  let [openDialog, setOpenDialog] = useState(false);

  // Open Dialog Box
  let openDialogBox = () => {
    setOpenDialog(!openDialog);
  };
  return (
    <Box
      sx={{
        boxShadow: " rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
        cursor: "pointer",
        ":hover": {
          ".show": { transform: "translateY(-50px)" },
        },
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          onClick={() => {
            navigate(`/product/${Data.id}`);
          }}
          image={Data.product_image}
          width="100%"
          height="250px"
          sx={{
            objectFit: "contain",
            alignSelf: "center",
            justifySelf: "center",
            overflow: "hidden",
          }}
          alt="green iguana"
        />
        <Typography
          onClick={openDialogBox}
          position={"absolute"}
          bottom="-50px"
          className="show"
          sx={{
            background: "black",
            color: "white",
            transition: "0.5s ease-in-out",
            width: "100%",
            height: "30px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            display: { xs: "none", md: "flex" },
          }}
        >
          <VisibilityIcon />
          Quick View
        </Typography>
      </Box>
      <CardContent
        marginBottom="30px"
        sx={{
          paddingBottom: "0px !important",
          position: "relative",
          zIndex: "111",
          padding: { xs: "12px 8px", md: "20px" },
          marginBottom: "10px",
        }}
      >
        <Typography
          textAlign={"start"}
          gutterBottom
          variant="h7"
          component="div"
          sx={{ fontSize: { xs: "14px" } }}
        >
          {name}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '12px', md: '18px' }, }}>
          {description}
        </Typography> */}
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={"column"}
          gap="10px"
          mb="30px"
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: "12px", md: "18px" },
              marginBottom: { xs: "20px", md: "0px" },
            }}
          >
            Price <b> {`${Data.price}$`}</b>
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              navigate(`/product/${Data.id}`);
            }}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "5px",
              color: "white",
              width: "content-fit",
              marginBottom: "20px",
              border: "1px solid black",
              padding: { xs: "5px", md: "5px 10px" },
              background: "black",
              ":hover": {
                background: "white",
                color: "black",
                border: "1px solid black",
              },
            }}
          >
            <RemoveRedEyeIcon /> View Product
          </Button>
        </Box>
      </CardContent>

      <Dialobox open={openDialog} close={openDialogBox} Data={Data} />
    </Box>
  );
}

export default SampleCard;
