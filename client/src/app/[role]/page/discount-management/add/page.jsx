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
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../hooks/useSlider";
import { ADD_PROMOTION_API } from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { formatCurrency, getLinkHref, restrictAlpha } from "../../../../../../utils/helper";
import useCountryState from "../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../hooks/useDetails";
const Add = () => {
  const router = useRouter();
  const selectedCountry = useCountryState();
  const detail = useDetails();
  const isSlider = useSlider();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_PROMOTION_API(payload),
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
    setField,
  } = useFormik({
    initialValues: {
      discount: "",
      maxDiscountAmount: "",
    },

    validationSchema: yup.object().shape({
      discount: yup.string().required("Discount is required"),

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
                <h5 className="mb-md-0">Add Discount</h5>
                <Link
                  href={`/admin/page/discount-management`}
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
                          Max Purchase Amount ({formatCurrency("", selectedCountry)})
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

export default Add;
