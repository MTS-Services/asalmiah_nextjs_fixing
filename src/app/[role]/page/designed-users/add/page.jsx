"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { parsePhoneNumber } from "libphonenumber-js/min";
import Link from "next/link.js";
import { useParams, useRouter } from "next/navigation";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BiSolidCameraPlus } from "react-icons/bi";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import { AsyncPaginate } from "react-select-async-paginate";
import * as Yup from "yup";
import useSlider from "../../../../../../hooks/useSlider.js";
import {
  adminAddUser,
  adminUpdateUser,
  GET_BRANCH_BY_COMPANY,
  GET_COMPANY_API,
  getUserDetail,
} from "../../../../../../services/APIServices.js";
import { toastAlert } from "../../../../../../utils/SweetAlert.js";
import { constant } from "../../../../../../utils/constants.js";
import {
  countries,
  getLinkHref,
  validEmailPattern,
} from "../../../../../../utils/helper.js";
import "./page.scss";
import useDetails from "../../../../../../hooks/useDetails.js";
const AddUser = () => {
  const toggleVal = useSlider();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();

  useQuery({
    queryKey: ["user-view", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await getUserDetail(id);
      setValues({
        ...values,
        profileImg: resp?.data?.data?.profileImg,
        firstName: resp?.data?.data?.firstName,
        lastName: resp?.data?.data?.lastName,
        email: resp?.data?.data?.email,
        mobile: resp?.data?.data?.countryCode + resp?.data?.data?.mobile,
        roleId: resp?.data?.data?.roleId,
      });
      return resp?.data?.data ?? "";
    },
  });
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    resetForm,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      newPicked: "",
      profileImg: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      countryCode: "",
      roleId: constant?.DESIGNED_USER,
    },
    validationSchema: Yup.object().shape({
      newPicked: Yup.mixed().when(([newPicked], schema) => {
        if (newPicked) {
          return Yup.mixed().test(
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

      firstName: Yup.string()
        .required()
        .label("First Name")
        .trim()
        .matches(/^\S+$/, "First Name should not contain spaces")
        .min(2, "First name should be more than 2 characters"),
      lastName: Yup.string()
        .required()
        .label("Last Name")
        .trim()
        .matches(/^\S+$/, "Last Name should not contain spaces")
        .min(2, "Last name should be more than 2 characters"),
      email: Yup.string()
        .required()
        .label("Email Address")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),
      mobile: Yup.string()
        .min(7, "Phone Number is a required field")
        .test("phone-validate", "Invalid phone number", function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required("Phone Number field is required"),
      roleId: Yup.string().required().label("Role"),
    }),
    onSubmit: async function (values) {
      let number = parsePhoneNumber(String(values?.mobile));
      let payload = new FormData();
      if (values?.newPicked) {
        payload.append("profileImg", values?.newPicked);
      }
      payload.append("firstName", values?.firstName ?? "");
      payload.append("lastName", values?.lastName ?? "");
      payload.append("email", values?.email ?? "");
      payload.append("roleId", values?.roleId ?? "");
      payload.append("mobile", number?.nationalNumber);

      payload.append("countryCode", "+" + number?.countryCallingCode);
      addUsers.mutate(payload);
    },
  });

  const detail = useDetails()
  const addUsers = useMutation({
    mutationFn: (body) => (id ? adminUpdateUser(id, body) : adminAddUser(body)),
    onSuccess: (res) => {
      toastAlert("success", res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      resetForm();
      router.push(getLinkHref(detail?.roleId,"/page/designed-users"));
    },
  });



  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href="/admin/page" className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>
          <li>
            {" "}
            <Link
              href="/admin/page/designed-users"
              className="text-black text-capitalize"
            >
              Designed Users
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">add sales person</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h5 className="mb-0">Add Designed Users</h5>
              <Link href={`/admin/page/designed-users`} className="btn_theme">
                Back
              </Link>
            </div>
            <div className="card-body">
              <Form>
                <div className="mb-3 form-group" controlId="formBasicEmail">
                  <Row>
                    <Col md={12}>
                      <div className="welcome-text userdata mt-3 mb-4 d-block text-center">
                        <div className="user-img">
                          <img
                            src={
                              values?.newPicked
                                ? URL.createObjectURL(values?.newPicked)
                                : values?.profileImg
                                ? values?.profileImg
                                : "/assets/img/default.png"
                            }
                            alt="Image"
                          />
                          <div className="img-add">
                            <input
                              name="profile_file"
                              id="file"
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setFieldValue("newPicked", e.target.files[0])
                              }
                            />
                            <label for="file">
                              <BiSolidCameraPlus />
                            </label>
                            <span className="error">
                              {touched?.newPicked && errors?.newPicked}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={8} className="mx-auto">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <label>
                              First Name <span className="text-danger">*</span>
                            </label>
                            <Form.Control
                              type="text"
                              placeholder="First Name"
                              name="firstName"
                              value={values?.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="off"
                            />
                            <span className="error">
                              {touched.firstName && errors.firstName}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4">
                            <label>
                              Last Name <span className="text-danger">*</span>
                            </label>
                            <Form.Control
                              type="text"
                              placeholder="Last Name"
                              name="lastName"
                              value={values?.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="off"
                            />
                            <span className="error">
                              {touched.lastName && errors.lastName}
                            </span>
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <div className="auth-label-3">
                              <Form.Label>
                                Email <span className="text-danger">*</span>
                              </Form.Label>
                            </div>
                            <Form.Control
                              className="name-sec"
                              type="email"
                              placeholder="Email Address"
                              name="email"
                              value={values?.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              autoComplete="off"
                              disabled={id}
                            />
                            <span className="error">
                              {touched.email && errors.email}
                            </span>
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group className="mb-4">
                            <div className="auth-label-3">
                              <Form.Label>
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                            </div>
                            <PhoneInput
                              defaultCountry="kw"
                              placeholder="Phone Number"
                              value={values?.mobile}
                              onChange={(value) => {
                                setFieldValue("mobile", value);
                              }}
                              disabled={id}
                              countries={countries}
                            />
                            <span className="error">
                              {touched.mobile && errors.mobile}
                            </span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={8} className="mx-auto">
                      <div className="text-end">
                        <Button
                          className="btn_theme ms-auto"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
