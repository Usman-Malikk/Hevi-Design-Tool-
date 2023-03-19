import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  Tabs,
  tabsClasses,
  TextField,
  Typography,
} from "@mui/material";

import NavigationBar from "app/components/navigation/navigationBar";
import React, { useRef, useState } from "react";

import CheckroomIcon from "@mui/icons-material/Checkroom";
// Icons
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ErrorToaster, SuccessToaster } from "app/components/Toaster/toaster";
import { ProductServices } from "app/apis/Products/ProductsServices";
import Loader from "app/assets/Loader";
import { DesignToolServices } from "app/apis/DesignTool/DesignTool.Services";
import AbcIcon from "@mui/icons-material/Abc";
import ResponsiveDialog from "app/components/UI/ResponsiveDialog/ResponsiveDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import ImageModal from "app/components/UI/DialogBox/ImageModal";
import CancelIcon from "@mui/icons-material/Cancel";
// Movable
import Moveable from "react-moveable";

// Design Section ------------------------>
import { useDispatch, useSelector } from "react-redux";
import {
  AddDesignData,
  AddTextData,
  removeDesign,
  removeTextData,
  updateDesign,
  updateTextData,
  caluclatePrice,
  AddCustomiseData,
  removeCustomDesign,
  updateCustomDesign,
  AddAllData,
} from "app/redux/slices/DesignSlice";
import { newObjectId } from "./newObjectId";
import { LoadingButton } from "@mui/lab";
import { DraftOrderServices } from "app/apis/DraftOrder/DraftOrder.Services";
import { imageUpload } from "app/apis/ImageUpload/uploadImage.Services";
import { cartData } from "app/redux/slices/cartDetailSlice";

let moveable;

function C_product() {
  const dispatch = useDispatch();

  //Redux Selector
  const DesignInfo = useSelector((state) => state.DesignReducer?.DesignData);
  const TextInfo = useSelector((state) => state.DesignReducer?.TextData);
  const TotalPrice = useSelector((state) => state.DesignReducer?.TotalPrice);
  const CustomDesign = useSelector(
    (state) => state.DesignReducer?.customiseDesignData
  );
  const AllData = useSelector((state) => state.DesignReducer?.AllData);

  const { state } = useLocation();

  // USESTATES
  const [open, SetOpen] = useState(false);
  const { id } = useParams();
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setsubCategoryName] = useState("");
  const [Loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [SubLoading, setSubLoading] = useState(false);
  const [Product, setProduct] = useState([]);
  const [MainImage, setMainImage] = useState({});
  const [MainCategory, setMainCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);

  const [selectedMain, setselectedMain] = useState(0);
  const [selectedSub, setselectedSub] = useState(0);

  const [MainCategoryID, setMainCategoryID] = useState(1);
  const [DesignLoading, setDesignLoading] = useState(false);
  const [ProductDesign, setProductDesign] = useState([]);
  const [DesignProductKey, setDesignProductKey] = useState();
  const [openImageModal, setopenImageModal] = useState(false);
  const [selectedModalImage, setselectedModalImage] = useState("");
  const [availableColors, setavailableColors] = useState([]);
  const [selectedColor, setColor] = useState();
  const [callCheck, setcallCheck] = useState(0);
  const [RotateValue, setRotateValue] = useState(0);

  // Text Change
  const [Text, setText] = useState();
  const [getAllDesignSizes, setgetAllsizes] = useState([]);

  const navigate = useNavigate();

  const ref = useRef();

  const clearRef = () => {
    ref.current.value = "";
  };

  // Tool Main Category
  const getToolMainCategory = async () => {
    try {
      const result = await DesignToolServices.getToolMainCategory();
      if (result.responseCode === 200) {
        setMainCategory(result.data);

        callingSubCategory(result.data[0].id);
      } else {
        ErrorToaster("Oops an Error Occur");
      }
    } catch (e) {
      console.log(e);
      ErrorToaster(e);
    } finally {
    }
  };

  // get  product by id
  const getProductByID = async (id) => {
    setLoading(true);
    try {
      const result = await ProductServices.getProductDetails(id);
      if (result.responseCode === 200) {
        setProduct(result.data[0].product_customises_images);
        setMainImage(result.data[0].product_customises_images[0]);
      } else {
        ErrorToaster("Oops an error occur");
      }
    } catch (e) {
      console.log(e);
      ErrorToaster(e);
    } finally {
      setLoading(false);
    }
  };

  // Handle Main Image
  const HandleMainImage = (Image) => {
    setMainImage(Image);
  };

  // MainCategory Handle Option
  const handleMainChange = (event, newValue) => {
    setselectedMain(newValue);
    setselectedSub();
    setcallCheck(0);
  };

  // Calling Sub Category
  const callingSubCategory = async (id) => {
    setProductDesign([]);
    setColor("");
    setMainCategoryID(id);
    setSubLoading(true);
    setsubCategoryName("");
    try {
      const result = await DesignToolServices.getSubCategory(id);
      if (result.responseCode === 200) {
        setSubCategory(result.data);
        // result.data[1].id
        if (callCheck === 0) {
          getDesignProduct(result.data[0].id);
        }
      } else {
        ErrorToaster("Oops Error occur");
      }
    } catch (e) {
      ErrorToaster(e);
      console.log(e);
    } finally {
      setSubLoading(false);
      setcallCheck(1);
    }
  };

  // Chaning SubCategory
  const handleSubChange = (event, newValue) => {
    setselectedSub(newValue);
  };

  // get DesignProduct by Cat and sub
  const getDesignProduct = async (id, size) => {
    setText("");
    setColor("");
    setDesignProductKey();
    setavailableColors([]);
    setDesignLoading(true);
    try {
      const result = await DesignToolServices.getCustomiseDesign(
        MainCategoryID,
        id
      );
      if (result.responseCode === 200) {
        if (size) {
          let filteredData = [];
          filteredData = result.data.filter((Design) => {
            console.log(Design);
            if (Design.size === size) {
              return Design;
            }
          });

          if (filteredData.length !== 0) {
            setProductDesign(filteredData);
          } else {
            console.log(filteredData.length);
            ErrorToaster(`Oops No design available for ${size} size`);
            setProductDesign(result.data);
          }
        } else {
          setProductDesign(result.data);
        }
      } else {
        ErrorToaster("Oops Error Occur");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setDesignLoading(false);
    }
  };

  //   Handle Design  Color change
  const handleColorChange = (event) => {
    if (event.target.value !== selectedColor) {
      SuccessToaster("Color has been changed,now add design");
      setColor(event.target.value);
    }
  };

  // Chaneg product modal
  const HandleDialog = () => {
    SetOpen(!open);
  };

  // Image Modal
  const handleImageModal = (image) => {
    if (image) {
      setselectedModalImage(image);
    }
    setopenImageModal(!openImageModal);
  };

  // Handle Click for Design By id

  const DesignById = (Product) => {
    setColor(Product.colors[0].color_name);
    setDesignProductKey(Product.id);
    setavailableColors(Product);
  };

  //  setselectedDesigns

  // Get All Sizes
  const getAllSizes = async () => {
    try {
      const result = await DesignToolServices.getAllFitType();
      if (result.responseCode === 200) {
        setgetAllsizes(result.data);
      } else {
        ErrorToaster("Oops error occur");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
    }
  };

  // Add Design to Image

  const AddDesign = (Design) => {
    // For Hevi Design
    try {
      if (Design && mainCategoryName !== "Custom Design") {
        if (selectedColor) {
          if (Design.category_name === "HEVI Design") {
            // Find Design Image by Selected Colors
            const DesignImage = Design.colors.find((colors) => {
              if (colors.color_name === selectedColor) {
                return {
                  colors,
                };
              }
            });
            const uniqueID = newObjectId();
            const designInfo = {
              uniqueID: uniqueID,
              sku: Design.sku,
              size: Design.size,
              id: Design.id,
              category_id: Design.category_id,
              category_name: Design.category_name,
              subcategory_id: Design.subcategory_id,
              subcategory_name: Design.subcategory_name,
              image: DesignImage.image,
              price: Design.price,
              side: MainImage.img_name,
              xaxis: "0px",
              yaxis: "0px",
              rotate: "rotate(0deg)",
            };
            dispatch(AddDesignData(designInfo));
            setText("");
          }
          // For MonoGrams
          else if (Design.category_name === "Monograms") {
            if (Text !== "") {
              const uniqueID = newObjectId();
              const TextDesignDetails = {
                uniqueID: uniqueID,
                sku: Design.sku,
                id: Design.id,
                category_id: Design.category_id,
                category_name: Design.category_name,
                subcategory_id: Design.subcategory_id,
                subcategory_name: Design.subcategory_name,
                image: "",
                xaxis: "0px",
                size: Design.size,
                yaxis: "0px",
                rotate: "rotate(0deg)",
                price: Design.price,
                side: MainImage.img_name,
                value: Text,
                color: selectedColor,
              };
              dispatch(AddTextData(TextDesignDetails));
            } else {
              ErrorToaster("Kindly Enter Text First!");
            }
          }
          // For Custom Design
          dispatch(caluclatePrice());
        } else {
          ErrorToaster("Please Select Color first");
        }
      } else {
        setImageUrl(`https://api-designtool.baitalkhairkitchen.com${Design}`);
        const uniqueID = newObjectId();
        const designInfo = {
          uniqueID: uniqueID,
          sku: "1",
          size: "",
          id: "",
          category_id: 14,
          category_name: mainCategoryName,
          subcategory_id:
            subCategoryName === "Upload embroidery designs"
              ? 43
              : subCategoryName === "Upload vinyl designs"
              ? 44
              : 45,
          subcategory_name: subCategoryName,
          image: `https://api-designtool.baitalkhairkitchen.com${Design}`,
          price: "",
          height: "100px",
          width: "100px",
          side: MainImage.img_name,
          xaxis: "0px",
          yaxis: "0px",
          rotate: "rotate(0deg)",
        };
        dispatch(AddCustomiseData(designInfo));

        console.log(Design);
      }
    } catch (e) {
    } finally {
      setColor();
      setDesignProductKey();
      setavailableColors([]);
    }
  };

  // get Design By Size
  const getDesignBySize = async (size, Product) => {
    setDesignLoading(true);
    try {
      const result = await DesignToolServices.getDesignBySizes(size);
      if (result.responseCode === 200) {
        getDesignProduct(Product.subcategory_id, size);
      } else {
        ErrorToaster("Oops something went wrong");
      }
    } catch (e) {
      ErrorToaster(e);
    } finally {
      setDesignLoading(false);
    }
  };

  // Remove Design
  const DeleteDesign = (Design) => {
    if (Design.category_name === "Monograms") {
      dispatch(removeTextData(Design));
    } else if (Design.category_name === "HEVI Design") {
      dispatch(removeDesign(Design));
    } else {
      dispatch(removeCustomDesign(Design));
    }
    dispatch(caluclatePrice());
  };

  // Handle Text Change
  const HandleTextChange = (e) => {
    setText(e.target.value);
  };
  const [DraftLoading, setDraftLoading] = useState(false);
  // Save Draft Order

  const handleSaveDesign = async () => {
    setDraftLoading(true);
    var Data = [];
    if (DesignInfo.length !== 0) {
      DesignInfo.map((item) => {
        Data.push({
          category_id: item.category_id,
          subcategory_id: item.subcategory_id,
          size: item.size,
          side: item.side,
          image: item.image,
          left: item.xaxis,
          top: item.yaxis,
          rotate: item.rotate,
          value: "",
          price: item.price,
          sku: item.sku,
          color: "",
          height: "",
          width: "",
        });
      });
    }
    if (TextInfo.length !== 0) {
      TextInfo.map((item) => {
        Data.push({
          category_id: item.category_id,
          subcategory_id: item.subcategory_id,
          size: item.size,
          side: item.side,
          image: item.image,
          left: item.xaxis,
          top: item.yaxis,
          rotate: item.rotate,
          value: item.value,
          price: item.price,
          color: item.color,
          sku: item.sku,
          height: "",
          width: "",
        });
      });
    }
    if (CustomDesign.length !== 0) {
      CustomDesign.map((item) => {
        Data.push({
          category_id: item.category_id,
          subcategory_id: item.subcategory_id,
          size: item.size,
          side: item.side,
          image: item.image,
          left: item.xaxis,
          top: item.yaxis,
          rotate: item.rotate,
          value: "",
          price: item.price,
          color: "",
          sku: item.sku,
          height: item.height,
          width: item.width,
        });
      });
    }
    if (Data.length !== 0) {
      console.log("-----> Final Data ", Data);
      const FinalData = {
        product_id: id,
        color: state.color,
        size: state.size,
        quantity: state.quantity,
        price: state.price,
        draftorderdetails: Data,
      };
      console.log(
        "🚀 ~ file: C_product.js:423 ~ handleSaveDesign ~ FinalData:",
        FinalData
      );
      if (state.type === "new") {
        try {
          const result = await DraftOrderServices.saveOrder(FinalData);

          if (result.responseCode === 200) {
            SuccessToaster("Saved Draft Successfully");
          } else {
            ErrorToaster("Oops Error Occur!");
          }
        } catch (e) {
          ErrorToaster(e);
        } finally {
          setDraftLoading(false);
        }
      } else {
        try {
          const result = await DraftOrderServices.updateDraftOrderById(
            state.id,
            FinalData
          );
          if (result.responseCode === 200) {
            SuccessToaster("Order Updated Successfully");
          } else {
            ErrorToaster("Oops Error Occur!");
          }
        } catch (e) {
          ErrorToaster(e);
        } finally {
          setDraftLoading(false);
        }
      }
    } else {
      ErrorToaster("Theres Nothing to save :/");
    }
    setDraftLoading(false);
  };
  // Save Order
  const saveOrder = () => {
    let ExtraDetail = [];
    if (
      (DesignInfo.length !== 0) |
      (TextInfo.length !== 0) |
      (CustomDesign.length !== 0)
    ) {
      if (DesignInfo.length !== 0) {
        DesignInfo.map((item) => {
          ExtraDetail.push({
            category_id: item.category_id,
            subcategory_id: item.subcategory_id,
            size: item.size,
            side: item.side,
            image: item.image,
            left: item.xaxis,
            top: item.yaxis,
            rotate: item.rotate,
            value: "",
            price: item.price,
            sku: item.sku,
            color: "",
            height: "",
            width: "",
          });
        });
      }

      if (TextInfo.length !== 0) {
        TextInfo.map((item) => {
          ExtraDetail.push({
            category_id: item.category_id,
            subcategory_id: item.subcategory_id,
            size: item.size,
            side: item.side,
            image: item.image,
            left: item.xaxis,
            top: item.yaxis,
            rotate: item.rotate,
            value: item.value,
            price: item.price,
            color: item.color,
            sku: item.sku,
            height: "",
            width: "",
          });
        });
      }

      if (CustomDesign.length !== 0) {
        if (CustomDesign.length !== 0) {
          CustomDesign.map((item) => {
            ExtraDetail.push({
              category_id: item.category_id,
              subcategory_id: item.subcategory_id,
              size: item.size,
              side: item.side,
              image: item.image,
              left: item.xaxis,
              top: item.yaxis,
              rotate: item.rotate,
              value: "",
              price: item.price,
              color: "",
              sku: item.sku,
              height: item.height,
              width: item.width,
            });
          });
        }
      }
      console.log(
        "🚀 ~ file: C_product.js:550 ~ saveOrder ~ ExtraDetail:",
        ExtraDetail
      );
      dispatch(AddAllData(ExtraDetail));

      let obj = {
        productId: state.productId,
        categoryId: state.categoryId,
        categoryName: state.categoryName,
        price: state.price,
        productImage: state.image,
        productName: state.productName,
        quantity: state.quantity,
        color: state.color,
        size: state.size,
      };

      dispatch(cartData(obj));

      navigate("/checkout");
    } else {
      ErrorToaster("Kindly create design first");
    }
    try {
    } catch {
    } finally {
    }
  };

  // Customise Design Section
  // Handle Upload Image
  const [imageUrl, setImageUrl] = useState("");
  const HandleUploadImage = async (Data) => {
    SuccessToaster("Your Custom Design is uploading");
    const formData = new FormData();
    formData.append("image", Data.target.files[0]);
    try {
      const result = await imageUpload.UploadImage(formData);
      if (result.responseCode === 200) {
        console.log(result.data);

        AddDesign(result.data);
      }
    } catch (e) {
      console.log(e);
      ErrorToaster(e);
    } finally {
      clearRef();
    }
    // console.log(Data.target.files[0]);
  };

  // UseEffect
  useEffect(() => {
    getProductByID(id);
    getToolMainCategory();

    getAllSizes();
  }, [URL]);

  return (
    <>
      {Loading ? (
        <Box
          sx={{
            height: "300px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </Box>
      ) : (
        <Box sx={{ background: "#fcf0e6", padding: "10px" }}>
          <Box>
            <NavigationBar sx={{ color: "#e46346 !important" }} />
          </Box>

          <Box
            sx={{
              padding: { md: "20px", xs: "10px" },
              margin: "20px",
              background: "white",
              borderRadius: "30px",
              boxShadow: " rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            }}
          >
            <Typography sx={{ display: "flex", gap: "10px" }} variant="p">
              {" "}
              <span>Home</span>/<span>Location</span>{" "}
            </Typography>

            <Grid
              container
              mt={"10px"}
              sx={{ justifyContent: "space-between" }}
            >
              {/* Left Side Nav-------------------------------------------------------> */}
              <Grid item xs="7">
                <Grid container>
                  <Grid
                    item
                    xs="12"
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.15) ",
                      borderBottom: "none",
                    }}
                  >
                    {/* Main Category Section--------------------------------------------------> */}
                    <Grid
                      container
                      justifyContent="center"
                      padding={"10px"}
                      alignItems="center"
                      gap="5px"
                    >
                      <Tabs
                        value={selectedMain}
                        onChange={handleMainChange}
                        variant="scrollable"
                        indicatorColor="primary"
                        sx={{
                          ".css-vua1a0-MuiButtonBase-root-MuiTab-root.Mui-selected":
                            { color: "white", background: "black" },
                        }}
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                      >
                        {MainCategory.map((Category) => (
                          <Tab
                            sx={{
                              color: "black",
                              fontWeight: "700",
                              border: "1px solid black",
                              margin: "10px",
                            }}
                            label={Category.name}
                            onClick={() => {
                              callingSubCategory(Category.id);
                              setMainCategoryName(Category.name);
                            }}
                          />
                        ))}
                      </Tabs>
                    </Grid>

                    {/* Sub Category Section--------------------------------------------------> */}
                    <Grid
                      item
                      xs="12"
                      sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.15) " }}
                    >
                      <Grid
                        container
                        padding={"30px"}
                        justifyContent="start"
                        gap="20px"
                        color="gray"
                      >
                        {SubCategory.length !== 0 ? (
                          SubLoading ? (
                            <Box
                              sx={{
                                padding: "20px",
                                width: "100%",
                                justifyContent: "center",
                              }}
                            >
                              <Loader sx={{ marginTop: "0px" }} />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                flexGrow: 1,

                                bgcolor: "background.paper",
                              }}
                            >
                              <Tabs
                                value={selectedSub}
                                onChange={handleSubChange}
                                variant="scrollable"
                                scrollButtons
                                aria-label="visible arrows tabs example"
                                sx={{
                                  [`& .${tabsClasses.scrollButtons}`]: {
                                    "&.Mui-disabled": { opacity: 0.3 },
                                  },
                                  display: "flex",
                                  justifyContent: "center",
                                  ".MuiTabs-flexContainer": {
                                    display: "flex",
                                    justifyContent: "start",
                                  },
                                }}
                              >
                                {SubCategory.map((e) => (
                                  <Tab
                                    onClick={() => {
                                      setsubCategoryName(e.name);
                                      getDesignProduct(e.id);
                                    }}
                                    label={e.name}
                                    sx={{
                                      color: "black",
                                      fontSize: "15px",
                                      fontWeight: "600",
                                    }}
                                  />
                                ))}
                              </Tabs>
                            </Box>
                          )
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>

                    {ProductDesign.length !== 0 ? (
                      DesignLoading ? (
                        <Box
                          sx={{
                            height: "300px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Loader />
                        </Box>
                      ) : (
                        <Grid container>
                          {/* Sizes Option if available */}
                          {ProductDesign[0].category_name === "Monograms" && (
                            <Grid item xs="12" padding="20px">
                              <Grid
                                container
                                alignItems={"center"}
                                justifyContent="start"
                                gap="10px"
                              >
                                {/* text Size if Available */}
                                <Grid item xs="12">
                                  {" "}
                                  <Typography
                                    sx={{
                                      fontWeight: "900",
                                      fontFamily: "Hind, sans-serif",
                                      fontSize: "20px",
                                    }}
                                  >
                                    Text Size:
                                  </Typography>
                                </Grid>
                                {getAllDesignSizes.map((size) => (
                                  <Grid item xs="2">
                                    <Typography
                                      onClick={() => {
                                        getDesignBySize(
                                          size.name,
                                          ProductDesign[0]
                                        );
                                      }}
                                      cursor="pointer"
                                      sx={{
                                        cursor: "pointer",
                                        padding: "10px",
                                        color: "white",
                                        color: "black",
                                        fontWeight: "700",
                                        border: "3px solid black",
                                        borderRadius: "2px",
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {size.name}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                          )}

                          {/* Add text Here */}

                          {ProductDesign[0].category_name === "Monograms" && (
                            <Grid item xs="12" padding="5px 20px">
                              {ProductDesign[0].subcategory_name !==
                              "Numbers" ? (
                                <OutlinedInput
                                  fullWidth
                                  value={Text}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <AbcIcon />
                                    </InputAdornment>
                                  }
                                  inputProps={{
                                    maxLength:
                                      ProductDesign[0].subcategory_name ===
                                      "Single initial"
                                        ? 1
                                        : ProductDesign[0].subcategory_name ===
                                          "Multi initial"
                                        ? 3
                                        : ProductDesign[0].subcategory_name ===
                                          "Words"
                                        ? 10
                                        : 0,
                                  }}
                                  placeholder="Enter Text Here"
                                  textAlign="center"
                                  sx={{
                                    ".css-8q2m5j-MuiInputBase-root-MuiInput-root":
                                      {
                                        fontFamily: "Hind, sans-serif",
                                        fontSize: "20px",
                                      },
                                    mt: "10px",
                                  }}
                                  onChange={(e) => {
                                    HandleTextChange(e);
                                  }}
                                  id="standard-multiline-flexible"
                                  variant="standard"
                                />
                              ) : (
                                <OutlinedInput
                                  type="number"
                                  value={Text}
                                  InputProps={{ maxLength: 3 }}
                                  fullWidth
                                  endAdornment={
                                    <InputAdornment
                                      position="end"
                                      sx={{ color: "gray" }}
                                    >
                                      123
                                    </InputAdornment>
                                  }
                                  placeholder="Enter Number Here"
                                  textAlign="center"
                                  sx={{
                                    ".css-8q2m5j-MuiInputBase-root-MuiInput-root":
                                      {
                                        fontFamily: "Hind, sans-serif",
                                        fontSize: "20px",
                                      },
                                    mt: "10px",
                                  }}
                                  id="standard-multiline-flexible"
                                  onInput={(e) => {
                                    e.target.value = Math.max(
                                      0,
                                      parseInt(e.target.value)
                                    )
                                      .toString()
                                      .slice(0, 3);
                                  }}
                                  variant="standard"
                                  onChange={(e) => {
                                    HandleTextChange(e);
                                  }}
                                />
                              )}
                            </Grid>
                          )}

                          {/* Note --------------------> for dresses */}
                          {ProductDesign[0].subcategory_name ===
                          "Hats Design" ? (
                            <Typography
                              padding={"10px"}
                              sx={{ fontSize: "19px" }}
                            >
                              <span style={{ color: "red", fontWeight: "700" }}>
                                Note:
                              </span>{" "}
                              This Design is only for applicable for Hats
                            </Typography>
                          ) : ProductDesign[0].subcategory_name ===
                            "Sleeves Design" ? (
                            <Typography
                              padding={"10px"}
                              sx={{ fontSize: "19px" }}
                            >
                              <span style={{ color: "red", fontWeight: "700" }}>
                                Note:
                              </span>{" "}
                              This Design is only for applicable on Sleeves
                            </Typography>
                          ) : (
                            <></>
                          )}

                          <Grid item xs="12" padding="10px 20px">
                            {/* Desigin Product */}
                            <Grid
                              container
                              overflow={"scroll"}
                              sx={{ height: "500px" }}
                            >
                              <Grid item xs="12">
                                <Typography variant="h5">
                                  Available Designs:
                                </Typography>
                              </Grid>

                              {ProductDesign.map((Design, key) => (
                                <Grid item md="4">
                                  <Card
                                    onClick={() => {
                                      setDesignProductKey(Design.id);
                                    }}
                                    sx={{
                                      margin: "10px",
                                      cursor: "pointer",
                                      padding: "2px !important",
                                      boxShadow:
                                        DesignProductKey === Design.id
                                          ? " rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px"
                                          : "",
                                    }}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="140"
                                      image={Design.colors[0].image}
                                      alt="green iguana"
                                      sx={{
                                        objectFit: "contain",
                                        "MuiCardContent-root": {
                                          paddingBottom: "0px",
                                        },
                                      }}
                                    />
                                    <CardContent
                                      sx={{ paddingBottom: "10px !important" }}
                                    >
                                      <Typography
                                        gutterBottom
                                        variant="h8"
                                        component="div"
                                      >
                                        <b>Title:</b> {Design.title}
                                      </Typography>

                                      {/* Description of Design---> */}

                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        <b>Size:</b> {Design.size}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        <b>Price</b> {Design.price}$
                                      </Typography>
                                      <Box
                                        display={"flex"}
                                        gap="5px"
                                        justifyContent={"center"}
                                        marginTop="10px"
                                      >
                                        <Button
                                          sx={{
                                            border: "1px solid black",
                                            display: "flex",
                                            fontSize: "12px",
                                            gap: "5px",
                                            color: "black",
                                            fontWeight: "700",
                                          }}
                                          onClick={() => {
                                            handleImageModal(Design);
                                          }}
                                        >
                                          View{" "}
                                          {/* <VisibilityIcon
                                            sx={{ fontSize: "12px" }}
                                          />{" "} */}
                                        </Button>

                                        <Button
                                          onClick={() => {
                                            AddDesign(Design);
                                          }}
                                          sx={{
                                            position: "relative",
                                            zIndex: "2",
                                            border: "1px solid black",
                                            display: "flex",
                                            fontSize: "12px",
                                            gap: "5px",
                                            color: "black",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Add{" "}
                                          {/* <AddIcon sx={{ fontSize: "12px" }} /> */}
                                        </Button>

                                        <Button
                                          onClick={() => {
                                            DesignById(Design);
                                          }}
                                          sx={{
                                            position: "relative",
                                            zIndex: "2",
                                            border: "1px solid black",
                                            display: "flex",
                                            fontSize: "9px",
                                            gap: "5px",
                                            color: "black",
                                            fontWeight: "700",
                                          }}
                                        >
                                          Select Color{" "}
                                        </Button>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>

                          {/* Colors Section----------------------------------------------------------------> */}

                          {availableColors.length !== 0 && (
                            <Grid item xs="12" padding="10px 20px">
                              <Typography variant="h5">
                                Available Colors :
                              </Typography>

                              <FormControl
                                sx={{ m: 1, minWidth: 300 }}
                                size="medium"
                              >
                                <InputLabel id="demo-select-small">
                                  Colors
                                </InputLabel>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  value={selectedColor}
                                  label="Colors"
                                  onChange={handleColorChange}
                                >
                                  {availableColors.colors.map((colors) => (
                                    <MenuItem value={colors.color_name}>
                                      <Box
                                        display="flex"
                                        gap="10px"
                                        alignItems="center"
                                      >
                                        <Box
                                          sx={{
                                            height: "30px",
                                            width: "30px",
                                            borderRadius: "50%",
                                            backgroundColor: colors.color_code,
                                          }}
                                        ></Box>
                                        {colors.color_name}
                                      </Box>
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          )}
                        </Grid>
                      )
                    ) : (
                      <></>
                    )}

                    {/* If User select Custom Design --------------------------------------> */}
                    {mainCategoryName === "Custom Design" &&
                      subCategoryName && (
                        <Grid item xs="12" padding="10px 20px">
                          <Typography
                            sx={{
                              fontWeight: "900",
                              fontFamily: "Hind, sans-serif",
                              fontSize: "20px",
                            }}
                          >
                            Add Custom Design Here:
                          </Typography>
                          <span
                            class="btn btn-primary btn-file"
                            style={{
                              position: "relative",
                              marginTop: "20px",
                              marginBottom: "20px",
                              overflow: "hidden",
                              background: "black",
                              color: "white",
                              height: "20px",
                              width: "150px",
                              padding: "15px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <CloudUploadIcon sx={{ color: "white" }} /> Upload
                            Image
                            <input
                              ref={ref}
                              style={{
                                position: " absolute",
                                top: "0",
                                right: "0",
                                minWidth: "100%",
                                mineight: "100%",
                                fontSize: " 100px",
                                align: "right",
                                filter: "alpha(opacity=0)",
                                opacity: "0",
                                outline: "none",
                                background: "white",
                                cursor: "inherit",
                                display: "block",
                              }}
                              type="file"
                              onChange={(e) => {
                                HandleUploadImage(e);
                              }}
                            ></input>
                          </span>
                        </Grid>
                      )}

                    {/* Submit Button */}
                    <Grid item xs="12" mt="20px">
                      <LoadingButton
                        loading={buttonLoading}
                        fullWidth
                        onClick={saveOrder}
                        sx={{
                          backgroundColor: buttonLoading ? "white" : "black",
                          color: "white",
                          fontSize: "25px",
                          border: "1px solid black",
                          ":hover": {
                            background: "white",
                            color: "black",
                            border: "1px solid black",
                          },
                        }}
                      >
                        Submit
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Side Image Section */}
              <Grid item xs="5" borderLeft={"1px solid rgba(0, 0, 0, 0.09)"}>
                <Grid container>
                  {/* Right Navigation-------------------------------------------------> */}
                  <Grid item xs="12" sx={{}}>
                    <Grid container padding={"0px 10px"}>
                      {/* Left Side --------------------------> */}
                      <Grid item xs="4">
                        <Grid container gap="5px" display={"flex"}>
                          <LoadingButton
                            loading={DraftLoading}
                            onClick={() => {
                              handleSaveDesign();
                            }}
                            sx={{
                              background: "white",
                              color: "black",
                              fontSize: "12px",
                              border: "2px solid black",
                            }}
                          >
                            Save as draft
                          </LoadingButton>
                        </Grid>
                      </Grid>

                      {/* Right Side ------------------------------------> */}
                      <Grid item xs="8">
                        <Grid
                          container
                          gap="10px"
                          display={"flex"}
                          justifyContent="end"
                          sx={{
                            borderBottom: "1px solid rgba(0, 0, 0, 0.15) ",
                            paddingBottom: "13px",
                          }}
                        >
                          <Button
                            sx={{
                              fontFamily: "Hind, sans-serif",
                              cursor: "pointer",
                              color: "black",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onClick={HandleDialog}
                          >
                            <CheckroomIcon /> Change Product
                          </Button>
                          <Typography
                            sx={{
                              fontWeight: "900",
                              fontFamily: "Hind, sans-serif",
                              fontSize: "16px",
                            }}
                          >
                            Price: {TotalPrice}$
                          </Typography>
                          {/* <Button
                            sx={{
                              fontFamily: "Hind, sans-serif",
                              cursor: "pointer",
                              color: "black",
                            }}
                          >
                            Add to cart{" "}
                            <LocalMallIcon sx={{ color: "green" }} />
                          </Button> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* ======================Design Section ====================== */}

                  {/* Image Upload and Design --------------------------------------> Right side */}
                  <Grid
                    item
                    xs="12"
                    display={"flex"}
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      // ".moveable-line": { background: "" },
                      ".moveable-control.moveable-origin": {
                        border: "none !important",
                        background: "none !important",
                      },
                    }}
                  >
                    {MainImage.image ? (
                      <Box position="relative">
                        <CardMedia
                          component="img"
                          sx={{
                            width: "500px",
                            height: "600px",
                            objectFit: "contain",
                            position: "relative",
                          }}
                          alt="green iguana"
                          image={MainImage.image}
                        />

                        <Box
                          position={"absolute"}
                          id="RotatableBox"
                          sx={{
                            top: `${MainImage.top}%`,
                            height: `${MainImage.height}%`,
                            width: `${MainImage.width}%`,
                            left: `${MainImage.left}%`,
                            zIndex: "1",
                            border: "2px solid lightgray ",
                            borderStyle: "dashed",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            position={"relative"}
                            sx={{
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {/* Render Design */}
                            {DesignInfo.length !== 0 &&
                              DesignInfo.map((Design, index) => {
                                if (Design.side === MainImage.img_name) {
                                  return (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: "0px",
                                        left: "0px",
                                        ".rCS1s34yp2 .moveable-control": {
                                          // marginTop: "30px !important",
                                          // marginLeft: "-60px !important",
                                        },

                                        ".rCS1s34yp2 .moveable-rotation .moveable-rotation-control":
                                          {
                                            background: "#e46346",
                                            border: "1px black",
                                          },
                                        ".rCS1s34yp2 .moveable-line": {
                                          display: "none !important ",
                                        },
                                      }}
                                      key={Design.uniqueID}
                                    >
                                      <Box
                                        className={`Design${Design.uniqueID}`}
                                        // onClick={() => {
                                        //   HandleDesignMovement(
                                        //     Design.id,
                                        //     Design,
                                        //     MainImage.img_name
                                        //   );
                                        // }}
                                        sx={{
                                          position: "relative",
                                          height: "80px",
                                          width: "80px",
                                          left: Design.xaxis,
                                          top: Design.yaxis,
                                          transform: Design.rotate
                                            ? Design.rotate
                                            : "rotate(0deg)",
                                        }}
                                      >
                                        <CardMedia
                                          component={"img"}
                                          image={Design.image}
                                          sx={{
                                            position: "absolute",
                                            height: "100%",
                                            width: "100%",
                                            transition: "0.1s ease-in-out",
                                            objectFit: "contain",
                                            ":hover": {
                                              border: "1px solid red",
                                            },
                                          }}
                                        />
                                        <Box
                                          onClick={() => {
                                            DeleteDesign(Design);
                                          }}
                                          sx={{
                                            position: "absolute",
                                            top: "-25px",
                                            right: "-10px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <CancelIcon sx={{ color: "red" }} />
                                        </Box>
                                      </Box>

                                      <Moveable
                                        target={document.getElementsByClassName(
                                          `Design${Design.uniqueID}`
                                        )}
                                        container={null}
                                        origin={true}
                                        edge={false}
                                        snappable={true}
                                        draggable={true}
                                        hideDefaultLines={true}
                                        throttleDrag={0}
                                        onDragStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onDragStart", target);
                                        }}
                                        onDrag={({
                                          target,
                                          beforeDelta,
                                          beforeDist,
                                          left,
                                          top,
                                          right,
                                          bottom,
                                          delta,
                                          dist,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          target.style.left = `${left}px`;
                                          target.style.top = `${top}px`;
                                        }}
                                        onDragEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                          left,
                                          top,
                                        }) => {
                                          console.log(Design);
                                          if (
                                            Design.category_name ===
                                            "HEVI Design"
                                          ) {
                                            const DesignObj = {
                                              uniqueID: Design.uniqueID,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              size: Design.size,
                                              rotate: Design.rotate,
                                              side: Design.side,
                                              yaxis: target.style.top,
                                              xaxis: target.style.left,
                                            };
                                            console.log(
                                              "🚀 ~ file: C_product.js:1352 ~ DesignInfo.map ~ DesignObj:",
                                              DesignObj
                                            );
                                            dispatch(updateDesign(DesignObj));
                                          }
                                          if (
                                            Design.category_name === "Monograms"
                                          ) {
                                            const DesignObj = {
                                              value: Design.value,
                                              uniqueID: Design.uniqueID,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              rotate: Design.rotate,
                                              side: Design.side,
                                              yaxis: target.style.top,
                                              xaxis: target.style.left,
                                              color: Design.color,
                                              size: Design.size,
                                            };
                                            console.log(
                                              "🚀 ~ file: C_product.js:1382 ~ DesignInfo.map ~ DesignObj:",
                                              DesignObj
                                            );
                                            dispatch(updateTextData(DesignObj));
                                          }
                                        }}
                                        /* When resize or scale, keeps a ratio of the width, height. */
                                        keepRatio={true}
                                        /* resizable*/
                                        /* Only one of resizable, scalable, warpable can be used. */
                                        resizable={false}
                                        throttleResize={0}
                                        onResizeStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onResizeStart", target);
                                        }}
                                        onResize={({
                                          target,
                                          width,
                                          height,
                                          dist,
                                          delta,
                                          direction,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onResize", target);
                                          delta[0] &&
                                            (target.style.width = `${width}px`);
                                          delta[1] &&
                                            (target.style.height = `${height}px`);
                                        }}
                                        onResizeEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log(
                                            "onResizeEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        /* scalable */
                                        /* Only one of resizable, scalable, warpable can be used. */
                                        // scalable={true}
                                        throttleScale={0}
                                        onScaleStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onScale={({
                                          target,
                                          scale,
                                          dist,
                                          delta,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onScale scale", scale);
                                          target.style.transform = transform;
                                        }}
                                        onScaleEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log(
                                            "onScaleEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        /* rotatable */
                                        rotatable={true}
                                        throttleRotate={0}
                                        onRotateStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onRotate={({
                                          target,
                                          delta,
                                          dist,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          target.style.transform = transform;
                                        }}
                                        onRotateEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          if (
                                            Design.category_name ===
                                            "HEVI Design"
                                          ) {
                                            const DesignObj = {
                                              uniqueID: Design.uniqueID,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              side: Design.side,
                                              yaxis: Design.yaxis,
                                              xaxis: Design.xaxis,
                                              rotate: target.style.transform,
                                              size: Design.size,
                                            };
                                            dispatch(updateDesign(DesignObj));
                                          } else if (
                                            Design.category_name === "Monograms"
                                          ) {
                                            const TextObj = {
                                              uniqueID: Design.uniqueID,
                                              value: Design.value,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              side: Design.side,
                                              yaxis: Design.yaxis,
                                              xaxis: Design.xaxis,
                                              rotate: target.style.transform,
                                              color: Design.color,
                                              size: Design.size,
                                            };
                                            dispatch(updateTextData(TextObj));
                                          }

                                          console.log(
                                            "onRotateEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        // Enabling pinchable lets you use events that
                                        // can be used in draggable, resizable, scalable, and rotateable.
                                        pinchable={true}
                                        onPinchStart={({
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
                                          console.log("onPinchStart");
                                        }}
                                        onPinch={({
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinch event occur before drag, rotate, scale, resize
                                          console.log("onPinch");
                                        }}
                                        onPinchEnd={({
                                          isDrag,
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
                                          console.log("onPinchEnd");
                                        }}
                                      />
                                    </Box>
                                  );
                                }
                              })}

                            {/* Render Text Design  */}
                            {TextInfo.length !== 0 &&
                              TextInfo.map((Design) => {
                                if (Design.side === MainImage.img_name) {
                                  return (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: "0px",
                                        left: "0px",
                                        ".rCS1s34yp2 .moveable-control": {
                                          // marginTop: "30px !important",
                                          // marginLeft: "-200%px !important",
                                        },

                                        ".rCS1s34yp2 .moveable-rotation .moveable-rotation-control":
                                          {
                                            background: "#e46346",
                                            border: "1px black",
                                          },
                                        ".rCS1s34yp2 .moveable-line": {
                                          display: "none !important ",
                                        },
                                      }}
                                      key={Design.uniqueID}
                                    >
                                      <Box
                                        className={`Design${Design.uniqueID}`}
                                        sx={{
                                          position: "relative",
                                          padding: "10px",
                                          ":hover": {
                                            border: "1px solid red",
                                          },
                                          left: Design.xaxis,
                                          top: Design.yaxis,
                                          transform: Design.rotate
                                            ? Design.rotate
                                            : "rotate(0deg)",
                                          // height: "80px",
                                          // width: "80px",
                                        }}
                                      >
                                        <Typography
                                          variant="h4"
                                          sx={{
                                            cursor: "pointer",
                                            fontFamily:
                                              "Dancing Script, cursive",
                                            color: Design.color,
                                          }}
                                        >
                                          {" "}
                                          {Design.value}
                                        </Typography>
                                        <Box
                                          onClick={() => {
                                            DeleteDesign(Design);
                                          }}
                                          sx={{
                                            position: "absolute",
                                            top: "-20px",
                                            right: "-20px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <CancelIcon sx={{ color: "red" }} />
                                        </Box>
                                      </Box>
                                      <Moveable
                                        target={document.getElementsByClassName(
                                          `Design${Design.uniqueID}`
                                        )}
                                        container={null}
                                        origin={true}
                                        /* Resize event edges */
                                        edge={false}
                                        // bounds={{
                                        //   left: 200,
                                        //   top: 200,
                                        //   right: 200,
                                        //   bottom: 200,
                                        // }}
                                        snappable={true}
                                        // top: `${MainImage.top}%`,
                                        // height: `${MainImage.height}%`,
                                        // width: `${MainImage.width}%`,
                                        // left: `${MainImage.left}%`,
                                        /* draggable */
                                        draggable={true}
                                        hideDefaultLines={true}
                                        throttleDrag={0}
                                        onDragStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onDragStart", target);
                                        }}
                                        onDrag={({
                                          target,
                                          beforeDelta,
                                          beforeDist,
                                          left,
                                          top,
                                          right,
                                          bottom,
                                          delta,
                                          dist,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          target.style.left = `${left}px`;
                                          target.style.top = `${top}px`;

                                          // target.style.top = top;
                                          // target.style.left = left;
                                        }}
                                        onDragEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                          left,
                                          top,
                                        }) => {
                                          console.log(Design);
                                          if (
                                            Design.category_name ===
                                            "HEVI Design"
                                          ) {
                                            const DesignObj = {
                                              uniqueID: Design.uniqueID,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              size: Design.size,
                                              rotate: Design.rotate,
                                              side: Design.side,
                                              yaxis: target.style.top,
                                              xaxis: target.style.left,
                                            };
                                            console.log(
                                              "🚀 ~ file: C_product.js:1352 ~ DesignInfo.map ~ DesignObj:",
                                              DesignObj
                                            );
                                            dispatch(updateDesign(DesignObj));
                                          }
                                          if (
                                            Design.category_name === "Monograms"
                                          ) {
                                            const DesignObj = {
                                              value: Design.value,
                                              uniqueID: Design.uniqueID,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              rotate: Design.rotate,
                                              side: Design.side,
                                              yaxis: target.style.top,
                                              xaxis: target.style.left,
                                              color: Design.color,
                                              size: Design.size,
                                            };
                                            console.log(
                                              "🚀 ~ file: C_product.js:1382 ~ DesignInfo.map ~ DesignObj:",
                                              DesignObj
                                            );
                                            dispatch(updateTextData(DesignObj));
                                          }
                                        }}
                                        /* When resize or scale, keeps a ratio of the width, height. */
                                        keepRatio={true}
                                        /* resizable*/
                                        /* Only one of resizable, scalable, warpable can be used. */
                                        resizable={false}
                                        throttleResize={0}
                                        onResizeStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onResizeStart", target);
                                        }}
                                        onResize={({
                                          target,
                                          width,
                                          height,
                                          dist,
                                          delta,
                                          direction,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onResize", target);
                                          delta[0] &&
                                            (target.style.width = `${width}px`);
                                          delta[1] &&
                                            (target.style.height = `${height}px`);
                                        }}
                                        onResizeEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log(
                                            "onResizeEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        /* scalable */
                                        /* Only one of resizable, scalable, warpable can be used. */
                                        // scalable={true}
                                        throttleScale={0}
                                        onScaleStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onScale={({
                                          target,
                                          scale,
                                          dist,
                                          delta,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onScale scale", scale);
                                          target.style.transform = transform;
                                        }}
                                        onScaleEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log(
                                            "onScaleEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        /* rotatable */
                                        rotatable={true}
                                        throttleRotate={0}
                                        onRotateStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onRotate={({
                                          target,
                                          delta,
                                          dist,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          target.style.transform = transform;
                                        }}
                                        onRotateEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          if (
                                            Design.category_name ===
                                            "HEVI Design"
                                          ) {
                                            const DesignObj = {
                                              uniqueID: Design.uniqueID,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              side: Design.side,
                                              yaxis: Design.yaxis,
                                              xaxis: Design.xaxis,
                                              rotate: target.style.transform,
                                              size: Design.size,
                                            };
                                            dispatch(updateDesign(DesignObj));
                                          } else if (
                                            Design.category_name === "Monograms"
                                          ) {
                                            const TextObj = {
                                              uniqueID: Design.uniqueID,
                                              value: Design.value,
                                              sku: Design.sku,
                                              id: Design.id,
                                              category_id: Design.category_id,
                                              category_name:
                                                Design.category_name,
                                              subcategory_id:
                                                Design.subcategory_id,
                                              subcategory_name:
                                                Design.subcategory_name,
                                              image: Design.image,
                                              price: Design.price,
                                              side: Design.side,
                                              yaxis: Design.yaxis,
                                              xaxis: Design.xaxis,
                                              rotate: target.style.transform,
                                              color: Design.color,
                                              size: Design.size,
                                            };
                                            dispatch(updateTextData(TextObj));
                                          }

                                          console.log(
                                            "onRotateEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        // Enabling pinchable lets you use events that
                                        // can be used in draggable, resizable, scalable, and rotateable.
                                        pinchable={true}
                                        onPinchStart={({
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
                                          console.log("onPinchStart");
                                        }}
                                        onPinch={({
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinch event occur before drag, rotate, scale, resize
                                          console.log("onPinch");
                                        }}
                                        onPinchEnd={({
                                          isDrag,
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
                                          console.log("onPinchEnd");
                                        }}
                                      />
                                    </Box>
                                  );
                                }
                              })}

                            {/* Render Custom Design */}
                            {CustomDesign.length !== 0 &&
                              CustomDesign.map((Design) => {
                                if (Design.side === MainImage.img_name) {
                                  return (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: "0px",
                                        left: "0px",
                                        ".rCS1s34yp2 .moveable-control": {
                                          // marginTop: "30px !important",
                                          // marginLeft: "-200%px !important",
                                        },

                                        ".rCS1s34yp2 .moveable-rotation .moveable-rotation-control":
                                          {
                                            background: "#e46346",
                                            border: "1px black",
                                          },
                                        ".rCS1s34yp2 .moveable-line": {
                                          display: "none !important ",
                                        },
                                      }}
                                      key={Design.uniqueID}
                                    >
                                      <Box
                                        className={`Design${Design.uniqueID}`}
                                        sx={{
                                          position: "relative",
                                          height:
                                            Design.height !== ""
                                              ? Design.height
                                              : "80px",
                                          width:
                                            Design.width !== ""
                                              ? Design.width
                                              : "80px",
                                          left: Design.xaxis,
                                          top: Design.yaxis,
                                          transform: Design.rotate
                                            ? Design.rotate
                                            : "rotate(0deg)",
                                        }}
                                      >
                                        <CardMedia
                                          component={"img"}
                                          image={Design.image}
                                          sx={{
                                            position: "absolute",
                                            height: "100%",
                                            width: "100%",
                                            transition: "0.1s ease-in-out",
                                            objectFit: "contain",
                                            ":hover": {
                                              border: "1px solid red",
                                            },
                                          }}
                                        />
                                        <Box
                                          onClick={() => {
                                            DeleteDesign(Design);
                                          }}
                                          sx={{
                                            position: "absolute",
                                            top: "-25px",
                                            right: "-10px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <CancelIcon sx={{ color: "red" }} />
                                        </Box>
                                      </Box>
                                      <Moveable
                                        target={document.getElementsByClassName(
                                          `Design${Design.uniqueID}`
                                        )}
                                        container={null}
                                        origin={true}
                                        /* Resize event edges */
                                        edge={false}
                                        // bounds={{
                                        //   left: 200,
                                        //   top: 200,
                                        //   right: 200,
                                        //   bottom: 200,
                                        // }}
                                        snappable={true}
                                        // top: `${MainImage.top}%`,
                                        // height: `${MainImage.height}%`,
                                        // width: `${MainImage.width}%`,
                                        // left: `${MainImage.left}%`,
                                        /* draggable */
                                        draggable={true}
                                        hideDefaultLines={true}
                                        throttleDrag={0}
                                        onDragStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onDrag={({
                                          target,
                                          beforeDelta,
                                          beforeDist,
                                          left,
                                          top,
                                          right,
                                          bottom,
                                          delta,
                                          dist,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          target.style.left = `${left}px`;
                                          target.style.top = `${top}px`;

                                          // target.style.top = top;
                                          // target.style.left = left;
                                        }}
                                        onDragEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                          left,
                                          top,
                                        }) => {
                                          const DesignObj = {
                                            uniqueID: Design.uniqueID,
                                            sku: "",
                                            id: Design.id,
                                            category_id: Design.category_id,
                                            category_name: Design.category_name,
                                            subcategory_id:
                                              Design.subcategory_id,
                                            subcategory_name:
                                              Design.subcategory_name,
                                            height: Design.height,
                                            width: Design.width,
                                            image: Design.image,
                                            price: Design.price,
                                            side: Design.side,
                                            yaxis: target.style.top,
                                            xaxis: target.style.left,
                                            rotate: Design.rotate,
                                            size: Design.size,
                                          };
                                          dispatch(
                                            updateCustomDesign(DesignObj)
                                          );
                                        }}
                                        /* When resize or scale, keeps a ratio of the width, height. */
                                        keepRatio={true}
                                        /* resizable*/
                                        /* Only one of resizable, scalable, warpable can be used. */
                                        resizable={true}
                                        throttleResize={0}
                                        onResizeStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onResizeStart", target);
                                        }}
                                        onResize={({
                                          target,
                                          width,
                                          height,
                                          dist,
                                          delta,
                                          direction,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log(
                                            "onResize",
                                            width,
                                            height
                                          );

                                          const DesignObj = {
                                            uniqueID: Design.uniqueID,
                                            sku: Design.sku,
                                            id: Design.id,
                                            category_id: Design.category_id,
                                            category_name: Design.category_name,
                                            subcategory_id:
                                              Design.subcategory_id,
                                            subcategory_name:
                                              Design.subcategory_name,
                                            height: `${height}px`,
                                            width: `${width}px`,
                                            image: Design.image,
                                            price: Design.price,
                                            side: Design.side,
                                            yaxis: Design.yaxis,
                                            xaxis: Design.xaxis,
                                            rotate: Design.rotate,
                                            size: Design.size,
                                          };
                                          dispatch(
                                            updateCustomDesign(DesignObj)
                                          );

                                          delta[0] &&
                                            (target.style.width = `${width}px`);
                                          delta[1] &&
                                            (target.style.height = `${height}px`);
                                        }}
                                        onResizeEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        /* scalable */
                                        /* Only one of resizable, scalable, warpable can be used. */
                                        // scalable={true}
                                        throttleScale={0}
                                        onScaleStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onScale={({
                                          target,
                                          scale,
                                          dist,
                                          delta,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log("onScale scale", scale);
                                          target.style.transform = transform;
                                        }}
                                        onScaleEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          console.log(
                                            "onScaleEnd",
                                            target,
                                            isDrag
                                          );
                                        }}
                                        /* rotatable */
                                        rotatable={true}
                                        throttleRotate={0}
                                        onRotateStart={({
                                          target,
                                          clientX,
                                          clientY,
                                        }) => {}}
                                        onRotate={({
                                          target,
                                          delta,
                                          dist,
                                          transform,
                                          clientX,
                                          clientY,
                                        }) => {
                                          target.style.transform = transform;
                                        }}
                                        onRotateEnd={({
                                          target,
                                          isDrag,
                                          clientX,
                                          clientY,
                                        }) => {
                                          const DesignObj = {
                                            uniqueID: Design.uniqueID,
                                            sku: "",
                                            id: Design.id,
                                            category_id: Design.category_id,
                                            category_name: Design.category_name,
                                            subcategory_id:
                                              Design.subcategory_id,
                                            subcategory_name:
                                              Design.subcategory_name,
                                            height: Design.height,
                                            width: Design.width,
                                            image: Design.image,
                                            price: Design.price,
                                            side: Design.side,
                                            yaxis: Design.yaxis,
                                            xaxis: Design.xaxis,
                                            rotate: target.style.transform,
                                            size: Design.size,
                                          };
                                          dispatch(
                                            updateCustomDesign(DesignObj)
                                          );
                                        }}
                                        // Enabling pinchable lets you use events that
                                        // can be used in draggable, resizable, scalable, and rotateable.
                                        pinchable={true}
                                        onPinchStart={({
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
                                          console.log("onPinchStart");
                                        }}
                                        onPinch={({
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinch event occur before drag, rotate, scale, resize
                                          console.log("onPinch");
                                        }}
                                        onPinchEnd={({
                                          isDrag,
                                          target,
                                          clientX,
                                          clientY,
                                          datas,
                                        }) => {
                                          // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
                                          console.log("onPinchEnd");
                                        }}
                                      />
                                    </Box>
                                  );
                                }
                              })}
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        height="800px"
                        image="https://api-designtool.optech.pk/default-image/front.png"
                        sx={{ objectFit: "contain" }}
                      />
                    )}
                  </Grid>

                  {/* All Images Section */}

                  <Grid item xs="12" mt="20px">
                    <Grid
                      container
                      paddingLeft={"20px"}
                      gap="20px"
                      justifyContent={"start"}
                    >
                      {Product.map((Items) => (
                        <Grid
                          item
                          xs="2"
                          sx={{
                            height: "120px",
                            borderRadius: "10px",
                            boxShadow:
                              "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                            cursor: "pointer",
                          }}
                        >
                          <CardMedia
                            component="img"
                            alt={`Image Side ${Items.img_name}`}
                            height="100%"
                            image={Items.image}
                            sx={{ objectFit: "contain" }}
                            onClick={() => {
                              HandleMainImage(Items);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          {/* Modals----------> */}
          <Box>
            <ResponsiveDialog open={open} close={HandleDialog} />
            <ImageModal
              open={openImageModal}
              close={handleImageModal}
              Image={selectedModalImage}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default C_product;
