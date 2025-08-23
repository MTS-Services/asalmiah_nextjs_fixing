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
import { GET_MY_TRANSACTIONS } from "../../../../services/APIServices";
import { Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import {
  FORMAT_NUMBER,
  formatCurrency,
  paymentStatus,
  serialNumber,
  transactionStatus,
} from "../../../../utils/helper";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import useCountryState from "../../../../hooks/useCountryState";
export default function page() {
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const selectedCountry = useCountryState()
  const { data: transactionsList, refetch } = useQuery({
    queryKey: ["transactions-all-list", page],
    queryFn: async () => {
      const resp = await GET_MY_TRANSACTIONS(page);

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
        <Breadcrums firstLink={Home} secondLink={"Transactions"}
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
                    <h4>Transactions</h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sn.</th>
                          <th>OrderId</th>
                          <th>Price <span className="notranslate">({formatCurrency("", selectedCountry)})</span></th>
                          <th>Payment Type</th>
                          <th>Status</th>
                          <th>Created On</th>
                        </tr>
                      </thead>
                      <tbody className="gridjs-tbody">
                        {transactionsList?.length !== 0 ? (
                          transactionsList?.map((data, index) => {
                            return (
                              <tr key={data?._id}>
                                <td>{serialNumber(page, index)}</td>
                                <td>
                                  <Link
                                    href={`/order-details/${data?.orderDetails?._id}`}
                                  >
                                    {data?.orderDetails?.orderId}
                                  </Link>
                                </td>
                                <td className="notranslate">{formatCurrency(FORMAT_NUMBER(data?.amount), selectedCountry)}</td>
                                <td>
                                  {data?.orderDetails?.walletAmount &&
                                    data?.paymentType == 1
                                    ? "Wallet and " +
                                    paymentStatus(data?.paymentType)
                                    : data?.orderDetails?.walletAmount &&
                                      data?.paymentType !== 1
                                      ? "Wallet"
                                      : paymentStatus(data?.paymentType)}
                                </td>
                                <td>{transactionStatus(data?.status)}</td>
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
