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
import { ADD_VERSION } from "../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { constant } from "../../../../../../utils/constants";
import { getLinkHref } from "../../../../../../utils/helper";
import useDetails from "../../../../../../hooks/useDetails";

const appVersionForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  let detail = useDetails()
  // Mutation for adding App Version
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => ADD_VERSION(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      router.push(getLinkHref(detail?.roleId, "/page/app-version"));

      queryClient.invalidateQueries({ queryKey: ["app-version"] });
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
      platform: '',
      latestVersion: '',
      forceUpdate: '', // This will be a dropdown
      releaseNotes: '',
      type: ''
    },
    validationSchema: yup.object().shape({
      platform: yup.string().required().label("Platform"),
      latestVersion: yup.string().required().label("Latest version"),
      forceUpdate: yup.string().required().label("Force update"),
      releaseNotes: yup.string().required().label("Release notes"),
      type: yup.string().required().label("Type"),
    }),
    onSubmit: async (values) => {
      const payload = {
        platform: values.platform,
        latestVersion: values.latestVersion,
        forceUpdate: values.forceUpdate,
        releaseNotes: values.releaseNotes,
        type: values.type
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

                href={getLinkHref(detail?.roleId, "/page/app-version")}
                className="text-capitalize text-black"
              >
                App Version
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add App Version</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add App Version</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/app-version")}
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
                          Platform<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="platform"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.platform}
                        >
                          <option value="">Select Platform</option>
                          <option value={constant.ANDROID}>ANDROID</option>
                          <option value={constant.IOS}>IOS</option>
                        </Form.Control>
                        {touched.platform && errors.platform ? (
                          <span className="error">
                            {errors.platform}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Latest Version<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="latestVersion"
                          placeholder="Enter Latest Version"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.latestVersion}
                        />
                        {touched.latestVersion && errors.latestVersion ? (
                          <span className="error">
                            {errors.latestVersion}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Type<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="type"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.type}
                        >
                          <option value="">Select Type</option>
                          <option value={constant.USER}>Users Application</option>
                          <option value={constant.SALES}>Sales Application</option>
                        </Form.Control>
                        {touched.type && errors.type ? (
                          <span className="error">
                            {errors.type}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Force Update<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="forceUpdate"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.forceUpdate}
                        >
                          <option value="">Select Force Update</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </Form.Control>
                        {touched.forceUpdate && errors.forceUpdate ? (
                          <span className="error">
                            {errors.forceUpdate}
                          </span>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Release Notes<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          name="releaseNotes"
                          placeholder="Enter Release Notes"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.releaseNotes}
                        />
                        {touched.releaseNotes && errors.releaseNotes ? (
                          <span className="error">
                            {errors.releaseNotes}
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

export default appVersionForm;