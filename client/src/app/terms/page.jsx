"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  FaDollarSign,
  FaHandshake,
  FaMicrophone,
  FaShippingFast,
} from "react-icons/fa";
import useDetails from "../../../hooks/useDetails";
import divider from "../../../public/assets/img/divider.png";
import { staticPages } from "../../../services/APIServices";
import { constant } from "../../../utils/constants";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import Breadcrums from "../components/Breadcrums";
import { checkLanguage } from "../../../utils/helper";

const Terms = () => {
  let detail = useDetails();
  const { data: terms } = useQuery({
    queryKey: ["terms"],
    queryFn: async () => {
      const resp = await staticPages(constant?.TERMS_CONDITIONS);
      return resp?.data?.data ?? "";
    },
  });
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}
      <Breadcrums
        firstLink={"Home"}
        secondLink={checkLanguage(
          terms?.title,
          terms?.arabicTitle
        )}
      />

      <section className="about-us-section">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tf-main-area-page">
                {/* <h4 className="text-black">
                  <b>{terms?.terms}</b>
                </h4> */}
                <p
                  dangerouslySetInnerHTML={{
                    __html: checkLanguage(
                      terms?.description,
                      terms?.arabicDescription
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="features-wrapper">
                <div className="iconic-box-item icon-left-box mb-25">
                  <div className="icon">
                    <FaShippingFast />
                  </div>
                  <div className="content">
                    <h5>Free Shipping</h5>
                    <p>You get your items delivered without any extra cost.</p>
                  </div>
                </div>
                <div className="divider mb-25">
                  <Image
                    src={divider}
                    alt="image-banner"
                    className="img-fluid mx-auto d-block"
                  />
                </div>
                <div className="iconic-box-item icon-left-box mb-25">
                  <div className="icon">
                    <FaMicrophone />
                  </div>
                  <div className="content">
                    <h5>Great Support 24/7</h5>
                    <p>
                      Our customer support team is available around the clock{" "}
                    </p>
                  </div>
                </div>
                <div className="divider mb-25">
                  <Image
                    src={divider}
                    alt="image-banner"
                    className="img-fluid mx-auto d-block"
                  />
                </div>
                <div className="iconic-box-item icon-left-box mb-25">
                  <div className="icon">
                    <FaHandshake />
                  </div>
                  <div className="content">
                    <h5>Return Available</h5>
                    <p>
                      Making it easy to return any items if you&apos;re not
                      satisfied.
                    </p>
                  </div>
                </div>
                <div className="divider mb-25">
                  <Image
                    src={divider}
                    alt="image-banner"
                    className="img-fluid mx-auto d-block"
                  />
                </div>
                <div className="iconic-box-item icon-left-box mb-25">
                  <div className="icon">
                    <FaDollarSign />
                  </div>
                  <div className="content">
                    <h5>Secure Payment</h5>
                    <p>Shop with confidence knowing that our secure payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Terms;
