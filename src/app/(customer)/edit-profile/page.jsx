"use client";
import UserSidebar from "@/app/components/UserSidebar";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import Autocomplete from "react-google-autocomplete";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import OTPInput from "react-otp-input";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useDetails from "../../../../hooks/useDetails";
import userDummyImage from "../../../../public/assets/img/default.png";
import { userDetails } from "../../../../redux/features/userSlice";
import {
  checkVerify,
  resendOTPByOrder,
  updateMyProfile,
  verifyOTPByLogin,
} from "../../../../services/APIServices";
import Footer from "../../../../utils/Footer";
import { toastAlert } from "../../../../utils/SweetAlert";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import {
  countries,
  stringRegx,
  validEmailPattern,
} from "../../../../utils/helper";
import { trans } from "../../../../utils/trans";
import Breadcrums from "../../components/Breadcrums";
import "../dashboard/page.scss";
const EditProfile = () => {
  let detail = useDetails();
  let navigate = useRouter();
  let dispatch = useDispatch();
  const [showVerify, setShowVerify] = useState(false);
  const [otpVerifyModal, setOTPverifyModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const handleClose = () => setShowVerify(false);
  const mutationVerify = useMutation({
    mutationFn: ({ body }) => checkVerify(body),
    onSuccess: (res) => {
      setOTPverifyModal(true);
      toastAlert("success", res?.data?.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: yup.object().shape({
      otp: yup.string().required().label("OTP").length(4),
    }),
    onSubmit: (values) => {
      let body = {
        otp: values?.otp,
        email: detail?.email,
      };

      verifyOTPMutation(body);
    },
  });

  const { mutate: verifyOTPMutation } = useMutation({
    mutationFn: (body) => verifyOTPByLogin(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      Cookies.set("userDetail", JSON.stringify(resp?.data?.data), {
        expires: 7,
      });

      dispatch(userDetails(resp?.data?.data));
      setShowVerify(false);
      formik.resetForm();
      handleSubmit();
      setOTPverifyModal(false);
    },
    onError: (err) => {
      toastAlert("error", err?.response?.data?.message);
      formik.resetForm();
      setSelectedOption("");
    },
  });

  const { mutate: resendOTPMutation } = useMutation({
    mutationFn: (body) => resendOTPByOrder(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      setSelectedOption("");
      setNewIsActive(true); // Activate the timer after OTP resend
    },
  });

  const [newTimer, setNewTimer] = useState(60); // Initial timer value (seconds)
  const [newIsActive, setNewIsActive] = useState(false); // Timer activation flag

  const handleClick = () => {
    resendOTPMutation({
      email: detail?.email,
      type: selectedOption,
    });
    setNewIsActive(true);
  };

  useEffect(() => {
    let intervalId;
    if (newIsActive) {
      intervalId = setInterval(() => {
        setNewTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId); // Cleanup on component unmount or timer reset
  }, [newIsActive]);

  useEffect(() => {
    if (newTimer === 0) {
      setNewIsActive(false); // Deactivate timer when it reaches 0
      setNewTimer(60); // Reset timer value
    }
  }, [newTimer]);

  const mutation = useMutation({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: (resp) => {
      if (resp?.data?.data?.isVerified == true) {
        toastAlert("success", resp?.data?.message);
      }

      dispatch(userDetails(resp?.data?.data));
      if (resp?.data?.data?.isVerified == false) {
        setShowVerify(true);
      } else {
        navigate.push("/profile");
      }
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      profileImg: "",
      newPicked: "",
      mobile: "",
      countryCode: "",
      address: "",
      longitude: "",
      latitude: "",
      country: "",
    },
    validationSchema: yup.object().shape({
      userName: yup
        .string()
        .required()
        .label("User name")

        .matches(/^\S+$/, "User Name should not contain spaces")
        .min(2, "User name should be more than 2 characters")
        .trim(),
      firstName: yup
        .string()
        .required()
        .label("First name")
        .matches(stringRegx, "First name is not valid")
        .matches(/^\S+$/, "First Name should not contain spaces")
        .min(2, "First name should be more than 2 characters")
        .trim(),
      lastName: yup
        .string()
        .required()
        .label("Last name")
        .matches(stringRegx, "Last name is not valid")
        .matches(/^\S+$/, "Last Name should not contain spaces")
        .min(2, "Last name should be more than 2 characters")
        .trim(),
      email: yup
        .string()
        .required()
        .label("Email address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),
      newPicked: yup.mixed().when(([newPicked], schema) => {
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
      address: yup.string().required().label("Address").trim(),
    }),
    onSubmit: async function (values) {
      let payload = new FormData();
      let number = parsePhoneNumber(String(values?.mobile));
      payload.append("userName", values?.userName ?? "");

      payload.append("firstName", values?.firstName ?? "");
      payload.append("lastName", values?.lastName ?? "");
      payload.append("email", values?.email ?? "");
      payload.append("address", values?.address ?? "");
      payload.append("countryCode", "+" + number?.countryCallingCode ?? "");
      payload.append("mobile", number?.nationalNumber ?? "");
      payload.append("longitude", values?.longitude ?? "");
      payload.append("latitude", values?.latitude ?? "");
      payload.append("country", values?.country ?? "");

      if (values?.newPicked) {
        payload.append("profileImg", values?.newPicked);
      }
      mutation.mutate(payload);
    },
  });

  useEffect(() => {
    if (detail?._id) {
      setValues({
        ...values,
        userName: detail?.userName,
        firstName: detail?.firstName,
        lastName: detail?.lastName,
        email: detail?.email,
        profileImg: detail?.profileImg,
        address: detail?.address,
        longitude: detail?.longitude,
        latitude: detail?.latitude,
        mobile: detail?.countryCode + detail?.mobile,
        country: detail?.country,
      });
    }
  }, []);

  const handlePlaces = (place) => {
    setFieldValue("address", place?.formatted_address);
    setFieldValue("latitude", place?.geometry?.location?.lat());
    setFieldValue("longitude", place?.geometry?.location?.lng());
  };

  let language = localStorage.getItem("language");
  const Home = trans("home");
  return (
    <>
      <div>
        <UserLogInHeader />
        <div>
          <Breadcrums
            firstLink={Home}
            secondLink={"Edit Profile"}
            language={language}
          />
        </div>
        <section>
          <Container>
            <Row>
              <Col lg={12}></Col>
            </Row>
            <Row>
              <Col lg={3}>
                <UserSidebar />
              </Col>
              <Col lg={9} className="mt-lg-0 mt-4">
                <div className="dashboard-right-box">
                  <div className="notification-tab">
                    <div className="sidebar-title mb-4">
                      <h4>edit profile</h4>
                    </div>
                    <div className="card-detail">
                      <div className="upload-profile-img text-center mb-5">
                        <label for="img-upload" className="position-relative">
                          <Image
                            src={
                              values?.newPicked
                                ? URL.createObjectURL(values?.newPicked)
                                : values?.profileImg
                                ? values?.profileImg
                                : userDummyImage
                            }
                            alt="profile-img"
                            height={100}
                            width={100}
                          />
                          {touched?.newPicked && errors?.newPicked ? (
                            <span className="error">
                              {touched?.newPicked && errors?.newPicked}
                            </span>
                          ) : (
                            ""
                          )}
                          <div className="img-upload-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-camera"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                            </svg>
                          </div>
                        </label>
                        <input
                          name="profileImg"
                          type="file"
                          accept="image/*"
                          id="img-upload"
                          className="d-none"
                          onChange={(e) =>
                            setFieldValue("newPicked", e.target.files[0])
                          }
                        />
                      </div>

                      <form>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">
                                User Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Enter user name"
                                name="userName"
                                value={values?.userName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-control bg-white"
                                maxLength={15}
                              />
                              {touched?.userName && errors?.userName ? (
                                <span className="error">
                                  {touched?.userName && errors?.userName}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Enter first name"
                                name="firstName"
                                value={values?.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-control bg-white"
                                maxLength={15}
                              />
                              {touched?.firstName && errors?.firstName ? (
                                <span className="error">
                                  {touched?.firstName && errors?.firstName}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Enter last name"
                                name="lastName"
                                value={values?.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-control bg-white"
                                maxLength={15}
                              />
                              {touched?.lastName && errors?.lastName ? (
                                <span className="error">
                                  {touched?.lastName && errors?.lastName}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">
                                Email address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={values?.email}
                                className="form-control bg-white"
                                dir="ltr"
                                translate="no"
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
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">
                                Phone <span className="text-danger">*</span>
                              </label>
                              <PhoneInput
                                defaultCountry="kw"
                                placeholder="Phone Number"
                                name="mobile"
                                dir="ltr"
                                translate="no"
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
                          {detail?.socialType ? (
                            <Col lg={6}>
                              <div className="mb-4">
                                <label className="form-label">
                                  Country
                                </label>
                                <input
                                 className="form-control bg-white"
                                  placeholder="Country"
                                  name="country"
                                  translate="no"
                                  value={values?.country}
                                  onChange={(value) => {
                                    setFieldValue("country", value);
                                  }}
                                  disabled
                                />
                              </div>
                            </Col>
                          ) : (
                            ""
                          )}

                          <Col lg={12}>
                            <div className="mb-4">
                              <label className="form-label">
                                Address <span className="text-danger">*</span>
                              </label>
                              <Autocomplete
                                apiKey={
                                  "AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"
                                }
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
                          <Col lg={12}>
                            <div className="text-end mt-4 mb-md-0 mb-2">
                              <Link
                                href="#"
                                className="bg-orange text-decoration-none text-white px-5 text-capitalize rounded py-3"
                                onClick={handleSubmit}
                              >
                                submit
                              </Link>
                            </div>
                          </Col>
                        </Row>
                      </form>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>

      {showVerify && (
        <Modal show={showVerify} centered onHide={() => setShowVerify(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Verify OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!otpVerifyModal && (
              <>
                <form>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value={1}
                        checked={selectedOption == 1}
                        onChange={() => setSelectedOption(1)}
                      />
                      WhatsApp
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value={2}
                        checked={selectedOption == 2}
                        onChange={() => setSelectedOption(2)}
                      />
                      SMS
                    </label>
                  </div>
                </form>

                <Modal.Footer>
                  <button className="btn btn-theme mt-3" onClick={handleClose}>
                    Close
                  </button>
                  <button
                    className="btn btn-theme mt-3"
                    onClick={(e) => {
                      e.preventDefault();

                      let body = {
                        type: selectedOption,
                      };
                      mutationVerify.mutate({
                        body,
                      });
                    }}
                    disabled={!selectedOption}
                  >
                    Submit
                  </button>
                </Modal.Footer>
              </>
            )}

            {!!otpVerifyModal && (
              <>
                <h6>
                  Account not verify, OTP send on your register mobile. Kindly,
                  verify your account.
                </h6>
                <Form>
                  <Row className="align-items-center">
                    <Col lg={12}>
                      <Form.Group className="">
                        <OTPInput
                          value={formik?.values?.otp}
                          onChange={(e) => formik.setFieldValue("otp", e)}
                          numInputs={4}
                          renderSeparator={<span>-</span>}
                          inputType="number"
                          renderInput={(props) => <input {...props} />}
                          containerStyle={"otp-input"}
                        />
                        <p className="text-danger mt-3 text-center mb-0">
                          {formik?.errors.otp}
                        </p>
                      </Form.Group>
                    </Col>
                    <div className="d-flex align-items-center justify-content-center flex-column gap-3">
                      {newIsActive ? (
                        <span>Resend OTP in {newTimer} seconds</span>
                      ) : (
                        <span
                          onClick={handleClick}
                          className="fs-5 mt-4 mb-3"
                          style={{ cursor: "pointer" }}
                        >
                          Resend OTP
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={formik.handleSubmit}
                        className="btn btn-theme w-100"
                      >
                        Verify
                      </button>
                    </div>
                  </Row>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
export default EditProfile;
