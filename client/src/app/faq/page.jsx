"use client";
import React, { useState } from "react";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useDetails from "../../../hooks/useDetails";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import { constant, Paginations } from "../../../utils/constants";
import Breadcrums from "../components/Breadcrums";
import { Container } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "./page.scss";
import { GET_FAQ_API } from "../../../services/APIServices";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "../components/Pagination";
import NoDataFound from "../components/no-data-found/page";
import { checkLanguage } from "../../../utils/helper";

export default function page() {
  let detail = useDetails();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const { data: faqListUser } = useQuery({
    queryKey: ["faq-user", page],
    queryFn: async () => {
      const resp = await GET_FAQ_API(page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? "";
    },
  });
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}{" "}
      <Breadcrums firstLink={"Home"} secondLink={"Faq's"} />
      <section className="faq-sec py-5">
        <Container>
          <Row>
            <Col lg={10} className="mx-auto">
              <div className="faq-accordions">
                <Accordion defaultActiveKey="0">
                  {faqListUser?.length !== 0 ? (
                    faqListUser?.map((data, index) => {
                      return (
                        <Accordion.Item eventKey={index} key={data?._id}>
                          <Accordion.Header>
                            {checkLanguage(
                              data?.question,
                              data?.arabicQuestion
                            )}
                          </Accordion.Header>
                          <Accordion.Body>
                            {" "}
                            {checkLanguage(data?.answer, data?.arabicAnswer)}
                          </Accordion.Body>
                        </Accordion.Item>
                      );
                    })
                  ) : (
                    <NoDataFound />
                  )}
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
        {Math.ceil(meta?.totalCount / 10) > 1 && (
          <Pagination
            totalCount={meta?.totalCount}
            handelPageChange={(e) => setPage(e.selected + 1)}
          />
        )}
      </section>
      <Footer />
    </>
  );
}
