"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button, Col, Form, Nav, Row, Tab, Table } from "react-bootstrap";
import { useMutation, useQuery } from "@tanstack/react-query";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Swal from "sweetalert2";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  DEFAULT_IMAGE_ADMIN_PRODUCT,
  GET_REVIEW_API,
  PRODUCT_DETAILS_ADMIN,
  STATE_UPDATE_PRODUCT_API,
} from "../../../../../../../services/APIServices";
import "../../../../../../../styles/globals.scss";
import { constant, Paginations } from "../../../../../../../utils/constants";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "../page.scss";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useRouter } from "next/navigation";
import {
  checkLanguage,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  ROLE_STATUS,
} from "../../../../../../../utils/helper";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { RxCross2 } from "react-icons/rx";
import moment from "moment";
import { DynamicStar } from "react-dynamic-star";
import Image from "next/image";
import { CiClock2 } from "react-icons/ci";
import { Pagination } from "@/app/components/Pagination";
import { FaCheck } from "react-icons/fa6";
import useDetails from "../../../../../../../hooks/useDetails";

const ProductDetail = ({ params }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { id } = params;
  let detail = useDetails()
  const toggleVal = useSlider();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const { data: productDetails, refetch } = useQuery({
    queryKey: ["product-detail", { id }],
    queryFn: async () => {
      const res = await PRODUCT_DETAILS_ADMIN(id);
      return res?.data?.data ?? "";
    },
  });
  // review
  const { data: review } = useQuery({
    queryKey: ["review-detail", page, id],
    queryFn: async () => {
      const res = await GET_REVIEW_API(page, id);
      setMeta(res?.data?._meta);

      return res?.data?.data ?? "";
    },
  });

  const handelStatus = (state) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update the status !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText:
        state == constant?.ACTIVE ? "Yes,Active it !" : "Yes, Inactive it !",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(state);
      }
    });
  };
  const { mutate } = useMutation({
    mutationFn: (state) => STATE_UPDATE_PRODUCT_API(id, state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const { mutate: defaultImage } = useMutation({
    mutationFn: (body) => DEFAULT_IMAGE_ADMIN_PRODUCT(id, body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  let router = useRouter();

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [lightboxImage, setLightboxImage] = useState(null);

  const handleImageClick = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };

  const videoRefs = useRef([]);

  const handleSlideChange = (swiper) => {
    // Pause all videos
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });

    // Play the current video
    const currentVideo = videoRefs.current[swiper.activeIndex];
    if (currentVideo) {
      currentVideo.pause();
    }
  };
  return (
    <>
      {" "}
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-top gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link

                href={getLinkHref(detail?.roleId, '/page/product-management')}
                className="text-capitalize text-black"
              >
                Product management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Product details</li>
          </ul>
        </div>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap mb-5">
            <h4 className="mb-0">Product Details</h4>
            <Link
              href={"#"}
              onClick={() => {
                router.back();
              }}
              className="btn_theme"
            >
              Back
            </Link>
          </div>
          <div className="list-main p-3">
            <Row>
              <Col lg={4}>
                <div className="adm-product-slider">
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
                    onSlideChange={handleSlideChange}
                  >
                    {productDetails?.productImg?.map((data, index) => {
                      return (
                        <SwiperSlide key={data?._id}>
                          <div>
                            <Form.Check
                              className="float-end d-inline-block custom-checkbox"
                              type="checkbox"
                              id={data._id}
                              checked={
                                productDetails?.productImg[0]?._id == data?._id
                              }
                              onChange={() => {
                                let body = {
                                  id: data?._id,
                                };
                                defaultImage(body);
                              }}
                            />
                            {data?.type ? (
                              data?.type?.includes("image") ? (
                                <img
                                  src={data?.url}
                                  onClick={() => handleImageClick(data)}
                                />
                              ) : (
                                <video
                                  ref={(el) => (videoRefs.current[index] = el)}
                                  width="100%"
                                  height="100%"
                                  controls
                                  src={data.url}
                                // onClick={() => handleImageClick(data)}
                                />
                              )
                            ) : (
                              <img
                                src={data?.url}
                                onClick={() => handleImageClick(data)}
                              />
                            )}
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper"
                  >
                    {productDetails?.productImg?.map((data) => {
                      return (
                        <SwiperSlide key={data?._id}>
                          {data?.type?.includes("image") ? (
                            <img src={data?.url} />
                          ) : (
                            <video width="100%" height="100%" src={data.url} />
                          )}
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </Col>
              <Col lg={8}>
                <div className="product-detail mt-lg-0 mt-4">
                  <a href="#">
                    <h2 className="fw-bold mb-4 text-black">
                      {checkLanguage(
                        productDetails?.productName,
                        productDetails?.productArabicName
                      )}
                    </h2>
                  </a>
                  <p className="justify-content-start">
                    {formatCurrency(
                      productDetails?.price
                        ? productDetails?.price
                        : productDetails?.size
                          ? productDetails?.size?.at(0)?.price
                          : productDetails?.mrp,
                      productDetails?.companyDetails?.country
                    )}

                    {productDetails?.discount ? (
                      <span>{productDetails?.discount}% off</span>
                    ) : (
                      ""
                    )}
                  </p>
                  <div className="product-description-main pb-3">
                    <Row>
                      <Col lg={12}>
                        <div className="product-description">
                          <div className="mt-2 mb-4">
                            <h4 class="mb-2 dis-title">Description</h4>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: checkLanguage(
                                  productDetails?.description,
                                  productDetails?.arabicDescription
                                ),
                              }}
                            ></p>
                          </div>

                          <div className="specification">
                            <h4 class="mb-2 dis-title">Specification</h4>
                            <div className="mt-2 table-responsive">
                              <Table striped>
                                <tbody>
                                  <tr>
                                    <th>Product Name</th>
                                    <td>
                                      {" "}
                                      {checkLanguage(
                                        productDetails?.productName,
                                        productDetails?.productArabicName
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>Sort Order No.</th>
                                    <td>{productDetails?.order}</td>
                                  </tr>
                                  {productDetails?.price ? (
                                    <tr>
                                      <th>
                                        Price (
                                        {formatCurrency(
                                          "",
                                          productDetails?.companyDetails
                                            ?.country
                                        )}
                                        )
                                      </th>
                                      <td>{productDetails?.price}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  <tr>
                                    <th>Can be Delivered?</th>
                                    <td>
                                      {productDetails?.isDelivered
                                        ? "Yes"
                                        : "No"}
                                    </td>
                                  </tr>

                                  {productDetails?.mrpPrice ? (
                                    <tr>
                                      <th>MRP ({formatCurrency(
                                        "",
                                        productDetails?.companyDetails
                                          ?.country
                                      )})</th>
                                      <td>{productDetails?.mrpPrice}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  {productDetails?.size ? (
                                    <tr>
                                      <th>Size Options</th>
                                      <td>
                                        {productDetails?.size.map(
                                          (size, index) => (
                                            <span key={size.id || index}>
                                              Size - {size.sizes}
                                              <br />
                                              MRP: {size.mrp}
                                              <br />
                                              Price: {size.price}
                                              <br />
                                              Discount: {size.discount}
                                              <br />
                                              <br />
                                            </span>
                                          )
                                        )}
                                      </td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  <tr>
                                    <th>Delivery Cost ({formatCurrency(
                                      "",
                                      productDetails?.companyDetails
                                        ?.country
                                    )})</th>
                                    <td>{productDetails?.deliveryCost}</td>
                                  </tr>
                                  {productDetails?.discount ? (
                                    <tr>
                                      <th>Discount(%)</th>
                                      <td>{productDetails?.discount}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}

                                  <tr>
                                    <th>Product Classification</th>
                                    <td>
                                      {productDetails?.classification?.name}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>Company Name</th>
                                    <td>
                                      {productDetails?.companyDetails?.company}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th>Weight(KG)</th>
                                    <td>{productDetails?.weight}</td>
                                  </tr>
                                  <tr>
                                    <th>Quantity</th>
                                    <td>{productDetails?.quantity}</td>
                                  </tr>
                                  <tr>
                                    <th>Made In</th>
                                    <td>{productDetails?.madeIn}</td>
                                  </tr>

                                  <tr>
                                    <th>Product Code</th>
                                    <td>{productDetails?.productCode}</td>
                                  </tr>
                                  {productDetails?.warranty ? (
                                    <tr>
                                      <th>Warranty (Years)</th>
                                      <td>{productDetails?.warranty}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  {productDetails?.material ? (
                                    <tr>
                                      <th>Material</th>
                                      <td>{productDetails?.material}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  {productDetails?.serialCode ? (
                                    <tr>
                                      <th>Serial Code</th>
                                      <td>{productDetails?.serialCode}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  {productDetails?.model ? (
                                    <tr>
                                      <th>Model</th>
                                      <td>{productDetails?.model}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  {productDetails?.modelNumber ? (
                                    <tr>
                                      <th>ModelNumber</th>
                                      <td>{productDetails?.modelNumber}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                  {productDetails?.prepareTime ? (
                                    <tr>
                                      <th>PrepareTime</th>
                                      <td>{productDetails?.prepareTime}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}

                                  {productDetails?.address ? (
                                    <tr>
                                      <th>Location</th>
                                      <td>{productDetails?.address}</td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}

                                  {detail?.roleId == constant.ADMIN ? <tr>
                                    <td>
                                      <b>Created By</b>
                                    </td>
                                    <td><Link href={"#"} onClick={(e) => {
                                      e.preventDefault()
                                      if (productDetails?.createdBy?.roleId !== constant.ADMIN) {

                                        router.push(getLinkHrefRouteSingleView(detail?.roleId, productDetails?.createdBy?._id, ROLE_STATUS(productDetails?.createdBy?.roleId)))

                                      } else {
                                        router.push(getLinkHref(detail?.roleId, "/page/profile"))
                                      }
                                    }}> {productDetails?.createdBy?.fullName ?? "-"} </Link></td>
                                  </tr> : ""}

                                  {detail?.roleId == constant.ADMIN ? <tr>
                                    <td>
                                      <b>Created On</b>
                                    </td>
                                    <td>{moment(productDetails?.createdAt).format("LLL") ?? "-"}</td>
                                  </tr> : ""}

                                  {detail?.roleId == constant.ADMIN ? <tr>
                                    <td>
                                      <b>Updated By</b>
                                    </td>
                                    <td><Link href={"#"} onClick={(e) => {
                                      e.preventDefault()
                                      if (productDetails?.updatedBy?.roleId !== constant.ADMIN) {
                                        router.push(getLinkHrefRouteSingleView(detail?.roleId, productDetails?.updatedBy?._id, ROLE_STATUS(productDetails?.updatedBy?.roleId)))

                                      } else {
                                        router.push(getLinkHref(detail?.roleId, "/page/profile"))

                                      }
                                    }}> {productDetails?.updatedBy?.fullName ?? "-"} </Link></td>
                                  </tr> : ""}

                                  {detail?.roleId == constant.ADMIN ? <tr>
                                    <td>
                                      <b>Updated On</b>
                                    </td>
                                    <td>{moment(productDetails?.updatedAt).format("LLL") ?? "-"}</td>
                                  </tr> : ""}

                                </tbody>
                              </Table>
                            </div>
                          </div>

                          {/* <div className="d-flex float-end p-3 product-view-status">
                            <Button
                              title={
                                productDetails?.stateId === constant?.ACTIVE
                                  ? "In-Active"
                                  : "Active"
                              }
                              onClick={() =>
                                handelStatus(
                                  productDetails?.stateId === constant?.ACTIVE
                                    ? constant?.INACTIVE
                                    : constant?.ACTIVE
                                )
                              }
                              className={
                                productDetails?.stateId === constant?.ACTIVE
                                  ? "btn-danger  btn-sm ms-2"
                                  : "btn-success  btn-sm ms-2"
                              }
                            >
                              {productDetails?.stateId === constant?.ACTIVE
                                ? "In-Active"
                                : "Active"}
                            </Button>
                          </div> */}
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 
              <div className="size-box border-top pt-4">
                <h6 className="text-capitalize fw-bold">size:</h6>
                <ul className="selected d-flex align-items-center gap-3 mb-4">
                  <li>
                    <a href="#" className="active">
                      s
                    </a>
                  </li>
                  <li className="">
                    <a href="#">m</a>
                  </li>
                  <li className="">
                    <a href="#">l</a>
                  </li>
                  <li>
                    <a href="#">xl</a>
                  </li>
                </ul>
              </div>
              <div className="color-box border-top pt-4">
                <h6 className="text-capitalize fw-bold">color:</h6>
                <ul className="color-variant d-flex align-items-center gap-3 mb-4">
                  <li className="bg-color-brown"></li>
                  <li className="bg-color-chocolate"></li>
                  <li className="bg-color-coffee"></li>
                  <li className="bg-color-black"></li>
                </ul>
              </div> */}
                </div>
              </Col>
            </Row>
            <div className="reviews-section mt-4">
              <h4 className="mb-3">Customer Reviews</h4>
              {review && review.length > 0 ? (
                review.map((comment, index) => (
                  // <div key={rev._id} className="review-card border p-3 mb-3">
                  //   <Row className="align-items-center">
                  //     <Col lg={10}>
                  //       <div className="rating  justify-content-start">
                  //         <div className="user-img">
                  //           <img
                  //             src={
                  //               rev?.userDetails?.profileImg
                  //                 ? rev?.userDetails?.profileImg
                  //                 : "/assets/img/default.png"
                  //             }
                  //             alt="User "
                  //           />
                  //         </div>
                  //         <span className="yellow-star">
                  //           {"★".repeat(rev.rating)}
                  //         </span>
                  //         <span className="empty-star">
                  //           {"☆".repeat(5 - rev.rating)}
                  //         </span>
                  //       </div>
                  //       <p className="mt-2  justify-content-start">
                  //         {rev.review}
                  //       </p>

                  //       <small className="text-muted   justify-content-start">
                  //         {new Date(rev.createdAt).toLocaleDateString()}
                  //       </small>
                  //     </Col>
                  //     <Col lg={2}>
                  //       <div className="adm-product-slider slidecustom">
                  //         <Swiper
                  //           style={{
                  //             "--swiper-navigation-color": "#fff",
                  //             "--swiper-pagination-color": "#fff",
                  //           }}
                  //           spaceBetween={10}
                  //           navigation={true}
                  //           thumbs={{ swiper: thumbsSwiper }}
                  //           modules={[FreeMode, Navigation, Thumbs]}
                  //           className="mySwiper2"
                  //         >
                  //           {rev.reviewImg?.map((data) => {
                  //             return (
                  //               <SwiperSlide key={data?._id}>
                  //                 <img
                  //                   src={data?.url}
                  //                   onClick={() =>
                  //                     window.open(
                  //                       data?.url,
                  //                       "_blank",
                  //                       "width=800,height=600"
                  //                     )
                  //                   }
                  //                 />
                  //               </SwiperSlide>
                  //             );
                  //           })}
                  //         </Swiper>
                  //         {/* <Swiper
                  //           onSwiper={setThumbsSwiper}
                  //           spaceBetween={10}
                  //           slidesPerView={4}
                  //           freeMode={true}
                  //           watchSlidesProgress={true}
                  //           modules={[FreeMode, Navigation, Thumbs]}
                  //           className="mySwiper"
                  //         >
                  //           {rev.reviewImg?.map((data) => {
                  //             return (
                  //               <SwiperSlide key={data?._id}>
                  //                 <img
                  //                   src={data?.url}
                  //                   onClick={() =>
                  //                     window.open(
                  //                       data?.url,
                  //                       "_blank",
                  //                       "width=800,height=600"
                  //                     )
                  //                   }
                  //                 />
                  //               </SwiperSlide>
                  //             );
                  //           })}
                  //         </Swiper> */}
                  //       </div>
                  //     </Col>
                  //   </Row>
                  // </div>
                  <ul>
                    <li key={index}>
                      <div className="comment-items d-flex align-items-start gap-2 flex-lg-nowrap flex-wrap">
                        <div className="user-img">
                          <img
                            src={
                              comment?.userDetails?.profileImg
                                ? comment?.userDetails?.profileImg
                                : "/assets/img/default.png"
                            }
                            alt="User "
                          />
                        </div>
                        <div className="user-content flex-grow-1">
                          <div className="user-info">
                            <div className="d-flex justify-content-between gap-3">
                              <h6>{comment.userDetails?.fullName}</h6>
                              <div className="text-end">
                                <span>
                                  <i className="iconsax me-2" data-icon="clock">
                                    {/* SVG Icon Code */}
                                    <CiClock2 />
                                  </i>
                                  {moment(comment.createdAt).format("lll")}
                                </span>
                              </div>
                            </div>
                            <ul className="rating d-flex align-items-center gap-2 justify-content-start">
                              <DynamicStar
                                rating={comment?.rating}
                                height={18}
                                width={18}
                                outlined
                              />
                            </ul>
                            <p>{comment.review}</p>
                            {comment?.reviewImg?.map((data) => {
                              return (
                                <Image
                                  src={data?.url}
                                  onClick={() =>
                                    window.open(
                                      data?.url,
                                      "_blank",
                                      "width=800,height=600"
                                    )
                                  }
                                  alt="review-img"
                                  className="preview-img"
                                  height={100}
                                  width={100}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                ))
              ) : (
                <p>No reviews available for this product.</p>
              )}

              {Math.ceil(meta?.totalCount / 10) > 1 && (
                <Pagination
                  totalCount={meta?.totalCount}
                  handelPageChange={(e) => setPage(e.selected + 1)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {lightboxOpen && (
        <div className={`lightbox-container ${lightboxOpen ? "show" : ""}`}>
          <div className="lightbox-content">
            {lightboxImage && (
              <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                wheel={{ step: 0.6 }}
              >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <React.Fragment>
                    <TransformComponent>
                      {lightboxImage?.type ? (
                        lightboxImage?.type?.includes("image") ? (
                          <img
                            className="lightbox-image"
                            src={lightboxImage?.url}
                            alt="image"
                          />
                        ) : (
                          <video
                            className="lightbox-video"
                            src={lightboxImage?.url}
                            controls
                          />
                        )
                      ) : (
                        <img
                          className="lightbox-image"
                          src={lightboxImage?.url}
                          alt="image"
                        />
                      )}
                    </TransformComponent>
                    <div className="lightbox-controls">
                      <button
                        className="lightbox-close"
                        onClick={() => setLightboxOpen(false)}
                      >
                        <RxCross2 />
                      </button>

                      {lightboxImage?.type ? (
                        lightboxImage?.type?.includes("image") ? (
                          <div className="bottom-btns">
                            <button
                              className="zoom-button"
                              onClick={() => zoomIn(0.1)}
                            >
                              +
                            </button>
                            <button
                              className="zoom-button"
                              onClick={() => zoomOut(0.1)}
                            >
                              -
                            </button>
                            <button
                              className="reset-button"
                              onClick={() => {
                                if (
                                  rest?.scale !== 1 ||
                                  rest?.positionX !== 0 ||
                                  rest?.positionY !== 0
                                ) {
                                  resetTransform();
                                }
                              }}
                            >
                              Reset
                            </button>
                          </div>
                        ) : (
                          ""
                        )
                      ) : (
                        <div className="bottom-btns">
                          <button
                            className="zoom-button"
                            onClick={() => zoomIn(0.1)}
                          >
                            +
                          </button>
                          <button
                            className="zoom-button"
                            onClick={() => zoomOut(0.1)}
                          >
                            -
                          </button>
                          <button
                            className="reset-button"
                            onClick={() => {
                              if (
                                rest?.scale !== 1 ||
                                rest?.positionX !== 0 ||
                                rest?.positionY !== 0
                              ) {
                                resetTransform();
                              }
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </TransformWrapper>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
