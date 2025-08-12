/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import "ckeditor5/ckeditor5.css";
import Link from "next/link";
import * as yup from "yup";
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FaTimes } from "react-icons/fa";
import { IoCloudUploadSharp } from "react-icons/io5";
import { AsyncPaginate } from "react-select-async-paginate";
import useSlider from "../../../../../../hooks/useSlider";
import {
  ADD_MANUAL_NOTIFICATIONS,
  USER_COMPANYLIST,
  USERS_LIST_DROPDOWN,
} from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { getLinkHref } from "../../../../../../utils/helper";
import useDetails from "../../../../../../hooks/useDetails";

const Add = () => {
  // useDocumentTitle("Add Category");
  const router = useRouter();

  const isSlider = useSlider();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const detail = useDetails();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_MANUAL_NOTIFICATIONS(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/manual-notifications`));
      queryClient.invalidateQueries({
        queryKey: ["manual-notification"],
      });
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await USER_COMPANYLIST(search);
    let array = await resp?.data?.data;
    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
      })),
      // hasMore: resp?.data?.data?.length > 0 ? true : false,
      // additional: {
      //   page: page + 1,
      // },
    };
  };

  const searchUsers = async (search, loadedOptions, { page }) => {
    let resp = await USERS_LIST_DROPDOWN(search);
    let array = await resp?.data?.data;
    return {
      options: array?.map((i) => ({
        label: i?.fullName,
        value: i?._id,
      })),
      // hasMore: resp?.data?.data?.length > 0 ? true : false,
      // additional: {
      //   page: page + 1,
      // },
    };
  };

  const formatArabicText = (text) => {
    // Replace sentence-ending punctuation with a newline and the same punctuation
    const formattedText = text.replace(/([.؟!])\s*/g, "$1\n");
    return formattedText.trim(); // Trim to remove any leading/trailing whitespace
  };
  const validateArabicDescription = (value) => {
    // Remove HTML tags
    const strippedValue = value.replace(/<[^>]*>/g, "").trim();

    // Check if the stripped value is empty
    if (strippedValue.length === 0) {
      return { isValid: false, message: "Input cannot be empty." };
    }

    // Validate if the stripped value contains only Arabic characters, spaces, and common punctuation
    const arabicRegex = /^[\u0600-\u06FF\s،؛؟.!،ـ]+$/; // Added '!' and '.' for demonstration
    const isValid = arabicRegex.test(strippedValue);

    return {
      isValid,
      message: isValid
        ? "Valid Arabic description."
        : "Invalid characters found.",
    };
  };
  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    resetForm,
    setValues,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      notificationType: "",
      title: "",
      arabicTitle: "",
      description: "",
      descriptionArabic: "",
      users: "",
      companyId: "",
      allUser: false,
      imagePreview: [],
    },

    validationSchema: yup.object().shape({
      notificationType: yup.string().required().label("Notification type"),
      title: yup.string().required().label("Title").trim(),
      arabicTitle: yup
        .string()
        .required()
        .label("Arabic title")
        .matches(
          /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF\s\d]*$/,
          "Enter a valid arabic title"
        )
        .trim(),
      description: yup
        .string()
        .trim()
        .required("Description is required")
        .label("Description"),
      descriptionArabic: yup
        .string()
        .required("Arabic Description is required")
        .trim()
        .test(
          "is-arabic",
          "Arabic Description must contain only Arabic characters",
          validateArabicDescription
        )
        .label("Arabic Description"),

      // users: yup.object().when("allUser", {
      //   is: (value) => value == false,
      //   then: () =>
      //     yup
      //       .array()
      //       .of(
      //         yup.object().shape({
      //           value: yup.string().required(),
      //           label: yup.string().required(),
      //         })
      //       )
      //       .required()
      //       .label("Users"),
      // }),
      // companyId: yup.object().shape({
      //   value: yup.string().required().label("Company"),
      //   label: yup.string().required(),
      // }),
      imagePreview: yup
        .mixed()

        .when(([file], schema) => {
          if (file?.length > 0) {
            return yup
              .array()
              .of(
                yup
                  .mixed()
                  .test("fileType", "Unsupported file format", (value) => {
                    if (value) {
                      return ["image/jpeg", "image/png"].includes(value.type);
                    }
                    return true;
                  })
                  .test(
                    "is-valid-size",
                    "Max allowed size is 10 MB",
                    (value) => value && value.size <= 10485760 // Update to 10 MB (10485760 bytes)
                  )
              )
              .max(5, "Only 5 product images are allowed");
          }
          return schema;
        }),
    }),

    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("title", values?.title);
      formData.append("arabicTitle", values?.arabicTitle);
      formData.append("description", values?.description);
      formData.append("arabicDescription", values?.descriptionArabic);

      if (values?.users) {
        values?.users.forEach((users) => {
          formData.append(`userId`, users.value);
        });
      }
      if (values?.companyId?.value) {
        formData.append("company", values?.companyId?.value);
      }
      formData.append("notificationType", values?.notificationType);

      formData.append(
        "type",
        values?.users?.length == 0 ? true : values?.allUser
      );

      if (values?.imagePreview.length) {
        values?.imagePreview.forEach((i) => formData.append("image", i));
      }
      mutate(formData);
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link

                href={getLinkHref(detail?.roleId, "/page/manual-notifications")}
                className="text-capitalize text-black"
              >
                Manual Notification
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Manual Notification</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Manual Notification</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/manual-notifications")}

                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Notification Type
                          <span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Select
                          aria-label="Select Notification Type"
                          onChange={handleChange}
                          name="notificationType"
                          value={values?.notificationType}
                        >
                          <option value="">Select Notification Type</option>
                          <option value="5">Admin Notification</option>
                          <option value="6">Company Notification</option>
                        </Form.Select>

                        {touched.notificationType && errors.notificationType ? (
                          <span className="error">
                            {errors.notificationType}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Title
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="title"
                          placeholder="Enter title"
                          onChange={handleChange}
                          value={values?.title}
                        />
                        {touched?.title && errors?.title ? (
                          <span className="error">
                            {touched?.title && errors?.title}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Arabic Title<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicTitle"
                          placeholder="Enter arabic title"
                          onChange={handleChange}
                          value={values?.arabicTitle}
                        />
                        {touched?.arabicTitle && errors?.arabicTitle ? (
                          <span className="error">
                            {touched?.arabicTitle && errors?.arabicTitle}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    {values?.allUser == false ? (
                      <Col md={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-bold">Users</Form.Label>
                          <AsyncPaginate
                            key={values?.users}
                            value={values?.users}
                            loadOptions={searchUsers}
                            onChange={(e) => {
                              setFieldValue("users", e);
                              setFieldValue("allUser", false);
                            }}
                            additional={{
                              page: 1,
                            }}
                            isClearable
                            placeholder="Select the users"
                            isMulti
                          />
                          {touched.users && errors.users ? (
                            <span className="error">{errors.users?.value}</span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Description<span className="text-danger">*</span>
                        </Form.Label>
                        {/* <MyEditor
                          value={values?.description}
                          onChange={(value) =>
                            setFieldValue("description", value)
                          }
                        /> */}

                        <textarea
                          className="form-control"
                          placeholder="Description"
                          name="description"
                          value={values?.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></textarea>

                        {touched?.description && errors?.description ? (
                          <span className="error">
                            {touched?.description && errors?.description}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Arabic Description
                          <span className="text-danger">*</span>
                        </Form.Label>
                        {/* <MyEditor
                          value={values?.descriptionArabic}
                          onChange={(value) =>
                            setFieldValue("descriptionArabic", value)
                          }
                        /> */}

                        <textarea
                          className="form-control"
                          placeholder="Description in arabic"
                          name="descriptionArabic"
                          value={values?.descriptionArabic}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        ></textarea>
                        {touched?.descriptionArabic &&
                          errors?.descriptionArabic ? (
                          <span className="error">
                            {touched?.descriptionArabic &&
                              errors?.descriptionArabic}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Company
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.companyId}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("companyId", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          placeholder="Enter company"
                        // key={Math.random()}
                        />
                        {/* {touched.companyId && errors.companyId ? (
                          <span className="error">
                            {errors.companyId?.value}
                          </span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>
                    {values?.users?.length == 0 ? (
                      <Col lg={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            All customer
                          </Form.Label>
                          <Form.Check
                            name="allUser"
                            value={values?.allUser}
                            onChange={(e) => {
                              setFieldValue("allUser", e.target.checked);
                              setFieldValue("users", "");
                            }}
                          />
                          {touched.allUser && errors.allUser ? (
                            <span className="error">{errors.allUser}</span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}

                    <Col lg={12} className="mx-auto">
                      <Row>
                        <Col className="mb-2" lg={2}>
                          <label className="image-picker">
                            <input
                              type="file"
                              name="imagePreview"
                              className="d-none"
                              onChange={(e) =>
                                setFieldValue("imagePreview", [
                                  ...values?.imagePreview,
                                  ...e.target.files,
                                ])
                              }
                              multiple
                              accept="image/*"
                            />
                            Upload Image
                            <div>
                              <IoCloudUploadSharp />
                            </div>
                          </label>
                        </Col>
                        {values?.imagePreview?.map((item, index) => {
                          return (
                            <Col className="picked-img mb-2" lg={2} key={index}>
                              <img
                                src={URL.createObjectURL(item)}
                                className="preview-img"
                              />
                              <div
                                className="icon-container"
                                onClick={() => {
                                  let img = values?.imagePreview;
                                  img.splice(index, 1);
                                  setFieldValue("imagePreview", img);
                                }}
                              >
                                <FaTimes style={{ color: "red" }} />
                              </div>
                              {errors?.imagePreview !==
                                "Only 5 productImg are allowed" ? (
                                <p className="text-danger">
                                  {touched?.imagePreview &&
                                    errors?.imagePreview?.at(index)}
                                </p>
                              ) : (
                                ""
                              )}
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                    {values?.imagePreview?.length == 0 ? (
                      <span className="error">
                        {touched?.imagePreview && errors?.imagePreview}
                      </span>
                    ) : (
                      ""
                    )}
                    {errors?.imagePreview == "Only 5 productImg are allowed" ? (
                      <span className="error">
                        {touched?.imagePreview && errors?.imagePreview}
                      </span>
                    ) : (
                      ""
                    )}
                  </Row>
                  <div className="text-end">
                    <Button
                      className="btn_theme mx-auto float-end"
                      type="submit"
                      disabled={isPending}
                    >
                      {isPending ? "Submitting" : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
