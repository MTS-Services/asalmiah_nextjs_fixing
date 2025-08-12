/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { VIEW_CONTACT_US_API } from "../../../../../../../services/APIServices";
import { getLinkHref, stateId } from "../../../../../../../utils/helper";
import moment from "moment";
import { Container, Table } from "react-bootstrap";
import { useState } from "react";
import useDetails from "../../../../../../../hooks/useDetails";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const detail = useDetails();
  const { id } = useParams();
  const { data: contactusView } = useQuery({
    queryKey: ["contactus-detail", { id }],
    queryFn: async () => {
      const res = await VIEW_CONTACT_US_API(id);
      return res?.data?.data;
    },
  });
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
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
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
                href={getLinkHref(detail?.roleId, "/page/contact-us")}
                className="text-capitalize text-black"
              >
                Contact Us
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Contact Us Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Contact Us Details</h5>
                <Link href={getLinkHref(detail?.roleId, "/page/contact-us")} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <section className="inner-wrap p-0">
                  <Container fluid className="px-0">
                    <div className="custom-card">
                      <Row>
                        <Col xl={12}>
                          <Table responsive bordered>
                            <tbody>
                              <tr>
                                <th>Fullname</th>
                                <td>
                                  {contactusView?.firstName +
                                    " " +
                                    contactusView?.lastName}
                                </td>
                              </tr>
                              <tr>
                                <th>Email</th>
                                <td>{contactusView?.email}</td>
                              </tr>

                              <tr>
                                <th>Message</th>
                                <td>
                                  {contactusView?.description.length > 100 ? (
                                    <>
                                      {showFullDescription
                                        ? contactusView?.description
                                        : truncateDescription(
                                          contactusView?.description,
                                          100
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
                                    </>
                                  ) : (
                                    contactusView?.description
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Created On </th>
                                <td>
                                  {moment(contactusView?.createdAt).format(
                                    "LLL"
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </div>
                  </Container>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
