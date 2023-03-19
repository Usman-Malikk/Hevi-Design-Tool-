import { Box } from "@mui/material";
import { PropagateLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function Loader() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%",marginTop:"0px" }}>
      <PropagateLoader
        color={"#000000"}
        loading={true}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Box>
  );
}

export default Loader;
