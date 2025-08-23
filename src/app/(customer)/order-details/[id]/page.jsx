"use client";
import Breadcrums from "@/app/components/Breadcrums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Accordion, Button, Container } from "react-bootstrap";
import useDetails from "../../../../../hooks/useDetails";
import {
  GET_USER_ORDER_DETAILS,
  USER_CANCLE_ORDER_API,
} from "../../../../../services/APIServices";
import { constant } from "../../../../../utils/constants";
import Footer from "../../../../../utils/Footer";
import Header from "../../../../../utils/Header";
import {
  checkLanguage,
  DeliveryStatusType,
  formatCurrency,
  orderTypeStatus,
  paymentStatus,
} from "../../../../../utils/helper";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { trans } from "../../../../../utils/trans";
import UserLogInHeader from "../../../../../utils/UserLogInHeader";
import useCountryState from "../../../../../hooks/useCountryState";
export default function page() {
  const queryClient = useQueryClient();
  let detail = useDetails();
  let { id } = useParams();
  let router = useRouter();
  const selectedCountry = useCountryState();

  const [allQuestions, setAllQuestions] = useState([]);
  const { data: orderTracking } = useQuery({
    queryKey: ["order-tracking-user", id],
    queryFn: async () => {
      const resp = await GET_USER_ORDER_DETAILS(id);
      extractAnswers(resp?.data?.data?.products);
      return resp?.data?.data ?? [];
    },
  });

  // const cancleuserMutation = useMutation({
  //   mutationFn: (body) => USER_CANCLE_ORDER_API(id, body),
  //   onSuccess: (resp) => {
  //     toastAlert("success", resp?.data?.message);
  //     queryClient.invalidateQueries(["order-tracking-user"]);
  //   },
  // });

  const cancelOrderMutation = useMutation({
    mutationFn: (body) => USER_CANCLE_ORDER_API(id, body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries(["order-tracking-user"]);
      // handleClose(); // Close modal on success
    },
    onError: (err) => {
      toastAlert("error", err?.response?.data?.message);
    },
  });

  // const handleCancel = () => {
  //   const body = {
  //     deliveryStatus: constant?.ORDER_CANCELED_STATUS,
  //   };
  //   cancleuserMutation.mutate(body);
  //   setShowModal(true);
  // };

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

  // refund modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // const handleClose = () => {
  //   setShowModal(false);
  // };

  // const handleRefund = () => {
  //   const body = {
  //     deliveryStatus: constant?.ORDER_CANCELED_STATUS,
  //     paymentReturnType: selectedOption === 'WALLET' ? 1 : 2
  //   };
  //   cancleuserMutation.mutate(body);
  //   handleClose();
  // };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOption(""); // Reset selected option when closing
  };

  const handleRefund = () => {
    const body = {
      deliveryStatus: constant?.ORDER_CANCELED_STATUS,
      paymentReturnType: 1,
    };
    cancelOrderMutation.mutate(body);
  };

  let language = localStorage.getItem("language");
  const Home = trans("home");
  return (
    <div>
      {" "}
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}{" "}
      <Breadcrums
        firstLink={Home}
        secondLink={"Order Details"}
        language={language}
      />
      <section className="order-bg py-5">
        <Container>
          <div className="pdpt-bg">
            <div className="pdpt-title">
              <h6>{moment(orderTracking?.createdAt).format("lll")}</h6>
            </div>

            <div className="order-body10">
              <h6>{orderTracking?.length}</h6>
              <ul className="order-dtsll">
                {orderTracking?.products?.map((data) => {
                  return (
                    <li
                      onClick={() => {
                        router.push(`/product-detail/${data?.items}`);
                      }}
                    >
                      <div className="order-dt-img">
                        {data?.productImg?.at(0)?.type ? (
                          data?.productImg?.at(0)?.type?.includes("image") ? (
                            <Image
                              src={data?.productImg?.at(0)?.url}
                              height={200}
                              width={300}
                              alt="product-img"
                            />
                          ) : (
                            <video
                              height={200}
                              width={250}
                              src={data?.productImg?.at(0)?.url}
                            />
                          )
                        ) : (
                          <Image
                            src={data?.productImg?.at(0)?.url}
                            height={200}
                            width={300}
                            alt="product-img"
                          />
                        )}
                      </div>
                      <div className="order-dt47">
                        <h4>
                          {" "}
                          {checkLanguage(
                            data?.productName,
                            data?.productArabicName
                          )}
                        </h4>
                        {/* <p>Delivered - Product</p> */}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="total-dt">
                <div className="total-checkout-group">
                  <div className="cart-total-dil">
                    <h4>Bag</h4>
                    <span>
                      {formatCurrency(orderTracking?.subTotal, selectedCountry)}
                    </span>
                  </div>

                  {orderTracking?.deliveryCharge ? (
                    <div className="cart-total-dil">
                      <h4>Delivery Charges</h4>
                      <span>
                        {formatCurrency(
                          orderTracking?.deliveryCharge,
                          selectedCountry
                        )}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}

                  {orderTracking?.promoDetails?.discount &&
                    orderTracking?.promoDetails?.actionType == 1 ? (
                    <div className="cart-total-dil">
                      <h4>Promocode Discount</h4>
                      <span>
                        {orderTracking?.promoDetails?.discount ?? 0 ?? "-"}%
                      </span>
                    </div>
                  ) : (
                    ""
                  )}

                  {orderTracking?.cashBack && orderTracking?.cashBack ? (
                    <div className="cart-total-dil">
                      <h4>Cashback</h4>
                      <span>{orderTracking?.cashBack ?? 0 ?? "-"}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="cart-total-dil">
                    <h4>Subtotal</h4>
                    <span>
                      {formatCurrency(
                        parseInt(orderTracking?.subTotal) +
                          parseInt(orderTracking?.deliveryCharge ?? 0),
                        selectedCountry
                      )}
                    </span>
                  </div>
                </div>
                <div className="main-total-cart">
                  <h2>Total</h2>
                  <span>
                    {formatCurrency(orderTracking?.total, selectedCountry)}
                  </span>
                </div>

                {orderTracking?.promoDetails?.actionType == 1 &&
                  orderTracking?.promoDetails?.maxDiscountAmount ? (
                  <h6 className="text-secondary m-3">
                    <b>Note: </b>You received a maximum discount of{" "}
                    {formatCurrency("", selectedCountry)}
                    {orderTracking?.promoDetails?.maxDiscountAmount} on this
                    purchase.
                  </h6>
                ) : (
                  ""
                )}
                <h6 className="text-secondary m-3">
                  Payment Mode :{" "}
                  {orderTracking?.walletAmount &&
                    orderTracking?.paymentType == 1
                    ? "Wallet and " + paymentStatus(orderTracking?.paymentType)
                    : orderTracking?.walletAmount &&
                      orderTracking?.paymentType !== 1
                      ? "Wallet"
                      : paymentStatus(orderTracking?.paymentType)}
                  {orderTracking?.walletAmount ? (
                    <p>
                      Wallet amount used :&nbsp;
                      {orderTracking?.walletAmount !== 0
                        ? formatCurrency("", selectedCountry) + " "+
                          orderTracking?.walletAmount
                        : ""}
                    </p>
                  ) : (
                    ""
                  )}
                </h6>

                {orderTracking?.promoDetails?.actionType == 2 &&
                  orderTracking?.promoDetails?.maxDiscountAmount ? (
                  <h6 className="text-secondary m-3">
                    <b>Note: </b>You received cashback of
                    {formatCurrency("", selectedCountry)}
                    {orderTracking?.promoDetails?.maxDiscountAmount} on this
                    purchase.
                  </h6>
                ) : (
                  ""
                )}
              </div>
              <div className="track-order">
                <h4>Track Order</h4>
                {orderTracking?.orderTracking?.length !== 0 ? (
                  <div className="tracking-box">
                    <ul>
                      {orderTracking?.orderTracking?.map((data) => {
                        return (
                          <li key={data?._id}>
                            <div>
                              {" "}
                              <h6>{moment(data?.date).format("lll")} </h6>
                              <p> {DeliveryStatusType(data?.stateId)}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : (
                  ""
                )}
                {/* here button for cancle */}
                {/* <div className="d-flex justify-content-end mt-5">
                  {(orderTracking?.deliveryStatus ===
                    constant?.ORDER_PENDING_STATUS ||
                    orderTracking?.deliveryStatus ===
                    constant?.ORDER_SHIPPED_STATUS ||
                    orderTracking?.deliveryStatus ===
                    constant?.ORDER_CANCELED_STATUS) && (
                      <Button
                        className="btn btn-danger btn-sm ms-2 m-3"
                        title="Cancel"
                        onClick={handleRefund}
                        disabled={
                          orderTracking?.deliveryStatus ===
                          constant?.ORDER_CANCELED_STATUS
                        } // Disable if Canceled
                      >
                        Cancel
                      </Button>
                    )}
                </div> */}

                <div className="d-flex justify-content-end mt-5">
                  {(orderTracking?.deliveryStatus ===
                    constant?.ORDER_PENDING_STATUS &&
                    orderTracking?.orderType !== 3) ||
                    (orderTracking?.deliveryStatus ===
                      constant?.ORDER_READY_STATUS &&
                      orderTracking?.orderType !== 3) ||
                    (orderTracking?.deliveryStatus ===
                      constant?.ORDER_SHIPPE_STATUS &&
                      orderTracking?.orderType !== 3) ? (
                    <Button
                      className="btn btn-danger btn-sm ms-2 m-3"
                      title="Cancel"
                      onClick={() => {
                        // if (orderTracking?.paymentType == 2) {
                        // setShowModal(false);
                        handleRefund();
                        // }
                        // setShowModal(true);
                      }}
                      disabled={
                        orderTracking?.deliveryStatus ===
                        constant?.ORDER_CANCELED_STATUS
                      } // Disable if Canceled
                    >
                      Cancel
                    </Button>
                  ) : (
                    ""
                  )}
                  {/* {orderTracking?.paymentType == 2 ? (
                    ""
                  ) : (
                    // <RefundModal
                    //   show={showModal}
                    //   handleClose={handleClose}
                    //   handleRefund={handleRefund}
                    //   selectedOption={selectedOption}
                    //   setSelectedOption={setSelectedOption}
                    // />
                  )} */}
                </div>

                {orderTracking?.trackingLink ? (
                  <div className="d-flex justify-content-end m-4">
                    <Link href={orderTracking?.trackingLink} target="_blank">
                      <span className="text-secondary">
                        Track your order here :{" "}
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
                      </span>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {orderTracking?.refundDetails?.stateId == 7 ? (
                <div className="alert-offer">
                  <div className="address fw-bold">
                    <i className="uil uil-location" />
                    Your refund request has been approved.Amount will be
                    credited as soon as possible to your selected payment
                    method.
                  </div>
                </div>
              ) : (
                ""
              )}

              {orderTracking?.paymentDetails?.isRefund == true &&
                orderTracking?.refundDetails ? (
                <div className="alert-offer">
                  <div className="address">
                    Refund Date :{" "}
                    {moment(orderTracking?.refundDetails?.updatedAt).format(
                      "lll"
                    )}
                  </div>
                  <div className="address">
                    Refund Amount : {formatCurrency("", selectedCountry)}{" "}
                    {orderTracking?.refundDetails?.amount}{" "}
                  </div>

                  <div className="address">
                    Refund Mode :{" "}
                    {orderTracking?.refundDetails?.paymentReturnType == 1
                      ? "Wallet"
                      : "Account"}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="pdpt-bg h-100">
                <div className="reward-body-dtt text-left pb-4 bt-2">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Order Id </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>{orderTracking?.orderId}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Order Date</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>
                          {moment(orderTracking?.createdAt).format("lll")}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Order Type</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>
                          {orderTypeStatus(orderTracking?.orderType)}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Company Name</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>
                          {orderTracking?.companyDetails?.company?.company}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {orderTracking?.orderType == 1 ? (
                    <>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <p>Delivery Address</p>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <strong>
                              {orderTracking?.addressesDetails?.area}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <p>Receiver Name</p>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <strong>
                              {orderTracking?.addressesDetails?.name}
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <p>Receiver Mobile Number</p>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <strong>
                              {orderTracking?.addressesDetails?.mobile}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {orderTracking?.branchDetails ? (
                        <>
                          <div className="row mb-2">
                            <div className="col-md-6">
                              <p>Branch Name</p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>
                                  {orderTracking?.branchDetails?.branchName}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="col-md-6">
                              <p>Branch Address</p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>
                                  {orderTracking?.branchDetails?.area}
                                </strong>
                              </p>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="col-md-6">
                              <p>Branch Whattsapp No.</p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>
                                  {
                                    orderTracking?.branchDetails
                                      ?.deliveryWhatsUpNo
                                  }
                                </strong>
                              </p>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-md-6">
                              <p>Branch E-mail address</p>
                            </div>
                            <div className="col-md-6">
                              <p>
                                <strong>
                                  {orderTracking?.branchDetails?.deliveryEmail}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      {/* <div className="row mb-2">
                        <div className="col-md-6">
                          <p>Pickup Timing</p>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <strong>
                              {moment(
                                orderTracking?.scheduleorder?.startDate
                              ).format("llll")}{" "}
                              {"-"}{" "}
                              {moment(
                                orderTracking?.scheduleorder?.endDate
                              ).format("llll")}
                            </strong>
                          </p>
                        </div>
                      </div> */}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12 ">
              <div className="pdpt-bg h-100">
                <div className="reward-body-dtt text-left pb-4 bt-2">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Customer Name </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>{orderTracking?.userDetails?.fullName}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Customer Phone Number</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>
                          {orderTracking?.userDetails?.countryCode +
                            " " +
                            orderTracking?.userDetails?.mobile}
                        </strong>
                      </p>
                    </div>
                  </div>
                  {orderTracking?.userDetails?.address ? (
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <p>Customer Address</p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>{orderTracking?.userDetails?.address}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Customer E-mail</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>{orderTracking?.userDetails?.email}</strong>
                      </p>
                    </div>
                  </div>

                  {/* <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Ship Company</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>-</strong>
                      </p>
                    </div>
                  </div> */}
                  {orderTracking?.branchDetails?.area ? (
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <p>Branch Address</p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>{orderTracking?.branchDetails?.area}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* 
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Ship Delivery Company</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>-</strong>
                      </p>
                    </div>
                  </div> */}
                  <div className="row mb-2">
                    {/* <div className="col-md-6">
                      <p>Delivery By</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>-</strong>
                      </p>
                    </div> */}
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <p>Delivered Date</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>
                          {" "}
                          {orderTracking?.orderTracking
                            ? orderTracking?.orderTracking
                              ?.filter((tracking) => tracking.stateId === 9)
                              .map(
                                (tracking) =>
                                  moment(tracking.date).format("lll") ?? "-"
                              ) ?? "-"
                            : "-"}
                        </strong>
                      </p>
                    </div>
                  </div>
                  {orderTracking?.deliveryStatus !== 9 ? (
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <p>Expected Delivery Date</p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          {orderTracking?.scheduleorder?.startDate ? (
                            <strong>
                              {moment(
                                orderTracking?.scheduleorder?.startDate
                              ).format("lll")}{" "}
                              -{" "}
                              {moment(
                                orderTracking?.scheduleorder?.endDate
                              ).format("lll")}
                            </strong>
                          ) : (
                            "As soon as possible"
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-list mt-5">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sn.</th>

                    <th>Item Name</th>
                    <th>Qty.</th>
                    <th>Product Code</th>

                    <th>MRP</th>
                    <th>Product discount</th>

                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderTracking?.products?.map((data, index) => {
                    return (
                      <tr key={data?._id}>
                        <td>{index + 1}</td>

                        <td>
                          {checkLanguage(
                            data?.productName,
                            data?.productArabicName
                          )}{" "}
                          {data?.size ?? "-"}{" "}
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: data?.color ?? "-",
                              display: "inline-block",
                            }}
                          ></span>
                        </td>
                        <td>{data?.quantity}</td>
                        <td>{formatCurrency(data?.mrp, selectedCountry)}</td>
                        <td>{data?.discount ?? 0}% </td>

                        <td>
                          {formatCurrency(
                            orderTracking?.total,
                            selectedCountry
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {allQuestions?.length !== 0 ? (
            <div className="questions m-3">
              <h4>Additional Questions</h4>

              <Accordion>
                {allQuestions?.map((data, index) => {
                  return (
                    <Accordion.Item key={index} eventKey={index + 1}>
                      <Accordion.Header>{data?.questionId}</Accordion.Header>
                      <Accordion.Body>{data?.answerId}</Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </div>
          ) : (
            ""
          )}
        </Container>
      </section>
      <Footer />
    </div>
  );
}
