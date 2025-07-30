"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Col, Container, Form, Offcanvas, Row } from "react-bootstrap";
import { DynamicStar } from "react-dynamic-star";
import { AiFillHeart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { FaList } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import Swal from "sweetalert2";
import "../(customer)/cart/page.scss";
import useCountryState from "../../../hooks/useCountryState";
import useDetails from "../../../hooks/useDetails";
import {
  ADD_WISHLIST,
  GET_PRODUCTLIST,
  GET_PRODUCTLIST_AUTH,
} from "../../../services/APIServices";
import { constant, Paginations } from "../../../utils/constants";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import { checkLanguage, formatCurrency } from "../../../utils/helper";
import ImageComponent from "../../../utils/ImageComponent";
import { toastAlert } from "../../../utils/SweetAlert";
import { trans } from "../../../utils/trans";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import Breadcrums from "../components/Breadcrums";
import Filter from "../components/Filter";
import NoDataFound from "../components/no-data-found/page";
import { Pagination } from "../components/Pagination";
import { ShimmerContentBlock, ShimmerPostItem, ShimmerThumbnail } from "react-shimmer-effects";

const ProductGrid = () => {
  const pathName = usePathname();
  let detail = useDetails();
  const selectedCountry = useCountryState();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const subCategoryId = searchParams?.get("subCategoryId");
  const companyId = searchParams?.get("companyId");
  const [categoryArr, setCategoryArr] = useState([]);
  const [companyArr, setCompanyArr] = useState([]);
  const [classificationArr, setClassificationArr] = useState([]);

  const [subCategoryArr, setSubCategoryArr] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const [minDiscount, setMinDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(100);

  const [sort, setSort] = useState();

  let searchProduct = searchParams?.get("search");
  const {
    data: allProductList,
    refetch,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["product-all-list", searchProduct, page, sort, categoryId],
    queryFn: async () => {
      const resp =
        detail?.roleId == constant?.USER
          ? await GET_PRODUCTLIST_AUTH(
            searchProduct,

            categoryArr?.length !== 0 ||
              classificationArr?.length !== 0 ||
              companyArr?.length !== 0 ||
              subCategoryArr?.length !== 0
              ? ""
              : categoryId,
            categoryArr?.length !== 0 ||
              classificationArr?.length !== 0 ||
              companyArr?.length !== 0 ||
              subCategoryArr?.length !== 0
              ? ""
              : subCategoryId,
            categoryArr?.length !== 0 ||
              classificationArr?.length !== 0 ||
              companyArr?.length !== 0 ||
              subCategoryArr?.length !== 0
              ? ""
              : companyId,
            categoryArr.toString(""),
            classificationArr.toString(""),
            subCategoryArr.toString(""),
            companyArr.toString(""),
            page,
            minPrice,
            maxPrice,
            sort,
            minDiscount,
            maxDiscount
          )
          : await GET_PRODUCTLIST(
            searchProduct,
            categoryArr?.length !== 0 ||
              classificationArr?.length !== 0 ||
              companyArr?.length !== 0 ||
              subCategoryArr?.length !== 0
              ? ""
              : categoryId,
            categoryArr?.length !== 0 ||
              classificationArr?.length !== 0 ||
              companyArr?.length !== 0 ||
              subCategoryArr?.length !== 0
              ? ""
              : subCategoryId,
            categoryArr?.length !== 0 ||
              classificationArr?.length !== 0 ||
              companyArr?.length !== 0 ||
              subCategoryArr?.length !== 0
              ? ""
              : companyId,
            categoryArr.toString(""),
            classificationArr.toString(""),
            subCategoryArr.toString(""),
            companyArr.toString(""),
            page,
            minPrice,
            maxPrice,
            sort,
            minDiscount,
            maxDiscount
          );
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  let router = useRouter();
  const handleSearch = (value) => {
    router.push(`/product-grid?search=${value}`);
  };
  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let language = localStorage.getItem("language");
  const Home = trans("home");
  let queryClient = useQueryClient();

  const refetchFunc = () => {
    refetch()
    queryClient.invalidateQueries({ queryKey: ["company-list"] });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader refetchAPI={refetchFunc} />
      ) : (
        <Header refetchAPI={refetchFunc} />
      )}
      <Breadcrums firstLink={Home} secondLink={"List"} language={language} />
      <section className="list-main">
        <Container>
          <Row>
            <Col lg={3}>
              <aside className="d-none d-lg-block left-sidebar">
                {/* <DebounceEffect onSearch={handleSearch} user={true} /> */}
                <span className="filter-text">
                  <FaFilter size="20" />
                  <b className="mt-2 m-2">Filter</b>
                </span>
                <Filter
                selectedCountry={selectedCountry}
                  refetch={refetch}
                  setCategoryArr={setCategoryArr}
                  categoryArr={categoryArr}
                  setClassificationArr={setClassificationArr}
                  classificationArr={classificationArr}
                  setCompanyArr={setCompanyArr}
                  companyArr={companyArr}
                  setSubCategoryArr={setSubCategoryArr}
                  subCategoryArr={subCategoryArr}
                  setSearch={setSearch}
                  minPrice={minPrice}
                  setMinPrice={setMinPrice}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  setMinDiscount={setMinDiscount}
                  setMaxDiscount={setMaxDiscount}
                  minDiscount={minDiscount}
                  maxDiscount={maxDiscount}
                />
              </aside>
            </Col>
            <Col lg={9}>
              <div>
                <div className="top-filter-menu mb-5">
                  <Row>
                    <Col lg={6}>
                      <div className="d-flex align-items-center gap-3">
                        {/* <Form.Label className="text-capitalize fw-bold mb-0">
                          select price:
                        </Form.Label> */}
                        <Form.Select
                          aria-label="Default select example"
                          onChange={(e) => setSort(e.target.value)}
                        >
                          <option value=""> Sort By</option>

                          <option value="1">High to low</option>
                          <option value="2">Low to high</option>
                        </Form.Select>
                      </div>
                    </Col>
                    <Col lg={6} className="mt-lg-0 mt-4">
                      <div className="d-flex align-items-center justify-content-lg-end justify-content-start gap-3 prodiuct-view">
                        <div
                          className="btn btn-theme filter_btn d-block d-lg-none"
                          onClick={handleShow}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-funnel"
                            viewBox="0 0 16 16"
                          >
                            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                          </svg>{" "}
                          <small className="ms-2">Filter</small>
                        </div>
                        <div className="list-view">
                          <a href="/product-list">
                            <IoGrid />
                          </a>
                        </div>
                        <div className="grid-view">
                          <a className="active-btn" href="/product-grid">
                            <FaList />
                          </a>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>

                    {isPending ? Array.from({ length: 6 }, (_, index) => (

                      <div className="product-box-3 product-grid-box mb-4 d-flex gap-4 flex-lg-nowrap flex-wrap">
                        <ShimmerContentBlock
                          title
                          text
                          cta
                          thumbnailWidth={370}
                          thumbnailHeight={370}
                        />
                      </div>
                    )) :
                      allProductList?.length !== 0 ? (
                        allProductList?.map((data) => {
                          return (
                            <Col lg={12}>
                              <div className="product-box-3 product-grid-box mb-4 d-flex gap-4 flex-lg-nowrap flex-wrap">
                                <div className="img-wrapper position-relative">
                                  <div className="product-image">
                                    <Link
                                      className="pro-first bg-size"
                                      href={`/product-detail/${data?._id}`}
                                    >
                                      {data?.productImg[0]?.type ? (
                                        data?.productImg[0]?.type?.includes(
                                          "image"
                                        ) ? (
                                          <ImageComponent
                                            className={"bg-img"}
                                            data={data?.productImg[0]?.url}
                                            width={500}
                                            height={300}
                                            alt={"image"}
                                          />
                                        ) : (
                                          <video
                                            width="100%"
                                            height="100%"
                                            src={data?.productImg[0]?.url}
                                          />
                                        )
                                      ) : (
                                        <ImageComponent
                                          className={"bg-img"}
                                          data={data?.productImg[0]?.url}
                                          width={500}
                                          height={300}
                                          alt={"image"}
                                        />
                                      )}
                                    </Link>
                                  </div>
                                  <div className="onhover-show">
                                    <div className=" d-flex align-items-center justify-content-between">
                                      {/* <h6>
                                      {data?.isDelivered ? (
                                        <span className="badge text-bg-success">
                                          Delivery Applicable
                                        </span>
                                      ) : (
                                        <span className="badge text-bg-danger">
                                          Delivery Not Applicable
                                        </span>
                                      )}
                                    </h6> */}

                                      <div className="product-detail">
                                        <span>
                                          <p>
                                            {" "}
                                            {data?.discount !== null ? (
                                              <span>
                                                {data?.discount?.toFixed(1)}% off
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                            {data?.size?.at(0)?.discount !==
                                              null && data?.size?.length !== 0 ? (
                                              <span>
                                                {data?.size
                                                  ?.at(0)
                                                  ?.discount?.toFixed(1)}
                                                % off
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                          </p>
                                        </span>
                                      </div>

                                      <ul>
                                        <li>
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
                                                      "You need to login to add the product in wishlist",
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
                                                    productId: data?._id,

                                                    type: "1",
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
                                                      "You need to login to add the product in wishlist",
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
                                                    productId: data?._id,
                                                    type: "1",
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
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="product-detail mt-lg-4 mt-0">
                                  <ul className="rating">
                                    <li>
                                      <div className="">
                                        {/* {Array(data?.averageRating?.averageRating)
                                        .fill(0)
                                        ?.map((_, i) => (
                                          <FaStar className="yellow-star" />
                                        ))} */}

                                        <DynamicStar
                                          rating={
                                            data?.averageRating?.averageRating
                                          }
                                          height={15}
                                          width={15}
                                          outlined
                                        />
                                      </div>
                                    </li>

                                    {/* <li className="ms-1">4.3</li> */}
                                  </ul>
                                  <Link href="#">
                                    <h6 className="fw-bold">
                                      {checkLanguage(
                                        data?.productName,
                                        data?.productArabicName
                                      )}
                                    </h6>
                                  </Link>
                                  <Link href="#">
                                    <h6>
                                      {data?.quantity == 0 ? (
                                        <p className="text-danger">
                                          Out of stock
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                    </h6>
                                  </Link>
                                  <p className="notranslate">
                                    {formatCurrency(
                                      data?.size?.at(0)?.price
                                        ? data?.size?.at(0)?.price
                                        : data?.price,
                                      selectedCountry
                                    )}

                                    {data?.size?.at(0)?.discount ? (
                                      <del className="notranslate">
                                        {formatCurrency(
                                          data?.size?.at(0)?.mrp,
                                          selectedCountry
                                        )}
                                      </del>
                                    ) : data?.discount ? (
                                      <del className="notranslate">
                                        {formatCurrency(
                                          data?.size?.at(0)?.mrp
                                            ? data?.size?.at(0)?.mrp
                                            : data?.mrpPrice,
                                          selectedCountry
                                        )}
                                      </del>
                                    ) : (
                                      ""
                                    )}
                                  </p>
                                  <div className="listing-button">
                                    {" "}
                                    <Link
                                      href={`/product-detail/${data?._id}`}
                                      className="btn btn-theme text-capitalize"
                                      title="View Product"
                                    >
                                      View Product
                                    </Link>
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
                  {!isPending && Math.ceil(meta?.totalCount / 12) > 1 && (
                    <Pagination
                      pageCount={"YES"}
                      totalCount={meta?.totalCount}
                      handelPageChange={(e) => setPage(e.selected + 1)}
                      page={page}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />

      {/* Filter Menu */}

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <aside className="left-sidebar">
            {/* <DebounceEffect onSearch={handleSearch} user={true} /> */}
            <span className="filter-text">
              <FaFilter size="20" />
              <b className="mt-2 m-2">Filter</b>
            </span>
            <Filter
              refetch={refetch}
              setCategoryArr={setCategoryArr}
              categoryArr={categoryArr}
              setClassificationArr={setClassificationArr}
              classificationArr={classificationArr}
              setCompanyArr={setCompanyArr}
              companyArr={companyArr}
              setSubCategoryArr={setSubCategoryArr}
              subCategoryArr={subCategoryArr}
              setSearch={setSearch}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              setMinDiscount={setMinDiscount}
              setMaxDiscount={setMaxDiscount}
              minDiscount={minDiscount}
              maxDiscount={maxDiscount}
            />
          </aside>
        </Offcanvas.Body>
      </Offcanvas>
      {/* {isPending || isFetching ? <Loading /> : null} */}
    </>
  );
};

export default ProductGrid;
