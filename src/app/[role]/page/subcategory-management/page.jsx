"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBan, FaCaretDown, FaCaretUp, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_SUBCATEGORY_API,
  GET_SUBCATEGORY_API,
  STATE_UPDATE_SUBCATEGORY_API,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import { userDetails } from "../../../../../redux/features/userSlice";

const SubCategoryManagement = () => {
  const isSlider = useSlider();
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

  const { data: subcategory, refetch } = useQuery({
    queryKey: ["subcategory-list", page, search, state],
    queryFn: async () => {
      const resp = await GET_SUBCATEGORY_API(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_SUBCATEGORY_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["subcategory-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this subcategory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(id);
      }
    });
  };

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
          state == constant?.ACTIVE ? "Yes,Active it !" : "Yes, Inactive it !",
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
    mutationFn: (body) => STATE_UPDATE_SUBCATEGORY_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const sortedData = subcategory?.sort((a, b) => {
    if (sortConfig.column === "categoryName") {
      if (sortConfig.order === "asc") {
        return a.categoryDetails?.category.localeCompare(
          b.categoryDetails?.category
        );
      } else {
        return b.categoryDetails?.category.localeCompare(
          a.categoryDetails?.category
        );
      }
    } else if (sortConfig.column === "createdOn") {
      if (sortConfig.order === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    } else if (sortConfig.column === "subcategory") {
      if (sortConfig.order === "asc") {
        return a.subcategory.localeCompare(b.subcategory);
      } else {
        return b.subcategory.localeCompare(a.subcategory);
      }
    }
    return 0;
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

          <li className="text-capitalize">SubCategories management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">SubCategories</h4>

              <div className="filter_dropdown flex-wrap">
                <Link
                  href={getLinkHref(detail?.roleId, "/page/subcategory-management/add")}
                  className="btn_theme"
                >
                  Add Subcategory
                </Link>
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
                      <th>SubCategory Image</th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("categoryName")}
                      >
                        Category Name
                        {sortConfig.column === "categoryName" ? (
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
                        onClick={() => handleSortingChange("subcategory")}
                      >
                        SubCategory Name
                        {sortConfig.column === "subcategory" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Sort Order No.</th>
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
                            <td>
                              <div className="table-user d-flex align-items-center">
                                <span className="table-user-icon">
                                  <Image
                                    src={data?.subCategoryImg}
                                    alt="no category-image found"
                                    height={50}
                                    width={50}
                                  />
                                </span>
                              </div>
                            </td>

                            <td>{data?.categoryDetails?.category}</td>
                            <td>{data?.subcategory}</td>
                            <td>{data?.order ?? "-"}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/subcategory-management/view/${data?._id}`)}
                                >
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    title="View"
                                  >
                                    {" "}
                                    <FaEye />
                                  </Button>{" "}
                                </Link>
                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/subcategory-management/edit/${data?._id}`)}

                                >
                                  {" "}
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>
                                </Link>

                                {/* <Button
                                  title="Delete"
                                  onClick={() => handleDelete(data?._id)}
                                  className="btn_orange btn btn-sm ms-2"
                                >
                                  <MdDelete />
                                </Button> */}

                                {/* Active in active button  */}

                                {data?.stateId === constant?.ACTIVE ? (
                                  <Button
                                    className="btn_blue2 btn btn-sm ms-2"
                                    title="Inactive"
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
                                    title="Active"
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.ACTIVE
                                      )
                                    }
                                  >
                                    <FaCheck />
                                  </Button>
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

export default SubCategoryManagement;
