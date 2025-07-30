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
import { ACCOUNT_INFORMATION_DETAIL } from "../../../../../../../services/APIServices";
import {
  accountTypeFunc,
  getLinkHref,
  getLinkHrefRouteSingleView,
  paymentTypeFunc,
  ROLE_STATUS,
  stateId,
} from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";


const View = () => {
  const isSlider = useSlider();
  const { id } = useParams();
  let navigate = useRouter()
  let detail = useDetails()
  const { data: accountInfoView, isFetching } = useQuery({
    queryKey: ["account-detail", { id }],
    queryFn: async () => {
      const res = await ACCOUNT_INFORMATION_DETAIL(id);
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

                href={getLinkHref(detail?.roleId, "/page/account-information")}
                className="text-capitalize text-black"
              >
                Account Information
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Account Information Details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Account Information Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/account-information")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Company</b>
                    </td>
                    <td>{accountInfoView?.companyDetails?.company}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Account Type</b>
                    </td>
                    <td>{accountTypeFunc(accountInfoView?.accountType)}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Payment Method</b>
                    </td>
                    <td>{paymentTypeFunc(accountInfoView?.paymentMethod)}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Flexible Price</b>
                    </td>
                    <td>
                      {accountInfoView?.flexiblePrice == true
                        ? "Yes"
                        : "No" ?? "-"}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Accountant Name</b>
                    </td>
                    <td>{accountInfoView?.accountantName}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Accountant Telephone</b>
                    </td>
                    <td>{accountInfoView?.accountantTelephone}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Cheque Company</b>
                    </td>
                    <td>{accountInfoView?.chequeCompany}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Link Telephone no.</b>
                    </td>
                    <td>{accountInfoView?.linkTelephoneNumber}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Bank name</b>
                    </td>
                    <td>{accountInfoView?.bankName}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Account Number</b>
                    </td>
                    <td>{accountInfoView?.accountNumber}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Bank Code</b>
                    </td>
                    <td>{accountInfoView?.bankCode}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Branch name</b>
                    </td>
                    <td>{accountInfoView?.branchName}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Swift Code</b>
                    </td>
                    <td>{accountInfoView?.swiftCode}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>IBAN</b>
                    </td>
                    <td>{accountInfoView?.IBAN}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Payment Period</b>
                    </td>
                    <td>{accountInfoView?.paymentPeriod}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Beneficiary Name</b>
                    </td>
                    <td>{accountInfoView?.beneficiaryName}</td>
                  </tr>
                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (accountInfoView?.createdBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, accountInfoView?.createdBy?._id, ROLE_STATUS(accountInfoView?.createdBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {accountInfoView?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(accountInfoView?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (accountInfoView?.updatedBy?.roleId !== constant.ADMIN) {

                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, accountInfoView?.updatedBy?._id, ROLE_STATUS(accountInfoView?.updatedBy?.roleId)))
                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {accountInfoView?.updatedBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(accountInfoView?.updatedAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}
                  <tr>
                    <td>
                      <b>State</b>
                    </td>
                    <td>
                      <badge className="btn-sm d-inline-block bg-success ">
                        {stateId(accountInfoView?.stateId)}
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
