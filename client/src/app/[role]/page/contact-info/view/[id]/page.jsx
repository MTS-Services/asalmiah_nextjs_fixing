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
import {
  GET_COMPANY_DETAIL,
  GET_CONTACT_INFO_DETAILS,
} from "../../../../../../../services/APIServices";
import { getLinkHref, stateId } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const detail = useDetails();
  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["contactinfo-detail", { id }],
    queryFn: async () => {
      const res = await GET_CONTACT_INFO_DETAILS(id);
      return res?.data?.data;
    },
  });

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
                href={getLinkHref(detail?.roleId, "/page/contact-info")}
                className="text-capitalize text-black"
              >
                Contact-Info
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Contact-Info Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Contact-Info Details</h5>
                <Link href={getLinkHref(detail?.roleId, "/page/contact-info")} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form>
                  <Row>
                    <Col lg={6}>
                      <div className="d-flex algn-items-center">
                        <Form.Group className="mb-4 w-100">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            name="Categroy"
                            type="text"
                            value={companyView?.email}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="d-flex algn-items-center ">
                        <Form.Group className="mb-4 w-100">
                          <Form.Label>Mobile</Form.Label>
                          <Form.Control
                            name="pickupService"
                            type="text"
                            value={
                              companyView?.countryCode + companyView?.mobile
                            }
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </Col>
                    {companyView?.fbLink && (
                      <Col lg={6}>
                        <div className="d-flex algn-items-center ">
                          <Form.Group className="mb-4 w-100">
                            <Form.Label>Facebook URL :</Form.Label>
                            <a
                              href={companyView?.fbLink}
                              target="_blank"
                              className="mx-2"
                            >
                              {companyView?.fbLink ?? ""}
                            </a>
                          </Form.Group>
                        </div>
                      </Col>
                    )}
                    {companyView?.linkedinLink && (
                      <Col lg={6}>
                        <div className="d-flex algn-items-center ">
                          <Form.Group className="mb-4 w-100">
                            <Form.Label>Linkedin URL :</Form.Label>
                            <a
                              href={companyView?.linkedinLink}
                              target="_blank"
                              className="mx-2"
                            >
                              {companyView?.linkedinLink ?? ""}
                            </a>
                          </Form.Group>
                        </div>
                      </Col>
                    )}
                    {companyView?.snapChatLink && (
                      <Col lg={6}>
                        <div className="d-flex algn-items-center ">
                          <Form.Group className="mb-4 w-100">
                            <Form.Label>Snapchat URL :</Form.Label>
                            <a
                              href={companyView?.snapChatLink}
                              target="_blank"
                              className="mx-2"
                            >
                              {companyView?.snapChatLink ?? ""}
                            </a>
                          </Form.Group>
                        </div>
                      </Col>
                    )}
                    {companyView?.instaLink && (
                      <Col lg={6}>
                        <div className="d-flex algn-items-center ">
                          <Form.Group className="mb-4 w-100">
                            <Form.Label>Instagram URL :</Form.Label>
                            <a
                              href={companyView?.instaLink}
                              target="_blank"
                              className="mx-2"
                            >
                              {companyView?.instaLink ?? ""}
                            </a>
                          </Form.Group>
                        </div>
                      </Col>
                    )}
                  </Row>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
