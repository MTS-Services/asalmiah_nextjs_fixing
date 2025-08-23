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
import { useParams } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_DETAILS_APPVERSION } from "../../../../../../../services/APIServices";
import { constant } from "../../../../../../../utils/constants";
import useDetails from "../../../../../../../hooks/useDetails";
import { getLinkHref } from "../../../../../../../utils/helper";

const View = () => {
  const isSlider = useSlider();
  const { id } = useParams();
  let detail = useDetails()
  const { data: appDetails } = useQuery({
    queryKey: ["app-detail", { id }],
    queryFn: async () => {
      const res = await GET_DETAILS_APPVERSION(id);
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
              <Link

                href={getLinkHref(detail?.roleId, "/page/app-version")}
                className="text-capitalize text-black"
              >
                App Version
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">App Version Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">App Version Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/app-version")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>
                        <b>Platform</b>
                      </td>
                      <td>{appDetails?.platform === 2 ? "ANDROID" : "IOS"}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Latest Version</b>
                      </td>
                      <td>{appDetails?.latestVersion}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Force Update</b>
                      </td>
                      <td>{appDetails?.forceUpdate ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Type</b>
                      </td>
                      <td>{appDetails?.type == constant.SALES ? "Sales Application" : "Users Application"}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Release Notes</b>
                      </td>
                      <td>{appDetails?.releaseNotes}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Created On</b>
                      </td>
                      <td>{moment(appDetails?.createdAt).format("LL")}</td>
                    </tr>
                  </tbody>
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