"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBan, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_TESTIMONIAL_API,
  GET_TESTIMONIAL_API,
  STATE_UPDATE_TESTIMONIAL_API,
} from "../../../../../services/APIServices";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, getLinkHrefRouteSingleView, getPermissionsByLabel, ROLE_STATUS, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";

const TestimonialManagement = () => {
  const isSlider = useSlider();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");

  // const { data: getBannerList, refetch } = useQuery({
  //   queryKey: ["testimonial-list", page, state],
  //   queryFn: async () => {
  //     const resp = await GET_TESTIMONIAL_API(page, search, state);
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
      const response = await GET_TESTIMONIAL_API(page, search, state);
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
    mutationFn: (payload) => DELETE_TESTIMONIAL_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      // queryClient.invalidateQueries({ queryKey: ["testimonial-list"] });
      getData(page, search, state); // Ensure we fetch the updated
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this banner!",
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
    mutationFn: (body) => STATE_UPDATE_TESTIMONIAL_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      // refetch();
      getData(page, search, state);
    },
  });


  const onSearch = (value) => {
    getData(page, value, state);
  };

  const detail = useDetails()

  let permissionData = localStorage.getItem("permissionStore")
  const testimonialManagementPermissions = getPermissionsByLabel(
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
          <li className="text-capitalize">Testimonial-Management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Testimonial Management</h4>

              <div className="filter_dropdown flex-wrap">

                {(testimonialManagementPermissions?.at(0)?.value?.subNav?.testimonialManagement?.add === true &&
                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link
                    href={getLinkHref(detail?.roleId, "/page/testimonial-management/add")}
                    className="btn_theme"
                  >
                    Add Testimonial
                  </Link>
                ) : (
                  ""
                )}



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
                      <th>Image</th>
                      <th>Username</th>

                      <th>Created On</th>
                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}

                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {data?.length !== 0 ? (
                      data?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>
                              <div className="table-user d-flex align-items-center">
                                <span className="table-user-icon">
                                  <Image
                                    src={data?.profileImg}
                                    alt="no profile-image found"
                                    height={50}
                                    width={50}
                                  />
                                </span>
                              </div>
                            </td>

                            <td>{data?.name}</td>

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
                                {(testimonialManagementPermissions?.at(0)?.value?.subNav?.testimonialManagement?.view == true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/testimonial-management/view/${data?._id}`)}
                                  >
                                    {" "}
                                    <Button
                                      className="btn_green btn btn-sm ms-2"
                                      title="View"
                                    >
                                      {" "}
                                      <FaEye />
                                    </Button>{" "}
                                  </Link>
                                ) : (
                                  ""
                                )}




                                {(testimonialManagementPermissions?.at(0)?.value?.subNav?.testimonialManagement?.edit == true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={
                                      getLinkHref(detail?.roleId, `/page/testimonial-management/edit/${data?._id}`)}
                                  >
                                    {" "}
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



                                {(testimonialManagementPermissions?.at(0)?.value?.subNav?.testimonialManagement?.delete == true &&
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

                                {/* Active in active button  */}



                                {(testimonialManagementPermissions?.at(0)?.value?.subNav?.testimonialManagement?.active == true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  data?.stateId === constant?.ACTIVE ? (
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
                                  )
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

export default TestimonialManagement;
