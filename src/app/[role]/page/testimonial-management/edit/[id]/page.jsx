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
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as yup from "yup";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  EDIT_TESTIMONIAL_API,
  GET_TESTIMONIAL_DETAIL,
} from "../../../../../../../services/APIServices";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import useDetails from "../../../../../../../hooks/useDetails";
import { getLinkHref } from "../../../../../../../utils/helper";
const Edit = () => {
  const router = useRouter();

  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const detail = useDetails();
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => EDIT_TESTIMONIAL_API(id, payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, `/page/testimonial-management`));
      queryClient.invalidateQueries({ queryKey: ["testimonial-list"] });
    },
  });

  useQuery({
    queryKey: ["testimonial-detail", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;
      if (!id) {
        return null; // or some default value
      }
      const resp = await GET_TESTIMONIAL_DETAIL(id);
      if (resp?.status == 200) {
        setValues({
          ...values,
          name: resp?.data?.data?.name,
          profileImg: resp?.data?.data?.profileImg,
          description: resp?.data?.data?.description,
        });
      }

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
      profileImg: "",
      newPickedCover_Img: "",
      name: "",
      description: "",
    },

    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required()
        .label("Username")
        .trim()
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
          "Please enter a valid Username , it must contain at least one letter"
        ),

      description: yup.string().required().label("Description").trim(),

      newPickedCover_Img: yup
        .mixed()
        .when("Image", {
          is: (value) => !value,
          then: () => yup.string().required("Image is a required field"),
        })

        .when(([newPickedCover_Img], schema) => {
          if (newPickedCover_Img) {
            return yup
              .mixed()
              .test(
                "type",
                "Please select jpg, png, jpeg format",
                function (value) {
                  return (
                    value &&
                    (value.type === "image/jpg" ||
                      value.type === "image/png" ||
                      value.type === "image/jpeg")
                  );
                }
              );
          }
          return schema;
        }),
    }),
    onSubmit: async (values) => {
      let payload = new FormData();

      payload.append("name", values?.name);
      payload.append("description", values?.description);

      if (values?.newPickedCover_Img) {
        payload.append("profileImg", values?.newPickedCover_Img);
      }
      mutate(payload);
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, `/page`)}
                className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, `/page/testimonial-management`)}

                className="text-black text-capitalize"
              >
                Testimonial management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Edit testimonial</li>
          </ul>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Edit Testimonial</h5>
                <Link

                  href={getLinkHref(detail?.roleId, `/page/testimonial-management`)}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Username <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="name"
                          placeholder="Enter username"
                          onChange={handleChange}
                          value={values?.name}
                        />
                        {touched?.name && errors?.name ? (
                          <span className="error">
                            {touched?.name && errors?.name}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Description <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          as="textarea"
                          type="textarea"
                          name="description"
                          placeholder="Enter Description"
                          onChange={handleChange}
                          value={values?.description}
                          style={{ resize: "both" }} //
                        />
                        {touched?.description && errors?.description ? (
                          <span className="error">
                            {touched?.description && errors?.description}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Image
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          name="newPickedCover_Img"
                          onChange={(e) =>
                            setFieldValue(
                              "newPickedCover_Img",
                              e.target.files[0]
                            )
                          }
                          accept="image/*"
                        />

                        {values?.newPickedCover_Img?.length !== 0 ? (
                          <div className="uploaded-image m-1 ">
                            <Image
                              src={
                                URL.createObjectURL(
                                  values?.newPickedCover_Img
                                ) ?? ""
                              }
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}

                        {values?.profileImg?.length !== 0 ? (
                          <div className="uploaded-image m-1 ">
                            <Image
                              src={values?.profileImg}
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        <span className="error">
                          {touched?.newPickedCover_Img &&
                            errors?.newPickedCover_Img}
                        </span>
                      </Form.Group>
                    </Col>
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
        </div>
      </div>
    </>
  );
};

export default Edit;
