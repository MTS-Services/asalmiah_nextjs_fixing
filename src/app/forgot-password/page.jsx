"use client";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { parsePhoneNumber } from "libphonenumber-js/min";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Col, Form, Row } from "react-bootstrap";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as yup from "yup";
import login from "../../../public/assets/img/log.png";
import {
  forgetPassword,
  resetPasswordLink,
} from "../../../services/APIServices";
import { constant } from "../../../utils/constants";
import { countries, validEmailPattern } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import TranslateWidget from "../../../utils/TranslateWidget";
import { useState } from "react";
const ForgotPassword = () => {
  const navigate = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      login: constant?.EMAIL,
      email: "",
      mobile: "",
    },
    validationSchema: yup.object().shape({
      mobile: yup.string().when("login", {
        is: (value) => value == constant?.PHONE,
        then: () =>
          yup
            .string()
            .min(7, "Phone Number field is required")
            .test("phone-validate", "Invalid phone number", function (value) {
              if (value?.length > 6) {
                return isValidPhoneNumber(String(value));
              } else {
                return true;
              }
            })
            .required("Phone Number field is required"),
      }),

      email: yup.string().when("login", {
        is: (value) => value == constant?.EMAIL,
        then: () =>
          yup
            .string()
            .required()
            .label("Email")
            .trim()
            .matches(validEmailPattern, "Invalid Email"),
      }),
    }),
    onSubmit: (values) => {
      let number = values?.mobile
        ? parsePhoneNumber(String(values?.mobile))
        : "";
      let body;
      if (values?.login == constant?.EMAIL) {
        body = {
          email: values?.login == constant?.EMAIL ? values?.email : "",
          // type: selectedOption,
          roleId: 2,
        };
      } else {
        body = {
          countryCode:
            values?.login == constant?.PHONE
              ? "+" + number?.countryCallingCode
              : "",
          mobile:
            values?.login == constant?.PHONE ? number?.nationalNumber : "",
          roleId: 2,
          type: selectedOption,
        };
      }

      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    // mutationFn: (body) => forgetPassword(body),
    mutationFn: (body) => resetPasswordLink(body),

    onSuccess: (res) => {
      // toastAlert("success", "Your OTP is " + res?.data?.data?.otp);
      toastAlert("success", res?.data?.message);

      let number = values?.mobile
        ? parsePhoneNumber(String(values?.mobile))
        : "";

      navigate.push("/login");
      // if (values?.login == constant?.EMAIL) {
      //   navigate.push(
      //     `/verify-otp?email=${values?.email}&type=forget&source=${values?.login}`
      //   );
      // } else {
      //   navigate.push(
      //     `/verify-otp?countryCode=${number?.countryCallingCode}&mobile=${number?.nationalNumber}&type=forget&source=${values?.login}&otpType=${selectedOption}`
      //   );
      // }
    },
  });

  return (
    <div className="login-box">
      <div className="translator">
        <TranslateWidget />
      </div>
      <div className="container">
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="form-section">
              <div className="logo-2 mb-3">
                <Link href="/">
                  <h1 className="text-black text-center">
                    {" "}
                    <Image
                      src={`/assets/img/logo.png`}
                      height={57}
                      width={145}
                      alt="logo"
                    />
                  </h1>
                </Link>
              </div>
              <h3>Forgot Password ?</h3>
              <p className="text-start mt-2">
                Enter your registered e-mail id and we Will send a link to reset
                your password.
              </p>

              <form onSubmit={handleSubmit}>
                {values?.login == constant?.EMAIL ? (
                  <div className="form-group form-box">
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
                  </div>
                ) : (
                  <Row>
                    {/* <Col md={12}>
                    <div className="form-group">
                      <PhoneInput
                        defaultCountry="kw"
                        placeholder="Phone Number"
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
                      <p className="text-start mt-2">
                        Please select your preferred option to continue:
                      </p>

                      <label>
                        <input
                          className="m-3"
                          type="radio"
                          value={1}
                          checked={selectedOption == 1}
                          onChange={() => setSelectedOption(1)}
                        />
                        WhatsApp
                      </label>

                      <label>
                        <input
                          className="m-3"
                          type="radio"
                          value={2}
                          checked={selectedOption == 2}
                          onChange={() => setSelectedOption(2)}
                        />
                        SMS
                      </label>
                    </div>
                  </Col> */}
                  </Row>
                )}

                <div className="form-group mb-3 clearfix">
                  <button
                    type="submit"
                    className="btn btn-theme float-start"
                    // disabled={!selectedOption}
                  >
                    Submit{" "}
                  </button>
                  <Link href={`/`} className="forgot-password">
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </Col>
          <Col lg={6}>
            <Image
              src={login}
              alt="image-banner"
              className="img-fluid mx-auto d-block"
            />
          </Col>
        </Row>
        <div className="copyrightnew">
          <p className="text-center pt-3 mb-0">
            © {new Date().getFullYear()}
            <Link href="/">&nbsp;Offarat </Link> | All Rights Reserved.
            Developed By
            <Link href="https://toxsl.com/" target="_blank">
              &nbsp;Toxsl Technologies
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
