"use client";

import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import * as Yup from "yup";
import logo from "../../../../public/assets/img/logo.png";
import { userDetails } from "../../../../redux/features/userSlice";
import {
  LINK_EXPIRE,
  resetOldPassword,
} from "../../../../services/APIServices";
import TranslateWidget from "../../../../utils/TranslateWidget";
import TextInput from "../../components/FormComponent/TextInput";
import { useMutation } from "@tanstack/react-query";
import LinkExpired from "@/app/components/FormComponent/LinkExpiredComponent/LinkExpired";
import useDetails from "../../../../hooks/useDetails";
import { getLinkHref } from "../../../../utils/helper";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const tokenData = searchParams?.get("token");

  const countryCode = searchParams?.get("countryCode");
  const mobile = searchParams?.get("mobile");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  let dispatch = useDispatch();
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validation = Yup.object({
    password: Yup.string()
      .required()
      .label("Password")
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: Yup.string()
      .required("Confirm password required")
      .oneOf(
        [Yup.ref("password"), null],
        "Passwords and confirm password must match"
      ),
  });
  let route = usePathname();
  const [roleId, setRoleId] = useState()
  const submit = async (values) => {
    let body = {
      // email: email,
      countryCode: "+" + countryCode,
      mobile: mobile,
      password: values?.password,
    };
    try {
      const response = await resetOldPassword(body);
      if (response?.data?.success === true) {
        Cookies.set("userDetail", JSON.stringify(response?.data?.data?.at(1)), {
          expires: 7,
        });
        dispatch(userDetails(response?.data?.data?.at(1)));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 3000,
        });

        if (route === "/admin/forgot-password") {
          setRoleId(constant.ADMIN);
        } else if (route === "/designed-user/forgot-password") {
          setRoleId(constant.DESIGNED_USER);
        } else if (route === "/promotion-user/forgot-password") {
          setRoleId(constant.PROMOTION_USER);
        }
        router.push(getLinkHref(roleId, '/page'));

      }
    } catch (error) {
      console.error(error);
    }
  };
  const [linkExpireMsg, setLinkExpireMsg] = useState("");

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
    <div className="login-box">
      <div className="translator">
        <TranslateWidget />
      </div>
      {linkExpireMsg == false ? (
        <LinkExpired tokenData={tokenData} email={email} role={1} />
      ) : (
        <Container fluid>
          <div className="form-section">
            <div className="logo-2 text-center">
              <Link href={getLinkHref(roleId)}>
                <Image height={57} width={154} src={logo} alt="logo" />
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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                          />
                          <div
                            className={"eye_icon"}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </div>
                        </div>
                      </Col>
                      <Col md={12}>
                        <div className="form-group form-box position_relative">
                          <TextInput
                            type={showCPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                          />
                          <div
                            className={"eye_icon"}
                            onClick={() => setShowCPassword((prev) => !prev)}
                          >
                            {showCPassword ? <FaEye /> : <FaEyeSlash />}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="form-group mb-3 clearfix">
                      <button
                        type="submit"
                        className="btn btn_theme float-start"
                      >
                        Reset Password
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Container>
      )}
    </div>
  );
};

export default ResetPassword;
