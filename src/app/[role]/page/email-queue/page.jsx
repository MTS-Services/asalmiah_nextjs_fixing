/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { FaShare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  adminGetAllEmailQueue,
  deleteSingleEmail,
  RESEND_EMAIL,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import { EMAIL_QUEUE_STATE, serialNumber } from "../../../../../utils/helper";

import { toastAlert } from "../../../../../utils/SweetAlert";
import NoDataFound from "../../../no-data-found/page";
import { Pagination } from "@/app/components/Pagination";


const EmailQueue = ({ params }) => {
  const toggleVal = useSlider();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [state, setState] = useState("");

  const { data: emailQueueState, refetch } = useQuery({
    queryKey: ["email-list", page, state],
    queryFn: async () => {
      const resp = await adminGetAllEmailQueue(page, "", state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const { mutate } = useMutation({
    mutationFn: (id) => deleteSingleEmail(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this email!",
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

  const { mutate: resendEmailFunc,isPending} = useMutation({
    mutationFn: (payload) => RESEND_EMAIL(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  return (
    <>
       <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href="/admin/page" className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>

          <li className="text-capitalize">E-mail Queue</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-0">E-mail Queue</h4>
              <div className="filter_dropdown flex-wrap">
                <div className="form-group position-relative selectform mb-0">
                  <Form.Select onChange={(e) => setState(e.target.value)}>
                    <option value={""}>All</option>
                    <option value={constant?.SUCCESS}>Success</option>
                    <option value={constant?.FAILED}>Failed</option>
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn</th>
                      <th>Id</th>
                      <th>Subject</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Status</th>
                      <th>Created On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {emailQueueState?.length > 0 ? (
                      emailQueueState?.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{serialNumber(page, index)}</td>
                            <td key={index}>{data?._id}</td>
                            <td>{data?.subject}</td>
                            <td>{data?.from}</td>
                            <td>{data?.to}</td>
                            <td>{EMAIL_QUEUE_STATE(data?.stateId)}</td>
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  href={`/admin/page/email-queue/view/${data?._id}`}
                                >
                                  <Button
                                    title="View"
                                    className="btn_green  btn btn-sm ms-2"
                                  >
                                    <FaEye />
                                  </Button>
                                </Link>

                                <Link
                                  // href={`/admin/page/email-queue/view/${data?._id}`}
                                  href={"#"}
                                >
                                  <Button
                                    title="resend"
                                    className="btn_blue2  btn btn-sm ms-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      let body = {
                                        email: data?.to,
                                        subject: data?.subject,
                                        description: data?.description,
                                      };
                                      resendEmailFunc(body);
                                    }}
                                    disabled={isPending}
                                  >
                                    <FaShare />
                                  </Button>
                                </Link>

                                <Button
                                  title="Delete"
                                  className="btn_orange btn btn-sm ms-2"
                                  onClick={() => handleDelete(data?._id)}
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
                        <td colSpan={8}>
                          <NoDataFound params={params} />
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
   
    </>
 
  );
};

export default EmailQueue;
