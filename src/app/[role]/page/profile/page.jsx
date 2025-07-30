"use client";
import Image from "next/image";
import Link from "next/link";
import { Col, Row } from "react-bootstrap";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import userDummyImage from "../../../../../public/assets/img/default.png";
import styles from "./page.module.scss";
import { getLinkHref } from "../../../../../utils/helper";
const Profile = () => {
  const isSlider = useSlider();
  const userDetail = useDetails();

  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
      <Row>
        <Col>
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">My Profile</h4>
              <Link
                href={getLinkHref(userDetail?.roleId, `/page/profile/edit`)}
                className="btn_theme"
              >
                Edit
              </Link>
            </div>
            <div className="card-body">
              <div>
                <Row className=" px-1 justify-content-center">
                  <Col xl={10} lg={12} md={12}>
                    <div className={`detail-content ${styles.custom_margin}`}>
                      <div
                        className={`topcard position-relative ${styles.top_card}`}
                      >
                        {/* <div className={`${styles.left}`}>
                          <Image
                            height={220}
                            width={150}
                            // fill
                            src="/assets/img/offer1.png"
                            className="offer1"
                          />
                        </div>

                        <div className={`${styles.right}`}>
                          <Image
                            height={220}
                            width={150}
                            // fill
                            src="/assets/img/offer2.png"
                            className="offer2"
                          />
                        </div> */}
                      </div>
                      <Row className="justify-content-start">
                        <Col md={12} className="mt-4">
                          <div className={`${styles.user_profile}`}>
                            <div className={`${styles.profile_wrap}`}>
                              <Image
                                src={
                                  userDetail?.profileImg
                                    ? userDetail?.profileImg
                                    : userDummyImage
                                }
                                alt=""
                                width={200}
                                height={200}
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col md={6} className="mx-auto">
                          <div className="text-center mb-4">
                            <h4>{userDetail?.fullName}</h4>
                          </div>
                          <div className="profile-txt py-5">
                            <h6 className="text-secondary mb-4">
                              <FaEnvelope className="me-2" />{" "}
                              {userDetail?.email}
                            </h6>
                            <h6 className="text-secondary mb-4">
                              <FaPhone className="me-2" />
                              {userDetail?.countryCode} {userDetail?.mobile}
                            </h6>
                            <h6 className="text-secondary mb-4">
                              <MdHome className="me-2 fs-5" />
                              {userDetail?.address}
                            </h6>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
