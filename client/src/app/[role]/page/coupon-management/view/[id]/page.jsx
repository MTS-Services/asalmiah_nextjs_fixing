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
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import useSlider from "../../../../../../../hooks/useSlider";
import { GET_COMPANY_DETAIL, GET_PROMOTION_DETAIL_API } from "../../../../../../../services/APIServices";
import { formatCurrency, getLinkHref, stateId } from "../../../../../../../utils/helper";
import useCountryState from "../../../../../../../hooks/useCountryState";
import useDetails from "../../../../../../../hooks/useDetails";

// import useDocumentTitle from "@/utils/ useDocumentTitle";

const View = () => {
  const isSlider = useSlider();
  const queryClient = useQueryClient();
  const selectedCountry = useCountryState();
  let detail = useDetails()
  const navigate = useRouter();
  const { id } = useParams();
  const { data: companyView, isFetching } = useQuery({
    queryKey: ["coupon-view", { id }],
    queryFn: async () => {
      const res = await GET_PROMOTION_DETAIL_API(id);
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
                <h5 className="mb-md-0">Company Details</h5>
                <Link
                  href={getLinkHref(detail?.roleId, "/page/coupon-management")}
                  className="btn_theme"
                >
                  Back
                </Link>
              </div>
              <div className="card-body">
                <form>
                  <Row>
                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="company"
                          placeholder="Enter company name"
                          value={companyView?.company}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="">Logo</Form.Label>

                        {companyView?.logo ? (
                          <div className="uploaded-image m-1">
                            <Image
                              src={`${companyView?.logo}`}
                              alt="Image"
                              width={50}
                              height={50}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>Commission ({formatCurrency("", selectedCountry)})</Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="perCommission"
                          placeholder="Enter commisiion"
                          value={companyView?.perCommission}
                          disabled
                        />
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="d-flex algn-items-center">
                        <Form.Group className="mb-4 w-100">
                          <Form.Label>Coupon Service</Form.Label>
                          <Form.Control
                            name="couponService"
                            type="text"
                            value={companyView?.couponService}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </Col>

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
                          <Form.Label>SubCategroy</Form.Label>
                          <Form.Control
                            name="subcategory"
                            type="text"
                            value={companyView?.subcategoryId?.subcategory}
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

                    <Col lg={6}>
                      <div className="d-flex algn-items-center ">
                        <Form.Group className="mb-4 w-100">
                          <Form.Label>Self Delivery</Form.Label>
                          <Form.Control
                            name="deliveryEligible"
                            type="text"
                            value={companyView?.deliveryEligible}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    {companyView?.deliveryEligible == 1 ? (
                      <>
                        <Col lg={6}>
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Delivery Company
                            </Form.Label>
                            <Form.Control
                              value={companyView?.deliveryCompany?.company}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={6} className="mx-auto">
                          <Form.Group className="mb-4">
                            <Form.Label>Delivery Cost ({formatCurrency("", selectedCountry)})</Form.Label>
                            <Form.Control
                              className="form-control"
                              type="text"
                              name="costDelivery"
                              placeholder="Enter delivery code"
                              value={companyView?.costDelivery}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}
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
