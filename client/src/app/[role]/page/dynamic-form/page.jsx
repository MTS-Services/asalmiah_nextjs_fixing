"use client";

import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaShareSquare } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_DYNAMIC_DETAILS,
  GET_DYNAMIC_LIST,
} from "../../../../../services/APIServices";
import { constant } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, getLinkHrefRouteSingleView, getPermissionsByLabel, ROLE_STATUS } from "../../../../../utils/helper";
import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";
import useDetails from "../../../../../hooks/useDetails";
import { useRouter } from "next/navigation";

const DynamicForm = ({ params }) => {
  const toggleVal = useSlider();
  const [dynamicFormList, setDynamicForm] = useState({
    data: [],
    total: null,
    page: 1,
    filter: "",
  });

  const { data, total, page, filter } = dynamicFormList;

  useEffect((page) => {
    getData(page);
  }, []);

  const getData = async (page, state = "") => {
    try {
      const response = await GET_DYNAMIC_LIST(page, state);
      if (response?.status === 200) {
        setDynamicForm((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stateHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this dynamic question!",
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
    mutationFn: (id) => DELETE_DYNAMIC_DETAILS(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData();
    },
  });


  let detail = useDetails()
  let navigate = useRouter()

  let permissionData = localStorage.getItem("permissionStore")
  const settingsPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "settings"
  );

  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>

          <li className="text-capitalize">Dynamic Question</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Dynamic Question</h4>
              <div className="filter_dropdown flex-wrap">
                {(settingsPermissions?.at(0)?.value
                  ?.subNav?.dynamicQuestion?.add == true &&
                  (detail?.roleId === constant.DESIGNED_USER ||
                    detail?.roleId ===
                    constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link

                    href={getLinkHref(detail?.roleId, `/page/dynamic-form/add`)}
                    className="btn_theme"
                  >
                    Add Dynamic Question
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
                      <th>Question</th>
                      <th>Created On</th>
                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {data?.length > 0 ? (
                      data?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>
                              {(dynamicFormList?.page - 1) *
                                constant?.PER_PAGE +
                                index +
                                1}
                            </td>
                            <td>{data?.question}</td>

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
                                {(settingsPermissions?.at(0)?.value
                                  ?.subNav?.dynamicQuestion?.edit == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/dynamic-form/edit/${data?._id}`)}

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

                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/assigin-product?question_id=${data?._id}`)}
                                >
                                  {" "}
                                  <Button
                                    title="Assign Product"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <FaShareSquare />
                                  </Button>{" "}
                                </Link>
                                {(settingsPermissions?.at(0)?.value
                                  ?.subNav?.dynamicQuestion?.delete == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Button
                                    title="Delete"
                                    onClick={() => stateHandler(data?._id)}
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
                        <td colSpan={8}>
                          <NoDataFound params={params} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {Math.ceil(total / 10) > 1 && (
                <div className="float-end">
                  <ReactPaginate
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    onPageChange={(props) => {
                      getData(props.selected + 1);
                    }}
                    pageCount={Math.ceil(total / 10)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
