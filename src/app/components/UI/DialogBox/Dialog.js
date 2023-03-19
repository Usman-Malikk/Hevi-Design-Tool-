import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box } from "@mui/material";
import Rating from "@mui/material/Rating";
import ImageListUI from "../ImageGallery/Imagegallery";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// Custom Rating
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {

  let { open, close, Data } = props;

  return (
    <div>
      <BootstrapDialog
        fullWidth
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={close}
          sx={{ background: "black", color: "white" }}
          display="flex"
          alignItems="center"
          gap="5px"
        >
          <VisibilityIcon sx={{ color: "white" }} /> Quick View
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box display={"flex"} flexDirection="column" gap="20px">
            <Box
              display={"flex"}
              gap="10px"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Typography variant="h6">Product Name:</Typography>
              <Typography variant="p">{Data.product_name}</Typography>
            </Box>
            <Box
              display={"flex"}
              gap="10px"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Typography variant="h6">Product Price:</Typography>
              <Typography variant="p">{Data.price}$</Typography>
            </Box>

            <Box
              display={"flex"}
              gap="10px"
              alignItems={"center"}
              justifyContent="space-between"
              flexDirection={"column"}
            >
              <Typography variant="h4" fontWeight={"700"} sx={{ mb: "20px" }}>
                Product Images
              </Typography>

              <ImageListUI Data={Data} />
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
