"use client";
import NoDataFound from "@/app/components/no-data-found/page";
import { Pagination } from "@/app/components/Pagination";
import UserSidebar from "@/app/components/UserSidebar";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import "react-international-phone/style.css";
import Swal from "sweetalert2";
import useDetails from "../../../../hooks/useDetails";
import {
  DEFAULT_ADDRESSS_MARKED,
  DELETE_ADDRESS,
  USER_ADDRESS_LIST,
} from "../../../../services/APIServices";
import { constant, Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import Header from "../../../../utils/Header";
import { AddressType, GenderType } from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Breadcrums from "../../components/Breadcrums";
import "../cart/page.scss";
import AddressModal from "./AddressModal";
import { trans } from "../../../../utils/trans";

const Address = () => {
  let detail = useDetails();
  const [show1, setShow1] = useState(false);
  const [id, setId] = useState();
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [addressListsUsers, setAddressListsUsers] = useState([]);

  useEffect(() => {
    getData(page);
  }, [page]);

  const getData = async () => {
    try {
      const response = await USER_ADDRESS_LIST(page);
      if (response?.status == 200) {
        setAddressListsUsers(response?.data?.data);
        setMeta(response?.data?._meta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_ADDRESS(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this address!",
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

  const stateMutation = useMutation({
    mutationFn: (body) => DEFAULT_ADDRESSS_MARKED(body?.data?._id, body?.body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page);
    },
  });
  const childRef = useRef();
  const callChildFunction = () => {
    if (childRef.current) {
      childRef.current.showModal(); // Call the child's handleShow function
    }
  };

  let language = localStorage.getItem("language");
  const Home = trans('home');
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}
      <Breadcrums firstLink={Home} secondLink={"Address"}
        language={language}
      />
      <section className="cart-main checkout">
        <Container>
          <Row>
            <Col lg={12}></Col>
          </Row>
          <Row>
            <Col lg={3}>
              <UserSidebar />
            </Col>
            <Col lg={9}>
              <div className="address-wrap">
                {addressListsUsers?.length !== 0 ? (
                  <div className="title-box mb-4">
                    <h4>Select Delivery Address</h4>
                  </div>
                ) : (
                  ""
                )}

                <div className="row g-3 g-md-4">
                  <div className="col-12 col-xl-6">
                    <div
                      className="address-box add-new d-flex flex-column gap-2 align-items-center justify-content-center"
                      onClick={() => {
                        callChildFunction();
                      }}
                    >
                      <span className="plus-icon">
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
                          className="feather feather-plus"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </span>
                      <h4 className="theme-color font-xl fw-500">
                        Add New Address
                      </h4>
                    </div>
                    <AddressModal
                      show1={show1}
                      handleClose1={handleClose1}
                      getData={getData}
                      page={page}
                      id={id}
                      handleShow1={handleShow1}
                      ref={childRef}
                    />
                  </div>
                  {addressListsUsers?.length !== 0 ? (
                    addressListsUsers?.map((data) => {
                      return (
                        <div className="col-12 col-xl-6" key={data?._id}>
                          <div className="address-box">
                            <div className="radio-box">
                              <span className="badges badges-pill badges-theme">
                                {AddressType(data?.type)}
                              </span>

                              <div className="option-wrap">
                                <span
                                  className="edit"
                                  onClick={() => {
                                    handleShow1();
                                    setId(data?._id);
                                  }}
                                >
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
                                    className="feather feather-edit"
                                  >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </span>
                                <span
                                  className="delet ms-0"
                                  data-bs-toggle="modal"
                                  data-bs-target="#Deletemodal"
                                  onClick={() => handleDelete(data?._id)}
                                >
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
                                    className="feather feather-trash"
                                  >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </span>
                              </div>
                            </div>
                            <div className="address-detail">
                              <p className="content-color font-default">
                                {data?.name}
                              </p>
                              <p className="content-color font-default">
                                {data?.area}
                              </p>

                              <span className="content-color font-default">
                                Mobile:{" "}
                                <span className="title-color font-default fw-500">
                                  {data?.countryCode + " " + data?.mobile}
                                </span>
                              </span>
                              <span className="content-color font-default mt-1">
                                Gender:{" "}
                                <span className="title-color font-default fw-500">
                                  {GenderType(data?.gender)}
                                </span>
                              </span>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="content-color font-default mt-1">
                                  E-mail:{" "}
                                  <span className="title-color font-default fw-500">
                                    {" "}
                                    {data?.email}
                                  </span>
                                </span>
                                <div className="default">
                                  {data?.isDefault ? (
                                    "Default address"
                                  ) : (
                                    <Form.Group controlId="formBasicCheckbox">
                                      <Form.Check
                                        name="isDefault"
                                        type="radio"
                                        label={
                                          data?.isDefault == false
                                            ? "Mark as Default"
                                            : "Default"
                                        }
                                        onClick={(e) => {
                                          let body = {
                                            isDefault: true,
                                          };
                                          stateMutation.mutate({ data, body });
                                        }}
                                        disabled={data?.isDefault == true}
                                      />
                                    </Form.Group>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <NoDataFound />
                  )}
                </div>

                {Math.ceil(meta?.totalCount / 10) > 1 && (
                  <Pagination
                    totalCount={meta?.totalCount}
                    handelPageChange={(e) => setPage(e.selected + 1)}
                  />
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </>
  );
};
export default Address;
