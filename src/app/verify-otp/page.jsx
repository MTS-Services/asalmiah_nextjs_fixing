'use client';

import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import OTPInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import loginImg from '../../../public/assets/img/log.png';
import { userDetails } from '../../../redux/features/userSlice';
import {
  checkVerifyRegister,
  resendOTPByOrderRegister,
  verifyOTPByLoginRegister,
} from '../../../services/APIServices';
import { toastAlert } from '../../../utils/SweetAlert';
import TranslateWidget from '../../../utils/TranslateWidget';
const VerifyOTP = () => {
  const navigate = useRouter();
  let dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');
  const countryCode = searchParams?.get('countryCode');
  const mobile = searchParams?.get('mobile');
  const otpType = searchParams?.get('otpType');
  const [showVerify, setShowVerify] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');
  const handleClose = () => setShowVerify(false);
  const type = searchParams?.get('type');

  const mutationVerify = useMutation({
    mutationFn: ({ body }) => checkVerifyRegister(body),
    onSuccess: (res) => {
      setShowVerify(true);
      toastAlert('success', res?.data?.message);
    },
  });

  const { values, errors, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: yup.object().shape({
      otp: yup.string().required().label('OTP').length(4),
    }),
    onSubmit: (values) => {
      let body = {
        otp: values?.otp,
        email: email,
        // countryCode: "+" + countryCode,
        // mobile: mobile,
        type: otpType,
        roleId: 2,
      };

      verifyOTPMutation(body);
    },
  });

  const { mutate: verifyOTPMutation, isPending } = useMutation({
    // mutationFn: (body) => verifyOTP(body),
    mutationFn: (body) => verifyOTPByLoginRegister(body),

    onSuccess: (resp) => {
      toastAlert('success', resp?.data?.message);
      if (type === 'forget') {
        navigate.push(
          `/reset-password?countryCode=${encodeURIComponent(
            countryCode
          )}&mobile=${encodeURIComponent(mobile)}&type=${type}`
        );
      } else {
        Cookies.set('userDetail', JSON.stringify(resp?.data?.data), {
          expires: 7,
        });

        dispatch(userDetails(resp?.data?.data));
        navigate.push('/dashboard');
        resetForm();
      }
    },
  });

  const { mutate: resendOTPMutation } = useMutation({
    // mutationFn: (body) => resendOTP(body),
    mutationFn: (body) => resendOTPByOrderRegister(body),

    onSuccess: (resp) => {
      // toastAlert("success", "Your OTP is " + resp.data?.data?.otp);
      toastAlert('success', resp?.data?.message);
      setNewIsActive(true); // Activate the timer after OTP resend
    },
  });

  const [newTimer, setNewTimer] = useState(60); // Initial timer value (seconds)
  const [newIsActive, setNewIsActive] = useState(false); // Timer activation flag

  const handleClick = () => {
    resendOTPMutation({
      // countryCode: "+" + countryCode,
      // mobile: mobile,
      email: email,
      type: otpType || selectedOption,
      roleId: 2,
    });
    resetForm();
    // setNewIsActive(true);
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
    <div className='login-box'>
      <div className='translator'>
        <TranslateWidget />
      </div>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='col-lg-6'>
            <div className='form-section text-start'>
              <div className='logo-2'>
                <Link href='/'>
                  <h1 className='text-black text-center'>
                    <Image
                      src={`/assets/img/logo.png`}
                      height={57}
                      width={145}
                      alt='logo'
                    />
                  </h1>
                </Link>
              </div>
              <br />
              <h3 className='text-center'>Verify OTP</h3>
              <br />
              {!showVerify ? (
                <>
                  <form>
                    <div>
                      <label>
                        <input
                          type='radio'
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
                          type='radio'
                          value={2}
                          checked={selectedOption == 2}
                          onChange={() => setSelectedOption(2)}
                        />
                        SMS
                      </label>
                    </div>
                  </form>

                  {/* <button
                    className="btn btn-theme mt-3 m-2"
                    onClick={handleClose}
                  >
                    Close
                  </button> */}
                  <button
                    className='btn btn-theme mt-3 m-2'
                    onClick={(e) => {
                      e.preventDefault();

                      let body = {
                        email: email,
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
                </>
              ) : (
                ''
              )}

              {!!showVerify ? (
                <Form>
                  <Row className='align-items-center'>
                    <Col lg={12}>
                      <Form.Group className=''>
                        <OTPInput
                          value={values?.otp}
                          onChange={(e) => setFieldValue('otp', e)}
                          numInputs={4}
                          renderSeparator={<span>-</span>}
                          inputType='number'
                          renderInput={(props) => <input {...props} />}
                          containerStyle={'otp-input'}
                        />
                        <p className='text-danger mt-3 text-center mb-0'>
                          {errors.otp}
                        </p>
                      </Form.Group>
                    </Col>
                    <div className='d-flex align-items-center justify-content-center flex-column gap-3'>
                      {newIsActive ? (
                        <span>Resend OTP in {newTimer} seconds</span>
                      ) : (
                        <span
                          onClick={handleClick}
                          className='fs-5 mt-4 mb-3'
                          style={{ cursor: 'pointer' }}
                        >
                          Resend OTP
                        </span>
                      )}

                      <button
                        type='button'
                        onClick={handleSubmit}
                        className='btn btn-theme w-100'
                      >
                        Verify
                      </button>
                    </div>
                  </Row>
                </Form>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className='col-lg-6'>
            <Image
              src={loginImg}
              alt='image-banner'
              className='img-fluid mx-auto d-block'
            />
          </div>
        </div>
        <div className='copyrightnew'>
          <p className='text-center pt-3 mb-0'>
            © {new Date().getFullYear()}
            <Link href='/'>&nbsp;Offarat </Link> | All Rights Reserved.
            Developed By
            <Link href='https://toxsl.com/' target='_blank'>
              &nbsp;Toxsl Technologies
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
