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
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_PROMOTION,
  GET_PROMOTION_LIST_API,
  STATE_UPDATE_PROMOTION_API,
} from "../../../../../services/APIServices";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import {
  accountTypeFunc,
  cashbackTypeFunc,
  CheckAdminState,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  getPermissionsByLabel,
  handleCopyToClipboard,
  PromoCodeStatus,
  ROLE_STATUS,
  serialNumber,
} from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import { userDetails } from "../../../../../redux/features/userSlice";
import { useDispatch } from "react-redux";

const PromotionManagement = () => {
  const isSlider = useSlider();
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  let detail = useDetails();
  const [list, setList] = useState({
    data: [],
    total: null,
    filter: "",
  });

  const { data, total, filter } = list;

  useEffect(() => {
    getData(page, search, state);
  }, [page, search, state]);
  let dispatch = useDispatch();

  const getData = async (page, search, state = "") => {
    try {
      const response = await GET_PROMOTION_LIST_API(page, search, state);
      if (response?.status === 200) {
        setList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));

        if (detail?.roleId == constant.PROMOTION_USER && response?.data?.data?.length !== 0) {
          dispatch(
            userDetails({
              ...detail,
              permission: response?.data?.data?.at(0)?.permission,
            })
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_PROMOTION(payload),
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
    mutationFn: (body) => STATE_UPDATE_PROMOTION_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state); // Ensure we fetch the updated data
    },
  });
  const onSearch = (value) => {
    getData(page, value, state);
  };


   let permissionData = localStorage.getItem("permissionStore")
  const promotionManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "promotionManagement"
  );

  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link
              href={getLinkHref(detail?.roleId, "/page")}
              className="text-black text-capitalize"
            >
              home
            </Link>
          </li>
          <li>/</li>

          <li className="text-capitalize">Promotion management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Promotion Management</h4>

              <div className="filter_dropdown flex-wrap">
                {(promotionManagementPermissions?.at(0)?.value?.add === true &&
                  detail?.roleId === constant.PROMOTION_USER) ||
                  detail?.roleId == constant.ADMIN ? (
                  <Link
                    href={getLinkHref(
                      detail?.roleId,
                      `/page/promotion-management/add`
                    )}
                    className="btn_theme"
                  >
                    Add Promotion
                  </Link>
                ) : (
                  ""
                )}

                <div className="form-group position-relative selectform mb-0">
                  <DebounceEffect onSearch={onSearch} />
                </div>
                <div className="form-group position-relative selectform mb-0">
                  <Form.Select onChange={(e) => setState(e.target.value)}>
                    <option value={""}>All</option>
                    <option value={constant?.ACTIVE}>Active</option>
                    <option value={constant?.INACTIVE}>Inactive</option>
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
                      <th>Promotion Code</th>

                      <th>Type</th>
                      <th>Cashback Type</th>
                      <th>Action Type</th>
                      <th>Min Purchase Amount</th>
                      <th>Max Discount Amount</th>
                      <th>Discount (%)</th>
                      <th>Amount</th>
                      <th>Number Of user count</th>
                      <th>Free Delivery</th>
                      {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}
                      <th>Created On</th>
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
                              <span
                                onClick={() =>
                                  handleCopyToClipboard(data?.promoCode)
                                }
                                style={{ cursor: "pointer" }}
                                className="notranslate"
                              >
                                {data?.promoCode}
                                {/* <FaCopy /> */}
                              </span>
                            </td>

                            <td>{PromoCodeStatus(data?.type)}</td>
                            <td>
                              {accountTypeFunc(data?.cashBackType) ?? "-"}
                            </td>
                            <td>{cashbackTypeFunc(data?.actionType)}</td>
                            <td>
                              {formatCurrency(
                                data?.minPurchaseAmount,
                                data?.country ?? "-"
                              )}
                            </td>
                            <td>
                              {formatCurrency(
                                data?.maxDiscountAmount,
                                data?.country ?? "-"
                              )}
                            </td>
                            <td>

                              {data?.cashBackType == 1 ? formatCurrency(
                                data?.cashBackType == 1 ? data?.discount : "",
                                data?.country ?? "-"
                              ) : "-"}
                            </td>
                            <td>
                              {data?.cashBackType == 2 ? formatCurrency(
                                data?.cashBackType == 2 ? data?.discount : "",
                                data?.country ?? "-"
                              ) : "-"}
                            </td>
                            <td>{data?.numberOfUsed}</td>
                            <td>{data?.forFreeDelivery ? "Yes" : "No"}</td>
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.createdBy?.roleId !== constant.ADMIN) {
                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.createdBy?._id, ROLE_STATUS(data?.createdBy?.roleId)))


                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, `/page/profile`))


                                }
                              }}>  {data?.createdBy?.fullName}</Link>

                            </td> : ""}
                            <td>{moment(data?.createdAt).format("LLL")}</td>
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.updatedBy?.roleId !== constant.ADMIN) {

                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.updatedBy?._id, ROLE_STATUS(data?.updatedBy?.roleId)))



                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, `/page/profile`))

                                }
                              }}>  {data?.updatedBy?.fullName}</Link>

                            </td> : ""}
                            {detail?.roleId == constant.ADMIN ? <td>{moment(data?.updatedAt).format("LLL")}</td> : ""}


                            <td>{CheckAdminState(data?.stateId)}</td>

                            <td>
                              <div className="d-flex">
                                {(promotionManagementPermissions?.at(0)?.value
                                  ?.view == true &&
                                  detail?.roleId === constant.PROMOTION_USER) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(
                                      detail?.roleId,
                                      `/page/promotion-management/view/${data?._id}`
                                    )}
                                  >
                                    {" "}
                                    <Button
                                      className="btn_green btn btn-sm ms-2"
                                      title="View"
                                    >
                                      <FaEye />
                                    </Button>{" "}
                                  </Link>
                                ) : (
                                  ""
                                )}

                                {(promotionManagementPermissions?.at(0)?.value
                                  ?.edit == true &&
                                  detail?.roleId === constant.PROMOTION_USER) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(
                                      detail?.roleId,
                                      `/page/promotion-management/edit/${data?._id}`
                                    )}
                                  >
                                    {" "}
                                    <Button
                                      title="Edit"
                                      className="btn_blue btn btn-sm ms-2"
                                    >
                                      <MdCreate />
                                    </Button>{" "}
                                  </Link>
                                ) : (
                                  ""
                                )}

                                {(promotionManagementPermissions?.at(0)?.value
                                  ?.active == true &&
                                  detail?.roleId === constant.PROMOTION_USER) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  data?.stateId === constant?.ACTIVE ? (
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
                                  )
                                ) : (
                                  ""
                                )}

                                {(promotionManagementPermissions?.at(0)?.value
                                  ?.delete == true &&
                                  detail?.roleId === constant.PROMOTION_USER) ||
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

export default PromotionManagement;
