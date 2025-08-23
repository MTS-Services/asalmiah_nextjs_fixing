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
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { singleEmailView } from "../../../../../../../services/APIServices";
import { constant } from "../../../../../../../utils/constants";
import { EMAIL_QUEUE_STATE } from "../../../../../../../utils/helper";
import styles from "./page.module.scss";

const EmailQueueView = async ({ params }) => {
  const toggleVal = useSlider();

  const { id } = params;
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await singleEmailView(id);
        if (response?.status === 200) {
          setDetail(response?.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const statusId = (statusId) => {
    switch (statusId) {
      case constant?.READ:
        return "Read";
      case constant?.UNREAD:
        return "Un-read";
      default:
        return;
    }
  };

  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href="/admin/page" className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href="/admin/page/email-queue"
                className="text-capitalize text-black"
              >
                E-mail Queue
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Email Queue View</li>
          </ul>
        </div>
        <Row>
          <Col>
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-md-0">Email Queue View</h4>
                <Link href={`/admin/page/email-queue/`} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <div className={`detail-content ${styles.custom_margin}`}>
                  <Row>
                    <Col lg={6} className="pe-lg-4">
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>ID:</h5>
                        <h6 className={`${styles.value}`}>{detail?._id}</h6>
                      </div>
                      <hr />
                    </Col>
                    <Col md={6} className="ps-md-4">
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Subject:</h5>
                        <h6 className={`${styles.value}`}>{detail?.subject}</h6>
                      </div>
                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>From:</h5>
                        <h6 className={`${styles.value}`}>{detail?.from}</h6>
                      </div>

                      <hr />
                    </Col>
                    <Col md={6} className="ps-md-4">
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>To:</h5>
                        <h6 className={`${styles.value}`}>{detail?.to}</h6>
                      </div>

                      <hr />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Status:</h5>
                        <h6 className={`${styles.value}`}>
                          {EMAIL_QUEUE_STATE(detail?.stateId)}
                        </h6>
                      </div>
                      <hr />
                    </Col>
                    <Col md={6} className="ps-md-4">
                      <div className="d-flex flex-wrap justify-content-between">
                        <h5>Created:</h5>
                        <h6 className={`${styles.value}`}>
                          {moment(detail?.createdAt).format("LLL")}
                        </h6>
                      </div>

                      <hr />
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={9} lg={12} className="mx-auto">
                      <div className={`${styles.email_wrap}`}>
                        <div
                          className={`${styles.email}`}
                          dangerouslySetInnerHTML={{
                            __html: detail?.description,
                          }}
                        ></div>
                      </div>
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

export default EmailQueueView;
