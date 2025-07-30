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
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_OFFER_DETAIL } from "../../../../../../../services/APIServices";
import { getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS, stateId } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: offerview, isFetching } = useQuery({
    queryKey: ["offer-detail", { id }],
    queryFn: async () => {
      const res = await GET_OFFER_DETAIL(id);
      return res?.data?.data;
    },
  });
  let detail = useDetails();
  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link
                href={getLinkHref(detail?.roleId, "/page")}
                className="text-black text-capitalize"
              >
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, "/page/offer-management")}
                className="text-capitalize text-black"
              >
                Offer management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Offer details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Offer Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/offer-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Offer Name</b>
                    </td>
                    <td>{offerview?.title}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Company</b>
                    </td>
                    <td>{offerview?.companyDetails?.company}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Offer Image</b>
                    </td>
                    <td>
                      {" "}
                      {offerview?.image?.length !== 0 ? (
                        <div className="uploaded-image m-1">
                          <Image
                            src={offerview?.image}
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
                  <tr>
                    <td>
                      <b>Discount (%)</b>
                    </td>
                    <td>
                      {offerview?.discount
                        ? offerview?.discount + " " + "%"
                        : ""}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>State</b>
                    </td>
                    <td>
                      <badge className="btn-sm d-inline-block bg-success text-white">
                        {stateId(offerview?.stateId)}
                      </badge>
                    </td>
                  </tr>

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (offerview?.createdBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, offerview?.createdBy?._id, ROLE_STATUS(offerview?.createdBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {offerview?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(offerview?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (offerview?.updatedBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, offerview?.updatedBy?._id, ROLE_STATUS(offerview?.updatedBy?.roleId)))
                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {offerview?.updatedBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(offerview?.updatedAt).format("LLL") ?? "-"}</td>
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
