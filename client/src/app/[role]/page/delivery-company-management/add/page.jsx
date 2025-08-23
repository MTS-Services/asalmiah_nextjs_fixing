/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import Link from "next/link";
import * as yup from "yup";
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import useSlider from "../../../../../../hooks/useSlider";
import { ADD_DELIVERY_COMPANY_API } from "../../../../../../services/APIServices";
import { countryCode } from "../../../../../../utils/CountryCode";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import {
  countries,
  formatCurrency,
  getLinkHref,
  restrictAlpha,
  validEmailPattern,
} from "../../../../../../utils/helper";
import Autocomplete from "react-google-autocomplete";
import useCountryState from "../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../hooks/useDetails";
const Add = () => {
  const router = useRouter();
  const detail = useDetails()
  const selectedCountry = useCountryState();

  const isSlider = useSlider();
  const navigate = useRouter();
  const queryClient = useQueryClient();

  function generatePromocode(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let promocode = "";

    for (let i = 0; i < length; i++) {
      promocode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return promocode;
  }
  const handlePlaces = (place) => {
    setFieldValue("address", place?.formatted_address);
    setFieldValue("latitude", place?.geometry?.location?.lat());
    setFieldValue("longitude", place?.geometry?.location?.lng());
  };
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_DELIVERY_COMPANY_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/delivery-company-management`));
      queryClient.invalidateQueries({ queryKey: ["getdeliverycompany-list"] });
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
      company: "",
      company_logo: "",
      newPicked: "",
      country: "",
      email: "",
      companyCode: generatePromocode(),
      mobile: "",
      description: "",
      registration: "",
      startTime: "",
      endTime: "",
      address: "",
      latitude: "",
      longitude: "",
      contactPersonName: "",
      contactPersonMobile: "",
      active: 0,
      costDeliveryOffrat: "",
      costDeliveryCustomer: "",
      default: 0,
      // ARABIC
      arabicCompany: "",
      arabicDescription: "",
      arabicRegistration: "",
      arabicContactPersonName: "",
    },

    validationSchema: yup.object().shape({
      company: yup.string().required().label("Company name").trim(),
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
      country: yup.string().required().label("Country"),
      email: yup
        .string()
        .required()
        .label("Email Address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),
      companyCode: yup.string().required().label("Company Code"),
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
      description: yup.string().required().label("Description").trim(),
      registration: yup.string().required().label("Registration").trim(),
      startTime: yup.string().required().label("Start Time"),
      endTime: yup.string().required().label("End Time"),
      address: yup.string().required().label("Address").trim(),
      contactPersonName: yup
        .string()
        .required()
        .label("Contact person name")
        .trim(),
      contactPersonMobile: yup
        .string()
        .min(7, "Phone Number is a required field")
        .test("phone-validate", "Invalid phone number", function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required("Contact Person Phone Number field is required"),

      costDeliveryOffrat: yup
        .number()
        .required()
        .label("Delivery Cost Offrat")
        .positive()
        .min(1)
        .typeError("Invalid input"),
      costDeliveryCustomer: yup
        .number()
        .required()
        .label("Delivery Cost Customer")
        .positive()
        .min(1)
        .typeError("Invalid input"),

      // ARABIC
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
      arabicRegistration: yup
        .string()
        .required()
        .label("Registration (In Arabic)")

        .trim(),
      arabicContactPersonName: yup
        .string()
        .required()
        .label("Contact person name (In Arabic)")

        .trim(),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();
      let number = parsePhoneNumber(String(values?.mobile));
      let contactPersonNumber = parsePhoneNumber(
        String(values?.contactPersonMobile)
      );

      payload.append("company", values?.company);
      if (values?.newPicked) {
        payload.append("logo", values?.newPicked);
      }
      payload.append("country", values?.country);
      payload.append("email", values?.email);
      payload.append("companyCode", values?.companyCode);
      payload.append(
        "mobile",
        "+" + number?.countryCallingCode + number?.nationalNumber
      );
      payload.append("description", values?.description);
      payload.append("registration", values?.registration);
      payload.append("startTime", values?.startTime);
      payload.append("endTime", values?.endTime);
      payload.append("address", values?.address);
      payload.append("longitude", values?.longitude);
      payload.append("latitude", values?.latitude);

      payload.append("contactPersonName", values?.contactPersonName);
      payload.append(
        "contactPersonMobile",
        "+" +
        contactPersonNumber?.countryCallingCode +
        contactPersonNumber?.nationalNumber
      );
      payload.append("active", values?.active);
      payload.append("costDeliveryOffrat", values?.costDeliveryOffrat);
      payload.append("costDeliveryCustomer", values?.costDeliveryCustomer);
      payload.append("default", values?.default);
      // ARABIC
      payload.append("arabicCompany", values?.arabicCompany);
      payload.append("arabicDescription", values?.arabicDescription);
      payload.append("arabicRegistration", values?.arabicRegistration);
      payload.append(
        "arabicContactPersonName",
        values?.arabicContactPersonName
      );
      mutate(payload);
    },
  });

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
                href={getLinkHref(detail?.roleId, `/page/delivery-company-management`)}
                className="text-capitalize text-black"
              >
                Delivery Company management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Delivery Company</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Delivery Company </h5>
                <Link
                  href={getLinkHref(detail?.roleId, `/page/delivery-company-management`)}
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
                          Company Name<span className="text-danger">*</span>
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

                    <Col lg={6}>
                      <Form.Group className="mb-4 position-relative">
                        <Form.Label>
                          Country<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          label="country"
                          name="country"
                          value={values?.country}
                          onChange={handleChange}
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
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Email<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email address"
                          name="email"
                          value={values?.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.email && errors?.email ? (
                          <span className="error">
                            {touched.email && errors.email}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Company Code<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter company code"
                          name="companyCode"
                          value={values?.companyCode}
                          onChange={(e) => {
                            const uppercaseValue = e.target.value.toUpperCase();
                            setFieldValue("companyCode", uppercaseValue);
                          }}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.companyCode && errors?.companyCode ? (
                          <span className="error">
                            {touched.companyCode && errors.companyCode}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Phone Number<span className="text-danger">*</span>
                        </Form.Label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter phone number"
                          value={values?.mobile}
                          onChange={(value) => {
                            setFieldValue("mobile", value);
                          }}
                          countries={countries}
                        />
                        {touched?.mobile && errors?.mobile ? (
                          <span className="error">
                            {touched.mobile && errors.mobile}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Description<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter description"
                          name="description"
                          value={values?.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        {touched?.description && errors?.description ? (
                          <span className="error">
                            {touched.description && errors.description}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Description (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter description (in arabic)"
                          name="arabicDescription"
                          value={values?.arabicDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        {touched?.arabicDescription &&
                          errors?.arabicDescription ? (
                          <span className="error">
                            {touched.arabicDescription &&
                              errors.arabicDescription}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Registration<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter registration"
                          name="registration"
                          value={values?.registration}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.registration && errors?.registration ? (
                          <span className="error">
                            {touched.registration && errors.registration}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Registration (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter registration (in arabic)"
                          name="arabicRegistration"
                          value={values?.arabicRegistration}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.arabicRegistration &&
                          errors?.arabicRegistration ? (
                          <span className="error">
                            {touched.arabicRegistration &&
                              errors.arabicRegistration}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Start Time<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="time"
                          placeholder="Enter start time"
                          name="startTime"
                          value={values?.startTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        {touched?.startTime && errors?.startTime ? (
                          <span className="error">
                            {touched.startTime && errors.startTime}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          End Time<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="time"
                          placeholder="Enter end time"
                          name="endTime"
                          value={values?.endTime}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touched?.endTime && errors?.endTime ? (
                          <span className="error">
                            {touched.endTime && errors.endTime}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Address<span className="text-danger">*</span>
                        </Form.Label>
                        <Autocomplete
                          apiKey={"AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"}
                          placeholder="Enter address"
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
                            componentRestrictions: {
                              country: ["JO", "KW", "AE"],
                            },
                          }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onPlaceSelected={(place) => {
                            handlePlaces(place);
                          }}
                        />
                        {touched?.address && errors?.address ? (
                          <p className="error">
                            {touched.address && errors.address}
                          </p>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Contact Person Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter contact person name"
                          name="contactPersonName"
                          value={values?.contactPersonName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.contactPersonName &&
                          errors?.contactPersonName ? (
                          <span className="error">
                            {touched.contactPersonName &&
                              errors.contactPersonName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Contact Person Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter contact person name (in arabic)"
                          name="arabicContactPersonName"
                          value={values?.arabicContactPersonName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.arabicContactPersonName &&
                          errors?.arabicContactPersonName ? (
                          <span className="error">
                            {touched.arabicContactPersonName &&
                              errors.arabicContactPersonName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group>
                        <Form.Label>
                          Contact Person Phone Number
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter phone number"
                          value={values?.contactPersonMobile}
                          onChange={(value) => {
                            setFieldValue("contactPersonMobile", value);
                          }}
                          countries={countries}
                        />
                        {touched?.contactPersonMobile &&
                          errors?.contactPersonMobile ? (
                          <span className="error">
                            {touched.contactPersonMobile &&
                              errors.contactPersonMobile}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Delivery Cost Offarat ({formatCurrency("", selectedCountry)})
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="costDeliveryOffrat"
                          placeholder="Enter offarat delivery cost"
                          onChange={handleChange}
                          value={values?.costDeliveryOffrat}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.costDeliveryOffrat &&
                          errors?.costDeliveryOffrat ? (
                          <span className="error">
                            {touched?.costDeliveryOffrat &&
                              errors?.costDeliveryOffrat}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Delivery Cost Customer ({formatCurrency("", selectedCountry)})
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="costDeliveryCustomer"
                          placeholder="Enter customer delivery cost"
                          onChange={handleChange}
                          value={values?.costDeliveryCustomer}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.costDeliveryCustomer &&
                          errors?.costDeliveryCustomer ? (
                          <span className="error">
                            {touched?.costDeliveryCustomer &&
                              errors?.costDeliveryCustomer}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Logo
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

                        {touched?.newPicked && errors?.newPicked ? (
                          <span className="error">
                            {touched?.newPicked && errors?.newPicked}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <div className="active-radio d-flex algn-items-center justify-content-start mb-5">
                        <Form.Group className="mt-3">
                          <Form.Label>Active</Form.Label>
                          <Form.Check
                            name="active"
                            type="radio"
                            label="True"
                            id="true"
                            checked={values?.active == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="active"
                            type="radio"
                            label="False"
                            id="false"
                            checked={values?.active == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="active-radio d-flex algn-items-center justify-content-start mb-5">
                        <Form.Group className="mt-3">
                          <Form.Label>Default</Form.Label>
                          <Form.Check
                            name="default"
                            type="radio"
                            label="True"
                            id="true"
                            checked={values?.default == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="default"
                            type="radio"
                            label="False"
                            id="false"
                            checked={values?.default == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
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
