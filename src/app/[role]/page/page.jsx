/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import useSlider from "../../../../hooks/useSlider";
import Link from "next/link";
import {
  ADMIN_GRAPH_DATA,
  GET_COUNT_DETAIL,
} from "../../../../services/APIServices";
import { useQuery } from "@tanstack/react-query";
import { Col, Row } from "react-bootstrap";
import moment from "moment";
import { HiUserGroup } from "react-icons/hi2";
import { ERRORICON } from "@/app/components/SvgIcons";
import useDetails from "../../../../hooks/useDetails";
import { constant } from "../../../../utils/constants";
import { formatCurrency, getLinkHref } from "../../../../utils/helper";
import useCountryState from "../../../../hooks/useCountryState";

const Dashboard = () => {
  const toggleVal = useSlider();
  const selectedCountry = useCountryState();

  let detail = useDetails();
  const { data: count } = useQuery({
    queryKey: ["count"],
    queryFn: async () => {
      const res = await GET_COUNT_DETAIL();
      // setCounts(res?.data?.data)
      return res?.data?.data ?? "";
    },
  });

  const [selectedYear, setSelectedYear] = useState(moment().format("YYYY"));
  const [dashboard, setDashboard] = useState([]);

  useEffect(() => {
    getGraphCounts(selectedYear);
  }, [selectedYear]);

  const getGraphCounts = async (selectedYear) => {
    try {
      const response = await ADMIN_GRAPH_DATA(selectedYear);
      if (response?.status === 200) {
        setDashboard(response?.data?.data?.map((data) => data?.slice(0, 5)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const years = Array.from(
    { length: 50 },
    (_, index) => new Date().getFullYear() - index
  );
  const headerData = [
    "Months",
    "Total User",
    "Customers",
    "Sellers",
    "Orders",
    //  "Total Income",
  ];

  const data = [headerData, ...dashboard];
  return (
    <>
      <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
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
            <li className="text-capitalize">dashboard</li>
          </ul>
        </div>
        <div className="row widgetmain">
          <div className="col-md-6 col-lg-3">
            <Link href="#">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <p className="fw-medium text-muted mb-0">Total User</p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value" data-target="33.48">
                          {count?.totalUser ? count?.totalUser : 0}
                        </span>
                      </h2>
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-primary rounded-circle fs-2">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-users"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg> */}
                          <HiUserGroup />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* New Customer */}

          <div className="col-md-6 col-lg-3">
            <Link href="/admin/page/customer-management">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <p className="fw-medium text-muted mb-0">Customers</p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value" data-target="33.48">
                          {count?.userCount ? count?.userCount : 0}
                        </span>
                      </h2>
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-primary rounded-circle fs-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-users"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Total sellers */}
          <div className="col-md-6 col-lg-3">
            <Link href="/admin/page/sales-person">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <p className="fw-medium text-muted mb-0">Sellers</p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value" data-target="97.66">
                          {count?.sellerCount ? count?.sellerCount : 0}
                        </span>
                      </h2>
                      {/* <p className="mb-0 text-muted">
                      <span className="badge bg-light text-danger mb-0">
                        <i className="ri-arrow-down-line align-middle"></i> 3.96
                        %
                      </span>{" "}
                      {lang?.VS_LAST_MONTH}
                    </p> */}
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-primary rounded-circle fs-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-users"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Total Orders */}
          <div className="col-md-6 col-lg-3">
            <Link href="/admin/page/order-management">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <p className="fw-medium text-muted mb-0">Orders</p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value" data-target="28.05">
                          {count?.totalOrders ? count?.totalOrders : 0}
                        </span>
                      </h2>
                      {/* <p className="mb-0 text-muted">
                      <span className="badge bg-light text-success mb-0">
                        16.24 %{" "}
                      </span>{" "}
                      {lang?.VS_LAST_MONTH}
                    </p> */}
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-success rounded-circle fs-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-external-link"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* New Payment */}
          <div className="col-md-6 col-lg-3">
            <Link href="/admin/page/transaction-management">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <p className="fw-medium text-muted mb-0">
                        {" "}
                        Total Transaction ({formatCurrency("", selectedCountry)})
                      </p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value" data-target="3">
                          {count?.subTotal
                            ? count?.subTotal.toFixed(2)
                            : "0.00"}
                        </span>
                      </h2>
                      {/* <p className="mb-0 text-muted">
                      <span className="badge bg-light text-danger mb-0">
                        <i className="ri-arrow-down-line align-middle"></i> 0.24
                        %
                      </span>{" "}
                      {lang?.VS_LAST_MONTH}
                    </p> */}
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-warning rounded-circle fs-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-clock"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link href="/admin/page/error-logs">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <p className="fw-medium text-muted mb-0">Error Logs</p>
                      <h2 className="mt-4 ff-secondary fw-semibold">
                        <span className="counter-value" data-target="28.05">
                          {count?.errorCount ? count?.errorCount : 0}
                        </span>
                      </h2>
                      {/* <p className="mb-0 text-muted">
                      <span className="badge bg-light text-success mb-0">
                        16.24 %{" "}
                      </span>{" "}
                      {lang?.VS_LAST_MONTH}
                    </p> */}
                    </div>
                    <div>
                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-success rounded-circle fs-2">
                          <ERRORICON />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="row widgetmain">
          <div className="col-md-12">
            <div className="card card-animate">
              <div className="card-body">
                <Row>
                  <Col xl={3} className="ms-auto mb-4">
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="form-select cursor"
                    >
                      {years?.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col xl={12}>
                    <Chart
                      chartType="Bar"
                      width="100%"
                      height="600px"
                      data={data}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Section */}
      </div>
    </>
  );
};

export default Dashboard;
