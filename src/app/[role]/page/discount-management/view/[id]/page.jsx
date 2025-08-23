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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_COMPANY_DETAIL } from "../../../../../../../services/APIServices";


const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["company-detail", { id }],
    queryFn: async () => {
      const res = await GET_COMPANY_DETAIL(id);
      return res?.data?.data;
    },
  });

  return (
    <>
      <div className={isSlider ? "bodymain" : "bodymain collapsebody"}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Discount Details</h5>
                <Link
                  href={`/admin/page/discount-management`}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form>
                  <Row>
                    <Col lg={6}>
                      <div className="d-flex algn-items-center">
                        <Form.Group className="mb-4 w-100">
                          <Form.Label>Categroy</Form.Label>
                          <Form.Control
                            name="Categroy"
                            type="text"
                            value={companyView?.categoryId?.category}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="d-flex algn-items-center ">
                        <Form.Group className="mb-4 w-100">
                          <Form.Label>Pickup Service</Form.Label>
                          <Form.Control
                            name="pickupService"
                            type="text"
                            value={companyView?.pickupService}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
