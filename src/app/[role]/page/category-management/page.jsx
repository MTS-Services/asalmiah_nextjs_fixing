"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBan, FaCaretDown, FaCaretUp, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_CATEGORY_API,
  GET_CATEGORY_API,
  STATE_UPDATE_CATEGORY_API,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import useDetails from "../../../../../hooks/useDetails";

const CategoryManagement = () => {
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
    total: null,
    filter: "",
  });

  useEffect(() => {
    getData(page, search, state);
  }, [page, search, state]);

  const getData = async (page, search, state = "") => {
    try {
      const response = await GET_CATEGORY_API(page, search, state);
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

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_CATEGORY_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category!",
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
    mutationFn: (body) => STATE_UPDATE_CATEGORY_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state);
    },
  });

  const sortedData = list?.data?.sort((a, b) => {
    if (sortConfig.column === "categoryName") {
      if (sortConfig.order === "asc") {
        return a.category.localeCompare(b.category);
      } else {
        return b.category.localeCompare(a.category);
      }
    } else if (sortConfig.column === "createdOn") {
      if (sortConfig.order === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    }
  });
  const onSearch = (value) => {
    getData(page, value, state);
  };
  let detail = useDetails()
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

          <li className="text-capitalize">categories management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Categories</h4>

              <div className="filter_dropdown flex-wrap">
                <Link
                  href={getLinkHref(detail?.roleId, "/page/category-management/add")}
                  className="btn_theme"
                >
                  Add Category
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
                      <th>Category Image</th>
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
                                    src={data?.categoryImg}
                                    alt="no category-image found"
                                    height={50}
                                    width={50}
                                  />
                                </span>
                              </div>
                            </td>

                            <td>{data?.category}</td>
                            <td>{data?.order ?? "-"}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/category-management/view/${data?._id}`)}
                                >
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    title="View"
                                  >
                                    {" "}
                                    <FaEye />
                                  </Button>
                                </Link>
                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/category-management/edit/${data?._id}`)}

                                >
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>{" "}
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

export default CategoryManagement;
