/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSlider from "../../../../../../../hooks/useSlider";
import {
  GET_TRANSACTION_DETAILS,
  REFUND_TRANSACTION_AMOUNT,
} from "../../../../../../../services/APIServices";
import moment from "moment";
import Swal from "sweetalert2";
import { toastAlert } from "../../../../../../../utils/SweetAlert";
import { formatCurrency, getLinkHref } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: transactionAdminDetails, refetch } = useQuery({
    queryKey: ["transactions-detail", { id }],
    queryFn: async () => {
      const res = await GET_TRANSACTION_DETAILS(id);
      return res?.data?.data;
    },
  });

  const handleToggleState = (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to refund the amount !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#378ce7",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          stateMutation?.mutate({ id });
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const stateMutation = useMutation({
    mutationFn: (body) => REFUND_TRANSACTION_AMOUNT(body?.id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
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
                href={getLinkHref(detail?.roleId, "/page/transaction-management")}
                className="text-capitalize text-black"
              >
                Transaction management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Transaction details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-shadow">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Transaction Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/transaction-management")}
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
                      <td>{transactionAdminDetails?._id}</td>
                    </tr>
                    <tr>
                      <th>OrderId</th>
                      <td>
                        <Link

                          href={getLinkHref(detail?.roleId, `/page/order-management/view/${transactionAdminDetails?.orderId}`)}
                        >
                          <td>
                            {" "}
                            {transactionAdminDetails?.ordersDetails?.orderId}
                          </td>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        Amount ({" "}
                        {formatCurrency(
                          "",
                          transactionAdminDetails?.ordersDetails?.companyDetails?.country
                        )}
                        )
                      </th>
                      <td>{transactionAdminDetails?.amount}</td>
                    </tr>
                    <tr>
                      <th>Fullname</th>
                      <td>{transactionAdminDetails?.userDetails?.fullName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{transactionAdminDetails?.userDetails?.email}</td>
                    </tr>
                    {transactionAdminDetails?.ordersDetails?.addressDetails ? (
                      <tr>
                        <th>Address</th>
                        <td>
                          {
                            transactionAdminDetails?.ordersDetails
                              ?.addressDetails?.area
                          }
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <th>Branch</th>
                        <td>
                          {
                            transactionAdminDetails?.ordersDetails
                              ?.branchDetails?.area
                          }
                        </td>
                      </tr>
                    )}

                    <tr>
                      <th>Phone number</th>
                      <td>
                        {transactionAdminDetails?.userDetails?.countryCode}
                        {transactionAdminDetails?.userDetails?.mobile}
                      </td>
                    </tr>

                    <tr>
                      <th>Created On </th>
                      <td>
                        {moment(transactionAdminDetails?.createdAt).format(
                          "LLL"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Status </th>
                      <td>{transactionAdminDetails?.status}</td>
                    </tr>
                  </tbody>
                </table>
                {transactionAdminDetails?.ordersDetails?.deliveryStatus == 10 &&
                  transactionAdminDetails?.isRefund == false ? (
                  <Link
                    href={"#"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleState(transactionAdminDetails?._id);
                    }}
                    className="btn_theme btn-sm d-flex justify-content-end"
                    disabled={stateMutation?.isPending}
                  >
                    Refund
                  </Link>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
