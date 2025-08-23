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
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import { adminGetAllactivity } from "../../../../../services/APIServices";
import { constant } from "../../../../../utils/constants";
import { getLinkHref } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";

const ActivityLogs = ({ params }) => {
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
      const response = await adminGetAllactivity(
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
  let detail = useDetails()
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

            <li className="text-capitalize">Login Activity</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-0">Login Activity</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>IP</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="gridjs-tbody">
                      {emailQueueState?.data?.length > constant?.ZERO ? (
                        emailQueueState?.data?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td key={index}>{data?._id}</td>
                              <td>{data?.userIP}</td>
                              <td>{moment(data?.createdAt).format("LLL")}</td>
                              <td>{data?.state == 1 ? "Success" : "Failed"}</td>
                              <td>
                                <div className="d-flex">
                                  <Link
                                    href={getLinkHref(detail?.roleId,`/page/activity-logs/view/${data?._id}`)}


                                  >
                                    <Button
                                      title="View"
                                      className="btn_green  btn btn-sm ms-2"
                                    >
                                      <FaEye />
                                    </Button>
                                  </Link>
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

export default ActivityLogs;
