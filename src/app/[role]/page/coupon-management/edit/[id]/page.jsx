/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import "ckeditor5/ckeditor5.css";
import { useFormik } from "formik";
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
  ADMIN_GET_SEARCH_SUBCATEGORY_API,
  EDIT_PROMOTION_API,
  GET_COMPANY_API,
  GET_PROMOTION_DETAIL_API,
  GET_SEARCH_CATEGORY_API
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { formatCurrency, restrictAlpha } from "../../../../../../../utils/helper";
import useCountryState from "../../../../../../../hooks/useCountryState";
const Edit = () => {
  const { id } = useParams();
  const router = useRouter();
  const isSlider = useSlider();
  const navigate = useRouter();
  const selectedCountry = useCountryState();

  useQuery({
    queryKey: ["promotion-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_PROMOTION_DETAIL_API(id);
      setValues({
        ...values,
        country: resp?.data?.data?.country,
        promoCode: resp?.data?.data?.promoCode,
        discount: resp?.data?.data?.discount,
        type: resp?.data?.data?.type,
        categoryId: {
          value: resp?.data?.data?.categoryDetails?._id,
          label: resp?.data?.data?.categoryDetails?.category,
        },
        subcategoryId: {
          value: resp?.data?.data?.subCategoryDetails?._id,
          label: resp?.data?.data?.subCategoryDetails?.subcategory,
        },
        company: "",
        minPurchaseAmount: resp?.data?.data?.minPurchaseAmount,
        maxDiscountAmount: resp?.data?.data?.maxDiscountAmount,
        numberOfUsed: resp?.data?.data?.numberOfUsed,
        numberOfUsedUser: resp?.data?.data?.numberOfUsedUser,
        forFreeDelivery: resp?.data?.data?.forFreeDelivery ? 1 : 0,
      });
      return resp?.data?.data;
    },
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_PROMOTION_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, "/page/promotion-management"));

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
    setField,
  } = useFormik({
    initialValues: {
      country: "",
      promoCode: "",
      discount: "",
      type: "",
      categoryId: "",
      subcategoryId: "",
      company: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
      numberOfUsed: "",
      numberOfUsedUser: "",
      forFreeDelivery: 0,
    },

    validationSchema: yup.object().shape({
      country: yup.string().required().label("Country"),
      discount: yup.string().required("Discount is required"),
      type: yup.string().required("Type is required"),
      company: yup.string().when("type", {
        is: (value) => value == 4,
        then: () =>
          yup.mixed().required("Company is required").label("Company"),
      }),
      categoryId: yup.string().when("type", {
        is: (value) => value == 2,
        then: () => yup.mixed().required().label("Category"),
      }),

      subcategoryId: yup.string().when("type", {
        is: (value) => value == 2,
        then: () => yup.mixed().required().label("Sub Category"),
      }),
      minPurchaseAmount: yup
        .number()
        .required("Min purchase amount is required"),
      // .positive("Min purchase amount must be a positive number"),

      maxDiscountAmount: yup
        .number()
        .required("Max discount amount is required")
        .positive("Max discount amount must be a positive number"),

      numberOfUsed: yup
        .number()
        .required("Number of used is required")
        .integer("Number of used must be an integer"),

      numberOfUsedUser: yup
        .number()
        .required("Number of used is required")
        .integer("Number of used must be an integer"),
    }),
    onSubmit: async (values) => {
      const payload = {
        country: values?.country,
        promoCode: values?.promoCode,
        discount: values?.discount,
        type: values?.type,
        categoryId: values?.categoryId?.value ?? "",
        subcategoryId: values?.subcategoryId?.value ?? "",
        company: values?.company?.value,
        minPurchaseAmount: values?.minPurchaseAmount,
        maxDiscountAmount: values?.maxDiscountAmount,
        numberOfUsed: values?.numberOfUsed,
        forFreeDelivery: values?.forFreeDelivery,
        numberOfUsedUser: values?.numberOfUsedUser,
        forFreeDelivery: values?.forFreeDelivery,
      };

      mutate(payload);
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
  const searchSubCategoryList = async (search, loadedOptions, { page }) => {
    let resp = await ADMIN_GET_SEARCH_SUBCATEGORY_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search,
      values?.categoryId?.value
    );
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.subcategory,
        value: i?._id,
      })),
      // hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  const onChangePromotionType = () => {
    setFieldValue("company", "");
    setFieldValue("categoryId", "");
    setFieldValue("subcategoryId", "");
  };

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Coupon</h5>
                <Link

                  href={getLinkHref(detail?.roleId, "/page/coupon-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Country Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="country"
                          placeholder="Enter Country Name"
                          onChange={handleChange}
                          value={values?.country}
                        />
                        {touched?.country && errors?.country ? (
                          <span className="error">
                            {touched?.country && errors?.country}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Promotion Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="promoCode"
                          placeholder="Enter commisiion"
                          onChange={handleChange}
                          value={values?.promoCode}
                          onKeyPress={restrictAlpha}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div>
                        <Form.Label>Promotion Type</Form.Label>
                        <Form.Select
                          aria-label="Select Promotion Type"
                          value={values?.type}
                          onChange={(e) => {
                            handleChange(e);
                            onChangePromotionType();
                          }}
                          onBlur={handleBlur}
                          name="type"
                          className="form-control"
                          disabled
                        >
                          <option value="">Select Promotion Type</option>
                          <option value={1}>All</option>
                          <option value={2}>Category</option>
                          <option value={4}>Company</option>
                        </Form.Select>
                        {touched?.type && errors?.type ? (
                          <span className="error">
                            {touched?.type && errors?.type}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>

                    {values?.type == "2" && (
                      <>
                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="">
                              Select Category
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <AsyncPaginate
                              value={values?.categoryId}
                              loadOptions={searchCategoryList}
                              onChange={(e) => {
                                setFieldValue("categoryId", e);
                                setFieldValue("subcategoryId", null);
                              }}
                              additional={{
                                page: 1,
                              }}
                              placeholder="Enter"
                            />
                            {touched.categoryId && errors.categoryId ? (
                              <span className="error">{errors.categoryId}</span>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="">
                              Select Subcategory
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <AsyncPaginate
                              key={values?.categoryId?.value}
                              value={values?.subcategoryId}
                              loadOptions={searchSubCategoryList}
                              onChange={(e) => {
                                setFieldValue("subcategoryId", e);
                              }}
                              additional={{
                                page: 1,
                              }}
                              placeholder="Enter"
                            />
                            {touched.subcategoryId && errors.subcategoryId ? (
                              <span className="error">
                                {errors.subcategoryId}
                              </span>
                            ) : (
                              ""
                            )}
                          </Form.Group>
                        </Col>
                      </>
                    )}

                    {values?.type == "4" && (
                      <Col lg={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="">
                            Select Company
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <AsyncPaginate
                            value={values?.company}
                            loadOptions={searchCompany}
                            onChange={(e) => {
                              setFieldValue("company", e);
                              setFieldValue("categoryId", null);
                              setFieldValue("subcategoryId", null);
                            }}
                            additional={{
                              page: 1,
                            }}
                            isClearable
                            placeholder="Enter"
                          />
                          {touched.company && errors.company ? (
                            <span className="error">{errors.company}</span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Discount(%)<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="discount"
                          placeholder="Enter discount"
                          onChange={handleChange}
                          value={values?.discount}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.discount && errors?.discount ? (
                          <span className="error">
                            {touched?.discount && errors?.discount}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Min Purchase Amount ({formatCurrency("", selectedCountry)})
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="minPurchaseAmount"
                          placeholder="Enter Minimum Purchase Amount"
                          onChange={handleChange}
                          value={values?.minPurchaseAmount}
                        // onKeyPress={restrictAlpha}
                        />
                        {touched?.minPurchaseAmount &&
                          errors?.minPurchaseAmount ? (
                          <span className="error">
                            {touched?.minPurchaseAmount &&
                              errors?.minPurchaseAmount}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Max Purchase Amount{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="maxDiscountAmount"
                          placeholder="Enter commisiion"
                          onChange={handleChange}
                          value={values?.maxDiscountAmount}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.maxDiscountAmount &&
                          errors?.maxDiscountAmount ? (
                          <span className="error">
                            {touched?.maxDiscountAmount &&
                              errors?.maxDiscountAmount}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Number of used <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="numberOfUsed"
                          placeholder="Enter number_of_used"
                          onChange={handleChange}
                          value={values?.numberOfUsed}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.numberOfUsed && errors?.numberOfUsed ? (
                          <span className="error">
                            {touched?.numberOfUsed && errors?.numberOfUsed}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Number of used per user
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="numberOfUsedUser"
                          placeholder="Enter Number Peruser"
                          onChange={handleChange}
                          value={values?.numberOfUsedUser}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.number_of_peruser &&
                          errors?.number_of_peruser ? (
                          <span className="error">
                            {touched?.numberOfUsedUser &&
                              errors?.numberOfUsedUser}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="d-flex algn-items-center">
                        <Form.Group className="mb-4 w-100 active-radio ">
                          <Form.Label>
                            FreeDelivery <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="forFreeDelivery"
                            type="radio"
                            label="True"
                            id="true"
                            checked={values?.forFreeDelivery == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="forFreeDelivery"
                            type="radio"
                            label="False"
                            id="false"
                            checked={values?.forFreeDelivery == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
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
