import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { useRef } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MarqueeText from "app/components/marqueeText/marqueeText";
import NavigationBar from "app/components/navigation/navigationBar";
import Footer from "../../../components/footer/footer.js";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { Services } from "app/apis/Auth/AuthServices";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../../../context/useContext/useContext";
import {
  ErrorToaster,
  SuccessToaster,
} from "app/components/Toaster/toaster.js";
import { emailRegex } from "app/utils/index.js";

const theme = createTheme();

export default function ForgetPassword() {
  let { signIn } = useAuth();
  let [Loading, setLoading] = useState();
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  const UpdatePassword = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      let result = await Services.updatePassword(data);
      if (result.responseCode === 200) {
        SuccessToaster("Password Updated");
        navigate("/login");
      } else {
        ErrorToaster("Oops! no user found");
      }
    } catch (error) {
      ErrorToaster(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <MarqueeText />
        <NavigationBar />
      </Box>
      <ThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          sx={{
            height: "100%",
            padding: { md: "50px", xs: "0px" },
            boxShadow: "none",
            justifyContent: "center",
          }}
        >
          <CssBaseline />

          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{ boxShadow: "none" }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "black" }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Change Password
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(UpdatePassword)}
                sx={{ mt: 1 }}
              >
                {/* Email ===========> */}
                <TextField
                  margin="normal"
                  required
                  error={errors?.email?.message}
                  helperText={errors?.email?.message}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  {...register("email", {
                    required: "This field cant be empty",
                    pattern: {
                      value: emailRegex,
                      message: "Please Enter Valid Email ",
                    },
                  })}
                />
                {/* Password  */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  error={errors?.password?.message}
                  helperText={errors?.password?.message}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  sx={{ background: "white" }}
                  {...register("password", {
                    required: "Thsi field cant be empty",
                  })}
                />
                {/* Confirm Password  */}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  error={errors?.confirm_password?.message}
                  helperText={errors?.confirm_password?.message}
                  name="confirm_password"
                  label="confirm password"
                  type="confirm_password"
                  id="confirm_password"
                  autoComplete="current-password"
                  sx={{ background: "white" }}
                  {...register("confirm_password", {
                    required: "Thsi field cant be empty",
                    validate: (value) =>
                      value === password.current ||
                      "Confirm password does not match",
                  })}
                />
                {/* Submit Button */}
                <LoadingButton
                  loading={Loading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    background: "black",
                    borderRadius: "0px",
                    ":hover": {
                      background: "white",
                      color: "black",
                      boxShadow:
                        " rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;",
                    },
                  }}
                >
                  Change Password
                </LoadingButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      <Footer />
    </>
  );
}
