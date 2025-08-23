'use client';

import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import login from '../../../public/assets/img/log.png';
import { clearCart } from '../../../redux/features/cartSlice';
import { signup } from '../../../services/APIServices';
import {
  countries,
  restrictNum1,
  stringRegx,
  validEmailPattern,
} from '../../../utils/helper';
import { toastAlert } from '../../../utils/SweetAlert';
import './page.module.scss';
import Autocomplete from 'react-google-autocomplete';
import TranslateWidget from '../../../utils/TranslateWidget';
import { country } from '../../../redux/features/CountrySlice';
import { Form } from 'react-bootstrap';
const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const navigate = useRouter();
  let dispatch = useDispatch();
  const searchParams = useSearchParams();
  const deviceToken = searchParams?.get('deviceToken');
  const isCart = searchParams?.get('isCart');
  const {
    touched,
    errors,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      // address: "",
      password: '',
      confirmpassword: '',
      mobile: '',
      countryCode: '',
      isTermsCondition: false,
      // latitude: "",
      // longitutde: "",
      country: 'Kuwait',
    },
    validationSchema: yup.object().shape({
      userName: yup
        .string()
        .required()
        .label('User name')
        .matches(/^\S+$/, 'User Name should not contain spaces')
        .min(2, 'User name should be more than 2 characters')
        .trim(),
      firstName: yup
        .string()
        .required()
        .label('First name')
        .matches(stringRegx, 'First name is not valid')
        .matches(/^\S+$/, 'First Name should not contain spaces')
        .min(2, 'First name should be more than 2 characters')
        .trim(),
      lastName: yup
        .string()
        .required()
        .label('Last name')
        .matches(stringRegx, 'Last name is not valid')
        .matches(/^\S+$/, 'Last name should not contain spaces')
        .min(2, 'Last name should be more than 2 characters')
        .trim(),
      email: yup
        .string()
        .required()
        .label('Email address')
        .trim()
        .matches(validEmailPattern, 'Invalid Email'),
      password: yup
        .string()
        .required()
        .label('Password')
        .trim()
        .min(6, 'Password must be at least 6 characters long'),
      mobile: yup
        .string()
        .min(7, 'Phone number is a required field')
        .test('phone-validate', 'Invalid phone number', function (value) {
          if (value?.length > 6) {
            return isValidPhoneNumber(String(value));
          } else {
            return true;
          }
        })
        .required('Phone number field is required'),
      confirmpassword: yup
        .string()
        .required()
        .label('Confirm password')
        .oneOf(
          [yup.ref('password'), null],
          'Password and confirm password must match'
        ),
      isTermsCondition: yup
        .bool()
        .oneOf(
          [true],
          'Please agree to our Terms & Conditions and Privacy Policy to continue.'
        )
        .required(
          'Please agree to our Terms & Conditions and Privacy Policy to continue.'
        ),
      // address: yup.string().required().label("Address").trim(),
      country: yup.string().required().label('Country'),
    }),
    onSubmit: (values) => {
      let number = parsePhoneNumber(String(values?.mobile));
      let body = {
        userName: values?.userName,
        firstName: values?.firstName,
        lastName: values?.lastName,
        email: values?.email?.toLowerCase()?.trim(),
        password: values?.password,
        mobile: number?.nationalNumber,
        countryCode: '+' + number?.countryCallingCode,
        deviceToken: deviceToken ?? null,
        isCart: isCart == 'true' ? true : false ?? null,
        isTermsCondition: values?.isTermsCondition,
        // address: values?.address,
        // latitude: values?.latitude,
        // longitutde: values?.longitutde,
        country:
          values?.country == 'United Arab Emirates' ? 'UAE' : values?.country,
      };
      mutation.mutate(body);
    },
  });

  const mutation = useMutation({
    mutationFn: (body) => signup(body),
    onSuccess: (res) => {
      localStorage.removeItem('persist:cart');
      Cookies.remove('cartItems');
      dispatch(clearCart(null));
      dispatch(country(res?.data?.data?.country));
      toastAlert('success', res?.data?.message);
      navigate.push(`/login`);
      // localStorage.removeItem("deviceToken");
      // toastAlert("success", "Your OTP is " + res?.data?.data?.otp);
      navigate.push(
        `/verify-otp?email=${encodeURIComponent(
          values?.email?.toLowerCase()?.trim()
        )}`
      );
    },
  });
  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setFieldValue('isTermsCondition', checked);
  };
  const handlePlaces = (place) => {
    setFieldValue('address', place?.formatted_address);
    setFieldValue('latitude', place?.geometry?.location?.lat());
    setFieldValue('longitude', place?.geometry?.location?.lng());
    // setFieldValue(
    //   "country",
    //   place?.address_components?.at(-1)?.types?.at(0) == "country" &&
    //     place?.address_components?.at(-1)?.long_name
    // );
  };

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
                    {' '}
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
              <h3 className='text-center'>Create an account</h3>
              <br />
              <form onSubmit={handleSubmit}>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='form-group mb-3'>
                      <label className='mb-2'>User Name</label>
                      <input
                        className='form-control'
                        type='text'
                        name='userName'
                        placeholder='Enter user name'
                        value={values?.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='off'
                        onKeyPress={restrictNum1}
                      />
                      {touched?.userName && errors?.userName ? (
                        <span className='error'>
                          {touched.userName && errors.userName}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className='form-group mb-3'>
                      <label className='mb-2'>First Name</label>
                      <input
                        className='form-control'
                        type='text'
                        name='firstName'
                        placeholder='Enter first name'
                        value={values?.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='off'
                        onKeyPress={restrictNum1}
                      />
                      {touched?.firstName && errors?.firstName ? (
                        <span className='error'>
                          {touched.firstName && errors.firstName}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='form-group mb-3'>
                      <label className='mb-2'>Last Name</label>
                      <input
                        className='form-control'
                        type='text'
                        placeholder='Enter last name'
                        name='lastName'
                        value={values?.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='off'
                        onKeyPress={restrictNum1}
                      />
                      {touched?.lastName && errors?.lastName ? (
                        <span className='error'>
                          {touched.lastName && errors.lastName}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className='form-group mb-3'>
                      <label className='mb-2'>Email Address</label>
                      <input
                        className='form-control'
                        type='email'
                        placeholder='Enter email address'
                        name='email'
                        value={values?.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='off'
                        maxLength={50}
                      />
                      {touched?.email && errors?.email ? (
                        <span className='error'>
                          {touched.email && errors.email}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>

                    <div className='form-group mb-3'>
                      <label className='mb-2'>Mobile Number</label>
                      <PhoneInput
                        defaultCountry='kw'
                        placeholder='Enter phone number'
                        value={values?.mobile}
                        onChange={(value) => {
                          setFieldValue('mobile', value);
                        }}
                        countries={countries}
                      />
                      {touched?.mobile && errors?.mobile ? (
                        <span className='error'>
                          {touched.mobile && errors.mobile}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                    {/* 
                    <div className="form-group mb-3">
                      <label className="mb-2">Address</label>
                      <Autocomplete
                        apiKey={"AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo"}
                        placeholder="Enter address"
                        name="address"
                        className="form-control"
                        value={values?.address}
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
                      {touched?.address && errors?.address ? (
                        <span className="error">
                          {touched.address && errors.address}
                        </span>
                      ) : (
                        ""
                      )}
                    </div> */}
                    <div className='form-group mb-3'>
                      <label className='mb-2'>Country</label>
                      <Form.Select
                        onChange={handleChange}
                        value={values?.country}
                        name='country'
                      >
                        <option value={'Kuwait'}>Kuwait</option>

                        <option value={'Jordan'}>Jordan</option>
                        <option value={'UAE'}>UAE</option>
                      </Form.Select>
                    </div>
                    <div className='form-group mb-3 position-relative'>
                      <label className='mb-2'>Password</label>
                      <input
                        className='form-control'
                        type={showPass ? 'text' : 'password'}
                        placeholder='Enter password'
                        name='password'
                        value={values?.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='current-password'
                        onKeyPress={(e) => {
                          if (e.charCode === 13) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                      />
                      {touched.password && errors.password ? (
                        <span className='error'>
                          {touched.password && errors.password}
                        </span>
                      ) : (
                        ''
                      )}

                      {showPass ? (
                        <span
                          className='eye-icon'
                          onClick={() => {
                            setShowPass(false);
                          }}
                        >
                          <FaEye />
                        </span>
                      ) : (
                        <span
                          className='eye-icon'
                          onClick={() => {
                            setShowPass(true);
                          }}
                        >
                          <FaEyeSlash />
                        </span>
                      )}
                    </div>

                    <div className='form-group mb-3 position-relative'>
                      <label className='mb-2'>Confirm Password</label>
                      <input
                        className='form-control'
                        type={showConfPass ? 'text' : 'password'}
                        placeholder='Enter confirm password'
                        name='confirmpassword'
                        value={values?.confirmpassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete='current-password'
                        onKeyPress={(e) => {
                          if (e.charCode === 13) {
                            e.preventDefault();
                            handleSubmit();
                          }
                        }}
                        onCopy={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                      />

                      {touched.confirmpassword && errors.confirmpassword ? (
                        <span className='error'>
                          {touched.confirmpassword && errors.confirmpassword}
                        </span>
                      ) : (
                        ''
                      )}

                      {showConfPass ? (
                        <span
                          className='eye-icon'
                          onClick={() => {
                            setShowConfPass(false);
                          }}
                        >
                          <FaEye />
                        </span>
                      ) : (
                        <span
                          className='eye-icon'
                          onClick={() => {
                            setShowConfPass(true);
                          }}
                        >
                          <FaEyeSlash />
                        </span>
                      )}
                    </div>

                    <div className='d-flex justify-content-between align-items-center'>
                      <label htmlFor='remember-terms'>
                        <input
                          type='checkbox'
                          checked={values?.isTermsCondition}
                          onChange={handleCheckboxChange}
                          onBlur={handleBlur}
                          id='remember-terms'
                        />
                        <span>
                          By proceeding,you acknowledge that you have read and
                          agree to our&nbsp;
                          <Link
                            href='/terms'
                            target='_blank'
                            className='text-decoration-underline'
                          >
                            Terms & Conditions
                          </Link>{' '}
                          and
                          <Link
                            href={'/privacy'}
                            target='_blank'
                            className='text-decoration-underline'
                          >
                            &nbsp;Privacy Policy.
                          </Link>
                        </span>
                      </label>
                    </div>
                    {touched.isTermsCondition && errors.isTermsCondition ? (
                      <span className='error'>{errors.isTermsCondition}</span>
                    ) : null}
                    <button
                      type='submit'
                      className='btn btn-theme w-100'
                      disabled={mutation.isLoading || mutation.isPending}
                    >
                      Sign Up
                    </button>
                    <br />
                    <br />
                    <p>
                      Already have an account?{' '}
                      <Link href='/login'>Log in Here!</Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='col-lg-6'>
            <Image
              src={login}
              alt='image-banner'
              className='img-fluid mx-auto d-block'
            />
          </div>
          <div className='copyrightnew'>
            <p className='text-center pt-3 mb-0'>
              © {new Date().getFullYear()}
              <Link href='/'>&nbsp;Offarat </Link> | All Rights Reserved.
              Developed By
              <Link href='https://toxsl.com/' target='_blank'>
                &nbsp;Offarat Company.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
