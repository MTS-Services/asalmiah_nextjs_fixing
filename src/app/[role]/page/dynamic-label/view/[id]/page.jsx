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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_DYNAMICLABEL_DETAIL } from "../../../../../../../services/APIServices";
import { getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

const View = () => {
  const isSlider = useSlider();
  const { id } = useParams();
  let detail = useDetails();
  let navigate = useRouter()
  const { data: dynamicLabelView, isFetching } = useQuery({
    queryKey: ["dynamic-label-detail", { id }],
    queryFn: async () => {
      const res = await GET_DYNAMICLABEL_DETAIL(id);
      return res?.data?.data ?? "";
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, '/page/dynamic-label')}
                className="text-black text-capitalize"
              >
                Dynamic Label Details{" "}
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">dynamic label details</li>
          </ul>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Dynamic Label Details</h5>
                <Link href={getLinkHref(detail?.roleId, '/page/dynamic-label')} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Title</b>
                    </td>
                    <td>{dynamicLabelView?.title}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Arabic Title</b>
                    </td>
                    <td>{dynamicLabelView?.arabicTitle}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Priority Order</b>
                    </td>
                    <td>{dynamicLabelView?.order}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Company</b>
                    </td>
                    <td>
                      {dynamicLabelView?.company
                        ?.map((data) => data?.company)
                        .join(", ")}
                    </td>
                  </tr>

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (dynamicLabelView?.createdBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, dynamicLabelView?.createdBy?._id, ROLE_STATUS(dynamicLabelView?.createdBy?.roleId)))
                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {dynamicLabelView?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(dynamicLabelView?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (dynamicLabelView?.updatedBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, dynamicLabelView?.updatedBy?._id, ROLE_STATUS(dynamicLabelView?.updatedBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {dynamicLabelView?.updatedBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(dynamicLabelView?.updatedAt).format("LLL") ?? "-"}</td>
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
