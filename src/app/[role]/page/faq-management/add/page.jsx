/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { addFaq } from "../../../../../../services/APIServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import useDetails from "../../../../../../hooks/useDetails";
import { getLinkHref } from "../../../../../../utils/helper";

const Add = ({ params }) => {
  const router = useRouter();
  const [bodymain, setBodymain] = useState(true);
  const showBodymain = () => setBodymain(!bodymain);
  const [details, setDetails] = useState({
    question: "",
    answer: "",
    arabicQuestion: "",
    arabicAnswer: ""
  });
  const [clicked, setClicked] = useState(false);

  /**
   *
   * @param {input} value
   * @returns object
   */
  const validate = (value) => {
    let error = {};
    if (!value.question) {
      error.question = "Question field is required";
    }
    if (!value.arabicQuestion) {
      error.arabicQuestion = "Arabic question field is required";
    }
    if (!value.answer) {
      error.answer = "Answer field is required";
    }
    if (!value.arabicAnswer) {
      error.arabicAnswer = "Arabic answer field is required";
    }
    return error;
  };

  /**
   * onChange handler for input
   * @param {*} e {name,value} of input
   */
  const handleChange = (e) => {
    setDetails(() => ({ ...details, [e.target.name]: e.target.value }));
  };

  /**
   * adding blog detil (onSubmit)
   * @param {*} e preventDefault
   */
  const detail = useDetails();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
    if (!Object.keys(validate(details)).length) {
      const res = await addFaq(details);
      if (res?.data?.success) {
        router.push(getLinkHref(detail?.roleId, `/page/faq-management`));
        toastAlert("success", res?.data?.message);
      }
    }
  };

  return (
    <>
      <div className={bodymain ? "bodymain" : "bodymain collapsebody"}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, '/page')} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li>
              {" "}
              <Link

                href={getLinkHref(detail?.roleId, '/page/faq-management')}
                className="text-capitalize text-black"
              >
                FAQ management
              </Link>
            </li>
            <li>/</li>
            <li className="text-capitalize">Add New FAQ</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h5 className="mb-md-0">Add New FAQ</h5>
                <Link href={getLinkHref(detail?.roleId, '/page/faq-management')} className="btn_theme">
                  Back
                </Link>
              </div>
              <div className="card-body">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Question <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="question"
                          placeholder="Enter Question"
                          onChange={handleChange}
                        />
                        {clicked && validate(details)?.question ? (
                          <div className="error">
                            {validate(details)?.question}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Form.Group>
                    </Col>


                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Answer <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as={"textarea"}
                          className="form-control"
                          type="text"
                          name="answer"
                          placeholder="Enter Answer"
                          onChange={handleChange}
                        />
                        {clicked && validate(details)?.answer ? (
                          <div className="error">
                            {validate(details)?.answer}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Arabic Question <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          className="form-control"
                          type="text"
                          name="arabicQuestion"
                          placeholder="Enter arabic question"
                          onChange={handleChange}
                        />
                        {clicked && validate(details)?.arabicQuestion ? (
                          <div className="error">
                            {validate(details)?.arabicQuestion}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mx-auto">
                      <Form.Group className="mb-4">
                        <Form.Label>
                          Arabic Answer <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as={"textarea"}
                          className="form-control"
                          type="text"
                          name="arabicAnswer"
                          placeholder="Enter arabic answer"
                          onChange={handleChange}
                        />
                        {clicked && validate(details)?.arabicAnswer ? (
                          <div className="error">
                            {validate(details)?.arabicAnswer}
                          </div>
                        ) : (
                          <></>
                        )}
                      </Form.Group>
                    </Col>

                    <div className="text-end">
                      <Button className="btn_theme ms-auto" type="submit">
                        Submit
                      </Button>
                    </div>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
