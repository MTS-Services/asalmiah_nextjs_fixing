/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as yup from "yup";
import useSlider from "../../../../../../hooks/useSlider";
import {
  ADD_CONTACT_INFO
} from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import {
  countries,
  getLinkHref,
  urlRegex,
  validEmailPattern
} from "../../../../../../utils/helper";

import Autocomplete from "react-google-autocomplete";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import useDetails from "../../../../../../hooks/useDetails";
const Add = () => {
  const router = useRouter();
  const isSlider = useSlider();
  let detail = useDetails()
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_CONTACT_INFO(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/contact-info`));
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
    setFieldValue,
  } = useFormik({
    initialValues: {
      email: "",
      address: "",
      countryCode: "",
      mobile: "",
      fbLink: "",
      linkedinLink: "",
      snapChatLink: "",
      instaLink: "",
      whatAppNumber: "",
    },

    validationSchema: yup.object().shape({
      email: yup // Fix typo: enail -> email
        .string()
        .required()
        .label("Email")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),
      address: yup // Fix typo: enail -> email
        .string()
        .required()
        .label("Address")
        .trim(),

      mobile: yup
        .string()
        .min(7, "Mobile No is a required field")
        .test("phone-validate", "Invalid Mobile No", function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required("Mobile No field is required"),
      whatAppNumber: yup
        .string()
        .min(7, "WhatsApp Number is a required field")
        .test("phone-validate", "Invalid WhatsApp Number", function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required("WhatsApp Number field is required"),
      fbLink: yup
        .string()
        .label("Facebook URL")
        .trim()
        .matches(urlRegex, "Invalid URL"),
      linkedinLink: yup
        .string()
        .label("Linkedin URL")
        .trim()
        .matches(urlRegex, "Invalid URL"),
      snapChatLink: yup
        .string()
        .label("Snapchat URL")
        .trim()
        .matches(urlRegex, "Invalid URL"),
      instaLink: yup
        .string()
        .label("Instagram URL")
        .trim()
        .matches(urlRegex, "Invalid URL"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true); // Add this line
      let number = parsePhoneNumber(String(values?.mobile));
      let payload = {
        email: values?.email?.toLowerCase()?.trim(),
        countryCode: "+" + number?.countryCallingCode ?? "",
        mobile: number?.nationalNumber ?? "",
        fbLink: values?.fbLink ?? "",
        linkedinLink: values?.linkedinLink ?? "",
        snapChatLink: values?.snapChatLink ?? "",
        instaLink: values?.instaLink ?? "",
        address: values?.address ?? "",
        whatAppNumber: values?.whatAppNumber ?? "",
      };
      mutate(payload);
      setSubmitting(false); // Add this line
    },
  });

  const handlePlaces = (place) => {
    setFieldValue("address", place?.formatted_address);
    // setFieldValue("latitude", place?.geometry?.location?.lat());
    // setFieldValue("longitude", place?.geometry?.location?.lng());
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

                href={getLinkHref(detail?.roleId, "/page/contact-info")}
                className="text-capitalize text-black"
              >
                Contact-Info
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Contact-Info</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Contact-Info</h5>
                <Link href={getLinkHref(detail?.roleId, "/page/contact-info")}
                  className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Email<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="email"
                          placeholder="Enter Email"
                          onChange={handleChange}
                          value={values?.email}
                        />
                        {touched?.email && errors?.email ? (
                          <span className="error">
                            {touched?.email && errors?.email}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Address <span className="text-danger">*</span>
                        </label>
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
                          <span className="error">
                            {touched?.address && errors?.address}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Mobile No <span className="text-danger">*</span>
                        </label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter Mobile No"
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
                    <Col lg={6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Whatsapp No <span className="text-danger">*</span>
                        </label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter WhatsApp No"
                          name="whatAppNumber"
                          value={values?.whatAppNumber}
                          onChange={(value) => {
                            setFieldValue("whatAppNumber", value);
                          }}
                        />
                        {touched?.whatAppNumber && errors?.whatAppNumber ? (
                          <span className="error">
                            {touched?.whatAppNumber && errors?.whatAppNumber}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>Facebook URL</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="fbLink"
                          placeholder="Enter facebook url"
                          onChange={handleChange}
                          value={values?.fbLink}
                        />
                        {touched?.fbLink && errors?.fbLink ? (
                          <span className="error">
                            {touched?.fbLink && errors?.fbLink}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>Linkedin URL</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="linkedinLink"
                          placeholder="Enter linkedin url"
                          onChange={handleChange}
                          value={values?.linkedinLink}
                        />
                        {touched?.linkedinLink && errors?.linkedinLink ? (
                          <span className="error">
                            {touched?.linkedinLink && errors?.linkedinLink}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>Snapchat URL</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="snapChatLink"
                          placeholder="Enter snapchat url"
                          onChange={handleChange}
                          value={values?.snapChatLink}
                        />
                        {touched?.snapChatLink && errors?.snapChatLink ? (
                          <span className="error">
                            {touched?.snapChatLink && errors?.snapChatLink}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Instagram URL</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="instaLink"
                          placeholder="Enter instagram url"
                          onChange={handleChange}
                          value={values?.instaLink}
                        />
                        {touched?.instaLink && errors?.instaLink ? (
                          <span className="error">
                            {touched?.instaLink && errors?.instaLink}
                          </span>
                        ) : (
                          ""
                        )}
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

export default Add;
