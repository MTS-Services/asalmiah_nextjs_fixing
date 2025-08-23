"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as yup from "yup";
import { EDIT_SMTP, GET_DETAILS_SMTP } from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";


const SmtpForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  // Mutation for adding/editing SMTP
  let detail = useDetails();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      EDIT_SMTP(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/smtp`));
      queryClient.invalidateQueries({ queryKey: ["smtp-list"] });
    },
  });

  useQuery({
    queryKey: ["smtp-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_DETAILS_SMTP(id);
      setValues({
        ...values,
        email: resp?.data?.data?.email,
        password: resp?.data?.data?.password,
        host: resp?.data?.data?.host,
        // ARABIC
        port: resp?.data?.data?.port,
      });
      return resp?.data?.data;
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
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
      host: '',
      port: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      host: yup
        .string()
        .required('Host is required')
        .min(1, 'Host must be at least 1 character long')
        .max(253, 'Host must be at most 253 characters long')
        .matches(
          /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+|^(\d{1,3}\.){3}\d{1,3}$/,
          'Host must be a valid hostname or IP address'
        ),
      port: yup
        .number()
        .required('Port is required')
        .positive('Port must be a positive number')
        .integer('Port must be an integer')
        .min(1, 'Port must be at least 1')
        .max(65535, 'Port must be at most 65535'),
    }),
    onSubmit: async (values) => {
      const payload = {
        email: values.email,
        password: values.password,
        host: values.host,
        port: values.port,
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
              <Link
                href={getLinkHref(detail?.roleId, `/page`)}
                className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link

                href={getLinkHref(detail?.roleId, `/page/smtp`)}
                className="text-capitalize text-black"
              >
                Smtp
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Edit SMTP</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add SMTP</h5>
                <Link
                  href={getLinkHref(detail?.roleId, `/page/smtp`)}

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
                          Email<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="email"
                          placeholder="Enter Email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                        {touched.email && errors.email ? (
                          <span className="error">
                            {errors.email}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Password<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                        {touched.password && errors.password ? (
                          <span className="error">
                            {errors.password}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Host<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="host"
                          placeholder="Enter Host"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.host}
                        />
                        {touched.host && errors.host ? (
                          <span className="error">
                            {errors.host}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Port<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="number"
                          name="port"
                          placeholder="Enter Port"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.port}
                        />
                        {touched.port && errors.port ? (
                          <span className="error">
                            {errors.port}
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

export default SmtpForm;





