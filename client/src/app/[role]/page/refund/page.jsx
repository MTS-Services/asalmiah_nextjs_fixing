"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  ADMIN_REFUND,
  GET_REFUND_LIST_API,
  STATE_UPDATE_REFUND_API,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import {
  formatCurrency,
  getLinkHref,
  paymentReturnStatus,
  serialNumber
} from "../../../../../utils/helper";
import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";
import { userDetails } from "../../../../../redux/features/userSlice";
// import useDocumentTitle from "@/utils/ useDocumentTitle";

const page = () => {
  const isSlider = useSlider();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");

  const { data: getCompanyList, refetch } = useQuery({
    queryKey: ["refund-list", page, state, search],
    queryFn: async () => {
      const resp = await GET_REFUND_LIST_API(page, search, state);
      setMeta(resp?.data?._meta);

      return resp?.data?.data ?? [];
    },
  });

  const handleToggleState = (id, state) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to update the status !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#378ce7",
        cancelButtonColor: "#d33",
        confirmButtonText:
          state == constant?.ORDER_APPROVE
            ? "Yes,Approve it !"
            : "Yes, Reject it !",
      }).then(async (result) => {
        if (result.isConfirmed) {
          stateMutation?.mutate({ id, state });
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const stateMutation = useMutation({
    mutationFn: (body) => STATE_UPDATE_REFUND_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const handleToggleRefund = (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to refund !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#378ce7",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          stateMutationRefund?.mutate({ id });
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const stateMutationRefund = useMutation({
    mutationFn: (body) => ADMIN_REFUND(body?.id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  let detail = userDetails()


 
  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>

          <li className="text-capitalize">Refunds management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Refunds</h4>

              <div className="filter_dropdown flex-wrap">
                <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    className="h-100"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && refetch()}
                    onKeyUp={(e) => e.target.value == "" && refetch()}
                  />
                </div>
                <div className="form-group position-relative selectform mb-0">
                  <Form.Select onChange={(e) => setState(e.target.value)}>
                    <option value={""}>All</option>
                    <option value={constant?.ORDER_APPROVE}>Approve</option>
                    <option value={constant?.ORDER_REJECT}>Reject</option>
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>OrderId</th>
                      <th>Amount</th>
                      <th>Payment By</th>
                      <th>Payment Type</th>
                      <th>Email</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {getCompanyList?.length !== 0 ? (
                      getCompanyList?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.orderDetails?.orderId ?? "-"}</td>
                            <td>{formatCurrency(data?.amount, data?.orderDetails?.companyDetails?.country)}</td>

                            <td>{data?.userDetails?.fullName ?? "-"}</td>
                            <td>
                              {paymentReturnStatus(data?.paymentReturnType)}
                            </td>
                            <td>{data?.userDetails?.email}</td>

                            {/* <td>
                              {" "}
                              {data?.productDetails?.map((item, index) => (
                                <span key={index}>{item.title}</span>
                              ))}
                            </td> */}

                            <td>
                              {moment(data?.createdAt).format(
                                "LLL"
                              )}
                            </td>
                            <td>
                              <div className="d-flex">
                                {data?.stateId === 7 ? (
                                  <Button
                                    className="btn-success btn-sm ms-2"
                                    title="Refund"
                                    onClick={() => handleToggleRefund(data?._id)}
                                    disabled={stateMutationRefund?.isPending}
                                  >
                                    Refund
                                  </Button>
                                ) : data?.stateId == 8 ? (
                                  <span
                                    className="badge bg-success text-white"
                                    disabled
                                  >
                                    Refunded
                                  </span>
                                ) : (
                                  <>
                                    <Button
                                      className="btn-success btn-sm ms-2"
                                      title="Approve"
                                      onClick={() =>
                                        handleToggleState(
                                          data?._id,
                                          constant?.ORDER_APPROVE
                                        )
                                      }
                                    >
                                      Approve
                                    </Button>

                                    <Button
                                      className="btn_block btn btn-sm ms-2"
                                      title="Reject"
                                      onClick={() =>
                                        handleToggleState(
                                          data?._id,
                                          constant?.ORDER_REJECT
                                        )
                                      }
                                      disabled={
                                        data?.stateId === constant?.ORDER_REJECT
                                      }
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12">
                          <NoDataFound />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {Math.ceil(meta?.totalCount / 10) > 1 && (
                <Pagination
                  totalCount={meta?.totalCount}
                  handelPageChange={(e) => setPage(e.selected + 1)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
