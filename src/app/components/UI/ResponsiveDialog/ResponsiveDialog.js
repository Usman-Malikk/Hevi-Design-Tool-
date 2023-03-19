import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function ResponsiveDialog(props) {
  const { open, close } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
const navigate = useNavigate()
  const handleClose = () => {
    close();
  };

  const navigateToShop = ()=>
  {
    navigate('/search')
  }
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{padding:'10px'}}
        
      >
        <DialogTitle id="responsive-dialog-title" sx={{background:"black",color:'white',fontSize:"18px"}}>
        Are you sure you want to change product?
        </DialogTitle>
        <DialogContent sx={{marginTop:"20px"}}>
          <DialogContentText >
          you will loose all your desiging if you agree
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} sx={{color:"black"}}>
            Disagree
          </Button>
          <Button onClick={navigateToShop} sx={{color:"red"}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
