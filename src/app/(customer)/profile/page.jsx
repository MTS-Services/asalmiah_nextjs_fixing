"use client";
import Breadcrums from "@/app/components/Breadcrums";
import UserSidebar from "@/app/components/UserSidebar";
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import useDetails from "../../../../hooks/useDetails";
import userDummyImage from "../../../../public/assets/img/default.png";
import Footer from "../../../../utils/Footer";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import "../dashboard/page.scss";
const Profile = () => {
  let detail = useDetails();

  let language = localStorage.getItem("language");
  const Home = trans('home');
  return (
    <>
      <div>
        <UserLogInHeader />
        <div>
          <Breadcrums firstLink={Home} secondLink={"My Profile"}
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
                      <h4>my profile</h4>
                    </div>
                    <div className="card-detail">
                      <div className="profile-view-img mb-5">
                        <Image
                          src={
                            detail?.profileImg
                              ? detail?.profileImg
                              : userDummyImage
                          }
                          width={150}
                          height={120}
                          alt="profile-img"
                        />
                      </div>
                      <form className="main-profile">
                        <Row>
                        <Col lg={6}>
                            <div className="mb-4">
                              <div className="text-capitalize">User Name</div>
                              <input
                                className="form-control bg-white"
                                value={detail?.userName}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <div className="text-capitalize">First Name</div>
                              <input
                                className="form-control bg-white"
                                value={detail?.firstName}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="text-capitalize">
                                last name
                              </label>
                              <input
                                type="text"
                                className="form-control bg-white"
                                value={detail?.lastName}
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <div className="text-capitalize">
                                Email address
                              </div>
                              <input
                                type="email"
                                className="form-control bg-white"
                                value={detail?.email}
                                disabled
                                dir="ltr"
                                translate="no"
                              />
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-4">
                              <div className="text-capitalize">Phone</div>
                              <input
                                type="text"
                                className="form-control bg-white"
                                value={
                                  detail?.mobile
                                    ? detail?.countryCode + "" + detail?.mobile
                                    : "-"
                                }
                                dir="ltr"
                                translate="no"
                                disabled
                              />
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="mb-4">
                              <div className="text-capitalize">Address</div>
                              <input
                                type="text"
                                className="form-control bg-white"
                                value={detail?.address ?? "-"}
                                disabled
                              />
                            </div>
                          </Col>
                        </Row>
                      </form>
                    </div>
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
export default Profile;
