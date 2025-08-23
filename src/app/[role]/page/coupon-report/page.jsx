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
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSlider from "../../../../../hooks/useSlider";
import { DOWNLOAD_COUPON_REPORT } from "../../../../../services/APIServices";
import "../../../../../styles/globals.scss";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { filterPassedTime, getLinkHref, getPermissionsByLabel } from "../../../../../utils/helper";
import Link from "next/link";
import useDetails from "../../../../../hooks/useDetails";
import { constant } from "../../../../../utils/constants";
const SupplierReport = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const router = useRouter();
  const isSlider = useSlider();
  const detail = useDetails();

  const downloadMutation = useMutation({
    mutationFn: ({ startDate, endDate, isUsed }) =>
      DOWNLOAD_COUPON_REPORT(startDate, endDate, isUsed),
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
      isUsed: "",
    },

    onSubmit: async (values) => {
      const payload = {};
      if (values?.startDate) {
        payload.startDate = moment(values?.startDate).format("YYYY-MM-DD");
      }

      if (values?.endDate) {
        payload.endDate = moment(values?.endDate).format("YYYY-MM-DD");
      }
      if (values?.isUsed) {
        payload.isUsed = values?.isUsed == "true" ? true : false;
      }
      // Now payload will only contain properties that have valid values
      downloadMutation.mutate(payload);
    },
  });



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

            <li className="text-capitalize">Coupon Report</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0"> Coupon Report</h5>
            
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Start Date</Form.Label>
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
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">End Date</Form.Label>

                        <div className="select-date">
                          <DatePicker
                           autoComplete="off"
                            name="endDate"
                            selected={values?.endDate}
                            onChange={(date) => setFieldValue("endDate", date)}
                            placeholderText="Select end Date"
                            // filterTime={filterPassedTime}
                            minDate={values?.startDate}
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Is Used</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="isUsed"
                          onChange={handleChange}
                        >
                          <option value="">Select type</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">

                  {(reportsManagementPermissions?.at(0)?.value
                      ?.subNav?.couponReports?.download == true &&
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

export default SupplierReport;
