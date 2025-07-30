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
import { useParams } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_DETAILS_SMTP } from "../../../../../../../services/APIServices";
import moment from "moment";
import { CheckAdminState, getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  let detail = useDetails()
  const { id } = useParams();
  const { data: smtpDetails } = useQuery({
    queryKey: ["smtp-detail", { id }],
    queryFn: async () => {
      const res = await GET_DETAILS_SMTP(id);
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
                href={getLinkHref(detail?.roleId, `/page`)}
                className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link

                href={getLinkHref(detail?.roleId, `/page/smtp`)}
                className="text-capitalize text-black"
              >
                SMTP Management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">SMTP Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">SMTP Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, `/page/smtp`)}
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
                        <b>Email</b>
                      </td>
                      <td>{smtpDetails?.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Password</b>
                      </td>
                      <td>{smtpDetails?.password}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Host</b>
                      </td>
                      <td>{smtpDetails?.host}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Port</b>
                      </td>
                      <td>{smtpDetails?.port}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Status</b>
                      </td>
                      <td>{CheckAdminState(smtpDetails?.stateId)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Created On</b>
                      </td>
                      <td>{moment(smtpDetails?.createdAt).format("LL")}</td>
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