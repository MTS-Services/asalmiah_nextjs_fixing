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
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  GET_CLASSIFICATION_DETAIL_API,
  VIEW_MANUAL_NOTIFICATIONS,
} from "../../../../../../../services/APIServices";
import { getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS, stateId } from "../../../../../../../utils/helper";
import Image from "next/image";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const navigate = useRouter();
  const detail = useDetails();
  const { id } = useParams();
  const { data: manualNotificationDetail, isFetching } = useQuery({
    queryKey: ["manual-notification-detail", { id }],
    queryFn: async () => {
      const res = await VIEW_MANUAL_NOTIFICATIONS(id);
      return res?.data?.data ?? "";
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
                href={getLinkHref(detail?.roleId, "/page/manual-notifications")}
                className="text-capitalize text-black"
              >
                Manual Notification
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Manual Notification Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Manual Notification Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/manual-notifications")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td className="fw-bold w-75">Notification Type</td>
                    <td>
                      {manualNotificationDetail?.notificationType == 1
                        ? "Admin Notification"
                        : "Company Notification"}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold w-75">Title</td>
                    <td>{manualNotificationDetail?.title}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold w-75">Arabic Title</td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: manualNotificationDetail?.arabicTitle,
                      }}
                    ></td>
                  </tr>

                  <tr>
                    <td className="fw-bold w-75">Description</td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: manualNotificationDetail?.description,
                      }}
                    ></td>
                  </tr>

                  <tr>
                    <td className="fw-bold w-75">Arabic Description</td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: manualNotificationDetail?.arabicDescription,
                      }}
                    ></td>
                  </tr>

                  <tr>
                    <td className="fw-bold w-75">Users</td>
                    <td>
                      {" "}
                      {manualNotificationDetail?.userId
                        ?.map((data) => data?.fullName)
                        .join(", ") ?? "-"}
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-bold w-75">Company</td>
                    <td>{manualNotificationDetail?.companyDetails?.company}</td>
                  </tr>

                  <tr>
                    <td className="fw-bold w-75">All Users</td>
                    <td>
                      {manualNotificationDetail?.type == true ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr>
                    <td className="fw-bold w-75">Images</td>
                    <td>
                      {manualNotificationDetail?.image?.map((data) => {
                        return (
                          <Link
                            href={"#"}
                            onClick={() =>
                              window.open(
                                data?.url,
                                "_blank",
                                "width=800,height=600"
                              )
                            }
                          >
                            <Image
                              src={data?.url}
                              alt="notification-img"
                              height={100}
                              width={100}
                            />
                          </Link>
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
                      if (manualNotificationDetail?.createdBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, manualNotificationDetail?.createdBy?._id, ROLE_STATUS(manualNotificationDetail?.createdBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {manualNotificationDetail?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}
                  <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(manualNotificationDetail?.createdAt).format("LLL") ?? "-"}</td>
                  </tr>



                  <tr>
                    <td className="fw-bold w-75">State</td>
                    <td>
                      <badge className="btn-sm d-inline-block bg-success text-white">
                        {stateId(manualNotificationDetail?.stateId)}
                      </badge>
                    </td>
                  </tr>
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
