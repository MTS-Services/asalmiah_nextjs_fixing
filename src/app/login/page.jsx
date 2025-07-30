

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { signIn, useSession } from "next-auth/react"; // Import for social login
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, Modal, Nav, Tab } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import useDetails from "../../../hooks/useDetails";
import { addToCart } from "../../../redux/features/cartSlice";
import { country } from "../../../redux/features/CountrySlice";
import {
  setRememberedEmail,
  toggleRememberMe,
} from "../../../redux/features/rememberSlice";
import { userDetails } from "../../../redux/features/userSlice";
import {
  loginAPI,
  socialLoginAPI,
  USER_CART,
  USER_CART_WITHOUT_LOGIN,
  USER_COUNTRY_EXIST,
} from "../../../services/APIServices";
import { constant, PROVIDERS } from "../../../utils/constants";
import {
  countries,
  getDeviceToken,
  validEmailPattern,
} from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import TranslateWidget from "../../../utils/TranslateWidget";
const Login = ({ baseUrl }) => {
  const { data: session, status } = useSession();
  let detail = useDetails();
  const searchParams = useSearchParams();
  const deviceToken = searchParams?.get("deviceToken");
  const isCart = searchParams?.get("isCart");

  const createPayload = (data, country) => ({
    socialType: data.provider,
    email: data.email,
    fullName: data.name,
    profileImage: data.image,
    deviceToken: deviceToken ?? null,
    isCart,
    country,
    ...(data.provider === PROVIDERS.GOOGLE && { googleId: data.id }),
    ...(data.provider === PROVIDERS.FACEBOOK && { facebookId: data.id }),
  });

  const [show, setShow] = useState(false);
  const [providerType, setProviderType] = useState(null);
  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const {
    touched: socialLoginTouched,
    errors: socialLoginErrors,
    values: socialLoginValues,
    handleChange: socialLoginHandleChange,
    handleBlur: socialLoginBlur,
    handleSubmit: socialLoginHandleSubmit,
    setFieldValue: socialLoginFieldValue,
  } = useFormik({
    initialValues: {
      // address: "",
      country: "Kuwait",
      // latitude: "",
      // longitude: "",
    },
   
    onSubmit: (value) => {
      if (session) {
        const payload = createPayload(session.user, value.country);
        socialLoginMutate(payload);
      }
    },
  });

  const handleGoogleLogin = () => {
    signIn("google");
  };

  const handleFacebookLogin = () => {
    signIn("facebook");
  };
  const handlePlaces = (place) => {
    socialLoginFieldValue("address", place?.formatted_address);
    socialLoginFieldValue("latitude", place?.geometry?.location?.lat());
    socialLoginFieldValue("longitude", place?.geometry?.location?.lng());
    socialLoginFieldValue(
      "country",
      place?.address_components?.at(-1)?.types?.at(0) == "country" &&
        place?.address_components?.at(-1)?.long_name
    );
  };

  const navigate = useRouter();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const { data: cartListing, refetch } = useQuery({
    queryKey: ["cart-list-user"],
    queryFn: async () => {
      const resp =
        detail == null || detail == undefined
          ? await USER_CART_WITHOUT_LOGIN("", "", getDeviceToken())
          : await USER_CART();
      await dispatch(addToCart(resp?.data?.data));
      return resp?.data?.data ?? [];
    },
    enabled: false,
  });

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      key: "first",
      mobile: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      mobile: yup.string().when("key", {
        is: (value) => value == "second",
        then: () =>
          yup
            .string()
            .min(7, "Mobile Number is a required field")
            .test("phone-validate", "Invalid mobile number", function (value) {
              if (value?.length > 6) {
                return isValidPhoneNumber(String(value));
              } else {
                return true;
              }
            })
            .required("Mobile Number is a required field"),
      }),
      email: yup.string().when("key", {
        is: (value) => value == "first",
        then: () =>
          yup
            .string()
            .required()
            .label("Email")
            .trim()
            .matches(validEmailPattern, "Invalid Email"),
      }),

      password: yup
        .string()
        .required()
        .label("Password")
        .trim()
        .min(6, "Password must be at least 6 characters long"),
    }),
    onSubmit: (values) => {
      let body;
      if (values.key == "second") {
        let number = values?.mobile
          ? parsePhoneNumber(String(values?.mobile))
          : "";
        body = {
          roleId: constant.USER,
          mobile: number?.nationalNumber,
          countryCode: "+" + number?.countryCallingCode,
          password: values?.password,
          deviceToken: deviceToken ?? null,
          isCart: isCart == "true" ? true : false ?? null,
        };
      } else {
        body = {
          roleId: constant.USER,
          email: values?.email.trim(),
          password: values?.password,
          deviceToken: deviceToken ?? null,
          isCart: isCart == "true" ? true : false ?? null,
        };
      }

      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    mutationFn: (body) => loginAPI(body),
    onSuccess: (resp) => {
      // if (resp?.data?.data?.isVerified === false) {
      //   toastAlert("success", "Your OTP is " + resp.data?.data?.otp);
      //   navigate.push(`/verify-otp?email=${encodeURIComponent(values?.email)}`);
      // } else {
      Cookies.set("userDetail", JSON.stringify(resp?.data?.data), {
        expires: 7,
      });
      dispatch(userDetails(resp?.data?.data));
      refetch();
      toastAlert("success", "You Have Logged In Successfully!");

      window.location.reload();
      navigate.push("/dashboard");

      // localStorage.removeItem("deviceToken");
      // }
    },
    onError: (error) => {
      toastAlert("error", error?.response?.data?.message);
    },
  });
  const { mutate: socialLoginMutate, isPending } = useMutation({
    mutationFn: (body) => socialLoginAPI(body),
    onSuccess: (resp) => {
      // if (resp?.data?.data?.isVerified === false) {
      //   toastAlert("success", "Your OTP is " + resp.data?.data?.otp);
      //   navigate.push(`/verify-otp?email=${encodeURIComponent(values?.email)}`);
      // } else {
      Cookies.set("userDetail", JSON.stringify(resp?.data?.data), {
        expires: 7,
      });
      dispatch(userDetails(resp?.data?.data));
      dispatch(country(resp?.data?.data?.country));
      refetch();
      toastAlert("success", "You Have Logged In Successfully!");
      handleClose();
      setTimeout(() => {
        window.location.reload();
        // localStorage.removeItem("deviceToken");

        navigate.push("/dashboard");
      }, 2000);
      // }
    },
    onError: (error) => {
      toastAlert("error", error?.response?.data?.message);
    },
  });

  const getData = async () => {
    if (!session) return;

    const body = {
      [session.user.provider === PROVIDERS.GOOGLE ? "googleId" : "facebookId"]:
        session.user.id,
    };

    try {
      const response = await USER_COUNTRY_EXIST(body);
      if (!response.data.data.userExists) {
        handleShow();
      } else {
        const payload = createPayload(session.user);
        socialLoginMutate(payload);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session) {
      getData();
    }
  }, [session]);

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
    <div className="login-box">
      <div className="translator">
        <TranslateWidget />
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="form-section text-start">
              <div className="logo-2">
                <Link href="/">
                  <h1 className="text-black text-center">
                    <Image
                      src={`/assets/img/logo.png`}
                      height={57}
                      width={145}
                      alt="logo"
                    />
                  </h1>
                </Link>
              </div>
              <h3 className="text-center">Let&apos;s Log You In</h3>
              <form onSubmit={handleSubmit}>
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey="first"
                  activeKey={values?.key}
                  onSelect={(k) => {
                    setFieldValue("key", k);
                    setFieldValue("password", "");
                  }}
                >
                  <Nav
                    variant="pills"
                    className="align-items-center justify-content-center mb-4"
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="first" className="login-tab">
                        Email Address
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second" className="login-tab">
                        Mobile Number
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <div className="form-group mb-3">
                        <label className="mb-2">Email Address </label>
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Enter an email"
                          name="email"
                          value={values?.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched.email && errors.email ? (
                          <span className="error">{errors.email}</span>
                        ) : null}
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="second">
                      <div className="form-group mb-3">
                        <label className="mb-2">Mobile Number </label>
                        <PhoneInput
                          className=""
                          defaultCountry="kw"
                          placeholder="Enter Mobile Number"
                          value={values?.mobile}
                          onChange={(value) => {
                            setFieldValue("mobile", value);
                          }}
                          countries={countries}
                        />
                        {touched.mobile && errors.mobile ? (
                          <span className="error">{errors.mobile}</span>
                        ) : null}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                  {touched.password && errors.password ? (
                    <span className="error">{errors.password}</span>
                  ) : null}

                  {showPass ? (
                    <span
                      className="eye-icon"
                      onClick={() => setShowPass(false)}
                    >
                      <FaEye />
                    </span>
                  ) : (
                    <span
                      className="eye-icon"
                      onClick={() => setShowPass(true)}
                    >
                      <FaEyeSlash />
                    </span>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
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
                    className="{styles.resend_otp} red-txt"
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   navigate.push("/forgot-password");
                    // }}

                    href={"/forgot-password"}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="btn btn-theme w-100 mt-2" disabled={isPending}>
                  Log In
                </button>
                <p className="text-center mt-3 mb-3">OR</p>

                <button
                  type="button"
                  className="btn btn-outline-primary google-btn w-100 mb-3"
                  onClick={handleGoogleLogin}
                >
                  Log In with Google <FaGoogle className="ms-1" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary facebook-btn w-100"
                  onClick={handleFacebookLogin}
                >
                  Log In with Facebook <FaFacebook className="ms-1" />
                </button>
                <p className="mt-3">
                  Don&apos;t have an account?&nbsp;
                  <Link
                    className="red-txt"
                    href={
                      deviceToken && isCart
                        ? `/signup?isCart=${true}&deviceToken=${encodeURIComponent(
                            deviceToken
                          )}`
                        : "/signup"
                    }
                  >
                    Sign up Here!
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <Image
              src="/assets/img/log.png" // Ensure the path is correct
              alt="image-banner"
              className="img-fluid mx-auto d-block"
              height={300}
              width={500}
            />
          </div>
        </div>
        <div className="copyrightnew">
          <p className="text-center mb-0 pb-3 pt-3">
            © {new Date().getFullYear()}
            <Link href="/">&nbsp;Offarat </Link> | All Rights Reserved.
            Developed By
            <Link href="https://toxsl.com/" target="_blank">
              &nbsp;Toxsl Technologies
            </Link>
          </p>
        </div>
      </div>
      {/* {isPending ? <Loading /> : null} */}

      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div>
              <label>Select Country</label>
              {/* <Autocomplete
                apiKey={"AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"}
                placeholder="Enter address"
                name="address"
                className="form-control"
                value={socialLoginValues?.address}
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
                onChange={socialLoginHandleChange}
                onBlur={socialLoginBlur}
                onPlaceSelected={(place) => {
                  handlePlaces(place);
                }}
              /> */}
              <Form.Select
                onChange={socialLoginHandleChange}
                value={socialLoginValues?.country}
                name="country"
              >
                <option value={"Kuwait"}>Kuwait</option>

                <option value={"Jordan"}>Jordan</option>
                <option value={"UAE"}>UAE</option>
              </Form.Select>
             
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-theme mt-3" onClick={handleClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-theme mt-3"
            onClick={socialLoginHandleSubmit}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
