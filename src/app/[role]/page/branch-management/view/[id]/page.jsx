/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useDetails from "../../../../../../../hooks/useDetails";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_BRANCH_DETAIL } from "../../../../../../../services/APIServices";
import { getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS } from "../../../../../../../utils/helper";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

const View = () => {
  const detail = useDetails();
  const { id } = useParams();
  const isSlider = useSlider();
  let navigate = useRouter()
  const { data: branchView, isFetching } = useQuery({
    queryKey: ["branch-detail", { id }],
    queryFn: async () => {
      const res = await GET_BRANCH_DETAIL(id);
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
                href={getLinkHref(detail?.roleId, "/page/branch-management")}
                className="text-capitalize text-black"
              >
                Branch management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Branch details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Branch Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/branch-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Branch Name</b>
                    </td>
                    <td>{branchView?.branchName}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Area</b>
                    </td>
                    <td>
                      <a
                        href={`https://www.google.com/maps/@${branchView?.location.coordinates[1]},${branchView?.location.coordinates[0]},15z`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {branchView?.area}
                      </a>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>
                      <b>Delivery Cost</b>
                    </td>
                    <td>{branchView?.costDelivery}</td>
                  </tr> */}
                  <tr>
                    <td>
                      <b>Delivery Email</b>
                    </td>
                    <td>{branchView?.deliveryEmail}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Company</b>
                    </td>
                    <td>{branchView?.companyId?.company}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Delivery Point</b>
                    </td>
                    <td>
                      {branchView?.isDeliveryPoint == true ? "True" : "False"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Coupon Branch</b>
                    </td>
                    <td>
                      {branchView?.isCouponBranch == true ? "True" : "False"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Delivery Whatts App Number</b>
                    </td>
                    <td>
                      {branchView?.CountryCode +
                        "" +
                        branchView?.deliveryWhatsUpNo}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Working Hours</b>
                    </td>
                    <td>
                      {branchView?.workingHours?.map((workingHour, index) => {
                        return (
                          <div key={index}>
                            <span>{workingHour.endTime}</span>,&nbsp;&nbsp;
                            <span>{workingHour.startTime}</span>,&nbsp;&nbsp;
                            <span>{workingHour.day}</span>
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (branchView?.createdBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, branchView?.createdBy?._id, ROLE_STATUS(branchView?.createdBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {branchView?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(branchView?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (branchView?.updatedBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, branchView?.updatedBy?._id, ROLE_STATUS(branchView?.updatedBy?.roleId)))
                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {branchView?.updatedBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(branchView?.updatedAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
