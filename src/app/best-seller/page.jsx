"use client";

import Breadcrums from "@/app/components/Breadcrums";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import useDetails from "../../../hooks/useDetails";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { ShimmerPostItem } from "react-shimmer-effects";
import Swal from "sweetalert2";
import {
  ADD_WISHLIST,
  GET_BEST_SELLER,
  USER_GET_BEST_SELLER,
} from "../../../services/APIServices";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import ImageComponent from "../../../utils/ImageComponent";
import { toastAlert } from "../../../utils/SweetAlert";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import { constant, Paginations } from "../../../utils/constants";
import { trans } from "../../../utils/trans";
import { Pagination } from "../components/Pagination";

export default function page() {
  let detail = useDetails();
  let pathName = usePathname();
  let searchParams = useSearchParams();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const searchCompany = searchParams?.get("search");

  const { data: bestSellerProducts, refetch, isPending } = useQuery({
    queryKey: ["best-seller", page, searchCompany],
    queryFn: async () => {
      const resp =
        detail?.roleId == constant?.USER
          ? await USER_GET_BEST_SELLER(searchCompany, page)
          : await GET_BEST_SELLER(searchCompany, page);
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
  let router = useRouter();

  let language = localStorage.getItem("language");
  const Home = trans("home");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader refetchAPI={refetch} /> : <Header refetchAPI={refetch} />}{" "}
      <Breadcrums
        firstLink={Home}
        secondLink={"Best Seller"}
        language={language}
      />
      <section className="bst-seller-sec mt-2 company-list-card">
        <Container>
          <Container>
            <Row>

              {isPending ? Array.from({ length: 4 }, (_, index) => (
                <Col lg={3} md={6} className="mb-3" key={index}>
                  <ShimmerPostItem title
                    variant="secondary"  imageHeight={200}/> </Col>
              )) : ""}
              {bestSellerProducts?.length !== 0 ? (
                bestSellerProducts?.map((data) => {
                  return (
                    <Col lg={3} md={6} className="mb-3" key={data?._id}>
                      <div className="featurecard p-0">
                        <div
                          className="imgfeature companymaincard"
                          onClick={() =>
                            router.push(`/best-seller/${data?._id}`)
                          }
                        >
                          <ImageComponent
                            data={data?.logo}
                            alt="best-seller-img"
                            height={200}
                            width={300}
                            dynamicLabellingState={true}
                          />
                        </div>
                        <div className="feature-content pb-0  p-3 ">
                          <div className="d-flex justify-content-between">
                            <h4>{data?.company}</h4>
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
                                          "You need to login to add the seller in wishlist",
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
                              &nbsp;
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
                                &nbsp;{data?.totalAverageRating?.toFixed(1)}
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
              ) : (
                <div className="no-data-found-style">
                  <h3 className="text-center">No Data Found</h3>
                </div>
              )}
            </Row>
            <div className="mb-2">
              {!isPending && Math.ceil(meta?.totalCount / 12) > 1 && (
                <Pagination
                  pageCount={"YES"}
                  totalCount={meta?.totalCount}
                  handelPageChange={(e) => setPage(e.selected + 1)}
                  page={page}
                />
              )}
            </div>
          </Container>
        </Container>
      </section>
      <Footer />

    </>
  );
}
