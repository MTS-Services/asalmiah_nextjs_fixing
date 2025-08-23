"use client";

import { Pagination } from "@/app/components/Pagination";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaCaretDown, FaCaretUp, FaEye } from "react-icons/fa";
import useSlider from "../../../../../hooks/useSlider";
import { GET_APPVERSION_API } from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { getLinkHref, getPermissionsByLabel, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import { MdCreate } from "react-icons/md";
import useDetails from "../../../../../hooks/useDetails";

const AppVersionManagement = () => {
  const isSlider = useSlider();
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
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

  const [list, setList] = useState({
    data: [],
    total: 0,
  });

  const getData = async (page) => {
    try {
      const response = await GET_APPVERSION_API(page);
      if (response?.status === 200) {
        setList({
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        });
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toastAlert("error", "Failed to fetch App Version records");
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const sortedData = list?.data?.sort((a, b) => {
    if (!sortConfig.column) return 0; // No sorting if column is not set
    if (sortConfig.column === "latestVersion") {
      return sortConfig.order === "asc"
        ? a.latestVersion.localeCompare(b.latestVersion)
        : b.latestVersion.localeCompare(a.latestVersion);
    } else if (sortConfig.column === "createdAt") {
      return sortConfig.order === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
  let detail = useDetails()

  let permissionData = localStorage.getItem("permissionStore")
  const appVersionManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "settings"
  );

  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain"}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">App Version</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">App Version</h4>
              <div className="filter_dropdown flex-wrap">


                {(appVersionManagementPermissions?.at(0)?.value?.subNav?.appVersion?.add == true &&
                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link
                    href={getLinkHref(detail?.roleId, "/page/app-version/add")}
                    className="btn_theme">
                    Add App Version
                  </Link>
                ) : (
                  ""
                )}
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
                        onClick={() => handleSortingChange("platform")}
                      >
                        Platform
                        {sortConfig.column === "platform" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("latestVersion")}
                      >
                        Latest Version
                        {sortConfig.column === "latestVersion" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Force Update</th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("createdAt")}
                      >
                        Created On
                        {sortConfig.column === "createdAt" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {sortedData?.length !== 0 ? (
                      sortedData?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.platform === 2 ? "ANDROID" : "IOS"}</td>
                            <td>{data?.latestVersion}</td>
                            <td>{data?.forceUpdate ? "Yes" : "No"}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>
                              <div className="d-flex">



                                {(appVersionManagementPermissions?.at(0)?.value?.subNav?.appVersion?.view === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/app-version/view/${data?._id}`)}
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
                             

                                {(appVersionManagementPermissions?.at(0)?.value?.subNav?.appVersion?.edit === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                    <Link

                                  href={getLinkHref(detail?.roleId, `/page/app-version/edit/${data?._id}`)}

                                >
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>{" "}
                                </Link>

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
              {Math.ceil(list?.total / 10) > 1 && (
                <Pagination
                  totalCount={list?.total}
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

export default AppVersionManagement;