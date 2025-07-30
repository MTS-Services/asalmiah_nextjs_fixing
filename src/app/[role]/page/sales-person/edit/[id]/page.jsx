"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { parsePhoneNumber } from "libphonenumber-js/min";
import Link from "next/link";
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
import useSlider from "../../../../../../../hooks/useSlider";
import {
  adminAddUser,
  adminUpdateUser,
  GET_BRANCH_BY_COMPANY,
  GET_COMPANY_API,
  getUserDetail,
} from "../../../../../../../services/APIServices";
import { constant } from "../../../../../../../utils/constants";
import { countries, getLinkHref, validEmailPattern } from "../../../../../../../utils/helper";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import useDetails from "../../../../../../../hooks/useDetails";

const EditCustomer = () => {
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
        company: {
          label: resp?.data?.data?.companyDetails?.company,
          value: resp?.data?.data?.companyDetails?._id,
        },
        branch: {
          label: resp?.data?.data?.branchDetails?.branchName,
          value: resp?.data?.data?.branchDetails?._id,
        },
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
      company: "",
      branch: "",
      roleId: constant?.SALES,
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
      payload.append("company", values?.company?.value ?? "");
      payload.append("branch", values?.branch?.value ?? "");
      payload.append("countryCode", "+" + number?.countryCallingCode);
      addUsers.mutate(payload);
    },
  });

  let detail = useDetails();
  const addUsers = useMutation({
    mutationFn: (body) => (id ? adminUpdateUser(id, body) : adminAddUser(body)),
    onSuccess: (res) => {
      toastAlert("success", res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      resetForm();
      router.push(getLinkHref(detail?.roleId, "/page/sales-person"));
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(page, search, constant?.ACTIVE);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };
  const searchBranch = async (search, loadedOptions, { page }) => {
    let resp = await GET_BRANCH_BY_COMPANY(values?.company?.value);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.branchName,
        value: i?._id,
      })),
      // hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, `/page`)} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>
          <li>
            {" "}
            <Link href={getLinkHref(detail?.roleId, `/page/sales-person`)}
              className="text-black text-capitalize"
            >
              sales person
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">edit sales person</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h5 className="mb-md-0">Edit Sales Person Detail</h5>
              <Link
          href={getLinkHref(detail?.roleId, `/page/sales-person`)}
                className="btn_theme"
              >
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
                            <div className="text-danger">
                              {touched?.newPicked && errors?.newPicked}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Row className="mt-4">
                      <Col lg={8} className="mx-auto">
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <label>
                                First Name{" "}
                                <span className="text-danger">*</span>
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
                              <p className="text-danger">
                                {touched.firstName && errors.firstName}
                              </p>
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
                              <p className="text-danger">
                                {touched.lastName && errors.lastName}
                              </p>
                            </Form.Group>
                          </Col>
                          <Col lg={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="">
                                Company
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <AsyncPaginate
                                value={values?.company}
                                loadOptions={searchCompany}
                                onChange={(e) => {
                                  setFieldValue("branch", []);
                                  setFieldValue("company", e);
                                }}
                                additional={{
                                  page: 1,
                                }}
                                placeholder="Enter"
                              />
                              {touched.company && errors.company ? (
                                <span className="error">
                                  {errors.company?.value}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </Col>
                          <Col lg={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="">
                                Company Branch
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <AsyncPaginate
                                key={values?.company?.value}
                                value={values?.branch}
                                loadOptions={searchBranch}
                                onChange={(e) => {
                                  setFieldValue("branch", e);
                                }}
                                additional={{
                                  page: 1,
                                }}
                                placeholder="Enter"
                              // key={Math.random()}
                              />
                              {touched.branch && errors.branch ? (
                                <span className="error">
                                  {errors.branch?.value}
                                </span>
                              ) : (
                                ""
                              )}
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
                              />
                              <p className="text-danger">
                                {touched.email && errors.email}
                              </p>
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
                                countries={countries}
                              />
                              <p className="text-danger">
                                {touched.mobile && errors.mobile}
                              </p>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>
                  <div className="text-end">
                    <Button
                      className="btn_theme ms-auto"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;
