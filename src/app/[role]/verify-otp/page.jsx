"use client";

import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import OTPInput from "react-otp-input";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useDetails from "../../../../hooks/useDetails";
import logo from "../../../../public/assets/img/logo.png";
import { userDetails } from "../../../../redux/features/userSlice";
import { resendOTP, verifyOTP } from "../../../../services/APIServices";
import { getLinkHref } from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
import TranslateWidget from "../../../../utils/TranslateWidget";
const VerifyOTP = () => {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const type = searchParams?.get("type");
  const countryCode = searchParams?.get("countryCode");
  const mobile = searchParams?.get("mobile");
  const otpType = searchParams?.get("otpType");
  const router = useRouter();
  let dispatch = useDispatch();
  const [newTimer, setNewTimer] = useState(60); // Initial timer value (seconds)
  const [newIsActive, setNewIsActive] = useState(false); // Timer activation flag

  const { values, errors, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: yup.object().shape({
      otp: yup.string().required().label("OTP").length(4),
    }),
    onSubmit: (values) => {
      let body = {
        otp: values?.otp,
        // email: email?.toLowerCase()?.trim(),
        countryCode: "+" + countryCode,
        mobile: mobile,
        type: otpType,
        roleId: 1,
      };

      verifyOTPMutation(body);
    },
  });

  const detail = useDetails()
  const { mutate: verifyOTPMutation, isPending } = useMutation({
    mutationFn: (body) => verifyOTP(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      if (type == "forget") {
        router.push(getLinkHref(detail?.roleId, `/reset-password?countryCode=${encodeURIComponent(
          countryCode
        )}&mobile=${encodeURIComponent(mobile)}&type=${type}`));
      } else {
        Cookies.set("userDetail", JSON.stringify(resp?.data?.data?.at(1)), {
          expires: 7,
        });

        dispatch(userDetails(resp?.data?.data?.at(1)));
        router.push(getLinkHref(detail?.roleId, "/page"));
        resetForm();
      }
    },
  });

  const { mutate: resendOTPMutation } = useMutation({
    mutationFn: (body) => resendOTP(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      setNewIsActive(true); // Activate the timer after OTP resend
    },
  });

  const handleClick = () => {
    resendOTPMutation({
      countryCode: "+" + countryCode,
      mobile: mobile,
      type: otpType,
      roleId: 1,
    });
    resetForm();
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
  return (
    <div className="login-box">
      <div className="translator">
        <TranslateWidget />
      </div>
      <Container fluid>
        <div className="form-section">
          <div className="logo-2 text-center">
            <Link href={getLinkHref(detail?.roleId)}>
              <Image height={57} width={154} src={logo} alt="logo" />
            </Link>
          </div>
          <h3>Verify OTP</h3>
          <br />
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <OTPInput
                  value={values?.otp}
                  onChange={(e) => setFieldValue("otp", e)}
                  numInputs={4}
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input {...props} />}
                  inputType="number"
                  inputStyle={{ width: 50, height: 50, margin: 10 }}
                  placeholder=""
                />
                <p className="text-danger mt-3 text-center mb-0">
                  {errors.otp}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group mb-3 clearfix d-flex justify-content-between align-items-center">
                  <button
                    type="submit"
                    className="btn btn_theme float-start mt-3"
                  >
                    Verify
                  </button>
                  <div className="d-flex justify-content-between align-items-center">
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
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default VerifyOTP;
