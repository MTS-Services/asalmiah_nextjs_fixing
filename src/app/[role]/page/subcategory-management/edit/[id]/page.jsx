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
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  EDIT_SUBCATEGORY_API,
  GET_SEARCH_CATEGORY_API,
  GET_SUBCATEGORY_DETAIL,
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { getLinkHref, restrictAlpha } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
const Edit = () => {
  // useDocumentTitle("Add Category");
  const router = useRouter();
  const isSlider = useSlider();
  const queryClient = useQueryClient();

  let detail = useDetails();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_SUBCATEGORY_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/subcategory-management`));
      queryClient.invalidateQueries({ queryKey: ["subcategory-list"] });
    },
  });

  const { id } = useParams();

  useQuery({
    queryKey: ["subcategory-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_SUBCATEGORY_DETAIL(id);
      setValues({
        ...values,
        subcategory: resp?.data?.data?.subcategory,
        subcategory_Img: resp?.data?.data?.subCategoryImg,
        order: resp?.data?.data?.order,
        categoryId: {
          label: resp?.data?.data?.categoryId?.category,
          value: resp?.data?.data?.categoryId?._id,
        },
        // ARABIC
        arabicSubcategory: resp?.data?.data?.arabicSubcategory,
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
      categoryId: "",
      subcategory: "",
      subcategory_Img: "",
      newPicked: "",
      // ARABIC
      arabicSubcategory: "",
      order: "",
    },

    validationSchema: yup.object().shape({
      subcategory: yup
        .string()
        .required()
        .label("Subcategory name")
        .trim()
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
          "Please enter a valid Subcategory Name , it must contain at least one letter"
        ),

      categoryId: yup.object().shape({
        value: yup.string().required().label("Category Id"),
        label: yup.string().required(),
      }),
      newPicked: yup
        .mixed()
        .when("subcategory_Img", {
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
      arabicSubcategory: yup
        .string()
        .required("Subcategory Name (In Arabic) is required")
        .label("Subcategory Name (In Arabic)")
        .trim(),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();
      payload.append("subcategory", values?.subcategory);
      payload.append("categoryId", values?.categoryId?.value);

      payload.append("order", values?.order ?? "");

      if (values?.newPicked) {
        payload.append("subCategoryImg", values?.newPicked);
      }
      // ARABIC
      payload.append("arabicSubcategory", values?.arabicSubcategory);
      mutate(payload);
    },
  });
  const searchCategoryList = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_CATEGORY_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.category,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };
  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
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
                href="/admin/page/subcategory-management"
                className="text-capitalize text-black"
              >
                SubCategory management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">edit SubCategory</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit SubCategory</h5>
                <Link
                  href={`/admin/page/subcategory-management`}
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
                        <Form.Label>Subcategory Name</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="subcategory"
                          placeholder="Enter subcategory name"
                          onChange={handleChange}
                          value={values?.subcategory}
                        />
                        {touched?.subcategory && errors?.subcategory ? (
                          <span className="error">
                            {touched?.subcategory && errors?.subcategory}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Subcategory Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicSubcategory"
                          placeholder="Enter subcategory name (in arabic)"
                          onChange={handleChange}
                          value={values?.arabicSubcategory}
                        />
                        {touched?.arabicSubcategory &&
                          errors?.arabicSubcategory ? (
                          <span className="error">
                            {touched?.arabicSubcategory &&
                              errors?.arabicSubcategory}
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

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          SubCategory Image
                          <span className="text-danger">*</span>
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
                              src={URL.createObjectURL(values?.newPicked) ?? ""}
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        {!values?.newPicked && values?.subcategory_Img ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={`${values?.subcategory_Img}`}
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
                        <Form.Label className="">
                          Select Category
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          name="categoryId"
                          value={values?.categoryId}
                          loadOptions={searchCategoryList}
                          onChange={(e) => {
                            setFieldValue("categoryId", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Select Category"
                        />
                        {touched.categoryId && errors.categoryId ? (
                          <span className="error">
                            {errors.categoryId?.value}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Button className="btn_theme ms-auto" type="submit">
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
