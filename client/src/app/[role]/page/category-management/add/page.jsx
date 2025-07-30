/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import Link from "next/link";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../hooks/useSlider";
import { ADD_CATEGORY_API } from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { getLinkHref, restrictAlpha, restrictNum1 } from "../../../../../../utils/helper";
import useDetails from "../../../../../../hooks/useDetails";

const Add = () => {
  const router = useRouter();

  const isSlider = useSlider();
  const detail = useDetails();
  const queryClient = useQueryClient();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_CATEGORY_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, "/page/category-management"));
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
    },
  });

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
      category: "",
      category_Img: "",
      newPicked: "",
      order: "",
      // ARABIC
      arabicCategory: "",
    },

    validationSchema: yup.object().shape({
      category: yup
        .string()
        .required()
        .label("Category name")
        .trim()
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
          "Please enter a valid category Name , it must contain at least one letter"
        ),

      newPicked: yup
        .mixed()
        .when("category_Img", {
          is: (value) => !value,
          then: () =>
            yup.string().required("Category image is a required field"),
        })

        .when(([newPicked], schema) => {
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
      // ARABIC
      arabicCategory: yup
        .string()
        .required("Category Name (In Arabic) is required")
        .label("Category Name (In Arabic)")
        .trim(),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();

      payload.append("category", values?.category);

      if (values?.order) {
        payload.append("order", values?.order);
      }

      if (values?.newPicked) {
        payload.append("categoryImg", values?.newPicked);
      }
      // ARABIC
      payload.append("arabicCategory", values?.arabicCategory);

      mutate(payload);
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
                href={getLinkHref(detail?.roleId, "/page/category-management")}
                className="text-capitalize text-black"
              >
                categories management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Category</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Category</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/category-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Category Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="category"
                          placeholder="Enter category name"
                          onChange={handleChange}
                          value={values?.category}
                          onKeyPress={restrictNum1}
                        />
                        {touched?.category && errors?.category ? (
                          <span className="error">
                            {touched?.category && errors?.category}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Category Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicCategory"
                          placeholder="Enter category name (in arabic)"
                          onChange={handleChange}
                          value={values?.arabicCategory}
                        />
                        {touched?.arabicCategory && errors?.arabicCategory ? (
                          <span className="error">
                            {touched?.arabicCategory && errors?.arabicCategory}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Category Image<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="newPicked"
                          onChange={(e) =>
                            setFieldValue("newPicked", e.target.files[0])
                          }
                          accept="image/*"
                        />

                        {values?.newPicked?.length !== 0 ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={
                                values?.newPicked
                                  ? URL.createObjectURL(values?.newPicked) ?? ""
                                  : setFieldValue("newPicked", "")
                              }
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        <span className="error">
                          {touched?.newPicked && errors?.newPicked}
                        </span>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Priority Order
                        </Form.Label>
                        <Form.Control
                          autoComplete="off"
                          type="text"
                          placeholder="Enter Priority Order"
                          name="order"
                          value={values?.order}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyPress={restrictAlpha}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Button
                      className="btn_theme mx-auto float-end"
                      type="submit"
                      disabled={isPending}
                    >
                      Submit
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
