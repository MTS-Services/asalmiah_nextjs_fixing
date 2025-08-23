import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { parsePhoneNumber } from "libphonenumber-js/min";
import moment from "moment";
import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import Autocomplete from "react-google-autocomplete";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import * as yup from "yup";
import useDetails from "../../../../hooks/useDetails";
import { userDetails } from "../../../../redux/features/userSlice";
import {
  ADD_USER_DETAILS_ADDRESS,
  ADDRESS_DETAIL_USER,
  checkVerify,
  EDIT_USER_DETAILS_ADDRESS,
  resendOTPByOrder,
  verifyOTPByLogin,
} from "../../../../services/APIServices";
import {
  countries,
  restrictNum1,
  stringRegx,
  validEmailPattern,
} from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
const AddressModal = forwardRef(
  ({ show1, handleClose1, getData, page, id, handleShow1 }, ref) => {
    const detail = useDetails();
    const {
      touched,
      errors,
      values,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setValues,
      resetForm,
    } = useFormik({
      initialValues: {
        fullName: "",
        email: "",
        mobile: detail?.countryCode + detail?.mobile,
        dob: "",
        gender: "",
        area: "",
        type: "",
        block: "",
        streetName: "",
        houseBuilding: "",
        appartment: "",
        latitude: "",
        longitude: "",
      },
      validationSchema: yup.object().shape({
        fullName: yup
          .string()
          .required()
          .label("Full name")
          .matches(stringRegx, "Full name is not valid")
          .trim(),
        email: yup
          .string()
          .required()
          .label("Email address")
          .trim()
          .matches(validEmailPattern, "Invalid Email"),
        mobile: yup
          .string()
          .min(7, "Mobile Number is a required field")
          .test("phone-validate", "Invalid mobile number", function (value) {
            if (value?.length > 6) {
              return isValidPhoneNumber(String(value));
            } else {
              return true;
            }
          })
          .required("Mobile Number field is required"),
        gender: yup.string().required().label("Gender"),
        area: yup.string().required().label("Area"),
        type: yup.string().required().label("Type"),
        block: yup.string().required().label("Block"),
        streetName: yup.string().required().label("Street Name"),
        houseBuilding: yup.string().required().label("House Building"),
        appartment: yup.string().required().label("Appartment"),
      }),
      onSubmit: (values) => {
        let number = parsePhoneNumber(String(values?.mobile));
        let body = {
          name: values?.fullName,
          email: values?.email,
          countryCode: "+" + number?.countryCallingCode,
          mobile: number?.nationalNumber,
          dob: values?.dob,
          gender: values?.gender,
          area: values?.area,
          type: values?.type,
          block: values?.block,
          streetName: values?.streetName,
          houseBuilding: values?.houseBuilding,
          appartment: values?.appartment,
          latitude: values?.latitude,
          longitude: values?.longitude,
        };
        addressDetailCheckout.mutate(body);
      },
    });
    const [showVerify, setShowVerify] = useState(false);
    const [otpVerifyModal, setOTPverifyModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");


    const mutationVerify = useMutation({
      mutationFn: ({ body }) => checkVerify(body),
      onSuccess: (res) => {
        setOTPverifyModal(true);
        toastAlert("success", res?.data?.message);
      },
    });

    const formik = useFormik({
      initialValues: {
        otp: "",
      },
      validationSchema: yup.object().shape({
        otp: yup.string().required().label("OTP").length(4),
      }),
      onSubmit: (values) => {
        let body = {
          otp: values?.otp,
          email: detail?.email,
        };

        verifyOTPMutation(body);
      },
    });

    const { mutate: verifyOTPMutation } = useMutation({
      mutationFn: (body) => verifyOTPByLogin(body),
      onSuccess: (resp) => {
        toastAlert("success", resp?.data?.message);
        Cookies.set("userDetail", JSON.stringify(resp?.data?.data), {
          expires: 7,
        });

        dispatch(userDetails(resp?.data?.data));
        setShowVerify(false);
        formik.resetForm();
        handleSubmit();
        setOTPverifyModal(false);
      },
      onError: (err) => {
        toastAlert("error", err?.response?.data?.message);
        formik.resetForm();
        setSelectedOption("");
        // setShowVerify(false);

        // setOTPverifyModal(false);
      },
    });

    const { mutate: resendOTPMutation } = useMutation({
      mutationFn: (body) => resendOTPByOrder(body),
      onSuccess: (resp) => {
        toastAlert("success", resp?.data?.message);
        setSelectedOption("");
        setNewIsActive(true); // Activate the timer after OTP resend
      },
    });

    const [newTimer, setNewTimer] = useState(60); // Initial timer value (seconds)
    const [newIsActive, setNewIsActive] = useState(false); // Timer activation flag

    const handleClick = () => {
      resendOTPMutation({
        email: detail?.email,
        type: selectedOption,
      });
      setNewIsActive(true);
    };

    useEffect(() => {
      let intervalId;
      if (newIsActive) {
        intervalId = setInterval(() => {
          setNewTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      }
      return () => clearInterval(intervalId); // Cleanup on component unmount or timer reset
    }, [newIsActive]);

    useEffect(() => {
      if (newTimer === 0) {
        setNewIsActive(false); // Deactivate timer when it reaches 0
        setNewTimer(60); // Reset timer value
      }
    }, [newTimer]);

    const addressDetailCheckout = useMutation({
      mutationFn: (body) =>
        id
          ? EDIT_USER_DETAILS_ADDRESS(id, body)
          : ADD_USER_DETAILS_ADDRESS(body),
      onSuccess: (resp) => {
        toastAlert("success", resp?.data?.message);
        getData(page);
        handleClose1();
      },
    });

    useQuery({
      queryKey: ["address-detail", id],
      queryFn: async ({ queryKey }) => {
        const [_key, id] = queryKey;
        if (!id) {
          return null; // or some default value
        }
        const resp = await ADDRESS_DETAIL_USER(id);
        setValues({
          ...values,
          fullName: resp?.data?.data?.name,
          email: resp?.data?.data?.email,
          mobile: resp?.data?.data?.countryCode + resp?.data?.data?.mobile,
          dob: resp?.data?.data?.dob,
          gender: resp?.data?.data?.gender,
          area: resp?.data?.data?.area,
          type: resp?.data?.data?.type,
          block: resp?.data?.data?.block,
          streetName: resp?.data?.data?.streetName,
          houseBuilding: resp?.data?.data?.houseBuilding,
          appartment: resp?.data?.data?.appartment,
          longitude: resp?.data?.data?.location?.coordinates?.at(0),
          latitude: resp?.data?.data?.location?.coordinates?.at(1),
        });
        return resp?.data?.data ?? "";
      },
    });

    // const handlePlaces = (place) => {
    //   setFieldValue("area", place?.formatted_address);
    //   setFieldValue("latitude", place?.geometry?.location?.lat());
    //   setFieldValue("longitude", place?.geometry?.location?.lng());
    // };

    const allowedCountries = ["Jordan", "Kuwait", "United Arab Emirates"];

    const handlePlaces = (place) => {
      const country = place?.address_components?.find((component) =>
        component.types.includes("country")
      )?.long_name;
      if (allowedCountries.includes(country)) {
        setFieldValue("area", place?.formatted_address);
        setFieldValue("latitude", place?.geometry?.location?.lat());
        setFieldValue("longitude", place?.geometry?.location?.lng());
      } else {
        toastAlert(
          "error",
          "Please select a location within Jordan, Kuwait, or United Arab Emirates."
        );
        setFieldValue("area", "");
        setFieldValue("latitude", "");
        setFieldValue("longitude", "");
      }
    };

    const showModal = () => {
      handleShow1();
      resetForm();
    };

    // Expose the handleSubmit function to the parent component
    useImperativeHandle(ref, () => ({
      showModal: () => {
        showModal();
      },
    }));

    return (
      <>
        <Modal
          className="Address_modal"
          show={show1}
          onHide={handleClose1}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Billing Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="add-address-wrp">
              <Row>
                <Col lg={12}>
                  <div className="cart-table">
                    <div className="billing--main">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Full Name
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="fullName"
                                placeholder="Enter full name"
                                value={values?.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="off"
                                onKeyPress={restrictNum1}
                              />
                              {touched?.fullName && errors?.fullName ? (
                                <span className="error">
                                  {touched.fullName && errors.fullName}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Email address
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                name="email"
                                value={values?.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="off"
                                maxLength={50}
                              />
                              {touched?.email && errors?.email ? (
                                <span className="error">
                                  {touched.email && errors.email}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Mobile
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <PhoneInput
                                defaultCountry="kw"
                                placeholder="Enter phone number"
                                value={values?.mobile}
                                onChange={(value) => {
                                  setFieldValue("mobile", value);
                                }}
                                countries={countries}
                              />
                              {touched?.mobile && errors?.mobile ? (
                                <span className="error">
                                  {touched.mobile && errors.mobile}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Date of birth
                                {/* <span className="text-danger">*</span> */}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                placeholder="date"
                                name="dob"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.dob}
                                max={moment()
                                  .subtract(18, "years")
                                  .format("YYYY-MM-DD")}
                              />
                              {/* {touched?.dob && errors?.dob ? (
                                <span className="error">
                                  {touched.dob && errors.dob}
                                </span>
                              ) : (
                                ""
                              )} */}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Label>
                              Type
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              name="type"
                              onChange={handleChange}
                              value={values?.type}
                            >
                              <option> Select type</option>
                              <option value="1">Home</option>
                              <option value="2">Office</option>
                              <option value="3">Others</option>
                            </Form.Select>
                            {touched?.type && errors?.type ? (
                              <span className="error">
                                {touched.type && errors.type}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Label>
                              Gender
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              name="gender"
                              onChange={handleChange}
                              value={values?.gender}
                            >
                              <option> Select gender</option>
                              <option value="1">Male</option>
                              <option value="2">Female</option>
                              <option value="3">Others</option>
                            </Form.Select>
                            {touched?.gender && errors?.gender ? (
                              <span className="error">
                                {touched.gender && errors.gender}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Area
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Autocomplete
                                apiKey={
                                  "AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"
                                }
                                placeholder="Enter area"
                                name="area"
                                className="form-control"
                                value={values?.area}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                  }
                                }}
                                options={{
                                  types: [],
                                  componentRestrictions: {
                                    country: ["JO", "KW", "AE"],
                                  },
                                }}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onPlaceSelected={(place) => {
                                  handlePlaces(place);
                                }}
                              />
                              {touched?.area && errors?.area ? (
                                <span className="error">
                                  {touched.area && errors.area}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Block
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="block"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.block}
                                maxLength={80}
                                placeholder="Enter block"
                              />
                              {touched?.block && errors?.block ? (
                                <span className="error">
                                  {touched.block && errors.block}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Street Name
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="streetName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.streetName}
                                maxLength={80}
                                placeholder="Enter street name"
                              />
                              {touched?.streetName && errors?.streetName ? (
                                <span className="error">
                                  {touched.streetName && errors.streetName}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                House Building
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="houseBuilding"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.houseBuilding}
                                maxLength={80}
                                placeholder="Enter house building"
                              />
                              {touched?.houseBuilding &&
                              errors?.houseBuilding ? (
                                <span className="error">
                                  {touched.houseBuilding &&
                                    errors.houseBuilding}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Appartment
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="appartment"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values?.appartment}
                                maxLength={80}
                                placeholder="Enter appartment"
                              />
                              {touched?.appartment && errors?.appartment ? (
                                <span className="error">
                                  {touched.appartment && errors.appartment}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>

                        <div className="text-end">
                          <Link
                            href="#"
                            className="btn btn-theme"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubmit();
                            }}
                          >
                            Save
                          </Link>
                        </div>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>

        {/* {showVerify && (
        <Modal show={showVerify} centered onHide={() => setShowVerify(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Verify OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!otpVerifyModal && (
              <>
                <form>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value={1}
                        checked={selectedOption == 1}
                        onChange={() => setSelectedOption(1)}
                      />
                      WhatsApp
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        value={2}
                        checked={selectedOption == 2}
                        onChange={() => setSelectedOption(2)}
                      />
                      SMS
                    </label>
                  </div>
                </form>

                <Modal.Footer>
                  <button className="btn btn-theme mt-3" onClick={handleClose}>
                    Close
                  </button>
                  <button
                    className="btn btn-theme mt-3"
                    onClick={(e) => {
                      e.preventDefault();

                      let body = {
                        type: selectedOption,
                      };
                      mutationVerify.mutate({
                        body,
                      });
                    }}
                    disabled={!selectedOption}
                  >
                    Submit
                  </button>
                </Modal.Footer>
              </>
            )}

            {!!otpVerifyModal && (
              <>
                <h6>
                  Account not verify, OTP send on your register mobile. Kindly,
                  verify your account.
                </h6>
                <Form>
                  <Row className="align-items-center">
                    <Col lg={12}>
                      <Form.Group className="">
                        <OTPInput
                          value={formik?.values?.otp}
                          onChange={(e) => formik.setFieldValue("otp", e)}
                          numInputs={4}
                          renderSeparator={<span>-</span>}
                          inputType="number"
                          renderInput={(props) => <input {...props} />}
                          containerStyle={"otp-input"}
                        />
                        <p className="text-danger mt-3 text-center mb-0">
                          {formik?.errors.otp}
                        </p>
                      </Form.Group>
                    </Col>
                    <div className="d-flex align-items-center justify-content-center flex-column gap-3">
                      {newIsActive ? (
                        <span>Resend OTP in {newTimer} seconds</span>
                      ) : (
                        <span
                          onClick={handleClick}
                          className="fs-5 mt-4 mb-3"
                          style={{ cursor: "pointer" }}
                        >
                          Resend OTP
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={formik.handleSubmit}
                        className="btn btn-theme w-100"
                      >
                        Verify
                      </button>
                    </div>
                  </Row>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      )} */}
      </>
    );
  }
);

export default AddressModal;
