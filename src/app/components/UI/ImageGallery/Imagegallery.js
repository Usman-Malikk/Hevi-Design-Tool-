import * as React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { ProductServices } from "app/apis/Products/ProductsServices";
import { ErrorToaster } from "app/components/Toaster/toaster";
import Loader from "app/assets/Loader";
import { CardMedia, Grid } from "@mui/material";

export default function ImageListUI(props) {
  const { Images, Data } = props;

  const [Loading, setLoading] = React.useState(false);
  const [Image, setImage] = React.useState([]);
  console.log("🚀 ~ file: Imagegallery :13 ~ ImageListUI ~ Image", Image);

  const getProductById = async (id) => {
    setLoading(true);
    try {
      let result = await ProductServices.getProductDetails(id);
      if (result.responseCode === 200) {
        console.log(
          "🚀 ~ file: Imagegallery.js:21 ~ getProductById ~ result",
          result
        );
        setImage(result.data[0].product_details);
      } else {
        ErrorToaster("Oops! and error occur");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getProductById(Data.id);
  }, [URL]);

  return (
    <Box sx={{ width: 500 }}>
      {Image.length !== 0 &&
        (Loading ? (
          <Box sx={{ padding: "50px" }}>
            <Loader />
          </Box>
        ) : (
          <Grid container display={"flex"} alignItems={"center"}>
            {Image.map((item) => (
              <Grid item xs="4" padding={"10px"}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  width={"100%"}
                  image={item.product_detail_images[0].image}
                  sx={{ objectFit: "contain", Height: "250px" }}
                />
              </Grid>
            ))}
          </Grid>
        ))}
    </Box>
  );
}
