/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import * as yup from "yup";
import {
  EDIT_DYNAMIC_QUESTION,
  GET_DYNAMIC_DETAILS,
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import "../../page.scss";
import { getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const Edit = () => {
  const router = useRouter();
  const [bodymain, setBodymain] = useState(true);
  const showBodymain = () => setBodymain(!bodymain);
  const [featuresList, setFeaturesList] = useState([]);
  const [editIndex, setEditIndex] = useState("");
  const queryClient = useQueryClient();
  const detail = useDetails();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => EDIT_DYNAMIC_QUESTION(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/dynamic-form`));
    },
  });

  const { id } = useParams();
  useQuery({
    queryKey: ["view-dynamic form", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_DYNAMIC_DETAILS(id);

      setValues({
        ...values,
        question: resp?.data?.data?.question,
        answerType: resp?.data?.data?.answerType,
        isMandatory: resp?.data?.data?.isMandatory.toString(),
        // category_Img: resp?.data?.categoryImg,
      });
      setFeaturesList(
        resp?.data?.data?.answers?.map((answer) => answer.answer_text) || []
      );
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
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      question: "",
      answers: "",
      isMandatory: "false",
      answerType: "2",
    },
    validationSchema: yup.object().shape({
      question: yup
        .string()
        .trim()
        .required()
        .label("Question")
        .matches(
          /[a-zA-Z]/,
          "Please enter a valid question, it must contain at least one letter"
        ),
    }),
    onSubmit: async (values) => {
      if (values?.answerType == 1) {
        if (featuresList.length == 0 || featuresList.length <= 1) {
          toastAlert("error", "Please add at least two options");
          return;
        }
      }
      let body = {
        question: values?.question,
        answers: featuresList?.map((item) => {
          return { answer_text: item };
        }),
        isMandatory: values?.isMandatory,
        answerType: values?.answerType,
      };
      mutate(body);
    },
  });
  const pushData = (e) => {
    e.preventDefault();
    setFeaturesList((prevData) => [...prevData, values?.answers]);
    setValues({
      ...values,
      answers: "",
    });
  };

  const pushEditData = (e) => {
    e.preventDefault();
    setFeaturesList((prevData) => {
      const updatedList = [...prevData];
      updatedList[editIndex] = values?.answers;
      return updatedList;
    });
    setValues({
      ...values,
      answers: "",
    });
    setEditIndex("");
  };

  const handleRemove = (e, index) => {
    e.preventDefault();
    setFeaturesList((data) => data?.filter((item, i) => index !== i));
  };

  const handleEdit = (e, index) => {
    e.preventDefault();
    setValues({
      ...values,
      answers: featuresList[index],
    });
    setEditIndex(index);
  };

  return (
    <>
      <div className={bodymain ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={
                getLinkHref(detail?.roleId, `/page`)}
                className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={
                  getLinkHref(detail?.roleId, `/page/dynamic-form`)}
                className="text-capitalize text-black"
              >
                Dynamic Question
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">edit Dynamic Question</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Dynamic Question</h5>
                <Link
                  href={
                    getLinkHref(detail?.roleId, `/page/dynamic-form`)}
                  className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Form className="formbox">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Question"
                          name="question"
                          value={values?.question}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={50}
                        />
                        <p className="text-danger">
                          {touched?.question && errors?.question}
                        </p>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Is Mandatory</Form.Label>
                        <Col sm={10}>
                          <Form.Check
                            type="radio"
                            label="Yes"
                            name="isMandatory"
                            value="true"
                            id="isMandatory1"
                            checked={values?.isMandatory == "true"}
                            onChange={(e) =>
                              setFieldValue("isMandatory", e.target.value)
                            }
                          />
                          <Form.Check
                            type="radio"
                            label="No"
                            name="isMandatory"
                            value="false"
                            checked={values?.isMandatory == "false"}
                            id="isMandatory2"
                            onChange={(e) =>
                              setFieldValue("isMandatory", e.target.value)
                            }
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Answer Type</Form.Label>
                        <Col sm={10}>
                          <Form.Check
                            type="radio"
                            label="Radio"
                            name="answerType"
                            id="answertype1"
                            value="1"
                            checked={values?.answerType == "1"}
                            onChange={(e) =>
                              setFieldValue("answerType", e.target.value)
                            }
                          />
                          <Form.Check
                            type="radio"
                            label="Text"
                            name="answerType"
                            id="answertype2"
                            value="2"
                            checked={values?.answerType == "2"}
                            onChange={(e) =>
                              setFieldValue("answerType", e.target.value)
                            }
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  {values?.answerType == "1" && (
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bolder">
                            Answer<span className="text-danger">*</span>
                          </Form.Label>
                          <div className="plus_btn">
                            <Form.Control
                              type="text"
                              placeholder="Enter a answers"
                              name="answers"
                              value={values?.answers}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              maxLength={60}
                            />

                            {(values?.answers?.trim() && editIndex !== "") ||
                              (values?.answers?.trim() && editIndex === "") ? (
                              <button
                                type="btn"
                                className="theme-btn"
                                onClick={
                                  editIndex !== "" ? pushEditData : pushData
                                }
                              >
                                save
                              </button>
                            ) : null}
                          </div>
                        </Form.Group>
                      </Col>

                      {featuresList.length > 0 && (
                        <Row>
                          <Col md={6}>
                            <ul className=" ftr_lst">
                              {featuresList?.map((data, index) => (
                                <li
                                  className="subscription_list d-flex justify-content-between"
                                  key={index}
                                >
                                  {data}
                                  <div>
                                    <button
                                      className="subscription_cross_btn"
                                      onClick={(e) => handleRemove(e, index)}
                                    >
                                      <FaTimes />
                                    </button>
                                    <button
                                      className="subscription_cross_btn edit_btn"
                                      onClick={(e) => handleEdit(e, index)}
                                    >
                                      <FaPencilAlt />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </Col>
                        </Row>
                      )}
                    </Row>
                  )}
                  <div className="d-flex justify-content-end ">
                    <button
                      className="btn btn-theme height40"
                      onClick={handleSubmit}
                      disabled={isPending}
                    >
                      Add
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
