"use client";
import Breadcrums from "@/app/components/Breadcrums";
import { Pagination } from "@/app/components/Pagination";
import UserSidebar from "@/app/components/UserSidebar";
import NoDataFound from "@/app/no-data-found/page";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  GET_MY_REFUND
} from "../../../../services/APIServices";
import { Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import {
  formatCurrency,
  paymentReturnStatus,
  serialNumber
} from "../../../../utils/helper";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import { trans } from "../../../../utils/trans";
import useCountryState from "../../../../hooks/useCountryState";

export default function page() {
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const selectedCountry = useCountryState()
  const { data: refundList,refetch } = useQuery({
    queryKey: ["refund-all-list", page],
    queryFn: async () => {
      const resp = await GET_MY_REFUND(page);

      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });


  let language = localStorage.getItem("language");
  const Home = trans('home');

  return (
    <div>
      <UserLogInHeader refetchAPI={refetch} />
      <div>
        <Breadcrums firstLink={Home} secondLink={"Refunds"}
         language={language}
        />
      </div>
      <section>
        <Container>
          <Row>
            <Col lg={3}>
              <UserSidebar />
            </Col>
            <Col lg={9} className="mt-lg-0 mt-4">
              <div className="dashboard-right-box">
                <div className="notification-tab">
                  <div className="sidebar-title">
                    <h4>Refunds</h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sn.</th>
                          <th>OrderId</th>
                          <th className="notranslate">Price ({formatCurrency("",selectedCountry)})</th>
                          <th>Refund Payment Type</th>
                          <th>Status</th>
                          <th>Created On</th>
                        </tr>
                      </thead>
                      <tbody className="gridjs-tbody">
                        {refundList?.length !== 0 ? (
                          refundList?.map((data, index) => {
                            return (
                              <tr key={data?._id}>
                                <td>{serialNumber(page, index)}</td>
                                <td>
                                  <Link
                                    href={`/order-details/${data?.orderId}`}
                                    target="_blank"
                                  >
                                    {data?.orderDetails?.orderId}
                                  </Link>
                                </td>
                                <td>{data?.amount}</td>
                                <td>
                                  {paymentReturnStatus(
                                    data?.orderDetails?.paymentReturnType
                                  )}
                                </td>
                                <td>
                                  <span className="badge bg-success">
                                    {data?.status}
                                  </span>
                                </td>
                                <td>{moment(data?.createdAt).format("LLL")}</td>
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
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </div>
  );
}
