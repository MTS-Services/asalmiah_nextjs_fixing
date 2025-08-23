/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { Pagination } from "@/app/components/Pagination";
import NoDataFound from "@/app/no-data-found/page";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { FaCaretDown, FaCaretUp, FaEye, FaFileImport } from "react-icons/fa";
import { FaBan, FaCheck } from "react-icons/fa6";
import { MdCreate } from "react-icons/md";
import { AsyncPaginate } from "react-select-async-paginate";
import Swal from "sweetalert2";
import * as Yup from "yup";
import useDetails from "../../../../../hooks/useDetails";
import useSlider from "../../../../../hooks/useSlider";
import {
  ADD_IMPORT_CSV,
  DELETE_ADMIN_PRODUCT,
  GET_COMPANY_API,
  GET_DOWNLOAD_SAMPLE,
  getAdminProductLists,
  STATE_UPDATE_PRODUCT_API,
} from "../../../../../services/APIServices";
import { constant, Paginations } from "../../../../../utils/constants";
import DebounceEffect from "../../../../../utils/DebounceEffect";
import {
  CheckAdminState,
  checkLanguage,
  FORMAT_NUMBER,
  formatCurrency,
  getLinkHref,
  getLinkHrefRouteSingleView,
  getPermissionsByLabel,
  ROLE_STATUS,
  serialNumber,
  truncate,
} from "../../../../../utils/helper";
import { toastAlert } from "../../../../../utils/SweetAlert";

const Products = () => {
  const [showImport, setShowImport] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  let navigate = useRouter()
  const detail = useDetails();
  const handleShowImport = () => setShowImport(true);
  const handleCloseImport = () => {
    setShowImport(false);
    importresetForm();
  };
  const isSlider = useSlider();
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [companyArr, setCompanyArr] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: null,
    order: null,
  });

  const handleSortingChange = (column) => {
    if (column === sortConfig.column) {
      setSortConfig({
        column,
        order: sortConfig.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({
        column,
        order: "asc",
      });
    }
  };
  // search company
  const searchCompany = async (search, loadedOptions, { page }) => {
    let resp = await GET_COMPANY_API(page, search);
    let array = await resp?.data?.data;

    return {
      options: array?.map((i) => ({
        label: i?.company,
        value: i?._id,
      })),
      hasMore: resp?.data?.data?.length > 0 ? true : false,
      additional: {
        page: page + 1,
      },
    };
  };

  // const handleCompanyChange = (selectedOptions) => {
  //   const companyIds = selectedOptions?.map((option) => option.value);
  //   setCompanyArr(companyIds.toString());
  // };

  const handleCompanyChange = (selectedOption) => {
    const companyId = selectedOption ? selectedOption.value : null;
    setCompanyArr(companyId);
  };

  const [list, setList] = useState({
    data: [],
    total: null,
    filter: "",
  });

  const { data, total, filter } = list;

  useEffect(() => {
    getData(page, search, state, companyArr);
  }, [page, search, state, companyArr]);

  const getData = async (page, search, state, companyArr) => {
    try {
      const response = await getAdminProductLists(
        page,
        search,
        state,
        companyArr
      );
      if (response?.status === 200) {
        setList((prevState) => ({
          ...prevState,
          data: response?.data?.data,
          total: response?.data?._meta?.totalCount,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const { data: getProductList, refetch } = useQuery({
  //   queryKey: ["getProduct-list", page, state, companyArr],
  //   queryFn: async () => {
  //     const resp = await getAdminProductLists(page, search, state, companyArr);
  //     setMeta(resp?.data?._meta);
  //     return resp?.data?.data ?? [];
  //   },
  // });

  const mutationImport = useMutation({
    mutationFn: (body) => ADD_IMPORT_CSV(body),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state, companyArr);
      importresetForm();
      handleCloseImport();
      importresetForm();
    },
  });

  const {
    handleSubmit: handleSubmitImport,
    setFieldValue: setFieldValueImport,
    values: importValues,
    errors: importerrors,
    touched: importtouched,
    resetForm: importresetForm,
  } = useFormik({
    initialValues: {
      csvFile: "",
    },
    validationSchema: Yup.object().shape({
      csvFile: Yup.mixed()
        .required("File is required")
        .test("fileFormat", "Invalid file format", (value) => {
          return (
            value &&
            [
              "text/csv",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ].includes(value?.type)
          );
        }),
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      if (values?.csvFile) {
        formData.append("csvFile", values?.csvFile);
      }
      mutationImport.mutate(formData);
    },
  });

  // Import Section
  const downloadSampleFile = async () => {
    const resp = await GET_DOWNLOAD_SAMPLE();
    if (resp) {
      window.open(resp?.data?.url);
      toastAlert("success", resp?.data?.message);
    }
  };
  //  shortning

  const sortedData = list?.data?.sort((a, b) => {
    if (sortConfig.column === "Product Name") {
      if (sortConfig.order === "asc") {
        return a.productName.localeCompare(b.productName);
      } else {
        return b.productName.localeCompare(a.productName);
      }
    } else if (sortConfig.column === "createdOn") {
      if (sortConfig.order === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    }
  });

  const handleToggleState = (id, state) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to update the status !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#378ce7",
        cancelButtonColor: "#d33",
        confirmButtonText:
          state == constant?.ACTIVE ? "Yes, Active it !" : "Yes, Inactive it !",
      }).then(async (result) => {
        if (result.isConfirmed) {
          stateMutation?.mutate({ id, state });
        }
      });
    } catch (error) {
      console.error("error", error);
    }
  };

  const stateMutation = useMutation({
    mutationFn: (body) => STATE_UPDATE_PRODUCT_API(body?.id, body?.state),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);
      getData(page, search, state, companyArr); // Ensure we fetch the updated data
    },
  });

  const onSearch = (value) => {
    setSearch(value);
    getData(page, value, state);
  };

  const { mutate } = useMutation({
    mutationFn: (payload) => DELETE_ADMIN_PRODUCT(payload),
    onSuccess: (resp) => {
      toastAlert("success", resp?.data?.message);

      getData(
        selectedProducts?.length == 10 ? Number(page) - 1 : page,
        search,
        state
      );
      setSelectedProducts([]);
    },
  });

  const handleDelete = (ids) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete these products!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutate(ids);
      }
    });
  };
  const handleCheckboxChange = (id) => {
    setSelectedProducts(
      (prev) =>
        prev?.includes(id)
          ? prev?.filter((productId) => productId !== id) // Deselect
          : [...prev, id] // Select
    );
  };

  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      handleDelete(selectedProducts);
    } else {
      toastAlert("warning", "No products selected for deletion.");
    }
  };
  let permissionData = localStorage.getItem("permissionStore")

  // Permissions
  const productManagementPermissions = getPermissionsByLabel(
    permissionData && JSON.parse(permissionData)?.rolesPrivileges,

    "productManagement"
  );



  return (
    <>
      <div className={isSlider ? "bodymain fullbody" : "bodymain "}>
        <div className="breadcrum-top mb-4">
          <ul className="d-flex align-items-center gap-2">
            <li>
              <Link href={getLinkHref(detail?.roleId, "/page")} className="text-black text-capitalize">
                home
              </Link>
            </li>
            <li>/</li>

            <li className="text-capitalize">Product management</li>
          </ul>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
                <h4 className="mb-md-0 p-3">Product Management</h4>
                <div className="filter_dropdown flex-wrap">
                  {(productManagementPermissions?.at(0)?.value?.add == true &&
                    (detail?.roleId === constant.DESIGNED_USER || detail?.roleId === constant.PROMOTION_USER)) ||
                    detail?.roleId == constant.ADMIN ? (
                    <Link

                      href={getLinkHref(detail?.roleId, "/page/product-management/add")}
                      className="btn_theme"
                    >
                      Add Product
                    </Link>
                  ) : (
                    ""
                  )}
                  <div className="form-group position-relative selectform mb-0">
                    <DebounceEffect onSearch={onSearch} />
                  </div>
                  <div className="form-group position-relative selectform mb-0 select-drop ">
                    <AsyncPaginate
                      loadOptions={searchCompany}
                      onChange={handleCompanyChange}
                      additional={{
                        page: 1,
                      }}
                      isClearable
                      placeholder="Select Company"
                    />
                  </div>
                  <div className="form-group position-relative selectform mb-0">
                    <Form.Select onChange={(e) => setState(e.target.value)}>
                      <option value={""}>All</option>
                      <option value={constant?.ACTIVE}>Active</option>
                      <option value={constant?.INACTIVE}>Inactive</option>
                      <option value={constant?.PRODUCT_STOCK}>Stock</option>
                      <option value={constant?.PRODUCT_OUTOFSTOCK}>
                        Out Of Stock
                      </option>
                      <option value={constant?.PRODUCT_DELTED}>Delete</option>
                    </Form.Select>
                  </div>

                  <button onClick={handleShowImport} className="btn_theme">
                    Import
                  </button>

                  {selectedProducts?.length !== 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="btn_theme"
                    >
                      Delete Products
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              sortedData.length > 0
                                ? sortedData.every((data) =>
                                  selectedProducts.includes(data._id)
                                )
                                : false
                            }
                            onChange={() => {
                              if (
                                sortedData.every((data) =>
                                  selectedProducts.includes(data._id)
                                )
                              ) {
                                // Deselect all products on the current page
                                setSelectedProducts((prev) =>
                                  prev.filter(
                                    (id) =>
                                      !sortedData
                                        .map((data) => data._id)
                                        .includes(id)
                                  )
                                );
                              } else {
                                // Select all products on the current page
                                setSelectedProducts((prev) => [
                                  ...new Set([
                                    ...prev,
                                    ...sortedData.map((data) => data._id),
                                  ]), // Ensure unique IDs
                                ]);
                              }
                            }}
                          />
                        </th>
                        <th>Sn.</th>
                        <th
                          className="cursor_pointer"
                          onClick={() => handleSortingChange("Product Name")}
                        >
                          Product Name
                          {sortConfig.column === "Product Name" ? (
                            sortConfig.order === "asc" ? (
                              <FaCaretUp />
                            ) : (
                              <FaCaretDown />
                            )
                          ) : (
                            <FaCaretDown />
                          )}
                        </th>
                        <th>Company Name</th>
                        <th>Category Name</th>
                        <th>Product Code</th>
                        <th>Price</th>
                        <th>Discount (%)</th>
                        <th>Quantity</th>
                        <th>Sort Order No.</th>
                        <th
                          className="cursor_pointer"
                          onClick={() => handleSortingChange("createdOn")}
                        >
                          Created On
                          {sortConfig.column === "createdOn" ? (
                            sortConfig.order === "asc" ? (
                              <FaCaretUp />
                            ) : (
                              <FaCaretDown />
                            )
                          ) : (
                            <FaCaretDown />
                          )}
                        </th>

                        {detail?.roleId == constant.ADMIN ? <th>Created By</th> : ""}

                        {detail?.roleId == constant.ADMIN ? <th>Updated By</th> : ""}
                        {detail?.roleId == constant.ADMIN ? <th>Updated On</th> : ""}
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="gridjs-tbody">
                      {sortedData?.length > 0 ? (
                        sortedData?.map((data, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedProducts?.includes(data?._id)}
                                onChange={() => handleCheckboxChange(data?._id)}
                              />
                            </td>
                            <td>{serialNumber(page, index)}</td>
                            <td>
                              {checkLanguage(
                                data?.productName,
                                data?.productArabicName
                              )}
                            </td>

                            <td>
                              <Link
                                href={getLinkHref(detail?.roleId, `/page/company-management/view/${data?.companyDetails?._id}`)}
                                target="_blank"
                              >
                                {data?.companyDetails?.company}
                              </Link>
                            </td>
                            <td>
                              <Link
                                href={getLinkHref(detail?.roleId, `/page/company-management/edit/${data?.companyDetails?._id}`)}

                                target="_blank"
                              >
                                {data?.companyDetails?.categoryDetails
                                  ?.category ?? "-"}
                              </Link>
                            </td>
                            <td>{data?.productCode ?? "-"}</td>
                            <td>
                              {formatCurrency(
                                data?.price
                                  ? FORMAT_NUMBER(data?.price)
                                  : FORMAT_NUMBER(data?.mrp),
                                data?.companyDetails?.country
                              )}
                            </td>
                            <td>
                              {data?.discount
                                ? FORMAT_NUMBER(data?.discount)
                                : "No discount available"}
                            </td>
                            <td>
                              {data?.quantity === 0 ? (
                                <span style={{ color: "red" }}>
                                  Out of Stock
                                </span>
                              ) : (
                                data?.quantity
                              )}
                            </td>
                            <td>{data?.order ?? "-"}</td>
                            <td>
                              {moment(data?.createdAt).format(
                                "MMM Do YYYY, h:mm:ss A"
                              )}
                            </td>
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.createdBy?.roleId !== constant.ADMIN) {



                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.createdBy?._id, ROLE_STATUS(data?.createdBy?.roleId)))

                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                                }
                              }}

                              >  {data?.createdBy?.fullName}</Link>

                            </td> : ""}
                            {detail?.roleId == constant.ADMIN ? <td>
                              <Link href={"#"} onClick={(e) => {
                                e.preventDefault()
                                if (data?.updatedBy?.roleId !== constant.ADMIN) {

                                  navigate.push(getLinkHrefRouteSingleView(detail?.roleId, data?.updatedBy?._id, ROLE_STATUS(data?.updatedBy?.roleId)))



                                } else {
                                  navigate.push(getLinkHref(detail?.roleId, "/page/profile"))
                                }
                              }}>  {data?.updatedBy?.fullName}</Link>

                            </td> : ""}
                            {detail?.roleId == constant.ADMIN ? <td>{moment(data?.updatedAt).format("LLL")}</td> : ""}

                            <td>{CheckAdminState(data?.stateId)}</td>
                            <td>
                              <div className="d-flex">
                                {/* View Button */}
                                {(productManagementPermissions?.at(0)
                                  ?.value?.view == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(
                                      detail?.roleId,
                                      `/page/product-management/view-product/${data?._id}`
                                    )}
                                  >
                                    <Button
                                      className="btn_green btn btn-sm ms-2"
                                      title="View"
                                    >
                                      <FaEye />
                                    </Button>
                                  </Link>
                                ) : (
                                  ""
                                )}

                                {(productManagementPermissions?.at(0)
                                  ?.value?.edit == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  <Link
                                    href={getLinkHref(
                                      detail?.roleId,
                                      `/page/product-management/edit/${data?._id}`
                                    )}
                                  >
                                    <Button
                                      title="Edit"
                                      className="btn_blue btn btn-sm ms-2"
                                    >
                                      <MdCreate />
                                    </Button>
                                  </Link>
                                ) : (
                                  ""
                                )}

                                {(productManagementPermissions?.at(0)
                                  ?.value?.active == true &&
                                  (detail?.roleId === constant.DESIGNED_USER ||
                                    detail?.roleId ===
                                    constant.PROMOTION_USER)) ||
                                  detail?.roleId == constant.ADMIN ? (
                                  data?.stateId === constant?.ACTIVE ? (
                                    <Button
                                      className="btn_blue2 btn btn-sm ms-2"
                                      title="Inactive"
                                      onClick={() =>
                                        handleToggleState(
                                          data?._id,
                                          constant?.INACTIVE
                                        )
                                      }
                                    >
                                      {" "}
                                      <FaBan />{" "}
                                    </Button>
                                  ) : (
                                    <Button
                                      className="btn_block btn btn-sm ms-2"
                                      title="Active"
                                      onClick={() =>
                                        handleToggleState(
                                          data?._id,
                                          constant?.ACTIVE
                                        )
                                      }
                                    >
                                      {" "}
                                      <FaCheck />{" "}
                                    </Button>
                                  )
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="15">
                            <NoDataFound />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {Math.ceil(list?.total / 10) > 1 && (
                  <Pagination
                    totalCount={list?.total}
                    handelPageChange={(e) => setPage(e.selected + 1)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMPORT */}
      <Modal
        className="estimate_modal modal-lg"
        show={showImport}
        onHide={() => {
          handleCloseImport();
          importresetForm();
        }}
      >
        <Modal.Header className="border-0 pb-0" closeButton>
          <Modal.Title>Import Product </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="estimate_form">
            <Row>
              <Col lg={12}>
                <div className="image_upload mb-3">
                  <div className="upload-images-box">
                    <div className="label">
                      <FaFileImport size={50} />
                      <h5 title={importValues?.csvFile?.name}>
                        {truncate(importValues?.csvFile?.name, 30)}
                      </h5>
                    </div>
                    <input
                      name="csvFile"
                      type="file"
                      accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                      onChange={(e) =>
                        setFieldValueImport("csvFile", e.target.files[0])
                      }
                    />
                  </div>
                </div>
              </Col>
              <span className="text-danger">
                {importerrors?.csvFile && importerrors?.csvFile}
              </span>

              <span className="text-danger"></span>
              <Col lg={12} className="sample-download">
                <h4>
                  <span className="fw-bold">
                    Before uploading please make sure :
                  </span>
                </h4>
                <ul>
                  <li>
                    <span className="d-flex align-items-center">
                      Download the excel template from here.{" "}
                      <a
                        className="btn_theme btn-md mb-2 cursor-pointer"
                        onClick={() => downloadSampleFile()}
                      >
                        (Download)
                      </a>
                    </span>
                  </li>

                  <li>
                    <span className="">Add details correctly.</span>
                  </li>
                  <li>
                    <span className="">
                      Add Company Name It should be Taken From list Added on
                      Company List
                    </span>
                  </li>
                  <li>
                    <span className="">
                      Start date, end date and coupon validity should be in
                      given format : YYYY-DD-MM (example :{" "}
                      {moment(new Date()).format("YYYY-MM-DD")})
                    </span>
                  </li>

                  {/* <li>
                <span className="">
                 Price with Size (example :{" "}
                    `{[
                    { sizes: "S", price: "70", mrp: "80", discount: "80" },
                    { sizes: "M", price: "80", mrp: "100", discount: "80" },
                  ]}`
                  )
                </span>
              </li> */}

                  <li>
                    <span className="">
                      Add size and Color According To Given Format in Csv
                    </span>
                  </li>
                  <li>
                    <span className="">
                      MRP, Price should be in numeric form
                    </span>
                  </li>
                  <li>
                    <span className="">
                      Save the file as a .CSV file anywhere on your computer and
                      upload.
                    </span>
                  </li>
                </ul>
              </Col>
              <Col
                lg={12}
                className="text-center d-flex justify-content-center mt-3 mb-2"
              >
                <Button
                  className="btn_theme"
                  type="button"
                  onClick={handleSubmitImport}
                >
                  Upload
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Products;
