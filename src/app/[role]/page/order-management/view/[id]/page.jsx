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
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Card, Table } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { IoEye } from "react-icons/io5";
import Swal from "sweetalert2";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  CANCLE_ORDER_API,
  GET_ORDER_DETAIL,
  refundGeneratePerProduct,
  STATE_UPDATE_ORDER_API,
} from "../../../../../../../services/APIServices";
import { constant } from "../../../../../../../utils/constants";
import {
  checkLanguage,
  FORMAT_NUMBER,
  formatCurrency,
  getLinkHref,
  getOrderDeliveryStatus,
  orderTypeStatus,
  paymentStatus,
  shouldShowRefundButton,
} from "../../../../../../../utils/helper";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import Loading from "@/app/[role]/loading";
import "../../../../page.module.scss";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import useDetails from "../../../../../../../hooks/useDetails";
const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = useParams();
  let detail = useDetails()
  const [allQuestions, setAllQuestions] = useState([]);
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["order-detail", { id }],
    queryFn: async () => {
      const res = await GET_ORDER_DETAIL(id);
      extractAnswers(res?.data?.data?.products);
      return res?.data?.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (stateId) => STATE_UPDATE_ORDER_API(id, stateId),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries(["order-detail"]);
    },
  });

  const cancleMutation = useMutation({
    mutationFn: (body) => CANCLE_ORDER_API(id, body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries(["order-detail"]);
    },
  });

  const refundGenerate = useMutation({
    mutationFn: (body) => refundGeneratePerProduct(body),
    onSuccess: (resp) => {
      queryClient.invalidateQueries(["order-detail"]);
      toastAlert("success", resp?.data?.message);
    },
  });

  const handleCancel = () => {
    const body = {
      deliveryStatus: constant?.ORDER_CANCELED_STATUS,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update order status",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        cancleMutation.mutate(body);
      }
    });
  };

  const handleRefund = (data) => {
    const body = {
      orderId: id,
      productId: data?.items,
      amount: data?.product_price,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to generate refund",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        refundGenerate.mutate(body);
      }
    });
  };

  function extractAnswers(products = []) {
    // Initialize an array to hold all answers
    const allAnswers = [];

    // Iterate through each product object in the input array
    products?.forEach((product) => {
      // Check if the product has an 'answers' property and it's not empty
      if (
        product?.answers &&
        Array.isArray(product?.answers) &&
        product?.answers.length > 0
      ) {
        // Push the answers into the allAnswers array
        allAnswers.push(...product?.answers);
      }
    });

    // Return the array of all answers
    setAllQuestions(allAnswers);
  }

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, '/page/order-management')}
                className="text-capitalize text-black"
              >
                Order management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Order details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-shadow">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Order Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, '/page/order-management')}
                  className="btn_theme btn-sm"
                >
                  Back
                </Link>
              </div>

              <div className="card-body">
                <div className="order-list-table">
                  <div className="table-responsive">
                    <Table bordered>
                      <thead>
                        <tr>
                          <th className="text-capitalize">product name </th>
                          {/* <th className="text-capitalize">Product discount</th> */}
                          {companyView?.promoDetails?.discount ? (
                            <th className="text-capitalize">
                              Promocode discount
                            </th>
                          ) : (
                            ""
                          )}

                          <th className="text-capitalize">price</th>
                          <th className="text-capitalize">quantity</th>
                          <th className="text-capitalize">Product code</th>

                          <th className="text-capitalize">action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyView?.products?.map((data) => {
                          return (
                            <tr>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="order-image">
                                    {data?.productImg?.at(0)?.type ? (
                                      data?.productImg
                                        ?.at(0)
                                        ?.type?.includes("image") ? (
                                        <img
                                          src={data?.productImg?.at(0)?.url}
                                        />
                                      ) : (
                                        <video
                                          width="100%"
                                          height="100%"
                                          src={data?.productImg?.at(0)?.url}
                                        />
                                      )
                                    ) : (
                                      <img src={data?.productImg?.at(0)?.url} />
                                    )}
                                  </div>
                                  <div>
                                    <div className="mb-0 text-capitalize">
                                      {checkLanguage(
                                        data?.productName,
                                        data?.productArabicName
                                      )}
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                      {data?.size ? (
                                        <div>
                                          <p className="text-capitalize mb-0">
                                            size: <span>{data?.size}</span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {data?.color ? (
                                        <div>
                                          <p className="text-capitalize mb-0">
                                            color:{" "}
                                            <span
                                              style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                backgroundColor: data?.color,
                                                display: "inline-block",
                                              }}
                                            ></span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {formatCurrency(
                                  data?.product_price,
                                  companyView?.companyDetails?.company?.country
                                )}
                              </td>{" "}
                              {/* {companyView?.promoDetails?.discount ? (
                                <td>{companyView?.promoDetails?.discount}%</td>
                              ) : (
                                ""
                              )} */}
                              {/* <td>
                                {" "}
                                {formatCurrency(
                                  data?.product_price,p
                                  companyView?.companyDetails?.company?.country
                                )}
                              </td> */}
                              <td>{data?.quantity}</td>
                              <td>{data?.productCode}</td>
                              <td>
                                <Button
                                  type="button"
                                  className="btn_blue btn btn-sm ms-2"
                                  title="View Product"
                                  onClick={() => {
                                    router.push(

                                      getLinkHref(detail?.roleId, `/page/product-management/view-product/${data?.items}`)
                                    );
                                  }}
                                >
                                  <IoEye />
                                </Button>
                                {companyView?.deliveryStatus ==
                                  constant.ORDER_COMPLETED_STATUS &&
                                  shouldShowRefundButton(
                                    companyView?.orderTracking?.at(-1)?.date
                                  ) ? (
                                  <Button
                                    type="button"
                                    className="btn_orange btn btn-sm ms-2"
                                    onClick={() => {
                                      if (!data?.isRefund) {
                                        handleRefund(data);
                                      }
                                    }}
                                    title={`${data?.isRefund ? "Refund Request Already Generated" : "Generate Refund Request"}`}

                                  >
                                    <FaMoneyBillTransfer />
                                  </Button>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>

                <Row>
                  <Col md={6}>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-nowrap">
                            <b>InVoice Number</b>
                          </td>
                          <td>{companyView?.orderId}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Company</b>
                          </td>
                          <td>
                            {companyView?.companyDetails?.company?.company}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-nowrap">
                            <b>Company Contact number</b>
                          </td>
                          <td>
                            {companyView?.companyDetails?.company?.countryCode
                              ? companyView?.companyDetails?.company
                                ?.countryCode +
                              " " +
                              companyView?.companyDetails?.company?.mobile
                              : ""}
                          </td>
                        </tr>

                        {/* <tr>
                          <td className="text-nowrap">
                            <b>Order Date</b>
                          </td>
                          <td>
                            {moment(companyView?.createdAt).format("LLL")}
                          </td>
                        </tr> */}

                        <tr>
                          <td className="text-nowrap">
                            <b>Order Type</b>
                          </td>
                          <td>{orderTypeStatus(companyView?.orderType)}</td>
                        </tr>

                        <tr>
                          <td className="text-nowrap">
                            <b>Order Date</b>
                          </td>
                          <td>
                            {moment(companyView?.createdAt).format("LLL")}
                          </td>
                        </tr>
                        {companyView?.orderTracking?.filter(
                          (tracking) => tracking.stateId === 9
                        ) ? (
                          <tr>
                            <td className="text-nowrap">
                              <b>Delivered Date</b>
                            </td>
                            <td>
                              {companyView?.orderTracking
                                ? companyView?.orderTracking
                                  ?.filter(
                                    (tracking) => tracking.stateId === 9
                                  )
                                  .map((tracking) =>
                                    tracking
                                      ? moment(tracking.date).format("lll")
                                      : "-"
                                  )
                                : "-"}
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        <tr>
                          <td className="text-nowrap">
                            <b> Expected Delivery Date</b>
                          </td>
                          <td>
                            {companyView?.scheduleorder?.startDate ? (
                              <strong>
                                {moment(
                                  companyView?.scheduleorder?.startDate
                                ).format("lll")}{" "}
                                -{" "}
                                {moment(
                                  companyView?.scheduleorder?.endDate
                                ).format("lll")}
                              </strong>
                            ) : (
                              "As soon as possible"
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-nowrap">
                            <b>Order Status </b>
                          </td>
                          <td>
                            {getOrderDeliveryStatus(
                              companyView?.deliveryStatus
                            )}
                          </td>
                        </tr>

                        {companyView?.orderType == 2 ||
                          companyView?.orderType == 3 ? (
                          ""
                        ) : (
                          <tr>
                            <td className="text-nowrap">
                              <b>Delivery By </b>
                            </td>
                            <td>
                              {companyView?.deliveryCompanyChecked == "Armada"
                                ? "Armada"
                                : companyView?.deliveryCompanyChecked ==
                                  "Delivery Company"
                                  ? companyView?.deliveryCompany
                                  : companyView?.orderType == 1
                                    ? companyView?.companyDetails?.company?.company
                                    : ""}
                            </td>
                          </tr>
                        )}

                        {companyView?.trackingLink ? (
                          <tr>
                            <td className="text-nowrap">
                              <b>Order Track</b>
                            </td>
                            <td>
                              {" "}
                              <Link
                                href={companyView?.trackingLink}
                                target="_blank"
                              >
                                <svg
                                  width="26"
                                  height="35"
                                  viewBox="0 0 26 35"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.7188 0.15625C9.34553 0.15625 6.11046 1.49626 3.72524 3.88149C1.34001 6.26671 0 9.50178 0 12.875C0 19.5928 11.3313 33.8031 11.8169 34.4159C11.9252 34.551 12.0625 34.66 12.2186 34.7349C12.3747 34.8097 12.5456 34.8486 12.7188 34.8486C12.8919 34.8486 13.0628 34.8097 13.2189 34.7349C13.375 34.66 13.5123 34.551 13.6206 34.4159C14.1063 33.8031 25.4375 19.5928 25.4375 12.875C25.4375 9.50178 24.0975 6.26671 21.7123 3.88149C19.327 1.49626 16.092 0.15625 12.7188 0.15625ZM12.7188 16.3438C11.804 16.3438 10.9098 16.0725 10.1492 15.5643C9.38866 15.0561 8.79586 14.3338 8.44581 13.4887C8.09575 12.6436 8.00416 11.7136 8.18262 10.8165C8.36107 9.9193 8.80156 9.0952 9.44838 8.44838C10.0952 7.80156 10.9193 7.36107 11.8165 7.18262C12.7136 7.00416 13.6436 7.09575 14.4887 7.44581C15.3338 7.79586 16.0561 8.38866 16.5643 9.14924C17.0725 9.90982 17.3438 10.804 17.3438 11.7188C17.3438 12.9454 16.8565 14.1218 15.9891 14.9891C15.1218 15.8565 13.9454 16.3438 12.7188 16.3438Z"
                                    fill="#DA2A2C"
                                  />
                                </svg>
                              </Link>
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-nowrap">
                            <b>Customer FullName</b>
                          </td>
                          <td>
                            {companyView?.orderType == 1
                              ? companyView?.userDetails?.fullName
                              : companyView?.userDetails?.fullName}
                          </td>
                        </tr>
                        {companyView?.orderType == 1 ? (
                          <tr>
                            <td className="text-nowrap">
                              <b>Ship Address</b>
                            </td>
                            <td>
                              {" "}
                              {companyView?.addressesDetails?.appartment}{" "}
                              {companyView?.addressesDetails?.area}{" "}
                              {companyView?.addressesDetails?.block}{" "}
                              {companyView?.addressesDetails?.houseBuilding}{" "}
                              {companyView?.addressesDetails?.area}
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}

                        <tr>
                          <td className="text-nowrap">
                            <b>Customer Email</b>
                          </td>
                          <td>
                            {companyView?.orderType == 1
                              ? companyView?.addressesDetails?.email
                              : companyView?.userDetails?.email}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Phone number</b>
                          </td>
                          <td>
                            {companyView?.orderType == 1
                              ? companyView?.addressesDetails?.mobile
                                ? companyView?.addressesDetails?.mobile
                                : ""
                              : companyView?.userDetails?.countryCode
                                ? companyView?.userDetails?.countryCode +
                                " " +
                                companyView?.userDetails?.mobile
                                : ""}
                          </td>
                        </tr>
                        {companyView?.orderType == 1 ? (
                          <tr>
                            <td className="text-nowrap">
                              <b>
                                Delivery Cost ({" "}
                                {formatCurrency("", companyView?.companyDetails?.company?.country)})
                              </b>
                            </td>
                            <td>{companyView?.deliveryCharge}</td>
                          </tr>
                        ) : (
                          ""
                        )}

                        <tr>
                          <td className="text-nowrap">
                            <b>
                              {" "}
                              Sub Total ({" "}
                              {formatCurrency("", companyView?.companyDetails?.company?.country)})
                            </b>
                          </td>
                          <td>{FORMAT_NUMBER(companyView?.subTotal)}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Promo Discount(%)</b>
                          </td>
                          <td>{companyView?.promoDetails?.discount ?? "-"}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>
                              Total ( {formatCurrency("", companyView?.companyDetails?.company?.country)}
                              )
                            </b>
                          </td>
                          <td>{FORMAT_NUMBER(companyView?.total)}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Payment Mode</b>
                          </td>
                          <td>
                            {" "}
                            {companyView?.walletAmount &&
                              companyView?.paymentType == 1
                              ? "Wallet and " +
                              paymentStatus(companyView?.paymentType)
                              : companyView?.walletAmount &&
                                companyView?.paymentType !== 1
                                ? "Wallet"
                                : paymentStatus(companyView?.paymentType)}
                          </td>
                        </tr>

                        {companyView?.walletAmount ? (
                          <tr>
                            <td className="text-nowrap">
                              <b>Wallet Amount Used</b>
                            </td>
                            <td>
                              {companyView?.walletAmount !== 0
                                ? formatCurrency("", companyView?.companyDetails?.company?.country) +
                                companyView?.walletAmount
                                : ""}
                            </td>
                          </tr>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </table>

                    <div></div>
                    {/* track order */}
                    {/* <Card className="track-order border">
                      <Card.Body>
                        <Card.Title>Order Status</Card.Title>

                        <Card.Text>
                          <p>
                            {CheckAdminDeliveryStatus(
                              companyView?.deliveryStatus
                            )}
                          </p>
                          <h6>{moment(companyView?.date).format("lll")}</h6>
                        </Card.Text>

                        {companyView?.deliveryStatus !==
                          constant?.ORDER_CANCELED_STATUS && (
                          <>
                            {companyView?.deliveryStatus ===
                            constant?.ORDER_PENDING_STATUS ? (
                              <Button
                                className="btn_blue2 btn btn-sm ms-2"
                                title="Pending"
                                onClick={() =>
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You want to update order status",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#000",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, Update it!",
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      updateMutation.mutate(
                                        constant?.ORDER_READY_STATUS
                                      );
                                    }
                                  })
                                }
                                disabled={
                                  companyView?.deliveryStatus ===
                                  constant?.ORDER_COMPLETED_STATUS
                                } // Disable if completed
                              >
                                Pending
                              </Button>
                            ) : companyView?.deliveryStatus ===
                              constant?.ORDER_READY_STATUS ? (
                              <Button
                                className="btn btn-secondary btn-sm"
                                title="Ready"
                                onClick={() =>
                                  updateMutation.mutate(
                                    constant?.ORDER_SHIPPE_STATUS
                                  )
                                }
                                disabled={
                                  companyView?.deliveryStatus ===
                                  constant?.ORDER_COMPLETED_STATUS
                                } // Disable if completed
                              >
                                Ready
                              </Button>
                            ) : companyView?.deliveryStatus ===
                              constant?.ORDER_SHIPPE_STATUS ? (
                              <Button
                                className="btn btn-success btn-sm"
                                title="Shipped"
                                onClick={() =>
                                  updateMutation.mutate(
                                    constant?.ORDER_COMPLETED_STATUS
                                  )
                                }
                                disabled={
                                  companyView?.deliveryStatus ===
                                  constant?.ORDER_COMPLETED_STATUS
                                } // Disable if completed
                              >
                                Shipped
                              </Button>
                            ) : (
                              <Button
                                className="btn btn-success btn-sm"
                                title="Complete"
                                onClick={() =>
                                  updateMutation.mutate(
                                    constant?.ORDER_COMPLETED_STATUS
                                  )
                                }
                                disabled={
                                  companyView?.deliveryStatus ===
                                  constant?.ORDER_COMPLETED_STATUS
                                } // Disable if completed
                              >
                                Complete
                              </Button>
                            )}
                          </>
                        )}
                        {(companyView?.deliveryStatus ===
                          constant?.ORDER_PENDING_STATUS ||
                          companyView?.deliveryStatus ===
                            constant?.ORDER_SHIPPE_STATUS) && (
                          <Button
                            className="btn btn-danger btn-sm ms-2"
                            title="Cancel"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        )}
                      </Card.Body>
                    </Card> */}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Card>
                      <Card.Body>
                        <h5>Order Status</h5>
                        <Table className="table-responsive">
                          <tbody>
                            <tr>
                              {companyView?.deliveryStatus ==
                                constant?.ORDER_CANCELED_STATUS ? (
                                <td className="text-danger">Cancelled</td>
                              ) : (
                                <>
                                  <td>
                                    <div className="d-flex align-items-center order-chk">
                                      <input
                                        value={constant?.ORDER_PENDING_STATUS}
                                        type="radio"
                                        name="productstatus"
                                        className="form-check-input"
                                        onChange={() =>
                                          Swal.fire({
                                            title: "Are you sure?",
                                            text: "You want to update order status",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#000",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText:
                                              "Yes, Update it!",
                                          }).then(async (result) => {
                                            if (result.isConfirmed) {
                                              updateMutation.mutate(
                                                constant?.ORDER_PENDING_STATUS
                                              );
                                            }
                                          })
                                        }
                                        checked={
                                          companyView?.deliveryStatus ==
                                          constant?.ORDER_PENDING_STATUS
                                        }
                                      // disabled={
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_READY_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_SHIPPE_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_COMPLETED_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_CANCELED_STATUS
                                      // }
                                      />
                                      <span className="switch-state">
                                        Pending
                                      </span>
                                    </div>
                                  </td>

                                  <td>
                                    <div className="d-flex align-items-center order-chk">
                                      <input
                                        type="radio"
                                        value={constant?.ORDER_READY_STATUS}
                                        className="form-check-input"
                                        name="productstatus"
                                        onChange={() =>
                                          Swal.fire({
                                            title: "Are you sure?",
                                            text: "You want to update order status",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#000",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText:
                                              "Yes, Update it!",
                                          }).then(async (result) => {
                                            if (result.isConfirmed) {
                                              updateMutation.mutate(
                                                constant?.ORDER_READY_STATUS
                                              );
                                            }
                                          })
                                        }
                                        checked={
                                          companyView?.deliveryStatus ==
                                          constant?.ORDER_READY_STATUS
                                        }
                                      // disabled={
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_READY_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_SHIPPE_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_COMPLETED_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_CANCELED_STATUS
                                      // }
                                      />

                                      <span className="switch-state">
                                        Ready
                                      </span>
                                    </div>
                                  </td>
                                  {companyView?.orderType == 1 ? (
                                    <td>
                                      <div className="d-flex align-items-center order-chk">
                                        <input
                                          type="radio"
                                          value={constant?.ORDER_SHIPPE_STATUS}
                                          className="form-check-input"
                                          name="productstatus"
                                          onChange={() =>
                                            Swal.fire({
                                              title: "Are you sure?",
                                              text: "You want to update order status",
                                              icon: "warning",
                                              showCancelButton: true,
                                              confirmButtonColor: "#000",
                                              cancelButtonColor: "#d33",
                                              confirmButtonText:
                                                "Yes, Update it!",
                                            }).then(async (result) => {
                                              if (result.isConfirmed) {
                                                updateMutation.mutate(
                                                  constant?.ORDER_SHIPPE_STATUS
                                                );
                                              }
                                            })
                                          }
                                          checked={
                                            companyView?.deliveryStatus ==
                                            constant?.ORDER_SHIPPE_STATUS
                                          }
                                        // disabled={
                                        //   companyView?.deliveryStatus ===
                                        //     constant?.ORDER_SHIPPE_STATUS ||
                                        //   companyView?.deliveryStatus ===
                                        //     constant?.ORDER_COMPLETED_STATUS ||
                                        //   companyView?.deliveryStatus ===
                                        //     constant?.ORDER_CANCELED_STATUS
                                        // }
                                        />
                                        <span className="switch-state">
                                          Shipped
                                        </span>
                                      </div>
                                    </td>
                                  ) : (
                                    ""
                                  )}
                                  <td>
                                    <div className="d-flex align-items-center order-chk">
                                      <input
                                        type="radio"
                                        className="form-check-input"
                                        value={constant?.ORDER_COMPLETED_STATUS}
                                        name="productstatus"
                                        onChange={() =>
                                          Swal.fire({
                                            title: "Are you sure?",
                                            text: "You want to update order status",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#000",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText:
                                              "Yes, Update it!",
                                          }).then(async (result) => {
                                            if (result.isConfirmed) {
                                              updateMutation.mutate(
                                                constant?.ORDER_COMPLETED_STATUS
                                              );
                                            }
                                          })
                                        }
                                        checked={
                                          companyView?.deliveryStatus ===
                                          constant?.ORDER_COMPLETED_STATUS
                                        }
                                      // disabled={
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_COMPLETED_STATUS ||
                                      //   companyView?.deliveryStatus ===
                                      //     constant?.ORDER_CANCELED_STATUS
                                      // }
                                      />
                                      <span className="switch-state">
                                        Completed
                                      </span>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          </tbody>
                        </Table>

                        {(companyView?.deliveryStatus ==
                          constant?.ORDER_PENDING_STATUS ||
                          companyView?.deliveryStatus ==
                          constant?.ORDER_SHIPPE_STATUS ||
                          companyView?.deliveryStatus ==
                          constant?.ORDER_READY_STATUS ||
                          companyView?.deliveryStatus ==
                          constant?.ORDER_ONLINE_INPROCESS) && (
                            <Button
                              className="btn btn-danger btn-sm ms-2"
                              title="Cancel"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                          )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    {allQuestions?.length !== 0 ? (
                      <div className="questions m-3">
                        <h4>Additional Questions</h4>

                        <Accordion>
                          {allQuestions?.map((data, index) => {
                            return (
                              <Accordion.Item key={index} eventKey={index + 1}>
                                <Accordion.Header>
                                  {data?.questionId}
                                </Accordion.Header>
                                <Accordion.Body>
                                  {data?.answerId}
                                </Accordion.Body>
                              </Accordion.Item>
                            );
                          })}
                        </Accordion>
                      </div>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
      {updateMutation?.isLoading ? <Loading /> : ""}
      {updateMutation?.isPending ? <Loading /> : ""}
    </>
  );
};

export default View;
