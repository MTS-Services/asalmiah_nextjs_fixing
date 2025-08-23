"use client";
import { Pagination } from "@/app/components/Pagination";
import UserSidebar from "@/app/components/UserSidebar";
import NoDataFound from "@/app/components/no-data-found/page";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { GET_NOTIFICATION_LIST_USERS } from "../../../../services/APIServices";
import Footer from "../../../../utils/Footer";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import { Paginations } from "../../../../utils/constants";
import { trans } from "../../../../utils/trans";
import Breadcrums from "../../components/Breadcrums";
import "../dashboard/page.scss";

const Notification = () => {
  let router = useRouter();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [expandedStates, setExpandedStates] = useState({});

  const toggleReadMore = (id) => {
    setExpandedStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };
  const { data: allNotificationUsers, refetch } = useQuery({
    queryKey: ["notification-all-list", page],
    queryFn: async () => {
      const resp = await GET_NOTIFICATION_LIST_USERS(page);

      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });
  
  
  let language = localStorage.getItem("language");
  const Home = trans('home');
   
  return (
    <>
      <div>
        <UserLogInHeader />
        <div>
          <Breadcrums firstLink={Home} secondLink={"Notification"}
           language={language}
          />
        </div>
        <section>
          <Container>
            <Row>
              <Col lg={3}>
                <UserSidebar />
              </Col>
              <Col lg={9} className="mt-lg-0 mt-4">
                <div className="dashboard-right-box">
                  <div className="notification-tab">
                    <div className="sidebar-title">
                      <h4>Notifications</h4>
                    </div>
                    <ul className="notification-body">
                      {allNotificationUsers?.length !== 0 ? (
                        allNotificationUsers?.map((data) => {
                          const isExpanded = expandedStates[data?._id];
                          return (
                            <li key={data?._id}>
                              <div className="d-flex align-items-top justify-content-end justify-content-lg-between flex-wrap">
                                <div className="user-img w-lg-75 w-md-100">
                                  <h6
                                    className="mb-0"
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
                                  >
                                    {data?.title}
                                  </h6>
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

                                <div className="user-contant w-lg-25 w-md-100">
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
                        })
                      ) : (
                        <NoDataFound />
                      )}
                    </ul>
                    {Math.ceil(meta?.totalCount / 10) > 1 && (
                      <Pagination
                        totalCount={meta?.totalCount}
                        handelPageChange={(e) => setPage(e.selected + 1)}
                      />
                    )}
                  </div>
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
export default Notification;
