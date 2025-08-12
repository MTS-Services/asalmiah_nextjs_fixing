/**
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author    : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

"use client";

import {
  adminUpdateUserState,
  getAllUsers,
} from "../../../../../services/APIServices";
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaBan, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import { constant } from "../../../../../utils/constants";
import { CheckAdminState } from "../../../../../utils/helper";

import { Pagination } from "@/app/components/Pagination";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";
const CustomerManagement = () => {
  const toggleVal = useSlider();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");


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
      const response = await getAllUsers(page, search, state, constant?.DESIGNED_USER);
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
    mutationFn: (body) => adminUpdateUserState(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      // refetch();
      getData(page, search, state);
    },
  });

  const onSearch = (value) => {
    getData(page, value, state);
  };
  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href="/admin/page" className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">Users Management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Designed Users</h4>
              <div className="filter_dropdown flex-wrap">
                <div className="form-group position-relative selectform mb-0">
                  <DebounceEffect onSearch={onSearch} />
                </div>
                <div className="form-group position-relative selectform mb-0">
                  <select
                    className="form-control"
                    name="state"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                  >
                    <option value="">--- Filter ---</option>

                    <option value={constant?.ACTIVE}>{"Active"}</option>
                    <option value={constant?.INACTIVE}>{"In-Active"}</option>
                  </select>
                </div>
                <Link
                  href={`/admin/page/designed-users/add`}
                  className="btn_theme"
                >
                  Add Designed Users
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Profile</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {data?.length !== constant?.ZERO ? (
                      data?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>
                              {(page - 1) * constant?.PER_PAGE + index + 1}
                            </td>
                            <td>
                              {" "}
                              <img
                                src={
                                  data?.profileImg
                                    ? data?.profileImg
                                    : "/assets/img/default.png"
                                }
                                height={50}
                                width={50}
                                alt="Image"
                              />
                            </td>
                            <td>{data?.fullName ?? ""}</td>
                            <td>{data?.email}</td>
                            <td>{data?.countryCode + data?.mobile}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  href={`/admin/page/designed-users/${data?._id}`}
                                >
                                  <Button
                                    title="View"
                                    className="btn_green btn btn-sm ms-2"
                                  >
                                    <FaEye />
                                  </Button>
                                </Link>
                                <Link
                                  href={`/admin/page/designed-users/edit/${data?._id}`}
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
                      <tr className="text-center">
                        <td colSpan={8}>
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

export default CustomerManagement;
