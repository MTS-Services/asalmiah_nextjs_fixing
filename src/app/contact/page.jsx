"use client";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import "react-international-phone/style.css";
import * as yup from "yup";
import useDetails from "../../../hooks/useDetails";
import { ADD_CONTACT_US } from "../../../services/APIServices";
import { constant } from "../../../utils/constants";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import {
  restrictNum1,
  stringRegx,
  validEmailPattern,
} from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import Breadcrums from "../components/Breadcrums";
const Contact = () => {
  let detail = useDetails();
  const {
    touched,
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
   
      subject: "",
      message: "",
    },
    validationSchema: yup.object().shape({
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
        .label("Email Address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),
    
      subject: yup.string().required().label("Subject").trim(),
      message: yup.string().required().label("Message").trim(),
    }),
    onSubmit: (values) => {
 
      let body = {
        firstName: values?.firstName,
        lastName: values?.lastName,

        email: values?.email,
        message: values?.message,
        description: values?.message,
      
      };
      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    mutationFn: (body) => ADD_CONTACT_US(body),
    onSuccess: (res) => {
      toastAlert("success", res?.data?.message);
      resetForm();
    },
  });
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}{" "}
      <Breadcrums firstLink={"Home"} secondLink={"Contact Us"} />
      <section className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
              <div className="contact-box">
                <h4>
                  <b>Contact Us</b>
                </h4>
                <p>
                  If you&apos;ve got fantastic products or want to collaborate,
                  reach out to us.{" "}
                </p>
                <br />
                <div className="contact-form card card-body">
                  <div className="row gy-4">
                    <div className="col-sm-6">
                      <label className="form-label" for="inputEmail4">
                        First Name{" "}
                      </label>
                      <input
                        className="form-control"
                        id="inputEmail4"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={values?.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                        onKeyPress={restrictNum1}
                      />
                      {touched?.firstName && errors?.firstName ? (
                        <span className="error">
                          {touched.firstName && errors.firstName}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" for="inputEmail4">
                        Last Name{" "}
                      </label>
                      <input
                        className="form-control"
                        id="inputEmail4"
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={values?.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                        onKeyPress={restrictNum1}
                      />
                      {touched?.lastName && errors?.lastName ? (
                        <span className="error">
                          {touched.lastName && errors.lastName}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" for="inputEmail5">
                        Email Address
                      </label>
                      <input
                        className="form-control"
                        id="inputEmail5"
                        placeholder="Enter email address"
                        type="email"
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

                 

                    <div className="col-12">
                      <label className="form-label" for="inputEmail7">
                        Subject
                      </label>
                      <input
                        className="form-control"
                        id="inputEmail7"
                        type="text"
                        name="subject"
                        placeholder="Enter Subject"
                        value={values?.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched?.subject && errors?.subject ? (
                        <span className="error">
                          {touched.subject && errors.subject}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Enter Your Message"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="message"
                        value={values?.message}
                      ></textarea>
                      {touched?.message && errors?.message ? (
                        <span className="error">
                          {touched.message && errors.message}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-12">
                      <button
                        className="btn btn-theme rounded sm"
                        type="button"
                        onClick={handleSubmit}
                      >
                        {" "}
                        Send Message{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
