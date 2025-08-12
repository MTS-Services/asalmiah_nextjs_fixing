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
import { AsyncPaginate } from "react-select-async-paginate";
import useSlider from "../../../../../../../hooks/useSlider";

import {
  EDIT_CLASSIFICATION_API,
  GET_CLASSIFICATION_DETAIL_API,
  GET_SEARCH_CLASS_API
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { getLinkHref, restrictAlpha } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  const router = useRouter();

  const isSlider = useSlider();
  const detail = useDetails();
  const queryClient = useQueryClient();

  // Load class options for AsyncPaginate
  const loadClassOptions = async (inputValue, loadedOptions, additional) => {
    try {
      const page = additional?.page || 1;
      const response = await GET_SEARCH_CLASS_API(
        page,
        Paginations.SEARCH_LIMIT,
        constant?.ACTIVE,
        inputValue
      );
      
      const options = response?.data?.data?.map((classItem) => ({
        value: classItem._id,
        label: classItem.name,
      })) || [];

      return {
        options,
        hasMore: response?.data?.data?.length === Paginations.SEARCH_LIMIT,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error("Error loading class options:", error);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

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
        classId: resp?.data?.data?.class?._id || resp?.data?.data?.classId || "",
        className: resp?.data?.data?.class?.name || "",
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
      classId: "",
      className: "",
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
      classId: yup
        .string()
        .required()
        .label("Class"),
    }),

    onSubmit: async (values) => {
      const body = {
        name: values?.name,
        arbicName: values?.arbicName,
        classId: values?.classId,
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
                          Class
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          debounceTimeout={300}
                          placeholder="Select Class"
                          value={
                            values?.classId
                              ? {
                                  value: values?.classId,
                                  label: values?.className || "Selected Class",
                                }
                              : null
                          }
                          loadOptions={loadClassOptions}
                          onChange={(option) => {
                            setFieldValue("classId", option?.value || "");
                            setFieldValue("className", option?.label || "");
                          }}
                          onBlur={() => setFieldTouched("classId", true)}
                          additional={{
                            page: 1,
                          }}
                        />
                        {touched?.classId && errors?.classId && (
                          <span className="error">
                            {errors?.classId}
                          </span>
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
