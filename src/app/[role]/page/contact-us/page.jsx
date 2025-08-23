"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  CONTACT_US_API,
  DELETE_CONTACT_US,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { getLinkHref, getPermissionsByLabel, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import useDetails from "../../../../../hooks/useDetails";

const ContactUs = () => {
  const isSlider = useSlider();
  const detail = useDetails();
  const queryClient = useQueryClient();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");

  const { data: contactUsData, refetch } = useQuery({
    queryKey: ["contactus-list", page, state],
    queryFn: async () => {
      const resp = await CONTACT_US_API(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_CONTACT_US(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["contactus-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this contact!",
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
  let permissionData = localStorage.getItem("permissionStore")
  const contactManagementPermissions = getPermissionsByLabel(
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
          <li className="text-capitalize">Contact Us</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Contact Us</h4>

              <div className="filter_dropdown flex-wrap">
                <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && refetch()}
                    onKeyUp={(e) => e.target.value == "" && refetch()}
                    maxLength={40}
                  />
                </div>
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
                      <th>Full Name</th>
                      <th>E-mail</th>

                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {contactUsData?.length !== 0 ? (
                      contactUsData?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.firstName + " " + data?.lastName}</td>
                            <td>{data?.email}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="d-flex">
                                {(contactManagementPermissions?.at(0)?.value?.subNav?.contactUs?.view == true &&
                                  (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/contact-us/view/${data?._id}`)}
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


                                {(contactManagementPermissions?.at(0)?.value?.subNav?.contactUs?.delete == true &&
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
                        <td colSpan="6">
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

export default ContactUs;
