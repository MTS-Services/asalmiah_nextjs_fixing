"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBan, FaCaretDown, FaCaretUp, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  GET_CLASS_LIST_API,
  STATE_UPDATE_CLASS_API,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import {
  CheckAdminState,
  getLinkHref,
  getLinkHrefRouteSingleView,
  getPermissionsByLabel,
  ROLE_STATUS,
  serialNumber,
} from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import useDetails from "../../../../../hooks/useDetails";

const ClassManagement = () => {
  const isSlider = useSlider();
  const detail = useDetails();
  let navigate = useRouter()
  const queryClient = useQueryClient();
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

  const [list, setList] = useState({
    data: [],
    total: null,
    filter: "",
  });

  const { data, total, filter } = list;

  useEffect(() => {
    getData(page, search, state);
  }, [page, search, state]);

  const getData = async (page, search, state = "") => {
    try {
      const response = await GET_CLASS_LIST_API(page, search, state);
      if (response?.status === 200) {
        setList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this class!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // mutate(id);
      }
    });
  };

  const handleToggleState = (id, state) => {
    try {
      // Validate state values
      if (!id || (state !== constant?.ACTIVE && state !== constant?.INACTIVE)) {
        toastAlert("error", "Invalid state provided");
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You want to update the status !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#378ce7",
        cancelButtonColor: "#d33",
        confirmButtonText:
          state == constant?.ACTIVE ? "Yes,Active it !" : "Yes, Inactive it !",
      }).then(async (result) => {
        if (result.isConfirmed) {
          stateMutation?.mutate({ id, state });
        }
      });
    } catch (error) {
      console.error("error", error);
      toastAlert("error", "An error occurred while updating the status");
    }
  };

  const stateMutation = useMutation({
    mutationFn: (body) =>
      STATE_UPDATE_CLASS_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state);
    },
    onError: (error) => {
      console.error("State update error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update state";
      toastAlert("error", errorMessage);
    },
  });

  const sortedData = () => {
    if (!sortConfig.column) return data;

    return [...data].sort((a, b) => {
      if (sortConfig.column === "Class Name") {
        if (sortConfig.order === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      } else if (sortConfig.column === "createdOn") {
        if (sortConfig.order === "asc") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      }
    });
  };

  const onSearch = (value) => {
    getData(page, value, state);
  };

  return (
    <>
      <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link
                href={getLinkHref(detail?.roleId, "/page")}
                className="text-black text-capitalize"
              >
                home
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Class management</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Class</h4>
              <div className="filter_dropdown flex-wrap">
                <Link
                  href={getLinkHref(detail?.roleId, "/page/class-management/add")}
                  className="btn_theme"
                >
                  Add Class
                </Link>
                <div className="form-group position-relative selectform mb-0">
                  <DebounceEffect onSearch={onSearch} />
                </div>
                <div className="form-group position-relative selectform mb-0">
                  <Form.Select onChange={(e) => setState(e.target.value)}>
                    <option value={""}>All</option>
                    <option value={constant?.ACTIVE}>Active</option>
                    <option value={constant?.INACTIVE}>Inactive</option>
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
                      <th>Category</th>
                      <th
                        onClick={() => handleSortingChange("Class Name")}
                      >
                        Class Name
                        {sortConfig.column === "Class Name" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Class Name Arabic</th>
                      <th>Order sort no.</th>

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

                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {sortedData()?.length !== 0 ? (
                      sortedData()?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.category?.category || "N/A"}</td>
                            <td>{data?.name}</td>
                            <td>{data?.arbicName}</td>
                            <td>{data?.order ?? "-"}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.createdBy?.roleId !== constant.ADMIN) {

                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.createdBy?._id, ROLE_STATUS(data?.createdBy?.roleId)))


                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                                }
                              }}

                              >  {data?.createdBy?.fullName}</Link>

                            </td> : ""}
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.updatedBy?.roleId !== constant.ADMIN) {

                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.updatedBy?._id, ROLE_STATUS(data?.updatedBy?.roleId)))


                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                                }
                              }}>  {data?.updatedBy?.fullName}</Link>

                            </td> : ""}
                            {detail?.roleId == constant.ADMIN ? <td>{moment(data?.updatedAt).format("LLL")}</td> : ""}
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  href={getLinkHref(
                                    detail?.roleId,
                                    `/page/class-management/view/${data?._id}`
                                  )}
                                >
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    title="View"
                                  >
                                    <FaEye />
                                  </Button>
                                </Link>

                                <Link
                                  href={getLinkHref(
                                    detail?.roleId,
                                    `/page/class-management/edit/${data?._id}`
                                  )}
                                >
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>
                                </Link>

                                {data?.stateId === constant?.ACTIVE ? (
                                  <Button
                                    className="btn_blue2 btn btn-sm ms-2"
                                    title="Inactive"
                                    disabled={stateMutation.isPending}
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.INACTIVE
                                      )
                                    }
                                  >
                                    {" "}
                                    <FaBan />{" "}
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn_block btn btn-sm ms-2"
                                    title="Active"
                                    disabled={stateMutation.isPending}
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.ACTIVE
                                      )
                                    }
                                  >
                                    {" "}
                                    <FaCheck />{" "}
                                  </Button>
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
    </>
  );
};

export default ClassManagement;
