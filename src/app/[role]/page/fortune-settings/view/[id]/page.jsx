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
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  GET_SPIN_SETTINGS_DETAIL
} from "../../../../../../../services/APIServices";
import {
  CheckAdminEnable,
  getLinkHref,
  getLinkHrefRouteSingleView,
  ROLE_STATUS
} from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: spinSettingsView, isFetching } = useQuery({
    queryKey: ["fortune-settings-detail", { id }],
    queryFn: async () => {
      const res = await GET_SPIN_SETTINGS_DETAIL(id);
      return res?.data?.data;
    },
  });
  let detail = useDetails()
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

                href={getLinkHref(detail?.roleId, "/page/fortune-settings")}
                className="text-capitalize text-black"
              >
                Fortune Settings
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Fortune Settings Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Fortune Settings Details</h5>
                <Link

                  href={getLinkHref(detail?.roleId, "/page/fortune-settings")}

                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Row>
                  <Col md={12}>
                    <Table className="table-bordered">
                      <tr>
                        <td>
                          <b>Name</b>
                        </td>
                        <td>{spinSettingsView?.description ?? ""}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>User use per day</b>
                        </td>
                        <td>{spinSettingsView?.userUserPerDay ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Showing per user / day</b>
                        </td>
                        <td>{spinSettingsView?.showPerUserDay ?? ""}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Start Date</b>
                        </td>
                        <td>{moment(spinSettingsView?.startDate).format("lll")}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>End Date</b>
                        </td>
                        <td>{moment(spinSettingsView?.endDate).format("lll")}</td>
                      </tr>

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (spinSettingsView?.createdBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, spinSettingsView?.createdBy?._id, ROLE_STATUS(spinSettingsView?.createdBy?.roleId)))


                          } else {
                            navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                          }
                        }}> {spinSettingsView?.createdBy?.fullName ?? "-"} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created On</b>
                        </td>
                        <td>{moment(spinSettingsView?.createdAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (spinSettingsView?.updatedBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, spinSettingsView?.updatedBy?._id, ROLE_STATUS(spinSettingsView?.updatedBy?.roleId)))
                          } else {
                            navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                          }
                        }}> {spinSettingsView?.updatedBy?.fullName ?? "-"} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated On</b>
                        </td>
                        <td>{moment(spinSettingsView?.updatedAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}
                      <tr>
                        <td>
                          <b>Status</b>
                        </td>
                        <td> {CheckAdminEnable(spinSettingsView?.stateId)}</td>
                      </tr>
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
