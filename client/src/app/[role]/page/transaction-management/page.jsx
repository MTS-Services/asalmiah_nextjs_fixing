"use client";

import { Pagination } from "@/app/components/Pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import useSlider from "../../../../../hooks/useSlider";
import { GET_TRANSACTION_LIST_API } from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import { formatCurrency, getLinkHref, getPermissionsByLabel, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import useDetails from "../../../../../hooks/useDetails";
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
    queryKey: ["promotion-list", page, state],
    queryFn: async () => {
      const resp = await GET_TRANSACTION_LIST_API(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  let detail = useDetails()

  let permissionData = localStorage.getItem("permissionStore")
  const transactionManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "transactionManagement"
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

          <li className="text-capitalize">Transaction management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Transaction Management</h4>

              <div className="filter_dropdown flex-wrap">
                <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    // className="h-100"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && refetch()}
                    onKeyUp={(e) => e.target.value == "" && refetch()}
                  />
                </div>
                {/* <div className="form-group position-relative selectform mb-0">
                  <Form.Select onChange={(e) => setState(e.target.value)}>
                    <option value={""}>All</option>
                    <option value={constant?.ACTIVE}>Active</option>
                    <option value={constant?.INACTIVE}>Inactive</option>
                  </Form.Select>
                </div> */}
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
                            <td>
                              {" "}
                              <Link
                                href={getLinkHref(detail?.roleId, `/page/order-management/view/${data?.orderId}`)}
                              >
                                {data?.ordersDetails?.orderId}
                              </Link>
                            </td>
                            <td>
                              {formatCurrency(
                                data?.amount,
                                data?.ordersDetails?.companyDetails?.country
                              )}
                            </td>
                            <td>{data?.userDetails?.fullName}</td>
                            <td>{data?.userDetails?.email}</td>
                            {/* <td>
                              {" "}
                              {data?.productDetails?.map((item, index) => (
                                <span key={index}>{item.title}</span>
                              ))}
                            </td> */}

                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="d-flex">
                                {(transactionManagementPermissions?.at(0)?.value
                                  ?.subNav?.transactions?.view == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/transaction-management/view/${data?._id}`)}

                                  >
                                    <Button
                                      className="btn_green btn btn-sm ms-2"
                                      title="View"
                                    >

                                      <FaEye />
                                    </Button>
                                  </Link>
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

export default page;
