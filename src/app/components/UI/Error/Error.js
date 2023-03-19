import { Typography } from "@mui/material"

export const Error = (props) => {
  return (
    <Typography color="error" sx={{ fontSize: 12, }}>{props.message}</Typography>
  );
}