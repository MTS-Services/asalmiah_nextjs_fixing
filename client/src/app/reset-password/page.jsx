'use client';

import { Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { LINK_EXPIRE, resetOldPassword } from '../../../services/APIServices';
import TranslateWidget from '../../../utils/TranslateWidget';
import TextInput from '../components/FormComponent/TextInput';
import { toastAlert } from '../../../utils/SweetAlert';
import { useMutation, useQuery } from '@tanstack/react-query';
import LinkExpired from '../components/FormComponent/LinkExpiredComponent/LinkExpired';

const ResetPassword = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');
  const roleId = searchParams?.get('roleId');

  const countryCode = searchParams?.get('countryCode');
  const tokenData = searchParams?.get('token');

  const mobile = searchParams?.get('mobile');

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const token = Cookies.get('token') && JSON.parse(Cookies.get('token'));
  let dispatch = useDispatch();
  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validation = Yup.object({
    password: Yup.string()
      .required('Password required')
      .min(8, 'password must contain 8 or more characters.')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-zA-Z]/, 'Password requires a letter'),
    confirmPassword: Yup.string()
      .required('Confirm password required')
      .oneOf(
        [Yup.ref('password'), null],
        'Passwords and confirm password must match'
      ),
  });

  const submit = async (values) => {
    let body = {
      email: email,
      password: values?.password,
      roleId: roleId,
    };
    try {
      const response = await resetOldPassword(body);
      if (response?.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 3000,
        });

        router.push(`/login`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [linkExpireMsg, setLinkExpireMsg] = useState('');

  useEffect(() => {
    let body = {
      email: email,
      token: tokenData,
    };
    mutate(body);
  }, []);

  const { mutate } = useMutation({
    mutationFn: (payload) => LINK_EXPIRE(payload),
    onSuccess: (resp) => {
      setLinkExpireMsg(resp?.response?.data?.success);
    },
    onError: (err) => {
      setLinkExpireMsg(err?.response?.data?.success);
    },
  });

  return (
    <div className='login-box'>
      <div className='translator'>
        <TranslateWidget />
      </div>
      {linkExpireMsg == false ? (
        <LinkExpired tokenData={tokenData} email={email} role={2} />
      ) : (
        <div className='container-fluid'>
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
                <h3>Reset Password</h3>
                <br />
                <Formik
                  initialValues={initialValues}
                  validationSchema={validation}
                  onSubmit={submit}
                >
                  {() => {
                    return (
                      <Form>
                        <Row>
                          <Col md={12}>
                            <div
                              className={`form-group form-box position_relative`}
                            >
                              <TextInput
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='Enter your password'
                              />
                              <div
                                className={'eye_icon'}
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                              </div>
                            </div>
                          </Col>
                          <Col md={12}>
                            <div className='form-group form-box position_relative'>
                              <TextInput
                                type={showCPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                placeholder='Confirm Password'
                              />
                              <div
                                className={'eye_icon'}
                                onClick={() =>
                                  setShowCPassword((prev) => !prev)
                                }
                              >
                                {showCPassword ? <FaEye /> : <FaEyeSlash />}
                              </div>
                            </div>
                          </Col>
                        </Row>
                        <div className='form-group mb-3 clearfix'>
                          <button
                            type='submit'
                            className='btn btn_theme float-start'
                          >
                            Reset Password
                          </button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
          <div className='copyrightnew'>
            <p className='text-center mb-0 pb-3 text-black pt-3'>
              <Link href='/'>Offarat </Link> Copyright{' '}
              {new Date().getFullYear()} <b>Offarat Company.</b>. All Rights
              Reserved.{' '}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
