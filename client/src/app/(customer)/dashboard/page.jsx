"use client";

import UserSidebar from "@/app/components/UserSidebar";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GrMoney } from "react-icons/gr";
import {
  GET_NOTIFICATION_LIST_USERS,
  GET_USERS_DASHBOARD_COUNT,
} from "../../../../services/APIServices";
import Footer from "../../../../utils/Footer";
import { FORMAT_NUMBER, formatCurrency } from "../../../../utils/helper";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Breadcrums from "../../components/Breadcrums";
import "./page.scss";
import useCountryState from "../../../../hooks/useCountryState";

const Dashboard = () => {
  let router = useRouter();
  const [expandedStates, setExpandedStates] = useState({});
  const selectedCountry = useCountryState();
  const toggleReadMore = (id) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };
  const { data: allNotificationUsers, refetch } = useQuery({
    queryKey: ["notification-all-list"],
    queryFn: async () => {
      const resp = await GET_NOTIFICATION_LIST_USERS();
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
      <div>
        <UserLogInHeader refetchAPI={refetch} />
        <div>
          <Breadcrums
            firstLink={Home}
            secondLink={"Dashboard"}
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
              <Col lg={9}>
                <div className="dashboard-right-box mt-lg-0 mt-4">
                  <div className="sidebar-title mb-4">
                    <h4>dashboard</h4>
                  </div>
                  <Row>
                    <Col lg={4}>
                      <div className="card mb-3">
                        <div className="card-body d-flex align-items-center gap-2 justify-content-between">
                          <div className="card-img">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-wallet2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                            </svg>
                          </div>
                          <div
                            className="card-txt"
                            onClick={() => {
                              router.push(`/wallet`);
                            }}
                          >
                            <h6>Balance</h6>
                            <h4 className="notranslate">
                              {formatCurrency(
                                usersDashboardCount?.walletAmount,
                                selectedCountry
                              )}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="card mb-3">
                        <div className="card-body d-flex align-items-center gap-2 justify-content-between">
                          <div className="card-img">
                            <GrMoney />
                          </div>
                          <div className="card-txt">
                            <h6>Earned Points</h6>
                            <h4>
                              {FORMAT_NUMBER(usersDashboardCount?.points)}{" "}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="card mb-3">
                        <div className="card-body d-flex align-items-center gap-2 justify-content-between">
                          <div className="card-img">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-box-seam"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
                            </svg>
                          </div>
                          <div
                            className="card-txt"
                            onClick={() => {
                              router.push(`/order`);
                            }}
                          >
                            <h6>total orders</h6>
                            <h4>{usersDashboardCount?.totalOrder}</h4>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {allNotificationUsers?.length !== 0 ? (
                    <div className="notification-tab mt-5">
                      <div className="sidebar-title">
                        <h4>Notifications</h4>
                      </div>
                      <ul className="notification-body">
                        {allNotificationUsers?.slice(0, 5)?.map((data) => {
                          const isExpanded = expandedStates[data?._id];
                          return (
                            <li key={data?._id}>
                              <div className="d-flex align-items-top  justify-content-end justify-content-lg-between flex-wrap">
                                <div className="user-img w-75 w-md-100">
                                  <Link
                                    href={"#"}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (data?.orderId) {
                                        router.push(
                                          `/order-details/${data?.orderId}`
                                        );
                                      } else if (data?.company) {
                                        router.push(
                                          `/companies/${data?.company}`
                                        );
                                      }
                                    }}
                                    className="text-dark"
                                  >
                                    <b>{data?.title}</b>
                                  </Link>
                                  <p
                                    className="mb-0"
                                    dangerouslySetInnerHTML={{
                                      __html: isExpanded
                                        ? data?.description
                                        : data?.description?.length > 100
                                        ? `${data?.description.substring(
                                            0,
                                            100
                                          )}...`
                                        : data?.description,
                                    }}
                                  ></p>
                                  <b
                                    className="text-danger"
                                    onClick={() => toggleReadMore(data?._id)}
                                  >
                                    {data?.description?.length > 100
                                      ? isExpanded
                                        ? "Read Less"
                                        : "Read More"
                                      : ""}
                                  </b>
                                </div>

                                <div className="user-contant">
                                  <p className="mb-0">
                                    {moment(data?.createdAt).format("lll")}
                                  </p>
                                </div>
                              </div>
                              <div className="notification-images mt-3">
                                {data?.image?.length !== 0
                                  ? data?.image?.map((data) => {
                                      return (
                                        <div
                                          className="img-noti-card"
                                          onClick={() =>
                                            window.open(
                                              data?.url,
                                              "_blank",
                                              "width=800,height=600"
                                            )
                                          }
                                        >
                                          <Image
                                            src={data?.url} // Ensure you have an image URL in your data
                                            alt={data?.title}
                                            className="rounded-circle"
                                            height={300}
                                            width={200}
                                          />
                                        </div>
                                      );
                                    })
                                  : ""}
                              </div>
                            </li>
                          );
                        })}

                        {allNotificationUsers?.length > 5 ? (
                          <div className="d-flex justify-content-end">
                            <Link
                              href={"/notification"}
                              className="btn btn_theme"
                            >
                              Load More
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
};
export default Dashboard;
