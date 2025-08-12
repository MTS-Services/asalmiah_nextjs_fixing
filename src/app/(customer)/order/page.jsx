"use client";
import NoDataFound from "@/app/components/no-data-found/page";
import { Pagination } from "@/app/components/Pagination";
import UserSidebar from "@/app/components/UserSidebar";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { GET_USER_ORDER_LIST } from "../../../../services/APIServices";
import { Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import {
  checkLanguage,
  DeliveryStatusType,
  formatCurrency,
  restrictAlpha,
} from "../../../../utils/helper";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Breadcrums from "../../components/Breadcrums";
import "../dashboard/page.scss";
import { trans } from "../../../../utils/trans";
import useCountryState from "../../../../hooks/useCountryState";

const Order = () => {
  let router = useRouter();
  const selectedCountry = useCountryState();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const { data: orderListUser, refetch } = useQuery({
    queryKey: ["order-list-user", page],
    queryFn: async () => {
      const resp = await GET_USER_ORDER_LIST(page, search);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  let language = localStorage.getItem("language");
  const Home = trans("home");

  return (
    <>
      <div>
        <UserLogInHeader refetchAPI={refetch}/>
        <div>
          <Breadcrums
            firstLink={Home}
            secondLink={"Order"}
            language={language}
          />
        </div>
        <section>
          <Container>
            <Row>
              <Col lg={12}></Col>
            </Row>
            <Row>
              <Col lg={3}>
                <UserSidebar />
              </Col>

              <Col lg={9} className="mt-lg-0 mt-4">
                <div className="dashboard-right-box">
                  <div className="notification-tab">
                    <div className="sidebar-title mb-4">
                      <h4>My order</h4>
                    </div>

                    <div className="form-group position-relative selectform mb-0 d-flex justify-content-end">
                      <Form.Control
                        type="text"
                        value={search}
                        placeholder="Search with order id"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key == "Enter" && refetch()}
                        onKeyUp={(e) => e.target.value == "" && refetch()}
                        onKeyPress={restrictAlpha}
                        className="order-search"
                      />
                    </div>
                    {orderListUser?.length !== 0 ? (
                      orderListUser?.map((data) => {
                        return (
                          <div className="order-box m-2">
                            <div className="order-container">
                              <div className="order-icon">
                                <i className="iconsax" data-icon="box">
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="#DA2A2C"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.9991 13.3008C11.8691 13.3008 11.7391 13.2708 11.6191 13.2008L2.78911 8.09083C2.43911 7.88083 2.30911 7.42083 2.51911 7.06083C2.72911 6.70083 3.18911 6.58083 3.54911 6.79083L11.9991 11.6808L20.3991 6.82083C20.7591 6.61083 21.2191 6.74083 21.4291 7.09083C21.6391 7.45083 21.5091 7.91083 21.1591 8.12083L12.3891 13.2008C12.2591 13.2608 12.1291 13.3008 11.9991 13.3008Z"
                                      fill="#DA2A2C"
                                    ></path>
                                    <path
                                      d="M12 22.3591C11.59 22.3591 11.25 22.0191 11.25 21.6091V12.5391C11.25 12.1291 11.59 11.7891 12 11.7891C12.41 11.7891 12.75 12.1291 12.75 12.5391V21.6091C12.75 22.0191 12.41 22.3591 12 22.3591Z"
                                      fill="#DA2A2C"
                                    ></path>
                                    <path
                                      d="M12.0006 22.75C11.1206 22.75 10.2506 22.56 9.56063 22.18L4.22062 19.21C2.77062 18.41 1.64062 16.48 1.64062 14.82V9.17C1.64062 7.51 2.77062 5.59 4.22062 4.78L9.56063 1.82C10.9306 1.06 13.0706 1.06 14.4406 1.82L19.7806 4.79C21.2306 5.59 22.3606 7.52 22.3606 9.18V14.83C22.3606 16.49 21.2306 18.41 19.7806 19.22L14.4406 22.18C13.7506 22.56 12.8806 22.75 12.0006 22.75ZM12.0006 2.75C11.3706 2.75 10.7506 2.88 10.2906 3.13L4.95062 6.1C3.99062 6.63 3.14063 8.07 3.14063 9.17V14.82C3.14063 15.92 3.99062 17.36 4.95062 17.9L10.2906 20.87C11.2006 21.38 12.8006 21.38 13.7106 20.87L19.0506 17.9C20.0106 17.36 20.8606 15.93 20.8606 14.82V9.17C20.8606 8.07 20.0106 6.63 19.0506 6.09L13.7106 3.12C13.2506 2.88 12.6306 2.75 12.0006 2.75Z"
                                      fill="#DA2A2C"
                                    ></path>
                                  </svg>
                                </i>
                                <div className="couplet">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="#fff"
                                    className="bi bi-check"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="order-detail">
                                <h5 className="mb-0">
                                  {DeliveryStatusType(data?.deliveryStatus)}
                                </h5>
                                <p className="mb-0">
                                  {moment(data?.createdAt).format("lll")}
                                </p>
                              </div>
                            </div>
                            <div className="product-order-detail mt-4">
                              <div className="product-box d-flex align-items-center gap-3 flex-md-nowrap flex-wrap">
                                <Link href={`/order-details/${data?._id}`}>
                                  {data?.products[0]?.productImg
                                    ?.slice(0, 1)
                                    ?.map((img) => {
                                      return img?.type ? (
                                        img?.type?.includes("image") ? (
                                          <Image
                                            src={img?.url}
                                            height={200}
                                            width={300}
                                            alt="image"
                                          />
                                        ) : (
                                          <video
                                            height={200}
                                            width={300}
                                            src={img?.url}
                                          />
                                        )
                                      ) : (
                                        <Image
                                          src={img?.url}
                                          height={200}
                                          width={300}
                                          alt="image"
                                        />
                                      );
                                    })}
                                </Link>
                                <div
                                  className="order-wrap w-100"
                                  onClick={() =>
                                    router.push(`/order-details/${data?._id}`)
                                  }
                                >
                                  <div className="d-flex align-items-center justify-content-between w-100">
                                    <h5 className="text-capitalize mb-0">
                                      {}
                                      {checkLanguage(
                                        data?.productDetails[0]?.productName,
                                        data?.productDetails[0]
                                          ?.productArabicName
                                      )}
                                    </h5>
                                  </div>
                                  <ul>
                                    <li>
                                      {" "}
                                      <p>Company name : </p>
                                      <span>
                                        {data?.companyDetails?.company?.company}
                                      </span>
                                    </li>
                                    {data?.branchDetails ? (
                                      <li>
                                        {" "}
                                        <p>Branch name : </p>
                                        <span>
                                          {data?.branchDetails?.branchName}
                                        </span>
                                      </li>
                                    ) : (
                                      ""
                                    )}

                                    <li>
                                      {" "}
                                      <p>SubTotal : </p>
                                      <span className="notranslate">
                                        {formatCurrency(
                                          data?.subTotal,
                                          selectedCountry
                                        )}
                                      </span>
                                    </li>
                                    <li>
                                      {" "}
                                      <p>Total Price: </p>
                                      <span className="notranslate">
                                        {formatCurrency(
                                          data?.total,
                                          selectedCountry
                                        )}
                                      </span>
                                    </li>
                                    <li>
                                      {" "}
                                      <p>Order Id :</p>
                                      <span>{data?.orderId}</span>
                                    </li>
                                  
                                  </ul>
                                </div>
                              </div>
                              {data?.trackingLink ? (
                                <div className="d-flex justify-content-end">
                                  <Link
                                    href={data?.trackingLink}
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
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <NoDataFound />
                    )}
                  </div>
                  {Math.ceil(meta?.totalCount / 10) > 1 && (
                    <Pagination
                      totalCount={meta?.totalCount}
                      handelPageChange={(e) => setPage(e.selected + 1)}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
};
export default Order;
