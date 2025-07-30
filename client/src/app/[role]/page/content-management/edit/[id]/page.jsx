"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FaCaretDown } from "react-icons/fa";
import * as yup from "yup";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  cmsUpdate,
  getSingleCMSDetail,
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import MyEditor from "../../../../../components/Editor.jsx";
import { getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const EditContent = () => {
  const toggleVal = useSlider();
  let { id } = useParams();
  let detail = useDetails()
  const router = useRouter();

  useEffect(() => {
    getDetail(id);
  }, []);

  const getDetail = (id) => {
    getSingleCMSDetail(id).then((res) => {
      if (res?.status == 200) {
        const data = res?.data?.data;
        setValues({
          title: data?.title,
          arabicTitle: data?.arabicTitle,
          description: data?.description,
          arabicDescription: data?.arabicDescription,
          typeId: data?.typeId,
          stateId: data?.stateId,
        });
      }
    });
  };
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => cmsUpdate(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, '/page/content-management'));
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
  } = useFormik({
    initialValues: {
      title: "",
      arabicTitle: "",
      typeId: "",
      description: "",
      arabicDescription: "",
    },

    validationSchema: yup.object().shape({
      title: yup.string().required().label("Title").trim(),
      arabicTitle: yup.string().required().label("Title").trim(),
      typeId: yup.string().required().label("Type Id").trim(),
      // ARABIC
      description: yup.string().required().label("Description").trim(),
      arabicDescription: yup
        .string()
        .required()
        .label("Description (In Arabic)")
        .trim(),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();
      payload.append("title", values?.title);
      payload.append("arabicTitle", values?.arabicTitle);

      payload.append("description", values?.description);
      payload.append("arabicDescription", values?.arabicDescription);

      payload.append("typeId", values?.typeId);

      mutate(payload);
    },
  });


  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
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
              href={getLinkHref(detail?.roleId, "/page/content-management")}
              className="text-capitalize text-black"
            >
              Content management
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">Edit Content</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Edit Content</h4>
              <Link
                href={getLinkHref(detail?.roleId, "/page/content-management")}
                className="btn_theme"
              >
                Back
              </Link>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <Form.Group className="mb-4">
                      <Form.Label>
                        Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter Title"
                        value={values?.title}
                        onChange={handleChange}
                        maxLength={50}
                      />

                      {touched?.title && errors?.title ? (
                        <span className="error">
                          {touched?.title && errors?.title}
                        </span>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </div>

                  <div className="col-md-4">
                    <Form.Group className="mb-4">
                      <Form.Label>
                        Arabic Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="arabicTitle"
                        placeholder="Enter arabic title"
                        value={values?.arabicTitle}
                        onChange={handleChange}
                        maxLength={50}
                      />
                      {touched?.arabicTitle && errors?.arabicTitle ? (
                        <span className="error">
                          {touched?.arabicTitle && errors?.arabicTitle}
                        </span>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group className="mb-4">
                      <Form.Label>
                        Type <span className="text-danger">*</span>{" "}
                      </Form.Label>
                      <div className="form-group mb-4 form-box">
                        <div className="position-relative selectform">
                          <select
                            value={values?.typeId}
                            className="form-control"
                            name="typeId"
                            onChange={handleChange}
                          >
                            <option value="">Select Type</option>
                            <option value={"1"}>About</option>
                            <option value={"2"}>Privacy policy</option>
                            <option value={"3"}>Terms & Conditions</option>
                            <option value={"4"}>Report</option>
                            <option value={"5"}>Refund Policy</option>
                          </select>
                          <FaCaretDown />
                        </div>
                        {touched?.typeId && errors?.typeId ? (
                          <span className="error">
                            {touched?.typeId && errors?.typeId}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-md-12 mb-4">
                    <Form.Label>
                      Description <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <MyEditor
                      value={values?.description}
                      onChange={(value) => setFieldValue("description", value)}
                    />
                    {touched.description && errors.description ? (
                      <span className="error">{errors.description}</span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-md-12 mb-4">
                    <Form.Label>
                      Arabic Description <span className="text-danger">*</span>{" "}
                    </Form.Label>

                    <MyEditor
                      value={values?.arabicDescription}
                      onChange={(value) =>
                        setFieldValue("arabicDescription", value)
                      }
                    />
                    {touched.arabicDescription && errors.arabicDescription ? (
                      <span className="error">{errors.arabicDescription}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <Button className="btn_theme" type="submit">
                  Save
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditContent;
