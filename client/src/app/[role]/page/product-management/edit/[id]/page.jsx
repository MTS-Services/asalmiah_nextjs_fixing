/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import Loading from "@/app/[role]/loading";
import MyEditor from "@/app/components/Editor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "ckeditor5/ckeditor5.css";
import { useFormik } from "formik";
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { SketchPicker } from "react-color";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa";
import { IoMdAdd, IoMdRemoveCircle } from "react-icons/io";
import { IoCloudUploadSharp } from "react-icons/io5";
import { AsyncPaginate } from "react-select-async-paginate";
import CreatableSelect from "react-select/creatable";
import * as yup from "yup";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  ADMIN_GET_SEARCH_SUBCATEGORY_API,
  DELETE_PRODUCT_IMAGE,
  EDIT_PRODUCT_API,
  GET_COMPANY_API,
  GET_SEARCH_CATEGORY_API,
  GET_SEARCH_CLASSIFICATION_API,
  GET_SEARCH_CLASS_API,
  PRODUCT_DETAILS_ADMIN,
} from "../../../../../../../services/APIServices";
import { productCountryCode } from "../../../../../../../utils/CountryCode";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import {
  filterPassedTime,
  formatCurrency,
  generatePromocode,
  getLinkHref,
  restrictAlpha,
  restrictAlphaWithDecimal,
} from "../../../../../../../utils/helper";
import "../../add/page.scss";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  const { id } = useParams();
  const router = useRouter();
  const isSlider = useSlider();
  const [couponServiceState, setCouponServiceState] = useState();
  const [countryCompany, setCountryCompany] = useState();
  let queryClient = useQueryClient();
    const detail = useDetails();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_PRODUCT_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId,`/page/product-management`));
    },
  });
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    resetForm,
    setValues,
    setFieldValue,
    setFieldTouched,
    setField,
  } = useFormik({
    initialValues: {
      productName: "",

      description: "",

      categoryId: "",
      subcategoryId: "",
      material: "",
      price: "",
      productImg: [],
      size: [
        {
          mrp: "",
          price: "",
          sizes: "",
          discount: "",
        },
      ],
      imagePreview: [],
      quantity: "",
      mrpPrice: "",
      // latitude: "",
      // longitude: "",
      // address: "",
      weight: "",
      model: "",
      modelNumber: "",
      productCode: generatePromocode(),
      serialCode: "",
      power: "",
      madeIn: "",
      warranty: "",
      deliveryCost: "",
      pickupCost: "",
      discount: "",
      prepareTime: "",
      // branchId: "",
      company: "",
      color: [],
      classification: "",
      class: "",
      startDate: "",
      endDate: "",
      termsCondition: "",
      // returnPolicy: "",
      couponValidity: "",
      offerContent: "",
      order: "",
      isDelivered: "",
      // ARABIC
      productArabicName: "",
      arabicDescription: "",
      arabicTermsCondition: "",
      arabicOfferContent: "",
      // arabicReturnPolicy: "",
    },

    validationSchema: yup.object().shape(
      {
        productName: yup
          .string()
          .required("Product Name is required")
          .label("Product Name")
          .trim(),
        isDelivered: yup.string().label("Delivered"),

        // .matches(
        //   /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
        //   "Please enter a valid Name, it must contain at least one letter"
        // ),

        // categoryId: yup
        //   .object()
        //   .required("Category is required")
        //   .label("Category"),
        // subcategoryId: yup
        //   .object()
        //   .required("Classification is required")
        //   .label("Classification"),
        description: yup
          .string()
          .trim()
          .required("Description is required")
          .label("Description"),

        company: yup.object().required("Company is required").label("Company"),
        classification: yup.object().required("Classification is required").label("Classification"),
        class: yup.object().required("Class is required").label("Class"),

        mrpPrice: yup.string().when("size", {
          is: (size) => !size?.at(0)?.mrp,
          then: () =>
            yup.string().required("MRP Price is required").label("MRP Price"),
        }),
        price: yup.string().when("size", {
          is: (size) => !size?.at(0)?.mrp,
          then: () =>
            yup
              .string()
              .required("Price is required")
              .label("Price")
              .test(
                "mrpPriceGreaterThanPrice",
                "Price should be less than MRP or Price should not equal to MRP",
                function (price) {
                  return this.parent.mrpPrice > parseFloat(price);
                }
              ),
        }),

        discount: yup.string().when("size", {
          is: (size) => !size?.at(0)?.mrp,
          then: () =>
            yup
              .string()

              .label("discount")
              .test(
                "range",
                "Discount must be between 0.1 and 100",
                (val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 100
              ),
        }),

        size: yup.array().when("mrpPrice", {
          is: (mrpPrice) => !mrpPrice,
          then: () =>
            yup.array().of(
              yup.object().shape({
                mrp: yup.number().required("MRP is required"),
                price: yup
                  .number()
                  .required("Price is required")
                  .test(
                    "mrpPriceGreaterThanPrice",
                    "Price should be less than MRP or Price should not equal to MRP",
                    function (price) {
                      return this.parent.mrp > parseFloat(price);
                    }
                  ),
                discount: yup
                  .string()
                  .required()
                  .label("Discount")
                  .test(
                    "range",
                    "Discount must be between 0.1 and 100",
                    (val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 100
                  ),
                sizes: yup.object().shape({
                  value: yup
                    .string()
                    .required("Size value is required")
                    .label("Size"),
                  label: yup.string().required("Size label is required"),
                }),
              })
            ),
        }),

        imagePreview: yup
          .mixed()
          .when("productImg", {
            is: (value) => !value?.length,
            then: () =>
              yup.array().min(1, "At least one image or video is required."),
          })
          .when(([file], schema) => {
            if (file?.length > 0) {
              return yup
                .array()
                .of(
                  yup
                    .mixed()
                    .test("fileType", "Unsupported file format", (value) => {
                      if (value) {
                        return [
                          "image/jpeg",
                          "image/jpg",
                          "image/png",
                          "video/mp4",
                          "video/avi",
                          "video/mov",
                          "video/mpeg",
                          "video/quicktime",
                        ]?.includes(value?.type);
                      }
                      return true;
                    })
                    .test(
                      "is-valid-size",
                      "Max allowed size is 50 MB",
                      (value) => value && value.size <= 52428800 // Update to 50 MB (52428800 bytes)
                    )
                )
                .max(5, "Only 5 product images or videos are allowed");
            }
            return schema;
          }),
        productCode: yup.string().required().label("Product Code").trim(),
        deliveryCost: yup
          .string()
          .required("Delivery Cost is required")
          .label("Delivery Cost"),
        pickupCost: yup
          .string()
          .required("Pick Cost is required")
          .label("Pick Cost"),

        quantity: yup
          .string()
          .required("Quantity is required")
          .label("Quantity")
          .trim(),
        classification: yup.object().required().label("Classification"),
        startDate: yup.string().label("Select start date").required(),
        endDate: yup
          .string()
          .label("Select end date")
          .required()
          .test(
            "is-greater-than-or-equal",
            "End date must be greater than or equal to the current date",
            function (value) {
              if (!value) return false; // If value is not provided, return false
              return new Date(value) >= new Date(currentDate);
            }
          ),
        // termsCondition: yup.string().label("Terms and Conditions").required(),
        // returnPolicy: yup.string().label("Return Policy").required(),

        couponValidity: yup.string().when("company", {
          is: (value) => value?.couponService == true,

          then: () => yup.string().label("Coupon Validity").required(),
        }),
        // offerContent: yup.string().label("Offer Content").required(),
        // ARABIC
        productArabicName: yup
          .string()
          .required("Product Name (In Arabic) is required")
          .label("Product Name (In Arabic)")
          .trim(),
        arabicDescription: yup
          .string()
          .required("Description (In Arabic) is required")
          .label("Description (In Arabic)")
          .trim(),
        // arabicTermsCondition: yup
        //   .string()
        //   .required("Terms of use (In Arabic) is required")
        //   .label("Terms of use (In Arabic)")
        //   .trim(),
        // arabicOfferContent: yup
        //   .string()
        //   .required("Offer Content (In Arabic) is required")
        //   .label("Offer Content (In Arabic)")
        //   .trim(),
        // arabicReturnPolicy: yup
        //   .string()
        //   .required("Return Policy (In Arabic) is required")
        //   .label("Return Policy (In Arabic)")
        //   .trim(),
        // order: yup.string().label("Order").required(),
      },
      [
        ["mrpPrice", "size"], // Define order of dependencies
      ]
    ),

    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("productName", values?.productName);
      formData.append("isDelivered", values?.isDelivered);
      formData.append("description", values?.description);
      // formData.append("categoryId", values?.categoryId.value);
      // formData.append("subcategoryId", values?.subcategoryId.value);
      // formData.append("branchId", values?.branchId.value);
      formData.append("company", values?.company.value);
      formData.append("material", values?.material);
      formData.append("price", values?.mrpPrice ? values?.price : "");
      formData.append("mrpPrice", values?.mrpPrice);
      formData.append("weight", values?.weight);
      formData.append("model", values?.model);
      formData.append("modelNumber", values?.modelNumber);
      formData.append("productCode", values?.productCode);
      formData.append("serialCode", values?.serialCode);
      formData.append("power", values?.power);
      formData.append("madeIn", values?.madeIn);
      formData.append("warranty", values?.warranty);
      formData.append("deliveryCost", values?.deliveryCost);
      formData.append("pickupCost", values?.pickupCost);
      formData.append(
        "discount",
        values?.mrpPrice == 0 ? "" : values?.discount
      );
      formData.append("prepareTime", values?.prepareTime);
      formData.append("offerContent", values?.offerContent);
      formData.append("quantity", values?.quantity);
      formData.append("classification", values?.classification.value);
      formData.append("classId", values?.class.value);
      formData.append("startDate", new Date(values?.startDate));
      formData.append("endDate", new Date(values?.endDate));
      formData.append("termsCondition", values?.termsCondition ?? "");
      // formData.append("returnPolicy", values?.returnPolicy ?? "");
      // formData.append("longitude", values?.longitude);
      // formData.append("latitude", values?.latitude);
      // formData.append("address", values?.address);

      if (values?.order) {
        formData.append("order", values?.order);
      }

      // if (values?.size) {
      //   let sizeData = values?.size.reduce((acc, size) => {
      //     acc.push({
      //       mrp: size.mrp,
      //       price: size.price,
      //       sizes: size.sizes.value,
      //     });
      //     return acc;
      //   }, []);

      //   formData.append("size", JSON.stringify(sizeData));
      // }

      if (values?.size && !values?.mrpPrice) {
        values?.size.forEach((size, index) => {
          formData.append(`size[${index}][mrp]`, size.mrp ?? "");
          formData.append(`size[${index}][price]`, size.price ?? "");
          formData.append(`size[${index}][discount]`, size.discount ?? "");
          // if (size?.sizes?.value) {
          formData.append(`size[${index}][sizes]`, size?.sizes?.value ?? "");
          // }
        });
      }

      if (values?.color) {
        values?.color.forEach((size, index) => {
          formData.append(`color[${index}]`, size.value);
        });
      }
      // formData.append("color", values?.color);

      // Append product images to formData
      if (values?.imagePreview.length) {
        values?.imagePreview.forEach((i) => formData.append("productImg", i));
      }
      if (couponServiceState) {
        formData.append("couponValidity", new Date(values?.couponValidity));
      }
      // ARABIC
      formData.append("productArabicName", values?.productArabicName);
      formData.append("arabicDescription", values?.arabicDescription);
      formData.append("arabicTermsCondition", values?.arabicTermsCondition);
      formData.append("arabicOfferContent", values?.arabicOfferContent);
      // formData.append("arabicReturnPolicy", values?.arabicReturnPolicy);
      mutate(formData);
    },
  });

  const searchCategoryList = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_CATEGORY_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.category,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };
  const searchSubCategoryList = async (search, loadedOptions, { page }) => {
    let resp = await ADMIN_GET_SEARCH_SUBCATEGORY_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search,
      values?.categoryId?.value
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.subcategory,
        value: i?._id,
      })),
      // hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };
  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(page, search, constant?.ACTIVE);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
        couponService: i?.couponService,
        country: i?.country,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  const searchClassificationList = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_CLASSIFICATION_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.name,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  // const branchList = async (search, loadedOptions, { page }) => {
  //   let resp = await GET_BRANCH_API(
  //     page,
  //     search,
  //     constant?.ACTIVE,
  //     values?.company.value
  //   );
  //   let array = await resp?.data?.data;

  //   return {
  //     options: array?.map((i) => ({
  //       label: i?.branchName,
  //       value: i?._id,
  //     })),
  //     // hasMore: resp?.data?.data?.length > 0 ? true : false,
  //     // additional: {
  //     //   page: page + 1,
  //     // },
  //   };
  // };

  const { refetch } = useQuery({
    queryKey: ["product-single-view", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await PRODUCT_DETAILS_ADMIN(id);
      setCouponServiceState(resp?.data?.data?.companyDetails?.couponService);
      setValues({
        ...values,
        productName: resp?.data?.data?.productName ?? "",

        description: resp?.data?.data?.description ?? "",

        material: resp?.data?.data?.material ?? "",
        price: resp?.data?.data?.price ?? "",
        quantity: resp?.data?.data?.quantity ?? "",
        mrpPrice: resp?.data?.data?.mrpPrice ?? "",
        weight: resp?.data?.data?.weight ?? "",
        model: resp?.data?.data?.model ?? "",
        modelNumber: resp?.data?.data?.modelNumber ?? "",
        productCode: resp?.data?.data?.productCode ?? "",
        serialCode: resp?.data?.data?.serialCode ?? "",
        power: resp?.data?.data?.power ?? "",
        madeIn: resp?.data?.data?.madeIn ?? "",
        warranty: resp?.data?.data?.warranty ?? "",
        deliveryCost: resp?.data?.data?.deliveryCost ?? "",
        pickupCost: resp?.data?.data?.pickupCost ?? "",
        discount: resp?.data?.data?.discount ?? "",
        prepareTime: resp?.data?.data?.prepareTime ?? "",
        quantity: resp?.data?.data?.quantity ?? "",
        color: resp?.data?.data?.color?.map((i) => ({ label: i, value: i })),
        // size: resp?.data?.data?.size?.map((i) => ({ label: i, value: i })),

        size: resp?.data?.data?.size.map((i) => ({
          sizes: i.sizes ? { value: i.sizes, label: i.sizes } : "",
          price: i.price,
          mrp: i.mrp,
          discount: i.discount,
        })),
        isDelivered: resp?.data?.data?.isDelivered ?? "",
        productImg: resp?.data?.data?.productImg,
        classification: {
          value: resp?.data?.data?.classification?._id ?? "",
          label: resp?.data?.data?.classification?.name ?? "",
        },
        class: {
          value: resp?.data?.data?.class?._id ?? "",
          label: resp?.data?.data?.class?.name ?? "",
        },
        // categoryId: {
        //   value: resp?.data?.data?.categoryDetails?._id ?? "",
        //   label: resp?.data?.data?.categoryDetails?.category ?? "",
        // },
        // subcategoryId: {
        //   value: resp?.data?.data?.subCategoryDetails?._id ?? "",
        //   label: resp?.data?.data?.subCategoryDetails?.subcategory ?? "",
        // },

        // branchId: {
        //   value: resp?.data?.data?.branchId ?? "",
        //   label: resp?.data?.data?.branchDetails?.branchName ?? "",
        // },

        company: {
          label: resp?.data?.data?.companyDetails?.company,
          value: resp?.data?.data?.companyDetails?._id,
          couponService: resp?.data?.data?.companyDetails?.couponService,
        },
        termsCondition: resp?.data?.data?.termsCondition,
        // returnPolicy: resp?.data?.data?.returnPolicy,
        startDate: resp?.data?.data?.startDate,
        endDate: resp?.data?.data?.endDate,
        couponValidity: resp?.data?.data?.companyDetails?.couponService
          ? resp?.data?.data?.couponValidity
          : "",
        offerContent: resp?.data?.data?.offerContent,
        order: resp?.data?.data?.order,
        // longitude: resp?.data?.data?.location?.coordinates?.at(0),
        // latitude: resp?.data?.data?.location?.coordinates?.at(1),
        // address: resp?.data?.data?.address,
        // ARABIC
        productArabicName: resp?.data?.data?.productArabicName,
        arabicDescription: resp?.data?.data?.arabicDescription,
        arabicTermsCondition: resp?.data?.data?.arabicTermsCondition,
        arabicOfferContent: resp?.data?.data?.arabicOfferContent,
        // arabicReturnPolicy: resp?.data?.data?.arabicReturnPolicy,
      });

      return resp?.data?.data;
    },
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  const imageMutation = useMutation({
    mutationFn: (parms) => DELETE_PRODUCT_IMAGE(id, parms),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch()
    },
  });

  const options = [
    { label: "XS", value: "XS" },
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
    { label: "XL", value: "XL" },
    { label: "XXL", value: "XXL" },
    { label: "XXXL", value: "XXXL" },
  ];

  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    const newColor = { value: color.hex, label: color.hex };

    const colorExists = values?.color.some(
      (existingColor) => existingColor.value === newColor.value
    );

    if (!colorExists) {
      setFieldValue("color", [...values?.color, newColor]);
    } else {
      toastAlert("error", "This color has already been selected!");
    }

    setShowColorPicker(false);
  };

  const handleSelectClick = () => {
    setShowColorPicker(true);
  };

  const addSizes = (e) => {
    e.preventDefault();
    const list = [...values?.size];
    list.push({
      mrp: "",
      price: "",
      sizes: "",
      discount: "",
    });
    setFieldValue("size", list);
  };

  const handleRemoveSize = (e, index) => {
    e.preventDefault();
    const list = [...values?.size];
    list.splice(index, 1);
    setFieldValue("size", list);
  };

  const calculateDiscount = (mrp, price) => {
    if (mrp > 0 && price > 0) {
      const discount = ((mrp - price) / mrp) * 100;
      return discount.toFixed(2);
    } else {
      return 0;
    }
  };

  const calculateDiscounts = (mrpPrice, price) => {
    if (mrpPrice > 0 && price > 0) {
      const discount = ((mrpPrice - price) / mrpPrice) * 100;
      return discount.toFixed(2);
    } else {
      return 0;
    }
  };

  const calculateSellingPrice = (mrpPrice, discount) => {
    if (mrpPrice && discount) {
      if (discount > 100) {
        discount = 100;
      }
      const discountAmount = (mrpPrice * discount) / 100;
      const sellingPrice = mrpPrice - discountAmount;
      return sellingPrice < 0 ? 0 : sellingPrice;
    }
    return 0;
  };

  const handlePlaces = (place) => {
    setFieldValue("address", place?.formatted_address);
    setFieldValue("latitude", place?.geometry?.location?.lat());
    setFieldValue("longitude", place?.geometry?.location?.lng());
  };

  const searchClassList = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_CLASS_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.name,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
            href={getLinkHref(detail?.roleId, '/page/product-management')}
                className="text-capitalize text-black"
              >
                Product management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Edit Product</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Product</h5>
                <Link
                  href={getLinkHref(detail?.roleId, '/page/product-management')}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Product Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="productName"
                          placeholder="Enter Product Name"
                          onChange={handleChange}
                          value={values?.productName}
                          autoComplete="off"
                        />
                        {touched?.productName && errors?.productName ? (
                          <span className="error">
                            {touched?.productName && errors?.productName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Product Name (In Arabic){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="productArabicName"
                          placeholder="Enter Product Arabic Name"
                          onChange={handleChange}
                          value={values?.productArabicName}
                          autoComplete="off"
                        />
                        {touched?.productArabicName &&
                        errors?.productArabicName ? (
                          <span className="error">
                            {touched?.productArabicName &&
                              errors?.productArabicName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Company
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.company}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("company", e);
                            // setFieldValue("branchId", "");
                            setCouponServiceState(e?.couponService);
                            setCountryCompany(e?.country);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Enter Company"
                        />
                        {touched.company && errors.company ? (
                          <span className="error">{errors.company}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    {/* <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Select Category
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.categoryId}
                          loadOptions={searchCategoryList}
                          onChange={(e) => {
                            setFieldValue("categoryId", e);
                            setFieldValue("subcategoryId", null);
                          }}
                          additional={{
                            page: 1,
                          }}
                          placeholder="Enter"
                        />
                        {touched.categoryId && errors.categoryId ? (
                          <span className="error">{errors.categoryId}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Select Classification
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          key={values?.categoryId?.value}
                          value={values?.subcategoryId}
                          loadOptions={searchSubCategoryList}
                          onChange={(e) => {
                            setFieldValue("subcategoryId", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          placeholder="Select the Classification"
                        />
                        {touched.subcategoryId && errors.subcategoryId ? (
                          <span className="error">{errors.subcategoryId}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col> */}

                    <Col lg={couponServiceState == true ? 3 : 6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Classification
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.classification}
                          loadOptions={searchClassificationList}
                          onChange={(e) => {
                            setFieldValue("classification", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          placeholder="Enter Classification"
                        />
                        {touched.classification && errors.classification ? (
                          <span className="error">{errors.classification}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={couponServiceState == true ? 3 : 6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Class
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.class}
                          loadOptions={searchClassList}
                          onChange={(e) => {
                            setFieldValue("class", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          placeholder="Enter Class"
                        />
                        {touched.class && errors.class ? (
                          <span className="error">{errors.class}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Start Date
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="select-date">
                          <DatePicker
                            autoComplete="off"
                            name="startDate"
                            selected={values?.startDate}
                            onChange={(date) => {
                              setFieldValue("startDate", date);
                              setFieldValue("endDate", "");
                            }}
                            placeholderText="Select start Date"
                            filterTime={filterPassedTime}
                            minDate={moment().toDate()}
                          />
                        </div>
                        {touched?.startDate && errors?.startDate ? (
                          <span className="error">
                            {touched?.startDate && errors?.startDate}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          End Date
                          <span className="text-danger">*</span>
                        </Form.Label>

                        <div className="select-date">
                          <DatePicker
                            autoComplete="off"
                            name="endDate"
                            selected={values?.endDate}
                            onChange={(date) => setFieldValue("endDate", date)}
                            placeholderText="Select end Date"
                            filterTime={filterPassedTime}
                            minDate={values?.startDate}
                          />
                        </div>

                        <span className="error">
                          {touched?.endDate && errors?.endDate}
                        </span>

                        {/* <Col lg={4} className="mx-auto">
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Coupon Validity
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="select-date">
                              <DatePicker
                                name="couponValidity"
                                selected={values?.couponValidity}
                                onChange={(date) => {
                                  setFieldValue("couponValidity", date);
                                }}
                                placeholderText="Select coupon validity"
                                filterTime={filterPassedTime}
                                minDate={values?.startDate}
                              />
                            </div>
                            {touched?.couponValidity &&
                            errors?.couponValidity ? (
                              <span className="error">
                                {touched?.couponValidity &&
                                  errors?.couponValidity}
                              </span>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                        </Col> */}

                        {/* <span className="calender-icon">
                            <FaCalendarAlt />
                          </span> */}
                      </Form.Group>
                    </Col>

                    {couponServiceState == true ? (
                      <Col lg={3}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Coupon Validity
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <div className="select-date">
                            <DatePicker
                              autoComplete="off"
                              name="couponValidity"
                              selected={values?.couponValidity}
                              onChange={(date) => {
                                setFieldValue("couponValidity", date);
                              }}
                              placeholderText="Select coupon validity"
                              filterTime={filterPassedTime}
                              minDate={values?.startDate}
                            />
                          </div>
                          {touched?.couponValidity && errors?.couponValidity ? (
                            <span className="error">
                              {touched?.couponValidity &&
                                errors?.couponValidity}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Delivery Cost ({formatCurrency("", countryCompany)})
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="deliveryCost"
                          placeholder="Enter Delivery Cost"
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue("pickupCost", e?.target?.value);
                          }}
                          value={values?.deliveryCost}
                          onKeyPress={restrictAlphaWithDecimal}
                        />
                        {touched?.deliveryCost && errors?.deliveryCost ? (
                          <span className="error">
                            {touched?.deliveryCost && errors?.deliveryCost}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Pick Cost ({formatCurrency("", countryCompany)})
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="pickupCost"
                          placeholder="Enter Pick Cost"
                          onChange={handleChange}
                          value={values?.pickupCost}
                          onKeyPress={restrictAlphaWithDecimal}
                        />
                        {touched?.pickupCost && errors?.pickupCost ? (
                          <span className="error">
                            {touched?.pickupCost && errors?.pickupCost}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Can be Delivered?
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="isDelivered"
                          onChange={handleChange}
                          value={values?.isDelivered}
                        >
                          <option value={true}>Yes</option>
                          <option value={false}>No</option>
                        </Form.Select>
                        {touched?.isDelivered && errors?.isDelivered ? (
                          <span className="error">
                            {touched?.isDelivered && errors?.isDelivered}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    {!values?.mrpPrice ? (
                      <Form.Label className="fw-bold">Size</Form.Label>
                    ) : (
                      ""
                    )}

                    {!values?.mrpPrice ? (
                      <Col lg={6}>
                        <Form.Group className="mb-3">
                          {values?.size?.map((size, index) => {
                            return (
                              <div key={index}>
                                <Row>
                                  <Col md={4}>
                                    <Form.Label>
                                      MRP ({formatCurrency("", countryCompany)})
                                    </Form.Label>
                                    <Form.Control
                                      type="number"
                                      autoComplete="off"
                                      value={size.mrp}
                                      min={0}
                                      maxLength={10}
                                      onChange={(e) => {
                                        const updatedSizes = [...values?.size];
                                        updatedSizes[index].mrp =
                                          e.target.value;
                                        setFieldValue("size", updatedSizes);
                                        const discountAmount =
                                          calculateDiscount(
                                            e.target.value,
                                            size.price
                                          );
                                        updatedSizes[index].discount =
                                          discountAmount;
                                        setFieldValue("size", updatedSizes);

                                        if (!values?.size[index]?.mrp) {
                                          const updatedSizes = [
                                            ...values?.size,
                                          ];
                                          updatedSizes[index].sizes = "";
                                          setFieldValue("size", updatedSizes);
                                        }

                                        setFieldValue("discount", "");
                                        setFieldValue("mrpPrice", "");
                                        setFieldValue("price", "");
                                      }}
                                      onBlur={handleBlur}
                                      placeholder="MRP"
                                      pattern="[0-9]+(\.[0-9]{1,2})?"
                                      name={`size.${index}.mrp`}
                                      onKeyPress={restrictAlpha}
                                    />
                                    <span className="error">
                                      {touched.size?.length &&
                                      errors.size?.length
                                        ? errors.size[index]?.mrp
                                        : ""}
                                    </span>
                                  </Col>
                                  <Col md={4}>
                                    <Form.Label>
                                      Selling Price (
                                      {formatCurrency("", countryCompany)})
                                    </Form.Label>

                                    <Form.Control
                                      type="number"
                                      autoComplete="off"
                                      value={size.price}
                                      min={0}
                                      maxLength={10}
                                      onChange={(e) => {
                                        const updatedSizes = [...values?.size];
                                        updatedSizes[index].price =
                                          e.target.value;
                                        setFieldValue("size", updatedSizes);
                                        const discountAmount =
                                          calculateDiscount(
                                            size.mrp,
                                            e.target.value
                                          );
                                        updatedSizes[index].discount =
                                          discountAmount;
                                        setFieldValue("size", updatedSizes);
                                      }}
                                      onBlur={handleBlur}
                                      placeholder="Price"
                                      pattern="[0-9]+(\.[0-9]{1,2})?"
                                      name={`size.${index}.price`}
                                      onKeyPress={restrictAlpha}
                                    />
                                    <span className="error">
                                      {touched.size?.length &&
                                      errors.size?.length
                                        ? errors.size[index]?.price
                                        : ""}
                                    </span>
                                  </Col>
                                  <Col md={4}>
                                    <Form.Label>Discount (%)</Form.Label>

                                    <Form.Control
                                      type="number"
                                      autoComplete="off"
                                      value={size.discount}
                                      onChange={(e) => {
                                        const discountPercentage =
                                          e.target.value;
                                        const updatedSizes = [...values?.size];
                                        // const mrp = size.mrp;
                                        // const price =
                                        //   mrp -
                                        //   (mrp * discountPercentage) / 100;
                                        // updatedSizes[index].price = price;
                                        updatedSizes[index].discount =
                                          e.target.value;
                                        setFieldValue("size", updatedSizes);
                                      }}
                                      placeholder="Discount (%)"
                                      name={`size.${index}.discount`}
                                    />
                                    <span className="error">
                                      {touched.size?.length &&
                                      errors.size?.length
                                        ? errors.size[index]?.discount
                                        : ""}
                                    </span>
                                  </Col>
                                  <Col md={4}>
                                    <CreatableSelect
                                      className="my-3"
                                      options={options}
                                      placeholder="Select or create size"
                                      name={`size.${index}.sizes`}
                                      value={size.sizes}
                                      formatOptionLabel={(option) =>
                                        option.label
                                      }
                                      onChange={(e) => {
                                        const updatedSizes = [...values?.size];
                                        updatedSizes[index].sizes = e;
                                        setFieldValue("size", updatedSizes);
                                      }}
                                      isClearable
                                    />
                                    <span className="error">
                                      {touched.size?.length &&
                                      errors.size?.length
                                        ? errors.size[index]?.sizes?.value
                                        : ""}
                                    </span>

                                    <div className=" d-flex align-items-center gap-2 mt-3">
                                      {index != 0 && (
                                        <span
                                          className="remove-btn btn btn_theme"
                                          onClick={(e) =>
                                            handleRemoveSize(e, index)
                                          }
                                        >
                                          <IoMdRemoveCircle />
                                        </span>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })}

                          <span
                            className="add-btn btn btn_theme mt-3"
                            onClick={addSizes}
                          >
                            <IoMdAdd />
                          </span>
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    {!values?.size?.at(0)?.mrp &&
                    !values?.size?.at(0)?.price &&
                    !values?.size?.at(0)?.sizes ? (
                      <>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              MRP Price ({formatCurrency("", countryCompany)})
                            </Form.Label>
                            <Form.Control
                              autoComplete="off"
                              type="number"
                              min={0}
                              maxLength={10}
                              placeholder="Enter MRP"
                              name="mrpPrice"
                              value={values?.mrpPrice}
                              onChange={(e) => {
                                if (!e.target.value) {
                                  setFieldValue("discount", "");
                                  setFieldValue("price", "");
                                }

                                setFieldValue("mrpPrice", e.target.value);
                                const mrpPrice = e.target.value;
                                const price = values?.price;
                                const discount = calculateDiscounts(
                                  mrpPrice,
                                  price
                                );
                                setFieldValue("discount", discount);
                              }}
                              onBlur={handleBlur}
                              pattern="[0-9]+(\.[0-9]{1,2})?"
                              onKeyPress={restrictAlphaWithDecimal}
                            />
                            <span className="error">
                              {touched.mrpPrice && errors.mrpPrice
                                ? errors.mrpPrice
                                : ""}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Selling Price (
                              {formatCurrency("", countryCompany)})
                            </Form.Label>
                            <Form.Control
                              autoComplete="off"
                              type="Number"
                              min={0}
                              placeholder="Price"
                              name="price"
                              maxLength={10}
                              value={values?.price}
                              onChange={(e) => {
                                setFieldValue("price", e.target.value);

                                const price = e.target.value;
                                const mrpPrice = values?.mrpPrice;
                                const discount = calculateDiscounts(
                                  mrpPrice,
                                  price
                                );
                                setFieldValue("discount", discount);
                              }}
                              onBlur={handleBlur}
                              readOnly={false}
                              onKeyPress={restrictAlphaWithDecimal}
                            />
                            <span className="error">
                              {touched.price && errors.price
                                ? errors.price
                                : ""}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col lg={6} className="mx-auto">
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                              Discount(%)
                            </Form.Label>
                            <Form.Control
                              autoComplete="off"
                              className="form-control"
                              type="text"
                              name="discount"
                              max={100}
                              maxLength={5}
                              placeholder="Enter discount (%)"
                              value={values?.discount}
                              onChange={(e) => {
                                // handleChange(e);
                                const discount = e.target.value;
                                setFieldValue("discount", discount);
                                // const mrpPrice = values?.mrpPrice;
                                // const sellingPrice = calculateSellingPrice(
                                //   mrpPrice,
                                //   discount
                                // );
                                // setFieldValue("price", sellingPrice);
                              }}
                              onKeyPress={restrictAlphaWithDecimal}
                            />
                            {touched.discount && errors.discount
                              ? errors.discount
                              : ""}
                          </Form.Group>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Quantity<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          type="text"
                          placeholder="Quantity"
                          name="quantity"
                          value={values?.quantity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyDown={restrictAlpha}
                        />
                        <span className="error">
                          {touched?.quantity && errors?.quantity}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Weight(Kg)
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="weight"
                          placeholder="Enter Weight"
                          onChange={handleChange}
                          value={values?.weight}
                          // onKeyPress={restrictAlpha}
                        />
                        {touched?.weight && errors?.weight ? (
                          <span className="error">
                            {touched?.weight && errors?.weight}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Material
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          placeholder="Material"
                          name="material"
                          value={values?.material}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {/* 
                        {touched?.material && errors?.material ? (
                          <span className="error">
                            {touched?.material && errors?.material}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Color
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>

                        <CreatableSelect
                          isMulti
                          name="color"
                          // options={colorOptions}
                          value={values?.color}
                          onChange={(e) => setFieldValue("color", e)}
                          onBlur={() => setFieldTouched("color", true)}
                          placeholder="Select or create Color"
                          menuIsOpen={false}
                          styles={{
                            indicator: (base) => ({ ...base, display: "none" }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              display: "none",
                            }),
                            indicatorContainer: (base) => ({
                              ...base,
                              display: "none",
                            }),
                          }}
                        />

                        <Button onClick={handleSelectClick} className="mt-4">
                          Select Color
                        </Button>

                        {showColorPicker && (
                          <SketchPicker
                            color={
                              values?.color.length > 0
                                ? values?.color[values?.color.length - 1].value
                                : ""
                            }
                            onChangeComplete={handleColorChange}
                            disableAlpha={true}
                          />
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Model
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="model"
                          placeholder="Enter Model"
                          onChange={handleChange}
                          value={values?.model}
                          // onKeyPress={restrictNum1}
                        />
                        {/* {touched?.model && errors?.model ? (
                          <span className="error">
                            {touched?.model && errors?.model}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Model Number
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="modelNumber"
                          placeholder="Enter Model Number"
                          onChange={handleChange}
                          value={values?.modelNumber}
                          // onKeyPress={restrictAlpha}
                        />
                        {/* {touched?.modelNumber && errors?.modelNumber ? (
                          <span className="error">
                            {touched?.modelNumber && errors?.modelNumber}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Product Code
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="productCode"
                          maxLength={20}
                          placeholder="Enter Product Code"
                          onChange={(e) => {
                            const uppercaseValue = e.target.value.toUpperCase();

                            setFieldValue("productCode", uppercaseValue);
                          }}
                          value={values?.productCode}
                          // onKeyPress={restrictAlpha}
                        />
                        {touched?.productCode && errors?.productCode ? (
                          <span className="error">
                            {touched?.productCode && errors?.productCode}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Serial Code
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="serialCode"
                          placeholder="Enter serial Code"
                          onChange={handleChange}
                          value={values?.serialCode}
                          onKeyPress={restrictAlpha}
                        />
                        {/* {touched?.serialCode && errors?.serialCode ? (
                          <span className="error">
                            {touched?.serialCode && errors?.serialCode}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Power
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="power"
                          placeholder="Enter Power"
                          onChange={handleChange}
                          value={values?.power}
                          // onKeyPress={restrictAlpha}
                        />
                        {/* {touched?.power && errors?.power ? (
                          <span className="error">
                            {touched?.power && errors?.power}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-4 position-relative">
                        <Form.Label className="fw-bold">Made In</Form.Label>
                        <Form.Select
                          label="madeIn"
                          name="madeIn"
                          value={values?.madeIn}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select Country</option>
                          {productCountryCode &&
                            productCountryCode?.map((data, index) => {
                              return (
                                <option value={data?.country} key={index}>
                                  {`${data?.country}`}
                                </option>
                              );
                            })}
                        </Form.Select>

                        {/* {touched?.madeIn && errors?.madeIn ? (
                          <span className="error">
                            {touched?.madeIn && errors?.madeIn}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Warranty (Years)
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="warranty"
                          placeholder="Enter warranty"
                          onChange={handleChange}
                          value={values?.warranty}
                          // onKeyPress={restrictAlpha}
                        />
                        {/* {touched?.warranty && errors?.warranty ? (
                          <span className="error">
                            {touched?.warranty && errors?.warranty}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Prepare Time(minutes)
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="prepareTime"
                          placeholder="Enter PrepareTime"
                          onChange={handleChange}
                          value={values?.prepareTime}
                          onKeyPress={restrictAlphaWithDecimal}
                          onPaste={(e) => e.preventDefault()}
                        />
                        {touched?.prepareTime && errors?.prepareTime ? (
                          <span className="error">
                            {touched?.prepareTime && errors?.prepareTime}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Description
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <MyEditor
                          value={values?.description}
                          onChange={(value) =>
                            setFieldValue("description", value)
                          }
                        />
                        {touched.description && errors.description ? (
                          <span className="error">{errors.description}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Description (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <MyEditor
                          value={values?.arabicDescription}
                          onChange={(value) =>
                            setFieldValue("arabicDescription", value)
                          }
                        />
                        {touched.arabicDescription &&
                        errors.arabicDescription ? (
                          <span className="error">
                            {errors.arabicDescription}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Terms of use
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <MyEditor
                          value={values?.termsCondition}
                          onChange={(value) =>
                            setFieldValue("termsCondition", value)
                          }
                        />
                        {touched.termsCondition && errors.termsCondition ? (
                          <span className="error">{errors.termsCondition}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Terms of use (In Arabic)
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <MyEditor
                          value={values?.arabicTermsCondition}
                          onChange={(value) =>
                            setFieldValue("arabicTermsCondition", value)
                          }
                        />
                        {touched.arabicTermsCondition &&
                        errors.arabicTermsCondition ? (
                          <span className="error">
                            {errors.arabicTermsCondition}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    {/* <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Return Policy
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <MyEditor
                          value={values?.returnPolicy}
                          onChange={(value) =>
                            setFieldValue("returnPolicy", value)
                          }
                        />
                        {touched.returnPolicy && errors.returnPolicy ? (
                          <span className="error">{errors.returnPolicy}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Return Policy (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <MyEditor
                          value={values?.arabicReturnPolicy}
                          onChange={(value) =>
                            setFieldValue("arabicReturnPolicy", value)
                          }
                        />
                        {touched.arabicReturnPolicy &&
                        errors.arabicReturnPolicy ? (
                          <span className="error">
                            {errors.arabicReturnPolicy}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col> */}
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Offer Content
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <MyEditor
                          value={values?.offerContent}
                          onChange={(value) =>
                            setFieldValue("offerContent", value)
                          }
                        />
                        {touched.offerContent && errors.offerContent ? (
                          <span className="error">{errors.offerContent}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Offer Content (In Arabic)
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <MyEditor
                          value={values?.arabicOfferContent}
                          onChange={(value) =>
                            setFieldValue("arabicOfferContent", value)
                          }
                        />
                        {touched.arabicOfferContent &&
                        errors.arabicOfferContent ? (
                          <span className="error">
                            {errors.arabicOfferContent}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    {/* <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>Location</Form.Label>
                        <Autocomplete
                          apiKey={"AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"}
                          placeholder="Enter location"
                          name="address"
                          className="form-control"
                          value={values?.address}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              e.preventDefault();
                            }
                          }}
                          options={{
                            types: [],
                            // componentRestrictions: { country: "us" },
                          }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onPlaceSelected={(place) => {
                            handlePlaces(place);
                          }}
                        />
                      </Form.Group>
                    </Col> */}
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority Order</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          type="text"
                          placeholder="Enter Priority Order"
                          name="order"
                          value={values?.order}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyPress={restrictAlpha}
                        />
                      </Form.Group>
                    </Col>

                    {/* image  */}
                    <Col lg={12} className="mx-auto">
                      <Row>
                        <Col className="mb-2" lg={2}>
                          <label className="image-picker">
                            <input
                              type="file"
                              name="imagePreview"
                              className="d-none"
                              onChange={(e) =>
                                setFieldValue("imagePreview", [
                                  ...values?.imagePreview,
                                  ...e.target.files,
                                ])
                              }
                              multiple
                              accept="image/*,video/*"
                            />
                            Upload Image/Video
                            <div>
                              <IoCloudUploadSharp />
                            </div>
                          </label>
                        </Col>
                        {values?.imagePreview?.map((item, index) => {
                          return (
                            <Col className="picked-img mb-2" lg={2} key={index}>
                              {item?.type ? (
                                item?.type?.includes("image") ? (
                                  <img
                                    src={URL.createObjectURL(item)}
                                    className="preview-img"
                                  />
                                ) : (
                                  <video
                                    width="100%"
                                    height="100%"
                                    controls
                                    src={URL.createObjectURL(item)}
                                  />
                                )
                              ) : (
                                <img
                                  src={URL.createObjectURL(item)}
                                  className="preview-img"
                                />
                              )}
                              <div
                                className="icon-container"
                                onClick={() => {
                                  let img = values?.imagePreview;
                                  img.splice(index, 1);
                                  setFieldValue("imagePreview", img);
                                }}
                              >
                                <FaTimes className="dark-cross-icon" />
                              </div>
                              {/* {errors?.imagePreview !==
                              "Only 5 productImg are allowed" ? (
                                <p className="text-danger">
                                  {touched?.imagePreview &&
                                    errors?.imagePreview?.at(index)}
                                </p>
                              ) : (
                                ""
                              )} */}
                            </Col>
                          );
                        })}

                        {values?.productImg?.map((item, index) => {
                          return (
                            <Col className="picked-img mb-2" lg={2} key={index}>
                              {item?.type ? (
                                item?.type?.includes("image") ? (
                                  <img src={item.url} className="preview-img" />
                                ) : (
                                  <video
                                    width="100%"
                                    height="100%"
                                    // controls
                                    src={item.url}
                                  />
                                )
                              ) : (
                                <img src={item.url} className="preview-img" />
                              )}
                              <div
                                className="icon-container"
                                onClick={() => {
                                  imageMutation?.mutate(item?._id);
                                }}
                              >
                                <FaTimes className="dark-cross-icon" />
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                    {/* {values?.imagePreview?.length == 0 ? ( */}
                    <p className="text-danger">
                      {touched?.imagePreview && errors?.imagePreview}
                    </p>
                    {/* ) : (
                      ""
                    )} */}
                    {/* {errors?.imagePreview == "Only 5 productImg are allowed" ? (
                      <p className="text-danger">
                        {touched?.imagePreview && errors?.imagePreview}
                      </p>
                    ) : (
                      ""
                    )} */}
                  </Row>
                </form>
                <div className="text-end">
                  <button
                    className="btn_theme mx-auto float-end"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={isPending}
                  >
                    {isPending ? "Submitting" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPending ? <Loading /> : null}
    </>
  );
};

export default Edit;
