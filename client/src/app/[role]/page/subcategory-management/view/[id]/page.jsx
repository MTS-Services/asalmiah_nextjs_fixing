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
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_SUBCATEGORY_DETAIL } from "../../../../../../../services/APIServices";
import { stateId } from "../../../../../../../utils/helper";


const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: subcategoryview, isFetching } = useQuery({
    queryKey: ["subcategory-detail", { id }],
    queryFn: async () => {
      const res = await GET_SUBCATEGORY_DETAIL(id);
      return res?.data?.data;
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href="/admin/page" className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link
                href="/admin/page/subcategory-management"
                className="text-capitalize text-black"
              >
                Subcategory management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Subcategory details</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0"> Subcategory Details</h5>
                <Link
                  href={`/admin/page/subcategory-management`}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Table bordered>
                  <tr>
                    <td>
                      <b>SubCategory Name</b>
                    </td>
                    <td>{subcategoryview?.subcategory}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>SubCategory Name (In Arabic)</b>
                    </td>
                    <td>{subcategoryview?.arabicSubcategory}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Priority Order</b>
                    </td>
                    <td>{subcategoryview?.order ?? "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>SubCategory Image</b>
                    </td>
                    <td>
                      {subcategoryview?.subCategoryImg ? (
                        <div className="uploaded-image m-1">
                          <Image
                            src={subcategoryview?.subCategoryImg}
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
                      <b>Category Name</b>
                    </td>
                    <td>{subcategoryview?.categoryId?.category}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>State</b>
                    </td>
                    <td>
                      {" "}
                      <badge className="btn-sm d-inline-block bg-success text-white">
                        {stateId(subcategoryview?.stateId)}
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
