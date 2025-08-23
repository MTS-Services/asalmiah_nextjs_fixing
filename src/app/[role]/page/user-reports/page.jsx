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
import { DOWNLOAD_USER_REPORT } from "../../../../../services/APIServices";
import "../../../../../styles/globals.scss";
import { countryCode } from "../../../../../utils/CountryCode";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { filterPassedTime, getLinkHref, getPermissionsByLabel } from "../../../../../utils/helper";
import useDetails from "../../../../../hooks/useDetails";
import { constant } from "../../../../../utils/constants";
const userreports = () => {
  const isSlider = useSlider();
  let detail = useDetails()
  const downloadMutation = useMutation({
    mutationFn: ({ startDate, endDate, country }) =>
      DOWNLOAD_USER_REPORT(startDate, endDate, country),
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
      country: "",
    },
    validationSchema: yup.object().shape({
      startDate: yup.string().label("Select start date").required(),
      endDate: yup.string().label("Select end date").required(),
      country: yup.string().required().label("Country"),
    }),

    onSubmit: async (values) => {
      const payload = {
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
        country: values?.country,
      };
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

            <li className="text-capitalize">User Report</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">User Report</h5>
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
                    {/* country  */}

                    <Col lg={6}>
                      <Form.Group className="mb-4 position-relative">
                        <Form.Label className="fw-bold">
                          Country<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          label="country"
                          name="country"
                          value={values?.country}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Select Country</option>
                          {countryCode &&
                            countryCode?.map((data, index) => {
                              return (
                                <option value={data?.country} key={index}>
                                  {`${data?.country}`}
                                </option>
                              );
                            })}
                        </Form.Select>

                        {touched?.country && errors?.country ? (
                          <span className="error">
                            {touched?.country && errors?.country}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">
                  {(reportsManagementPermissions?.at(0)?.value
                      ?.subNav?.userReports?.download == true &&
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

export default userreports;
