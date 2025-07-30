/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { cmsDelete, getCMSPage } from "../../../../../services/APIServices";
import { constant } from "../../../../../utils/constants";
import {
  CheckAdminState,
  getLinkHref,
  getLinkHrefRouteSingleView,
  pageType,
  ROLE_STATUS
} from "../../../../../utils/helper";
// import useDocumentTitle from "@/utils/ useDocumentTitle";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";

const ContentManagement = () => {
  const toggleVal = useSlider();
  const [list, setList] = useState([]);
  let navigate = useRouter()
  let detail = useDetails();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getCMSPage().then((res) => {
      if (res?.status == 200) {
        setList(res?.data?.data);
      }
    });
  };

  const stateHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this CMS!",
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
    mutationFn: (id) => cmsDelete(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData();
    },
  });

  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li className="text-capitalize">Content management</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-md-0">Content Management</h4>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/content-management/add")}
                  className="btn_theme"
                >
                  Add Content
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>
                          Created On
                        </th>
                        {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}
                        {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                        {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}
                        <th>State</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="gridjs-tbody">
                      {list?.length !== constant?.ZERO ? (
                        list?.map((data, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data?.title}</td>
                            {/* <td>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: truncate(data?.description, 60),
                                }}
                              />
                            </td> */}
                            <td>{pageType(data?.typeId)}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>


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
                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.createdBy?._id, ROLE_STATUS(data?.createdBy?.roleId)))

                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                                }
                              }}>  {data?.updatedBy?.fullName}</Link>

                            </td> : ""}
                            {detail?.roleId == constant.ADMIN ? <td>{moment(data?.updatedAt).format("LLL")}</td> : ""}
                            <td>
                              <td>{CheckAdminState(data?.stateId)}</td>
                            </td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  title="View"
                                  className="btn_green  btn btn-sm ms-2"
                                  href={getLinkHref(detail?.roleId, `/page/content-management/view/${data?._id}`)}
                                >
                                  <FaEye />
                                </Link>
                                <Link
                                  title="Edit"
                                  href={getLinkHref(detail?.roleId, `/page/content-management/edit/${data?._id}`)}
                                  className="btn_blue btn btn-sm ms-2"
                                >
                                  <MdCreate />
                                </Link>
                                <Button
                                  title="Delete"
                                  onClick={() => {
                                    stateHandler(data?._id);
                                  }}
                                  className="btn_orange btn btn-sm ms-2"
                                >
                                  <MdDelete />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentManagement;
