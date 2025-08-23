/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useSlider from "../../../../../../hooks/useSlider";
import {
  ADD_COMPANY_API,
  ADMIN_GET_SEARCH_SUBCATEGORY_API,
  GET_SEARCH_CATEGORY_API,
  GET_SEARCH_DELIVERY_COMPANY_API,
} from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../utils/constants";
import {
  commissionTypeFunc,
  countries,
  formatCurrency,
  getLinkHref,
  restrictAlpha,
  restrictAlpha1,
  restrictAlphaWithDecimal,
  validEmailPattern,
} from "../../../../../../utils/helper";
import { countryCode } from "../../../../../../utils/CountryCode";
import useCountryState from "../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../hooks/useDetails";
const Add = () => {
  // useDocumentTitle("Add Category");
  const router = useRouter();
  const selectedCountry = useCountryState();
  let detail = useDetails()
  const isSlider = useSlider();
  const queryClient = useQueryClient();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_COMPANY_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/company-management`));
      queryClient.invalidateQueries({ queryKey: ["getcompany-list"] });
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
  } = useFormik({
    initialValues: {
      commissionType: "",
      company: "",
      company_logo: "",
      newPicked: "",
      perCommission: "",
      couponService: 0,
      deliveryEligible: 0,
      pickupService: 0,
      deliveryCompanyId: "",
      costDelivery: "",
      categoryId: "",
      subcategoryId: "",
      description: "",
      coverImg: "",
      newPickedCover_Img: "",
      email: "",
      countryCode: "",
      mobile: "",
      order: "",
      paymentPeriod: "",
      // ARABIC
      arabicCompany: "",
      arabicDescription: "",
      deliveryServiceEligible: 1,
      actualCompanyName: "",
      arabicActualCompanyName: "",
      deliveryCompanyChecked: "Armada",
      country: "Kuwait",
    },

    validationSchema: yup.object().shape({
      commissionType: yup.string().required().label("Comission Type"),
      country: yup.string().required().label("Country"),
      paymentPeriod: yup
        .string()
        .required()
        .label("Payment Period")
        .test(
          "range",
          "Payment Period must be greater than 0",
          (val) => parseInt(val) >= 1
        ),
      company: yup.string().required().label("Company name").trim(),
      actualCompanyName: yup
        .string()
        .required()
        .label("Actual company name")
        .trim(),
      arabicActualCompanyName: yup
        .string()
        .required()
        .label("Arabic company Name (In Arabic)")
        .trim(),
      // order: yup.string().required().label("Order").trim(),
      newPicked: yup
        .mixed()
        .when("company_logo", {
          is: (value) => !value,
          then: () => yup.string().required("Company logo is a required field"),
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

      perCommission: yup.string().when("commissionType", {
        is: (value) => value == 1,
        then: () =>
          yup
            .string()
            .required()
            .label("Comission")
            .test(
              "range",
              "Discount must be between 0.1 and 100",
              (val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 100
            ),
      }),

      categoryId: yup.object().shape({
        value: yup.string().required().label("Category"),
        label: yup.string().required(),
      }),
      subcategoryId: yup.object().shape({
        value: yup.string().required().label("Subcategory"),
        label: yup.string().required(),
      }),

      deliveryCompanyId: yup
        .string()
        .when(["deliveryCompanyChecked", "deliveryServiceEligible"], {
          is: (deliveryCompanyChecked, deliveryServiceEligible) =>
            deliveryCompanyChecked === "Delivery Company" &&
            deliveryServiceEligible == 1,
          then: () =>
            yup.object().shape({
              value: yup.string().required().label("Delivery Company"),
              label: yup.string().required(),
            }),
        }),

      costDelivery: yup
        .string()
        .when(["deliveryEligible", "deliveryServiceEligible"], {
          is: (deliveryEligible, deliveryServiceEligible) =>
            deliveryEligible == "1" || deliveryServiceEligible == "1",
          then: () =>
            yup
              .number()
              .required()
              .label("Delivery Cost")
              .positive("Delivery cost should be greater than 0")

              .typeError("Invalid input"),
        }),

      description: yup.string().required().label("Description").trim(),

      newPickedCover_Img: yup
        .mixed()
        .when("coverImg", {
          is: (value) => !value,
          then: () => yup.string().required("Cover image is a required field"),
        })

        .when(([newPickedCover_Img], schema) => {
          if (newPickedCover_Img) {
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

      deliveryServiceEligible: yup
        .number()
        .required()
        .oneOf([0, 1]) // Ensure it's either 0 or 1
        .test(
          "is-delivery-eligible",
          "Delivery service must be true if coupon service pickup service and self delivery are false",
          function (value) {
            const { deliveryEligible, couponService, pickupService } =
              this.parent; // Access other fields using this.parent
            // If both couponService and pickupService are 0, deliveryEligible must be 1
            if (
              deliveryEligible == 0 &&
              couponService == 0 &&
              pickupService == 0 &&
              value !== 1
            ) {
              return false; // Validation fails
            }
            return true; // Validation passes
          }
        ),

      mobile: yup
        .string()
        .min(7, "Phone Number is a required field")
        .test("phone-validate", "Invalid phone number", function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required("Phone Number field is required"),
      email: yup
        .string()
        .required()
        .label("Email Address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),

      // ABRBIC
      arabicCompany: yup
        .string()
        .required()
        .label("Company name (In Arabic)")

        .trim(),
      arabicDescription: yup
        .string()
        .required()
        .label("Description (In Arabic)")

        .trim(),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();
      let number = parsePhoneNumber(String(values?.mobile));
      payload.append("company", values?.company);
      payload.append("actualCompanyName", values?.actualCompanyName);
      payload.append(
        "arabicActualCompanyName",
        values?.arabicActualCompanyName
      );

      payload.append("paymentPeriod", values?.paymentPeriod);
      payload.append("commissionType", values?.commissionType);
      if (values?.commissionType == 1) {
        payload.append("perCommission", values?.perCommission);
      }
      payload.append(
        "couponService",
        values?.couponService == 1 ? true : false
      );
      payload.append(
        "deliveryEligible",
        values?.deliveryEligible == 1 ? true : false
      );
      payload.append(
        "pickupService",
        values?.pickupService == 1 ? true : false
      );
      payload.append(
        "deliveryService",
        values?.deliveryServiceEligible == 1 ? true : false
      );
      payload.append("deliveryCompany", values?.deliveryCompanyId?.value);
      payload.append("costDelivery", values?.costDelivery);
      payload.append("categoryId", values?.categoryId?.value);
      payload.append("order", values?.order);

      payload.append("subcategoryId", values?.subcategoryId?.value);
      payload.append("description", values?.description);
      payload.append("countryCode", "+" + number?.countryCallingCode ?? "");
      payload.append("mobile", number?.nationalNumber ?? "");
      payload.append("email", values?.email ?? "");
      if (values?.newPicked) {
        payload.append("logo", values?.newPicked);
      }

      if (values?.newPickedCover_Img) {
        payload.append("coverImg", values?.newPickedCover_Img);
      }
      // ARABIC
      payload.append("arabicCompany", values?.arabicCompany);
      payload.append("country", values?.country);

      payload.append("arabicDescription", values?.arabicDescription);
      payload.append("deliveryCompanyChecked", values?.deliveryCompanyChecked);

      mutate(payload);
    },
  });

  const searchDeliveryCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_DELIVERY_COMPANY_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
        costDeliveryCustomer: i?.costDeliveryCustomer,
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
              <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, "/page/company-management")}
                className="text-capitalize text-black"
              >
                Company management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Company</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Company</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/company-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Company Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="company"
                          placeholder="Enter company name"
                          onChange={handleChange}
                          value={values?.company}
                        />
                        {touched?.company && errors?.company ? (
                          <span className="error">
                            {touched?.company && errors?.company}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Company Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicCompany"
                          placeholder="Enter company name (in arabic)"
                          onChange={handleChange}
                          value={values?.arabicCompany}
                        />
                        {touched?.arabicCompany && errors?.arabicCompany ? (
                          <span className="error">
                            {touched?.arabicCompany && errors?.arabicCompany}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={4} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Actual Company Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="actualCompanyName"
                          placeholder="Enter actual company name"
                          onChange={handleChange}
                          value={values?.actualCompanyName}
                        />
                        {touched?.actualCompanyName &&
                          errors?.actualCompanyName ? (
                          <span className="error">
                            {touched?.actualCompanyName &&
                              errors?.actualCompanyName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={4} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Actual Company Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicActualCompanyName"
                          placeholder="Enter actual company name (in arabic)"
                          onChange={handleChange}
                          value={values?.arabicActualCompanyName}
                        />
                        {touched?.arabicActualCompanyName &&
                          errors?.arabicActualCompanyName ? (
                          <span className="error">
                            {touched?.arabicActualCompanyName &&
                              errors?.arabicActualCompanyName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Country <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select country"
                          name="country"
                          value={values?.country}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select Country</option>
                          {countryCode?.map((data) => {
                            return (
                              <option value={data?.country}>
                                {data?.country}
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
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Commission Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select commission Type"
                          name="commissionType"
                          value={values?.commissionType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Commission Type</option>
                          <option value={constant?.PERCENTAGE}>
                            Percentage
                          </option>
                          <option value={constant?.FIX_AMOUNT}>
                            Fix amount
                          </option>
                        </Form.Select>
                        {touched?.commissionType && errors?.commissionType ? (
                          <span className="error">
                            {touched?.commissionType && errors?.commissionType}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    {values?.commissionType == 1 ? (
                      <Col lg={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label>
                            {" "}
                            Commission (
                            {values?.commissionType
                              ? commissionTypeFunc(
                                Number(values?.commissionType)
                              )
                              : "Percentage"}
                            )<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            className="form-control"
                            type="text"
                            name="perCommission"
                            placeholder="Enter commission"
                            onChange={handleChange}
                            value={values?.perCommission}
                            onKeyPress={restrictAlphaWithDecimal}
                            maxLength={5}
                          />
                          {touched?.perCommission && errors?.perCommission ? (
                            <span className="error">
                              {touched?.perCommission && errors?.perCommission}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

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
                            setFieldValue("subcategoryId", "");
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Select Category"
                          key={Math.random()}
                        />
                        {touched.categoryId && errors.categoryId ? (
                          <span className="error">
                            {errors.categoryId?.value}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Select Subcategory
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.subcategoryId}
                          loadOptions={searchSubCategoryList}
                          onChange={(e) => {
                            setFieldValue("subcategoryId", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Select SubCategory"
                          key={Math.random()}
                        />
                        {touched.subcategoryId && errors.subcategoryId ? (
                          <span className="error">
                            {errors.subcategoryId?.value}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={values?.commissionType == 1 ? 4 : 6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Email address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Email Address"
                          name="email"
                          value={values?.email}
                          className="form-control bg-white"
                          onChange={handleChange}
                        />
                        {touched?.email && errors?.email ? (
                          <span className="error">
                            {touched?.email && errors?.email}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                    <Col lg={values?.commissionType == 1 ? 4 : 6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Phone Number"
                          name="mobile"
                          value={values?.mobile}
                          onChange={(value) => {
                            setFieldValue("mobile", value);
                          }}
                          countries={countries}
                        />
                        {touched?.mobile && errors?.mobile ? (
                          <span className="error">
                            {touched?.mobile && errors?.mobile}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                    <Col
                      lg={values?.commissionType == 1 ? 4 : 6}
                      className="mx-auto"
                    >
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Payment Period <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="paymentPeriod"
                          placeholder="Enter payment Period"
                          onChange={handleChange}
                          value={values?.paymentPeriod}
                          onKeyPress={restrictAlpha1}
                        />
                        {touched?.paymentPeriod && errors?.paymentPeriod ? (
                          <span className="error">
                            {touched?.paymentPeriod && errors?.paymentPeriod}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Description <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          as="textarea"
                          type="textarea"
                          name="description"
                          placeholder="Enter Description"
                          onChange={handleChange}
                          value={values?.description}
                          style={{ resize: "both" }} //
                        />
                        {touched?.description && errors?.description ? (
                          <span className="error">
                            {touched?.description && errors?.description}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Description (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          as="textarea"
                          type="textarea"
                          name="arabicDescription"
                          placeholder="Enter Description (in arabic)"
                          onChange={handleChange}
                          value={values?.arabicDescription}
                          style={{ resize: "both" }} //
                        />
                        {touched?.arabicDescription &&
                          errors?.arabicDescription ? (
                          <span className="error">
                            {touched?.arabicDescription &&
                              errors?.arabicDescription}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={3}>
                      <div className="d-flex algn-items-center justify-content-start mb-5">
                        <Form.Group className="mt-3 active-radio ">
                          <Form.Label>
                            Coupon Service{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="couponService"
                            type="radio"
                            label="True"
                            id="true"
                            checked={values?.couponService == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="couponService"
                            type="radio"
                            label="False"
                            id="false"
                            checked={values?.couponService == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={3}>
                      <div className="d-flex algn-items-center justify-content-start mb-5">
                        <Form.Group className="active-radio mt-3">
                          <Form.Label>
                            Pickup Service{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="pickupService"
                            type="radio"
                            label="True"
                            id="Pickup-true"
                            checked={values?.pickupService == 1}
                            value={1}
                            onChange={(e) => {
                              handleChange(e);
                              // setFieldValue("deliveryEligible", 0);
                              setFieldTouched("deliveryEligible", true);
                              setFieldValue("deliveryCompanyId", "");
                              // setFieldValue("deliveryCompanyId", null);
                              // setFieldValue("costDelivery", null);
                            }}
                          />
                          <Form.Check
                            name="pickupService"
                            type="radio"
                            label="False"
                            id="Pickup-False"
                            checked={values?.pickupService == 0}
                            value={0}
                            onChange={(e) => {
                              handleChange(e);
                              // setFieldValue("deliveryEligible", 1);
                              setFieldTouched("deliveryEligible", true);
                            }}
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={3}>
                      <div className="active-radio d-flex algn-items-center justify-content-start mb-5">
                        <Form.Group className="mt-3">
                          <Form.Label>
                            Self Delivery <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="deliveryEligible"
                            type="radio"
                            label="True"
                            id="deliveryEligibletrue"
                            checked={values?.deliveryEligible == 1}
                            value={1}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldTouched("deliveryEligible", true);
                              setFieldValue("deliveryServiceEligible", 0);
                              setFieldValue("deliveryCompanyId", "");
                            }}
                          />
                          <Form.Check
                            name="deliveryEligible"
                            type="radio"
                            label="False"
                            id="deliveryEligiblefalse"
                            checked={values?.deliveryEligible == 0}
                            value={0}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldTouched("deliveryEligible", true);
                              setFieldValue("deliveryCompanyId", "");
                              setFieldValue("costDelivery", "");

                              // setFieldValue("pickupService", 1);
                            }}
                          />

                          {touched?.deliveryEligible &&
                            errors?.deliveryEligible ? (
                            <span className="error">
                              {touched?.deliveryEligible &&
                                errors?.deliveryEligible}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={3}>
                      <div className="active-radio d-flex algn-items-center justify-content-start mb-5">
                        <Form.Group className="mt-3">
                          <Form.Label>
                            Delivery Service
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="deliveryServiceEligible"
                            type="radio"
                            label="True"
                            id="deliveryServiceEligible"
                            checked={values?.deliveryServiceEligible == 1}
                            value={1}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldTouched("deliveryEligible", true);
                              setFieldValue("deliveryEligible", 0);
                              setFieldValue("costDelivery", "");
                              setFieldValue("deliveryCompanyChecked", "Armada");
                            }}
                          />
                          <Form.Check
                            name="deliveryServiceEligible"
                            type="radio"
                            label="False"
                            id="deliveryServiceEligibleFalse"
                            checked={values?.deliveryServiceEligible == 0}
                            value={0}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldTouched("deliveryEligible", true);
                              setFieldValue("deliveryCompanyId", "");
                              setFieldValue("costDelivery", "");

                              // setFieldValue("pickupService", 1);
                            }}
                          />

                          {touched?.deliveryServiceEligible &&
                            errors?.deliveryServiceEligible ? (
                            <span className="error">
                              {touched?.deliveryServiceEligible &&
                                errors?.deliveryServiceEligible}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                    {values?.deliveryServiceEligible == 1 ||
                      values?.deliveryServiceEligible == true ? (
                      <>
                        <Col lg={6}>
                          <div className="active-radio d-flex algn-items-center justify-content-start mb-5">
                            <Form.Group className="mt-3">
                              {/* <Form.Label>
                              Delivery Company
                              <span className="text-danger">*</span>
                            </Form.Label> */}

                              <Form.Check
                                name="deliveryCompanyChecked"
                                type="radio"
                                label="Armada"
                                id="Armada"
                                checked={
                                  values?.deliveryCompanyChecked == "Armada"
                                }
                                value={"Armada"}
                                onChange={(e) => {
                                  handleChange(e);
                                  setFieldValue("deliveryCompanyId", "");
                                }}
                              />
                              <Form.Check
                                name="deliveryCompanyChecked"
                                type="radio"
                                label="Delivery Company"
                                id="Delivery Company"
                                checked={
                                  values?.deliveryCompanyChecked ==
                                  "Delivery Company"
                                }
                                value={"Delivery Company"}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                              />
                            </Form.Group>
                          </div>
                        </Col>

                        {values?.deliveryCompanyChecked ==
                          "Delivery Company" ? (
                          <>
                            <Col lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="">
                                  Delivery Company{" "}
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <AsyncPaginate
                                  value={values?.deliveryCompanyId}
                                  loadOptions={searchDeliveryCompany}
                                  onChange={(e) => {
                                    setFieldValue("deliveryCompanyId", e);
                                    setFieldValue(
                                      "costDelivery",
                                      e?.costDeliveryCustomer
                                    );
                                  }}
                                  additional={{
                                    page: 1,
                                  }}
                                  placeholder="Enter"
                                // key={Math.random()}
                                />
                                {touched.deliveryCompanyId &&
                                  errors.deliveryCompanyId ? (
                                  <span className="error">
                                    {errors.deliveryCompanyId?.value}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </Form.Group>
                            </Col>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      ""
                    )}

                    {values?.deliveryEligible == 1 ||
                      values?.deliveryEligible == true ||
                      values?.deliveryServiceEligible == 1 ||
                      values?.deliveryServiceEligible == true ? (
                      <Col lg={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label>
                            Delivery Cost ({formatCurrency("", selectedCountry)})
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            className="form-control"
                            type="text"
                            name="costDelivery"
                            placeholder="Enter delivery code"
                            onChange={(e) => {
                              setFieldValue("costDelivery", e.target.value);
                            }}
                            value={values?.costDelivery}
                            onKeyPress={restrictAlpha1}
                            maxLength={10}
                            disabled={
                              values?.deliveryCompanyChecked !== "Armada"
                            }
                          />
                          {touched?.costDelivery && errors?.costDelivery ? (
                            <span className="error">
                              {touched?.costDelivery && errors?.costDelivery}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

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

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Company Logo
                          <span className="text-danger">*</span>
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

                        <span className="error">
                          {touched?.newPicked && errors?.newPicked}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Cover Image
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="newPickedCover_Img"
                          onChange={(e) =>
                            setFieldValue(
                              "newPickedCover_Img",
                              e.target.files[0]
                            )
                          }
                          accept="image/*"
                        />

                        {values?.newPickedCover_Img?.length !== 0 ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={
                                values?.newPickedCover_Img
                                  ? URL.createObjectURL(
                                    values?.newPickedCover_Img
                                  ) ?? ""
                                  : setFieldValue("newPickedCover_Img", "")
                              }
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        <span className="error">
                          {touched?.newPickedCover_Img &&
                            errors?.newPickedCover_Img}
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
                      {isPending ? "Submitting" : "Submit"}
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
