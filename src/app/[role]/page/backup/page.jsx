/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

"use client";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaCloudDownloadAlt, FaDownload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  adminBackupList,
  adminCreateBackup,
  deleteBackup,
} from "../../../../../services/APIServices";
import { constant } from "../../../../../utils/constants";
import NoDataFound from "../../../no-data-found/page";

const Backup = ({ params }) => {
  const [emailQueueState, setEmailQueueState] = useState({
    data: [],
    total: null,
    page: 1,
  });

  useEffect(() => {
    emailQueueFunc();
  }, [emailQueueState?.page]);
  const emailQueueFunc = async () => {
    try {
      const response = await adminBackupList(
        emailQueueState?.page,
        constant?.ADMIN
      );

      if (response?.status === 200) {
        setEmailQueueState((prev) => ({
          ...prev,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVal = useSlider();

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes! Delete it !",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteBackup(id);
          if (response?.status === 200) {
            Swal.fire("Deleted!", response?.data?.message, "success");
            setEmailQueueState((prev) => ({
              ...prev,
              data: emailQueueState?.data?.filter((emailQueue) => {
                return emailQueue?._id !== id;
              }),
            }));
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handleCreateBackup = async () => {
    try {
      const response = await adminCreateBackup();
      if (response?.status === 200) {
        Swal.fire("success!", response?.data?.message, "success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downloadBackup = async (url) => {
    window.open(url);
  };

  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-0">Backup</h4>
                <Button
                  title="Create Backup"
                  className="btn_orange btn btn-sm ms-2"
                  onClick={() => handleCreateBackup()}
                >
                  <FaCloudDownloadAlt />
                </Button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Created On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="gridjs-tbody">
                      {emailQueueState?.data?.length > constant?.ZERO ? (
                        emailQueueState?.data?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td key={index}>{data?._id}</td>
                              <td>{data?.name}</td>
                              <td>{data?.size}</td>

                              <td>{moment(data?.createdAt).format("LLL")}</td>
                              <td>
                                <div className="d-flex">
                                  <Button
                                    title="Download"
                                    className="btn_green  btn btn-sm ms-2"
                                    onClick={() => downloadBackup(data?.link)}
                                  >
                                    <FaDownload />
                                  </Button>
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

                {Math.ceil(emailQueueState?.total / constant?.PER_PAGE) > 1 && (
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
                        setEmailQueueState((prev) => ({
                          ...prev,
                          page: props.selected + 1,
                        }));
                      }}
                      pageCount={Math.ceil(emailQueueState?.total / 10)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Backup;
