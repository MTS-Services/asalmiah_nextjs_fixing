"use client";

import { Pagination } from "@/app/components/Pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye } from "react-icons/fa";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { AsyncPaginate } from "react-select-async-paginate";
import useSlider from "../../../../../hooks/useSlider";
import {
  GET_COMPANY_API,
  GET_ORDER_API,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import {
  CheckAdminDeliveryStatus,
  filterPassedTime,
  FORMAT_NUMBER,
  formatCurrency,
  getLinkHref,
  getPermissionsByLabel,
  serialNumber,
} from "../../../../../utils/helper";
import NoDataFound from "../../../no-data-found/page";
import useDetails from "../../../../../hooks/useDetails";

const Ordermanagement = () => {
  const isSlider = useSlider();
  const detail = useDetails();

  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [deliveryStatus, setState] = useState("");
  const [companyArr, setCompanyArr] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ column: "", order: "asc" });

  const { data: orderLists, refetch } = useQuery({
    queryKey: [
      "order-list",
      page,
      deliveryStatus,
      companyArr,
      startDate,
      endDate,
      search,
    ],
    queryFn: async () => {
      const resp = await GET_ORDER_API(
        page,
        search,
        deliveryStatus,
        companyArr,
        startDate,
        endDate
      );
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(page, search, constant?.ACTIVE);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  const handleCompanyChange = (selectedOption) => {
    const companyId = selectedOption?.value;
    setCompanyArr(companyId);
  };

  const handleSortingChange = (column) => {
    if (sortConfig.column === column) {
      setSortConfig({
        column,
        order: sortConfig.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ column, order: "asc" });
    }
  };

  const sortedData = () => {
    if (!Array.isArray(orderLists)) {
      return [];
    }
    return orderLists.sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.column) {
        case "InVoice Number":
          aValue = a.orderId;
          bValue = b.orderId;
          break;
        case "Delivery Date":
          aValue = new Date(a.deliveryDate);
          bValue = new Date(b.deliveryDate);
          break;
        case "Contact Person":
          aValue = a.userDetails?.fullName.toLowerCase();
          bValue = b.userDetails?.fullName.toLowerCase();
          break;
        case "InVoice Number":
          aValue = a.orderId.toLowerCase();
          bValue = b.orderId.toLowerCase();
          break;
        case "Total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "Sub Total":
          aValue = a.subTotal;
          bValue = b.subTotal;
          break;
        case "Promotion Discount":
          aValue = a.promoDetails?.discount;
          bValue = b.promoDetails?.discount;
          break;
        default:
          return 0; // No sorting
      }

      return sortConfig.order === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  };
  let permissionData = localStorage.getItem("permissionStore")
  const orderManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,
    "orderManagement"
  );
  

  return (
    <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, `/page`)} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>

          <li className="text-capitalize">Order management</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card ">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0 p-3">Order Management</h4>

              <div className="filter_dropdown flex-wrap">
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
                    {/* <option value={constant?.ACTIVE}>Active</option>
                    <option value={constant?.INACTIVE}>Inactive</option> */}
                    <option value={constant?.ORDER_PENDING_STATUS}>
                      Pending
                    </option>
                    <option value={constant?.ORDER_SHIPPE_STATUS}>
                      Shipped
                    </option>
                    <option value={constant?.ORDER_COMPLETED_STATUS}>
                      Completed
                    </option>
                    <option value={constant?.ORDER_CANCELED_STATUS}>
                      Cancelled
                    </option>
                    <option value={constant?.ORDER_READY_STATUS}>Ready</option>
                  </Form.Select>
                </div>

                <div className="form-group position-relative selectform mb-0 select-drop ">
                  <AsyncPaginate
                    loadOptions={searchCompany}
                    onChange={handleCompanyChange}
                    additional={{
                      page: 1,
                    }}
                    isClearable
                    placeholder="Select Company"
                  />
                </div>

                <div className="form-group position-relative selectform mb-0 select-drop ">
                  <DatePicker
                    autoComplete="off"
                    name="startDate"
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setEndDate(null);
                      refetch();
                    }}
                    placeholderText="Select start Date"
                    filterTime={filterPassedTime}
                    // minDate={moment().toDate()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        refetch();
                      }
                    }}
                  />
                </div>
                <div className="form-group position-relative selectform mb-0 select-drop ">
                  <DatePicker
                    autoComplete="off"
                    name="endDate"
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => {
                      setEndDate(date);
                      refetch();
                    }}
                    placeholderText="Select end Date"
                    filterTime={filterPassedTime}
                    minDate={startDate}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        refetch();
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("InVoice Number")}
                      >
                        InVoice Number
                        {sortConfig.column === "InVoice Number" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Company</th>
                      <th>Contact Person</th>
                      <th>Contact Person Mobile Number</th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("Order Date")}
                      >
                        Order Date
                        {sortConfig.column === "Order Date" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("Delivery Date")}
                      >
                        Delivery Date
                        {sortConfig.column === "Delivery Date" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>

                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("Sub Total")}
                      >
                        Sub Total
                        {sortConfig.column === "Sub Total" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>

                      <th
                        className="cursor_pointer"
                        onClick={() => handleSortingChange("Total")}
                      >
                        Total
                        {sortConfig.column === "Total" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th
                        className="cursor_pointer"
                        onClick={() =>
                          handleSortingChange("Promotion Discount")
                        }
                      >
                        Promotion Discount
                        {sortConfig.column === "Promotion Discount" ? (
                          sortConfig.order === "asc" ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown />
                        )}
                      </th>
                      <th>Status</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody className="gridjs-tbody">
                    {sortedData().length !== 0 ? (
                      sortedData().map((data, index) => {
                        return (
                          <tr key={data?._id}>
                            <td>{serialNumber(page, index)}</td>
                            <td>{data?.orderId}</td>
                            <td>
                              <Link
                                href={getLinkHref(detail?.roleId, `/page/company-management/view/${data?.companyDetails?._id}`)}
                                target="_blank"
                              >
                                {data?.companyDetails?.company}
                              </Link>
                            </td>
                            <td>{data?.userDetails?.fullName}</td>
                            <td>
                              {data?.userDetails?.countryCode
                                ? data?.userDetails?.countryCode +
                                " " +
                                data?.userDetails?.mobile
                                : ""}
                            </td>
                            <td>{moment(data?.createdAt).format("lll")}</td>
                            <td>
                              {moment(data?.updatedAt).format("lll") ?? "-"}
                            </td>
                            <td>
                              {formatCurrency(
                                FORMAT_NUMBER(data?.subTotal),
                                data?.companyDetails?.country
                              )}
                            </td>

                            <td>
                              {" "}
                              {formatCurrency(
                                FORMAT_NUMBER(data?.total),
                                data?.companyDetails?.country
                              )}
                            </td>
                            <td>{data?.promoDetails?.discount ?? "-"}</td>
                            <td>
                              {CheckAdminDeliveryStatus(data?.deliveryStatus)}
                            </td>
                            <td>
                              <div className="d-flex">
                                {/* View Button */}
                                {/* {orderManagementPermissions?.at(0)?.value?.view && ( */}
                                {(orderManagementPermissions?.at(0)?.value
                                  ?.view == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(detail?.roleId, `/page/order-management/view/${data?._id}`)}
                                  >
                                    <Button
                                      className="btn_green btn btn-sm ms-2"
                                      title="View"
                                    >
                                      <FaEye />
                                    </Button>
                                  </Link>
                                ) : (
                                  ""
                                )}
                                {/* Add/Edit/Delete buttons can be added similarly */}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="12">
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

export default Ordermanagement;
