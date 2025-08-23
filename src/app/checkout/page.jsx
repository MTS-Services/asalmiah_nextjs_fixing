"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Form,
  Modal,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiClock1 } from "react-icons/ci";
import { FaMinus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { TiPlus } from "react-icons/ti";
import "react-international-phone/style.css";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import AddressModal from "../(customer)/address/AddressModal";
import "../(customer)/cart/page.scss";
import useCartSlice from "../../../hooks/useCartSlice";
import useDetails from "../../../hooks/useDetails";
import { addToCart, removeFromCart } from "../../../redux/features/cartSlice";
import {
  DECREMENT_CART_QUANTITY,
  DELETE_CART_ITEM,
  GET_BRANCHES_API,
  INCREMENT_CART_QUANTITY,
  PROMOCODE_USER_CART,
  PROMOCODE_USER_CART_WITHOUT_LOGIN,
  USER_ADDRESS_LIST,
  USER_CART,
  USER_CART_WITHOUT_LOGIN,
} from "../../../services/APIServices";
import { constant, Paginations } from "../../../utils/constants";
import Footer from "../../../utils/Footer";
import Header from "../../../utils/Header";
import {
  AddressType,
  filterPassedTime,
  formatCurrency,
  getDeviceToken,
} from "../../../utils/helper";
import { toastAlert } from "../../../utils/SweetAlert";
import UserLogInHeader from "../../../utils/UserLogInHeader";
import Breadcrums from "../components/Breadcrums";
import CartPriceDetails from "../components/CartPriceDetails";
import NoDataFound from "../components/no-data-found/page";
import { Pagination } from "../components/Pagination";
import useCountryState from "../../../hooks/useCountryState";
const Checkout = () => {
  let cart = useCartSlice();
  let detail = useDetails();
  let queryClient = useQueryClient();
  let dispatch = useDispatch();
  let router = useRouter();
  const selectedCountry = useCountryState()
  const [keyValue, setKeyValue] = useState();
  const [key, setKey] = useState(keyValue);
  const [key1, setKey1] = useState("profile1");
  const [show, setShow] = useState(false);
  const [deliveryOrderScheduling, setDeliveryOrderScheduling] = useState(1);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [meta, setMeta] = useState("");
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  /** branch ID  */
  const [branchSelectId, setBranchSelectId] = useState(null);
  const [couponBranchSelectId, setCouponBranchSelectId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [addressListsUsers, setAddressListsUsers] = useState([]);
  let promoCode = localStorage.getItem("promocode");
  const [timeSlots, setTimeSlots] = useState([]);

  const handleClose = () => {
    setShow(false);
    setDeliveryOrderScheduling(1);

    setStartDate(null);

    setSelectedTimeSlot(null);
  };

  function formatTime(hour = 0) {
    const formattedHour = hour % 24; // Ensure hour wraps around correctly
    return `${formattedHour.toString().padStart(2, "0")}:00`; // Format to 24-hour format
  }
  function generateTimeSlots(hoursToAdd) {
    const slots = [];
    const startHour = 9; // Original start hour (09:00)
    const endHour = 21; // 9 PM (21:00)
    const timeDifference = 3; // 3 hours

    // Adjust startHour based on hoursToAdd
    const adjustedStartHour = startHour + hoursToAdd;

    // Ensure we don't go beyond 10 PM (22:00)
    const maxHour = 22;

    // Generate slots from adjusted start hour to maxHour
    for (
      let hour = Math.max(adjustedStartHour, startHour);
      hour < maxHour;
      hour += timeDifference
    ) {
      const startTime = formatTime(hour);
      const endTime = formatTime(Math.min(hour + timeDifference, maxHour)); // Ensure we do not exceed 10 PM
      slots.push({ startTime, endTime });

      // If we reach 10 PM, we should break out of the loop
      if (endTime === "22:00") {
        break;
      }
    }
    setTimeSlots(slots);
  }
  function findMaxPrepareTime(products) {
    // Initialize a variable to hold the maximum prepareTime
    let maxPrepareTime = 0;

    // Loop through each product in the array
    products.forEach((product) => {
      // Convert prepareTime to a number and compare it with the current maxPrepareTime
      const prepareTime = parseInt(product?.productDetails?.prepareTime, 10);
      if (prepareTime > maxPrepareTime) {
        maxPrepareTime = prepareTime; // Update maxPrepareTime if current is greater
      }
    });
    generateTimeSlots(maxPrepareTime / 60);
  }
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const { data: cartListing, refetch } = useQuery({
    queryKey: ["cart-list-user", key],
    queryFn: async () => {
      const resp = promoCode
        ? detail == null || detail == undefined
          ? await PROMOCODE_USER_CART_WITHOUT_LOGIN(promoCode, key, getDeviceToken())
          : await PROMOCODE_USER_CART(promoCode, key)
        : detail == null || detail == undefined
          ? await USER_CART_WITHOUT_LOGIN(key, getDeviceToken())
          : await USER_CART(key);
      findMaxPrepareTime(resp?.data?.data?.cartList);

      if (
        resp?.data?.data?.cartList?.at(0)?.productDetails?.companyDetails
          ?.pickupService == true
      ) {
        setKeyValue(2);
      } else if (
        resp?.data?.data?.cartList?.at(0)?.productDetails?.companyDetails
          ?.couponService == true
      ) {
        setKeyValue(3);
      } else if (
        resp?.data?.data?.cartList?.at(0)?.productDetails?.companyDetails
          ?.deliveryEligible == true &&
        resp?.data?.data?.cartList?.at(0)?.productDetails?.companyDetails
          ?.deliveryService == true &&
        resp?.data?.data?.cartList?.at(0)?.productDetails?.companyDetails
          ?.couponService == true &&
        resp?.data?.data?.cartList?.at(0)?.productDetails?.companyDetails
          ?.pickupService == true
      ) {
        setKeyValue(1);
      } else {
        setKeyValue(1);
      }

      if (resp?.data?.data?.cartCount == 0) {
        router.push("/product-list");
      }
      return resp?.data?.data ?? [];
    },
  });

  useEffect(() => {
    getData(page);
  }, [page]);

  const getData = async () => {
    try {
      const response = await USER_ADDRESS_LIST(page);
      if (response?.status == 200) {
        setAddressListsUsers(response?.data?.data);
        setMeta(response?.data?._meta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("keyId", key);
    localStorage.removeItem("walletUse");
  }, [key, keyValue]);

  useEffect(() => {
    setKey(keyValue);
  }, [keyValue]);

  const updateCartHandler = async (type, item, quantity) => {
    const body = {
      quantity: quantity,
      web: true,
    };

    try {
      const response =
        type == "increment"
          ? await INCREMENT_CART_QUANTITY(item?._id, body)
          : await DECREMENT_CART_QUANTITY(item?._id, body);
      queryClient.invalidateQueries({ queryKey: ["cart-list-user"] });
      if (response?.status === 200) {
        if (quantity == 0) {
          try {
            const response = await DELETE_CART_ITEM(item?._id);
            if (response?.status === 200) {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: response?.data?.message,
                showConfirmButton: false,
                timer: 3000,
              });
              dispatch(removeFromCart(item));
              queryClient.invalidateQueries({ queryKey: ["cart-list-user"] });
              if (cart?.length == 0 || cartListing?.cartList?.length == 0) {
                router.push("/product-list");
              }
            }
          } catch (error) {
            toastAlert("error", error?.response?.data?.message);
          }
        } else {
          cart?.filter((data) => {
            if (data?._id === item?._id) {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Product updated successfully!",
                showConfirmButton: false,
                timer: 3000,
              });
              queryClient.invalidateQueries({ queryKey: ["cart-list-user"] });
              return dispatch(addToCart({ ...item, quantity }));
            }
          });
        }
      }
    } catch (error) {
      toastAlert("error", error?.response?.data?.message);
    }
  };

  const removeItemFromCart = async (item) => {
    try {
      const response = await DELETE_CART_ITEM(item?._id);
      if (response?.status === 200) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 3000,
        });

        dispatch(removeFromCart(item));
        if (cart?.length == 0 || cartListing?.cartList?.length == 0) {
          router.push("/product-list");
        }
        queryClient.invalidateQueries({ queryKey: ["cart-list-user"] });
      }
    } catch (error) {
      toastAlert("error", error?.response?.data?.message);
    }
  };

  const { data: branchList } = useQuery({
    queryKey: [
      "branch-lists-company",
      page,
      cartListing?.cartList?.at(0)?.productDetails?.company,
    ],
    queryFn: async () => {
      const resp = await GET_BRANCHES_API(
        page,
        cartListing?.cartList?.at(0)?.productDetails?.company
      );
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  const childRef = useRef();
  const callChildFunction = () => {
    if (childRef?.current) {
      childRef.current.handleSubmit(); // Call the child's handleShow function
    }
  };

  let walletAmount = localStorage.getItem("walletAmount");
  let walletUse = localStorage.getItem("walletUse");

  const handleSubmitFunc = (e) => {
    e.preventDefault();
    if (!startDate && !selectedTimeSlot) {
      toastAlert("error", "Select date and time for order");
    } else if (!startDate) {
      toastAlert("error", "Select date");
    } else if (!selectedTimeSlot) {
      toastAlert("error", "Select time slot");
    } else if (walletAmount > 0 && !walletUse) {
      localStorage.setItem("date", startDate);
      localStorage.setItem("time", selectedTimeSlot);
      localStorage.setItem("addressId", selectedAddressId);
      callChildFunction();
    } else {
      router.push(`/payment`);
      localStorage.setItem("date", startDate);
      localStorage.setItem("time", selectedTimeSlot);
      localStorage.setItem("addressId", selectedAddressId);
    }
  };

  return (
    <>
      {detail?.roleId == constant?.USER ? <UserLogInHeader refetchAPI={refetch} /> : <Header refetchAPI={refetch} />}
      <Breadcrums firstLink={"Home"} secondLink={"Checkout"} />

      <section className="cart-main">
        <Container>
          <Row>
            <Col lg={8}>
              <div className="cart-table">
                <div className="table-title mb-4">
                  <h5 className="fw-bold">Delivery information</h5>
                </div>
                <div className="delivery-main">
                  <Row>
                    <Col lg={12}>
                      <div>
                        <Tabs
                          id="controlled-tab-example"
                          activeKey={key}
                          onSelect={(k) => {
                            setKey(k);
                            localStorage.setItem("keyId", k);
                            if (k == 2) {
                              setSelectedAddressId(null);
                              localStorage.removeItem("addressId");
                              setCouponBranchSelectId(null);
                            } else if (k == 3) {
                              localStorage.removeItem("branchId");
                              setSelectedAddressId(null);
                              localStorage.removeItem("addressId");
                              setBranchSelectId(null);
                            } else {
                              localStorage.removeItem("branchId");
                              setCouponBranchSelectId(null);
                              setBranchSelectId(null);
                            }
                          }}
                          className="mb-3 gap-3"
                        >
                          {cartListing?.cartList[0]?.productDetails
                            ?.companyDetails?.deliveryEligible == true ||
                            cartListing?.cartList[0]?.productDetails
                              ?.companyDetails?.deliveryService == true ? (
                            <Tab eventKey="1" title="Delivery">
                              <Row>
                                <Col lg={12}>
                                  <div className="plans delivery-address">
                                    {addressListsUsers?.length !== 0 ? (
                                      addressListsUsers
                                        ?.filter(({ isDefault }) => isDefault)
                                        .map((data) => {
                                          return (
                                            <label
                                              className="plan basic-plan mb-3"
                                              for="basic"
                                            >
                                              <input
                                                type="radio"
                                                name="address"
                                                id="basic"
                                                value={data?._id}
                                                onChange={(e) => {
                                                  setSelectedAddressId(
                                                    e.target.value
                                                  );
                                                  localStorage.setItem(
                                                    "addressId",
                                                    e.target.value
                                                  );
                                                }}
                                                checked={
                                                  selectedAddressId == data?._id
                                                }
                                              />

                                              <div className="plan-content">
                                                <div className="d-flex align-items-start gap-3">
                                                  <div className="delivery-icon">
                                                    <IoHome />{" "}
                                                  </div>

                                                  <div className="delivery-txt">
                                                    <div className="d-flex align-items-start">
                                                      {" "}
                                                      {/* Align items to the top */}
                                                      <div>
                                                        <h6 className="fw-bold mb-0 text-capitalize">
                                                          {AddressType(
                                                            data?.type
                                                          )}
                                                        </h6>
                                                        <p className="mb-0">
                                                          {data?.area}
                                                        </p>
                                                      </div>
                                                      <span
                                                        onClick={handleShow1}
                                                        className="m-3 align-self-start" // Align the icon to the top
                                                        style={{
                                                          cursor: "pointer",
                                                        }} // Optional: Add pointer cursor for better UX
                                                      >
                                                        <FaPencil />
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="d-flex align-items-center justify-content-end mt-3 gap-2">
                                                <div className="treatment-type-select">
                                                  <div className="form-check">
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="propertytype"
                                                      value={1} // Set a distinct value for "As soon as possible"
                                                      id="age1"
                                                      checked={
                                                        deliveryOrderScheduling ===
                                                        1
                                                      } // Check if the state matches
                                                      onChange={() => {
                                                        setSelectedAddressId(
                                                          data?._id
                                                        );
                                                        localStorage.setItem(
                                                          "addressId",
                                                          data?._id
                                                        );
                                                        localStorage.removeItem(
                                                          "time"
                                                        );
                                                        setDeliveryOrderScheduling(
                                                          1
                                                        );
                                                      }}
                                                    />
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="age1"
                                                    >
                                                      As soon as possible
                                                    </label>
                                                  </div>
                                                  <div className="form-check">
                                                    <input
                                                      className="form-check-input"
                                                      type="radio"
                                                      name="propertytype"
                                                      value={2}
                                                      id="age2"
                                                      checked={
                                                        deliveryOrderScheduling ===
                                                        2
                                                      } // Check if the state matches
                                                      onClick={() => {
                                                        setSelectedAddressId(
                                                          data?._id
                                                        );
                                                        localStorage.setItem(
                                                          "addressId",
                                                          data?._id
                                                        );
                                                        setDeliveryOrderScheduling(
                                                          2
                                                        );
                                                        handleShow();
                                                      }}
                                                    />
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor="age2"
                                                    >
                                                      Schedule Order
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                            </label>
                                          );
                                        })
                                    ) : (
                                      <div
                                        className="address-box add-new d-flex flex-column gap-2 align-items-center justify-content-center"
                                        onClick={() => {
                                          handleShow1();
                                        }}
                                      >
                                        <span className="plus-icon">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-plus"
                                          >
                                            <line
                                              x1="12"
                                              y1="5"
                                              x2="12"
                                              y2="19"
                                            ></line>
                                            <line
                                              x1="5"
                                              y1="12"
                                              x2="19"
                                              y2="12"
                                            ></line>
                                          </svg>
                                        </span>
                                        <h4 className="theme-color font-xl fw-500">
                                          Add New Address
                                        </h4>
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-5">
                                    <div className="table-heading">
                                      <h3 className="fw-bold mb-4">
                                        Shopping Cart
                                      </h3>
                                    </div>
                                    <div className="table-responsive theme-scrollbar">
                                      <Table className="border-0">
                                        <thead>
                                          <tr>
                                            <th>Name </th>
                                            <th>Price </th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {cartListing?.cartList?.map(
                                            (data) => {
                                              return (
                                                <tr>
                                                  <td>
                                                    <div className="cart-box d-flex align-items-center gap-3 flex-wrap">
                                                      <Link
                                                        href={`/product-detail/${data?.productDetails?._id}`}
                                                      >
                                                        {data?.productDetails
                                                          ?.productImg
                                                          ?.length !== 0
                                                          ? data?.productDetails?.productImg
                                                            ?.slice(0, 1)
                                                            ?.map((data) => {
                                                              return (
                                                                <Image
                                                                  src={
                                                                    data?.url
                                                                  }
                                                                  alt="image-product"
                                                                  width={100}
                                                                  height={100}
                                                                />
                                                              );
                                                            })
                                                          : ""}

                                                        <div>
                                                          <a href="#">
                                                            <h5 className="text-black fw-bold">
                                                              {
                                                                data
                                                                  ?.productDetails
                                                                  ?.productName
                                                              }
                                                            </h5>
                                                          </a>
                                                          {data?.size ? (
                                                            <p>
                                                              Size:{" "}
                                                              <span>
                                                                {data?.size}
                                                              </span>
                                                            </p>
                                                          ) : (
                                                            ""
                                                          )}
                                                          {data?.color ? (
                                                            <span
                                                              style={{
                                                                width: "20px",
                                                                height: "20px",
                                                                borderRadius:
                                                                  "50%",
                                                                backgroundColor:
                                                                  data?.color,
                                                                display:
                                                                  "inline-block",
                                                              }}
                                                            ></span>
                                                          ) : (
                                                            ""
                                                          )}
                                                        </div>
                                                      </Link>
                                                    </div>
                                                  </td>
                                                  <td className="notranslate">
                                                    {formatCurrency(
                                                      data?.productPrice, selectedCountry
                                                    )}
                                                  </td>
                                                  <td>
                                                    <div className="quantity d-flex align-items-center gap-3">
                                                      <button
                                                        className="minus"
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          updateCartHandler(
                                                            "decrement",
                                                            data,
                                                            data?.quantity - 1
                                                          );
                                                        }}
                                                        disabled={
                                                          data?.quantity == 1
                                                        }
                                                      >
                                                        <FaMinus />
                                                      </button>
                                                      <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={data?.quantity}
                                                        readOnly
                                                        onChange={(e) => {
                                                          updateCartHandler(
                                                            data?.quantity >
                                                              +e.target.value
                                                              ? "increment"
                                                              : "decrement",
                                                            data,
                                                            +e.target.value
                                                          );
                                                        }}
                                                        disabled={
                                                          data?.quantity <= 10
                                                        }
                                                      />
                                                      <button
                                                        className="plus"
                                                        type="button"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          updateCartHandler(
                                                            "increment",
                                                            data,
                                                            data?.quantity + 1
                                                          );
                                                        }}
                                                      >
                                                        <TiPlus />
                                                      </button>
                                                    </div>
                                                  </td>
                                                  <td className="notranslate">

                                                    {formatCurrency(
                                                      data?.productPrice *
                                                      data?.quantity.toFixed(
                                                        2
                                                      ), selectedCountry
                                                    )}
                                                  </td>
                                                  <td>
                                                    <Link
                                                      className="deleteButton"
                                                      href="#"
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        removeItemFromCart(
                                                          data
                                                        );
                                                      }}
                                                    >
                                                      <svg
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                      >
                                                        <path
                                                          d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                                                          stroke="#DA2A2C"
                                                          stroke-width="1.5"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        ></path>
                                                        <path
                                                          d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                                                          stroke="#DA2A2C"
                                                          stroke-width="1.5"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        ></path>
                                                        <path
                                                          d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
                                                          stroke="#DA2A2C"
                                                          stroke-width="1.5"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        ></path>
                                                        <path
                                                          d="M10.33 16.5H13.66"
                                                          stroke="#DA2A2C"
                                                          stroke-width="1.5"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        ></path>
                                                        <path
                                                          d="M9.5 12.5H14.5"
                                                          stroke="#DA2A2C"
                                                          stroke-width="1.5"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                        ></path>
                                                      </svg>
                                                    </Link>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                        {Math.ceil(meta?.totalCount / 10) >
                                          1 && (
                                            <Pagination
                                              totalCount={meta?.totalCount}
                                              handelPageChange={(e) =>
                                                setPage(e.selected + 1)
                                              }
                                            />
                                          )}
                                      </Table>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </Tab>
                          ) : (
                            ""
                          )}

                          {/* ) : ( */}

                          {cartListing?.cartList[0]?.productDetails
                            ?.companyDetails?.pickupService == true && (
                              <Tab eventKey="2" title="Pickup">
                                <Row>
                                  <Col lg={12}>
                                    <div className="plans delivery-address">
                                      {branchList?.length !== 0 ? (
                                        branchList?.map((data) => {
                                          return (
                                            <label
                                              className="plan basic-plan mb-3"
                                              htmlFor={`basic1-${data?._id}`}
                                              key={data?._id}
                                            >
                                              <input
                                                type="radio"
                                                name="pickup"
                                                id={`basic1-${data?._id}`}
                                                value={data?._id}
                                                onChange={(e) => {
                                                  setBranchSelectId(
                                                    e.target.value
                                                  );
                                                  setCouponBranchSelectId(null);
                                                  setSelectedAddressId(null);
                                                  localStorage.removeItem(
                                                    "addressId"
                                                  );
                                                  localStorage.setItem(
                                                    "branchId",
                                                    data?._id
                                                  );

                                                  // localStorage.removeItem(
                                                  //   "couponBranchId"
                                                  // );
                                                }}
                                                checked={
                                                  branchSelectId === data?._id
                                                }
                                              />

                                              <div className="plan-content">
                                                <div className="d-flex align-items-start gap-3">
                                                  <div className="delivery-icon">
                                                    <IoHome />
                                                  </div>
                                                  <div className="delivery-txt">
                                                    <h6 className="fw-bold mb-0 text-capitalize">
                                                      Branch location{" "}
                                                    </h6>

                                                    <p>
                                                      <a
                                                        href={`https://www.google.com/maps/@${data?.location.coordinates[1]},${data?.location.coordinates[0]},15z`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        {data?.area}
                                                      </a>
                                                    </p>
                                                  </div>
                                                </div>

                                                <div
                                                  className="delivery-schedule"
                                                  key={data?._id}
                                                >
                                                  {data?.workingHours?.map(
                                                    (branch) => {
                                                      return (
                                                        <div className="clock-icon d-flex align-items-center justify-content-between mt-1">
                                                          <div>
                                                            <CiClock1 className="me-2" />
                                                            {branch?.day}
                                                            &nbsp;
                                                            {branch?.startTime +
                                                              "-" +
                                                              branch?.endTime}
                                                          </div>
                                                          {/* <Link
                                                            href="#"
                                                            className="btn btn-theme"
                                                            onClick={() => {
                                                              handleShow();
                                                              setDay(branch?.day);
                                                              setBranchSelectId(
                                                                data?._id
                                                              );
                                                              setBranchId(
                                                                data?._id
                                                              );
                                                            }}
                                                          >
                                                            Schedule Order
                                                          </Link> */}
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                            </label>
                                          );
                                        })
                                      ) : (
                                        <h5 className="text-center">
                                          No branch found
                                        </h5>
                                      )}
                                    </div>
                                    <div className="mt-5">
                                      <div className="table-heading">
                                        <h3 className="fw-bold mb-4">
                                          Shopping Cart
                                        </h3>
                                      </div>
                                      <div className="table-responsive theme-scrollbar">
                                        <Table className="border-0">
                                          <thead>
                                            <tr>
                                              <th>Name </th>
                                              <th>Price </th>
                                              <th>Quantity</th>
                                              <th>Total</th>

                                              <th></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {cartListing?.cartList?.map(
                                              (data) => {
                                                return (
                                                  <tr>
                                                    <td>
                                                      <div className="cart-box d-flex align-items-center gap-3 flex-wrap">
                                                        <Link
                                                          href={`/product-detail/${data?.productDetails?._id}`}
                                                        >
                                                          {data?.productDetails
                                                            ?.productImg
                                                            ?.length !== 0
                                                            ? data?.productDetails?.productImg
                                                              ?.slice(0, 1)
                                                              ?.map((data) => {
                                                                return (
                                                                  <Image
                                                                    src={
                                                                      data?.url
                                                                    }
                                                                    alt="image-product"
                                                                    width={100}
                                                                    height={100}
                                                                  />
                                                                );
                                                              })
                                                            : ""}

                                                          <div>
                                                            <a href="#">
                                                              <h5 className="text-black fw-bold">
                                                                {
                                                                  data
                                                                    ?.productDetails
                                                                    ?.productName
                                                                }
                                                              </h5>
                                                            </a>
                                                            {data?.size ? (
                                                              <p>
                                                                Size:{" "}
                                                                <span>
                                                                  {data?.size}
                                                                </span>
                                                              </p>
                                                            ) : (
                                                              ""
                                                            )}
                                                            {data?.color ? (
                                                              <span
                                                                style={{
                                                                  width: "20px",
                                                                  height: "20px",
                                                                  borderRadius:
                                                                    "50%",
                                                                  backgroundColor:
                                                                    data?.color,
                                                                  display:
                                                                    "inline-block",
                                                                }}
                                                              ></span>
                                                            ) : (
                                                              ""
                                                            )}
                                                          </div>
                                                        </Link>
                                                      </div>
                                                    </td>
                                                    <td className="notranslate">
                                                      {formatCurrency(
                                                        data?.productPrice,selectedCountry
                                                      )}
                                                    </td>
                                                    <td>
                                                      <div className="quantity d-flex align-items-center gap-3">
                                                        <button
                                                          className="minus"
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            updateCartHandler(
                                                              "decrement",
                                                              data,
                                                              data?.quantity - 1
                                                            );
                                                          }}
                                                          disabled={
                                                            data?.quantity == 1
                                                          }
                                                        >
                                                          <FaMinus />
                                                        </button>
                                                        <input
                                                          type="number"
                                                          min="1"
                                                          max="20"
                                                          value={data?.quantity}
                                                          onChange={(e) => {
                                                            updateCartHandler(
                                                              data?.quantity >
                                                                +e.target.value
                                                                ? "increment"
                                                                : "decrement",
                                                              data,
                                                              +e.target.value
                                                            );
                                                          }}
                                                          disabled={
                                                            data?.quantity <= 10
                                                          }
                                                        />
                                                        <button
                                                          className="plus"
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            updateCartHandler(
                                                              "increment",
                                                              data,
                                                              data?.quantity + 1
                                                            );
                                                          }}
                                                        >
                                                          <TiPlus />
                                                        </button>
                                                      </div>
                                                    </td>
                                                    <td className="notranslate">
                                                      {/* KD */}
                                                      {/* {(data?.purchase_Price *
                                                      data?.quantity?.toFixed(2))} */}
                                                      {formatCurrency(
                                                        data?.productPrice *
                                                        data?.quantity.toFixed(
                                                          2
                                                        ),selectedCountry
                                                      )}
                                                    </td>
                                                    <td>
                                                      <Link
                                                        className="deleteButton"
                                                        href="#"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          removeItemFromCart(
                                                            data
                                                          );
                                                        }}
                                                      >
                                                        <svg
                                                          width="24"
                                                          height="24"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M10.33 16.5H13.66"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M9.5 12.5H14.5"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                        </svg>
                                                      </Link>
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                          {Math.ceil(meta?.totalCount / 10) >
                                            1 && (
                                              <Pagination
                                                totalCount={meta?.totalCount}
                                                handelPageChange={(e) =>
                                                  setPage(e.selected + 1)
                                                }
                                              />
                                            )}
                                        </Table>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Tab>
                            )}

                          {cartListing?.cartList[0]?.productDetails
                            ?.companyDetails?.couponService == true && (
                              <Tab eventKey="3" title="Coupon">
                                <Row>
                                  <Col lg={12}>
                                    <div className="mt-5">
                                      <div className="table-heading">
                                        <h3 className="fw-bold mb-4">
                                          Shopping Cart
                                        </h3>
                                      </div>
                                      <div className="table-responsive theme-scrollbar">
                                        <Table className="border-0">
                                          <thead>
                                            <tr>
                                              <th>Name </th>
                                              <th>Price </th>
                                              <th>Quantity</th>
                                              <th>Total</th>
                                              <th></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {cartListing?.cartList?.map(
                                              (data) => {
                                                return (
                                                  <tr>
                                                    <td>
                                                      <div className="cart-box d-flex align-items-center gap-3 flex-wrap">
                                                        <Link
                                                          href={`/product-detail/${data?.productDetails?._id}`}
                                                        >
                                                          {data?.productDetails
                                                            ?.productImg
                                                            ?.length !== 0
                                                            ? data?.productDetails?.productImg
                                                              ?.slice(0, 1)
                                                              ?.map((data) => {
                                                                return (
                                                                  <Image
                                                                    src={
                                                                      data?.url
                                                                    }
                                                                    alt="image-product"
                                                                    width={100}
                                                                    height={100}
                                                                  />
                                                                );
                                                              })
                                                            : ""}

                                                          <div>
                                                            <a href="#">
                                                              <h5 className="text-black fw-bold">
                                                                {
                                                                  data
                                                                    ?.productDetails
                                                                    ?.productName
                                                                }
                                                              </h5>
                                                            </a>
                                                            {data?.size ? (
                                                              <p>
                                                                Size:{" "}
                                                                <span>
                                                                  {data?.size}
                                                                </span>
                                                              </p>
                                                            ) : (
                                                              ""
                                                            )}
                                                            {data?.color ? (
                                                              <span
                                                                style={{
                                                                  width: "20px",
                                                                  height: "20px",
                                                                  borderRadius:
                                                                    "50%",
                                                                  backgroundColor:
                                                                    data?.color,
                                                                  display:
                                                                    "inline-block",
                                                                }}
                                                              ></span>
                                                            ) : (
                                                              ""
                                                            )}
                                                          </div>
                                                        </Link>
                                                      </div>
                                                    </td>
                                                    <td className="notranslate">
                                                      {formatCurrency(
                                                        data?.productPrice,selectedCountry
                                                      )}
                                                    </td>
                                                    <td>
                                                      <div className="quantity d-flex align-items-center gap-3">
                                                        <button
                                                          className="minus"
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            updateCartHandler(
                                                              "decrement",
                                                              data,
                                                              data?.quantity - 1
                                                            );
                                                          }}
                                                          disabled={
                                                            data?.quantity == 1
                                                          }
                                                        >
                                                          <FaMinus />
                                                        </button>
                                                        <input
                                                          type="number"
                                                          min="1"
                                                          max="20"
                                                          value={data?.quantity}
                                                          onChange={(e) => {
                                                            updateCartHandler(
                                                              data?.quantity >
                                                                +e.target.value
                                                                ? "increment"
                                                                : "decrement",
                                                              data,
                                                              +e.target.value
                                                            );
                                                          }}
                                                          disabled={
                                                            data?.quantity <= 10
                                                          }
                                                        />
                                                        <button
                                                          className="plus"
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            updateCartHandler(
                                                              "increment",
                                                              data,
                                                              data?.quantity + 1
                                                            );
                                                          }}
                                                        >
                                                          <TiPlus />
                                                        </button>
                                                      </div>
                                                    </td>
                                                    <td className="notranslate">
                                                     
                                                      {formatCurrency(
                                                        data?.productPrice *
                                                        data?.quantity.toFixed(
                                                          2
                                                        ),selectedCountry
                                                      )}
                                                    </td>
                                                    <td>
                                                      <Link
                                                        className="deleteButton"
                                                        href="#"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          removeItemFromCart(
                                                            data
                                                          );
                                                        }}
                                                      >
                                                        <svg
                                                          width="24"
                                                          height="24"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M10.33 16.5H13.66"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                          <path
                                                            d="M9.5 12.5H14.5"
                                                            stroke="#DA2A2C"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                          ></path>
                                                        </svg>
                                                      </Link>
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                          {Math.ceil(meta?.totalCount / 10) >
                                            1 && (
                                              <Pagination
                                                totalCount={meta?.totalCount}
                                                handelPageChange={(e) =>
                                                  setPage(e.selected + 1)
                                                }
                                              />
                                            )}
                                        </Table>
                                      </div>
                                    </div>
                                  </Col>
                                </Row>
                              </Tab>
                            )}
                        </Tabs>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col lg={4}>
              <CartPriceDetails
                selectedAddressId={selectedAddressId}
                branchList={branchList}
                ref={childRef}
              />
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />

      {/* modal */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="delivery-main">
            <Tabs
              id="controlled-tab-example"
              activeKey={key1}
              onSelect={(k) => setKey1(k)}
              className="mb-3 gap-3"
            >
              {/* <Tab eventKey="home1" title="45 min"></Tab> */}
              <Tab eventKey="profile1" title="Schedule Order">
                <div className="select-date mt-4">
                  {/* <label className="text-capitalize">Select date</label> */}
                  <DatePicker
                    autoComplete="off"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Select Date"
                    filterTime={filterPassedTime}
                    minDate={moment().toDate()}
                  />
                </div>

                <div className="mt-4 select-time">
                  <Form className="boxed">
                    {timeSlots?.length !== 0
                      ? timeSlots?.map((data) => {
                        const [startHour, startMinute] = data.startTime
                          .split(":")
                          .map(Number);
                        const [endHour, endMinute] = data.endTime
                          .split(":")
                          .map(Number);
                        const startTimeInMinutes =
                          startHour * 60 + startMinute;
                        const endTimeInMinutes = endHour * 60 + endMinute;

                        return (
                          <div key={`${data.startTime}-${data.endTime}`}>
                            <input
                              type="radio"
                              id={`${data?.startTime} - ${data?.endTime}`}
                              name="timeSlot"
                              value={`${data?.startTime} - ${data?.endTime}`}
                              checked={
                                selectedTimeSlot ==
                                `${data?.startTime} - ${data?.endTime}`
                              }
                              onChange={(e) => {
                                setSelectedTimeSlot(e.target.value);
                              }}
                              disabled={
                                endTimeInMinutes < currentTimeInMinutes
                              } // Disable if the time has passed
                            />
                            <label
                              htmlFor={`${data?.startTime} - ${data?.endTime}`}
                            >
                              {data?.startTime} - {data?.endTime}
                            </label>
                          </div>
                        );
                      })
                      : ""}
                  </Form>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Link
            href="#"
            className="btn btn-theme border-0 text-capitalize"
            onClick={handleSubmitFunc}
          >
            Continue
          </Link>
        </Modal.Footer>
      </Modal>
      <AddressModal
        show1={show1}
        handleClose1={handleClose1}
        page={page}
        id={selectedAddressId}
        handleShow1={handleShow1}
        getData={getData}
      />
    </>
  );
};
export default Checkout;
