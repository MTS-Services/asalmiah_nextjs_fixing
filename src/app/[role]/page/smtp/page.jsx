"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCaretDown, FaCaretUp, FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import { DELETE_SMTP, GET_SMTP_API } from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, getPermissionsByLabel, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import useDetails from "../../../../../hooks/useDetails";

const SmtpManagement = () => {
  const isSlider = useSlider();
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

  const [list, setList] = useState({
    data: [],
    total: 0,
  });

  const getData = async (page, search, state = "") => {
    try {
      const response = await GET_SMTP_API(page, search, state);
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
      toastAlert("error", "Failed to fetch SMTP records");
    }
  };

  useEffect(() => {
    getData(page, search, state);
  }, [page, search, state]);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id) => DELETE_SMTP(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this SMTP record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutate(id);
      }
    });
  };

  // const { mutate: stateMutate } = useMutation({
  //   mutationFn: (body) => STATE_UPDATE_SMTP_API(body?.id, body?.state),
  //   onSuccess: (resp) => {
  //     toastAlert("success", resp?.data?.message);
  //     getData(page, search, state);
  //   },
  // });

  // const handleToggleState = (id, state) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You want to update the status!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#378ce7",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText:
  //       state === constant?.ACTIVE ? "Yes, activate it!" : "Yes, deactivate it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       stateMutate({ id, state });
  //     }
  //   });
  // };

  const sortedData = list?.data?.sort((a, b) => {
    if (!sortConfig.column) return 0; // No sorting if column is not set
    if (sortConfig.column === "smtpName") {
      return sortConfig.order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.column === "createdOn") {
      return sortConfig.order === "asc"
        ? new Date(a.createdOn) - new Date(b.createdOn)
        : new Date(b.createdOn) - new Date(a.createdOn);
    }
    return 0;
  });
  const onSearch = (value) => {
    getData(page, value, state);
  };
  const detail = useDetails()

  let permissionData = localStorage.getItem("permissionStore")
  const smtpManagementPermissions = getPermissionsByLabel(
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
          <li className="text-capitalize">SMTP management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">SMTP Records</h4>
              <div className="filter_dropdown flex-wrap">
                {(smtpManagementPermissions?.at(0)?.value?.subNav?.smtp?.add === true &&
                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link href={getLinkHref(detail?.roleId, "/page/smtp/add-edit")} className="btn_theme">
                    Add SMTP
                  </Link>
                ) : (
                  ""
                )}



                {/* <div className="form-group position-relative selectform mb-0">
                  <DebounceEffect onSearch={onSearch} />
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
                        onClick={() => handleSortingChange("smtpName")}
                      >
                        SMTP Email
                        {sortConfig.column === "smtpName" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Host</th>
                      <th>Port</th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("createdOn")}
                      >
                        Created On
                        {sortConfig.column === "createdOn" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {sortedData?.length !== 0 ? (
                      sortedData?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.email}</td>
                            <td>{data?.host}</td>
                            <td>{data?.port}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">


                                {(smtpManagementPermissions?.at(0)?.value?.subNav?.smtp?.view === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/smtp/view/${data?._id}`)}
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





                                {(smtpManagementPermissions?.at(0)?.value?.subNav?.smtp?.edit === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/smtp/edit/${data?._id}`)}

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

                                {/* {data?.stateId === constant?.ACTIVE ? (
                                  <Button
                                    className=" btn_blue2 btn btn-sm ms-2"
                                    title="Deactivate"
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.INACTIVE
                                      )
                                    }
                                  >
                                    <FaBan />
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn_block btn btn-sm ms-2"
                                    title="Activate"
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.ACTIVE
                                      )
                                    }
                                  >
                                    <FaCheck />
                                  </Button>
                                )} */}


                                {(smtpManagementPermissions?.at(0)?.value?.subNav?.smtp?.delete === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Button
                                    title="Delete"
                                    onClick={() => handleDelete(data?._id)}
                                    className="btn_orange btn btn-sm ms-2"
                                  >
                                    <MdDelete />
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
                        <td colSpan="7">
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

export default SmtpManagement;
