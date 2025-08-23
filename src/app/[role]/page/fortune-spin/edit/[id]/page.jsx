/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import "ckeditor5/ckeditor5.css";
import { useFormik } from "formik";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  EDIT_SPIN_API,
  GET_COMPANY_API,
  GET_SEARCH_CATEGORY_API,
  GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT,
  GET_SPIN_DETAIL,
  getAdminProductLists,
} from "../../../../../../../services/APIServices";
import "../../../../../../../styles/globals.scss";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import {
  filterPassedTime,
  formatCurrency,
  getLinkHref,
  restrictAlpha,
  restrictAlphaWithDecimal,
} from "../../../../../../../utils/helper";
import useCountryState from "../../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../../hooks/useDetails";
const Edit = () => {
  const { id } = useParams();
  const selectedCountry = useCountryState();
  const detail = useDetails();

  const router = useRouter();
  const isSlider = useSlider();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_SPIN_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId,`/page/fortune-spin`));
    },
  });

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    setValues,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      spinType: "",
      category: "",
      subcategoryId: "",
      company: "",
      minAmount: "",
      maxCashBack: "",
      stateId: "",
      priority: "",
      // forFreeDelivery: 0,
      startDate: "",
      endDate: "",
      speed: "",
      size: "",
      value: "",
      spinnerImg: "",
      newPicked: "",
      numberOfUse: "",
      spanMessage: "",
      detail: "",
      productId: "",
    },
    validationSchema: yup.object().shape({
      spinType: yup.string().required("Spin Type is required"),
      startDate: yup
        .string()
        .required("Start Date is required")
        .test("is-future", "Start Date must be in the future", (value) => {
          return moment(value).isAfter(moment());
        }),
      endDate: yup
        .string()
        .required("End Date is required")
        .test("is-future", "End Date must be in the future", (value) => {
          return moment(value).isAfter(moment());
        }),

      minAmount: yup.string().when("spinType", {
        is: (value) => value == "2" || value == "1" || value == "3",
        then: () => yup.string().required("Min Amount is required"),
      }),
      maxCashBack: yup.string().when("spinType", {
        is: (value) => value == "2" || value == "1",
        then: () => yup.string().required("Max Cashback is required"),
      }),
      maxCashBack: yup.string().when("spinType", {
        is: (value) => value == "5",
        then: () => yup.string().required("Earn Amount is required"),
      }),
      numberOfUse: yup.string().when("spinType", {
        is: (value) => value == "5",
        then: () => yup.string().required("Number of use is required"),
      }),
      stateId: yup.string().required("Status is required"),
      speed: yup.string().required("Speed of Appearance is required"),
      size: yup.string().required("Size of Appearance is required"),

      value: yup.string().when("spinType", {
        is: (value) => value == 1,
        then: () =>
          yup
            .string()
            .required("How much percentage is required")
            .test("range", "Value must be between 0.1 and 100", (val) => {
              const num = parseFloat(val);
              return num >= 0.1 && num <= 100;
            }),
      }),
      priority: yup
        .string()
        .required()
        .label("Priority")
        .test("range", "Priority must be between 0.1 and 100", (val) => {
          const num = parseFloat(val);
          return num >= 0.1 && num <= 100;
        }),
      newPicked: yup
        .mixed()
        .when("spinnerImg", {
          is: (value) => !value,
          then: () => yup.string().required("Image is a required field"),
        })

        .when(([newPicked], schema) => {
          if (newPicked) {
            return yup
              .mixed()
              .test(
                "type",
                "Please select jpg, png, jpeg format",
                function (value) {
                  return (
                    value &&
                    (value.type === "image/jpg" ||
                      value.type === "image/png" ||
                      value.type === "image/jpeg")
                  );
                }
              );
          }
          return schema;
        }),
      spanMessage: yup.string().required("Span Message is required"),
      detail: yup.string().required("Detail is required"),
      // productId: yup.string().when("spinType", {
      //   is: (value) => value == "2" || value == "1" || value == "3",
      //   then: () => yup.string().required("productId is required"),
      // }),
    }),
    onSubmit: async (values) => {
      const payload = new FormData();
      // Append the fields to the FormData object
      payload.append("spinType", values?.spinType);
      payload.append("category", values?.category?.value ?? "");
      payload.append("company", values?.company ? values?.company?.map((data) => data?.value) : "");
      payload.append("minAmount", values?.minAmount ?? "");
      payload.append("maxCashBack", values?.maxCashBack ?? "");
      payload.append("stateId", values?.stateId);
      payload.append("speed", values?.speed ?? "");
      payload.append("size", values?.size ?? "");
      payload.append("value", values?.value ?? "");
      payload.append("numberOfUse", values?.numberOfUse);

      // payload.append("forFreeDelivery", values?.forFreeDelivery);
      payload.append("startDate", values?.startDate);
      payload.append("endDate", values?.endDate);
      payload.append("priority", values?.priority);
      payload.append("spanMessage", values?.spanMessage);
      payload.append("detail", values?.detail);
      payload.append("productId", values?.productId?.value ?? "");
      // If you have a file input for images, you can append it like this:
      if (values?.newPicked) {
        payload.append("spinnerImg", values?.newPicked);
      }
      // Call the mutate function with the FormData payload
      mutate(payload);
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT(page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search,
      "",
      values?.category?.value);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0,
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
      hasMore: resp?.data?.data?.length > 0,
      additional: {
        page: page + 1,
      },
    };
  };

  const searchProduct = async (search, loadedOptions, { page }) => {
    let resp = await getAdminProductLists(
      page,
      search,
      constant?.ACTIVE
      // values?.company?.value
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.productName,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  useQuery({
    queryKey: ["fortune-spin-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_SPIN_DETAIL(id);

      let category, company, productId;
      category = {
        value: resp?.data?.data?.category?._id ?? "",
        label: resp?.data?.data?.category?.category ?? "",
      };
      company = resp?.data?.data?.company?.map((data) => ({
        value: data?._id ?? "",
        label: data?.company ?? "",
      }))


      productId = {
        label: resp?.data?.data?.product?.productName,
        value: resp?.data?.data?.product?._id,
      };
      setValues({
        ...values,
        spinType: resp?.data?.data?.spinType,
        size: resp?.data?.data?.size,
        value: resp?.data?.data?.value,
        stateId: resp?.data?.data?.stateId,
        speed: resp?.data?.data?.speed,
        numberOfUse: resp?.data?.data?.numberOfUse,
        category,
        company,
        productId,
        // cashBack,
        minAmount: resp?.data?.data?.minAmount,
        maxCashBack: resp?.data?.data?.maxCashBack,
        // forFreeDelivery: resp?.data?.data?.forFreeDelivery ? 1 : 0,
        startDate: new Date(resp?.data?.data?.startDate),
        endDate: new Date(resp?.data?.data?.endDate),
        spinnerImg: resp?.data?.data?.spinnerImg,
        priority: resp?.data?.data?.priority,
        spanMessage: resp?.data?.data?.spanMessage,
        detail: resp?.data?.data?.detail,
      });
      return resp?.data?.data;
    },
  });

  const onChangePromotionType = () => {
    setFieldValue("value", "");
    // clearErrors("value");
  };

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, `/page`)} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
               href={getLinkHref(detail?.roleId, `/page/fortune-spin`)}
                className="text-capitalize text-black"
              >
                Fortune Spin management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Edit Fortune Spin</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Fortune Spin</h5>
                <Link  href={getLinkHref(detail?.roleId, `/page/fortune-spin`)} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Spin Type</Form.Label>
                        <Form.Select
                          aria-label="Select Spin Type"
                          value={values?.spinType}
                          onChange={(e) => {
                            handleChange(e);
                            onChangePromotionType();
                          }}
                          onBlur={handleBlur}
                          name="spinType"
                          className="form-control"
                          disabled
                        >
                          <option value="">Select Spin Type</option>
                          <option value={2}>Fix</option>
                          <option value={1}>Percentage</option>
                          <option value={3}>Free Delivery</option>
                          <option value={4}>Hard Luck</option>
                          <option value={5}>Referral</option>
                        </Form.Select>
                        {touched?.spinType && errors?.spinType && (
                          <span className="error">{errors.spinType}</span>
                        )}
                      </Form.Group>
                    </Col>

                    {values?.spinType == "1" ? (
                      <Col lg={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label>
                            How much percentage{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            className="form-control"
                            autoComplete="off"
                            type="text"
                            name="value"
                            placeholder="Enter how much percentage"
                            onChange={handleChange}
                            value={values?.value}
                            onKeyPress={restrictAlphaWithDecimal}
                            maxLength={5}
                          />
                          {touched?.value && errors?.value && (
                            <span className="error">{errors.value}</span>
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    {values?.spinType == "5" ? (
                      <Col lg={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Earn Amount ({formatCurrency("", selectedCountry)}){" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            className="form-control"
                            autoComplete="off"
                            type="text"
                            name="maxCashBack"
                            placeholder="Enter Earn Amount"
                            onChange={handleChange}
                            value={values?.maxCashBack}
                            onKeyPress={restrictAlphaWithDecimal}
                          />
                          {touched?.maxCashBack && errors?.maxCashBack && (
                            <span className="error">{errors.maxCashBack}</span>
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="">
                          Start Date <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="select-date">
                          <DatePicker
                            autoComplete="off"
                            name="startDate"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            selected={values?.startDate}
                            onChange={(date) => {
                              setFieldValue("startDate", date);
                              setFieldValue("endDate", null);
                            }}
                            showTimeSelect={true}
                            placeholderText="Select start Date"
                            filterTime={filterPassedTime}
                            minDate={moment().toDate()} // Prevent past dates
                          />
                        </div>
                        {touched?.startDate && errors?.startDate && (
                          <span className="error">{errors.startDate}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          End Date<span className="text-danger">*</span>
                        </Form.Label>
                        <div className="select-date">
                          <DatePicker
                            autoComplete="off"
                            name="endDate"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            selected={values?.endDate}
                            showTimeSelect={true}
                            onChange={(date) => {
                              if (
                                moment(date).isAfter(moment(values?.startDate))
                              ) {
                                setFieldValue("endDate", date);
                              } else {
                                // Optionally, you can show an error message or alert
                                toastAlert(
                                  "error",
                                  "End Date must be after Start Date"
                                );
                              }
                            }}
                            placeholderText="Select end Date"
                            filterTime={filterPassedTime}
                            minDate={moment(values?.startDate)
                              .add(1, "days")
                              .toDate()} // Ensure endDate is at least 1 day after startDate
                          />
                        </div>
                        {touched?.endDate && errors?.endDate && (
                          <span className="error">{errors.endDate}</span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Speed <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          autoComplete="off"
                          type="text"
                          name="speed"
                          placeholder="Enter speed"
                          onChange={handleChange}
                          value={values?.speed}
                        />
                        {touched?.speed && errors?.speed && (
                          <span className="error">{errors.speed}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Size <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          autoComplete="off"
                          type="text"
                          name="size"
                          placeholder="Enter size"
                          onChange={handleChange}
                          value={values?.size}
                        />
                        {touched?.size && errors?.size && (
                          <span className="error">{errors.size}</span>
                        )}
                      </Form.Group>
                    </Col>
                    {/* {values?.spinType == "2" ||
                    values?.spinType == "1" ||
                    values?.spinType == "3" ? (
                      <>
                        <Col lg={6} className="mx-auto">
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Min Amount <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              className="form-control"
                              autoComplete="off"
                              type="text"
                              name="minAmount"
                              placeholder="Enter Min Amount"
                              onChange={handleChange}
                              value={values?.minAmount}
                              onKeyPress={restrictAlphaWithDecimal}
                            />
                            {touched?.minAmount && errors?.minAmount && (
                              <span className="error">{errors.minAmount}</span>
                            )}
                          </Form.Group>
                        </Col>

                        <Col lg={6} className="mx-auto">
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Max Cash Back{" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              className="form-control"
                              autoComplete="off"
                              type="text"
                              name="maxCashBack"
                              placeholder="Enter Max Cashback"
                              onChange={handleChange}
                              value={values?.maxCashBack}
                              onKeyPress={restrictAlphaWithDecimal}
                            />
                            {touched?.maxCashBack && errors?.maxCashBack && (
                              <span className="error">
                                {errors.maxCashBack}
                              </span>
                            )}
                          </Form.Group>
                        </Col>
                      </>
                    ) : (
                      ""
                    )} */}
                    {values?.spinType == "1" ||
                      values?.spinType == "2" ||
                      values?.spinType == "3" ? (
                      <>
                        <Col lg={6} className="mx-auto">
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Min Amount ({formatCurrency("", selectedCountry)}){" "}
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              autoComplete="off"
                              className="form-control"
                              type="text"
                              name="minAmount"
                              placeholder="Enter Min Amount"
                              onChange={handleChange}
                              value={values?.minAmount}
                              onKeyPress={restrictAlphaWithDecimal}
                            />
                            {touched?.minAmount && errors?.minAmount && (
                              <span className="error">{errors.minAmount}</span>
                            )}
                          </Form.Group>
                        </Col>

                        {values?.spinType == "1" || values?.spinType == "2" ? ( // Only render if spinType is "1" or "2"
                          <Col lg={6} className="mx-auto">
                            <Form.Group className="mb-4">
                              <Form.Label>
                                Max Cash Back{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                autoComplete="off"
                                className="form-control"
                                type="text"
                                name="maxCashBack"
                                placeholder="Enter Max Cashback"
                                onChange={handleChange}
                                value={values?.maxCashBack}
                                onKeyPress={restrictAlphaWithDecimal}
                              />
                              {touched?.maxCashBack && errors?.maxCashBack && (
                                <span className="error">
                                  {errors.maxCashBack}
                                </span>
                              )}
                            </Form.Group>
                          </Col>
                        ) : null}
                      </>
                    ) : null}
                    {values?.spinType == "2" ||
                      values?.spinType == "1" ||
                      values?.spinType == "3" ? (
                      <>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Category</Form.Label>
                            <AsyncPaginate
                              value={values?.category}
                              loadOptions={searchCategoryList}
                              onChange={(e) => {
                                setFieldValue("category", e);
                                setFieldValue("subcategoryId", null);
                              }}
                              additional={{
                                page: 1,
                              }}
                              placeholder="Enter"
                            />
                            {touched.category && errors.category && (
                              <span className="error">
                                {errors.category.value}
                              </span>
                            )}
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Excluded Company</Form.Label>
                            <AsyncPaginate
                              key={Math.random()}
                              value={values?.company}
                              loadOptions={searchCompany}
                              onChange={(e) => {
                                setFieldValue("company", e);
                              }}
                              additional={{
                                page: 1,
                              }}
                              isClearable
                              placeholder="Enter excluded company"
                              isDisabled={!values?.category}

                              isMulti
                            />

                          </Form.Group>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}
                    {values?.spinType == "5" ? (
                      <Col lg={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Number of use <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            autoComplete="off"
                            className="form-control"
                            type="text"
                            name="numberOfUse"
                            placeholder="Enter number of use"
                            onChange={handleChange}
                            value={values?.numberOfUse}
                            onKeyPress={restrictAlpha}
                          />
                          {touched?.numberOfUse && errors?.numberOfUse && (
                            <span className="error">{errors.numberOfUse}</span>
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Priority (%)<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          placeholder="Enter priority"
                          value={values?.priority}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          name="priority"
                          className="form-control"
                          maxLength={4}
                          onKeyPress={restrictAlphaWithDecimal}
                        ></Form.Control>
                        {touched?.priority && errors?.priority && (
                          <span className="error">{errors.priority}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Status <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select Status"
                          value={values?.stateId}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          name="stateId"
                          className="form-control"
                        >
                          <option value="">Select</option>
                          <option value="1">Enabled</option>
                          <option value="2">Disabled</option>
                        </Form.Select>
                        {touched?.stateId && errors?.stateId && (
                          <span className="error">{errors.stateId}</span>
                        )}
                      </Form.Group>
                    </Col>

                    {/* <Col lg={6}>
                      <div>
                        <Form.Label>
                          Free Delivery <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Check
                          name="forFreeDelivery"
                          type="radio"
                          label="true"
                          // id="true"
                          checked={values?.forFreeDelivery == 1}
                          value={1}
                          onChange={handleChange}
                        />
                        <Form.Check
                          name="forFreeDelivery"
                          type="radio"
                          label="False"
                          // id="false"
                          checked={values?.forFreeDelivery == 0}
                          value={0}
                          onChange={handleChange}
                        />
                      </div>
                    </Col> */}

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Span Message <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          type="text"
                          name="spanMessage"
                          placeholder="Enter Span Message"
                          onChange={handleChange}
                          value={values?.spanMessage}
                        />
                        {touched?.spanMessage && errors?.spanMessage && (
                          <span className="error">{errors.spanMessage}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Detail <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          className="form-control"
                          // type="text"
                          as="textarea" // Change here to use textarea
                          name="detail"
                          placeholder="Enter Detail"
                          onChange={handleChange}
                          value={values?.detail}
                        />
                        {touched?.detail && errors?.detail && (
                          <span className="error">{errors.detail}</span>
                        )}
                      </Form.Group>
                    </Col>

                    {values?.spinType == "2" ||
                      values?.spinType == "1" ||
                      values?.spinType == "3" ? (
                      <>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Product</Form.Label>
                            <AsyncPaginate
                              value={values?.productId}
                              loadOptions={searchProduct}
                              onChange={(e) => {
                                setFieldValue("productId", e);
                              }}
                              additional={{
                                page: 1,
                              }}
                              isClearable
                              placeholder="Select the Product"
                            />
                          </Form.Group>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Image<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="newPicked"
                          onChange={(e) =>
                            setFieldValue("newPicked", e.target.files[0])
                          }
                          accept="image/*"
                        />

                        {values?.newPicked?.length !== 0 ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={
                                values?.newPicked
                                  ? URL.createObjectURL(values?.newPicked) ?? ""
                                  : setFieldValue("newPicked", "")
                              }
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        {values?.spinnerImg ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={values?.spinnerImg}
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        <span className="error">
                          {touched?.newPicked && errors?.newPicked}
                        </span>
                      </Form.Group>
                    </Col>
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

export default Edit;
