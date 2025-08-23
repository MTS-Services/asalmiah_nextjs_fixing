/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  EDIT_BANNER_API,
  GET_BANNER_DETAIL,
  GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT,
  getAdminProductLists
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { getLinkHref, restrictAlpha } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  const router = useRouter();
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const { id } = useParams();
  let detail = useDetails()
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_BANNER_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, "/page/banner-management"));

      queryClient.invalidateQueries({ queryKey: ["getbanner-list"] });
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT(page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search);
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
  const searchProduct = async (search, loadedOptions, { page }) => {
    let resp = await getAdminProductLists(
      page,
      search,
      constant?.ACTIVE,
      values?.company?.value
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.productName,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  useQuery({
    queryKey: ["banner-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_BANNER_DETAIL(id);
      setValues({
        ...values,
        title: resp?.data?.data?.title,
        bannerImg: resp?.data?.data?.bannerImg,
        description: resp?.data?.data?.description,
        order: resp?.data?.data?.order,
        company: resp?.data?.data?.companyDetails?.company
          ? {
            label: resp.data.data.companyDetails.company,
            value: resp.data.data.companyDetails._id ?? "",
          }
          : null,
        productId:
          resp?.data?.data?.productId?.map((product) => ({
            label: product?.productName,
            value: product?._id,
          })) || [],
      });

      return resp?.data?.data ?? "";
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
      bannerImg: "",
      newPickedCover_Img: "",
      title: "",
      description: "",
      company: "",
      productId: "",
      order: "",
    },

    validationSchema: yup.object().shape({
      title: yup
        .string()
        .required()
        .label("Title")
        .trim()
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
          "Please enter a valid title , it must contain at least one letter"
        ),

      description: yup.string().required().label("Description").trim(),

      newPickedCover_Img: yup
        .mixed()
        .when("bannerImg", {
          is: (value) => !value && !values?.newPickedCover_Img,
          then: () => yup.string().required("Banner image is a required field"),
        })
        .when(([newPickedCover_Img], schema) => {
          if (newPickedCover_Img) {
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
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("title", values?.title);
      formData.append("description", values?.description);
      if (values?.company) {
        formData.append("company", values?.company.value);
      }
      formData.append("order", values?.order);
      if (values?.productId) {
        values?.productId?.forEach((product) => {
          formData.append("productId", product?.value);
        });
      }
      if (values?.newPickedCover_Img) {
        formData.append("bannerImg", values?.newPickedCover_Img);
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
                href={getLinkHref(detail?.roleId, "/page/banner-management")}
                className="text-black text-capitalize"
              >
                banner management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">edit banner</li>
          </ul>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Banner</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/banner-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Title <span className="text-danger">*</span>
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

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">Select Company</Form.Label>
                        <AsyncPaginate
                          value={values?.company}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("company", e);
                            setFieldValue("productId", "");
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Select Company"
                        />
                        {/* {touched.company && errors.company ? (
                          <span className="error">{errors.company}</span>
                        ) : (
                          ""
                        )} */}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">Select Product</Form.Label>
                        <AsyncPaginate
                          key={values?.company?.value}
                          value={values?.productId}
                          loadOptions={searchProduct}
                          onChange={(e) => {
                            setFieldValue("productId", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Select the Product"
                          isMulti
                          isDisabled={!values?.company?.value}
                        />
                        {/* {touched?.productId && errors?.productId ? (
                          <span className="error">{errors?.productId}</span>
                        ) : null} */}
                      </Form.Group>
                    </Col>

                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4 ">
                        <Form.Label>
                          Description <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          as="textarea"
                          type="textarea"
                          name="description"
                          placeholder="Enter Description"
                          onChange={handleChange}
                          value={values?.description}
                          style={{ resize: "both" }} //
                        />
                        {touched?.description && errors?.description ? (
                          <span className="error">
                            {touched?.description && errors?.description}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label >
                          Priority Order
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Order"
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
                          Banner <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="newPickedCover_Img"
                          onChange={(e) =>
                            setFieldValue(
                              "newPickedCover_Img",
                              e.target.files[0]
                            )
                          }
                          accept="image/*"
                        />

                        {values?.newPickedCover_Img &&
                          values?.newPickedCover_Img instanceof File ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={
                                values?.newPickedCover_Img
                                  ? URL.createObjectURL(
                                    values?.newPickedCover_Img
                                  )
                                  : setFieldValue("newPickedCover_Img", "")
                              }
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : values?.bannerImg ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={`${values?.bannerImg}`}
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        {touched?.newPickedCover_Img &&
                          errors?.newPickedCover_Img ? (
                          <span className="error">
                            {touched?.newPickedCover_Img &&
                              errors?.newPickedCover_Img}
                          </span>
                        ) : (
                          ""
                        )}
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
