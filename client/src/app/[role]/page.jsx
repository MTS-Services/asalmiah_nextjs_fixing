/**
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import login from "../../../public/assets/img/log.png";
import {
  setRememberedEmail,
  toggleRememberMe,
} from "../../../redux/features/rememberSlice";
import { userDetails } from "../../../redux/features/userSlice";
import { adminLogin } from "../../../services/APIServices";
import { constant } from "../../../utils/constants";
import { getLinkHref, validEmailPattern } from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import TranslateWidget from "../../../utils/TranslateWidget";
import { country } from "../../../redux/features/CountrySlice";
import useDetails from "../../../hooks/useDetails";
const Login = () => {
  const navigate = useRouter();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  let route = usePathname();
  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required()
        .label("Email")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),
      password: yup
        .string()
        .required()
        .label("Password")
        .trim()
        .min(6, "Password must be at least 6 characters long"),
    }),
    onSubmit: (values) => {

      let roleId = "";
      if (
        route == "/admin" ||
        route == "/designed-user" ||
        route == "/promotion-user"
      ) {
        if (route === "/admin") {
          roleId = constant.ADMIN;
        } else if (route === "/designed-user") {
          roleId = constant.DESIGNED_USER;
        } else if (route === "/promotion-user") {
          roleId = constant.PROMOTION_USER;
        }
        let body = {
          email: values?.email?.toLowerCase()?.trim(),

          password: values?.password,
          roleId: roleId,
        };

        mutation.mutate(body);
      } else {
        toastAlert("error", "You are not authorized to login");
        navigate.push(`/`);
      }
    },
  });
  const mutation = useMutation({
    mutationFn: (body) => adminLogin(body),
    onSuccess: (resp) => {
      // debugger;

      Cookies.set("userDetail", JSON.stringify(resp?.data?.data?.at(1)), {
        expires: 7,
      });
      if (resp?.data?.data?.at(0)?.permission?.rolesPrivileges) {
        localStorage.setItem("permissionStore", JSON.stringify(resp?.data?.data?.at(0)?.permission))

      }
      window.location.reload();
      navigate.push(`${getLinkHref(resp?.data?.data?.roleId, "/page")}`);
      dispatch(country());
      dispatch(userDetails(resp?.data?.data?.at(1)));
      toastAlert("success", resp?.data?.message);
      resetForm();
    },
  });

  const ischeck = useSelector((state) => state.remember.rememberMe);
  const rememberedEmail = useSelector(
    (state) => state.remember.rememberedEmail
  );

  useEffect(() => {
    if (ischeck && rememberedEmail) {
      handleChange({ target: { name: "email", value: rememberedEmail } });
    }
  }, [ischeck, rememberedEmail, handleChange]);

  const handleRememberMe = () => {
    dispatch(toggleRememberMe());
    if (!ischeck) {
      dispatch(setRememberedEmail({ email: values?.email }));
    }
  };

  return (
    <>
      {/* <div className="select-color"> */}
      <div className="login-box">
        <Container fluid>
          <div className="translator">
            <TranslateWidget />
          </div>
          <Row>
            <Col lg={6}>
              <div className="form-section">
                <div className="logo-2">
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
                <br />
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group form-box mb-3">
                        <label className="mb-2">Email Address</label>
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Enter a email "
                          name="email"
                          value={values?.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.email && errors?.email ? (
                          <span className="text-danger">
                            {touched.email && errors.email}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-group mb-3 position-relative">
                        <label className="mb-2">Password</label>
                        <input
                          className="form-control"
                          type={showPass ? "text" : "password"}
                          placeholder="Enter a password"
                          name="password"
                          value={values?.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyPress={(e) => {
                            if (e.charCode === 13) {
                              e.preventDefault();
                              handleSubmit();
                            }
                          }}
                        />
                        {touched.password && errors.password ? (
                          <span className="text-danger">
                            {touched.password && errors.password}
                          </span>
                        ) : (
                          ""
                        )}

                        {showPass ? (
                          <span
                            className="eye-icon"
                            onClick={() => {
                              setShowPass(false);
                            }}
                          >
                            <FaEye />
                          </span>
                        ) : (
                          <span
                            className="eye-icon"
                            onClick={() => {
                              setShowPass(true);
                            }}
                          >
                            <FaEyeSlash />
                          </span>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <span>
                          <input
                            type="checkbox"
                            id="remember"
                            checked={ischeck}
                            onChange={handleRememberMe}
                          />
                          <label className="ms-1" htmlFor="remember">
                            Remember Me
                          </label>
                        </span>
                        <Link
                          className={"forgot-password"}

                          onClick={(e) => {
                            e.preventDefault()
                            if (route == "/admin") {
                              navigate.push(getLinkHref(constant.ADMIN, '/forgot-password'))
                            } else if (route == "/designed-user") {
                              navigate.push(getLinkHref(constant.DESIGNED_USER, '/forgot-password'))

                            } else if (route == "/promotion-user") {
                              navigate.push(getLinkHref(constant.PROMOTION_USER, '/forgot-password'))

                            }

                          }}

                          href={"#"}
                        >
                          Forgot Password ?
                        </Link>
                      </div>
                      <button type="submit" className="btn btn-theme w-100">
                        Log In
                      </button>
                      <br />
                      <br />
                    </div>
                  </div>
                </form>
              </div>
            </Col>
            <div className="col-lg-6">
              <Image
                src={login}
                alt="image-banner"
                className="img-fluid mx-auto d-block"
              />
            </div>
          </Row>
        </Container>
      </div>
      {/* </div> */}
    </>
  );
};

export default Login;
