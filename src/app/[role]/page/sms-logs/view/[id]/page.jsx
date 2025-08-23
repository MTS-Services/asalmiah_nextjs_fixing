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
import { Col, Row, Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  adminGetSingleSMS
} from "../../../../../../../services/APIServices";
import { getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const ErrorLogsSingleView = async ({ params }) => {
  const toggleVal = useSlider();
  const { id } = params;
  let detail = useDetails()
  const [smsDetails, setsmsDetails] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const response = await adminGetSingleSMS(id);
        if (response?.status === 200) {
          setsmsDetails(response?.data?.data);
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
              <Link href={getLinkHref(detail?.roleId, `/page`)}
                className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
             
                href={getLinkHref(detail?.roleId, `/page/sms-logs`)}

                className="text-capitalize text-black"
              >
                SMS Logs
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">SMS View</li>
          </ul>
        </div>
        <Row>
          <Col>
            <div className="card-body">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">SMS View</h5>
                <Link     href={getLinkHref(detail?.roleId, `/page/sms-logs`)} className="btn_theme">
                  Back
                </Link>
              </div>

              <div className="custom-card">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th>To</th>
                          <td>
                            <b>{smsDetails?.to}</b>
                          </td>
                        </tr>
                        <tr>
                          <th>From</th>
                          <td>
                            <b>{smsDetails?.from}</b>
                          </td>
                        </tr>
                        <tr>
                          <th>Message</th>
                          <td>{smsDetails?.message}</td>
                        </tr>

                        <tr>
                          <th>Created On</th>
                          <td>
                            {moment(smsDetails?.createdAt).format("LLL")}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ErrorLogsSingleView;
