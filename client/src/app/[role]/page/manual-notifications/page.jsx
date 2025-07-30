"use client";

import { Pagination } from "@/app/components/Pagination";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import { GET_MANUAL_NOTIFICATIONLIST } from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, getLinkHrefRouteSingleView, getPermissionsByLabel, ROLE_STATUS, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
// import useDocumentTitle from "@/utils/ useDocumentTitle";

const ManualNotifications = () => {
  const isSlider = useSlider();
  const detail = useDetails();
  const navigate = useRouter();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [sortConfig, setSortConfig] = useState({
    column: null,
    order: null,
  });
  const handleSortingChange = (column) => {
    if (column === sortConfig.column) {
      setSortConfig({
        column,
        order: sortConfig.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({
        column,
        order: "asc",
      });
    }
  };

  const { data: manualNotificationList, refetch } = useQuery({
    queryKey: ["manual-notification", page, state],
    queryFn: async () => {
      const resp = await GET_MANUAL_NOTIFICATIONLIST(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });



  let permissionData = localStorage.getItem("permissionStore");
  const settingsPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "settings"
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

          <li className="text-capitalize">Manual Notifications</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Manual Notifications</h4>

              <div className="filter_dropdown flex-wrap">
                {(settingsPermissions?.at(0)?.value
                  ?.subNav?.manualNotification?.add == true &&
                  (detail?.roleId === constant.DESIGNED_USER ||
                    detail?.roleId ===
                    constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link
                    href={getLinkHref(detail?.roleId, "/page/manual-notifications/add")}
                    className="btn_theme"
                  >
                    Add manual notifications
                  </Link>
                ) : (
                  ""
                )}

                {/* <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    className="h-100"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && refetch()}
                    onKeyUp={(e) => e.target.value == "" && refetch()}
                  />
                </div> */}
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
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("Title")}
                      >
                        Title
                        {/* {sortConfig.column === "Title" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )} */}
                      </th>

                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("Title")}
                      >
                        Arabic Title
                        {/* {sortConfig.column === "Title" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )} */}
                      </th>

                      <th>Receiver name</th>

                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("createdOn")}
                      >
                        Created On
                        {/* {sortConfig.column === "createdOn" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )} */}
                      </th>

                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}



                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {manualNotificationList?.length !== 0 ? (
                      manualNotificationList?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.title ?? "-"}</td>
                            <td>{data?.arabicTitle ?? "-"}</td>
                            <td>
                              {data?.userId?.length !== 0
                                ? data?.userId
                                  ?.slice(0, 15)
                                  ?.map((data) => data?.fullName)
                                  .join(", ")
                                : "All Users"}
                            </td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.createdBy?.roleId !== constant.ADMIN) {



                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.createdBy?._id, ROLE_STATUS(data?.createdBy?.roleId)))

                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                                }
                              }}

                              > {data?.createdBy?.fullName}</Link>
                            </td> : ""}

                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>

                              <div className="d-flex">
                                {(settingsPermissions?.at(0)?.value
                                  ?.subNav?.manualNotification?.view == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Button className="btn_green btn btn-sm ms-2" title="View">
                                    {" "}
                                    <Link

                                      href={getLinkHref(detail?.roleId, `/page/manual-notifications/view/${data?._id}`)}

                                    >
                                      <FaEye />
                                    </Link>
                                  </Button>
                                ) : (
                                  ""
                                )}

                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6">
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

export default ManualNotifications;
