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
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as yup from "yup";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  EDIT_SPIN_SETTINGS_API,
  GET_SPIN_SETTINGS_DETAIL,
} from "../../../../../../../services/APIServices";
import "../../../../../../../styles/globals.scss";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import {
  filterPassedTime,
  getLinkHref,
  restrictAlpha,
} from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
const Edit = () => {
  const { id } = useParams();
  const router = useRouter();
  const isSlider = useSlider();
  const navigate = useRouter();
  const detail = useDetails();

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_SPIN_SETTINGS_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId,`/page/fortune-settings`));
    },
  });

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    setValues,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      description: "",
      startDate: "",
      endDate: "",
      userUserPerDay: "",
      showPerUserDay: "",
      // stateId: "",
    },
    validationSchema: yup.object().shape({
      description: yup.string().required("Name is required"),
      startDate: yup.string().required("Start Date is required"),
      endDate: yup.string().required("End Date is required"),

      // stateId: yup.string().required("Status is required"),
      userUserPerDay: yup
        .string()
        .required("User use per day is required")
        .test(
          "range",
          "User use per day must be between 1 and 100",
          (val) => parseInt(val) >= 1 && parseInt(val) <= 100
        ),
      // showPerUserDay: yup
      //   .string()
      //   .required("Showing per user / day is required")
      //   .test(
      //     "range",
      //     "Showing per user / day must be between 1 and 100",
      //     (val) => parseInt(val) >= 1 && parseInt(val) <= 100
      //   ),
    }),
    onSubmit: async (values) => {
      let body = {
        description: values?.description,
        userUserPerDay: values?.userUserPerDay,
        showPerUserDay: values?.showPerUserDay,
        startDate: moment(values?.startDate).format("YYYY-MM-DD"),
        endDate: moment(values?.endDate).format("YYYY-MM-DD"),
      };
      mutate(body);
    },
  });

  useQuery({
    queryKey: ["fortune-settings-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_SPIN_SETTINGS_DETAIL(id);
      setValues({
        ...values,
        description: resp?.data?.data?.description,
        startDate: resp?.data?.data?.startDate,
        endDate: resp?.data?.data?.endDate,
        userUserPerDay: resp?.data?.data?.userUserPerDay,
        showPerUserDay: resp?.data?.data?.showPerUserDay,
        // stateId: resp?.data?.data?.stateId,
      });
      return resp?.data?.data;
    },
  });

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

            <li>
              {" "}
              <Link
            
                href={getLinkHref(detail?.roleId, "/page/fortune-settings")}
                className="text-capitalize text-black"
              >
                Fortune Settings
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Edit Fortune Settings</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Fortune Settings</h5>
                <Link
                                 href={getLinkHref(detail?.roleId, "/page/fortune-settings")}

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
                          Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="description"
                          placeholder="Enter name"
                          onChange={handleChange}
                          value={values?.description}
                        />
                        {touched?.description && errors?.description && (
                          <span className="error">{errors.description}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label className="">
                          Start Date <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="select-date">
                          <DatePicker
                            name="startDate"
                            autoComplete="off"
                            selected={values?.startDate}
                            onChange={(date) => {
                              setFieldValue("startDate", date);
                              setFieldValue("endDate", "");
                            }}
                            placeholderText="Select start Date"
                            filterTime={filterPassedTime}
                            minDate={moment().toDate()}
                          />
                        </div>
                        {touched?.startDate && errors?.startDate && (
                          <span className="error">{errors.startDate}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          End Date <span className="text-danger">*</span>
                        </Form.Label>
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
                        {touched?.endDate && errors?.endDate && (
                          <span className="error">{errors.endDate}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          User use per day{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="userUserPerDay"
                          placeholder="Enter user use per day"
                          onChange={handleChange}
                          value={values?.userUserPerDay}
                        />
                        {touched?.userUserPerDay && errors?.userUserPerDay && (
                          <span className="error">{errors.userUserPerDay}</span>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Showing per user / day{" "}
                          {/* <span className="text-danger">*</span> */}
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="showPerUserDay"
                          placeholder="Enter showing per user / day"
                          onChange={handleChange}
                          value={values?.showPerUserDay}
                          onKeyPress={restrictAlpha}
                        />
                        {/* {touched?.showPerUserDay && errors?.showPerUserDay && (
                          <span className="error">{errors.showPerUserDay}</span>
                        )} */}
                      </Form.Group>
                    </Col>

                    {/* <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          aria-label="Select Status"
                          value={values?.stateId}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          name="stateId"
                          className="form-control"
                        >
                          <option value="">Select</option>
                          <option value="1">Enabled</option>
                          <option value="0">Disabled</option>
                        </Form.Select>
                        {touched?.stateId && errors?.stateId && (
                          <span className="error">{errors.stateId}</span>
                        )}
                      </Form.Group>
                    </Col> */}
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
