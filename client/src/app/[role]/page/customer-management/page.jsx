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
  adminDeleteUser,
  getAllUsers,
} from "../../../../../services/APIServices";
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import { constant } from "../../../../../utils/constants";
import {
  CheckAdminState,
  FORMAT_NUMBER,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  getPermissionsByLabel,
  ROLE_STATUS,
} from "../../../../../utils/helper";

import { Pagination } from "@/app/components/Pagination";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";
import useDetails from "../../../../../hooks/useDetails";
import { useRouter } from "next/navigation";
import moment from "moment";
const CustomerManagement = ({ params }) => {
  // useDocumentTitle("Customer Management")
  const toggleVal = useSlider();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  let detail = useDetails();
  let navigate = useRouter()
  // const {
  //   data: userList,
  //   isFetching,
  //   refetch,
  // } = useQuery({
  //   queryKey: ["users-list", page, state],
  //   queryFn: async () => {
  //     const resp = await getAllUsers(page, search, state, constant?.USER);
  //     setMeta(resp?.data?._meta);
  //     return resp?.data?.data ?? [];
  //   },
  // });

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
      const response = await getAllUsers(page, search, state, constant?.USER);
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
      text: "You want to delete this user!",
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
  const { mutate } = useMutation({
    mutationFn: (payload) => adminDeleteUser(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state);
    },
  });

  const onSearch = (value) => {
    getData(page, value, state);
  };

  let permissionData = localStorage.getItem("permissionStore")
  const customerManagementPermissions = getPermissionsByLabel(
    permissionData ? JSON.parse(permissionData)?.rolesPrivileges : [],
    "usersManagement"
  );
  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
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
          <li className="text-capitalize">Users management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Customers</h4>
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
                      <th>Wallet Balance</th>
                      <th>Earned Points</th>
                      <th>
                        Created On
                      </th>
                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}

                      {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {data?.length !== constant?.ZERO ? (
                      data?.map((user, index) => (
                        <tr key={user?._id}>
                          <td>{(page - 1) * constant?.PER_PAGE + index + 1}</td>
                          <td>
                            <img
                              src={
                                user?.profileImg
                                  ? user?.profileImg
                                  : "/assets/img/default.png"
                              }
                              height={"50"}
                              width={"50"}
                              alt="Image"
                            />
                          </td>
                          <td>{user?.fullName ?? ""}</td>
                          <td>{user?.email}</td>
                          <td>
                            {user?.countryCode
                              ? user?.countryCode + user?.mobile
                              : "-"}
                          </td>
                          <td>
                            {user?.walletsDetails?.amount
                              ? formatCurrency(
                                user?.walletsDetails?.amount,
                                user?.country
                              )
                              : "-"}
                          </td>
                          <td>{FORMAT_NUMBER(user?.pointsDetails?.points)}</td>
                          <td>{moment(user?.createdAt).format("LLL")}</td>
                          {detail?.roleId == constant.ADMIN ? <td>
                            <Link href={"#"} onClick={(e) => {
                              e.preventDefault()
                              if (user?.createdBy?.roleId !== constant.ADMIN) {
                                navigate.push(getLinkHrefRouteSingleView(detail?.roleId, user?.createdBy?._id, ROLE_STATUS(user?.createdBy?.roleId)))

                              } else {
                                navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                              }
                            }}

                            >  {user?.createdBy?.fullName}</Link>

                          </td> : ""}

                          {detail?.roleId == constant.ADMIN ? <td>
                            <Link href={"#"} onClick={(e) => {
                              e.preventDefault()
                              if (user?.updatedBy?.roleId !== constant.ADMIN) {
                                navigate.push(getLinkHrefRouteSingleView(detail?.roleId, user?.updatedBy?._id, ROLE_STATUS(user?.updatedBy?.roleId)))


                              } else {
                                navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                              }
                            }}>  {user?.updatedBy?.fullName}</Link>
                      

                          </td> : ""}
                          {detail?.roleId == constant.ADMIN ? <td>{moment(user?.updatedAt).format("LLL")}</td> : ""}

                          <td>{CheckAdminState(user?.stateId)}</td>
                          <td>
                            <div className="d-flex">
                              {/* View Button */}

                              {(customerManagementPermissions?.at(0)?.value?.subNav
                                ?.userPerson.view == true &&
                                (detail?.roleId === constant.DESIGNED_USER ||
                                  detail?.roleId ===
                                  constant.PROMOTION_USER)) ||
                                detail?.roleId == constant.ADMIN ? (
                                <Link
                                  href={getLinkHref(
                                    detail?.roleId,
                                    `/page/customer-management/${user?._id}`
                                  )}
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

                              {(customerManagementPermissions?.at(0)?.value?.subNav
                                ?.userPerson.edit == true &&
                                (detail?.roleId === constant.DESIGNED_USER ||
                                  detail?.roleId ===
                                  constant.PROMOTION_USER)) ||
                                detail?.roleId == constant.ADMIN ? (
                                <Link
                                  href={getLinkHref(
                                    detail?.roleId,
                                    `/page/customer-management/edit/${user?._id}`
                                  )}
                                >
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>
                                </Link>
                              ) : (
                                ""
                              )}

                              {(customerManagementPermissions?.at(0)?.value?.subNav
                                ?.userPerson.delete == true &&
                                (detail?.roleId === constant.DESIGNED_USER ||
                                  detail?.roleId ===
                                  constant.PROMOTION_USER)) ||
                                detail?.roleId == constant.ADMIN ? (
                                <Button
                                  title="Delete"
                                  onClick={() => handleDelete(user?._id)}
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
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan={15}>
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
