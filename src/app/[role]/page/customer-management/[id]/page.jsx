"use client";

import MyEditor from "@/app/components/Editor";
import NoDataFound from "@/app/no-data-found/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import "ckeditor5/ckeditor5.css";
import { useFormik } from "formik";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMinus, FaPlus } from "react-icons/fa6";
import Swal from "sweetalert2";
import * as Yup from "yup";
import useSlider from "../../../../../../hooks/useSlider";
import {
  adminUpdateUserPoints,
  adminUpdateUserState,
  adminUpdateUserWallet,
  getUserDetail,
  getUsersWalletList,
} from "../../../../../../services/APIServices";
import { constant } from "../../../../../../utils/constants";
import {
  filterPassedTime,
  FORMAT_NUMBER,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  restrictAlpha1,
  ROLE_STATUS,
} from "../../../../../../utils/helper";

import { toastAlert } from "../../../../../../utils/SweetAlert";
import { Pagination } from "@/app/components/Pagination";
import useDetails from "../../../../../../hooks/useDetails";
import { useRouter } from "next/navigation";
const CustomerDetails = ({ params }) => {
  // useDocumentTitle("View Customer")
  const { id } = params;
  let navigate = useRouter()
  const toggleVal = useSlider();
  let details = useDetails()
  const {
    data: detail,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user-details", id],
    queryFn: async () => {
      const resp = await getUserDetail(id);
      return resp?.data?.data ?? {};
    },
  });

  const stateId = (state) => {
    switch (state) {
      case constant?.PENDING:
        return "Pending";
      case constant?.ACTIVE:
        return "Active";
      case constant?.INACTIVE:
        return "In Active";
      case constant?.BLOCKED:
        return "Blocked";
      case constant?.DELETED:
        return "Deleted";
      default:
        return;
    }
  };

  const handelStatus = (state) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You want to delete this user!",
      icon: "warning",
      showCancelbadge: true,
      confirmbadgeColor: "#000",
      cancelbadgeColor: "#d33",
      confirmbadgeText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(state);
      }
    });
  };
  const { mutate } = useMutation({
    mutationFn: (state) => adminUpdateUserState(id, state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const saveWallet = useMutation({
    mutationFn: (state) => adminUpdateUserWallet(id, state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page);
      refetch();
      resetForm();
    },
  });

  const saveEarnPoints = useMutation({
    mutationFn: (state) => adminUpdateUserPoints(id, state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
      resetForm();
    },
  });
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    touched,
    errors,
    resetForm,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      showWallet: false,
      showDeductionWallet: false,
      walletAmount: "",
      startDate: "",
      endDate: "",
      description: "",
      showEarnPoints: false,
      earnPoints: "",
    },
    validationSchema: Yup.object().shape({
      walletAmount: Yup.mixed().when(["showWallet", "showDeductionWallet"], {
        is: (showWallet, showDeductionWallet) =>
          showWallet === true || showDeductionWallet === true,
        then: () =>
          Yup.number() // Change Yup.string() to Yup.number() to ensure numeric validation
            .required()
            .min(0.1, "Cashback must be greater than or equal to 0.1") // Use .min() for range validation
            .label("Cashback amount")
        ,
      }),
      startDate: Yup.mixed().when("showWallet", {
        is: (value) => value == true,
        then: () => Yup.string().label("Select start date").required(),
      }),
      endDate: Yup.mixed().when("showWallet", {
        is: (value) => value == true,
        then: () => Yup.string().label("Select end date").required(),
      }),
      description: Yup.mixed().when(["showWallet", "showDeductionWallet"], {
        is: (showWallet, showDeductionWallet) =>
          showWallet === true || showDeductionWallet === true,
        then: () =>
          Yup.string()
            .trim()
            .required("Description is required")
            .label("Description"),
      }),

      earnPoints: Yup.mixed().when("showEarnPoints", {
        is: (value) => value == true,
        then: () =>
          Yup.string()
            .required()
            .test(
              "range",
              "Earning Points must be greater than 0 ",
              (val) => parseInt(val) >= 1
            )
            .label("Earning Points")
            .trim(),
      }),
    }),
    onSubmit: async function (values) {
      if (values?.showWallet || values?.showDeductionWallet) {
        let body;

        if (values?.showWallet) {
          body = {
            cashBack: values?.walletAmount,
            startDate: moment(values?.startDate).format("YYYY-MM-DD"),
            endDate: moment(values?.endDate).format("YYYY-MM-DD"),
            description: values?.description,
            showDeductionWallet: values?.showDeductionWallet,
          };
        } else if (values?.showDeductionWallet) {
          body = {
            deductedCashBack: values?.walletAmount,
            description: values?.description,
            showDeductionWallet: values?.showDeductionWallet,
          };
        }

        saveWallet.mutate(body);
      } else {
        let body = {
          points: values?.earnPoints,
        };
        saveEarnPoints.mutate(body);
      }
    },
  });
  const [page, setPage] = useState(1);

  const [list, setList] = useState({
    data: [],
    total: null,
  });

  const { data } = list;

  useEffect(() => {
    getData(page);
  }, [page]);

  const getData = async (page) => {
    try {
      const response = await getUsersWalletList(id, page);
      if (response?.status === 200) {
        setList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(details?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              {" "}
              <Link
                href={getLinkHref(details?.roleId, "/page/customer-management")}
                className="text-black text-capitalize"
              >
                customer
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">customer management details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-md-0">Customer Details</h4>
                <Link
                  href={getLinkHref(details?.roleId, "/page/customer-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <div className="product-detail mb-5 px-md-4 ">
                  <div className="row">
                    <div className="col-md-6 mx-auto">
                      <div className="detail-content pt-2 custom_margin">
                        <div className="client-img mb-5">
                          <Image
                            src={
                              detail?.profileImg
                                ? detail?.profileImg
                                : "/assets/img/default.png"
                            }
                            alt="profile-img"
                            height={50}
                            width={50}
                          />
                        </div>
                        <Table bordered>
                          <tr>
                            <td className="fw-bold">Full Name : </td>
                            <td>{detail?.fullName ?? "-"}</td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Email : </td>
                            <td>{detail?.email ?? "-"}</td>
                          </tr>

                          <tr>
                            <td className="fw-bold">Phone Number : </td>
                            <td>
                              {detail?.countryCode} {detail?.mobile ?? "-"}
                            </td>
                          </tr>
                          {/* <tr>
                          <td className="fw-bold">Company : </td>
                          <td>{detail?.companyDetails?.company ?? "-"}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Branch : </td>
                          <td>{detail?.branchDetails?.branchName ?? "-"}</td>
                        </tr> */}
                          <tr>
                            <td className="fw-bold">Wallet Balance: </td>
                            <td>
                              <div className="d-flex">
                                {formatCurrency(
                                  FORMAT_NUMBER(detail?.walletsDetails?.amount),
                                  detail?.country
                                )}

                                <Button
                                  title="Add Cashback"
                                  className="btn_blue btn btn-sm mx-3"
                                  onClick={() => {
                                    setFieldValue("showWallet", true);
                                    setFieldValue("cashBack", "");
                                    setFieldValue("description", "");
                                  }}
                                >
                                  <FaPlus />
                                </Button>
                                <Button
                                  title="Deduction Cashback"
                                  className="btn_blue btn btn-sm mx-3"
                                  onClick={() => {
                                    setFieldValue("showDeductionWallet", true);
                                  }}
                                >
                                  <FaMinus />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Earned Points: </td>
                            <td>
                              {values?.showEarnPoints ? (
                                <>
                                  <div className="d-flex">
                                    <Form.Control
                                      type="text"
                                      name="earnPoints"
                                      value={values?.earnPoints}
                                      onChange={(e) =>
                                        setFieldValue(
                                          "earnPoints",
                                          e.target.value
                                        )
                                      }
                                      maxLength={10}
                                      onKeyPress={restrictAlpha1}
                                    />
                                    <Button
                                      title="Save"
                                      className="btn_blue btn btn-sm mx-2"
                                      onClick={() => {
                                        setFieldValue("showEarnPoints", false);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      title="Save"
                                      className="btn_blue btn btn-sm "
                                      onClick={() => {
                                        handleSubmit();
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                  <p className="text-danger">
                                    {touched.earnPoints && errors.earnPoints}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div className="d-flex">
                                    {FORMAT_NUMBER(
                                      detail?.pointsDetails?.points
                                    )}{" "}
                                    <Button
                                      title="Add Points"
                                      className="btn_blue btn btn-sm mx-3"
                                      onClick={() => {
                                        setFieldValue(
                                          "earnPoints",
                                          detail?.pointsDetails?.points ?? 0
                                        );
                                        setFieldValue("showEarnPoints", true);
                                      }}
                                    >
                                      <FaPlus />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>

                          {details?.roleId == constant.ADMIN ? <tr>
                            <td>
                              <b>Created By</b>
                            </td>
                            <td><Link href={"#"} onClick={(e) => {
                              e.preventDefault()
                              if (detail?.createdBy?.roleId !== constant.ADMIN) {


                                navigate.push(getLinkHrefRouteSingleView(details?.roleId, data?.createdBy?._id,ROLE_STATUS(data?.createdBy?.roleId)))
                              } else {
                                navigate.push(getLinkHref(details?.roleId, "/page/profile"))
                              }
                            }}> {detail?.createdBy?.fullName} </Link></td>
                          </tr> : ""}

                          {details?.roleId == constant.ADMIN ? <tr>
                            <td>
                              <b>Created On</b>
                            </td>
                            <td>{moment(detail?.createdAt).format("LLL") ?? "-"}</td>
                          </tr> : ""}

                          {details?.roleId == constant.ADMIN ? <tr>
                            <td>
                              <b>Updated By</b>
                            </td>
                            <td><Link href={"#"} onClick={(e) => {
                              e.preventDefault()
                              if (detail?.updatedBy?.roleId !== constant.ADMIN) {


                                navigate.push(getLinkHrefRouteSingleView(details?.roleId, data?.updatedBy?._id,ROLE_STATUS(detail?.updatedBy?.roleId )))
                              } else {
                                navigate.push(getLinkHref(details?.roleId, "/page/profile"))

                              }
                            }}> {detail?.updatedBy?.fullName} </Link></td>
                          </tr> : ""}

                          {details?.roleId == constant.ADMIN ? <tr>
                            <td>
                              <b>Updated On</b>
                            </td>
                            <td>{moment(detail?.updatedAt).format("LLL") ?? "-"}</td>
                          </tr> : ""}
                          <tr>
                            <td className="fw-bold">State: </td>
                            <td>{stateId(detail?.stateId)}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Last Visit Time : </td>
                            <td>
                              {moment(detail?.lastVisitTime).format("LL")}
                            </td>
                          </tr>

                          <tr>
                            <td></td>
                            <td>
                              <div className="d-flex align-items-center justify-content-end">
                                {detail?.stateId === constant?.PENDING ? (
                                  <>
                                    <span
                                      title="Active"
                                      onClick={() =>
                                        handelStatus(constant?.ACTIVE)
                                      }
                                      className=" badge bg-success  btn d-inline-block ms-2 text-white"
                                    >
                                      Active
                                    </span>
                                    <span
                                      title="Reject"
                                      onClick={() =>
                                        handelStatus(constant?.REJECT)
                                      }
                                      className="badge bg-danger  btn d-inline-block ms-2 text-white"
                                    >
                                      Reject
                                    </span>
                                  </>
                                ) : detail?.stateId === constant?.ACTIVE ? (
                                  <span
                                    title="In-Active"
                                    onClick={() =>
                                      handelStatus(constant?.INACTIVE)
                                    }
                                    className="badge bg-warning btn d-inline-block ms-2 text-white"
                                  >
                                    In-Active
                                  </span>
                                ) : (
                                  <span
                                    title="Active"
                                    onClick={() =>
                                      handelStatus(constant?.ACTIVE)
                                    }
                                    className="badge bg-success  btn d-inline-block ms-2 text-white"
                                  >
                                    Active
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        </Table>
                      </div>
                    </div>
                  </div>
                  <h3>Wallet Details</h3>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Effective Start Date</th>
                            <th>Effective End Date</th>
                            <th>
                              CashBack ({formatCurrency("", detail?.country)})
                            </th>
                            <th>
                              CashBack Dr ({formatCurrency("", detail?.country)}
                              )
                            </th>
                            <th>Deduction Amount ({formatCurrency("", detail?.country)})</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody className="gridjs-tbody">
                          {data?.length !== constant?.ZERO ? (
                            data?.map((data, index) => {
                              return (
                                <tr key={data?._id}>
                                  <td>
                                    <td>
                                      {data?.startDate ? moment(data?.startDate).format(
                                        "DD-MMM-YYYY"
                                      ) : "-"}
                                    </td>
                                  </td>
                                  <td>
                                    <td>
                                      {data?.endDate ? moment(data?.endDate).format(
                                        "MM/DD/YYYY"
                                      ) : "-"}
                                    </td>
                                  </td>
                                  <td>
                                    {data?.cashBack
                                      ? FORMAT_NUMBER(data?.cashBack)
                                      : "-"}
                                  </td>
                                  <td>
                                    {data?.cashBackDr
                                      ? FORMAT_NUMBER(data?.cashBackDr)
                                      : "-"}
                                  </td>
                                  <td>{data?.deductedCashBack ?? "-"}</td>
                                  <td>
                                    {" "}
                                    <span
                                      className="mb-0"
                                      dangerouslySetInnerHTML={{
                                        __html: (
                                          data?.description ?? "-"
                                        ).replace(/<p>|<\/p>/g, ""),
                                      }}
                                    ></span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr className="text-center">
                              <td colSpan={8}>
                                <NoDataFound />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {Math.ceil(list?.total / 10) > 1 && (
                      <Pagination
                        totalCount={list?.total}
                        handelPageChange={(e) => setPage(e.selected + 1)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {values?.showWallet || values?.showDeductionWallet ? (
        <Modal
          className="Address_modal"
          show={values?.showWallet || values?.showDeductionWallet}
          onHide={() => {
            values?.showWallet
              ? setFieldValue("showWallet", false)
              : setFieldValue("showDeductionWallet", false);
          }}
          animation={true}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {values?.showWallet ? "Add Cashback" : "Cashback Deduction"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card-body">
              <Row>
                <Col lg={12}>
                  <div className="cart-table">
                    <div className="billing--main">
                      <Row>
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                {values?.showWallet
                                  ? "Cashback"
                                  : "Cashback deduction amount"}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="walletAmount"
                                placeholder={
                                  values?.showWallet
                                    ? "Enter cashback"
                                    : "Enter cashback deduction amount"
                                }
                                value={values?.walletAmount}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="off"
                                onKeyPress={restrictAlpha1}
                                maxLength={20}
                              />
                              {touched?.walletAmount && errors?.walletAmount ? (
                                <span className="error">
                                  {touched.walletAmount && errors.walletAmount}
                                </span>
                              ) : (
                                ""
                              )}
                            </Form.Group>
                          </div>
                        </Col>
                        {values?.showWallet ? (
                          <>
                            {" "}
                            <Col lg={6} className="mx-auto">
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                  Start Date
                                  <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="select-date">
                                  <DatePicker
                                    autoComplete="off"
                                    name="startDate"
                                    selected={values?.startDate}
                                    onChange={(date) => {
                                      setFieldValue("startDate", date);
                                      setFieldValue("endDate", "");
                                    }}
                                    className="form-control"
                                    placeholderText="Select start Date"
                                    filterTime={filterPassedTime}
                                    minDate={moment().toDate()}
                                  />
                                </div>
                                {touched?.startDate && errors?.startDate ? (
                                  <span className="error">
                                    {touched?.startDate && errors?.startDate}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </Form.Group>
                            </Col>
                            <Col lg={6} className="mx-auto">
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                  End Date
                                  <span className="text-danger">*</span>
                                </Form.Label>

                                <div className="select-date">
                                  <DatePicker
                                    autoComplete="off"
                                    name="endDate"
                                    selected={values?.endDate}
                                    onChange={(date) =>
                                      setFieldValue("endDate", date)
                                    }
                                    className="form-control"
                                    placeholderText="Select end Date"
                                    filterTime={filterPassedTime}
                                    minDate={values?.startDate}
                                  />
                                </div>

                                <span className="error">
                                  {touched?.endDate && errors?.endDate}
                                </span>

                                {/* <span className="calender-icon">
                            <FaCalendarAlt />
                          </span> */}
                              </Form.Group>
                            </Col>
                          </>
                        ) : (
                          ""
                        )}

                        <Col lg={24} className="mx-auto">
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                              Description
                              <span className="text-danger">*</span>
                            </Form.Label>
                            <MyEditor
                              value={values?.description}
                              onChange={(value) =>
                                setFieldValue("description", value)
                              }
                            />
                            {touched.description && errors.description ? (
                              <span className="error">
                                {errors.description}
                              </span>
                            ) : (
                              ""
                            )}
                          </Form.Group>
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
      ) : (
        ""
      )}
    </>
  );
};

export default CustomerDetails;
