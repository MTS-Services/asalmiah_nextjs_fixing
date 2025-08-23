"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as yup from "yup";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { ADD_TWILLIO } from "../../../../../../services/APIServices";
import useDetails from "../../../../../../hooks/useDetails";
import { getLinkHref } from "../../../../../../utils/helper";

const TwilioForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // Mutation for adding Twilio configuration
  let detail = useDetails()
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => ADD_TWILLIO(payload), // Update to use ADD_TWILIO
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      router.push(getLinkHref(detail?.roleId, `/page/twillio`)); // Update the route
      queryClient.invalidateQueries({ queryKey: ["twilio-list"] }); // Update the query key
      resetForm();
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
  } = useFormik({
    initialValues: {
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioWhatsAppNumber: '',
      twilioServiceId: '',
      twilioPhoneNumber: '',
      twilioContentSid: '',
    },
    validationSchema: yup.object().shape({
      twilioAccountSid: yup.string().required('Twilio Account SID is required'),
      twilioAuthToken: yup.string().required('Twilio Auth Token is required'),
      twilioWhatsAppNumber: yup.string().required('WhatsApp Number is required'),
      twilioServiceId: yup.string().required('Service ID is required'),
      twilioPhoneNumber: yup.string().required('Phone Number is required'),
      twilioContentSid: yup.string().required('Content SID is required'),
    }),
    onSubmit: async (values) => {
      const payload = {
        twilioAccountSid: values.twilioAccountSid,
        twilioAuthToken: values.twilioAuthToken,
        twilioWhatsAppNumber: values.twilioWhatsAppNumber,
        twilioServiceId: values.twilioServiceId,
        twilioPhoneNumber: values.twilioPhoneNumber,
        twilioContentSid: values.twilioContentSid,
      };

      mutate(payload);
    },
  });

  return (
    <>
      <div className="bodymain">
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={getLinkHref(detail?.roleId, "/page/twillio")}
                className="text-capitalize text-black"
              >
                Twilio
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Twilio</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Twilio</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/twillio")}  // Update the route
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
                          Twilio Account SID<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="twilioAccountSid"
                          placeholder="Enter Twilio Account SID"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.twilioAccountSid}
                        />
                        {touched.twilioAccountSid && errors.twilioAccountSid ? (
                          <span className="error">
                            {errors.twilioAccountSid}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Twilio Auth Token<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="password"
                          name="twilioAuthToken"
                          placeholder="Enter Twilio Auth Token"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.twilioAuthToken}
                        />
                        {touched.twilioAuthToken && errors.twilioAuthToken ? (
                          <span className="error">
                            {errors.twilioAuthToken}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          WhatsApp Number<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="twilioWhatsAppNumber"
                          placeholder="Enter WhatsApp Number"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.twilioWhatsAppNumber}
                        />
                        {touched.twilioWhatsAppNumber && errors.twilioWhatsAppNumber ? (
                          <span className="error">
                            {errors.twilioWhatsAppNumber}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Service ID<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="twilioServiceId"
                          placeholder="Enter Service ID"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.twilioServiceId}
                        />
                        {touched.twilioServiceId && errors.twilioServiceId ? (
                          <span className="error">
                            {errors.twilioServiceId}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Phone Number<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="twilioPhoneNumber"
                          placeholder="Enter Phone Number"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.twilioPhoneNumber}
                        />
                        {touched.twilioPhoneNumber && errors.twilioPhoneNumber ? (
                          <span className="error">
                            {errors.twilioPhoneNumber}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Content SID<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="twilioContentSid"
                          placeholder="Enter Content SID"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.twilioContentSid}
                        />
                        {touched.twilioContentSid && errors.twilioContentSid ? (
                          <span className="error">
                            {errors.twilioContentSid}
                          </span>
                        ) : null}
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

export default TwilioForm;