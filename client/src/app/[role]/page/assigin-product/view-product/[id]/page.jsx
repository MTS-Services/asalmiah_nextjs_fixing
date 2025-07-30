"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Button, Col, Nav, Row, Tab, Table } from "react-bootstrap";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Swal from "sweetalert2";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  PRODUCT_DETAILS_ADMIN,
  STATE_UPDATE_PRODUCT_API,
} from "../../../../../../../services/APIServices";
import "../../../../../../../styles/globals.scss";
import { constant } from "../../../../../../../utils/constants";
import { toastAlert } from "../../../../../../../utils/SweetAlert";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "../page.scss";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { checkLanguage, formatCurrency, getLinkHref } from "../../../../../../../utils/helper";
import useCountryState from "../../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../../hooks/useDetails";

const ProductDetail = ({ params }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const selectedCountry = useCountryState();

  const { id } = params;
  const toggleVal = useSlider();
  const { data: productDetails, refetch } = useQuery({
    queryKey: ["product-detail", { id }],
    queryFn: async () => {
      const res = await PRODUCT_DETAILS_ADMIN(id);
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
  let detail = useDetails()
  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap mb-5">
          <h4 className="mb-0"> Product Details</h4>
          <Link href={getLinkHref(detail?.roleId, "/page/product-management")} className="btn_theme">
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
                >
                  {productDetails?.productImg?.map((data) => {
                    return (
                      <SwiperSlide key={data?._id}>
                        <img src={data?.url} />
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
                        <img src={data?.url} />
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
                  {formatCurrency("", selectedCountry)}
                  {productDetails?.price
                    ? productDetails?.price
                    : productDetails?.size
                      ? productDetails?.size?.at(0)?.price
                      : productDetails?.mrp}
                  {productDetails?.discount ? (
                    <span>{productDetails?.discount}% off</span>
                  ) : (
                    ""
                  )}
                </p>
                <div className="product-description-main p-3">
                  <Row>
                    <Col lg={12}>
                      <div className="product-description">
                        <Tab.Container
                          id="left-tabs-example"
                          defaultActiveKey="first"
                        >
                          <Nav variant="pills" className="flex-row mb-3">
                            <Nav.Item>
                              <Nav.Link eventKey="first">description</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="second">
                                specification
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content>
                            <Tab.Pane eventKey="first">
                              <div className="mt-4">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: checkLanguage(
                                      productDetails?.description,
                                      productDetails?.arabicDescription
                                    ),
                                  }}
                                ></p>
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <div className="specification">
                                <div className="mt-4 table-responsive">
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
                                        <th>Price ({formatCurrency("", selectedCountry)})</th>
                                        <td>{productDetails?.price}</td>
                                      </tr>
                                      <tr>
                                        <th>MRP ({formatCurrency("", selectedCountry)})</th>
                                        <td>{productDetails?.mrpPrice}</td>
                                      </tr>
                                      <tr>
                                        <th>Delivery Cost ({formatCurrency("", selectedCountry)})</th>
                                        <td>{productDetails?.deliveryCost}</td>
                                      </tr>
                                      <tr>
                                        <th>Discount(%)</th>
                                        <td>{productDetails?.discount}</td>
                                      </tr>
                                      <tr>
                                        <th>Product Category</th>
                                        <td>
                                          {
                                            productDetails?.categoryDetails
                                              ?.category
                                          }
                                        </td>
                                      </tr>
                                      <tr>
                                        <th>Product Subcategory</th>
                                        <td>
                                          {
                                            productDetails?.subCategoryDetails
                                              ?.subcategory
                                          }
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
                                      {/* <tr>
                                <th>Brand</th>
                                <td>{productDetails?.brand}</td>
                              </tr> */}
                                      <tr>
                                        <th>Product Code</th>
                                        <td>{productDetails?.productCode}</td>
                                      </tr>
                                      {productDetails?.warranty ? (
                                        <tr>
                                          <th>Warranty(Years) </th>
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
                                                  <br />
                                                </span>
                                              )
                                            )}
                                          </td>
                                        </tr>
                                      ) : (
                                        ""
                                      )}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>

                        <div className="d-flex float-end p-3">
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
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
