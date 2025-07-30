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
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useDetails from "../../../../../../../hooks/useDetails";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  GET_CLASSIFICATION_DETAIL_API
} from "../../../../../../../services/APIServices";
import { getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS, stateId } from "../../../../../../../utils/helper";
import { constant } from "../../../../../../../utils/constants";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const navigate = useRouter();
  const detail = useDetails();
  const { id } = useParams();
  const { data: categoryview, isFetching } = useQuery({
    queryKey: ["classification-detail", { id }],
    queryFn: async () => {
      const res = await GET_CLASSIFICATION_DETAIL_API(id);
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
                href={getLinkHref(detail?.roleId, "/page/classification-management")}
                className="text-capitalize text-black"
              >
                Classification management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Classification details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Classification Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/classification-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Classification Name</b>
                    </td>
                    <td>{categoryview?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Classification Name Arabic</b>
                    </td>
                    <td>{categoryview?.arbicName}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>CreatedOn</b>
                    </td>
                    <td>{moment(categoryview?.createdAt).format("lll")}</td>
                  </tr>

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (categoryview?.createdBy?.roleId !== constant.ADMIN) {



                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, categoryview?.createdBy?._id, ROLE_STATUS(categoryview?.createdBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {categoryview?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(categoryview?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (categoryview?.updatedBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, categoryview?.updatedBy?._id, ROLE_STATUS(categoryview?.updatedBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {categoryview?.updatedBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(categoryview?.updatedAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  <tr>
                    <td>
                      <b>State</b>
                    </td>
                    <td>
                      <badge className="btn-sm d-inline-block bg-success text-white">
                        {stateId(categoryview?.stateId)}
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
