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
import moment from "moment";
import { CheckAdminState } from "../../../../../../../utils/helper";
import { GET_DETAILS_TWILLIO } from "../../../../../../../services/APIServices";
import useDetails from "../../../../../../../hooks/useDetails";

const View = () => {
  const isSlider = useSlider();
  const { id } = useParams();
  const { data: twilioDetails } = useQuery({
    queryKey: ["twilio-detail", { id }],
    queryFn: async () => {
      const res = await GET_DETAILS_TWILLIO(id); // Updated API call
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
              <Link
                href={getLinkHref(detail?.roleId, "/page/twilio")} // Updated link
                className="text-capitalize text-black"
              >
                Twilio Management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Twilio Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Twilio Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/twillio")}// Updated link
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
                        <b>Twilio Account SID</b>
                      </td>
                      <td>{twilioDetails?.twilioAccountSid}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Twilio Auth Token</b>
                      </td>
                      <td>{twilioDetails?.twilioAuthToken}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>WhatsApp Number</b>
                      </td>
                      <td>{twilioDetails?.twilioWhatsAppNumber}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Service ID</b>
                      </td>
                      <td>{twilioDetails?.twilioServiceId}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Phone Number</b>
                      </td>
                      <td>{twilioDetails?.twilioPhoneNumber}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Content SID</b>
                      </td>
                      <td>{twilioDetails?.twilioContentSid}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Status</b>
                      </td>
                      <td>{CheckAdminState(twilioDetails?.stateId)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Created On</b>
                      </td>
                      <td>{moment(twilioDetails?.createdAt).format("LL")}</td>
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