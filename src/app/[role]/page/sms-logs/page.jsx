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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  adminGetAllSMS,
  deleteAllSMS,
  deleteSingleSMS,
} from "../../../../../services/APIServices";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { Paginations } from "../../../../../utils/constants";
import { getLinkHref, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import Loading from "../loading";
import { userDetails } from "../../../../../redux/features/userSlice";

const SMSLogs = ({ params }) => {
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const {
    data: smsList,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["sms-logs", page, search], // Include searchValue in the queryKey
    queryFn: async () => {
      const resp = await adminGetAllSMS(page, search); // Pass parameters to the API call
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  // Single log delete

  const handleSingleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the sms log!",
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
    mutationFn: (payload) => deleteSingleSMS(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  // All log delete

  const handleAllDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete all the SMS logs!",
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
    mutationFn: () => deleteAllSMS(),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });
  let queryClient = useQueryClient();
  const toggleVal = useSlider();
  let navigate = useRouter();
  const onSearch = (value) => {
    setSearch(value);
    // queryClient.setQueryData(['sms-logs'],page, value)
  };

  let detail = userDetails()
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

            <li className="text-capitalize">SMS Logs</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-0">SMS Logs</h4>
                <div className="filter_dropdown flex-wrap">
                  <div className="form-group position-relative selectform mb-0">
                    <DebounceEffect onSearch={onSearch} />
                  </div>
                  {smsList?.length !== 0 ? (
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
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <Table striped responsive bordered>
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>To</th>
                        <th>From</th>
                        <th>Created On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smsList?.length > 0 ? (
                        smsList?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <th scope="row">{serialNumber(page, index)}</th>
                              <td>
                                <b>{data?.to}</b>
                              </td>
                              <td>
                                <b>{data?.from}</b>
                              </td>
                              <td>{moment(data?.createdAt).format("LLL")}</td>
                              <td>
                                <div className="action-btn">
                                  <button
                                    title="View"
                                    className="btn_green  btn btn-sm ms-2"
                                    onClick={() =>
                                      navigate.push(
                                        getLinkHref(detail?.roleId, `/page/sms-logs/view/${data?._id}`
                                        ))
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

export default SMSLogs;
