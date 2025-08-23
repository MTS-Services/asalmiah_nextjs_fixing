"use client";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Col, Container, Row, Table } from "react-bootstrap";
import useDetails from "../../../../../hooks/useDetails";
import { GET_USER_ORDER_DETAILS } from "../../../../../services/APIServices";
import { constant } from "../../../../../utils/constants";
import Footer from "../../../../../utils/Footer";
import Header from "../../../../../utils/Header";
import { checkLanguage, DeliveryStatusType } from "../../../../../utils/helper";
import UserLogInHeader from "../../../../../utils/UserLogInHeader";
import Breadcrums from "../../../components/Breadcrums";
import "../../cart/page.scss";

const Tracking = () => {
  let detail = useDetails();
  let { id } = useParams();
  let router = useRouter();
  const { data: orderTracking } = useQuery({
    queryKey: ["order-tracking-user", id],
    queryFn: async () => {
      const resp = await GET_USER_ORDER_DETAILS(id);
      return resp?.data?.data ?? [];
    },
  });
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}{" "}
      <Breadcrums firstLink={"Home"} secondLink={"Order Tracking"} />
      <section className="order-tracking">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="order-table">
                <div className="table-responsive">
                  <Table className="border-0">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Order Date </th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1.</td>
                        <td>
                          {moment(orderTracking?.createdAt).format("lll")}
                        </td>
                        <td>{orderTracking?.addressesDetails?.area}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
            <section className="fetures pt-0">
              <Container>
                <Row>
                  {orderTracking?.products?.map((data) => {
                    return (
                      <Col lg={3} md={6} className="mb-3 m-3" key={data?._id}>
                        <div
                          className="featurecard p-0"
                          onClick={() => {
                            router.push(`/product-detail/${data?.items}`);
                          }}
                        >
                          <div className="imgfeature">
                            <Image
                              src={data?.productImg?.at(0)?.url}
                              height={100}
                              width={100}
                              alt="product-img"
                            />
                          </div>
                          <div className="feature-content pb-0  p-3 ">
                            <div className="d-flex justify-content-between">
                              <h4>
                                {checkLanguage(
                                  data?.productName,
                                  data?.productArabicName
                                )}
                              </h4>
                            </div>
                            <div className="d-flex justify-content-between">
                              <p className="mb-0">
                                <svg
                                  width="25"
                                  height="25"
                                  viewBox="0 0 25 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="12.5"
                                    cy="12.5"
                                    r="12.5"
                                    fill="#DA2A2C"
                                  />
                                  <path
                                    d="M12.1619 5.40527L13.8306 10.541H19.2306L14.8619 13.715L16.5306 18.8507L12.1619 15.6766L7.79325 18.8507L9.46194 13.715L5.09326 10.541H10.4932L12.1619 5.40527Z"
                                    fill="white"
                                  />
                                </svg>
                                &nbsp;4.2
                              </p>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Container>
            </section>
            {orderTracking?.orderTracking?.length !== 0 ? (
              <Col lg={12}>
                <section className="tracking-box mt-5">
                  <div className="sidebar-title">
                    <h4 className="fw-bold">Order Progress/Status</h4>
                  </div>
                  <div className="tracking-timeline">
                    <h4 className="mb-0">Timeline</h4>
                  </div>
                  <ul>
                    {orderTracking?.orderTracking?.map((data) => {
                      return (
                        <li key={data?._id}>
                          <div>
                            {" "}
                            <h6>{data?.date} </h6>
                            <p> {DeliveryStatusType(data?.stateId)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};
export default Tracking;
