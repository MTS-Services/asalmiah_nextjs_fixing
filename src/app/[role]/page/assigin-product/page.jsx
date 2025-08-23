/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";

import NoDataFound from "@/app/no-data-found/page";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import useSlider from "../../../../../hooks/useSlider";
import {
  GET_ASSIGIN_PRODUCT,
  getAdminProductLists,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import { CheckAdminState, checkLanguage, formatCurrency, getLinkHref, serialNumber } from "../../../../../utils/helper";
import { toastAlert } from "../../../../../utils/SweetAlert";
import { Pagination } from "@/app/components/Pagination";
import useCountryState from "../../../../../hooks/useCountryState";
import useDetails from "../../../../../hooks/useDetails";

const Products = () => {
  const isSlider = useSlider();
  // const { id } = useParams();
  const selectedCountry = useCountryState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const question_id = searchParams.get("question_id") ?? "";
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");

  const { data: getProductList, refetch } = useQuery({
    queryKey: ["getProduct-list", page, state],
    queryFn: async () => {
      const resp = await getAdminProductLists(page, search, state);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const assiginMutation = useMutation({
    mutationFn: (product_id) => GET_ASSIGIN_PRODUCT(question_id, product_id),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });
  let detail = useDetails()
  return (
    <>
      <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-md-0"> Assign Dynamic Question To Product</h4>
                <div className="filter_dropdown flex-wrap">
                  <Link href={getLinkHref(detail?.roleId, "/page/dynamic-form")} className="btn_theme">
                    Back
                  </Link>
                  <div className="form-group position-relative selectform mb-0">
                    <Form.Control
                      type="text"
                      className="h-100"
                      value={search}
                      placeholder="Search"
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key == "Enter" && refetch()}
                      onKeyUp={(e) => e.target.value == "" && refetch()}
                    />
                  </div>
                  <div className="form-group position-relative selectform mb-0">
                    <Form.Select onChange={(e) => setState(e.target.value)}>
                      <option value={""}>All</option>
                      <option value={constant?.ACTIVE}>Active</option>
                      <option value={constant?.INACTIVE}>Inactive</option>
                      <option value={constant?.PRODUCT_STOCK}>Stock</option>
                      <option value={constant?.PRODUCT_OUTOFSTOCK}>
                        Out Of Stock
                      </option>
                    </Form.Select>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Sn.</th>
                        <th>Product Name</th>
                        <th>Product Image</th>
                        <th>Company Name</th>
                        <th>Price ({formatCurrency("", selectedCountry)})</th>
                        <th>Discount (%)</th>
                        <th>Quantity</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="gridjs-tbody">
                      {getProductList?.length > 0 ? (
                        getProductList?.map((data, index) => {
                          return (
                            <tr key={index}>
                              <td>{serialNumber(page, index)}</td>
                              <td>{checkLanguage(
                                data?.productName,
                                data?.productArabicName
                              )}</td>
                              <td>
                                <div className="table-user d-flex align-items-center">
                                  <span className="table-user-icon">
                                    <Image
                                      src={data?.productImg[0]?.url}
                                      alt="No image found"
                                      height={50}
                                      width={50}
                                    />
                                  </span>
                                </div>
                              </td>
                              <td>{data?.companyDetails?.company}</td>

                              {data?.price ? (
                                <td>{data?.price}</td>
                              ) : data?.size ? (
                                <td>{data?.size?.at(0)?.price}</td>
                              ) : (
                                <td>{data?.mrp}</td>
                              )}

                              {data?.discount ? (
                                <td>{data?.discount}</td>
                              ) : data?.size && data?.size.length > 0 ? (
                                <td>{data?.size[0].discount}</td>
                              ) : (
                                <td>No discount available</td>
                              )}

                              <td>
                                {data?.quantity === 0 ? (
                                  <span style={{ color: "red" }}>
                                    Out of Stock
                                  </span>
                                ) : (
                                  data?.quantity
                                )}
                              </td>
                              <td>
                                {moment(data?.createdAt).format(
                                  "MMM Do YYYY, h:mm:ss A"
                                )}
                              </td>

                              <td>{CheckAdminState(data?.stateId)}</td>

                              <td>
                                <div className="d-flex">
                                  <Button
                                    className="btn_green btn btn-sm ms-2"
                                    onClick={() => {
                                      assiginMutation.mutate(data?._id);
                                    }}
                                  >
                                    {" "}
                                    Assign
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6">
                            <NoDataFound />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {Math.ceil(meta?.totalCount / 10) > 1 && (
                  <Pagination
                    totalCount={meta?.totalCount}
                    handelPageChange={(e) => setPage(e.selected + 1)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
