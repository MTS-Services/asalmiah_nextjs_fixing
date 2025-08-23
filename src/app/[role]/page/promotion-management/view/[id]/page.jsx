/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { SINGLE_PROMOTION_VIEW } from "../../../../../../../services/APIServices";
import {
  cashbackrotationalFunc,
  cashbackTypeFunc,
  commissionTypeFunc,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  PromoCodeStatus,
  ROLE_STATUS,
  Supplier,
} from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["company-detail", { id }],
    queryFn: async () => {
      const res = await SINGLE_PROMOTION_VIEW(id);
      return res?.data?.data ?? "";
    },
  });
  let detail = useDetails();
  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link
                href={getLinkHref(detail?.roleId, "/page")}
                className="text-black text-capitalize"
              >
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, "/page/promotion-management")}
                className="text-capitalize text-black"
              >
                Promotion management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Promotion details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Promotion Details</h5>
                <Link
                  href={getLinkHref(
                    detail?.roleId,
                    "/page/promotion-management"
                  )}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Row>
                  <Col md={6}>
                    <Table className="table-bordered">
                      <tr>
                        <td>
                          <b>Country Name</b>
                        </td>
                        <td>{companyView?.country}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Promocode</b>
                        </td>
                        <td>{companyView?.promoCode}</td>
                      </tr>
                      {companyView?.cashBackType == 1 ? (
                        <tr>
                          <td>
                            <b>Discount (%)</b>
                          </td>
                          <td>{companyView?.discount}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td>
                            <b>
                              Amount ({formatCurrency("", companyView?.country)}
                              )
                            </b>
                          </td>
                          <td>{companyView?.discount}</td>
                        </tr>
                      )}

                      <tr>
                        <td>
                          <b>
                            Minimum Purchase Amount (
                            {formatCurrency("", companyView?.country)})
                          </b>
                        </td>
                        <td>{companyView?.minPurchaseAmount}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>
                            Max Discount Amount (
                            {formatCurrency("", companyView?.country)})
                          </b>
                        </td>
                        <td>{companyView?.maxDiscountAmount ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Action Type</b>
                        </td>
                        <td>{cashbackTypeFunc(companyView?.actionType)}</td>
                      </tr>

                      {companyView?.rotationCashBack && (
                        <tr>
                          <td>
                            <b>Rotation Cashback</b>
                          </td>
                          <td>
                            {cashbackrotationalFunc(
                              companyView?.rotationCashBack ?? "-"
                            )}
                          </td>
                        </tr>
                      )}

                      {companyView?.cashBackType && (
                        <tr>
                          <td>
                            <b>CashBack Validity</b>
                          </td>
                          <td>
                            {commissionTypeFunc(
                              companyView?.cashBackType ?? "-"
                            )}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>
                          <b>Type</b>
                        </td>
                        <td>{PromoCodeStatus(companyView?.type)}</td>
                      </tr>
                      {companyView?.type == 2 ? (
                        <>   <tr>
                          <td>
                            <b>Category</b>
                          </td>
                          <td>{companyView?.categoryDetails?.category}</td>
                        </tr>

                          <tr>
                            <td>
                              <b>Excluded Company</b>
                            </td>

                            <td>{companyView?.excludedCompany?.map((data) => data?.company).join(",") ?? "-"}</td>
                          </tr>
                        </>
                      ) : (
                        ""
                      )}

                      {companyView?.type == 2 ? (
                        <tr>
                          <td>
                            <b>Sub Category</b>
                          </td>
                          <td>
                            {companyView?.subCategoryDetails?.subcategory}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                      {companyView?.type == 3 ? (
                        <tr>
                          <td>
                            <b>Company</b>
                          </td>
                          <td>
                            {companyView?.companyDetails
                              ?.map((data) => data?.company)
                              .join(", ")}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table className="table-bordered">
                      <tr>
                        <td>
                          <b>For Free Delivery</b>
                        </td>
                        <td>{companyView?.forFreeDelivery ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Number Of Used</b>
                        </td>
                        <td>{companyView?.numberOfUsed}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Number Of Used User</b>
                        </td>
                        <td>{companyView?.numberOfUsedUser}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Start Date</b>
                        </td>
                        <td>{companyView?.startDate}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>End Date</b>
                        </td>
                        <td>{companyView?.endDate}</td>
                      </tr>
                      {companyView?.cashbackvalidity && (
                        <tr>
                          <td>
                            <b>CashBack Validity</b>
                          </td>
                          <td>
                            {moment(
                              companyView?.cashbackvalidity ?? "-"
                            ).format("lll")}
                          </td>
                        </tr>
                      )}

                      {companyView?.supplierShare && (
                        <tr>
                          <td>
                            <b>Supplier Share</b>
                          </td>
                          <td>{Supplier(companyView?.supplierShare ?? "-")}</td>
                        </tr>
                      )}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created By</b>
                        </td>
                        <td> <Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (companyView?.createdBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, companyView?.createdBy?._id, ROLE_STATUS(companyView?.createdBy?.roleId)))

                          } else {
                            navigate.push(getLinkHref(detail?.roleId, `/page/profile`))



                          }
                        }}> {companyView?.createdBy?.fullName}</Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created On</b>
                        </td>
                        <td>{moment(companyView?.createdAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated By</b>
                        </td>
                        <td> <Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (companyView?.updatedBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(detail?.roleId, companyView?.createdBy?._id, ROLE_STATUS(companyView?.createdBy?.roleId)))

                          } else {

                            navigate.push(getLinkHref(detail?.roleId, `/page/profile`))

                          }
                        }}> {companyView?.updatedBy?.fullName} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated On</b>
                        </td>
                        <td>{moment(companyView?.updatedAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}
                    </Table>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
