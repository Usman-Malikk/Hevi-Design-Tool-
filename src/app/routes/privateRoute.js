import EditProfile from "app/views/User/Profile/editUserProfile.js";
import Profile from "app/views/User/Profile/Profile.js";
import Checkout from "../views/Checkout/checkout.js";
import CustomiseProduct from "../views/CustomiseProduct/C_product.js";
export let privateRoute = [
  {
    path: "/checkout",
    component: <Checkout />,
  },
  {
    path: "/customiseproduct/:id",
    component: <CustomiseProduct />,
  },
  {
    path: "/user-profile",
    component: <Profile />,
  },
  {
    path: "/edituserprofile",
    component: <EditProfile />,
  },
];
