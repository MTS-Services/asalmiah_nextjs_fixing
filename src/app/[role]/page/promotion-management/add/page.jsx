/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import "ckeditor5/ckeditor5.css";
import Link from "next/link";
import * as yup from "yup";
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import moment from "moment";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncPaginate } from "react-select-async-paginate";
import useDetails from "../../../../../../hooks/useDetails";
import useSlider from "../../../../../../hooks/useSlider";
import {
  ADD_PROMOTION_API,
  ADMIN_GET_SEARCH_SUBCATEGORY_API,
  GET_SEARCH_CATEGORY_API,
  GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT,
  getAdminProductLists
} from "../../../../../../services/APIServices";
import "../../../../../../styles/globals.scss";
import { countryCode } from "../../../../../../utils/CountryCode";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../utils/constants";
import {
  filterPassedTime,
  formatCurrency,
  generatePromocode,
  getLinkHref,
  restrictAlpha,
  restrictAlphaWithDecimal,
} from "../../../../../../utils/helper";
const Add = () => {
  const router = useRouter();
  const isSlider = useSlider();
  let detail = useDetails();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_PROMOTION_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();

      router.push(getLinkHref(detail?.roleId, `/page/promotion-management`));
      // queryClient.invalidateQueries({ queryKey: ["getcompany-list"] });
    },
  });

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
      role:detail?.roleId,
      country: "",
      promoCode: generatePromocode(),
      discount: "",
      type: "",
      categoryId: "",
      subcategoryId: "",
      company: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
      numberOfUsed: "",
      // forFreeDelivery: "",
      numberOfUsedUser: "",
      forFreeDelivery: 0,
      startDate: "",
      productId: "",
      endDate: "",
      actionType: "",
      cashBack: "",
      rotationCashBack: "",
      cashbackvalidity: "",
      supplierShare: "",
      excludedCompany: ""
    },

    validationSchema: yup.object().shape({
      promoCode: yup.string().required().label("Promotion Code"),

      country: yup.string().when("role", {
        is: (value) => value == constant.ADMIN ,
        then: () => yup.mixed().required().label("Country"),
      }),


      discount: yup.string().required("Discount is required"),
      // .when("forFreeDelivery", {
      //   is: (value) => value == 0,
      //   then: () =>
      //     yup
      //       .string()
      //       .test(
      //         "is-valid-discount",
      //         "Value must be greater than zero. Please enter a valid value.",
      //         (value) => {
      //           return value !== "0" && value !== "00" && value !== null;
      //         }
      //       ),
      // }),
      type: yup.string().required("Type is required"),
      startDate: yup.string().label("Select start date").required(),
      endDate: yup.string().label("Select end date").required(),
      // company: yup.string().when("type", {
      //   is: (value) => value == 3,
      //   then: () =>
      //     yup
      //       .array()
      //       .min(1, "Please select at least one company")
      //       .of(
      //         yup.object().shape({
      //           value: yup.string().required(),
      //           label: yup.string().required(),
      //         })
      //       )
      //       .required()
      //       .label("Company"),
      // }),
      categoryId: yup.string().when("type", {
        is: (value) => value == 2,
        then: () => yup.mixed().required().label("Category"),
      }),
      // excludedCompany: yup.string().when("type", {
      //   is: (value) => value == 2,
      //   then: () => yup.mixed().required().label("Excluded Company"),
      // }),

      // subcategoryId: yup.string().when("type", {
      //   is: (value) => value == 2,
      //   then: () => yup.mixed().required().label("Sub Category"),
      // }),
      minPurchaseAmount: yup
        .number()
        .required("Min purchase amount is required"),
      // maxDiscountAmount: yup
      //   .number()
      //   .required("Max discount amount is required")
      //   .positive("Max discount amount must be a positive number"),

      maxDiscountAmount: yup.string().when(["actionType", "cashBack"], {
        is: (actionType, cashBack) =>
          actionType == "1" || (actionType == 2 && cashBack == 1),
        then: () =>
          yup
            .number()
            .required("Max discount amount is required")
            .positive("Max discount amount must be a positive number"),
      }),
      numberOfUsed: yup
        .number()
        .required("Number of used is required")
        .integer("Number of used must be an integer"),

      numberOfUsedUser: yup
        .number()
        .required("Number of used is required")
        .integer("Number of used must be an integer"),

      actionType: yup.string().required("Action Type is required"),
      supplierShare: yup.string().required("Supplier share  is required"),
      cashBack: yup.string().when("actionType", {
        is: (value) => value == 2,
        then: () => yup.string().required("Cashback type is required"),
      }),
      rotationCashBack: yup.string().when("actionType", {
        is: (value) => value == 2,
        then: () => yup.string().required("Rotation cashback is required"),
      }),
      cashbackvalidity: yup.number().when("actionType", {
        is: (value) => value == 2,
        then: () =>
          yup
            .number()
            .required()
            .label("Cashback Validity")
            .min(1)
            .label("Cashback Validity")
            .max(500)
            .label("Cashback Validity"),
      }),
      // supplierShare: yup.string().when("actionType", {
      //   is: (value) => value == 2,
      //   then: () => yup.string().required("Supplier Share is required"),
      // }),
      // forFreeDelivery: yup.boolean().required("For free delivery is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        // country: values?.country,
        promoCode: values?.promoCode,
        discount: values?.discount,
        type: values?.type,
        categoryId: values?.categoryId?.value,
        subcategoryId: values?.subcategoryId?.value,
        company: values?.company
          ? values?.company?.map((data) => data?.value)
          : "",
        productId: values?.productId
          ? values?.productId?.map((data) => data?.value)
          : "",
        minPurchaseAmount: values?.minPurchaseAmount,
        maxDiscountAmount: values?.maxDiscountAmount,
        numberOfUsed: values?.numberOfUsed,
        numberOfUsedUser: values?.numberOfUsedUser,
        forFreeDelivery: values?.forFreeDelivery,
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
        actionType: values?.actionType,
        cashBackType: values?.cashBack,
        rotationCashBack: values?.rotationCashBack,
        cashbackvalidity: values?.cashbackvalidity ?? "",
        supplierShare: values?.supplierShare,
        excludedCompany: values?.excludedCompany ? values?.excludedCompany?.map((data) => data?.value) : ""
      };
      if (detail?.roleId == constant.ADMIN) {
        payload.country = values?.country
      }
      mutate(payload);
    },
  });
  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search,
      values?.country,
      values?.categoryId?.value
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },


    };
  };



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

  const onChangePromotionType = () => {
    setFieldValue("company", "");
    setFieldValue("categoryId", "");
    setFieldValue("subcategoryId", "");
    setFieldValue("productId", "");
  };

  const onChangeActionType = () => {
    setFieldValue("cashBack", "");
    setFieldValue("rotationCashBack", "");
    setFieldValue("cashbackvalidity", "");
  };

  const searchProduct = async (search, loadedOptions, { page }) => {
    let companyIds = values?.company?.map((data) => data?.value) || [];
    if (companyIds.length === 0) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: 1,
        },
      };
    }

    let resp = await getAdminProductLists(
      page,
      search,
      constant.ACTIVE,
      "",
      companyIds
    );
    let array = await resp?.data?.data;

    return {
      options:
        array?.map((i) => ({
          label: i?.productName,
          value: i?._id,
        })) || [],
      hasMore: resp?.data?.data?.length > 0,
      additional: {
        page: page + 1,
      },
    };
  };

  const handleCompanyChange = (selectedCompanies) => {
    setFieldValue("company", selectedCompanies);
    setFieldValue("productId", "");

  };

  const handleProductChange = (selectedProducts) => {
    setFieldValue("productId", selectedProducts);
  };

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link
                href={getLinkHref(detail?.roleId, "/page/promotion-management")}
                className="text-black text-capitalize"
              >
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, "/page/promotion-management")}
                className="text-capitalize text-black"
              >
                Promotion management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Promotion</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Promotion</h5>
                <Link
                  href={getLinkHref(
                    detail?.roleId,
                    "/page/promotion-management"
                  )}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    {detail?.roleId == constant.ADMIN ?            <Col lg={6}>
                      <Form.Group className="mb-4 position-relative">
                        <Form.Label>
                          Country<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          label="country"
                          name="country"
                          value={values?.country}
                          onChange={(e) => {
                            setFieldValue("country", e.target.value)
                            setFieldValue("company", "");
                            setFieldValue("productId", "");

                          }}
                          onBlur={handleBlur}
                        >
                          <option value="">Select Country</option>
                          {countryCode &&
                            countryCode?.map((data, index) => {
                              return (
                                <option value={data?.country} key={index}>
                                  {`${data?.country}`}
                                </option>
                              );
                            })}
                        </Form.Select>

                        {touched?.country && errors?.country ? (
                          <span className="error">
                            {touched?.country && errors?.country}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col> : ""}
        

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Promotion Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="promoCode"
                          placeholder="Enter promocode"
                          onChange={(e) => {
                            const uppercaseValue = e.target.value.toUpperCase();

                            setFieldValue("promoCode", uppercaseValue);
                          }}
                          value={values?.promoCode}
                          maxLength={30}
                        />
                        {touched?.promoCode && errors?.promoCode ? (
                          <span className="error">
                            {touched?.promoCode && errors?.promoCode}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div>
                        <Form.Label>Promotion Type</Form.Label>
                        <Form.Select
                          aria-label="Select Promotion Type"
                          value={values?.type}
                          onChange={(e) => {
                            handleChange(e);
                            onChangePromotionType();
                          }}
                          onBlur={handleBlur}
                          name="type"
                          className="form-control"
                        >
                          <option value="">Select Promotion Type</option>
                          <option value={1}>All</option>
                          <option value={2}>Category</option>
                          <option value={3}>Company</option>
                        </Form.Select>
                        {touched?.type && errors?.type ? (
                          <span className="error">
                            {touched?.type && errors?.type}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>

                    {values?.type === "2" && (
                      <>
                        <Col lg={6}>
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
                                setFieldValue("excludedCompany", null)
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
                              Excluded Company
                             
                            </Form.Label>
                            <AsyncPaginate
                              key={Math.random()}
                              value={values?.excludedCompany}
                              loadOptions={searchCompany}
                              onChange={(e) => {
                                setFieldValue("excludedCompany", e);

                              }}
                              additional={{
                                page: 1,
                              }}
                              placeholder="Enter excluded company"
                              isDisabled={!values?.categoryId}
                              isMulti
                            />
                          
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="">
                              Select Subcategory
                              {/* <span className="text-danger">*</span> */}
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
                              placeholder="Enter"
                            />
                            {touched.subcategoryId && errors.subcategoryId ? (
                              <span className="error">
                                {errors.subcategoryId}
                              </span>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                        </Col>
                      </>
                    )}
                    {values?.type == "3" && (
                      <>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="">Select Company</Form.Label>
                            <AsyncPaginate
                              key={values?.country}
                              value={values?.company}
                              loadOptions={searchCompany}
                              onChange={handleCompanyChange}
                              additional={{
                                page: 1,
                              }}
                              isClearable
                              placeholder="Enter"
                              isMulti
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="">Select Product</Form.Label>
                            <AsyncPaginate
                              key={Math.random()}
                              value={values.productId}
                              loadOptions={searchProduct}
                              onChange={handleProductChange}
                              onFocus={() => {
                                // Optionally trigger loading options on focus
                                searchProduct("", [], { page: 1 });
                              }}
                              additional={{
                                page: 1,
                              }}
                              isClearable
                              placeholder="Select the Product"
                              isMulti
                              isDisabled={values?.company?.length == 0}
                            />
                          </Form.Group>
                        </Col>
                      </>
                    )}

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Minimum Purchase Amount (
                          {formatCurrency("", values?.country)})
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="minPurchaseAmount"
                          autoComplete="off"
                          placeholder="Enter Minimum Purchase Amount"
                          onChange={handleChange}
                          value={values?.minPurchaseAmount}
                          onKeyPress={restrictAlphaWithDecimal}
                          maxLength={30}
                        />
                        {touched?.minPurchaseAmount &&
                          errors?.minPurchaseAmount ? (
                          <span className="error">
                            {touched?.minPurchaseAmount &&
                              errors?.minPurchaseAmount}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Number of user count{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          autoComplete="off"
                          name="numberOfUsed"
                          placeholder="Enter Number Of user count"
                          onChange={handleChange}
                          value={values?.numberOfUsed}
                          onKeyPress={restrictAlpha}
                          maxLength={30}
                        />
                        {touched?.numberOfUsed && errors?.numberOfUsed ? (
                          <span className="error">
                            {touched?.numberOfUsed && errors?.numberOfUsed}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Number of used per Users
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          autoComplete="off"
                          type="text"
                          name="numberOfUsedUser"
                          placeholder="Enter Number Of Used Per Users"
                          onChange={handleChange}
                          value={values?.numberOfUsedUser}
                          onKeyPress={restrictAlpha}
                          maxLength={30}
                        />
                        {touched?.numberOfUsedUser &&
                          errors?.numberOfUsedUser ? (
                          <span className="error">
                            {touched?.numberOfUsedUser &&
                              errors?.numberOfUsedUser}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Start Date
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="select-date">
                          <DatePicker
                            name="startDate"
                            autoComplete="off"
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

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-3">
                        <Form.Label>
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

                        {/* <span className="calender-icon">
                            <FaCalendarAlt />
                          </span> */}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mb-3">
                      <div>
                        <Form.Label>
                          Supplier Share
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select Supplier Share"
                          value={values?.supplierShare}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          name="supplierShare"
                          className="form-control"
                        >
                          <option value="">Select Supplier Share</option>
                          <option value={1}>OFFARAT</option>
                          <option value={2}>SUPPLIER</option>
                          <option value={3}>SHARE</option>
                        </Form.Select>
                        {touched.supplierShare && errors.supplierShare && (
                          <span className="error">
                            {touched.supplierShare && errors.supplierShare}
                          </span>
                        )}
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="d-flex algn-items-center">
                        <Form.Group className="mb-4 w-100 active-radio ">
                          <Form.Label>
                            Free Delivery <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="forFreeDelivery"
                            type="radio"
                            label="True"
                            id="true"
                            checked={values?.forFreeDelivery == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="forFreeDelivery"
                            type="radio"
                            label="False"
                            id="false"
                            checked={values?.forFreeDelivery == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    {/* cashback  */}

                    <Col lg={6}>
                      <div>
                        <Form.Label>
                          Action Type
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select Action Type"
                          value={values?.actionType}
                          onChange={(e) => {
                            handleChange(e);

                            if (values?.actionType == "1") {
                              onChangeActionType();
                            }
                          }}
                          onBlur={handleBlur}
                          name="actionType"
                          className="form-control"
                        >
                          <option value="">Select Action Type</option>
                          <option value={1}>Promotion</option>
                          <option value={2}>CashBack</option>
                        </Form.Select>
                        {touched.actionType && errors.actionType && (
                          <span className="error">
                            {touched.actionType && errors.actionType}
                          </span>
                        )}
                      </div>
                    </Col>

                    {values?.actionType == "2" && (
                      <>
                        <Col lg={6} className="mb-3">
                          {" "}
                          {/* Add margin-bottom to create space */}
                          <div>
                            <Form.Label>Cashback Type</Form.Label>
                            <Form.Select
                              aria-label="Select Cashback Type"
                              value={values?.cashBack}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="cashBack"
                              className="form-control"
                            >
                              <option value="">Cashback Type</option>
                              <option value={1}>Percentage</option>
                              <option value={2}>Fix Amount</option>
                            </Form.Select>
                            {touched?.cashBack && errors?.cashBack ? (
                              <span className="error">
                                {touched?.cashBack && errors?.cashBack}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>

                        <Col lg={6} className="mb-3">
                          {" "}
                          {/* Add margin-bottom to create space */}
                          <div>
                            <Form.Label>
                              Rotation CashBack
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                              aria-label="Select Rotation CashBack"
                              value={values?.rotationCashBack}
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              name="rotationCashBack"
                              className="form-control"
                            >
                              <option value="">Select Rotation CashBack</option>
                              <option value={1}>One Time</option>
                              <option value={2}>Several Times</option>
                            </Form.Select>
                            {touched.rotationCashBack &&
                              errors.rotationCashBack && (
                                <span className="error">
                                  {touched.rotationCashBack &&
                                    errors.rotationCashBack}
                                </span>
                              )}
                          </div>
                        </Col>

                        <Col lg={6} className="mx-auto mb-3">
                          {" "}
                          {/* Add margin-bottom to create space */}
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Cashback Validity (In Days)
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="select-date">
                              {/* <DatePicker
                                name="cashbackvalidity"
                                selected={values?.cashbackvalidity}
                                onChange={(date) => {
                                  setFieldValue("cashbackvalidity", date);
                                }}
                                placeholderText="Select Cashback Validity"
                                minDate={moment().toDate()}
                                autoComplete="off"
                              /> */}

                              <Form.Control
                                className="form-control"
                                autoComplete="off"
                                type="text"
                                name="cashbackvalidity"
                                placeholder="Enter cashback validity"
                                onChange={handleChange}
                                value={values?.cashbackvalidity}
                                onKeyPress={restrictAlpha}
                                maxLength={10}
                              />
                              {touched.cashbackvalidity &&
                                errors.cashbackvalidity ? (
                                <span className="error">
                                  {errors.cashbackvalidity}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      </>
                    )}

                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          {(values?.cashBack == 1 && values?.actionType == 2) ||
                            values?.actionType == 1
                            ? `Discount(%)`
                            : `Amount (
                          ${formatCurrency("", values?.country)})`}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="discount"
                          autoComplete="off"
                          placeholder={
                            values?.cashBack == 1 || values?.actionType == 1
                              ? `Enter discount`
                              : `Enter amount`
                          }
                          onChange={handleChange}
                          value={values?.discount}
                          onKeyPress={restrictAlpha}
                          maxLength={
                            values?.cashBack == 1 || values?.actionType == 1
                              ? 2
                              : 30
                          }
                        />
                        {(values?.cashBack == 1 && values?.actionType == 2) ||
                          values?.actionType == 1 ? (
                          touched?.discount && errors?.discount ? (
                            <span className="error">
                              {touched?.discount && errors?.discount}
                            </span>
                          ) : (
                            ""
                          )
                        ) : touched?.discount && errors?.discount ? (
                          <span className="error">
                            {touched?.discount && "Amount is required"}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    {values?.actionType == "1" ||
                      (values?.cashBack == "1" && values?.actionType == "2") ? (
                      <Col xl={6}>
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Max Discount Amount{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            className="form-control"
                            type="text"
                            autoComplete="off"
                            name="maxDiscountAmount"
                            placeholder="Enter maximum discount amount"
                            onChange={handleChange}
                            value={values?.maxDiscountAmount}
                            onKeyPress={restrictAlphaWithDecimal}
                            maxLength={30}
                          />
                          {touched?.maxDiscountAmount &&
                            errors?.maxDiscountAmount ? (
                            <span className="error">
                              {touched?.maxDiscountAmount &&
                                errors?.maxDiscountAmount}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  <div className="text-end">
                    <Button
                      className="btn_theme mx-auto float-end"
                      type="submit"
                      disabled={isPending}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
