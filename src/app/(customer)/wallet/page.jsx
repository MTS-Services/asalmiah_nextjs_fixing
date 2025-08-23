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
import { GET_WALLET_LIST } from "../../../../services/APIServices";
import { Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import { FORMAT_NUMBER, formatCurrency, serialNumber } from "../../../../utils/helper";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import useCountryState from "../../../../hooks/useCountryState";

export default function page() {
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const selectedCountry = useCountryState()
  const { data: walletList,refetch } = useQuery({
    queryKey: ["wallet-all-list", page],
    queryFn: async () => {
      const resp = await GET_WALLET_LIST(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  let language = localStorage.getItem("language");
  const Home = trans("home");
  return (
    <div>
      <UserLogInHeader refetchAPI={refetch}  />
      <div>
        <Breadcrums
          firstLink={Home}
          secondLink={"Wallet"}
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
                    <h4>Wallet</h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sn.</th>
                          <th>OrderId</th>
                          <th>Cashback Price <span className="notranslate">({formatCurrency("",selectedCountry)})</span></th>
                          <th>Cashback Dr <span className="notranslate">({formatCurrency("",selectedCountry)})</span></th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Created On</th>
                        </tr>
                      </thead>
                      <tbody className="gridjs-tbody">
                        {walletList?.length !== 0 ? (
                          walletList?.map((data, index) => {
                            return (
                              <tr key={data?._id}>
                                <td>{serialNumber(page, index)}</td>
                                <td>
                                  <Link
                                    href={
                                      data?.orderDetails?.orderId
                                        ? `/order-details/${data?.orderDetails?._id}`
                                        : "#"
                                    }
                                  >
                                    {data?.orderDetails?.orderId ?? "-"}
                                  </Link>
                                </td>
                                <td>
                                  {data?.cashBack
                                    ? FORMAT_NUMBER(data?.cashBack)
                                    : "-"}
                                </td>
                                <td>
                                  {data?.cashBackDr
                                    ? FORMAT_NUMBER(data?.cashBackDr)
                                    : "-"}
                                </td>
                                <td>
                                  {data?.startDate
                                    ? moment(data?.startDate).format("ll")
                                    : "-"}
                                </td>
                                <td>
                                  {data?.endDate
                                    ? moment(data?.endDate).format("ll")
                                    : "-"}
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
