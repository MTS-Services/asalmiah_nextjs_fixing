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
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useSlider from "../../../../../hooks/useSlider";
import {
  DOWNLOAD_MONTHLY_REPORT,
  GET_COMPANY_API
} from "../../../../../services/APIServices";
import "../../../../../styles/globals.scss";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant } from "../../../../../utils/constants";
import { filterPassedTime, getLinkHref, getPermissionsByLabel } from "../../../../../utils/helper";
import useDetails from "../../../../../hooks/useDetails";
const SupplierReport = () => {
  const isSlider = useSlider();

  const downloadMutation = useMutation({
    mutationFn: ({ startDate, endDate, company, deliveryStatus }) =>
      DOWNLOAD_MONTHLY_REPORT(startDate, endDate, company, deliveryStatus),
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

  // user list
  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(
      page,
      search,
      constant?.ACTIVE,
      constant?.USER
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
      company: "",
      deliveryStatus: "",
    },
    validationSchema: yup.object().shape({
      startDate: yup.string().label("Start date").required(),
      company: yup.object().shape({
        value: yup.string().required().label("Company"),
        label: yup.string().required(),
      }),
    }),

    onSubmit: async (values) => {
      const payload = {};
      if (values?.startDate) {
        payload.startDate = moment(values?.startDate).format("YYYY-MM-DD");
      }

      if (values?.endDate) {
        payload.endDate = moment(values?.endDate).format("YYYY-MM-DD");
      }

      payload.company = values?.company?.value;

      // Add deliveryStatus only if it exists
      if (values?.deliveryStatus) {
        payload.deliveryStatus = values?.deliveryStatus;
      }

      // Now payload will only contain properties that have valid values
      downloadMutation.mutate(payload);
    },
  });

  // const isFormValid = () => {
  //   return values?.startDate || values?.endDate || values?.customer.length > 0 || values?.deliveryStatus;
  // };

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

            <li className="text-capitalize">Supplier Monthly Report</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Supplier Monthly Report</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Start Date<span className="text-danger">*</span>
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
                            placeholderText="Select start date"
                            filterTime={filterPassedTime}
                          // minDate={moment().toDate()}
                          />
                          {touched.startDate && errors.startDate ? (
                            <span className="error">{errors.startDate}</span>
                          ) : (
                            ""
                          )}
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
                            placeholderText="Select end date"
                            // filterTime={filterPassedTime}
                            minDate={values?.startDate}
                          />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Company<span className="text-danger">*</span>
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
                          placeholder="Select the company"
                        />
                        {touched.company && errors.company ? (
                          <span className="error">{errors.company?.value}</span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Delivery Status
                        </Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="deliveryStatus"
                          onChange={handleChange}
                        >
                          <option> Select type</option>
                          <option value={constant?.ORDER_PENDING_STATUS}>
                            Pending
                          </option>
                          <option value={constant?.ORDER_READY_STATUS}>
                            Ready
                          </option>
                          <option value={constant?.ORDER_SHIPPE_STATUS}>
                            Shipped
                          </option>
                          <option value={constant?.ORDER_COMPLETED_STATUS}>
                            Completed
                          </option>
                          <option value={constant?.ORDER_CANCELED_STATUS}>
                            Cancelled
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">
                    {/* {isFormValid() && (
                      <Button
                        className="btn_theme mx-auto float-end"
                        type="submit"
                      >
                        Submit
                      </Button>
                    )} */}

                    {(reportsManagementPermissions?.at(0)?.value
                      ?.subNav?.supplierMonthlyReport?.download == true &&
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
