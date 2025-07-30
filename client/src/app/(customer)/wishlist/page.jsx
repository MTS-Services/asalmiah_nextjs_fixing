"use client";
import NoDataFound from "@/app/components/no-data-found/page";
import { Pagination } from "@/app/components/Pagination";
import UserSidebar from "@/app/components/UserSidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Col, Container, Nav, Row, Tab, Table } from "react-bootstrap";
import { RxCrossCircled } from "react-icons/rx";
import useDetails from "../../../../hooks/useDetails";
import { ADD_WISHLIST, GET_WISHLIST } from "../../../../services/APIServices";
import { constant, Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import Header from "../../../../utils/Header";
import { toastAlert } from "../../../../utils/SweetAlert";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Breadcrums from "../../components/Breadcrums";
import "../cart/page.scss";
import "./pages.scss";
import { formatCurrency } from "../../../../utils/helper";
import useCountryState from "../../../../hooks/useCountryState";
const Whislist = () => {
  let detail = useDetails();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [type, setType] = useState(1);
  const { data: wishlistData, refetch } = useQuery({
    queryKey: ["wishlist-data", page, type],
    queryFn: async () => {
      const resp = await GET_WISHLIST(page, type);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  let language = localStorage.getItem("language");
  const Home = trans("home");
  const selectedCountry = useCountryState();
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}{" "}
      <Breadcrums
        firstLink={Home}
        secondLink={"Wishlist"}
        language={language}
      />
      <section className="whislist-main">
        <Container>
          <Row>
            <Col lg={12}></Col>
          </Row>
          <Row>
            <Col lg={3}>
              <UserSidebar />
            </Col>
            <Col lg={9} className="mt-lg-0 mt-4">
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Nav
                  variant="pills"
                  className="d-flex justify-content-start custompill"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="first" onClick={() => setType(1)}>
                      Products
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second" onClick={() => setType(2)}>
                      Company
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div className="table-responsive">
                      <Table className="border-0">
                        <tbody>
                          {wishlistData?.length !== 0 ? (
                            wishlistData?.map((data) => {
                              return (
                                <tr key={data?._id}>
                                  <td>
                                    <div className="d-flex align-items-center gap-3">
                                      <div className="product-thumbnail">
                                        <Image
                                          src={
                                            data?.productDetails?.productImg[0]
                                              ?.url
                                          }
                                          alt="product-img"
                                          height={100}
                                          width={100}
                                        />
                                      </div>
                                      <Link
                                        href="#"
                                        className="text-decoration-none text-black"
                                      >
                                        {data?.productDetails?.productName}
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="product-name"></td>
                                  <td className="notranslate">
                                    {formatCurrency(
                                      data?.productDetails?.price
                                        ? data?.productDetails?.price
                                        : data?.productDetails?.size[0].price,
                                      selectedCountry
                                    )}
                                  </td>
                                  <td>
                                    {data?.productDetails?.quantity > 0
                                      ? "In-stock"
                                      : "Out-Stock"}
                                  </td>

                                  <td className="remove-col">
                                    <div
                                      className="btn-remove"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        let body = {
                                          productId: data?.productDetails?._id,
                                          type: "1",
                                          isWishlist: false,
                                          web: true,
                                        };
                                        wishlistMutation?.mutate(body);
                                      }}
                                    >
                                      <RxCrossCircled />
                                    </div>
                                  </td>
                                  <td className="text-end">
                                    <Link
                                      href={`/product-detail/${data?.productDetails?._id}`}
                                      className="btn btn-theme text-capitalize"
                                      title="View Product"
                                    >
                                      View Product
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <NoDataFound />
                          )}

                        </tbody>
                      </Table>

                    </div>
                    {Math.ceil(meta?.totalCount / 10) > 1 && (

                      <Pagination
                        totalCount={meta?.totalCount}
                        handelPageChange={(e) => setPage(e.selected + 1)}
                      />

                    )}
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    {" "}
                    <div className="table-responsive">
                      <Table className="border-0">
                        <tbody>
                          {wishlistData?.length !== 0 ? (
                            wishlistData?.map((data) => {
                              return (
                                <tr key={data?._id}>
                                  <td>
                                    <div className="d-flex align-items-center gap-3">
                                      <div className="product-thumbnail">
                                        <Image
                                          src={data?.companyDetails?.logo}
                                          alt="product-img"
                                          height={100}
                                          width={100}
                                        />
                                      </div>
                                      <Link
                                        href="#"
                                        className="text-decoration-none text-black"
                                      >
                                        {data?.companyDetails?.company}
                                      </Link>
                                    </div>
                                  </td>

                                  <td className="remove-col">
                                    <div
                                      className="btn-remove"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        let body = {
                                          companyId: data?.companyDetails?._id,
                                          type: "2",
                                          isWishlist: false,
                                          web: true,
                                        };
                                        wishlistMutation?.mutate(body);
                                      }}
                                    >
                                      <RxCrossCircled />
                                    </div>
                                  </td>
                                  <td className="text-end">
                                    <Link
                                      href={`/product-list?companyId=${data?.companyDetails?._id}`}
                                      className="btn btn-theme text-capitalize"
                                      title="View Product"
                                    >
                                      View Products
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <NoDataFound />
                          )}
                         
                        </tbody>
                      </Table>
                      
                    </div>
                    {Math.ceil(meta?.totalCount / 10) > 1 && (
                            <Pagination
                              totalCount={meta?.totalCount}
                              handelPageChange={(e) => setPage(e.selected + 1)}
                            />
                          )}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};
export default Whislist;
