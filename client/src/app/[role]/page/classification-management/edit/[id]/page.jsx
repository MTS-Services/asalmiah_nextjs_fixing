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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";

import {
  EDIT_CLASSIFICATION_API,
  GET_CLASSIFICATION_DETAIL_API,
  GET_CATEGORY_LIST_HOME
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { getLinkHref, restrictAlpha } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  const router = useRouter();

  const isSlider = useSlider();
  const detail = useDetails();
  const queryClient = useQueryClient();

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const resp = await GET_CATEGORY_LIST_HOME();
      return resp?.data?.data || [];
    },
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_CLASSIFICATION_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, "/page/classification-management"));
      queryClient.invalidateQueries({
        queryKey: ["classification-management"],
      });
    },
  });

  const { id } = useParams();

  useQuery({
    queryKey: ["classification-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null;
      }
      const resp = await GET_CLASSIFICATION_DETAIL_API(id);
      setValues({
        ...values,
        name: resp?.data?.data?.name,
        arbicName: resp?.data?.data?.arbicName,
        categoryId: resp?.data?.data?.categoryId?._id || resp?.data?.data?.categoryId || "",
        order: resp?.data?.data?.order,
      });
      return resp?.data?.data;
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
      name: "",
      arbicName: "",
      categoryId: "",
      order: "",
    },

    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required()
        .label("Classification Name")
        .trim()
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
          "Please enter a valid Classification Name , it must contain at least one letter"
        ),
      arbicName: yup
        .string()
        .required()
        .label("Classification Name (in arabic)")
        .trim(),
      categoryId: yup
        .string()
        .required()
        .label("Category"),
    }),

    onSubmit: async (values) => {
      const body = {
        name: values?.name,
        arbicName: values?.arbicName,
        categoryId: values?.categoryId,
        order: values?.order,
      };
      mutate(body);
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
                href={getLinkHref(detail?.roleId, "/page/classification-management")}
                className="text-capitalize text-black"
              >
                Classification management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">edit Classification</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Classification</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/classification-management")}
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
                          Classification Name
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="name"
                          placeholder="Enter Classification Name"
                          onChange={handleChange}
                          value={values?.name}
                        />
                        {touched?.name && errors?.name ? (
                          <span className="error">
                            {touched?.name && errors?.name}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Classification Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arbicName"
                          placeholder="Enter Classification Name (in arabic)"
                          onChange={handleChange}
                          value={values?.arbicName}
                        />
                        {touched?.arbicName && errors?.arbicName ? (
                          <span className="error">
                            {touched?.arbicName && errors?.arbicName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Category
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          className="form-control"
                          name="categoryId"
                          onChange={handleChange}
                          value={values?.categoryId}
                        >
                          <option value="">Select Category</option>
                          {categories?.map((category) => (
                            <option key={category?._id} value={category?._id}>
                              {category?.category}
                            </option>
                          ))}
                        </Form.Select>
                        {touched?.categoryId && errors?.categoryId ? (
                          <span className="error">
                            {touched?.categoryId && errors?.categoryId}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-4 position-relative">
                        <Form.Label>Priority Order</Form.Label>
                        <Form.Control
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

export default Edit;
