import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// Icon
import MenuIcon from "@mui/icons-material/Menu";
import { Grid } from "@mui/material";

export default function TemporaryDrawer() {
  // Hamburger Functionalities

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Grid
      container
      mt={"-10px"}
      p={"10px"}
      alignItems={"center"}
      maxWidth={false}
      disableGutters
      sx={{
        cursor: "pointer",
        color: "black",
        background:"gray",
        transition: "0.2s ease-in-out",
        ":hover": { backgroundColor: "white", color: "black" },
        gap: { xs: "20px" },
        maxWidth: "2500px",
        display:"flex"
      }}
    >
      <Grid
        item
        lg="3"
        xs="12"
        display={"flex"}
        sx={{ justifyContent: { xs: "space-evenly" } }}
      >
        {/* Ham burger Functionality */}
      
        <Box sx={{ display: { xs: "none", md:"flex" ,width:"100%",justifyContent:"center"  }, gap: "20px" }}>
          <li>Shop</li>
          <li>Journal</li>
          <li>F.A.Q</li>
          <li>Contact</li>
        </Box>
      </Grid>
      <Grid item lg="4" xs="12" sx={{ textAlign: "center",display:"flex",alignItems:"center" ,justifyContent:{md:"center"} }}>
      <div>
          {["left"].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button
                onClick={toggleDrawer(anchor, true)}
                sx={{ display: { sm: "block", md: "none" } }}
              >
                <MenuIcon />
              </Button>
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <h1 className="HeaderLogo">Eccomerce Store</h1>
      </Grid>
      <Grid
        item
        lg="3"
        xs="12"
        sx={{
          display: "flex",
          gap: "20px",
          justifyContent: { xs: "space-evenly", md: "center" ,lg:'flex-end'},
          display: { md: "flex", xs: "none" },
        }}
      >
        <p>Money</p>
        <p>Login</p>

        <SearchIcon />
        <ShoppingCartIcon />
      </Grid>
    </Grid>
  );
}
