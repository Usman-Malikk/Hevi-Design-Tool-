import * as React from "react";
import Avatar from "@mui/material/Avatar";
import LoadingButton from "@mui/lab/LoadingButton";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MarqueeText from "app/components/marqueeText/marqueeText";
import NavigationBar from "app/components/navigation/navigationBar";
import Footer from "../../../components/footer/footer.js";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "app/utils/index.js";
import { useRef, useState } from "react";

// React hook form

import { useForm } from "react-hook-form";
import { Services } from "app/apis/Auth/AuthServices";
import {
  ErrorToaster,
  SuccessToaster,
} from "app/components/Toaster/toaster.js";

const theme = createTheme();

export default function SignUp() {
  const [Loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  let navigate = useNavigate();

  const RegisterUser = async (Data) => {
    // Here Data will be submit----------------->
    setLoading(true);
    try {
      let result = await Services.Register(Data);
      if (result.responseCode === 200) {
        SuccessToaster("User has been Created");
        navigate("/login");
      } else {
      }
    } catch (error) {
      console.log("------------> line 48 page Sign up 🦄", error);
      ErrorToaster("Oops Something went wrong");
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
        <Container
          component="main"
          maxWidth="md"
          sx={{ fontFamily: "Archivo Narrow !important, sans-serif " }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: { md: "50px", xs: "0px" },
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "black" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(RegisterUser)}
              noValidate
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    error={errors?.first_name?.message}
                    label="First Name"
                    helperText={errors?.first_name?.message}
                    autoFocus
                    {...register("first_name", {
                      required: "This field name cant be empty",
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    error={errors?.last_name?.message}
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    helperText={errors?.last_name?.message}
                    {...register("last_name", {
                      required: "This field cant be empty",
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    error={errors?.email?.message}
                    id="email"
                    label="Email Address"
                    name="email"
                    helperText={errors?.email?.message}
                    autoComplete="email"
                    {...register("email", {
                      required: "Enter email please*",
                      pattern: {
                        value: emailRegex,
                        message: "Enter valid Email ",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    error={errors?.password?.message}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    helperText={errors?.password?.message}
                    autoComplete="new-password"
                    {...register("password", {
                      required: "This field cant be empty",
                      minLength: {
                        value: 6,
                        message: "Password should be atleast 6 charecters",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    error={errors?.confirm_password?.message}
                    helperText={errors?.confirm_password?.message}
                    name="confirmpassword"
                    label="confirm Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...register("confirm_password", {
                      required: "This field cant be empty",
                      validate: (value) =>
                        value === password.current ||
                        "Confirm password does not match",
                    })}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                type="submit"
                fullWidth
                loading={Loading}
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  background: "black",
                  ":hover": {
                    background: "white",
                    color: "black",
                    boxShadow:
                      " rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;",
                  },
                }}
              >
                Sign Up
              </LoadingButton>
              <Grid container justifyContent="flex-end" mb={"20px"}>
                <Grid item>
                  <Link
                    onClick={() => {
                      navigate("/login");
                    }}
                    sx={{ cursor: "pointer" }}
                    variant="body2"
                  >
                    Already have an account? Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Footer />
    </>
  );
}
