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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_SPIN_DETAIL } from "../../../../../../../services/APIServices";
import {
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  priorityType,
  PromoCodeStatus,
  ROLE_STATUS,
  SpinType,
} from "../../../../../../../utils/helper";
import moment from "moment";
import Image from "next/image";
import useCountryState from "../../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";

const View = () => {
  const isSlider = useSlider();
  const selectedCountry = useCountryState();
  let navigate = useRouter()
  const detail = useDetails();

  const { id } = useParams();
  const { data: spinView, isFetching } = useQuery({
    queryKey: ["spin-view", { id }],
    queryFn: async () => {
      const res = await GET_SPIN_DETAIL(id);
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
                href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link

                href={getLinkHref(detail?.roleId, '/page/fortune-spin')}
                className="text-capitalize text-black"
              >
                Fortune Spin management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Fortune Spin details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Fortune Spin Details</h5>
                <Link href={getLinkHref(detail?.roleId, '/page/fortune-spin')} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Row>
                  <Col md={6}>
                    <Table className="table-bordered">
                      <tr>
                        <td>
                          <b>Spin Type</b>
                        </td>
                        <td>{SpinType(spinView?.spinType)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Number of use</b>
                        </td>
                        <td>{spinView?.numberOfUse}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Priority</b>
                        </td>
                        <td>{priorityType(spinView?.priority)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>How much percentage</b>
                        </td>
                        <td>{spinView?.value ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Start Date</b>
                        </td>
                        <td>{moment(spinView?.startDate).format("lll")}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>End Date</b>
                        </td>
                        <td>{moment(spinView?.endDate).format("lll")}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Size</b>
                        </td>
                        <td>{spinView?.size ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Min Amount ({formatCurrency("", selectedCountry)})</b>
                        </td>
                        <td>{spinView?.minAmount ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Max Cash Back</b>
                        </td>
                        <td>{spinView?.maxCashBack ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Category</b>
                        </td>
                        <td>{spinView?.category?.category ?? "-"}</td>
                      </tr>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table className="table-bordered">


                      <tr>
                        <td>
                          <b>Excluded Company</b>
                        </td>

                        <td>{spinView?.company?.map((data) => data?.company).join(",") ?? "-"}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Span Message</b>
                        </td>
                        <td>{spinView?.spanMessage ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Detail</b>
                        </td>
                        <td>{spinView?.detail ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Product</b>
                        </td>
                        <td>{spinView?.product?.productName ?? "-"}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Category Image</b>
                        </td>
                        <td>
                          {" "}
                          {spinView?.spinnerImg?.length !== 0 ? (
                            <div className="uploaded-image m-1">
                              <Image
                                src={spinView?.spinnerImg}
                                alt="Image"
                                width={50}
                                height={50}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (spinView?.createdBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, spinView?.createdBy?._id, ROLE_STATUS(spinView?.createdBy?.roleId)))

                          } else {
                            navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                          }
                        }}> {spinView?.createdBy?.fullName ?? "-"} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created On</b>
                        </td>
                        <td>{moment(spinView?.createdAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (spinView?.updatedBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, spinView?.updatedBy?._id, ROLE_STATUS(spinView?.updatedBy?.roleId)))


                          } else {
                            navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                          }
                        }}> {spinView?.updatedBy?.fullName ?? "-"} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated On</b>
                        </td>
                        <td>{moment(spinView?.updatedAt).format("LLL") ?? "-"}</td>
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
