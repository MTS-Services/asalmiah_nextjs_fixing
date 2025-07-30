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
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_COMPANY_DETAIL } from "../../../../../../../services/APIServices";
import {
  accountTypeFunc,
  commissionTypeFunc,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  ROLE_STATUS,
} from "../../../../../../../utils/helper";
import useCountryState from "../../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const selectedCountry = useCountryState();
  let detail = useDetails();
  let navigate = useRouter()
  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["company-detail", { id }],
    queryFn: async () => {
      const res = await GET_COMPANY_DETAIL(id);
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
                href={getLinkHref(detail?.roleId, "/page/company-management")}
                className="text-capitalize text-black"
              >
                Company management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Company details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Company Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/company-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <div className="text-center">
                  {companyView?.logo ? (
                    <div className="uploaded-image m-1 mb-3">
                      <Image
                        src={`${companyView?.logo}`}
                        alt="Image"
                        layout="fill"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <Table bordered>
                  <tr>
                    <td>
                      <b>Company Ref No.</b>
                    </td>
                    <td>{companyView?.refNumber}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Company Name</b>
                    </td>
                    <td>{companyView?.company}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Actual Company Name</b>
                    </td>
                    <td>{companyView?.actualCompanyName}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Actual Company Name (In arabic)</b>
                    </td>
                    <td>{companyView?.arabicActualCompanyName}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Country</b>
                    </td>
                    <td>{companyView?.country}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Commission Type</b>
                    </td>
                    <td>{accountTypeFunc(companyView?.commissionType)}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        Commission (
                        {companyView?.commissionType
                          ? commissionTypeFunc(companyView?.commissionType)
                          : ""}
                        )
                      </b>
                    </td>

                    <td>{companyView?.perCommission}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Payment Period</b>
                    </td>

                    <td>{companyView?.paymentPeriod}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Mobile No</b>
                    </td>
                    <td>{companyView?.countryCode + companyView?.mobile}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Email</b>
                    </td>
                    <td>{companyView?.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Categroy</b>
                    </td>
                    <td>{companyView?.categoryDetails?.category}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Coupon Service</b>
                    </td>
                    <td>{companyView?.couponService == true ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Pickup Service</b>
                    </td>
                    <td>{companyView?.pickupService == true ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Delivery Service</b>
                    </td>
                    <td>
                      {companyView?.deliveryService == true ? "Yes" : "No"}
                    </td>
                  </tr>
                  {companyView?.deliveryService == true ? (
                    <tr>
                      <td>
                        <b>Delivery Company</b>
                      </td>
                      <td>{companyView?.deliveryCompany?.company}</td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td>
                      <b>Self Delivery</b>
                    </td>
                    <td>
                      {companyView?.deliveryEligible == true ? "Yes" : "No"}
                    </td>
                  </tr>

                  {companyView?.deliveryEligible == true ? (
                    <>
                      <tr>
                        <td>
                          <b>Delivery Cost ({formatCurrency("", selectedCountry)})</b>
                        </td>
                        <td>{companyView?.costDelivery}</td>
                      </tr>
                    </>
                  ) : (
                    ""
                  )}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (companyView?.createdBy?.roleId !== constant.ADMIN) {




                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, companyView?.createdBy?._id, ROLE_STATUS(companyView?.createdBy?.roleId)))


                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {companyView?.createdBy?.fullName} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(companyView?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (companyView?.updatedBy?.roleId !== constant.ADMIN) {



                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, companyView?.updatedBy?._id, ROLE_STATUS(companyView?.updatedBy?.roleId)))
                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {companyView?.updatedBy?.fullName} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(companyView?.updatedAt).format("LLL") ?? "-"}</td>
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
