/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { LoadScript } from "@react-google-maps/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { IoMdAdd, IoMdRemoveCircle } from "react-icons/io";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useSlider from "../../../../../../hooks/useSlider";
import {
  ADD_BRANCH_API,
  GET_SEARCH_COMPANY_API,
} from "../../../../../../services/APIServices";
import MapComponent from "../../../../../../utils/MapComponent";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../../utils/constants";
import { countries, getLinkHref, validEmailPattern } from "../../../../../../utils/helper";
import useDetails from "../../../../../../hooks/useDetails";

const Add = () => {
  const router = useRouter();
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  let detail = useDetails()
  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ADD_BRANCH_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
      router.push(getLinkHref(detail?.roleId, "/page/branch-management"));
      queryClient.invalidateQueries({ queryKey: ["getbranch-list"] });
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
      branchName: "",
      area: "",
      latitude: "",
      longitude: "",
      isDeliveryPoint: 0,
      isCouponBranch: 0,
      CountryCode: "",
      deliveryWhatsUpNo: "",
      // costDelivery: "",
      deliveryEmail: "",
      companyId: "",
      workingHours: [
        {
          day: "Monday",
          startTime: "09:00",
          endTime: "22:00",
        },
        {
          day: "Tuesday",
          startTime: "09:00",
          endTime: "22:00",
        },
        {
          day: "Wednesday",
          startTime: "09:00",
          endTime: "22:00",
        },
        {
          day: "Thursday",
          startTime: "09:00",
          endTime: "22:00",
        },
        {
          day: "Friday",
          startTime: "09:00",
          endTime: "22:00",
        },
        {
          day: "Saturday",
          startTime: "09:00",
          endTime: "22:00",
        },
        {
          day: "Sunday",
          startTime: "09:00",
          endTime: "22:00",
        },
      ],
      // ARABIC
      arabicBranchName: "",
    },

    validationSchema: yup.object().shape({
      branchName: yup
        .string()
        .required()
        .label("Branch name")
        .trim()
        .matches(
          /^(?=.*[a-zA-Z])[a-zA-Z0-9\s\-]+$/,
          "Please enter a valid branch name , it must contain at least one letter"
        ),
      area: yup.string().required().label("Area").trim(),
      deliveryWhatsUpNo: yup
        .string()
        .min(7, "Delivery WhatsUpNo is a required field")
        .test("phone-validate", "Invalid Delivery WhatsUpNo", function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required("Delivery WhatsUpNo field is required"),

      companyId: yup.object().shape({
        value: yup.string().required().label("Company"),
        label: yup.string().required(),
      }),
      deliveryEmail: yup
        .string()
        .required()
        .label("Delivery email")
        .trim()
        .matches(validEmailPattern, "Invalid Email"),

      workingHours: yup.array().of(
        yup.object().shape({
          day: yup.string().required("Day is required"),
          startTime: yup.string().required("Start time is required"),
          endTime: yup
            .string()
            .required("End time is required")
            .test(
              "same-day",
              "End time must be within the same day as start time",
              function (value) {
                const startTime = this.parent.startTime;
                const endTime = value;

                const startHour = parseInt(startTime.split(":")[0], 10);
                const startMinutes = parseInt(startTime.split(":")[1], 10);
                const endHour = parseInt(endTime.split(":")[0], 10);
                const endMinutes = parseInt(endTime.split(":")[1], 10);

                // Check if the end time is later than the start time
                if (
                  endHour > startHour ||
                  (endHour === startHour && endMinutes > startMinutes)
                ) {
                  return true;
                }

                return false;
              }
            ),
        })
      ),
      // ARABIC
      arabicBranchName: yup
        .string()
        .required()
        .label("Branch name (In Arabic)")

        .trim(),
    }),

    onSubmit: async (values) => {
      let number = parsePhoneNumber(String(values?.deliveryWhatsUpNo));
      let body = {
        branchName: values?.branchName,
        area: values?.area,
        isDeliveryPoint: values?.isDeliveryPoint,
        isCouponBranch: values?.isCouponBranch,
        // deliveryWhatsUpNo: values?.deliveryWhatsUpNo,
        // costDelivery: values?.costDelivery,
        deliveryEmail: values?.deliveryEmail,
        companyId: values?.companyId?.value,
        workingHours: values?.workingHours,
        CountryCode: "+" + number?.countryCallingCode ?? "",
        deliveryWhatsUpNo: number?.nationalNumber ?? "",
        latitude: values?.latitude,
        longitude: values?.longitude,
        // ARABIC
        arabicBranchName: values?.arabicBranchName,
      };

      mutate(body);
    },
  });

  // const handleRemoveWorkingHour = (index) => {
  //   setValues({
  //     ...values,
  //     workingHours: values?.workingHours.filter((hour, i) => i !== index),
  //   });
  // };

  const handleRemoveWorkingHour = (e, index) => {
    e.preventDefault();
    const list = [...values?.workingHours];
    list.splice(index, 1);
    setFieldValue("workingHours", list);
  };

  const days = [
    {
      value: "Monday",
      disabled: values?.workingHours.some((data) => data?.day === "Monday"),
    },
    {
      value: "Tuesday",
      disabled: values?.workingHours.some((data) => data?.day === "Tuesday"),
    },
    {
      value: "Wednesday",
      disabled: values?.workingHours.some((data) => data?.day === "Wednesday"),
    },
    {
      value: "Thursday",
      disabled: values?.workingHours.some((data) => data?.day === "Thursday"),
    },
    {
      value: "Friday",
      disabled: values?.workingHours.some((data) => data?.day === "Friday"),
    },
    {
      value: "Saturday",
      disabled: values?.workingHours.some((data) => data?.day === "Saturday"),
    },
    {
      value: "Sunday",
      disabled: values?.workingHours.some((data) => data?.day === "Sunday"),
    },
  ];

  // const addWorkingHour = () => {
  //   setValues({
  //     ...values,
  //     workingHours: [
  //       ...values?.workingHours,
  //       { day: "", startTime: "", endTime: "" },
  //     ],
  //   });
  // };

  const addWorkingHour = (e) => {
    e.preventDefault();
    const list = [...values?.workingHours];
    list.push({
      day: "",
      startTime: "",
      endTime: "",
    });
    setFieldValue("workingHours", list);
  };

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_COMPANY_API(
      page,
      Paginations.PER_PAGE,
      constant?.ACTIVE,
      search
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
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // Track selected location
  const handlePlaces = (place) => {
    setFieldValue("area", place?.formatted_address);
    setFieldValue("latitude", place?.geometry?.location?.lat());
    setFieldValue("longitude", place?.geometry?.location?.lng());
    setSelectedLocation(place); // Store the selected location
  };
  return (
    <>
      <LoadScript
        libraries={["places"]}
        googleMapsApiKey="AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"
      />
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
                href={getLinkHref(detail?.roleId, "/page/branch-management")}
                className="text-capitalize text-black"
              >
                Branch management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Branch</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Branch</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/branch-management")}

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
                          Branch Name<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="branchName"
                          placeholder="Enter branch name"
                          onChange={handleChange}
                          value={values?.branchName}
                        />
                        {touched?.branchName && errors?.branchName ? (
                          <span className="error">
                            {touched?.branchName && errors?.branchName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Branch Name (In Arabic)
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicBranchName"
                          placeholder="Enter branch name (in arabic)"
                          onChange={handleChange}
                          value={values?.arabicBranchName}
                        />
                        {touched?.arabicBranchName &&
                          errors?.arabicBranchName ? (
                          <span className="error">
                            {touched?.arabicBranchName &&
                              errors?.arabicBranchName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Area<span className="text-danger">*</span>
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="area"
                          value={values.area}
                          onClick={() => setShowMap(true)} // Open map on click
                          readOnly
                          placeholder="Choose area"
                        />
                        {touched?.area && errors?.area ? (
                          <span className="error">
                            {touched?.area && errors?.area}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Delivery Email<span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter delivery email address"
                          name="deliveryEmail"
                          value={values?.deliveryEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          maxLength={50}
                        />
                        {touched?.deliveryEmail && errors?.deliveryEmail ? (
                          <span className="error">
                            {touched.deliveryEmail && errors.deliveryEmail}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Delivery Whatsapp No.{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter Delivery Whatsapp No."
                          name="deliveryWhatsUpNo"
                          value={values?.deliveryWhatsUpNo}
                          onChange={(value) => {
                            setFieldValue("deliveryWhatsUpNo", value);
                          }}
                          countries={countries}
                        />
                        {touched?.deliveryWhatsUpNo &&
                          errors?.deliveryWhatsUpNo ? (
                          <span className="error">
                            {touched?.deliveryWhatsUpNo &&
                              errors?.deliveryWhatsUpNo}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="">
                          Company
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.companyId}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("companyId", e);
                          }}
                          additional={{
                            page: 1,
                          }}
                          placeholder="Enter"
                        // key={Math.random()}
                        />
                        {touched.companyId && errors.companyId ? (
                          <span className="error">
                            {errors.companyId?.value}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Working Hours<span className="text-danger">*</span>
                        </Form.Label>

                        {values?.workingHours
                          ?.slice(0, 7)
                          ?.map((workingHour, index) => {
                            return (
                              <div key={index}>
                                <Row>
                                  <Col md={4}>
                                    <Form.Select
                                      value={workingHour.day}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      name={`workingHours.${index}.day`}
                                      className="my-3"
                                    >
                                      <option value="">Select a day</option>
                                      {days.map((day, dayIndex) => (
                                        <option
                                          key={dayIndex}
                                          value={day?.value}
                                          disabled={day.disabled}
                                        >
                                          {day?.value}
                                        </option>
                                      ))}
                                    </Form.Select>
                                    {/* <FaAngleDown className="selecticon" /> */}
                                    <span className="error">
                                      {touched?.workingHours?.length &&
                                        errors?.workingHours?.length
                                        ? errors?.workingHours[index]?.day
                                        : ""}
                                    </span>
                                  </Col>
                                  <Col md={4}>
                                    <Form.Control
                                      type="time"
                                      value={workingHour.startTime} // Use the startTime property as the value
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      name={`workingHours.${index}.startTime`}
                                      className="my-3"
                                    />
                                    <span className="error">
                                      {touched?.workingHours?.length &&
                                        errors?.workingHours?.length
                                        ? errors?.workingHours[index]?.startTime
                                        : ""}
                                    </span>
                                  </Col>
                                  <Col md={4}>
                                    <div className="d-flex ">
                                      <Form.Control
                                        type="time"
                                        value={workingHour.endTime} // Use the endTime property as the value
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name={`workingHours.${index}.endTime`}
                                        className="my-3"
                                      />

                                      <div className="ms-2 d-flex align-items-center">
                                        {index != 0 && (
                                          <span
                                            className="remove-btn btn btn_theme"
                                            onClick={(e) =>
                                              handleRemoveWorkingHour(e, index)
                                            }
                                          >
                                            <IoMdRemoveCircle />
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <span className="error">
                                      {touched?.workingHours?.length &&
                                        errors?.workingHours?.length
                                        ? errors?.workingHours[index]?.endTime
                                        : ""}
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            );
                          })}

                        {values?.workingHours?.length >= 7 ? (
                          ""
                        ) : (
                          <span
                            className="add-btn btn btn_theme mt-3"
                            onClick={addWorkingHour}
                          >
                            <IoMdAdd />
                          </span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      <div className="active-radio  d-flex algn-items-center mb-2">
                        <Form.Group className="mt-3">
                          <Form.Label>Delivery Point</Form.Label>
                          <Form.Check
                            name="isDeliveryPoint"
                            type="radio"
                            label="True"
                            id="true"
                            checked={values?.isDeliveryPoint == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="isDeliveryPoint"
                            type="radio"
                            label="False"
                            id="false"
                            checked={values?.isDeliveryPoint == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="active-radio d-flex algn-items-center  mb-2">
                        <Form.Group className="mt-3">
                          <Form.Label>Coupon Branch</Form.Label>
                          <Form.Check
                            name="isCouponBranch"
                            type="radio"
                            label="True"
                            id="Coupontrue"
                            checked={values?.isCouponBranch == 1}
                            value={1}
                            onChange={handleChange}
                          />
                          <Form.Check
                            name="isCouponBranch"
                            type="radio"
                            label="False"
                            id="Couponfalse"
                            checked={values?.isCouponBranch == 0}
                            value={0}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                  <div className="btn-end">
                    <Button
                      className="btn btn_theme"
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

      <Modal
        show={showMap}
        onHide={() => setShowMap(false)}
        size="lg"
        opened={true}
        overlayProps={{
          blur: 3,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MapComponent
            setFieldValue={setFieldValue}
            values={values.area}
            onLocationSelect={handlePlaces}
            onClose={() => {
              setShowMap(false); // Close modal if a location is selected
            }}
            showMap={showMap}
            selectedLocation={selectedLocation} // Pass the selected location to the MapComponent
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Add;
