"use client";
import UserSidebar from "@/app/components/UserSidebar";
import NoDataFound from "@/app/no-data-found/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Container, Row } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { ShimmerPostItem } from "react-shimmer-effects";
import Swal from "sweetalert2";
import {
  GET_USERS_CARD_DELETE,
  GET_USERS_CARD_LIST,
} from "../../../../services/APIServices";
import Footer from "../../../../utils/Footer";
import { toastAlert } from "../../../../utils/SweetAlert";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Breadcrums from "../../components/Breadcrums";
import "../dashboard/page.scss";

const Card = () => {
  const {
    data: allCardList,
    refetch,
    isPending
  } = useQuery({
    queryKey: ["card-all-list"],
    queryFn: async () => {
      const resp = await GET_USERS_CARD_LIST();
      return resp?.data?.data ?? [];
    },
  });
  const { mutate } = useMutation({
    mutationFn: (id) => GET_USERS_CARD_DELETE(id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this email!",
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

  let language = localStorage.getItem("language");
  const Home = trans("home");
  return (
    <>
      <div>
        <UserLogInHeader />
        <div>
          <Breadcrums
            firstLink={Home}
            secondLink={"Payment Saved Cards"}
            language={language}
          />
        </div>
        <section>
          <Container>
            <Row>
              <Col lg={12}></Col>
            </Row>
            <Row>
              <Col lg={3}>
                <UserSidebar />
              </Col>
              <Col lg={9} className="mt-lg-0 mt-4">
                <div className="dashboard-right-box">
                  <div className="notification-tab">
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                      <div className="sidebar-title">
                        <h4>Payment Saved Cards</h4>
                      </div>
                    </div>
                    <div className="payment-section">
                      <Row>
                        {isPending ? (


                          Array.from({ length: 2 }, (_, index) => (
                            <Col lg={6} className="mb-3"><ShimmerPostItem
                              card
                              title
                              cta
                              imageType="thumbnail"
                              imageWidth={80}
                              imageHeight={80}
                              contentCenter
                            /> </Col>
                          ))


                        ) : ""}
                        {allCardList?.length !== 0 ? (
                          allCardList?.map((data) => {
                            return (


                              <Col lg={6} className="mb-3">

                                <div className="payment-card">
                                  <div className="bank-info d-flex aligm-items-center justify-content-between">
                                    <div className="card-type">
                                      {data?.brand}
                                    </div>
                                    <Button
                                      title="Delete"
                                      className="btn_orange btn btn-sm ms-2"
                                      onClick={() => handleDelete(data?.id)}
                                    >
                                      <MdDelete />
                                    </Button>
                                  </div>

                                  <div className="card-details my-4">
                                    <span>Card Number</span>
                                    <h5>XXXX XXXX XXXX {data?.last_four}</h5>
                                  </div>
                                  <div className="card-details wrap d-flex aligm-items-center justify-content-between">
                                    <div className="card-details">
                                      <span>Name On Card</span>
                                      <h5>{data?.name}</h5>
                                    </div>
                                    <div className="text-center card-details">
                                      <span>Validity</span>
                                      <h5>
                                        {data?.exp_month}/{data?.exp_year}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              </Col>

                            );
                          })
                        ) : (
                          <NoDataFound />
                        )}
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        <Footer />
      </div>
    </>
  );
};
export default Card;
