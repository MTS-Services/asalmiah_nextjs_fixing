"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { AiFillHeart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Slider from "react-slick";
import Swal from "sweetalert2";
import useDetails from "../../hooks/useDetails";
import apple from "../../public/assets/img/a.png";
import downloadimg from "../../public/assets/img/app.png";
import googlestore from "../../public/assets/img/g.png";
import testimonial1 from "../../public/assets/img/testimonials.png";

import {
  ADD_WISHLIST,
  GET_BANNER_USER_API,
  GET_CATEGORY_LIST_HOME,
  GET_DYNAMICLABEL,
  GET_SUBCATEGORY_LIST_HOME,
  GET_USER_OFFERS,
  GET_USER_TESTIMONIAL,
  GET_USERS_DYNAMICLABEL,
} from "../../services/APIServices";
import Footer from "../../utils/Footer";
import Header from "../../utils/Header";
import ImageComponent from "../../utils/ImageComponent";
import { toastAlert } from "../../utils/SweetAlert";
import UserLogInHeader from "../../utils/UserLogInHeader";
import { constant, Paginations } from "../../utils/constants";
import { checkLanguage } from "../../utils/helper";
import { trans } from "../../utils/trans";
import OfferListComponent from "./components/OfferListComponent";
import { Pagination } from "./components/Pagination";
import {
  CATEGORYICON,
  PAYMENT_SECURE,
  PRODUCT_PACKAGING,
  REDUNDERLINE,
  REFUND_POLICY_ICON,
  SERVICES_HOME,
  SUPPORT_CARE,
} from "./components/SvgIcons";
const Home = ({ params }) => {
  const offarat = trans("offarat");
  useEffect(() => {
    // Check if localStorage is available and get the language

    document.title = offarat; // Set document title
  }, []);

  const [show, setShow] = useState(false);
  const testimonialRef = useRef(null);
  const scrollToTestimonial = () => {
    if (testimonialRef.current) {
      testimonialRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [categoryId, setCategoryId] = useState({
    id: "",
    name: "",
    arabic: "",
  });
  const [subCategoryId, setSubCategoryId] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);

  const { data: dynamicLabelling, refetch: dynamicDataRefetch } = useQuery({
    queryKey: ["dynamic-label-list"],
    queryFn: async () => {
      const resp =
        detail?.roleId == constant?.USER
          ? await GET_USERS_DYNAMICLABEL()
          : await GET_DYNAMICLABEL();
      return resp?.data?.data ?? [];
    },
  });

  /*************CATEGORY LIST **************/
  const { data: categoryList, refetch } = useQuery({
    queryKey: ["category-list-home"],
    queryFn: async () => {
      const resp = await GET_CATEGORY_LIST_HOME();
      return resp?.data?.data ?? [];
    },
  });

  /*************SUBCATEGORY LIST **************/
  const {
    data: subCategoryList,
    refetch: subCategoryRefetch,
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ["subcategory-list-home", categoryId?.id, page],
    queryFn: async () => {
      if (!categoryId?.id) {
        return null;
      }
      const resp = await GET_SUBCATEGORY_LIST_HOME(categoryId?.id, page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  /*************BANNER LIST **************/
  const { data: bannerList, refetch: bannerRefetch } = useQuery({
    queryKey: ["banner-list-home"],
    queryFn: async () => {
      const resp = await GET_BANNER_USER_API();
      return resp?.data?.data ?? [];
    },
  });

  /*************TESTIMONIAL LIST **************/
  const { data: testimonialLists } = useQuery({
    queryKey: ["testimonial-list-home"],
    queryFn: async () => {
      const resp = await GET_USER_TESTIMONIAL();
      return resp?.data?.data ?? [];
    },
  });

  const settings = {
    dots: true,
    infinite: bannerList?.length > 1 ? true : false,
    loop: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const testimonial = {
    dots: true,
    infinite: testimonialLists?.length > 1 ? true : false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  var catagories = {
    navigation: true,
    nav: true,
    arrows: true,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: (
      <button type="button" className="slick-prev">
        <FaChevronLeft />
      </button>
    ),
    nextArrow: (
      <button type="button" className="slick-next">
        <FaChevronRight />
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  let detail = useDetails();
  let router = useRouter();
  let pathName = usePathname();
  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      dynamicDataRefetch();
    },
  });

  const { data: OfferLists, refetch: refetchOfferList } = useQuery({
    queryKey: ["offer-list-home"],
    queryFn: async () => {
      const resp = await GET_USER_OFFERS();
      return resp?.data?.data ?? [];
    },
  });


  const refetchFunc = () => {
    refetch()
    dynamicDataRefetch()
    refetchOfferList()
    bannerRefetch()

  };

  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader scrollToTestimonial={scrollToTestimonial} refetchAPI={refetchFunc} />
      ) : (
        <Header scrollToTestimonial={scrollToTestimonial} refetchAPI={refetchFunc} />
      )}
      <section className="hero p-0 mb-4">
        <div className="slider-container bannerslide">
          <Slider {...settings} dots={bannerList?.length > 1 ? true : false}>
            {bannerList?.length !== 0
              ? bannerList?.map((data) => {
                return (
                  <>
                    <div className="bannersec" key={data?._id}>
                      <div className={"position-absolute right-0 bnnerimg"} onClick={(e) => {
                        e.preventDefault();
                        if (
                          data?.productId?.length == 0 &&
                          !data?.companyDetails
                        ) {
                          router.push(`/product-list`);
                        }
                        if (data?.productId?.length > 1) {
                          router.push(
                            `/product-list?companyId=${data?.company}`
                          );
                        } else {
                          if (data?.productId?.length !== 0) {
                            router.push(
                              `/product-detail/${data?.productId?.at(0)?._id
                              }`
                            );
                          } else if (data?.company) {
                            router.push(
                              `/product-list?companyId=${data?.company}`
                            );
                          }
                        }
                      }}>
                        <ImageComponent
                          // className={"position-absolute right-0 bnnerimg"}
                          data={data?.bannerImg}
                          height={100}
                          width={100}
                          alt={"image"}
                        />
                      </div>
                      <Container>
                        <Row className="m-0">
                          <Col
                            md={6}
                            className="p-0 mx-lg-0 mx-auto text-lg-start text-center d-lg-block d-none"
                          >
                            <h1 className="text-capitalize">{data?.title}</h1>
                            <p>{data?.description}</p>
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  data?.productId?.length == 0 &&
                                  !data?.companyDetails
                                ) {
                                  router.push(`/product-list`);
                                }
                                if (data?.productId?.length > 1) {
                                  router.push(
                                    `/product-list?companyId=${data?.company}`
                                  );
                                } else {
                                  if (data?.productId?.length !== 0) {
                                    router.push(
                                      `/product-detail/${data?.productId?.at(0)?._id
                                      }`
                                    );
                                  } else if (data?.company) {
                                    router.push(
                                      `/product-list?companyId=${data?.company}`
                                    );
                                  }
                                }
                              }}
                              className="btn btn-theme"
                            >
                              Shop Now
                            </Link>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </>
                );
              })
              : ""}
          </Slider>
        </div>
      </section>
      {
        categoryList?.length > 0 &&
        <section className="catagories notranslate">
          <div className="heading-section text-center mb-lg-5 mb-3">
            <Container>
              <Row>
                <Col md={6} className="mx-auto">
                  <CATEGORYICON />

                  <h3>Our Categories</h3>

                  <REDUNDERLINE />
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <div className="slider-container catslider">
              <Slider {...catagories}>
                {categoryList?.map((data) => {
                  return (
                    <div
                      className="catcard"
                      onClick={() => {
                        setCategoryId({
                          id: data?._id,
                          name: data?.category,
                          arabic: data?.arabicCategory,
                        });
                        handleShow(true);
                      }}
                      key={data?._id}
                    >
                      <ImageComponent
                        data={data?.categoryImg}
                        // width={147}
                        // height={147}
                        fill
                        className="mx-auto"
                        designImage={true}
                      />
                      <h4>

                        {checkLanguage(data?.category, data?.arabicCategory)}
                      </h4>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </Container>
        </section>
      }


      <OfferListComponent OfferLists={OfferLists} />

      {dynamicLabelling?.length !== 0
        ? dynamicLabelling?.map((data) => {
          return (
            <section className="fetures">
              <div className="heading-section text-center mb-lg-5 mb-3">
                <Container>
                  <Row>
                    <Col md={8} className="mx-auto">
                      <h3>{checkLanguage(data?.title, data?.arabicTitle)}</h3>

                      <REDUNDERLINE />
                    </Col>
                  </Row>
                </Container>
              </div>
              <Container>
                <Row>
                  {data?.company?.length !== 0
                    ? data?.company?.slice(0, 4)?.map((data) => {
                      return (
                        <Col lg={3} md={6} className="mb-3">
                          <div className="featurecard electroniccard">
                            <div
                              className="imgfeature"
                              onClick={() => {
                                router.push(`/companies/${data?._id}`);
                              }}
                            >
                              <ImageComponent
                                data={data?.logo}
                                height={100}
                                width={100}
                                dynamicLabellingState={true}
                              />
                            </div>
                            <div className="feature-content">
                              <div>
                                <h4>
                                  {checkLanguage(
                                    data?.company,
                                    data?.arabicCompany
                                  )}
                                </h4>
                              </div>

                              <div className="d-flex justify-content-between">
                                <p className=" light-font mb-0">
                                  {data?.isWishlist == true ? (
                                    <Link
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();

                                        if (
                                          detail === null ||
                                          detail === undefined
                                        ) {
                                          Swal.fire({
                                            title:
                                              "You need to login to add the company in wishlist",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#3085d6",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText: "Yes",
                                            cancelButtonText: "Cancel",
                                          }).then((result) => {
                                            if (result.isConfirmed) {
                                              router.push(
                                                `/login?pathname=${encodeURIComponent(
                                                  pathName
                                                )}`
                                              );
                                            }
                                          });
                                        } else {
                                          let body = {
                                            companyId: data?._id,
                                            type: "2",
                                            isWishlist: false,
                                            web: true,
                                          };
                                          wishlistMutation?.mutate(body);
                                        }
                                      }}
                                    >
                                      <AiFillHeart />
                                    </Link>
                                  ) : (
                                    <Link
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (
                                          detail === null ||
                                          detail === undefined
                                        ) {
                                          Swal.fire({
                                            title:
                                              "You need to login to add the company in wishlist",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#3085d6",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText: "Yes",
                                            cancelButtonText: "Cancel",
                                          }).then((result) => {
                                            if (result.isConfirmed) {
                                              router.push(
                                                `/login?pathname=${encodeURIComponent(
                                                  pathName
                                                )}`
                                              );
                                            }
                                          });
                                        } else {
                                          let body = {
                                            companyId: data?._id,
                                            type: "2",
                                            isWishlist: true,
                                            web: true,
                                          };
                                          wishlistMutation?.mutate(body);
                                        }
                                      }}
                                    >
                                      <CiHeart />
                                    </Link>
                                  )}
                                  &nbsp; &nbsp;
                                </p>
                                {data?.totalAverageRating != 0 ? (
                                  <p className="mb-0">
                                    <svg
                                      width="25"
                                      height="25"
                                      viewBox="0 0 25 25"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="12.5"
                                        cy="12.5"
                                        r="12.5"
                                        fill="#DA2A2C"
                                      />
                                      <path
                                        d="M12.1619 5.40527L13.8306 10.541H19.2306L14.8619 13.715L16.5306 18.8507L12.1619 15.6766L7.79325 18.8507L9.46194 13.715L5.09326 10.541H10.4932L12.1619 5.40527Z"
                                        fill="white"
                                      />
                                    </svg>
                                    &nbsp;
                                    {data?.totalAverageRating?.toFixed(1)}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })
                    : ""}
                </Row>
                {data?.company?.length > 4 ? (
                  <div className="text-center mt-5">
                    <Link
                      href={`/companies?title=${data?.title}`}
                      className="btn btn-theme"
                    >
                      Explore more
                    </Link>
                  </div>
                ) : (
                  ""
                )}
              </Container>
            </section>
          );
        })
        : ""}

      <section className="downloadapp">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="download-content">
                <h3>Make your online shop easier with our mobile app</h3>
                <p>
                  We offer high-quality films and the best documentary
                  selection,and the ability to browse alphabetically and by
                  genre
                </p>
                <div className="mt-5 d-flex align-items-center flex-wrap gap-2">
                  <Link
                    href="https://apps.apple.com/us/app/offarat-%D8%A3%D9%88%D9%81%D8%B1%D8%A7%D8%AA/id6445883175"
                    className="me-3 mb-3"
                    target="_blank"
                  >
                    <Image src={apple} />
                  </Link>
                  <Link
                    href="https://play.google.com/store/search?q=offarat&c=apps&hl=en_IN"
                    className="mb-3 mt-lg-0 "
                    target="_blank"
                  >
                    <Image src={googlestore} />
                  </Link>
                </div>
              </div>
            </Col>

            <Col md={6}>
              <Image src={downloadimg} className="img-fluid mx-auto d-block" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="services">
        <div className="heading-section text-center mb-lg-5 mb-3">
          <Container>
            <Row>
              <Col md={8} className="mx-auto">
                <SERVICES_HOME />
                <h3>Our Services</h3>

                <svg
                  width="94"
                  height="4"
                  viewBox="0 0 94 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="94" height="4" fill="#DA2A2C" />
                </svg>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row>
            <Col lg={3} md={6} className="mb-3">
              <div className="featurecard text-center servicecard pt-5 pb-4">
                <PRODUCT_PACKAGING />
                <br />
                <h4 className="mt-4">Product Packing</h4>
                <p>
                  Elevate your e-commerce success with protective, sustainable,
                  and eye-catching packaging that enhances brand identity and
                  customer experience.
                </p>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <div className="featurecard text-center servicecard pt-5 pb-4">
                <SUPPORT_CARE />
                <br />
                <h4 className="mt-4">24/7 Support</h4>
                <p>
                  Get instant help anytime with our 24/7 Support Service,
                  designed to assist you with all your shopping needs. Whether
                  you have questions or need assistance, our team is here to
                  ensure a seamless shopping experience, day or night!
                </p>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <div className="featurecard text-center servicecard pt-5 pb-4">
                <REFUND_POLICY_ICON />
                <br />
                <h4 className="mt-4">Refund Policy</h4>
                <p>
                  Enjoy peace of mind with our Instant Refund Policy, where you
                  can receive your refund immediately upon return approval. We
                  prioritize your satisfaction, making the return process quick
                  and hassle-free!
                </p>
              </div>
            </Col>

            <Col lg={3} md={6} className="mb-3">
              <div className="featurecard text-center servicecard pt-5 pb-4">
                <PAYMENT_SECURE />
                <br />
                <h4 className="mt-4">Payment Secure</h4>
                <p>
                  Shop confidently with our Payment Secure feature, ensuring
                  your transactions are protected with the latest encryption
                  technology. Your financial information is safe with us,
                  allowing you to focus on enjoying your shopping experience!
                </p>
              </div>
            </Col>
          </Row>

          {/* <div className="text-center mt-5">
            <a href="#" className="btn btn-theme">
              Explore more
            </a>
          </div> */}
        </Container>
      </section>
      {testimonialLists?.length !== 0 ? (
        <section className="testimonial" ref={testimonialRef}>
          <div className="heading-section text-center mb-lg-5 mb-3">
            <Container>
              <Row>
                <Col md={6} className="mx-auto">
                  <Image src={testimonial1} className="w-100" />
                  <h3>What Our Customers Says!</h3>

                  <svg
                    width="94"
                    height="4"
                    viewBox="0 0 94 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="94" height="4" fill="#DA2A2C" />
                  </svg>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <div className="slider-container">
              <Slider
                {...testimonial}
                dots={testimonialLists?.length > 1 ? true : false}
              >
                {testimonialLists?.map((data) => {
                  return (
                    <div className="test text-center" key={data?._id}>
                      <div className="mb-5">
                        <svg
                          width="40"
                          height="28"
                          viewBox="0 0 40 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 0H16V15.5451L9.58392 28H1.60804L7.99196 15.5451H0V0Z"
                            fill="#DA2A2C"
                          />
                          <path
                            d="M24 0H40V15.5451L33.5839 28H25.608L31.992 15.5451H24V0Z"
                            fill="#DA2A2C"
                          />
                        </svg>
                      </div>
                      <p>{data?.description}</p>
                      <div className="userimg-text mt-5">
                        <Image
                          src={data?.profileImg}
                          className="mx-auto"
                          alt="profile-img"
                          height={100}
                          width={100}
                        />
                      </div>
                      <br />
                      <h5>{data?.name}</h5>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </Container>
        </section>
      ) : (
        ""
      )}
      <Footer testimonialLists={testimonialLists?.length} />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {checkLanguage(categoryId?.name, categoryId?.arabic)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="delivery-main">
            <ul className="list-sub-category subcategory_list_render">
              {isPending ? (
                <ImageComponent content={true} />
              ) : subCategoryList?.length !== 0 ? (
                subCategoryList?.map((data) => {
                  return (
                    <li key={data?._id}>
                      <Link
                        href={`/company-list?categoryId=${data?.categoryId}&subCategoryId=${data?._id}`}
                        onClick={() => {
                          setSubCategoryId(data);
                          handleClose();
                          handleShow1(true);
                        }}
                      >
                        <Image
                          src={data?.subCategoryImg}
                          width={70}
                          height={70}
                          alt="subcategory-img"
                        />

                        <h4>
                          {checkLanguage(
                            data?.subcategory,
                            data?.arabicSubcategory
                          )}
                        </h4>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <p className="text-center">No Data Found</p>
              )}
            </ul>
            {Math.ceil(meta?.totalCount / 10) > 1 && (
              <Pagination
                totalCount={meta?.totalCount}
                handelPageChange={(e) => setPage(e.selected + 1)}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
      {/* {!isPending ? <Loading/>: null} */}
    </>
  );
};

export default Home;
