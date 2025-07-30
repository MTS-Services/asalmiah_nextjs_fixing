"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { parsePhoneNumber } from "libphonenumber-js/min";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "react-international-phone/style.css";
import * as yup from "yup";
import logo from "../../../../public/assets/img/logo.png";
import {
  resetPasswordLink
} from "../../../../services/APIServices";
import { constant } from "../../../../utils/constants";
import { getLinkHref, validEmailPattern } from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
import TranslateWidget from "../../../../utils/TranslateWidget";
const ForgotPassword = () => {
  const router = useRouter();
const [roleIdState,setRoleIdState] = useState("")
  let route = usePathname();
  useEffect(()=>{
    if (route === "/admin/forgot-password") {
      setRoleIdState(constant.ADMIN);
    } else if (route === "/designed-user/forgot-password") {
      setRoleIdState(constant.DESIGNED_USER);
    } else if (route === "/promotion-user/forgot-password") {
      setRoleIdState(constant.PROMOTION_USER);
    }
  },[])
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
      // mobile: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required()
        .label("Email Address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),

      // mobile: yup.string().when("login", {
      //   is: (value) => value == constant?.PHONE,
      //   then: () =>
      //     yup
      //       .string()
      //       .min(7, "Phone Number field is required")
      //       .test("phone-validate", "Invalid phone number", function (value) {
      //         if (value?.length > 6) {
      //           return isValidPhoneNumber(String(value));
      //         } else {
      //           return true;
      //         }
      //       })
      //       .required("Phone Number field is required"),
      // }),
    }),
    onSubmit: (values) => {
      let number = values?.mobile
        ? parsePhoneNumber(String(values?.mobile))
        : "";
      let body = {
        email: values?.email?.toLowerCase()?.trim(),
        roleId: 1,
      };

      // let body = {
      //   countryCode:
      //     values?.login == constant?.PHONE
      //       ? "+" + number?.countryCallingCode
      //       : "",
      //   mobile: values?.login == constant?.PHONE ? number?.nationalNumber : "",
      //   roleId: 1,
      //   // type: selectedOption,
      // };x

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
        // let roleId = "";
        // if (route === "/admin/forgot-password") {
        //   roleId = constant.ADMIN;
        // } else if (route === "/designed-user/forgot-password") {
        //   roleId = constant.DESIGNED_USER;
        // } else if (route === "/promotion-user/forgot-password") {
        //   roleId = constant.PROMOTION_USER;
        // }
      router.push(getLinkHref(roleIdState,'/'));
      // router.push(
      //   `/admin/verify-otp?countryCode=${number?.countryCallingCode}&mobile=${number?.nationalNumber}&type=forget&source=${values?.login}&otpType=${selectedOption}
      //   `
 // );
    },
  });




  return (
    <div className="login-box">
      <div className="translator">
        <TranslateWidget />
      </div>
      <div className="container-fluid">
        <div className="form-section">
          <div className="logo-2 text-center">
            <Link href={getLinkHref(roleIdState,"/")}>
              <Image height={57} width={154} src={logo} alt="logo" />
            </Link>
          </div>
          <h3>Forgot Password ?</h3>
          <p className="text-start mt-2 mb-1">
            Enter your registered e-mail id and we Will send a link to reset
            your password.
          </p>
          <br />

          <Form onSubmit={handleSubmit}>
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
                <span className="error">{touched.email && errors.email}</span>
              ) : (
                ""
              )}
            </div>

            {/* <Row>
              <Col md={12}>
                <div className="form-group form-box">
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
              </Col>
            </Row> */}

            <div className="form-group clearfix">
              <button
                type="submit"
                className="btn btn_theme float-start text-white"
              // disabled={!selectedOption}
              >
                Send{" "}
              </button>
            </div>
            <div className="return w-100 ">
              <p className="text-start">
                Return to <Link href={`#`}
                  onClick={(e) => {
                    e.preventDefault()
                    if (route == "/admin/forgot-password") {
                      router.push(getLinkHref(constant.ADMIN, '/'))
                    } else if (route == "/designed-user/forgot-password") {
                      router.push(getLinkHref(constant.DESIGNED_USER, '/'))
                    } else if (route == "/promotion-user/forgot-password") {
                      router.push(getLinkHref(constant.PROMOTION_USER, '/'))
                    }

                  }}

                >Log in</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
