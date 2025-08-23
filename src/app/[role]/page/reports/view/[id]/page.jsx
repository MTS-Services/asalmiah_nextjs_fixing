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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  CANCLE_ORDER_API,
  GET_ORDER_DETAIL,
  STATE_UPDATE_ORDER_API,
} from "../../../../../../../services/APIServices";
// Import Swiper styles
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import moment from "moment";
import { useState } from "react";
import {
  CheckAdminDeliveryStatus,
  DeliveryStatusType,
  formatCurrency,
  getLinkHref,
  getOrderDeliveryStatus,
  paymentStatus,
} from "../../../../../../../utils/helper";
import { Button, Card } from "react-bootstrap";
import { constant } from "../../../../../../../utils/constants";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import useCountryState from "../../../../../../../hooks/useCountryState";
import { userDetails } from "../../../../../../../redux/features/userSlice";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const selectedCountry = useCountryState();

  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["order-detail", { id }],
    queryFn: async () => {
      const res = await GET_ORDER_DETAIL(id);
      return res?.data?.data;
    },
  });
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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

  const handleCancel = () => {
    const body = {
      deliveryStatus: constant?.ORDER_CANCELED_STATUS,
    };
    cancleMutation.mutate(body);
  };

  let detail = userDetails()
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

                href={getLinkHref(detail?.roleId, `/page/reports`)}
                className="text-capitalize text-black"
              >
                Order Report
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
                  href={getLinkHref(detail?.roleId, "/page/reports")}
                  className="btn_theme btn-sm"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Row>
                  <Col className="picked-img mb-2" lg={6}>
                    <Swiper
                      style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                      }}
                      spaceBetween={10}
                      navigation={true}
                      thumbs={{ swiper: thumbsSwiper }}
                      modules={[FreeMode, Navigation, Thumbs]}
                      className="mySwiper2"
                    >
                      {companyView &&
                        companyView?.products
                          ?.flatMap((item) => item?.productImg)
                          ?.slice(0, 1)
                          .map((image, imageIndex) => {
                            return (
                              <SwiperSlide key={image?._id}>
                                <img
                                  src={image?.url}
                                  className="preview-img d-inline-block mr-2"
                                />
                              </SwiperSlide>
                            );
                          })}
                    </Swiper>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-nowrap">
                            <b>Title</b>
                          </td>
                          <td>
                            {companyView?.products?.map((item, index) => (
                              <span key={index}>{item.productName}</span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>OrderId</b>
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
                            <b>Size</b>
                          </td>
                          <td>
                            {companyView?.products?.map((item, index) => (
                              <span key={index}>{item.size}</span>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Quantity</b>
                          </td>
                          <td>
                            {companyView?.products?.map((item, index) => (
                              <span key={index}>{item.quantity}</span>
                            ))}
                          </td>
                        </tr>
                        {companyView?.products?.length > 0 ? (
                          <tr>
                            <td className="text-nowrap">
                              <b>Color</b>
                            </td>
                            <td>
                              {companyView?.products?.map((item, index) => (
                                <span key={index}>{item.color}</span>
                              ))}
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td className="text-nowrap">
                              <b>Color</b>
                            </td>
                            <td>No colors available</td>
                          </tr>
                        )}
                        <tr>
                          <td className="text-nowrap">
                            <b>Created On </b>
                          </td>
                          <td>
                            {moment(companyView?.createdAt).format("LLL")}
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
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-nowrap">
                            <b>Fullname</b>
                          </td>
                          <td>{companyView?.addressesDetails?.name}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Address</b>
                          </td>
                          <td>{companyView?.addressesDetails?.area}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Email</b>
                          </td>
                          <td>{companyView?.addressesDetails?.email}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Phone number</b>
                          </td>
                          <td>{companyView?.addressesDetails?.mobile}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>DeliveryCharge({formatCurrency("", selectedCountry)})</b>
                          </td>
                          <td>{companyView?.deliveryCharge}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Sub Total({formatCurrency("", selectedCountry)})</b>
                          </td>
                          <td>{companyView?.subTotal}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Total({formatCurrency("", selectedCountry)})</b>
                          </td>
                          <td>{companyView?.total}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">
                            <b>Payment Mode</b>
                          </td>
                          <td>{paymentStatus(companyView?.paymentType)}</td>
                        </tr>
                      </tbody>
                    </table>
                    {/* track order */}
                    <Card className="track-order">
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
                                    updateMutation.mutate(
                                      constant?.ORDER_READY_STATUS
                                    )
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
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
