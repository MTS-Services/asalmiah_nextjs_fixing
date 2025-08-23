"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { parsePhoneNumber } from "libphonenumber-js/min";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import Autocomplete from "react-google-autocomplete";
import useDetails from "../../../../../../hooks/useDetails";
import useSlider from "../../../../../../hooks/useSlider";
import USER from "../../../../../../public/assets/img/default.png";
import { userDetails } from "../../../../../../redux/features/userSlice";
import { updateMyProfile } from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import styles from "./page.module.scss";
import { countries, getLinkHref, validEmailPattern } from "../../../../../../utils/helper";
const EditPofile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toggleVal = useSlider();
  const [profileFile, setProfileFile] = useState();
  const [isSelectedFile, setIsSelectedFile] = useState(false);
  const allData = useDetails();
  const {
    touched,
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      fullName: "",
      email: "",

      mobile: "",
      countryCode: "",
      address: "",
      longitude: "",
      latitude: "",
    },
    validationSchema: yup.object().shape({
      fullName: yup
        .string()
        .required()
        .label("Full name")
        .min(2, "Full name should be more than 2 characters")
        .trim(),

      email: yup
        .string()
        .required()
        .label("Email Address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),

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
    onSubmit: (values) => {
      let formData = new FormData();
      let number = parsePhoneNumber(String(values?.mobile));
      formData.append("fullName", values?.fullName);
      formData.append("email", values?.email);
      formData.append("mobile", number?.nationalNumber);
      formData.append("countryCode", "+" + number?.countryCallingCode);
      formData.append("address", values?.address);
      formData.append("longitude", values?.longitude);
      formData.append("latitude", values?.latitude);

      if (isSelectedFile) {
        formData.append("profileImg", profileFile);
      }
      mutation.mutate(formData);
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: (resp) => {
      toastAlert("success", "Profile Updated Successfully");
      setIsSelectedFile(false);
      dispatch(userDetails(resp?.data?.data));
      router.push(getLinkHref(allData?.roleId, `/page/profile`));
    },
  });

  useEffect(() => {
    setValues({
      fullName: allData?.fullName,
      email: allData?.email,
      mobile: allData?.countryCode + allData?.mobile,
      address: allData?.address,
      longitude: allData?.location?.coordinates[0],
      latitude: allData?.location?.coordinates[1],
    });
    setProfileFile(allData?.profileImg);
  }, [allData]);
  const handlePlaces = (place) => {
    setFieldValue("address", place?.formatted_address);
    setFieldValue("latitude", place?.geometry?.location?.lat());
    setFieldValue("longitude", place?.geometry?.location?.lng());
  };

  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
        <Row>
          <Col md={12}>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Profile</h5>
                <Link
                  href={getLinkHref(allData?.roleId, `/page/profile`)}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Form>
                  <div className="form-group mb-3">
                    <Row>
                      <Col lg={8} className="mx-auto">
                        <Row>
                          <Col md={12}>
                            <Row className="justify-content-center">
                              <Col lg={3} md={4} sm={6}>
                                <div className={`${styles.upload_img} my-3`}>
                                  <div className={`${styles.product_image}`}>
                                    {isSelectedFile ? (
                                      <Image
                                        src={
                                          isSelectedFile && profileFile
                                            ? URL.createObjectURL(profileFile)
                                            : USER
                                        }
                                        alt="user"
                                        height={200}
                                        width={200}
                                      />
                                    ) : (
                                      <Image
                                        src={profileFile ? profileFile : USER}
                                        alt="user"
                                        height={200}
                                        width={200}
                                      />
                                    )}
                                  </div>
                                  <label htmlFor="upload">
                                    <FaCamera />
                                  </label>
                                  <input
                                    type="file"
                                    placeholder="Select Product Image"
                                    onChange={(e) => {
                                      setProfileFile(e.target.files[0]);
                                      setIsSelectedFile(true);
                                    }}
                                    accept=".jpg,.jpeg,.png,.gif"
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          <Col md={6} className="mb-4">
                            <div className="mt-3">
                              <label htmlFor="fullName">
                                Full Name
                                <span className="text-danger">*</span>{" "}
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                name="fullName"
                                value={values?.fullName}
                                onChange={(e) => {
                                  setFieldValue("fullName", e.target.value);
                                }}
                              />
                            </div>
                            <div className="error">
                              {touched.fullName && errors.fullName}
                            </div>
                          </Col>
                          <Col md={6} className="mb-4">
                            <div className="mt-3">
                              <label htmlFor="email">
                                E-mail
                                <span className="text-danger">*</span>{" "}
                              </label>

                              <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                name="email"
                                onChange={handleChange}
                                value={values?.email}
                              />
                            </div>
                            <div className="error">
                              {touched.email && errors.email}
                            </div>
                          </Col>
                          <Col md={6} className="mb-4">
                            <div className="mt-3">
                              <label htmlFor="phoneNumber">
                                Phone Number
                                <span className="text-danger">*</span>{" "}
                              </label>

                              <PhoneInput
                                defaultCountry="kw"
                                placeholder="Phone Number"
                                name="mobile"
                                value={values?.mobile}
                                onChange={(value) => {
                                  setFieldValue("mobile", value);
                                }}
                                countries={countries}
                              />
                            </div>
                            <div className="error">
                              {touched.mobile && errors.mobile}
                            </div>
                          </Col>

                          <Col md={6} className="mb-4">
                            <div className="mt-3">
                              <label htmlFor="dob">
                                Address
                                <span className="text-danger">*</span>{" "}
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
                            </div>
                            <div className="error">
                              {touched.address && errors.address}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  {/* <div className="form-group mb-3 clearfix btn_theme ms-auto"> */}
                  <button
                    className="btn_theme float-end"
                    onClick={handleSubmit}
                    type="button"
                  >
                    Submit
                  </button>
                  {/* </div> */}
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditPofile;
