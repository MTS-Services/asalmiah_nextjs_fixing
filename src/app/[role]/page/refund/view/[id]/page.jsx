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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_TRANSACTION_DETAILS } from "../../../../../../../services/APIServices";
import moment from "moment";
import { formatCurrency } from "../../../../../../../utils/helper";
import { userDetails } from "../../../../../../../redux/features/userSlice";
// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const selectedCountry = useCountryState();

  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["company-detail", { id }],
    queryFn: async () => {
      const res = await GET_TRANSACTION_DETAILS(id);
      return res?.data?.data;
    },
  });

  let detail = userDetails()
  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-shadow">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Transaction Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/refund")}
                  className="btn_theme btn-sm"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th>TransactionId</th>
                      <td>{companyView?._id}</td>
                    </tr>
                    <tr>
                      <th>OrderId</th>
                      <td>
                        <Link
                          href={getLinkHref(detail?.roleId, `/page/order-management/view/${companyView?.orderId}`)}
                        >
                          <td> {companyView?.orderId}</td>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th>Amount({formatCurrency("", selectedCountry)})</th>
                      <td>{companyView?.amount}</td>
                    </tr>
                    <tr>
                      <th>Fullname</th>
                      <td>{companyView?.userDetails?.fullName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{companyView?.userDetails?.email}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{companyView?.userDetails?.address}</td>
                    </tr>

                    <tr>
                      <th>Phone number</th>
                      <td>
                        {companyView?.userDetails?.countryCode}
                        {companyView?.userDetails?.mobile}
                      </td>
                    </tr>

                    <tr>
                      <th>Created On </th>
                      <td>{moment(companyView?.createdAt).format("LLL")}</td>
                    </tr>
                    <tr>
                      <th>Status </th>
                      <td>{companyView?.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;


