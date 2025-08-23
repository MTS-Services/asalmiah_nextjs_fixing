"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_CONTACT_INFO,
  GET_CONTACT_INFO,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { Paginations } from "../../../../../utils/constants";
import { CheckAdminState, getLinkHref, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";

const ContactInfo = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  let detail = useDetails()
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  // const [search, setSearch] = useState("");
  // const [state, setState] = useState("");

  const { data: getContactInfo, refetch } = useQuery({
    queryKey: ["contactinfo-list", page],
    queryFn: async () => {
      const resp = await GET_CONTACT_INFO(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_CONTACT_INFO(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["contactinfo-list"] });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this company!",
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

          <li className="text-capitalize">Contact Info</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Contact-Info</h4>

              <div className="filter_dropdown flex-wrap">
                {getContactInfo?.length == 0 ? (
                  <Link
                    href={getLinkHref(detail?.roleId, "/page/contact-info/add")}
                    className="btn_theme"
                  >
                    Add Contact-Info
                  </Link>
                ) : (
                  ""
                )}

                {/* <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    className="h-100"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && refetch()}
                    onKeyUp={(e) => e.target.value == "" && refetch()}
                  />
                </div> */}
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
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Whatsapp Number</th>
                      <th>Created On</th>
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {getContactInfo?.length !== 0 ? (
                      getContactInfo?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.email}</td>
                            <td>{data?.countryCode + data?.mobile}</td>
                            <td>{data?.whatAppNumber}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/contact-info/view/${data?._id}`)}
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
                                <Link
                                  href={getLinkHref(detail?.roleId, `/page/contact-info/edit/${data?._id}`)}
                                >
                                  {" "}
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>
                                </Link>

                                <Button
                                  title="Delete"
                                  onClick={() => handleDelete(data?._id)}
                                  className="btn_orange btn btn-sm ms-2"
                                >
                                  <MdDelete />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8">
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

export default ContactInfo;
