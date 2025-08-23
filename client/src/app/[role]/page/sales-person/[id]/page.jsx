"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import Swal from "sweetalert2";
import useSlider from "../../../../../../hooks/useSlider";
import userDummyImage from "../../../../../../public/assets/img/default.png";
import {
  ADD_PERMISSIONS,
  adminUpdateUserState,
  getUserDetail,
  UPDATE_PERMISSIONS,
} from "../../../../../../services/APIServices";
import { constant } from "../../../../../../utils/constants";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { getLinkHref, getLinkHrefRouteSingleView, ROLE_STATUS } from "../../../../../../utils/helper";
import useDetails from "../../../../../../hooks/useDetails";
import { useRouter } from "next/navigation";

const CustomerDetails = ({ params }) => {
  const [checked, setChecked] = useState([]);
  let navigate = useRouter()
  const [expanded, setExpanded] = useState([]);
  const [formData, setFormData] = useState({});
  const { id } = params;
  const toggleVal = useSlider();
  const transformPermissions = (permissions) => {

    const result = [];

    // Iterate through each category of permissions
    permissions?.forEach((category) => {
      const permissionObj = category?.value; // Accessing the value object directly
      // Check each permission and push the corresponding string to the result if true
      if (permissionObj?.add) result?.push(`${category.label}.add`);
      if (permissionObj?.edit) result?.push(`${category.label}.edit`);
      if (permissionObj?.delete) result?.push(`${category.label}.delete`);
      if (permissionObj?.view) result?.push(`${category.label}.view`);
      if (permissionObj?.active) result?.push(`${category.label}.active`);
      if (permissionObj?.status) result?.push(`${category.label}.status`); // Added for status permission
      if (permissionObj?.refund) result?.push(`${category.label}.refund`); // Added for refund permission
      if (permissionObj?.cancel) result?.push(`${category.label}.cancel`); // Added for cancel permission
      if (permissionObj?.review) result?.push(`${category.label}.review`); // Added for review permission
      if (permissionObj?.scan) result?.push(`${category.label}.scan`);
      // Added for scan permission
    });

    setChecked(result ?? []);
  };

  const {
    data: detail,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user-details", id],
    queryFn: async () => {
      const resp = await getUserDetail(id);
      if (resp?.data?.data?.permission?.rolesPrivileges?.length >= 0) {
        transformPermissions(
          JSON.parse(resp?.data?.data?.permission?.rolesPrivileges)
        );
      }
      return resp?.data?.data ?? {};
    },
  });

  const stateId = (state) => {
    switch (state) {
      case constant?.PENDING:
        return "Pending";
      case constant?.ACTIVE:
        return "Active";
      case constant?.INACTIVE:
        return "In Active";
      case constant?.BLOCKED:
        return "Blocked";
      case constant?.DELETED:
        return "Deleted";
      default:
        return;
    }
  };

  const handleStatus = (state) => {
    Swal.fire({
      title: "Are you sure?",
      // text: "You want to delete this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(state);
      }
    });
  };
  const { mutate } = useMutation({
    mutationFn: (state) => adminUpdateUserState(id, state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      refetch();
    },
  });

  let details = useDetails();

  const mutatePersmission = useMutation({
    mutationFn: (body) => ADD_PERMISSIONS(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      navigate.push(getLinkHref(details?.roleId, `/page/sales-person`));
    },
  });

  const editMutatePersmission = useMutation({
    mutationFn: (body) => UPDATE_PERMISSIONS(id, body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
    },
  });

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["permission-detail", id],
  //   queryFn: async ({ queryKey }) => {
  //     const [_key, id] = queryKey;
  //     const resp = await PERSMISSIONS_DETAIL(id);
  //     return resp?.data?.data;
  //   },
  // });

  // react  check box tree
  const nodes = [
    {
      label: "Product Management",
      value: "productManagement",
      children: [
        { label: "Add", value: "productManagement.add" },
        { label: "Edit", value: "productManagement.edit" },
        { label: "Delete", value: "productManagement.delete" },
        { label: "View", value: "productManagement.view" },
        { label: "Active/In-active", value: "productManagement.active" },
      ],
    },
    {
      label: "Order Management",
      value: "orderManagement",
      children: [
        { label: "View", value: "orderManagement.view" },
        { label: "Update Status", value: "orderManagement.status" },
        { label: "Refund", value: "orderManagement.refund" },
        { label: "Cancel", value: "orderManagement.cancel" },
        { label: "Review", value: "orderManagement.review" },
      ],
    },
  ];

  // Check if the company provides coupons
  const providesCoupons = detail?.companyDetails?.couponService;

  // Conditionally add Coupon Management node
  if (providesCoupons) {
    nodes.push({
      label: "Coupon Management",
      value: "couponManagement",
      children: [
        { label: "Scan", value: "couponManagement.scan" },
        { label: "View", value: "couponManagement.view" },
      ],
    });
  }

  const defaultChecked = [
    "productManagement.add",
    "productManagement.edit",
    "productManagement.delete",
    "productManagement.view",
    "productManagement.active",
    "orderManagement.view",
    "orderManagement.status",
    "orderManagement.refund",
    "orderManagement.cancel",
    "orderManagement.review",
  ];

  if (providesCoupons) {
    defaultChecked.push("couponManagement.scan", "couponManagement.view");
  }

  // Set the initial checked state
  useEffect(() => {
    setChecked(defaultChecked);
  }, [providesCoupons]);

  // use effect

  // useEffect(() => {
  //   if (data) {
  //     const transformedData = transformPermissions(data);
  //     setChecked(transformedData);
  //     handleCheck(transformedData);
  //   }
  // }, [data]);

  const handleCheck = (checked) => {
    setChecked(checked);
    const managementCategories = [
      "productManagement",
      "orderManagement",
      "couponManagement",
    ];
    // Create a map for quick access to the children permissions
    const permissionMap = nodes?.reduce((acc, node) => {
      acc[node?.value] = node?.children?.map((child) => child?.value);
      return acc;
    }, {});

    const result = managementCategories?.map((category) => {
      const categoryChecked = checked?.filter((item) =>
        item?.startsWith(category)
      );

      // Create an object to hold permission values
      const permissions = {};

      // Check for each permission if it exists in the permissionMap
      permissionMap[category]?.forEach((permission) => {
        const permissionKey = permission?.split(".")?.pop(); // Get the last part of the permission
        permissions[permissionKey] = categoryChecked?.includes(permission); // Mark as true or false based on checked
      });

      return {
        label: category,
        value: permissions, // Directly assign the permissions object
      };
    });
    setFormData(result);
  };

  const handleExpand = (expanded) => {
    setExpanded(expanded);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (checked?.length === 0) {
      toastAlert("error", "Kindly assign at least one module");
      return;
    }

    const body = {
      rolesPrivileges: JSON.stringify(formData),
      sellerId: id,
    };

    mutatePersmission.mutate(body);
  };

  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href={getLinkHref(detail?.roleId, `/page`)} className="text-black text-capitalize">
              home
            </Link>
          </li>
          <li>/</li>
          <li>
            {" "}
            <Link
              href={getLinkHref(detail?.roleId, `/page/sales-person`)}
              className="text-black text-capitalize"
            >
              sales person
            </Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">sales person detail</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Sales Person</h4>
              <Link href={getLinkHref(detail?.roleId, `/page/sales-person`)} className="btn_theme">
                Back
              </Link>
            </div>
            <div className="card-body">
              <div className="product-detail mb-5 px-md-4 ">
                <div className="detail-content pt-2 custom_margin">
                  <div className="client-img mb-5">
                    <Image
                      src={detail?.profileImg || userDummyImage}
                      alt="profile-img"
                      height={50}
                      width={50}
                    />
                  </div>
                </div>
                <Row>
                  <Col md={6}>
                    <Table bordered>
                      <tr>
                        <td>
                          <b>Full Name : </b>
                        </td>
                        <td>{detail?.fullName ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Email : </b>
                        </td>
                        <td>{detail?.email ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Phone Number :</b>
                        </td>
                        <td>
                          {detail?.countryCode} {detail?.mobile}
                        </td>
                      </tr>
                    </Table>
                  </Col>

                  <Col md={6}>
                    <Table bordered>
                      <tr>
                        <td>
                          <b>Company : </b>
                        </td>
                        <td>{detail?.companyDetails?.company ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Branch : </b>
                        </td>
                        <td>{detail?.branchDetails?.branchName ?? "-"}</td>
                      </tr>

                      {details?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (details?.createdBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(details?.roleId, detail?.createdBy?._id, ROLE_STATUS(detail?.createdBy?.roleId)))
                          } else {
                            navigate.push(getLinkHref(details?.roleId, "/page/profile"))
                          }
                        }}> {detail?.createdBy?.fullName} </Link></td>
                      </tr> : ""}

                      {details?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Created On</b>
                        </td>
                        <td>{moment(detail?.createdAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}

                      {details?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated By</b>
                        </td>
                        <td><Link href={"#"} onClick={(e) => {
                          e.preventDefault()
                          if (detail?.updatedBy?.roleId !== constant.ADMIN) {
                            navigate.push(getLinkHrefRouteSingleView(details?.roleId, detail?.updatedBy?._id, ROLE_STATUS(detail?.updatedBy?.roleId)))
                          } else {
                            navigate.push(getLinkHref(details?.roleId, "/page/profile"))

                          }
                        }}> {detail?.updatedBy?.fullName} </Link></td>
                      </tr> : ""}

                      {detail?.roleId == constant.ADMIN ? <tr>
                        <td>
                          <b>Updated On</b>
                        </td>
                        <td>{moment(detail?.updatedAt).format("LLL") ?? "-"}</td>
                      </tr> : ""}

                      <tr>
                        <td>
                          <b>State : </b>
                        </td>
                        <td>{stateId(detail?.stateId)}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Last Visit Time : </b>
                        </td>
                        <td>{moment(detail?.lastVisitTime).format("LL")}</td>
                      </tr>

                      <tr>
                        <td>
                          <b>Status</b>
                        </td>
                        <td>
                          {detail?.stateId === constant?.PENDING && (
                            <span>Pending</span>
                          )}
                          {detail?.stateId === constant?.ACTIVE && (
                            <span className="badge bg-success">Active</span>
                          )}
                          {detail?.stateId === constant?.REJECT && (
                            <span>Reject</span>
                          )}
                          {detail?.stateId === constant?.INACTIVE && (
                            <span className="badge bg-warning">In-Active</span>
                          )}
                        </td>
                      </tr>
                    </Table>
                    <div className="d-flex justify-content-end">
                      {detail?.stateId === constant?.PENDING && (
                        <>
                          <button
                            title="Active"
                            onClick={() => handleStatus(constant?.ACTIVE)}
                            className="d-inline-block bg-success btn-sm py-2 ms-2"
                          >
                            Active
                          </button>
                          <button
                            title="Reject"
                            onClick={() => handleStatus(constant?.REJECT)}
                            className="d-inline-block bg-danger py-2 btn-sm ms-2"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {detail?.stateId === constant?.ACTIVE && (
                        <button
                          title="In-Active"
                          onClick={() => handleStatus(constant?.INACTIVE)}
                          className="d-inline-block bg-warning btn-sm py-2 ms-2 btn btn-theme"
                        >
                          In-Active
                        </button>
                      )}
                      {detail?.stateId !== constant?.PENDING &&
                        detail?.stateId !== constant?.ACTIVE && (
                          <button
                            title="Active"
                            onClick={() => handleStatus(constant?.ACTIVE)}
                            className="d-inline-block bg-success btn-sm py-2 ms-2 btn btn-theme"
                          >
                            Active
                          </button>
                        )}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <h4 className="text-muted">Assign Modules</h4>
                  <form onSubmit={handleSubmit}>
                    <CheckboxTree
                      nodes={nodes}
                      checked={checked}
                      expanded={expanded}
                      onCheck={handleCheck}
                      onExpand={handleExpand}
                      showNodeIcon={false}
                      icons={{
                        expandClose: <AiOutlineRight />,
                        expandOpen: <AiOutlineDown />,
                      }}
                      checkModel={"all"}
                      nativeCheckboxes={true}
                    />

                    {/* {checked.length > 0 && ( */}
                    <button
                      className="btn btn-theme btn-sm"
                      type="submit"
                      disabled={Object.keys(formData).length === 0}
                    >
                      Submit
                    </button>
                    {/* )} */}
                  </form>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
