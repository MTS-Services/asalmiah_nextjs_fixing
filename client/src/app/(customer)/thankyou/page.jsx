"use client";

import UserLogInHeader from "../../../../utils/UserLogInHeader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Col, Container, Row } from "react-bootstrap";
import useDetails from "../../../../hooks/useDetails";
import { constant } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import Header from "../../../../utils/Header";

export default function ThankYou() {
  let detail = useDetails();
  let router = useRouter();

  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}{" "}
      {/* <Breadcrums firstLink={"Home"} secondLink={"Thank You"} /> */}
      <Container className="text-center mt-5 company-list-card">
        <Row>
          <Col>
            <h1>Thank You for Your Order!</h1>
            <Image
              src={"/assets/img/thankyou.jpg"}
              alt="Thank You"
              className="img-fluid my-4"
              height={300}
              width={500}
            />
            <p>Your order has been successfully placed.</p>
            <button
              className="btn btn-theme m-2"
              onClick={() => router.push("/")}
            >
              Go Back to Home
            </button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}
