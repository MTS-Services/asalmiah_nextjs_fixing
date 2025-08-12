/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import moment from "moment";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import useSlider from "../../../../../hooks/useSlider";
import { PRODUCT_ITEM_DOWNLOAD_REPORT } from "../../../../../services/APIServices";
import "../../../../../styles/globals.scss";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { filterPassedTime, getLinkHref, getPermissionsByLabel } from "../../../../../utils/helper";
import useDetails from "../../../../../hooks/useDetails";
import { constant } from "../../../../../utils/constants";
const generalreports = () => {
  const isSlider = useSlider();
  const downloadMutation = useMutation({
    mutationFn: ({ startDate, endDate }) =>
      PRODUCT_ITEM_DOWNLOAD_REPORT(startDate, endDate),
    onSuccess: (resp) => {
      if (resp?.data?.data) {
        window.open(resp?.data?.data, "_blank");
      }
      toastAlert("success", resp?.data?.message);
    },
    onError: (error) => {
      toastAlert("error", error?.response?.data?.message);
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
      startDate: "",
      endDate: "",
    },
    validationSchema: yup.object().shape({
      startDate: yup.string().label("Select start date").required(),
      endDate: yup.string().label("Select end date").required(),
    }),

    onSubmit: async (values) => {
      const payload = {
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
      };
      downloadMutation.mutate(payload); // Pass the payload to the mutate function
    },
  });

  let detail = useDetails()


  let permissionData = localStorage.getItem("permissionStore")
  const reportsManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "reportsManagement"
  );
  
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

            <li className="text-capitalize">Item Available</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Item Available</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Start Date
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="select-date">
                          <DatePicker
                            autoComplete="off"
                            name="startDate"
                            selected={values?.startDate}
                            onChange={(date) => {
                              setFieldValue("startDate", date);
                              setFieldValue("endDate", "");
                            }}
                            placeholderText="Select start Date"
                            filterTime={filterPassedTime}
                            // minDate={moment().toDate()}
                          />
                        </div>
                        {touched?.startDate && errors?.startDate ? (
                          <span className="error">
                            {touched?.startDate && errors?.startDate}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          End Date
                          <span className="text-danger">*</span>
                        </Form.Label>

                        <div className="select-date">
                          <DatePicker
                            autoComplete="off"
                            name="endDate"
                            selected={values?.endDate}
                            onChange={(date) => setFieldValue("endDate", date)}
                            placeholderText="Select end Date"
                            filterTime={filterPassedTime}
                            minDate={values?.startDate}
                          />
                        </div>

                        <span className="error">
                          {touched?.endDate && errors?.endDate}
                        </span>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">
                  {(reportsManagementPermissions?.at(0)?.value
                      ?.subNav?.itemAvailable?.download == true &&
                      (detail?.roleId === constant.DESIGNED_USER ||
                        detail?.roleId ===
                        constant.PROMOTION_USER)) ||
                      detail?.roleId == constant.ADMIN ? (
                        <Button
                      className="btn_theme mx-auto float-end"
                      type="submit"
                    >
                      Submit
                    </Button>
                    ) : (
                      ""
                    )}
                   
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

export default generalreports;
