"use client";
import { Col, Container, Row } from "react-bootstrap";
import "../dashboard/page.scss";
import Breadcrums from "../../components/Breadcrums";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Footer from "../../../../utils/Footer";
import UserSidebar from "@/app/components/UserSidebar";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { userChangePassword } from "../../../../services/APIServices";
import { toastAlert } from "../../../../utils/SweetAlert";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../../../redux/features/userSlice";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trans } from "../../../../utils/trans";
const ChangePassword = () => {
  let navigate = useRouter();
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const dispatch = useDispatch();
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object().shape({
      // oldPassword: yup.string().required().label("Old Password"),
      newPassword: yup
        .string()
        .required()
        .label("Password")
        .trim()
        .min(6, "Password must be at least 6 characters long"),
      confirmPassword: yup
        .string()
        .required()
        .label("Confirm Password")
        .oneOf(
          [yup.ref("newPassword"), null],
          "Password and confirm password must match"
        ),
    }),

    onSubmit: (values) => {
      let body = {
        password: values?.newPassword,
        oldPassword: values?.oldPassword,
      };
      changePasswordMutation.mutate(body);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (body) => userChangePassword(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      localStorage.clear();
      Cookies.remove("userDetail");
      dispatch(logoutUser(null));
      navigate.push("/");
    },
  });
   
  
  let language = localStorage.getItem("language");
  const Home = trans('home');
  return (
    <>
      <div>
        <UserLogInHeader />
        <div>
          <Breadcrums firstLink={Home} secondLink={"Change Password"} 
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
                      <h4>change password</h4>
                    </div>
                    <div className="card-detail">
                      <form>
                        <Row>
                         
                          <Col lg={6}>
                            <div className="mb-4 position-relative">
                              <label className="form-label">
                                new passsword
                              </label>
                              <input
                                className="form-control"
                                type={showPassNew ? "text" : "password"}
                                placeholder="Enter a new password"
                                name="newPassword"
                                value={values?.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onCopy={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                              />
                              {showPassNew ? (
                                <span
                                  className="eye-icon"
                                  onClick={() => {
                                    setShowPassNew(false);
                                  }}
                                >
                                  <FaEye />
                                </span>
                              ) : (
                                <span
                                  className="eye-icon"
                                  onClick={() => {
                                    setShowPassNew(true);
                                  }}
                                >
                                  <FaEyeSlash />
                                </span>
                              )}
                              {touched?.newPassword && errors?.newPassword ? (
                                <span className="error">
                                  {touched?.newPassword && errors?.newPassword}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4 position-relative">
                              <label className="form-label">
                                confirm password
                              </label>
                              <input
                                type={showPassConfirm ? "text" : "password"}
                                placeholder="Enter a confirm password"
                                name="confirmPassword"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.confirmPassword}
                                className="form-control"
                                onCopy={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                              />
                              {showPassConfirm ? (
                                <span
                                  className="eye-icon"
                                  onClick={() => {
                                    setShowPassConfirm(false);
                                  }}
                                >
                                  <FaEye />
                                </span>
                              ) : (
                                <span
                                  className="eye-icon"
                                  onClick={() => {
                                    setShowPassConfirm(true);
                                  }}
                                >
                                  <FaEyeSlash />
                                </span>
                              )}
                              {touched?.confirmPassword &&
                              errors?.confirmPassword ? (
                                <span className="error">
                                  {touched?.confirmPassword &&
                                    errors?.confirmPassword}
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
    </>
  );
};
export default ChangePassword;
