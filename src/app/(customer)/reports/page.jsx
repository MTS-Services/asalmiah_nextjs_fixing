"use client";
import Breadcrums from "@/app/components/Breadcrums";
import { Pagination } from "@/app/components/Pagination";
import UserSidebar from "@/app/components/UserSidebar";
import NoDataFound from "@/app/no-data-found/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import {
  DOWNLOAD_REPORTS_API,
  GET_REPORTS_API,
} from "../../../../services/APIServices";
import { Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import {
  CheckAdminDeliveryStatus,
  formatCurrency,
  serialNumber,
} from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import useCountryState from "../../../../hooks/useCountryState";

export default function page() {
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const selectedCountry = useCountryState()
  const { data: allReportsList, refetch } = useQuery({
    queryKey: ["reports-all-list", page],
    queryFn: async () => {
      const resp = await GET_REPORTS_API(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (id) => DOWNLOAD_REPORTS_API(id),
    onSuccess: (resp) => {
      if (resp?.data?.data) {
        window.open(resp?.data?.data, "_blank");
      }
      toastAlert("success", resp?.data?.message);
    },
  });



  let language = localStorage.getItem("language");
  const Home = trans('home');



  return (
    <div>
      <UserLogInHeader refetchAPI={refetch} />
      <div>
        <Breadcrums firstLink={Home} secondLink={"Reports"}
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
                    <h4>Reports</h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Sn.</th>
                          <th>OrderId</th>
                          <th>Company</th>
                          <th>Promo Discount (%)</th>
                          <th>Price <span  className="notranslate">({formatCurrency("", selectedCountry)})</span></th>
                          <th>Status</th>
                          <th>Created On</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody className="gridjs-tbody">
                        {allReportsList?.length !== 0 ? (
                          allReportsList?.map((data, index) => {
                            return (
                              <tr key={data?._id}>
                                <td>{serialNumber(page, index)}</td>
                                <td>{data?.orderId}</td>
                                <td>{data?.company}</td>
                                <td>{data?.promoDiscount ?? "-"}</td>
                                <td>{data?.total}</td>
                                <td>
                                  {CheckAdminDeliveryStatus(data?.deliveryStatus)}
                                </td>
                                <td>{moment(data?.createdAt).format("LLL")}</td>
                                <td>
                                  <div className="d-flex">
                                    <Button
                                      className="btn_green btn btn-sm ms-2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        downloadMutation.mutate(data?._id);
                                      }}
                                    >
                                      {" "}
                                      <FaDownload />
                                    </Button>

                                    {/* Active in active button  */}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="8">
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
