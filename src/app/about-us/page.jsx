"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import useDetails from "../../../hooks/useDetails";
import about1 from "../../../public/assets/img/about-1.jpg";
import { staticPages } from "../../../services/APIServices";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import { constant } from "../../../utils/constants";
import { checkLanguage } from "../../../utils/helper";
import { trans } from "../../../utils/trans";
import Breadcrums from "../components/Breadcrums";

const AboutUs = () => {
  let detail = useDetails();
  const { data: about } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const resp = await staticPages(constant?.ABOUT_US);
      return resp?.data?.data ?? "";
    },
  });

  let language = localStorage.getItem("language");
  const Home = trans('home');
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}
      <Breadcrums
        firstLink={Home}
        secondLink={checkLanguage(about?.title, about?.arabicTitle)}
        language={language}
      />
      <section className="about-us-section">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="section-image-box style-one mb-50">
                <div className="image-one">
                  <Image
                    src={about1}
                    alt="image-banner"
                    className="img-fluid mx-auto d-block"
                  />
                  <div className="img-shape"></div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="section-content-box style-one">
                <div className="section-title mb-30">
                </div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: checkLanguage(
                      about?.description,
                      about?.arabicDescription
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
