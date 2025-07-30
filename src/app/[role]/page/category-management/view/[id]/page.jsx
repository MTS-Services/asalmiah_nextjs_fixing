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
import { useParams } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_CATEGORY_DETAIL } from "../../../../../../../services/APIServices";
import { getLinkHref, stateId } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";


const View = () => {
  const isSlider = useSlider();
  const { id } = useParams();
  let detail = useDetails()
  const { data: categoryview } = useQuery({
    queryKey: ["category-detail", { id }],
    queryFn: async () => {
      const res = await GET_CATEGORY_DETAIL(id);
      return res?.data?.data;
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
                href={getLinkHref(detail?.roleId, "/page/category-management")}
                className="text-capitalize text-black"
              >
                categories management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Category details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Category Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/category-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>Category Name</b>
                    </td>
                    <td>{categoryview?.category}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Category Name (In Arabic)</b>
                    </td>
                    <td>{categoryview?.arabicCategory}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Category Image</b>
                    </td>
                    <td>
                      {" "}
                      {categoryview?.categoryImg?.length !== 0 ? (
                        <div className="uploaded-image m-1">
                          <Image
                            src={categoryview?.categoryImg}
                            alt="Image"
                            width={50}
                            height={50}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>State</b>
                    </td>
                    <td>
                      <badge className="btn-sm d-inline-block bg-success text-white">
                        {stateId(categoryview?.stateId)}
                      </badge>
                    </td>
                  </tr>
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
