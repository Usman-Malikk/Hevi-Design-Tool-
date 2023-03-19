import About from "app/views/About/about";
import Home from "app/views/Home/home";
import ProductInfo from "app/views/ProductInfo/productInfo.js";
import Products from "app/views/Products/products";
import Search from "app/views/Search/search";
import Faqs from "app/views/Faqs/faqs.js";
import Login from "app/views/Session/Login/login.js";
import SignUp from "app/views/Session/Logout/Signup";
import Error from "app/views/Error/error";
import Cart from "app/views/Cart/cart.js";
import Shop from "app/views/Shop/shop.js";
import ForgetPassword from "app/views/Session/ChangePassword/changePassword";
import StripeContainer from "app/components/Stripe/StripeContainer";

export const publicRoute = [
  {
    path: "/",
    component: <Home />,
  },
  {
    path: "/products",
    component: <Products />,
  },
  {
    path: "/about",
    component: <About />,
  },
  {
    path: "/search",
    component: <Search />,
  },

  {
    path: "/faqs",
    component: <Faqs />,
  },
  {
    path: "/shop",
    component: <Shop />,
  },
  {
    path: "/product/:id",
    component: <ProductInfo />,
  },
  {
    path: "/login",
    component: <Login />,
  },
  {
    path: "/signup",
    component: <SignUp />,
  },
  {
    path: "/forgetpassword",
    component: <ForgetPassword />,
  },
  {
    path: "/cart",
    component: <Cart />,
  },
  {
    path: "/stripe",
    component: <StripeContainer />,
  },
  {
    path: "*",
    component: <Error />,
  },
];
