"use client";
import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import {
  DOWNLOAD_INVOICE,
  GET_INVOICELIST_API,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import {
  CheckAdminDeliveryStatus,
  formatCurrency,
  getLinkHref,
  getPermissionsByLabel,
  serialNumber,
} from "../../../../../utils/helper";
import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";

const reports = () => {
  const isSlider = useSlider();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [deliveryStatus, setState] = useState("");

  const { data: orderLists, refetch } = useQuery({
    queryKey: ["report-list", page, deliveryStatus],
    queryFn: async () => {
      const resp = await GET_INVOICELIST_API(page, search, deliveryStatus);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (id) => DOWNLOAD_INVOICE(id),
    onSuccess: (resp) => {
      if (resp?.data?.data) {
        window.open(resp?.data?.data, "_blank");
      }
      toastAlert("success", resp?.data?.message);
    },
    onError: (error) => {
      toastAlert("error", error?.response?.data?.message);
    },
  });

  let detail = useDetails()


  let permissionData = localStorage.getItem("permissionStore")
  const reportsManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "reportsManagement"
  );

 

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

          <li className="text-capitalize">Order Reports</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Order Reports</h4>

              <div className="filter_dropdown flex-wrap"></div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>OrderId</th>
                      <th>Company</th>
                      <th>Promo Discount (%)</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {orderLists?.length !== 0 ? (
                      orderLists?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.orderId}</td>
                            <td>{data?.company ?? "-"}</td>
                            <td>{data?.promoDiscount ?? "-"}</td>
                            <td>{formatCurrency(data?.total, data?.country)}</td>
                            <td>
                              {CheckAdminDeliveryStatus(data?.deliveryStatus)}
                            </td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="d-flex">

                                {(reportsManagementPermissions?.at(0)?.value
                                  ?.subNav?.orderReports?.download == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    onClick={() => {
                                      downloadMutation.mutate(data?._id);
                                    }}
                                  >
                                    <FaDownload />
                                  </Button>
                                ) : (
                                  ""
                                )}
                                {/* Active in active button  */}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8">
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

export default reports;
