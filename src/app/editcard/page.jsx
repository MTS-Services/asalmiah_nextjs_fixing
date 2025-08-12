"use client";
import { Col, Container, Row } from "react-bootstrap";
import "../(customer)/dashboard/page.scss";
import Footer from "../../../utils/Footer";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import Breadcrums from "../components/Breadcrums";
import UserSidebar from "../components/UserSidebar";

const EditCard = () => {
  return (
    <>
      <div>
        <UserLogInHeader />
        <div>
          <Breadcrums firstLink={"Home"} secondLink={"Edit Bank Card"} />
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
                    <div className="sidebar-title mb-4">
                      <h4>edit Bank Card</h4>
                    </div>
                    <div className="card-detail">
                      <form>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">
                                Card Holder Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="your card name"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">Card Number</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="your card number"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">expiry date</label>
                              <input
                                type="date"
                                className="form-control"
                                placeholder="your card number"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-4">
                              <label className="form-label">cvv</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="your card number"
                              />
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div className="text-end mt-4 mb-md-0 mb-2">
                              <a
                                href="#"
                                className="bg-orange text-decoration-none text-white px-5 text-capitalize rounded py-3"
                              >
                                submit
                              </a>
                            </div>
                          </Col>
                        </Row>
                      </form>
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
export default EditCard;
