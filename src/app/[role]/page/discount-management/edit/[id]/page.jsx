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
import * as yup from "yup";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  EDIT_PROMOTION_API,
  GET_PROMOTION_DETAIL_API,
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { formatCurrency, getLinkHref, restrictAlpha } from "../../../../../../../utils/helper";
import useCountryState from "../../../../../../../hooks/useCountryState";
const Edit = () => {
  const { id } = useParams();
  const router = useRouter();
  const isSlider = useSlider();
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
        discount: resp?.data?.data?.discount,
        maxDiscountAmount: resp?.data?.data?.maxDiscountAmount,
      });
      return resp?.data?.data;
    },
  });

  const detail = useDetails();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_PROMOTION_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId,`/page/promotion-management`));
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
      discount: "",
      maxDiscountAmount: "",
    },

    validationSchema: yup.object().shape({
      country: yup.string().required().label("Country"),
      discount: yup.string().required("Discount is required"),
      type: yup.string().required("Type is required"),

      maxDiscountAmount: yup
        .number()
        .required("Max discount amount is required")
        .positive("Max discount amount must be a positive number"),
    }),
    onSubmit: async (values) => {
      const payload = {
        discount: values?.discount,
        maxDiscountAmount: values?.maxDiscountAmount,
      };
      mutate(payload);
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit discount</h5>
                <Link
                  href={`/admin/page/coupon-management`}
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
                          Max Purchase Amount ({formatCurrency("",selectedCountry)})
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
