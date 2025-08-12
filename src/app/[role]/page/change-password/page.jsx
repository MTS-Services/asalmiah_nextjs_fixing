"use client";

import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { ref } from "yup";
import useSlider from "../../../../../hooks/useSlider";
import { logoutUser } from "../../../../../redux/features/userSlice";
import { userChangePassword } from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { getLinkHref } from "../../../../../utils/helper";
import useDetails from "../../../../../hooks/useDetails";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toggleVal = useSlider();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  let detail = useDetails();
  const passwordData = {
    // currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
  /**
   * Password Validation
   * @param {String} str
   * @returns
   */
  const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
  };

  const validation = Yup.object({
    newPassword: Yup.string()
      .required()
      .label("Password")
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmNewPassword: Yup.string()
      .required("Please enter a confirm password")
      // use oneOf to match one of the values inside the array.
      // use "ref" to get the value of passwrod.
      .oneOf([ref("newPassword")], "Passwords does not match"),
  });

  const handleSubmit = (values) => {
    const body = {
      password: values?.newPassword,
      oldPassword: values?.currentPassword,
    };
    userChangePassword(body)
      .then((resp) => {
        if (resp?.data?.success === true) {
          toastAlert("success", resp?.data?.message);
          Cookies.remove("userDetail");
          router.push(getLinkHref(detail?.roleId, "/"));
          dispatch(logoutUser(null));
        }
      })
      .catch((err) => {
        toastAlert("error", err?.response?.data?.message);
      });
  };

  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <Row>
        <Col>
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-0">Change Password</h4>
            </div>
            <div className="card-body">
              <Formik
                initialValues={passwordData}
                validationSchema={validation}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, values, touched, errors }) => {
                  return (
                    <Form>
                      <Row className="justify-content-center">
                        <Col lg={8} md={10} sm={12}>
                          <div className="form-group mb-3">
                            <Row>
                              {/* <Col md={12}>
                                <div className="mt-3 position-relative">
                                  <label
                                    htmlFor="old-password"
                                    className="mb-2"
                                  >
                                    Current Password
                                    <span className="text-danger">*</span>{" "}
                                  </label>
                                  <div className="position-relative">
                                    <input
                                      type={
                                        showCurrentPassword
                                          ? "text"
                                          : "password"
                                      }
                                      id="old-password"
                                      className="form-control"
                                      placeholder="Enter current password"
                                      name="currentPassword"
                                      value={values?.currentPassword}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "currentPassword",
                                          e.target.value
                                        );
                                      }}
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "12px",
                                      }}
                                      className="eye-icon"
                                      onClick={() =>
                                        setShowCurrentPassword((prev) => !prev)
                                      }
                                    >
                                      {showCurrentPassword ? (
                                        <FaEye />
                                      ) : (
                                        <FaEyeSlash />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="error">
                                  {touched.currentPassword &&
                                    errors.currentPassword}
                                </div>
                              </Col> */}
                              <Col md={12}>
                                <div className="mt-3 position-relative">
                                  <label
                                    htmlFor="new-password"
                                    className="mb-2"
                                  >
                                    New Password
                                    <span className="text-danger">*</span>{" "}
                                  </label>
                                  <div className="position-relative">
                                    <input
                                      type={
                                        showNewPassword ? "text" : "password"
                                      }
                                      id="new-password"
                                      className="form-control"
                                      placeholder="Enter new password"
                                      name="newPassword"
                                      value={values?.newPassword}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "newPassword",
                                          e.target.value
                                        );
                                      }}
                                      onCopy={(e) => e.preventDefault()}
                                      onPaste={(e) => e.preventDefault()}
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "8px",
                                      }}
                                      className="eye-icon"
                                      onClick={() =>
                                        setShowNewPassword((prev) => !prev)
                                      }
                                    >
                                      {showNewPassword ? (
                                        <FaEye />
                                      ) : (
                                        <FaEyeSlash />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="error">
                                  {touched.newPassword && errors.newPassword}
                                </div>
                              </Col>
                              <Col md={12}>
                                <div className="mt-3 position-relative">
                                  <label
                                    htmlFor="con-new-password"
                                    className="mb-2"
                                  >
                                    Confirm Password
                                    <span className="text-danger">*</span>{" "}
                                  </label>
                                  <div className="position-relative">
                                    <input
                                      type={
                                        showConfirmNewPassword
                                          ? "text"
                                          : "password"
                                      }
                                      id="con-new-password"
                                      className="form-control"
                                      placeholder="Enter confirm password"
                                      name="confirmNewPassword"
                                      value={values?.confirmNewPassword}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "confirmNewPassword",
                                          e.target.value
                                        );
                                      }}
                                      onCopy={(e) => e.preventDefault()}
                                      onPaste={(e) => e.preventDefault()}
                                    />
                                    <div
                                      style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "8px",
                                      }}
                                      className="eye-icon"
                                      onClick={() =>
                                        setShowConfirmNewPassword(
                                          (prev) => !prev
                                        )
                                      }
                                    >
                                      {showConfirmNewPassword ? (
                                        <FaEye />
                                      ) : (
                                        <FaEyeSlash />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="error">
                                  {touched.confirmNewPassword &&
                                    errors.confirmNewPassword}
                                </div>
                              </Col>
                            </Row>
                          </div>

                          <button className="btn_theme float-end" type="submit">
                            Submit
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePassword;
