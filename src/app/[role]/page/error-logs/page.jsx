/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

"use client";
import { Pagination } from "@/app/components/Pagination";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import {
  adminGetAllError,
  deleteAllError,
  deleteSingleError,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import NoDataFound from "../../../no-data-found/page";
import Loading from "../loading";
import useSlider from "../../../../../hooks/useSlider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toastAlert } from "../../../../../utils/SweetAlert";
import {
  ERROR_TYPE_STATUS,
  serialNumber,
  truncate,
} from "../../../../../utils/helper";
import { FaTrash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const ErrorLogs = ({ params }) => {
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [errorType, setErrorType] = useState("");
  const {
    data: errorList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["errorLogs", page, errorType],
    queryFn: async () => {
      const resp = await adminGetAllError(page, errorType);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  // Single log delete

  const handleSingleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the error log!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#314e94",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(id);
      }
    });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => deleteSingleError(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  // All log delete

  const handleAllDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete all the error logs!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#314e94",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete It!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };
  const deleteMutation = useMutation({
    mutationFn: () => deleteAllError(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });
  const toggleVal = useSlider();
  let navigate = useRouter();
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

            <li className="text-capitalize">Error Logs</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-0">Error Logs</h4>
                <div className="filter_dropdown flex-wrap">
                  <div className="form-group position-relative selectform mb-0">
                    <Form.Select onChange={(e) => setErrorType(e.target.value)}>
                      <option value={""}>All Error type</option>
                      <option value={constant.API}>API</option>
                      <option value={constant.APP}>App</option>
                      <option value={constant.WEB}>Web</option>
                    </Form.Select>
                  </div>

                  <Button
                    title="All Delete"
                    className="btn_orange btn btn-xl ms-2 mb-0"
                    onClick={() => {
                      handleAllDelete();
                    }}
                    style={{
                      height: "43px",
                      bottom: "-4px",
                    }}
                  >
                    <MdDelete />
                  </Button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <Table striped responsive bordered>
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>Error ID</th>
                        <th>Error Ip</th>
                        <th>Error Code</th>
                        <th>Error Name</th>
                        <th>Error type</th>
                        <th>Created On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorList?.length > 0 ? (
                        errorList?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <th scope="row">{serialNumber(page, index)}</th>
                              <td>
                                <b>{data?._id}</b>
                              </td>
                              <td>{data?.ip}</td>
                              <td>{data?.errorCode}</td>
                              <td>{truncate(data?.errorName, 15)}</td>
                              <td>{ERROR_TYPE_STATUS(data?.error_type)}</td>
                              <td>{moment(data?.createdAt).format("LLL")}</td>
                              <td>
                                <div className="action-btn">
                                  <button
                                    title="View"
                                    className="btn_green  btn btn-sm ms-2"
                                    onClick={() =>
                                      navigate.push(
                                        `/admin/page/error-logs/view/${data?._id}`
                                      )
                                    }
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    title="Delete"
                                    className="btn_orange btn btn-sm ms-2 text-white"
                                    onClick={() => {
                                      handleSingleDelete(data?._id);
                                    }}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center">
                            <NoDataFound />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                <Pagination
                  totalCount={meta?.totalCount}
                  handelPageChange={(e) => setPage(e.selected + 1)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {(isFetching || deleteMutation?.isPending || isPending) && <Loading />}
    </>
  );
};

export default ErrorLogs;
