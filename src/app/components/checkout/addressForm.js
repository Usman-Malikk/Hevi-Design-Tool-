import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useForm } from 'react-hook-form';

export default function AddressForm() {

  //* Handle Checkout Form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const submitAddress = (formData) => {
    console.log(formData)
  }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Typography component="form" onSubmit={handleSubmit(submitAddress)}>
        <Grid container spacing={3} >
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              autoComplete="family-name"
              variant="standard"
              error={errors?.name?.message}
              {...register("name", {
                required: "Name is required",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="family-name"
              variant="standard"
              error={errors?.lastName?.message}
              {...register("lastName", {
                // required: "product name is required",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              autoComplete="abc@gmail.com"
              variant="standard"
              error={errors?.email?.message}
              {...register("email", {
                required: "Email address is required",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="phoneNo"
              name="phoneNo"
              label="Phone Number"
              fullWidth
              autoComplete="123456"
              variant="standard"
              error={errors?.phoneNo?.message}
              {...register("phoneNo", {
                required: "Phone Number is required",
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="address"
              name="address"
              label="Address"
              fullWidth
              autoComplete="shipping address"
              variant="standard"
              error={errors?.address?.message}
              {...register("address", {
                required: "Address is required",
              })}
            />
          </Grid>
          {/* <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid> */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              fullWidth
              autoComplete="shipping address-level2"
              variant="standard"
              error={errors?.address?.message}
              {...register("city", {
                required: "City is required",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="state"
              label="State/Province/Region"
              fullWidth
              variant="standard"
              error={errors?.address?.message}
              {...register("state", {
                required: "State is required",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zip"
              name="zip"
              label="Zip / Postal code"
              fullWidth
              autoComplete="shipping postal-code"
              variant="standard"
              error={errors?.address?.message}
              {...register("zip", {
                required: "Postal code is required",
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="Country"
              fullWidth
              autoComplete="shipping country"
              variant="standard"
              error={errors?.country?.message}
              {...register("country", {
                required: "Country is required",
              })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
              label="Use this address for payment details"
            />
          </Grid>
        </Grid>
      </Typography>
    </React.Fragment>
  );
}