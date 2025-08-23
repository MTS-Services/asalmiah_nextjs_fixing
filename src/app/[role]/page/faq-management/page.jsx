"use client";

import {
  getAllFaq,
  faqChangeState,
  faqDelete,
} from "../../../../../services/APIServices";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaCaretDown } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { MdCreate, MdDelete } from "react-icons/md";
import { constant } from "../../../../../utils/constants";
import NoDataFound from "../../../no-data-found/page";
import { CheckAdminState, getLinkHref, getLinkHrefRouteSingleView, getPermissionsByLabel, ROLE_STATUS, truncate } from "../../../../../utils/helper";
import useSlider from "../../../../../hooks/useSlider";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { useMutation } from "@tanstack/react-query";
import useDetails from "../../../../../hooks/useDetails";

const Faq = ({ params }) => {
  const toggleVal = useSlider();
  const navigate = useRouter();
  let detail = useDetails()
  const [faqList, setFaqList] = useState({
    data: [],
    total: null,
    page: 1,
    filter: "",
  });

  const { data, total, page, filter } = faqList;

  useEffect((page) => {
    getData(page);
  }, []);

  const getData = async (page, state = "") => {
    try {
      const response = await getAllFaq(page, state);
      if (response?.status === 200) {
        setFaqList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stateId = (state) => {
    switch (state) {
      case "0":
        return "Active";
      case "1":
        return "In Active";
      case "2":
        return "Deleted";
      default:
        return;
    }
  };

  // const stateHandler = (id) => {
  //   //api call
  //   faqChangeState(id, 2).then((res) => {
  //     if (res?.status == 200) {
  //       Swal.fire("success", res?.data?.message, "success");
  //       getData(page);
  //     }
  //   });
  // };

  const stateHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this faq!",
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
    mutationFn: (id) => faqDelete(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData();
    },
  });

  let permissionData = localStorage.getItem("permissionStore");
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

          <li className="text-capitalize">FAQ management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">FAQ</h4>
              <div className="filter_dropdown flex-wrap">
                {(settingsPermissions?.at(0)?.value
                  ?.subNav?.faqManagement?.add == true &&
                  (detail?.roleId === constant.DESIGNED_USER ||
                    detail?.roleId ===
                    constant.PROMOTION_USER)) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link
                    href={getLinkHref(detail?.roleId, "/page/faq-management/add")}
                    className="btn_theme"
                  >
                    Add FAQ
                  </Link>
                ) : (
                  ""
                )}

                {/* <div className="form-group position-relative selectform mb-0">
                  <select
                    className="form-control"
                    name="filter"
                    onChange={(e) => getData(page, e.target.value)}
                  >
                    <option value="">filter</option>

                    <option value={constant?.ACTIVE}>Active</option>
                    <option value={constant?.INACTIVE}>InActive</option>
                    <option value={constant?.DELETED}>Deleted</option>
                  </select>
                  <FaCaretDown />
                </div> */}
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Question</th>
                      <th>Answer</th>
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
                              {(faqList?.page - 1) * constant?.PER_PAGE +
                                index +
                                1}
                            </td>
                            <td>{data?.question}</td>
                            <td>{truncate(data?.answer, 50)}</td>
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
                                  ?.subNav?.faqManagement?.edit == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/faq-management/edit/${data?._id}`)}
                                  > <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                      <MdCreate />
                                    </Button>
                                  </Link>
                                ) : (
                                  ""
                                )}
                                {(settingsPermissions?.at(0)?.value
                                  ?.subNav?.faqManagement?.delete == true &&
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

export default Faq;
