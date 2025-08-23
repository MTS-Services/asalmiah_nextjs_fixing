/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_BANNER_DETAIL } from "../../../../../../../services/APIServices";
import { Table } from "react-bootstrap";
import { checkLanguage, getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

const View = () => {
  const isSlider = useSlider();
  const { id } = useParams();
  let navigate = useRouter()
  let detail = useDetails()
  const { data: bannerView, isFetching } = useQuery({
    queryKey: ["banner-detail", { id }],
    queryFn: async () => {
      const res = await GET_BANNER_DETAIL(id);
      return res?.data?.data ?? "";
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>
            <li>
              {" "}
              <Link
                href={getLinkHref(detail?.roleId, "/page/banner-management")}
                className="text-black text-capitalize"
              >
                banner management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">banner details</li>
          </ul>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Banner Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/banner-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Title</b>
                    </td>
                    <td>{bannerView?.title}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Description</b>
                    </td>
                    <td>{bannerView?.description}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Products</b>
                    </td>
                    <td>
                      {bannerView?.productId?.map((data) => {
                        return (
                          <ul style={{ listStyleType: "circle" }}>
                            <li>{checkLanguage(
                              data?.productName,
                              data?.productArabicName
                            )}</li>
                          </ul>
                        );
                      })}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Company</b>
                    </td>
                    <td>{bannerView?.companyDetails?.company}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Logo</b>
                    </td>
                    <td>
                      {" "}
                      {bannerView?.bannerImg ? (
                        <div className="uploaded-image m-1">
                          <Link
                            href={`${bannerView?.bannerImg}`}
                            target="_blank"
                          >
                            <Image
                              src={`${bannerView?.bannerImg}`}
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </Link>
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (bannerView?.createdBy?.roleId !== constant.ADMIN) {
                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, bannerView?.createdBy?._id, ROLE_STATUS(bannerView?.createdBy?.roleId)))




                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                      }
                    }}> {bannerView?.createdBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Created On</b>
                    </td>
                    <td>{moment(bannerView?.createdAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated By</b>
                    </td>
                    <td><Link href={"#"} onClick={(e) => {
                      e.preventDefault()
                      if (bannerView?.updatedBy?.roleId !== constant.ADMIN) {

                        navigate.push(getLinkHrefRouteSingleView(detail?.roleId, bannerView?.updatedBy?._id, ROLE_STATUS(bannerView?.updatedBy?.roleId)))

                      } else {
                        navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                      }
                    }}> {bannerView?.updatedBy?.fullName ?? "-"} </Link></td>
                  </tr> : ""}

                  {detail?.roleId == constant.ADMIN ? <tr>
                    <td>
                      <b>Updated On</b>
                    </td>
                    <td>{moment(bannerView?.updatedAt).format("LLL") ?? "-"}</td>
                  </tr> : ""}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
