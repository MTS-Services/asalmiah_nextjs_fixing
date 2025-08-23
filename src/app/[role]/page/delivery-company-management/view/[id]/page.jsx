/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useCountryState from "../../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../../hooks/useDetails";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_DELIVERY_COMPANY_DETAIL } from "../../../../../../../services/APIServices";
import { formatCurrency, getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS } from "../../../../../../../utils/helper";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const selectedCountry = useCountryState();
  let detail = useDetails();
  let navigate = useRouter()
  const { id } = useParams();
  const { data: deliveryCompanyView, isFetching } = useQuery({
    queryKey: ["delivery-company-detail", { id }],
    queryFn: async () => {
      const res = await GET_DELIVERY_COMPANY_DETAIL(id);
      return res?.data?.data;
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link
                href={getLinkHref(detail?.roleId, `/page`)} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link


                href={getLinkHref(detail?.roleId, `/page/delivery-company-management`)}
                className="text-capitalize text-black"
              >
                Delivery Company management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Delivery Company Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0"> Delivery Company Details</h5>
                <Link

                  href={getLinkHref(detail?.roleId, `/page/delivery-company-management`)}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <div className="text-center">
                  {deliveryCompanyView?.logo ? (
                    <div className="uploaded-image m-1 mb-3">
                      <Image
                        src={`${deliveryCompanyView?.logo}`}
                        alt="Image"
                        layout="fill"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <Row>
                  <Col md={6}>
                    <Table bordered>
                      <tr>
                        <td><b>Company Name</b></td>
                        <td>{deliveryCompanyView?.company}</td>
                      </tr>

                      <tr>
                        <td><b>Arabic Company Name</b></td>
                        <td>{deliveryCompanyView?.arabicCompany}</td>
                      </tr>
                      <tr>
                        <td><b>Country</b></td>
                        <td>{deliveryCompanyView?.country}</td>
                      </tr>
                      <tr>
                        <td><b>Email</b></td>
                        <td>{deliveryCompanyView?.email}</td>
                      </tr>
                      <tr>
                        <td><b>Company Code</b></td>
                        <td>{deliveryCompanyView?.companyCode}</td>
                      </tr>

                      <tr>
                        <td><b>Phone Number</b></td>
                        <td>{String(deliveryCompanyView?.mobile)}</td>
                      </tr>

                      <tr>
                        <td><b>Registration</b></td>
                        <td>{deliveryCompanyView?.registration}</td>
                      </tr>
                      <tr>
                        <td><b>Start Time</b></td>
                        <td>{deliveryCompanyView?.startTime}</td>
                      </tr>
                      <tr>
                        <td><b>End Time</b></td>
                        <td>{deliveryCompanyView?.endTime}</td>
                      </tr>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table bordered>

                      <tr>
                        <td><b>Address</b></td>
                        <td>{deliveryCompanyView?.address}</td>
                      </tr>

                      <tr>
                        <td><b>Contact Person Name</b></td>
                        <td>{deliveryCompanyView?.contactPersonName}</td>
                      </tr>

                      <tr>
                        <td><b>Contact Person Phone Number</b></td>
                        <td>{String(
                          deliveryCompanyView?.contactPersonMobile
                        )}</td>
                      </tr>

                      <tr>
                        <td><b>Delivery Cost Offarat ({formatCurrency("", selectedCountry)})</b></td>
                        <td>{deliveryCompanyView?.costDeliveryOffrat}</td>
                      </tr>

                      <tr>
                        <td><b>Delivery Cost Customer ({formatCurrency("", selectedCountry)})</b></td>
                        <td>{deliveryCompanyView?.costDeliveryCustomer}</td>
                      </tr>

                      <tr>
                        <td><b>Active</b></td>
                        <td>{deliveryCompanyView?.active == false ? "False" : "True"}</td>
                      </tr>
                      <tr>
                        <td><b>Default</b></td>
                        <td>{deliveryCompanyView?.default == false ? "False" : "True"}</td>
                      </tr>
                      <tr>
                        <td><b>Description</b></td>
                        <td>{deliveryCompanyView?.description}</td>
                      </tr>
                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (deliveryCompanyView?.createdBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, deliveryCompanyView?.createdBy?._id, ROLE_STATUS(deliveryCompanyView?.createdBy?.roleId)))

                          } else {
                            navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                          }
                        }}> {deliveryCompanyView?.createdBy?.fullName ?? "-"} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created On</b>
                        </td>
                        <td>{moment(deliveryCompanyView?.createdAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (deliveryCompanyView?.updatedBy?.roleId !== constant.ADMIN) {

                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, deliveryCompanyView?.updatedBy?._id, ROLE_STATUS(deliveryCompanyView?.updatedBy?.roleId)))
                          } else {
                            navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                          }
                        }}> {deliveryCompanyView?.updatedBy?.fullName ?? "-"} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated On</b>
                        </td>
                        <td>{moment(deliveryCompanyView?.updatedAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}
                    </Table>

                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
