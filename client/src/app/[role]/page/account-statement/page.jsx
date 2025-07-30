/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useFormik } from "formik";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import {
  ACCOUNT_STATEMENT_DOWNLOAD_REPORT,
  ACCOUNT_STATEMENT_LIST,
  GET_COMPANY_API,
} from "../../../../../services/APIServices";
import "../../../../../styles/globals.scss";
import { constant, Paginations } from "../../../../../utils/constants";
import { accountTypeFunc, filterPassedTime, getLinkHref } from "../../../../../utils/helper";
import EditableTable from "./EditableTable";

const AccountStatement = () => {
  const isSlider = useSlider();

  const [show, setShow] = useState(false);
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [list, setList] = useState({
    data: [],
    total: null,
    filter: "",
    openningBalence: "",
    closingBalence: "",
    company: "",
    accountType: "",
  });
  const { data } = list;

  // useEffect(() => {
  //   const payload = {
  //     company: values?.company?.value,
  //     accountType: values?.accountType,
  //     startDate: moment(values?.startDate).format("YYYY-MM-DD"),
  //     endDate: moment(values?.endDate).format("YYYY-MM-DD") ,
  //     percentage: values?.perCommission,
  //     paymentPeriod: values?.paymentPeriod,
  //   };
  //   getData(payload);
  // }, [page]);

  const getData = async () => {
    try {
      const payload = {
        company: values?.company?.value,
        accountType: values?.accountType,
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
        percentage: values?.perCommission,
        paymentPeriod: values?.paymentPeriod,
      };

      const response = await ACCOUNT_STATEMENT_LIST(payload, page);
      if (response?.status == 200) {
        // toastAlert("success", response?.data?.message);
        setList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
          openningBalence: response?.data?.openningBalence,
          closingBalence: response?.data?.closingBalence,
        }));
      }
    } catch (error) {
      console.error(error);
    }
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
      company: "",
      startDate: "",
      endDate: "",
      accountType: "",
      percentage: "",
      paymentPeriod: "",
    },
    validationSchema: yup.object().shape({
      startDate: yup.string().label("Select start date").required(),
      endDate: yup.string().label("Select end date").required(),
      company: yup.object().required("Company is required").label("Company"),
    }),

    onSubmit: async (values) => {
      setShow(true);
      const payload = {
        company: values?.company?.value,
        accountType: values?.accountType,
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
        percentage: values?.perCommission,
        paymentPeriod: values?.paymentPeriod,
      };
      setList((prevState) => ({
        ...prevState,
        company: values?.company?.value,
        accountType: values?.accountType,
      }));
      getData(payload);
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(page, search);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
        accountType: i?.commissionType,
        perCommission: i?.perCommission,
        paymentPeriod: i?.paymentPeriod,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  const getDataDownloadReport = async () => {
    try {
      const payload = {
        company: values?.company?.value,
        accountType: values?.accountType,
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
        percentage: values?.perCommission,
        paymentPeriod: values?.paymentPeriod,
      };

      const response = await ACCOUNT_STATEMENT_DOWNLOAD_REPORT(payload, page);
      if (response?.status == 200) {
        // toastAlert("success", response?.data?.message);
        if (response?.data?.data) {
          window.open(response?.data?.data, "_blank");
        }
        toastAlert("success", response?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  let detail = useDetails()
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

            <li className="text-capitalize">Account Statement</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Account Statement</h5>
           
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Company
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.company}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("company", e);
                            setFieldValue("accountType", e?.accountType);
                            setFieldValue("perCommission", e?.perCommission);
                            setFieldValue("paymentPeriod", e?.paymentPeriod);
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
                        <Form.Label className="fw-bold">End Date</Form.Label>

                        <div className="select-date">
                          <DatePicker
                            name="endDate"
                            autoComplete="off"
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

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Payment Period
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          disabled
                          value={values?.paymentPeriod}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">
                          Commission Type
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          value={accountTypeFunc(values?.accountType)}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    {values?.accountType == constant?.PERCENTAGE ? (
                      <Col md={6} className="mx-auto">
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-bold">
                            Percentage Amount
                          </Form.Label>
                          <Form.Control
                            className="form-control"
                            type="text"
                            value={values?.perCommission}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>
                  <div className="text-end">
                    <Button
                      className="btn_theme mx-auto float-end"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {(show == true && data?.length !== 0) || data?.length !== 0 ? (
            <div className="card-body">
              <EditableTable
                setPage={setPage}
                data={data}
                getData={getData}
                list={list}
                page={page}
                show={show}
                getDataDownloadReport={getDataDownloadReport}
              />
            </div>
          ) : (
            <>
              <p className="text-center">
                <strong>No Account Statement Found</strong>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountStatement;
