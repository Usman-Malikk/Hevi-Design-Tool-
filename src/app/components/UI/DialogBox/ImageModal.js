import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { CardMedia, Slide, Typography } from "@mui/material";
import { Box } from "@mui/system";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageModal(props) {
  const { Image, open, close } = props;
  const [MainImage, setImage] = useState("");
  const HandleImageChange = (Data) => {
    setImage(Data.image);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            color: "white",
            background: "black",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Design overview
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <HighlightOffIcon
              onClick={() => {
                close();
              }}
            />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ marginTop: "20px" }}>
          {Image.colors && (
            <CardMedia
              component="img"
              image={MainImage ? MainImage : Image.colors[0].image}
              alt="Design Image"
              objectFit="contain"
              sx={{ height: "200px", width: "300px", objectFit: "contain" }}
            />
          )}
          <Box>
            <Box>
              <Typography
                variant="h5"
                marginTop={"20px"}
                sx={{ padding: "10px", borderBottom: "1px solid lightgray" }}
              >
                Details
              </Typography>
            </Box>
            <Box
              marginTop={"10px"}
              sx={{
                padding: "10px",
                boxShadow:
                  " rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              }}
            >
              <Typography>Title: {Image?.title}</Typography>
              <Typography>Price: {Image?.price}$</Typography>
              <Typography>Size: {Image?.size}</Typography>
              {Image?.colors && (
                <Box display={"flex"} gap="10px">
                  {" "}
                  Color:
                  {Image?.colors?.map((e) => (
                    <Box
                      onClick={() => {
                        HandleImageChange(e);
                      }}
                      sx={{
                        height: "20px",
                        width: "20px",
                        background: e.color_code,
                        display: "flex",
                        gap: "5px",
                        borderRadius: "50%",
                        boxShadow:
                          "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px",
                        cursor: "pointer",
                      }}
                    ></Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
