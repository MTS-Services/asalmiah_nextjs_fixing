"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import useSlider from "../../../../../../../hooks/useSlider";
import { getSingleCMSDetail } from "../../../../../../../services/APIServices";
import { getLinkHref, getLinkHrefRouteSingleView, pageType, ROLE_STATUS } from "../../../../../../../utils/helper";
import useDetails from "../../../../../../../hooks/useDetails";
import { constant } from "../../../../../../../utils/constants";
import moment from "moment";

const View = () => {
  const toggleVal = useSlider();
  let { id } = useParams();
  let detail = useDetails();
  let navigate = useRouter()
  const [contentData, setContentData] = useState({
    title: "",
    typeId: "",
    stateId: "",
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: ""
  });
  const [description, setDescription] = useState("");

  useEffect(() => {
    getDetail(id);
  }, []);

  const getDetail = (id) => {
    getSingleCMSDetail(id).then((res) => {
      if (res?.status == 200) {
        const data = res?.data?.data;
        setContentData({
          title: data?.title,
          typeId: data?.typeId,
          stateId: data?.stateId,
          description: data?.description,
          createdBy: data?.createdBy,
          createdAt: data?.createdAt,
          updatedBy: data?.updatedBy,
          updatedAt: data?.updatedAt
        });
        setDescription(data?.description);
      }
    });
  };

  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
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

              href={getLinkHref(detail?.roleId, "/page/content-management")}
              className="text-capitalize text-black"
            >
              Content management
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">View Content</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">View Content</h4>
              <Link

                href={getLinkHref(detail?.roleId, "/page/content-management")}
                className="btn_theme"
              >
                Back
              </Link>
            </div>
            <div className="card-body">
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-4">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter Title"
                        value={contentData?.title}
                        disabled
                      />
                    </Form.Group>
                  </div>



                  <div className="col-md-6">
                    <Form.Group className="mb-4">
                      <Form.Label>Type</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter Title"
                        value={pageType(contentData?.typeId)}
                        disabled
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-12 mb-4">
                    <Form.Group className="mb-4">
                      <Form.Label>Description</Form.Label>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: contentData?.description,
                        }}
                      />
                    </Form.Group>
                  </div>
                  {
                    console.log("contentData?.createdBy?.fullName", contentData)}
                  <div className="col-md-6">
                    {detail?.roleId == constant.ADMIN ? <tr>
                      <td>
                        <b>Created By</b>
                      </td>
                      <td><Link href={"#"} onClick={(e) => {

                        e.preventDefault()
                        if (contentData?.createdBy?.roleId !== constant.ADMIN) {


                          navigate.push(getLinkHrefRouteSingleView(detail?.roleId, contentData?.createdBy?._id, ROLE_STATUS(contentData?.createdBy?.roleId)))

                        } else {
                          navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                        }
                      }}> {contentData?.createdBy?.fullName ?? "-"} </Link></td>
                    </tr> : ""}

                    {detail?.roleId == constant.ADMIN ? <tr>
                      <td>
                        <b>Created On</b>
                      </td>
                      <td>{moment(contentData?.createdAt).format("LLL") ?? "-"}</td>
                    </tr> : ""}

                    {detail?.roleId == constant.ADMIN ? <tr>
                      <td>
                        <b>Updated By</b>
                      </td>
                      <td><Link href={"#"} onClick={(e) => {
                        e.preventDefault()
                        if (contentData?.updatedBy?.roleId !== constant.ADMIN) {
                          navigate.push(getLinkHrefRouteSingleView(detail?.roleId, contentData?.updatedBy?._id, ROLE_STATUS(contentData?.updatedBy?.roleId)))

                        } else {
                          navigate.push(getLinkHref(detail?.roleId, "/page/profile"))

                        }
                      }}> {contentData?.updatedBy?.fullName ?? "-"} </Link></td>
                    </tr> : ""}

                    {detail?.roleId == constant.ADMIN ? <tr>
                      <td>
                        <b>Updated On</b>
                      </td>
                      <td>{moment(contentData?.updatedAt).format("LLL") ?? "-"}</td>
                    </tr> : ""}

                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
