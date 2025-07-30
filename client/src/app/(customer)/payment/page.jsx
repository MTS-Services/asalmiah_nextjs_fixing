"use client";
import CartPriceDetails from "@/app/components/CartPriceDetails";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { ShimmerTitle } from "react-shimmer-effects";
import useDetails from "../../../../hooks/useDetails";
import {
  GET_USERS_CARD_LIST,
  GET_USERS_DASHBOARD_COUNT,
} from "../../../../services/APIServices";
import { constant } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import Header from "../../../../utils/Header";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Breadcrums from "../../components/Breadcrums";
import "../cart/page.scss";

const Payment = () => {
  const [paymentType, setPaymentType] = useState(1);

  let detail = useDetails();
  useEffect(() => {
    localStorage.setItem("paymentType", paymentType);
  }, []);
  const {
    data: allCardList,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["card-all-list"],
    queryFn: async () => {
      const resp = await GET_USERS_CARD_LIST();
      return resp?.data?.data ?? [];
    },
  });
  const { data: usersDashboardCount } = useQuery({
    queryKey: ["dashboard-count-user"],
    queryFn: async () => {
      const resp = await GET_USERS_DASHBOARD_COUNT();

      return resp?.data?.data ?? [];
    },
  });

  let language = localStorage.getItem("language");
  const Home = trans("home");
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}
      <Breadcrums
        firstLink={Home}
        secondLink={"Payment Confirm"}
        language={language}
      />

      <section className="cart-main checkout">
        <Container>
          <div className="title-box d-flex justify-content-between mb-4">
            <h2>Payment Options</h2>
          </div>
          <Row>
            <Col lg={8}>
              <div className="payment-section">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Select Card</Accordion.Header>
                    <Accordion.Body>
                      <div className="row g-3 filter-row">
                        <div className="col-sm-6 col-md-12 col-lg-6">
                          <div
                            className="filter-col radio-box"
                          // onClick={handleSubmit}
                          >
                            <input
                              className="radio-input"
                              type="radio"
                              name="paymentType"
                              id="onlinePayment"
                              value="1"
                              checked={paymentType == "1"}
                              onChange={(e) => {
                                setPaymentType(e.target.value);
                                localStorage.setItem(
                                  "paymentType",
                                  e.target.value
                                );

                                localStorage.removeItem("paymentCardId");
                              }}
                            />
                            <label
                              className="radio-label content-color w-100"
                              htmlFor="onlinePayment"
                            >
                              <span className="font-md w-100 text-dark">
                                Pay with new card
                              </span>
                            </label>
                          </div>
                        </div>

                        {isPending ? Array.from({ length: 2 }, (_, index) => (
                          <div
                            className="col-sm-6 col-md-12 col-lg-6"
                            key={index}
                          >     <div className="filter-col radio-box"> <ShimmerTitle line={2} gap={10} variant="secondary" /></div> </div>
                        )) : ""}
                        {allCardList?.length !== 0
                          ? allCardList?.map((data) => {
                            return (
                              <div
                                className="col-sm-6 col-md-12 col-lg-6"
                                key={data?.id}
                              >
                                <div className="filter-col radio-box">
                                  <input
                                    className="radio-input"
                                    type="radio"
                                    name="paymentType"
                                    id={data?.id}
                                    value={data?.id}
                                    checked={paymentType == data?.id}
                                    onChange={(e) => {
                                      setPaymentType(e.target.value);
                                      localStorage.setItem("paymentType", 1);
                                      localStorage.setItem(
                                        "paymentCardId",
                                        data?.id
                                      );
                                    }}
                                  />
                                  <label
                                    className="radio-label content-color w-100"
                                    htmlFor={data?.id}
                                  >
                                    <span className="font-md w-100">
                                      XXXX XXXX XXXX {data?.last_four}
                                    </span>

                                    <span>
                                      {data?.exp_month}/{data?.exp_year}
                                    </span>
                                  </label>
                                  <span className="font-md w-100 m-4">
                                    {data?.brand}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                          : ""}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Col>
            <Col lg={4}>
              <CartPriceDetails />
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  );
};
export default Payment;
