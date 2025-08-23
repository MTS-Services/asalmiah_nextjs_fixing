/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import { AsyncPaginate } from "react-select-async-paginate";
import * as yup from "yup";
import useDetails from "../../../../../../hooks/useDetails";
import useSlider from "../../../../../../hooks/useSlider";
import {
  ACCOUNT_ADD,
  GET_COMPANY_API,
} from "../../../../../../services/APIServices";
import { constant } from "../../../../../../utils/constants";
import {
  countries,
  getLinkHref,
  isAlphanumericWithoutDecimal,
  restrictAlpha,
} from "../../../../../../utils/helper";
import { toastAlert } from "../../../../../../utils/SweetAlert";
const Add = () => {
  const router = useRouter();
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  let detail = useDetails()

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => ACCOUNT_ADD(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      resetForm();
     router.push(getLinkHref(detail?.roleId, "/page/account-information"))
      queryClient.invalidateQueries({ queryKey: ["account-info-list"] });
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
      company: "",
      accountType: "",
      paymentMethod: "",
      paymentPeriod: "",
      flexiblePrice: false,
      accountantName: "",
      accountantTelephone: "",
      chequeCompany: "",
      linkTelephoneNumber: "",
      beneficiaryName: "",
      bankName: "",
      accountNumber: "",
      bankCode: "",
      branchName: "",
      swiftCode: "",
      IBAN: "",
    },
    validationSchema: yup.object().shape({
      company: yup.object().required("Company is required").label("Company"),
      accountType: yup

        .string()
        .required("Account Type is required")
        .label("Account Type"),
      paymentMethod: yup
        .string()
        .required("Payment Method is required")
        .label("Payment Method")
        .trim(),
      paymentPeriod: yup
        .string()
        .required("Payment Period is required")
        .label("Payment Period")
        .trim(),
      flexiblePrice: yup
        .string()
        .required("Flexible Price is required")
        .label("Flexible Price")
        .trim(),
      accountantName: yup
        .string()
        .required("Accountant Name is required")
        .label("Accountant Name")
        .trim(),
      accountantTelephone: yup
        .string()
        .min(7, "Accountant Telephone is a required field")
        .test(
          "phone-validate",
          "Invalid Accountant Telephone",
          function (value) {
            if (value?.length > 6) {
              return isValidPhoneNumber(String(value));
            } else {
              return true;
            }
          }
        )
        .required("Accountant Telephone field is required"),
      chequeCompany: yup
        .string()
        .required("Cheque Company Name is required")
        .label("Cheque Company Name")
        .trim(),
      // linkTelephoneNumber: yup
      //   .string()
      //   .min(7, "Link Telephone Number is a required field")
      //   .test(
      //     "phone-validate",
      //     "Invalid Link Telephone Number",
      //     function (value) {
      //       if (value?.length > 6) {
      //         return isValidPhoneNumber(String(value));
      //       } else {
      //         return true;
      //       }
      //     }
      //   )
      //   .required("Link Telephone Number field is required"),
      beneficiaryName: yup
        .string()
        .required("Beneficiary Name is required")
        .label("Beneficiary Name")
        .trim(),
      bankName: yup
        .string()
        .required("Bank Name is required")
        .label("Bank Name")
        .trim(),
      accountNumber: yup
        .string()
        .required("Account Number is required")
        .label("Account Number")
        .trim(),
      bankCode: yup
        .string()
        .required("Bank Code is required")
        .label("Bank Code")
        .trim(),
      branchName: yup
        .string()
        .required("Branch Name is required")
        .label("Branch Name")
        .trim(),
      swiftCode: yup
        .string()
        .required("Swift Code is required")
        .label("Swift Code")
        .trim(),
      IBAN: yup
        .string()
        .required("IBAN is required")
        .label("IBAN")
        .trim()
        .max(30),
    }),
    onSubmit: async (values) => {
      let body = {
        company: values?.company?.value,
        accountType: values?.accountType,
        paymentMethod: values?.paymentMethod,
        flexiblePrice: values?.flexiblePrice,
        accountantName: values?.accountantName,
        accountantTelephone: values?.accountantTelephone,
        chequeCompany: values?.chequeCompany,
        linkTelephoneNumber: values?.linkTelephoneNumber,
        bankName: values?.bankName,
        accountNumber: values?.accountNumber,
        bankCode: values?.bankCode,
        branchName: values?.branchName,
        swiftCode: values?.swiftCode,
        IBAN: values?.IBAN,
        paymentPeriod: values?.paymentPeriod,
        beneficiaryName: values?.beneficiaryName,
      };
      mutate(body);
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(page, search, constant?.ACTIVE);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
        accountType: i?.commissionType,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };
  return (
    <>
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
                href={getLinkHref(detail?.roleId, "/page/account-information")}
                className="text-capitalize text-black"
              >
                Account Information
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add Account Information</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add Account Information</h5>
                <Link

                  href={getLinkHref(detail?.roleId, "/page/account-information")}
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
                          Select Company <span className="text-danger">*</span>
                        </Form.Label>
                        <AsyncPaginate
                          value={values?.company}
                          loadOptions={searchCompany}
                          onChange={(e) => {
                            setFieldValue("company", e);
                            setFieldValue("accountType", e?.accountType);
                          }}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          placeholder="Enter"

                        />
                      </Form.Group>
                      {touched?.company && errors?.company ? (
                        <span className="error">
                          {touched?.company && errors?.company}
                        </span>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Account Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select Account Type"
                          name="accountType"
                          value={values?.accountType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        >
                          <option value="">Account Type</option>
                          <option value={constant?.PERCENTAGE}>
                            Percentage
                          </option>
                          <option value={constant?.FIX_AMOUNT}>
                            Fix amount
                          </option>
                        </Form.Select>
                        {touched?.accountType && errors?.accountType ? (
                          <span className="error">
                            {touched?.accountType && errors?.accountType}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Payment Method <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          aria-label="Select Payment Method"
                          name="paymentMethod"
                          value={values?.paymentMethod}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="">Account Type</option>
                          <option value={constant?.CHEQUE}>Cheque</option>
                          <option value={constant?.BANK_TRANSFER}>
                            Bank Transfer
                          </option>
                          <option value={constant?.LINK}>Link</option>
                          <option value={constant?.ONLINE_TRANSFER}>
                            Online
                          </option>
                          <option value={constant?.ADVANCE}>on Advance</option>
                          <option value={constant?.PAYPAL}>Paypal</option>
                        </Form.Select>
                        {touched?.paymentMethod && errors?.paymentMethod ? (
                          <span className="error">
                            {touched?.paymentMethod && errors?.paymentMethod}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Payment Period/Day{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="paymentPeriod"
                          placeholder="Enter Payment Period/Day"
                          onChange={handleChange}
                          value={values?.paymentPeriod}
                          onKeyPress={restrictAlpha}
                        />
                        {touched?.paymentPeriod && errors?.paymentPeriod ? (
                          <span className="error">
                            {touched?.paymentPeriod && errors?.paymentPeriod}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="d-flex align-items-center">
                        <Form.Group className="mb-4 w-100 active-radio">
                          <Form.Label>
                            Flexible Price{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Check
                            name="flexiblePrice"
                            type="radio"
                            label="Yes"
                            id="flexiblePrice-true"
                            checked={values?.flexiblePrice === true}
                            value={true}
                            onChange={() => {
                              setFieldValue("flexiblePrice", true);
                            }}
                          />
                          <Form.Check
                            name="flexiblePrice"
                            type="radio"
                            label="No"
                            id="flexiblePrice-false"
                            checked={values?.flexiblePrice === false}
                            value={false}
                            onChange={() => {
                              setFieldValue("flexiblePrice", false);
                            }}
                          />
                          {touched?.flexiblePrice && errors?.flexiblePrice ? (
                            <span className="error">
                              {touched?.flexiblePrice && errors?.flexiblePrice}
                            </span>
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Accountant Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="accountantName"
                          placeholder="Enter accountant name"
                          onChange={handleChange}
                          value={values?.accountantName}
                          maxLength={100}
                        />
                        {touched?.accountantName && errors?.accountantName ? (
                          <span className="error">
                            {touched?.accountantName && errors?.accountantName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Accountant Telephone{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter accountant telephone"
                          name="accountantTelephone"
                          value={values?.accountantTelephone}
                          onChange={(value) => {
                            setFieldValue("accountantTelephone", value);
                          }}
                          countries={countries}
                        />
                        {touched?.accountantTelephone &&
                          errors?.accountantTelephone ? (
                          <span className="error">
                            {touched?.accountantTelephone &&
                              errors?.accountantTelephone}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Cheque Company Name{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="chequeCompany"
                          placeholder="Enter cheque company name"
                          onChange={handleChange}
                          value={values?.chequeCompany}
                          maxLength={100}
                        />
                        {touched?.chequeCompany && errors?.chequeCompany ? (
                          <span className="error">
                            {touched?.chequeCompany && errors?.chequeCompany}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <label className="form-label">
                          Link Telephone Number{" "}
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <PhoneInput
                          defaultCountry="kw"
                          placeholder="Enter link telephone number"
                          name="linkTelephoneNumber"
                          value={values?.linkTelephoneNumber}
                          onChange={(value) => {
                            setFieldValue("linkTelephoneNumber", value);
                          }}
                          countries={countries}
                        />
                        {touched?.linkTelephoneNumber &&
                          errors?.linkTelephoneNumber ? (
                          <span className="error">
                            {touched?.linkTelephoneNumber &&
                              errors?.linkTelephoneNumber}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Beneficiary name{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="beneficiaryName"
                          placeholder="Enter beneficiary name"
                          onChange={handleChange}
                          value={values?.beneficiaryName}
                          maxLength={100}
                        />
                        {touched?.beneficiaryName && errors?.beneficiaryName ? (
                          <span className="error">
                            {touched?.beneficiaryName &&
                              errors?.beneficiaryName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Bank Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="bankName"
                          placeholder="Enter bank name"
                          onChange={handleChange}
                          value={values?.bankName}
                          maxLength={100}
                        />
                        {touched?.bankName && errors?.bankName ? (
                          <span className="error">
                            {touched?.bankName && errors?.bankName}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Account Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="accountNumber"
                          placeholder="Enter account number"
                          onChange={handleChange}
                          value={values?.accountNumber}
                          minLength={11}
                          maxLength={23}
                          onKeyPress={isAlphanumericWithoutDecimal}
                        />
                        {touched?.accountNumber && errors?.accountNumber ? (
                          <span className="error">
                            {touched?.accountNumber && errors?.accountNumber}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Bank Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="bankCode"
                          placeholder="Enter bank code"
                          onChange={handleChange}
                          value={values?.bankCode}
                          maxLength={100}
                          min
                        />
                        {touched?.bankCode && errors?.bankCode ? (
                          <span className="error">
                            {touched?.bankCode && errors?.bankCode}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Branch Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="branchName"
                          placeholder="Enter branch name"
                          onChange={handleChange}
                          value={values?.branchName}
                          maxLength={100}
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
                          Swift Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="swiftCode"
                          placeholder="Enter swift code"
                          onChange={handleChange}
                          value={values?.swiftCode}
                          minLength={8}
                          maxLength={11}
                        />
                        {touched?.swiftCode && errors?.swiftCode ? (
                          <span className="error">
                            {touched?.swiftCode && errors?.swiftCode}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col xl={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          IBAN <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="IBAN"
                          placeholder="Enter IBAN"
                          onChange={handleChange}
                          value={values?.IBAN}
                          maxLength={30}
                        />
                        {touched?.IBAN && errors?.IBAN ? (
                          <span className="error">
                            {touched?.IBAN && errors?.IBAN}
                          </span>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <Button
                      className="btn_theme mx-auto float-end"
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
    </>
  );
};

export default Add;
