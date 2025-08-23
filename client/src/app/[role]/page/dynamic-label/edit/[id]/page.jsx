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
  EDIT_DYNAMICLABEL_API,
  GET_DYNAMICLABEL_DETAIL,
  GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { getLinkHref, restrictAlpha } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  const detail = useDetails();

  const router = useRouter();
  const isSlider = useSlider();
  const { id } = useParams();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_DYNAMICLABEL_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/dynamic-label`));
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
  useQuery({
    queryKey: ["dynamic-label-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_DYNAMICLABEL_DETAIL(id);
      setValues({
        ...values,
        title: resp?.data?.data?.title,
        arabicTitle: resp?.data?.data?.arabicTitle,
        order: resp?.data?.data?.order,
        company: resp.data.data.company
          ? resp.data.data.company?.map((data) => ({
            label: data.company ?? "",
            value: data._id ?? "",
          }))
          : null,
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
      title: "",
      arabicTitle: "",
      company: "",
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

      arabicTitle: yup.string().required().label("Arabic Title").trim(),

      company: yup
        .array()
        .min(1, "Please select at least one company") // Ensure at least one product is selected
        .of(
          yup.object().shape({
            value: yup.string().required(),
            label: yup.string().required(),
          })
        )
        .required()
        .label("Company"),
    }),
    onSubmit: async (values) => {
      let body = {
        title: values?.title,
        arabicTitle: values?.arabicTitle,
        company: values?.company
          ? values?.company?.map((data) => data?.value)
          : "",
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
              <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              {" "}
              <Link

                href={getLinkHref(detail?.roleId, '/page/dynamic-label')}
                className="text-black text-capitalize"
              >
                Dynamic Label{" "}
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">edit dynamic label</li>
          </ul>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Dynamic Label</h5>
                <Link href={getLinkHref(detail?.roleId, '/page/dynamic-label')} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
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
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Arabic Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
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
                          isMulti
                        />
                        {touched.company && errors.company ? (
                          <span className="error">{errors.company}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority Order</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          type="text"
                          placeholder="Enter Priority Order"
                          name="order"
                          value={values?.order}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyPress={restrictAlpha}
                          maxLength={10}
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
      {/* {isPending ? <Loading /> : null} */}
    </>
  );
};

export default Edit;
