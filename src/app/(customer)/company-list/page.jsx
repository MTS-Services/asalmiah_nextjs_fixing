"use client";

import Breadcrums from "@/app/components/Breadcrums";
import { Pagination } from "@/app/components/Pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiFillHeart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { ShimmerPostItem } from "react-shimmer-effects";
import Swal from "sweetalert2";
import useDetails from "../../../../hooks/useDetails";
import {
  ADD_WISHLIST,
  GET_COMPANY_SUBCATEGORY_LIST_HOME,
  GET_USERS_COMPANY_SUBCATEGORY_LIST_HOME,
} from "../../../../services/APIServices";
import { constant, Paginations } from "../../../../utils/constants";
import Footer from "../../../../utils/Footer";
import Header from "../../../../utils/Header";
import { checkLanguage } from "../../../../utils/helper";
import { toastAlert } from "../../../../utils/SweetAlert";
import { trans } from "../../../../utils/trans";
import UserLogInHeader from "../../../../utils/UserLogInHeader";
import "./page.scss";
export default function CompanyListUser() {
  let detail = useDetails();
  let router = useRouter();
  let pathName = usePathname();
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const searchParams = useSearchParams();
  const categoryId = searchParams?.get("categoryId");
  const subCategoryId = searchParams?.get("subCategoryId");

  const {
    data: subCategoryComapnyList,
    refetch,
    isPending,
  } = useQuery({
    queryKey: [
      "company-subcategory-list-home",
      categoryId,
      subCategoryId,
      page,
    ],
    queryFn: async () => {
      if (!subCategoryId) {
        return null;
      }
      const resp = detail?._id
        ? await GET_USERS_COMPANY_SUBCATEGORY_LIST_HOME(
          categoryId,
          subCategoryId,
          page
        )
        : await GET_COMPANY_SUBCATEGORY_LIST_HOME(
          categoryId,
          subCategoryId,
          page
        );
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
  return (
    <>
      <div>
        {detail?.roleId == constant?.USER ? <UserLogInHeader /> : <Header />}
        <Breadcrums
          firstLink={Home}
          secondLink={"Companies"}
          language={language}
        />
        <section className="company-list-card">
          <Container>


            <div className="delivery-mainn company-card">
              <Row className="m-0">
                {isPending ? Array.from({ length: 2 }, (_, index) => (
                  <Col md={4} className="mb-3" key={index}>   <ShimmerPostItem card cta imageHeight={200} /> </Col>
                )) : ""}


                {subCategoryComapnyList?.length !== 0 ? (
                  subCategoryComapnyList?.map((data) => {
                    return (
                      <Col md={4} className="mb-3" key={data?._id}>
                        <Link
                          href={`/product-list?categoryId=${categoryId}&subCategoryId=${subCategoryId}&companyId=${data?._id}`}
                        >
                          <div className="card card-body text-center">
                            <div className="company-img">
                              <Image
                                src={data?.logo}
                                className="w-100 mb-3"
                                width={70}
                                height={70}
                                alt="company-logo"
                              />
                            </div>
                            <div className="onhover-show">
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
                                                  pathName +
                                                  `?categoryId=${categoryId}&subCategoryId=${subCategoryId}`
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
                                                  pathName +
                                                  `?categoryId=${categoryId}&subCategoryId=${subCategoryId}`
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
                                </li>
                              </ul>
                            </div>
                            <h4>
                              <b>
                                {checkLanguage(
                                  data?.company,
                                  data?.arabicCompany
                                )}
                              </b>
                            </h4>
                          </div>
                        </Link>
                      </Col>
                    );
                  })
                ) : (
                  <p className="text-center">No Data Found</p>
                )}
              </Row>
              {Math.ceil(meta?.totalCount / 10) > 1 && (
                <Pagination
                  totalCount={meta?.totalCount}
                  handelPageChange={(e) => setPage(e.selected + 1)}
                />
              )}
            </div>
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
}
