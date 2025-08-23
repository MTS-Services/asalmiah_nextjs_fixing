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
import { AsyncPaginate } from "react-select-async-paginate";
import useSlider from "../../../../../../../hooks/useSlider";

import {
  EDIT_OFFER_API,
  GET_OFFER_DETAIL,
  GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT,
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  // useDocumentTitle("Add Category");
  const router = useRouter();
  let detail = useDetails();
  const isSlider = useSlider();
  const navigate = useRouter();
  const queryClient = useQueryClient();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_OFFER_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/offer-management`));
      queryClient.invalidateQueries({ queryKey: ["offer-list"] });
    },
  });

  const { id } = useParams();

  useQuery({
    queryKey: ["offer-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_OFFER_DETAIL(id);
      setValues({
        ...values,
        offer: resp?.data?.data?.title,
        offer_Img: resp?.data?.data?.image,
        discount: resp?.data?.data?.discount,
        company: {
          label: resp?.data?.data?.companyDetails?.company,
          value: resp?.data?.data?.companyDetails?._id,
        },
        // ARABIC
        arabicTitle: resp?.data?.data?.arabicTitle,
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
      offer: "",
      offer_Img: "",
      newPicked: "",
      discount: "",
      company: "",
      // ARABIC
      arabicTitle: "",
    },

    validationSchema: yup.object().shape({
      offer: yup.string().required().label("Offer name").trim(),
      discount: yup.number().required().label("Discount").test(
        "range",
        "Discount must be between 0.1 and 100",
        (val) => parseFloat(val) >= 0.1 && parseFloat(val) <= 100,
      ),
      company: yup.object().shape({
        value: yup.string().required().label("Company"),
        label: yup.string().required(),
      }),
      newPicked: yup
        .mixed()
        .when("offer_Img", {
          is: (value) => !value,
          then: () => yup.string().required("Offer image is a required field"),
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
      // ABRBIC
      arabicTitle: yup
        .string()
        .required()
        .label("Offer name (In Arabic)")

        .trim(),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();

      payload.append("title", values?.offer);
      payload.append("discount", values?.discount);
      payload.append("company", values?.company?.value);

      if (values?.newPicked) {
        payload.append("image", values?.newPicked);
      }
      // ARABIC
      payload.append("arabicTitle", values?.arabicTitle);
      mutate(payload);
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
    );
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

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, "/page/offer-management")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, "/page/offer-management")}
                className="text-capitalize text-black"
              >
                Offer management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Edit Offer</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit offer</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/offer-management")}
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
                          Offer Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="offer"
                          placeholder="Enter offer name"
                          onChange={handleChange}
                          value={values?.offer}
                        />
                        {touched?.offer && errors?.offer ? (
                          <span className="error">
                            {touched?.offer && errors?.offer}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Offer Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicTitle"
                          placeholder="Enter offer name (in arabic)"
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
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Discount % <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="number"
                          name="discount"
                          placeholder="Enter discount"
                          onChange={handleChange}
                          value={values?.discount}
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

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Company<span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.company}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("company", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Select Company"
                          key={Math.random()}
                        />
                        {touched.company && errors.company ? (
                          <span className="error">{errors.company?.value}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Offer Image<span className="text-danger">*</span>
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

                        {!values?.newPicked && values?.offer_Img ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={`${values?.offer_Img}`}
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
