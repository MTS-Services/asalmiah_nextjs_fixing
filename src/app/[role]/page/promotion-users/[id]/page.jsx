"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import Swal from "sweetalert2";
import { AsyncPaginate } from "react-select-async-paginate";
import useSlider from "../../../../../../hooks/useSlider";
import userDummyImage from "../../../../../../public/assets/img/default.png";
import {
  ADD_PERMISSIONS,
  adminUpdateUserState,
  GET_SEARCH_CATEGORY_API,
  getUserDetail,
  UPDATE_PERMISSIONS,
} from "../../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../../utils/constants";
import { toastAlert } from "../../../../../../utils/SweetAlert";
import { useRouter } from "next/navigation";
import { countryCode } from "../../../../../../utils/CountryCode";
import { SubAdminNodes } from "@/app/components/SubAdminNodes";
import { ShimmerPostDetails } from "react-shimmer-effects";

const PromotionUsersView = ({ params }) => {
  const [checked, setChecked] = useState([]);
  const [values, setValues] = useState({ category: [], country: "" });
  const [expanded, setExpanded] = useState([]);
  const [formData, setFormData] = useState({});
  const { id } = params;
  const toggleVal = useSlider();
  const navigate = useRouter();

  const transformPermissions = (permissions) => {
    const result = [];

    const processPermissions = (category, categoryLabel) => {
      const permissionObj = category?.value;

      // Push the main category label to the result
      result?.push(categoryLabel);

      // Check each permission and push the corresponding string to the result if true
      if (permissionObj?.add) result.push(`${categoryLabel}.add`);
      if (permissionObj?.edit) result.push(`${categoryLabel}.edit`);
      if (permissionObj?.delete) result.push(`${categoryLabel}.delete`);
      if (permissionObj?.view) result.push(`${categoryLabel}.view`);
      if (permissionObj?.active) result.push(`${categoryLabel}.active`);

      // If there are sub-categories, process them recursively
      if (permissionObj?.subNav) {
        Object?.keys(permissionObj?.subNav)?.forEach(subCategoryKey => {
          const subCategory = permissionObj?.subNav[subCategoryKey];
          result?.push(`${categoryLabel}.${subCategoryKey}`);

          Object?.keys(subCategory)?.forEach(subKey => {
            if (subKey !== 'path' && subCategory[subKey]) {
              result?.push(`${categoryLabel}.${subCategoryKey}.${subKey}`);
            }
          });
        });
      }
    };

    permissions?.forEach((category) => {
      processPermissions(category, category?.label);
    });

    return result;
  };

  const { data: detail, isFetching, isPending, refetch } = useQuery({
    queryKey: ["user-details", id],
    queryFn: async () => {
      const resp = await getUserDetail(id);
      if (resp?.data?.data?.permission?.rolesPrivileges?.length !== 0) {
        transformPermissions(JSON.parse(resp?.data?.data?.permission?.rolesPrivileges));
      }
      setChecked(resp?.data?.data?.permission?.permissionsChecked ? JSON.parse(resp?.data?.data?.permission?.permissionsChecked) : []);
      setValues({
        category: resp?.data?.data?.permission?.categories?.map((data) => ({
          label: data?.category,
          value: data?._id,
        })),
        country: resp?.data?.data?.permission?.country,
      });
      return resp?.data?.data ?? {};
    },
    onError: (error) => {
      toastAlert("error", error.message);
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
    onError: (error) => {
      toastAlert("error", error.message);
    },
  });

  const mutatePermission = useMutation({
    mutationFn: (body) => ADD_PERMISSIONS(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      // navigate.push(`/admin/page/promotion-users`);
    },
    onError: (error) => {
      toastAlert("error", error.message);
    },
  });

  const editMutatePermission = useMutation({
    mutationFn: (body) => UPDATE_PERMISSIONS(id, body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
    },
    onError: (error) => {
      toastAlert("error", error.message);
    },
  });
  const handleCheck = (checked) => {
    setChecked(checked);
    const managementCategories = [
        "promotionManagement",
        "offerManagement",
        "usersManagement",
        "classificationManagement",
        "companyManagement",
        "productManagement",
        "orderManagement",
        "reportsManagement",
        "transactionManagement",
        "fortuneManagement",
        "settings"
    ];

    const permissionMap = {};

    const buildPermissionMap = (nodes) => {
        nodes.forEach(node => {
            permissionMap[node.value] = permissionMap[node.value] || [];
            if (node.children) {
                node.children.forEach(child => {
                    permissionMap[node.value].push(child.value);
                    buildPermissionMap([child]);
                });
            }
        });
    };

    buildPermissionMap(SubAdminNodes);

    const result = managementCategories.map((category) => {
        const categoryChecked = checked.filter((item) => item.startsWith(category));
        const permissions = {};

        const categoryPermissions = permissionMap[category] || [];
        categoryPermissions.forEach((permission) => {
            const permissionKey = permission.split(".").pop();
            permissions[permissionKey] = categoryChecked.includes(permission);
        });

        // Check if at least one permission for this category is checked
        const anyPermissionChecked = categoryChecked.length > 0;

        // If at least one permission is checked, include the category
        if (anyPermissionChecked) {
            const categoryNode = SubAdminNodes.find(node => node.value === category);
            if (categoryNode && categoryNode.children) {
                const subNav = {};
                let hasSubNav = false; // Track if any sub-category has permissions

                categoryNode.children.forEach(subCategory => {
                    const subCategoryChecked = checked.filter((item) => item.startsWith(subCategory.value));
                    const subPermissions = {};
                    buildSubPermissions(subCategory, subCategoryChecked, subPermissions);

                    // Only include the sub-category if it has any permissions checked
                    if (Object.values(subPermissions).some(value => value === true)) {
                        subNav[subCategory.value.split(".").pop()] = {
                            ...subPermissions,
                            path: subCategory.path
                        };
                        hasSubNav = true; // Mark that we have at least one sub-category with permissions
                    }
                });

                // Only add subNav if it has any valid entries
                if (hasSubNav) {
                    permissions.subNav = subNav;
                }
            }

            return {
                label: category,
                value: permissions,
            };
        }

        return null; // Skip this category if no permissions are checked
    }).filter(Boolean); // Remove null values from the result

    setFormData(result);
};

// Recursive function to build permissions for sub-categories
const buildSubPermissions = (node, checked, subPermissions) => {
    if (node.children) {
        node.children.forEach(child => {
            const childKey = child.value.split(".").pop(); // Get the last part of the permission
            subPermissions[childKey] = checked.includes(child.value); // Mark as true or false based on checked
            buildSubPermissions(child, checked, subPermissions); // Recursively build for sub-children
        });
    }
};
  const handleExpand = (expanded) => {
    setExpanded(expanded);
  };

  const handleChange = (e, categoryValue) => {
    if (categoryValue) {
      setValues((prevValues) => ({
        ...prevValues,
        category: e,
      }));
    } else {
      const { name, value } = e.target;
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const searchCategoryList = async (search, loadedOptions, { page }) => {
    let resp = await GET_SEARCH_CATEGORY_API(page, Paginations.PER_PAGE, constant?.ACTIVE, search);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.category,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0,
      additional: {
        page: page + 1,
      },
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (checked.length === 0) {
      toastAlert("error", "Kindly assign at least one module");
      return;
    } else if (values.category.length === 0) {
      toastAlert("error", "Select at least one category");
      return;
    } else if (!values.country) {
      toastAlert("error", "Country is a required field");
      return;
    }

    const body = {
      promotionId: id,
      categoryId: values.category.map(data => data.value).join(','),
      country: values.country,
      permissionsChecked: JSON.stringify(checked),
    };
    if (Object.keys(formData).length !== 0) {
      body.rolesPrivileges = JSON.stringify(formData);
    }
    mutatePermission.mutate(body);
  };

  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain"}>
      <div className="breadcrum-top mb-4">
        <ul className="d-flex align-items-center gap-2">
          <li>
            <Link href="/admin/page" className="text-black text-capitalize">home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/admin/page/promotion-users" className="text-black text-capitalize">Promotion User</Link>
          </li>
          <li>/</li>
          <li className="text-capitalize">Promotion User Detail</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-md-0">Promotion User</h4>
              <Link href={`/admin/page/promotion-users`} className="btn_theme">Back</Link>
            </div>
            <div className="card-body">
              <div className="product-detail mb-5 px-md-4">
                <div className="detail-content pt-2 custom_margin">
                  <div className="client-img mb-5">
                    <Image src={detail?.profileImg || userDummyImage} alt="profile-img" height={50} width={50} />
                  </div>
                </div>
                <Row>
                  <Col md={6}>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td><b>Full Name:</b></td>
                          <td>{detail?.fullName ?? "-"}</td>
                        </tr>
                        <tr>
                          <td><b>Email:</b></td>
                          <td>{detail?.email ?? "-"}</td>
                        </tr>
                        <tr>
                          <td><b>Phone Number:</b></td>
                          <td>{detail?.countryCode} {detail?.mobile}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td><b>State:</b></td>
                          <td>{stateId(detail?.stateId)}</td>
                        </tr>
                        <tr>
                          <td><b>Last Visit Time:</b></td>
                          <td>{moment(detail?.lastVisitTime).format("LL")}</td>
                        </tr>
                        <tr>
                          <td><b>Status:</b></td>
                          <td>
                            {detail?.stateId === constant?.PENDING && <span>Pending</span>}
                            {detail?.stateId === constant?.ACTIVE && <span className="badge bg-success">Active</span>}
                            {detail?.stateId === constant?.REJECT && <span>Reject</span>}
                            {detail?.stateId === constant?.INACTIVE && <span className="badge bg-warning">In-Active</span>}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end">
                      {detail?.stateId === constant?.PENDING && (
                        <>
                          <button title="Active" onClick={() => handleStatus(constant?.ACTIVE)} className="d-inline-block bg-success btn-sm py-2 ms-2">Active</button>
                          <button title="Reject" onClick={() => handleStatus(constant?.REJECT)} class Name="d-inline-block bg-danger py-2 btn-sm ms-2">Reject</button>
                        </>
                      )}
                      {detail?.stateId === constant?.ACTIVE && (
                        <button title="In-Active" onClick={() => handleStatus(constant?.INACTIVE)} className="d-inline-block bg-warning btn-sm py-2 ms-2 btn btn-theme">In-Active</button>
                      )}
                      {detail?.stateId !== constant?.PENDING && detail?.stateId !== constant?.ACTIVE && (
                        <button title="Active" onClick={() => handleStatus(constant?.ACTIVE)} className="d-inline-block bg-success btn-sm py-2 ms-2 btn btn-theme">Active</button>
                      )}
                    </div>
                  </Col>
                </Row>
                <h4 className="text-muted">Assign Modules</h4>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-4 position-relative">
                        <Form.Label className="fw-bold">Country</Form.Label>
                        <Form.Select label="country" name="country" value={values.country} onChange={handleChange}>
                          <option value="">Select Country</option>
                          {countryCode && countryCode.map((data, index) => (
                            <option value={data.country} key={index}>{data.country}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Category</Form.Label>
                        <AsyncPaginate
                          key={Math.random()}
                          value={values?.category}
                          loadOptions={searchCategoryList}
                          onChange={(selectedOptions) => handleChange(selectedOptions, "category")}
                          additional={{ page: 1 }}
                          placeholder="Enter category"
                          isMulti
                        />
                      </Form.Group>
                    </Col>
                    {isPending ? <ShimmerPostDetails cta variant="SIMPLE" /> : (
                      <CheckboxTree
                        nodes={SubAdminNodes}
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
                    )}
                    <button className="btn_theme btn-sm m-3" type="submit">
                      Submit
                    </button>
                  </Row>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionUsersView;