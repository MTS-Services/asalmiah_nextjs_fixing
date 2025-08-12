/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { adminGetSingleActivity } from "../../../../../../../services/APIServices";
import styles from "./page.module.scss";
import Link from "next/link";
import { getLinkHref } from "../../../../../../../utils/helper";

const ActivityLogsSingleView = async ({ params }) => {
  const toggleVal = useSlider();
  const { id } = params;
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const response = await adminGetSingleActivity(id);
        if (response?.status === 200) {
          setDetail(response?.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
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
                href={getLinkHref(detail?.roleId, "/page/activity-logs")}
                className="text-capitalize text-black"
              >
                Login Activity
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Activity View</li>
          </ul>
        </div>
        <Row>
          <Col>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Error View</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/activity-logs")}
                  className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <div className={`detail-content ${styles.custom_margin}`}>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Id:</h5>
                        <h6 className={`${styles.value}`}>{detail?._id}</h6>
                      </div>
                      <hr />
                    </Col>
                    <Col md={6} className="ps-md-4">
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>IP</h5>
                        <h6 className={`${styles.value}`}>{detail?.userIP}</h6>
                      </div>
                      <hr />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Status:</h5>
                        <h6 className={`${styles.value}`}>
                          {detail?.state == 1 ? "Success" : "Failed"}
                        </h6>
                      </div>
                      <hr />
                    </Col>
                    <Col md={6}>
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Failed Reason:</h5>
                        <h6 className={`${styles.value}`}>
                          {detail?.failedReason ?? "-"}
                        </h6>
                      </div>
                      <hr />
                    </Col>
                    {/* )} */}
                    <Col md={6} className="">
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Created On:</h5>
                        <h6 className={`${styles.value}`}>
                          {moment(detail?.createdAt).format("LLL")}
                        </h6>
                      </div>
                      <hr />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ActivityLogsSingleView;
