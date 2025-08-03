/**
 * @copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta < shiv@ozvid.com >
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Toxsl Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import moment from "moment";
import { Spinner } from "react-bootstrap";
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { BiMoney } from 'react-icons/bi';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaUserAlt, FaUserFriends } from 'react-icons/fa';
import { FaAppStore, FaBell, FaBuilding, FaCodeBranch, FaPencil, FaQuestion } from "react-icons/fa6";
import { FiSettings } from 'react-icons/fi';
import { GiSwipeCard } from 'react-icons/gi';
import { IoMdCash } from 'react-icons/io';
import { LiaStickyNoteSolid } from 'react-icons/lia';
import { MdAttachEmail, MdContacts, MdSwapHoriz } from 'react-icons/md';
import { PiSpinnerBallDuotone } from 'react-icons/pi';
import { SiOctobercms } from 'react-icons/si';
import { TbReportSearch } from 'react-icons/tb';
import { defaultCountries, parseCountry } from "react-international-phone";
import { v4 as uuidv4 } from "uuid";
import { constant, Paginations } from "./constants";
import { toastAlert } from "./SweetAlert";

export const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

export const restrictAlpha = (e) => {
  const re = /[0-9A-F:]+/g;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};

export const restrictAlpha1 = (e) => {
  const re = /^[0-9]*\.?[0-9]*$/;
  const currentValue = e.target.value;
  const newValue = currentValue + e.key;
  if (!re.test(newValue)) {
    e.preventDefault();
  }
};

export const restrictAlphaWithDecimal = (e) => {
  const re = /[0-9A-F:.]+/g;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};

export function isAlphanumericWithoutDecimal(inputString) {
  // Regular expression to check for alphanumeric characters only
  const alphanumericPattern = /^[a-zA-Z0-9]+$/;

  // Test the input string against the pattern
  return alphanumericPattern.test(inputString);
}

//onKeyPress={(e) => restrictAlpha(e)}
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Download file
 * @param {*} data
 */

export const downloadFile = (fileAbsoluteUrl) => {
  window.location.assign(fileAbsoluteUrl);
};

/**
 *
 * @param {*} content
 * @param {*} appendString
 * @returns
 */

export const paramTitleContent = (
  content = "",
  appendFront = "",
  appendBack = ""
) => {
  if (content) {
    let content = content?.trim();

    if (content === "null" || content == "") {
      return "";
    }

    return appendFront + content + appendBack;
  }
  return "";
};

// Order Delivery Status
export const getOrderDeliveryStatus = (status) => {
  switch (status) {
    case constant?.ORDER_PENDING_STATUS:
      return "Pending";
    case constant?.ORDER_READY_STATUS:
      return "Ready";
    case constant?.ORDER_CANCELED_STATUS:
      return "Cancelled";
    case constant?.ORDER_SHIPPE_STATUS:
      return "Shipped";

    case constant?.ORDER_COMPLETED_STATUS:
      return "Delivered";
    case constant?.ORDER_APPROVE:
      return "Approve";
    case constant?.ORDER_REJECT:
      return "Reject";
    default:
      return "Pending";
  }
};
// Order  Status
export const getOrderStatus = (status) => {
  switch (status) {
    case constant?.DELIVERY_PENDING:
      return "Pending";
    case constant?.DELIVERY_ACCEPTED:
      return "Accepted";
    case constant?.DELIVERY_CANCELLED:
      return "Cancelled";

    case constant?.DELIVERY_DELIVERED:
      return "Delivered";
    default:
      return "Pending";
  }
};
/**
 * Order Status Badge Color
 * @param {Number} state
 * @returns
 */
export const getOrderStatusColor = (state) => {
  switch (state) {
    case constant?.DELIVERY_PENDING:
      return "badge bg-primary";
    case constant?.DELIVERY_PENDING:
      return "badge bg-warning";
    case constant?.DELIVERY_CANCELLED:
      return "badge bg-danger";
    case constant?.DELIVERY_DELIVERED:
      return "badge bg-success";
    default:
      return;
  }
};

// order status

export const paymentStatus = (status) => {
  switch (status) {
    case constant?.PAYMENT_TYPE_COD:
      return "COD";
    case constant?.PAYMENT_TYPE_ONLINE:
      return "Online";
    case constant?.WALLET:
      return "Wallet";
    default:
      return "Na";
  }
};

export const paymentReturnStatus = (status) => {
  switch (status) {
    case 1:
      return "Wallet";
    case 2:
      return "Account";

    default:
      return "Na";
  }
};
//  Order  Status
export const stateId = (state, lang) => {
  switch (state) {
    case constant?.PENDING:
      return "Pending";
    case constant?.ACTIVE:
      return "Active";
    case constant?.INACTIVE:
      return "In-Active";
    case constant?.BLOCKED:
      return "Blocked";
    case constant?.DELETED:
      return "Deleted";
    default:
      return;
  }
};
export const stateIdColor = (state) => {
  switch (state) {
    case constant?.PENDING:
      return "badge bg-warning";
    case constant?.ACTIVE:
      return "badge bg-success";
    case constant?.REJECT:
      return "badge bg-danger";
    case constant?.INACTIVE:
      return "badge bg-danger";
    case constant?.DELETED:
      return "badge bg-danger";

    default:
      return;
  }
};
export const validEmailPattern = new RegExp(
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
);

export const urlRegex =
  /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*[-A-Za-z0-9+&@#/%=~_|]$/;

export const restrictNum1 = (e) => {
  const re = /[0-9:]+/g;
  if (re.test(e.key)) {
    e.preventDefault();
  }
};
export const stringRegx = /^[a-zA-Z ]+$/;

export const CheckAdminState = (state) => {
  switch (state) {
    case constant?.ACTIVE:
      return <span className="badge bg-success">Active</span>;
    case constant?.INACTIVE:
      return <span className="badge bg-warning">In-Active</span>;
    case constant?.DELETED:
      return <span className="badge bg-danger">Delete</span>;
    case constant?.ORDER_PENDING_STATUS:
      return <span className="badge bg-primary">Pending</span>;
    case constant?.PRODUCT_OUTOFSTOCK:
      return <span className="badge bg-primary">Out Of Stock</span>;
    case constant?.PRODUCT_STOCK:
      return <span className="badge bg-danger">Stock</span>;
    default:
      break;
  }
};

export const EMAIL_QUEUE_STATE = (state) => {
  switch (state) {
    case constant?.SUCCESS:
      return <span className="badge bg-success">Success</span>;
    case constant?.FAILED:
      return <span className="badge bg-danger">Failed</span>;

    default:
      break;
  }
};

export const serialNumber = (page, index) => {
  if (page) {
    return (page - 1) * Paginations?.PER_PAGE + index + 1;
  }
};
export const pageType = (value) => {
  if (value == constant?.TERMS_CONDITIONS) {
    return "Terms & Conditions";
  } else if (value == constant?.PRIVACY_POLICY) {
    return "Privacy Policy";
  } else if (value == constant?.ABOUT_US) {
    return "About us";
  } else if (value == constant?.REPORT) {
    return "Report";
  } else if (value == constant?.REFUND_POLICY) {
    return "Refund Policy";
  } else {
    return "No Data Found";
  }
};

export const IMAGE_LOADER = () => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};

export const AddressType = (state) => {
  switch (state) {
    case 1:
      return "Home";
    case 2:
      return "Office";
    case 3:
      return "Others";

    default:
      break;
  }
};

export const GenderType = (state) => {
  switch (state) {
    case constant?.MALE:
      return "Male";
    case constant?.FEMALE:
      return "Female";
    case constant?.GENDER_OTHERS:
      return "Others";
    default:
      break;
  }
};

// PENDING: 5,
// REJECT: 6,
// OUT_STOCK: 7,
// SHIPPED: 8,
// COMPLETED: 9,
// CANCELED: 10,
// READY: 11,

export const DeliveryStatusType = (state) => {
  switch (state) {
    case 5:
      return <span className="badge bg-primary text-white">Pending</span>;
    case 6:
      return <span className="badge bg-warning text-white">Reject</span>;
    case 7:
      return <span className="badge bg-danger text-white">Out of stock</span>;
    case 8:
      return <span className="badge bg-warning text-white">Shipped</span>;
    case 9:
      return <span className="badge bg-success text-white">Completed</span>;
    case 10:
      return <span className="badge bg-danger text-white">Cancelled</span>;
    case 11:
      return <span className="badge bg-secondary text-white">Ready</span>;
    default:
      break;
  }
};

export const CheckAdminDeliveryStatus = (state) => {
  switch (state) {
    case 5:
      return <span className="badge bg-primary text-white">Pending</span>;
    case 6:
      return <span className="badge bg-warning text-white">Reject</span>;
    case 7:
      return <span className="badge bg-danger text-white">Out of stock</span>;
    case 8:
      return <span className="badge bg-success text-white">Shipped</span>;
    case 9:
      return <span className="badge bg-success text-white">Completed</span>;
    case 10:
      return <span className="badge bg-danger text-white">Cancelled</span>;
    case 11:
      return <span className="badge bg-secondary text-white">Ready</span>;
    default:
      break;
  }
};

export const countries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return ["kw", "ae", "jo"].includes(iso2);
});

export const filterPassedTime = (time) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);

  return currentDate.getTime() < selectedDate.getTime();
};

// DELIVERY: 1,
// PICKUP: 2,
// COUPON: 3,
export const orderTypeStatus = (state) => {
  switch (state) {
    case 1:
      return "Delivery";
    case 2:
      return "Pickup";
    case 3:
      return "Coupon";

    default:
      break;
  }
};

export const PromoCodeStatus = (state) => {
  switch (state) {
    case 1:
      return "All";
    case 2:
      return "Category";
    case 3:
      return "Company";

    default:
      break;
  }
};

export function getStartAndEndDate() {
  if (typeof window === "undefined") {
    return { startIsoDate: null, endIsoDate: null }; // Return null on server-side
  }
  
  let date = localStorage.getItem("date");
  let timeSlot = localStorage.getItem("time");

  if (!date || !timeSlot) {
    return { startIsoDate: null, endIsoDate: null };
  }

  const [startTime, endTime] = timeSlot?.split(" - ");
  const startDateObject = new Date(date);
  const [startHours, startMinutes] = startTime?.split(":");
  startDateObject.setHours(parseInt(startHours));
  startDateObject.setMinutes(parseInt(startMinutes));
  const startIsoDate = startDateObject?.toISOString();

  const endDateObject = new Date(date);
  const [endHours, endMinutes] = endTime?.split(":");
  endDateObject.setHours(parseInt(endHours));
  endDateObject.setMinutes(parseInt(endMinutes));
  const endIsoDate = endDateObject?.toISOString();

  return { startIsoDate, endIsoDate };
}

export const transactionStatus = (state) => {
  switch (state) {
    case "pending":
      return <span className="badge bg-primary">Pending</span>;
    case "success":
      return <span className="badge bg-success">Success</span>;
    default:
      break;
  }
};

export function formatCurrency(amount, country) {
  // Ensure amount is a number and round to 2 decimal places
  const formattedAmount = amount ? Number(amount).toFixed(2) : "";

  const currencyMapping = {
    Kuwait: "KD",
    Jordan: "JOD",
    UAE: "AED",
    // Add more countries and their currencies as needed
  };
  const currencyCode = currencyMapping[country] || "KD";

  // Return formatted string
  return amount ? `${currencyCode}  ${formattedAmount}` : `${currencyCode}`;
}

export const SpinType = (state) => {
  switch (state) {
    case 1:
      return "Percentage";
    case 2:
      return "Fix";
    case 3:
      return "Free Delivery";
    case 4:
      return "Hard luck";
    case 5:
      return "Referral";
    default:
      break;
  }
};

// HEIGH : 1,
//   MEDIUM : 2,
//   LOW    : 3,
export const priorityType = (state) => {
  switch (state) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    case 3:
      return "Low";
    default:
      break;
  }
};

export const CheckAdminEnable = (state) => {
  switch (state) {
    case constant?.ENABLE:
      return <span className="badge bg-success">Enable</span>;
    case constant?.DISABLE:
      return <span className="badge bg-warning">Disable</span>;
    default:
      break;
  }
};

export const accountTypeFunc = (state, lang) => {
  switch (state) {
    case constant?.PERCENTAGE:
      return "Percentage";
    case constant?.FIX_AMOUNT:
      return "Fix amount";
    default:
      return;
  }
};

export const cashbackTypeFunc = (state, lang) => {
  switch (state) {
    case 1:
      return "Promotion";
    case 2:
      return "Cashback";
    default:
      return;
  }
};

export const typeFor = (state) => {
  switch (state) {
    case 1:
      return "Invoice";
    case 2:
      return "Commission";
    default:
      return;
  }
};

export const commissionTypeFunc = (state) => {
  switch (state) {
    case 1:
      return "Percentage";
    case 2:
      return "Fix amount";
    default:
      return;
  }
};

export const paymentTypeFunc = (state, lang) => {
  switch (state) {
    case constant?.CHEQUE:
      return "Cheque";
    case constant?.BANK_TRANSFER:
      return "Bank Transfer";
    case constant?.LINK:
      return "Link";
    case constant?.ONLINE_TRANSFER:
      return "Online";
    case constant?.ADVANCE:
      return "On Advance";
    case constant?.PAYPAL:
      return "Paypal";
    default:
      return;
  }
};

export const cashbackrotationalFunc = (state, lang) => {
  switch (state) {
    case 1:
      return "One Time";
    case 2:
      return "Several Times";
    default:
      return;
  }
};

export const Supplier = (state, lang) => {
  switch (state) {
    case 1:
      return "Offrat";
    case 2:
      return "Supplier";
    case 3:
      return "Share";
    default:
      return;
  }
};

export const checkLanguage = (english, arabic) => {
  if (typeof window === "undefined") {
    return english; // Default to English on server-side
  }
  
  const language = localStorage.getItem("language");
  if (language == "English") {
    return english;
  } else if (language == "Arabic") {
    return arabic;
  } else {
    return english;
  }
};
export function generatePromocode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let promocode = "";

  for (let i = 0; i < length; i++) {
    promocode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return promocode;
}
export const handleCopyToClipboard = (text) => {
  navigator?.clipboard?.writeText(text).then(
    () => {
      toastAlert("success", "Copied to clipboard");
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
};

// API: 1,
// APP: 2,
// WEB:3
export const ERROR_TYPE_STATUS = (status) => {
  switch (status) {
    case 1:
      return "API";
    case 2:
      return "App";
    case 3:
      return "Web";
    default:
      return "Na";
  }
};

export const FORMAT_NUMBER = (value, discount) => {
  if (discount) {
    if (value === null || isNaN(value)) {
      return "0.00"; // Return "0.00" as a string
    }

    // Attempt to convert the value to a number
    const numberValue = parseFloat(value);

    // Check if the conversion resulted in a valid number
    if (isNaN(numberValue)) {
      return "0.00"; // Return "0.00" if conversion fails
    }

    // Use toFixed(2) to format the number to two decimal places
    return numberValue.toFixed(2);
  } else {
    if (value === null || isNaN(value)) {
      return "0.00"; // Return "0.00" as a string
    }

    // Attempt to convert the value to a number
    const numberValue = parseFloat(value);

    // Check if the conversion resulted in a valid number
    if (isNaN(numberValue)) {
      return "0.00"; // Return "0.00" if conversion fails
    }

    // Use toFixed(2) to format the number to two decimal places
    return numberValue.toFixed(2);
  }

  // Check if the value is null or NaN
};

export const getDeviceToken = () => {
  // Check if localStorage is available (client-side)
  if (typeof window === "undefined") {
    return null; // Return null on server-side
  }
  
  // Check if the device token already exists in local storage
  let deviceToken = localStorage.getItem("deviceToken");

  // If it doesn't exist, create a new one and store it
  if (!deviceToken) {
    deviceToken = uuidv4();
    localStorage.setItem("deviceToken", deviceToken);
  }

  return deviceToken;
};

export function shouldShowRefundButton(orderCompletionDate) {
  // Parse the order completion date using Moment.js
  const completionDate = moment(orderCompletionDate);
  const currentDate = moment(); // Get the current date

  // Calculate the difference in days
  const daysSinceCompletion = currentDate.diff(completionDate, "days");

  // Return true if the difference is less than or equal to 14 days
  return daysSinceCompletion <= 14;
}
export const getLinkHref = (roleId, route) => {
  let userSegment;

  switch (roleId) {
    case 4:
      userSegment = "promotion-user";
      break;
    case 5:
      userSegment = "designed-user";
      break;
    default:
      userSegment = "admin"; // Default case
  }

  return `/${userSegment}${route}`;
};


export const getLinkHrefRoute = (roleId, route) => {
  let userSegment;

  switch (roleId) {
    case 4:
      userSegment = "promotion-user";
      break;
    case 5:
      userSegment = "designed-user";
      break;
    default:
      userSegment = "admin"; // Default case
  }

  return `/${userSegment}${route}`;
};


export const ROLE_STATUS = (roleId) => {
  let userSegment;
  switch (roleId) {
    case 4:
      userSegment = "promotion-users";
      break;
    case 5:
      userSegment = "designed-users";
      break;
    default:
      userSegment = "admin"; 
  }
  return userSegment;
};


export const getLinkHrefRouteSingleView = (roleId, route, userRole) => {

  let userSegment;

  switch (roleId) {
    case 4:
      userSegment = "promotion-user";
      break;
    case 5:
      userSegment = "designed-user";
      break;
    default:
      userSegment = "admin"; // Default case
  }
  console.log("---->",`/${userSegment}/page/${userRole}/${route}`)
  return `/${userSegment}/page/${userRole}/${route}`;
};

export const getPermissionsByLabel = (rolesPrivileges, label) => {
  try {
    // Parse the rolesPrivileges
    const parsedPrivileges = JSON.parse(rolesPrivileges?.at(0));
    // Filter for the specified label
    return parsedPrivileges?.filter((privilege) =>
      privilege?.label === label
    )
  } catch (error) {
    console.error("Error parsing rolesPrivileges:", error);
    return [];
  }
};


export function formatCamelCaseString(camelCaseString) {
  return camelCaseString
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before each uppercase letter
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Handle cases like "HTMLParser"
    .trim(); // Remove any leading or trailing spaces
}

export const iconMapping = {
  usersManagement: {
    salesPerson: <FaUserFriends />,
    userPerson: <FaUserAlt />
  },
  companyManagement: {
    deliveryCompany: <CiDeliveryTruck />,
    company: <FaBuilding />,
    accountInformation: <BiMoney />,
    branchManagement: <FaCodeBranch />,
  },
  reportsManagement: {
    orderReports: <TbReportSearch />,
    generalReports: <TbReportSearch />,
    inactiveReports: <TbReportSearch />,
    userReports: <TbReportSearch />,
    itemAvailable: <TbReportSearch />,
    supplierMonthlyReport: <TbReportSearch />,
    couponReports: <TbReportSearch />,
    refundReports: <TbReportSearch />,
    spinReports: <TbReportSearch />,
    // accountStatement: <TbReportSearch />

  },
  transactionManagement: {
    transactions: <MdSwapHoriz />,
    refund: <IoMdCash />,
  },
  fortuneSpin: {
    fortuneSpin: <PiSpinnerBallDuotone />,
    fortuneSettings: <FiSettings />,
  },
  settings: {
    bannerManagement: <GiSwipeCard />,
    dynamicLabel: <FaPencil />,
    contentManagement: <SiOctobercms />,
    testimonialManagement: <LiaStickyNoteSolid />,
    faqManagement: <FaQuestion />,
    manualNotification: <FaBell />,
    contactUs: <MdContacts />,
    dynamicQuestion: <FaQuestion />,
    smtp: <MdAttachEmail />,
    twillio: <AiOutlineWhatsApp />,
    appVersion: <FaAppStore />,
  }
};