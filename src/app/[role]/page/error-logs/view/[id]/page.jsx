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
import { adminGetSingleError } from "../../../../../../../services/APIServices";
import { ERROR_TYPE_STATUS } from "../../../../../../../utils/helper";

const ErrorLogsSingleView = async ({ params }) => {
  const toggleVal = useSlider();
  const { id } = params;
  const [errorDetails, setErrorDetails] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const response = await adminGetSingleError(id);
        if (response?.status === 200) {
          setErrorDetails(response?.data?.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncateDescription = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text?.substring(0, maxLength) + "...";
    }
    return text;
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
                href="/admin/page/error-logs"
                className="text-capitalize text-black"
              >
                Error Logs
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Error View</li>
          </ul>
        </div>
        <Row>
          <Col>
            <div className="card-body">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Error View</h5>
                <Link href={`/admin/page/error-logs`} className="btn_theme">
                  Back
                </Link>
              </div>

              <div className="custom-card">
                <Row>
                  <Col xl={12}>
                    <Table responsive bordered>
                      <tbody>
                        <tr>
                          <th> Error ID</th>
                          <td>
                            <b>{errorDetails?._id}</b>
                          </td>
                        </tr>
                        <tr>
                          <th>Error Ip</th>
                          <td>{errorDetails?.ip}</td>
                        </tr>
                        <tr>
                          <th>Error code</th>
                          <td>{errorDetails?.errorCode}</td>
                        </tr>
                        <tr>
                          <th>Error Name</th>
                          <td>{errorDetails?.errorName}</td>
                        </tr>
                        <tr>
                          <th>Error Type</th>
                          <td>{ERROR_TYPE_STATUS(errorDetails?.error_type)}</td>
                        </tr>
                        <tr>
                          <th>User Agent</th>
                          <td>{errorDetails?.userAgent}</td>
                        </tr>
                        <tr>
                          <th>Header Accept</th>
                          <td>{errorDetails?.headers?.accept}</td>
                        </tr>
                        <tr>
                          <th>Host</th>
                          <td>{errorDetails?.headers?.host}</td>
                        </tr>
                        {errorDetails?.description?.length > 200 ? (
                          <tr>
                            <th>Error Description</th>
                            <td>
                              {" "}
                              {showFullDescription
                                ? errorDetails?.description
                                : truncateDescription(
                                    errorDetails?.description,
                                    200
                                  )}
                              <button
                                onClick={toggleDescription}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#da2a2c",
                                  cursor: "pointer",
                                }}
                              >
                                {showFullDescription
                                  ? " Read Less"
                                  : " Read More"}
                              </button>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <th>Error Description</th>
                            <td>{errorDetails?.description ?? "-"}</td>
                          </tr>
                        )}

                        <tr>
                          <th>Created On</th>
                          <td>
                            {moment(errorDetails?.createdAt).format("LLL")}
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
