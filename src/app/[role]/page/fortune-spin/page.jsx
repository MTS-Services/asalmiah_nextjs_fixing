"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBan, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_SPIN_API,
  GET_SPIN_API,
  STATE_UPDATE_SPIN_API,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import {
  CheckAdminEnable,
  CheckAdminState,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  ROLE_STATUS,
  serialNumber,
  SpinType,
} from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import Image from "next/image";
import useCountryState from "../../../../../hooks/useCountryState";
import useDetails from "../../../../../hooks/useDetails";

const FortuneSpin = () => {
  const isSlider = useSlider();
  const selectedCountry = useCountryState();

  const detail = useDetails();
  const navigate = useRouter();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");

  const [list, setList] = useState({
    data: [],
    total: null,
    filter: "",
  });

  const { data, total, filter } = list;

  useEffect(() => {
    getData(page, search, state);
  }, [page, search, state]);

  const getData = async (page, search, state = "") => {
    try {
      const response = await GET_SPIN_API(page, search, state);
      if (response?.status === 200) {
        setList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_SPIN_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state); // Ensure we fetch the updated data
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

  const handleToggleState = (id, state) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to update the status !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#378ce7",
        cancelButtonColor: "#d33",
        confirmButtonText:
          state == constant?.ACTIVE ? "Yes, Active it !" : "Yes, Inactive it !",
      }).then(async (result) => {
        if (result.isConfirmed) {
          stateMutation?.mutate({ id, state });
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const stateMutation = useMutation({
    mutationFn: (body) => STATE_UPDATE_SPIN_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state); // Ensure we fetch the updated data
    },
  });

  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>

          <li className="text-capitalize">Fortune Spin management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Fortune Spin</h4>

              <div className="filter_dropdown flex-wrap">
                <Link

                  href={getLinkHref(detail?.roleId, '/page/fortune-spin/add')}
                  className="btn_theme"
                >
                  Add Fortune Spin
                </Link>
                {/* <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    className="h-100"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && getData(page, e.target.value, state)}
                    onKeyUp={(e) => e.target.value === "" && getData(page, "", state)}
                  />
                </div> */}
                <div className="form-group position-relative selectform mb-0">
                  <Form.Select onChange={(e) => setState(e.target.value)}>
                    <option value={""}>All</option>
                    <option value={constant?.ENABLE}>Enable</option>
                    <option value={constant?.DISABLE}>Disable</option>
                  </Form.Select>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Image</th>
                      <th>Spin Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Min Amount ({formatCurrency("", selectedCountry)})</th>
                      <th>Max Cash Back</th>
                      <th>Size</th>
                      <th>Free Delivery</th>
                      <th>Created On</th>
                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}

                      {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                      {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {data?.length !== 0 ? (
                      data?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>
                              <div className="table-user d-flex align-items-center">
                                <span className="table-user-icon">
                                  <Image
                                    src={data?.spinnerImg}
                                    alt="no category-image found"
                                    height={50}
                                    width={50}
                                  />
                                </span>
                              </div>
                            </td>

                            <td>{SpinType(data?.spinType)}</td>
                            <td>{moment(data?.startDate).format("lll")}</td>
                            <td>{moment(data?.endDate).format("lll")}</td>
                            <td>{data?.minAmount ?? "-"}</td>
                            <td>{data?.maxCashBack ?? "-"}</td>
                            <td>{data?.size ?? "-"}</td>
                            <td>{data?.forFreeDelivery ? "Yes" : "No"}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>

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
                            <td>{CheckAdminEnable(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link

                                  href={getLinkHref(detail?.roleId, `/page/fortune-spin/view/${data?._id}`)}
                                >
                                  {" "}
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    title="View"
                                  >
                                    <FaEye />
                                  </Button>{" "}
                                </Link>
                                <Link

                                  href={getLinkHref(detail?.roleId, `/page/fortune-spin/edit/${data?._id}`)}
                                >
                                  <Button
                                    title="Edit"
                                    className="btn_blue btn btn-sm ms-2"
                                  >
                                    <MdCreate />
                                  </Button>{" "}
                                </Link>

                                <Button
                                  title="Delete"
                                  onClick={() => handleDelete(data?._id)}
                                  className="btn_orange btn btn-sm ms-2"
                                >
                                  <MdDelete />
                                </Button>

                                {data?.stateId === constant?.ACTIVE ? (
                                  <Button
                                    className="btn_blue2 btn btn-sm ms-2"
                                    title="Inactive"
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.INACTIVE
                                      )
                                    }
                                  >
                                    <FaBan />
                                  </Button>
                                ) : (
                                  <Button
                                    className="btn_block btn btn-sm ms-2"
                                    title="Active"
                                    onClick={() =>
                                      handleToggleState(
                                        data?._id,
                                        constant?.ACTIVE
                                      )
                                    }
                                  >
                                    <FaCheck />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="15">
                          <NoDataFound />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {Math.ceil(list?.total / 10) > 1 && (
                <Pagination
                  totalCount={list?.total}
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

export default FortuneSpin;
