"use client";

import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBan, FaCheck, FaEye } from "react-icons/fa";
import { MdCreate, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import useSlider from "../../../../../hooks/useSlider";
import {
  DELETE_COMPANY_API,
  GET_COMPANY_API,
  GET_PROMOTION_LIST_API,
  STATE_UPDATE_COMPANY_API,
} from "../../../../../services/APIServices";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, formatCurrency, getLinkHref, serialNumber } from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import useCountryState from "../../../../../hooks/useCountryState";
import useDetails from "../../../../../hooks/useDetails";
// import useDocumentTitle from "@/utils/ useDocumentTitle";

const CompanyManagement = () => {
  const isSlider = useSlider();
  const detail = useDetails();
  const selectedCountry = useCountryState();

  const queryClient = useQueryClient();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");

  const { data: getCompanyList, refetch } = useQuery({
    queryKey: ["promotion-list", page, state],
    queryFn: async () => {
      const resp = await GET_PROMOTION_LIST_API(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_COMPANY_API(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["getcompany-list"] });
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
          state == constant?.ACTIVE ? "Yes,Active it !" : "Yes, Inactive it !",
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
    mutationFn: (body) => STATE_UPDATE_COMPANY_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });
  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Coupon-management</h4>

              <div className="filter_dropdown flex-wrap">
                <Link

                  href={getLinkHref(detail?.roleId, "/page/coupon-management/add")}

                  className="btn_theme"
                >
                  Add Coupon
                </Link>
                <div className="form-group position-relative selectform mb-0">
                  <Form.Control
                    type="text"
                    className="h-100"
                    value={search}
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && refetch()}
                    onKeyUp={(e) => e.target.value == "" && refetch()}
                  />
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
                      <th>Discount (%)</th>
                      <th>Type</th>
                      <th>Min Purchase Amount ({formatCurrency("", selectedCountry)})</th>
                      <th>Max Discount Amount ({formatCurrency("", selectedCountry)})</th>
                      <th>Number Of Used</th>
                      <th>Free Delivery</th>
                      <th>Created On</th>
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="gridjs-tbody">
                    {getCompanyList?.length !== 0 ? (
                      getCompanyList?.map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.promoCode}</td>

                            <td>{data?.discount}</td>
                            <td>{data?.type}</td>
                            <td>{data?.minPurchaseAmount ?? "-"}</td>
                            <td>{data?.maxDiscountAmount ?? "-"}</td>
                            <td>{data?.numberOfUsed}</td>
                            <td>{data?.forFreeDelivery ? "Yes" : "No"}</td>
                            <td>{moment(data?.createdAt).format("LL")}</td>
                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                <Link

                                  href={getLinkHref(detail?.roleId, `/page/coupon-management/view/${data?._id}`)}

                                >
                                  {" "}
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    title="View"
                                  >
                                    {" "}
                                    <FaEye />
                                  </Button>
                                </Link>
                                <Link

                                  href={getLinkHref(detail?.roleId, `/page/coupon-management/edit/${data?._id}`)}

                                >
                                  {" "}
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

                                {/* Active in active button  */}

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

export default CompanyManagement;
