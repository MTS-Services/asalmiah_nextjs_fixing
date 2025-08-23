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
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, getPermissionsByLabel, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import { DELETE_TWILLIO, GET_TWILLIO_API } from "../../../../../services/APIServices";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import useDetails from "../../../../../hooks/useDetails";

const TwilioManagement = () => {
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
      const response = await GET_TWILLIO_API(page, search, state);
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
      toastAlert("error", "Failed to fetch Twilio records");
    }
  };

  useEffect(() => {
    getData(page, search, state);
  }, [page, search, state]);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: (id) => DELETE_TWILLIO(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Twilio record!",
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

  const handleToggleState = (id, state) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update the status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#378ce7",
      cancelButtonColor: "#d33",
      confirmButtonText:
        state === constant?.ACTIVE ? "Yes, activate it!" : "Yes, deactivate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        stateMutate({ id, state });
      }
    });
  };

  const sortedData = list?.data?.sort((a, b) => {
    if (!sortConfig.column) return 0; // No sorting if column is not set
    if (sortConfig.column === "twilioEmail") {
      return sortConfig.order === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortConfig.column === "createdOn") {
      return sortConfig.order === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });
  const onSearch = (value) => {
    getData(page, value, state);
  };

  let detail = useDetails()
  let permissionData = localStorage.getItem("permissionStore")
  const twillioManagementPermissions = getPermissionsByLabel(
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
          <li className="text-capitalize">Twilio management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Twilio Records</h4>
              <div className="filter_dropdown flex-wrap">


                {(twillioManagementPermissions?.at(0)?.value?.subNav?.twillio?.add === true &&
                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link
                    href={getLinkHref(detail?.roleId, "/page/twillio/add")}
                    className="btn_theme"
                  >
                    Add Twilio
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
                        onClick={() => handleSortingChange("twilioEmail")}
                      >
                        Twilio Email
                        {sortConfig.column === "twilioEmail" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>WhatsApp Number</th>
                      <th>Phone Number</th>
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
                            <td>{data?.twilioWhatsAppNumber}</td>
                            <td>{data?.twilioPhoneNumber}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                {(twillioManagementPermissions?.at(0)?.value?.subNav?.twillio?.view === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    title="View"
                                  >
                                    <Link
                                      href={getLinkHref(detail?.roleId, `/page/twillio/view/${data?._id}`)}

                                    >
                                      <FaEye />
                                    </Link>
                                  </Button>
                                ) : (
                                  ""
                                )}

                                {(twillioManagementPermissions?.at(0)?.value?.subNav?.twillio?.edit === true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <Link
                                      href={getLinkHref(detail?.roleId, `/page/twillio/edit/${data?._id}`)}
                                    >
                                      <MdCreate />
                                    </Link>
                                  </Button>
                                ) : (
                                  ""
                                )}



                                {(twillioManagementPermissions?.at(0)?.value?.subNav?.twillio?.delete === true &&
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

export default TwilioManagement;
