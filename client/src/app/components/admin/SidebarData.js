import { BiCategory, BiMessage, BiMoney } from "react-icons/bi";
import { CiDeliveryTruck } from "react-icons/ci";
import * as FaIcons from "react-icons/fa";
import { FaAppStore, FaBuilding, FaBullhorn, FaPenClip } from "react-icons/fa6";
import { FiActivity, FiSettings } from "react-icons/fi";
import { GiSwipeCard } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { TbReportSearch, TbShoppingBagSearch } from "react-icons/tb";

import { AiOutlineWhatsApp } from "react-icons/ai";
import { IoMdCash } from "react-icons/io";
import { LiaStickyNoteSolid } from "react-icons/lia";
import {
  MdAttachEmail,
  MdContacts,
  MdError,
  MdOutlineCategory,
  MdProductionQuantityLimits,
  MdSwapHoriz,
} from "react-icons/md";
import { PiSpinnerBallDuotone, PiUserSoundDuotone } from "react-icons/pi";
import * as RiIcons from "react-icons/ri";
import { SiOctobercms } from "react-icons/si";
import { store } from "../../../../redux/store";
import { constant } from "../../../../utils/constants";
import { formatCamelCaseString, getLinkHrefRoute, iconMapping } from "../../../../utils/helper";
let pathName = "";

if (typeof window !== "undefined") {
  pathName = window?.location?.pathname;
}
let detail =
  store.getState()?.auth?.data;

// const language = pathName ;
export const SidebarData = [
  {
    title: "Dashboard",
    path: `/admin/page`,
    icon: <FaIcons.FaHome />,
    cName: pathName == "/admin/page" ? "nav-text nav-text-active" : "nav-text",
    path_active_name: "page",
  },
  {
    title: "Users Management",
    icon: <FaIcons.FaUsers />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/sales-person" ||
        pathName == "/admin/page/customer-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "customer-management",
    subNav: [
      {
        title: "Sales Person",
        path: `/admin/page/sales-person`,
        icon: <FaIcons.FaUserFriends />,
        cName: "nav-text",
        path_active_name: "customer-management",
      },
      {
        title: "Customers",
        path: `/admin/page/customer-management`,
        icon: <FaIcons.FaUserAlt />,
        cName: "nav-text",
        path_active_name: "customer-management",
      },
      {
        title: "Promotion Users",
        path: `/admin/page/promotion-users`,
        icon: <PiUserSoundDuotone />,
        cName: "nav-text",
        path_active_name: "promotion-users",
      },
      {
        title: "Designed Users",
        path: `/admin/page/designed-users`,
        icon: <RiIcons.RiUserStarLine />,
        cName: "nav-text",
        path_active_name: "designed-users",
      },
    ],
  },
  {
    title: "Category Management",
    icon: <RiIcons.RiListOrdered />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/category-management" ||
        pathName == "/admin/page/subcategory-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "category-management",
    subNav: [
      {
        title: "Categories",
        path: `/admin/page/category-management`,
        icon: <BiCategory />,
        cName: "nav-text",
        path_active_name: "category-management",
      },
      {
        title: "Sub Categories",
        path: `/admin/page/subcategory-management`,
        icon: <MdOutlineCategory />,
        cName: "nav-text",
        path_active_name: "category-management",
      },
      {
        title: "Classification",
        path: `/admin/page/classification-management`,
        icon: <BiCategory />,
        cName: "nav-text",
        path_active_name: "classification-management",
      },
    ],
  },

  {
    title: "Company Management",
    icon: <FaIcons.FaArchway />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/company-management" ||
        pathName == "/admin/page/branch-management" ||
        pathName == "/admin/page/delivery-company-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "company-management",
    subNav: [
      {
        title: "Delivery Company",
        path: `/admin/page/delivery-company-management`,
        icon: <CiDeliveryTruck />,
        cName: "nav-text",
        path_active_name: "company-management",
      },
      {
        title: "Company",
        path: `/admin/page/company-management`,
        icon: <FaBuilding />,
        cName: "nav-text",
        path_active_name: "company-management",
      },
      {
        title: "Branch",
        path: `/admin/page/branch-management`,
        icon: <FaIcons.FaCodeBranch />,
        cName: "nav-text",
        path_active_name: "company-management",
      },
      {
        title: "Account Information",
        path: `/admin/page/account-information`,
        icon: <BiMoney />,
        cName: "nav-text",
        path_active_name: "company-management",
      },
    ],
  },

  {
    title: "Product Management",
    icon: <FaIcons.FaProductHunt />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/product-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "product-management",
    subNav: [
      {
        title: "Products",
        path: `/admin/page/product-management`,
        icon: <MdProductionQuantityLimits />,
        cName: "nav-text",
        path_active_name: "product-management",
      },
    ],
  },

  {
    title: "Order Management",
    icon: <MdProductionQuantityLimits />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/order-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "order-management",
    subNav: [
      {
        title: "Orders",
        path: `/admin/page/order-management`,
        icon: <MdProductionQuantityLimits />,
        cName: "nav-text",
        path_active_name: "order-management",
      },
    ],
  },
  //  here

  {
    title: "Reports Management",
    icon: <TbShoppingBagSearch />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/reports" ||
        pathName == "/admin/page/general-reports" ||
        pathName == "/admin/page/in-active-reports" ||
        pathName == "/admin/page/user-reports" ||
        pathName == "/admin/page/Item-available" ||
        pathName == "/admin/page/supplier-monthly-report" ||
        pathName == "/admin/page/coupon-report"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "Reports",
    subNav: [
      {
        title: "Order Reports",
        path: `/admin/page/reports`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "General Reports",
        path: `/admin/page/general-reports`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "In-Active Reports",
        path: `/admin/page/in-active-reports`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "User Reports",
        path: `/admin/page/user-reports`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "Item Available",
        path: `/admin/page/Item-available`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "Supplier Monthly Report",
        path: `/admin/page/supplier-monthly-report`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "Coupon Report",
        path: `/admin/page/coupon-report`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "Refund Reports",
        path: `/admin/page/refund-report`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "Spin Report",
        path: `/admin/page/spin-report`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
      {
        title: "Account Statement",
        path: `/admin/page/account-statement`,
        icon: <TbReportSearch />,
        cName: "nav-text",
        path_active_name: "Reports",
      },
    ],
  },

  {
    title: "Transaction Management",
    icon: <FaIcons.FaExchangeAlt />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/transaction-management" ||
        pathName == "/admin/page/refund"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "transaction-management",
    subNav: [
      {
        title: "Transactions",
        path: `/admin/page/transaction-management`,
        icon: <MdSwapHoriz />, // You can change the icon if needed
        cName: "nav-text",
        path_active_name: "transaction-management",
      },
      {
        title: "Refund",
        path: `/admin/page/refund`,
        icon: <IoMdCash />, // You can change the icon if needed
        cName: "nav-text",
        path_active_name: "transaction-management",
      },
    ],
  },

  {
    title: "Promotion Management",
    icon: <FaBullhorn />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/promotion-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "promotion-management",
    subNav: [
      {
        title: "Promotion",
        path: `/admin/page/promotion-management`,
        icon: <FaBullhorn />,
        cName: "nav-text",
        path_active_name: "promotion-management",
      },

    ],
  },

  {
    title: "Offer Management",
    icon: <RiIcons.RiDiscountPercentLine />, // You can change the icon if needed
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/offer-management"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "offer-management",
    subNav: [
      {
        title: "Offers",
        path: `/admin/page/offer-management`,
        icon: <RiIcons.RiDiscountPercentLine />, // You can change the icon if needed
        cName: "nav-text",
        path_active_name: "offer-management",
      },
    ],
  },

  {
    title: "Fortune Spin",
    icon: <PiSpinnerBallDuotone />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/fortune-spin"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "fortune-spin",
    subNav: [
      {
        title: "Fortune Spin",
        path: `/admin/page/fortune-spin`,
        icon: <PiSpinnerBallDuotone />,
        cName: "nav-text",
        path_active_name: "Fortune Spin",
      },
      {
        title: "Fortune Settings",
        path: `/admin/page/fortune-settings`,
        icon: <FiSettings />,
        cName: "nav-text",
        path_active_name: "Fortune Settings",
      },
    ],
  },

  {
    title: "Logger",
    icon: <FaIcons.FaHistory />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/error-logs" ||
        pathName == "/admin/page/email-queue" ||
        pathName == "/admin/page/activity-logs"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "error-logs",
    subNav: [
      {
        title: "Error Logs",
        path: ` /admin/page/error-logs`,
        icon: <MdError />,
        cName: "nav-text",
        path_active_name: "error-logs",
      },
      {
        title: "SMS Logs",
        path: ` /admin/page/sms-logs`,
        icon: <BiMessage />,
        cName: "nav-text",
        path_active_name: "sms-logs",
      },
      {
        title: "Email Queue",
        path: ` /admin/page/email-queue`,
        icon: <FaIcons.FaMailBulk />,
        cName: "nav-text",
        path_active_name: "error-logs",
      },
      {
        title: "Login Activity",
        path: ` /admin/page/activity-logs`,
        icon: <FiActivity />,
        cName: "nav-text",
        path_active_name: "error-logs",
      },
    ],
  },

  {
    title: "Settings",
    icon: <IoSettingsSharp />,
    iconClosed: <FaIcons.FaCaretDown />,
    iconOpened: <FaIcons.FaCaretUp />,
    cName:
      pathName == "/admin/page/content-management" ||
        pathName == "/admin/page/testimonial-management" ||
        pathName == "/admin/page/faq-management" ||
        pathName == "/admin/page/manual-notifications" ||
        pathName == "/admin/page/contact-us" ||
        pathName == " /admin/page/contact-info" ||
        pathName == "/admin/page/dynamic-form"
        ? "nav-text nav-text-active"
        : "nav-text",
    path_active_name: "Settings",
    subNav: [
      {
        title: "Banner Management",
        path: `/admin/page/banner-management`,
        icon: <GiSwipeCard />,

        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Dynamic Label",
        path: `/admin/page/dynamic-label`,
        icon: <FaPenClip />,

        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Content Management",
        path: `/admin/page/content-management`,
        icon: <SiOctobercms />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Testimonial Management",
        path: `/admin/page/testimonial-management`,
        icon: <LiaStickyNoteSolid />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Faq Management",
        path: ` /admin/page/faq-management`,
        icon: <FaIcons.FaQuestion />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Manual Notification",
        path: ` /admin/page/manual-notifications`,
        icon: <FaIcons.FaBell />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Contact Us",
        path: ` /admin/page/contact-us`,
        icon: <MdContacts />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Contact Info",
        path: ` /admin/page/contact-info`,
        icon: <MdContacts />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Dynamic Question",
        path: ` /admin/page/dynamic-form`,
        icon: <FaIcons.FaQuestion />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Smtp Credentials",
        path: ` /admin/page/smtp`,
        icon: <MdAttachEmail />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "Twillio Credentials",
        path: `/admin/page/twillio`,
        icon: <AiOutlineWhatsApp />,
        cName: "nav-text",
        path_active_name: "Settings",
      },
      {
        title: "App Version",
        path: `/admin/page/app-version`,
        icon: <FaAppStore />,
        cName: "nav-text",
        path_active_name: "App Version",
      },
    ],
  },
];


/******************SUB ADMIN (DESIGNED AND PROMOTION USER********************/
const getPermissionsByLabelSidebar = () => {
  if (detail?.roleId == constant.ADMIN) {
    return;
  }
  let dataStorage = localStorage.getItem("permissionStore");
  let data = dataStorage !== "undefined" ? JSON.parse(dataStorage) : []
  let rolesPrivilegesData = data?.rolesPrivileges ? JSON.parse(data?.rolesPrivileges?.at(0)) : ""
  return dataStorage ? rolesPrivilegesData : [];
}

const getDynamicSubNav = (data, category) => {
  const subNav = [];
  if (data?.value?.subNav) {
    Object.keys(data?.value?.subNav)?.forEach(subCategoryKey => {
      const subCategory = data?.value?.subNav[subCategoryKey];
      const icon =

        iconMapping[category] && iconMapping[category][subCategoryKey]
          ? iconMapping[category][subCategoryKey]
          :

          <FaIcons.FaQuestionCircle />;

      subNav?.push({
        title: formatCamelCaseString(subCategoryKey?.charAt(0)?.toUpperCase() + subCategoryKey?.slice(1)),
        path: getLinkHrefRoute(detail?.roleId, `/page/${subCategory?.path}`),
        icon: icon,
        cName: "nav-text",
        path_active_name: subCategoryKey,
      });
    });
  }

  return subNav;
};



export const PromotionUserData = [
  {
    title: "Dashboard",
    path: getLinkHrefRoute(detail?.roleId, `/page`),
    icon: <FaIcons.FaHome />,
    cName: pathName === getLinkHrefRoute(detail?.roleId, `/page`) ? "nav-text nav-text-active" : "nav-text",
    path_active_name: "",
  },
  ...getPermissionsByLabelSidebar()?.map((data) => {
    let title, path, icon, iconClosed, iconOpened, cName, path_active_name, subNav;
    switch (data?.label) {
      case "usersManagement":
        title = "Users Management",
          icon = <FaIcons.FaUsers />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, `/page/sales-person`) ||
            pathName == getLinkHrefRoute(detail?.roleId, `/page/customer-management`)
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "customer-management"
        subNav = getDynamicSubNav(data, "usersManagement");
        break;



      case "classificationManagement":
        title = "Classification Management",
          icon = <RiIcons.RiDiscountPercentLine />, // You can change the icon if needed
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, '/page/classification-management')
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "classification-management",
          subNav = [
            {
              title: "Classification ",
              path: getLinkHrefRoute(detail?.roleId, '/page/classification-management'),
              icon: <RiIcons.RiDiscountPercentLine />, // You can change the icon if needed
              cName: "nav-text",
              path_active_name: "classification-management",
            },
          ];
        break;



      case "companyManagement":
        title = "Company Management",
          icon = <FaIcons.FaArchway />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, `/page/company-management`) ||
            pathName ==
            getLinkHrefRoute(detail?.roleId, `/page/branch-management`)
            ||
            pathName ==
            getLinkHrefRoute(detail?.roleId, `/page/delivery-company-management`)
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "company-management"
        subNav = getDynamicSubNav(data, "companyManagement");
        break;

      case "productManagement":
        title = "Product Management",
          icon = <FaIcons.FaProductHunt />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName ==
            getLinkHrefRoute(detail?.roleId, `/page/product-management`)
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "product-management",
          subNav = [
            {
              title: "Products",
              path: getLinkHrefRoute(detail?.roleId, `/page/product-management`),
              icon: <MdProductionQuantityLimits />,
              cName: "nav-text",
              path_active_name: "product-management",
            },
          ];
        break;

      case "orderManagement":
        title = "Order Management",
          icon = <MdProductionQuantityLimits />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName ==
            getLinkHrefRoute(detail?.roleId, `/page/order-management`)
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "order-management",
          subNav = [
            {
              title: "Orders",
              path: getLinkHrefRoute(detail?.roleId, `/page/order-management`),
              icon: <MdProductionQuantityLimits />,
              cName: "nav-text",
              path_active_name: "order-management",
            },
          ];
        break;

      case "reportsManagement":
        title = "Reports Management",
          icon = <TbShoppingBagSearch />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, '/page/reports') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/general-reports') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/in-active-reports') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/user-reports') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/Item-available') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/supplier-monthly-report') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/coupon-report')
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "Reports"
        subNav = getDynamicSubNav(data, "reportsManagement");
        break;

      case "transactionManagement":
        title = "Transaction Management",
          icon = <FaIcons.FaExchangeAlt />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName ==
            getLinkHrefRoute(detail?.roleId, '/page/transaction-management')
            ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/refund')

            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "transaction-management"
        subNav = getDynamicSubNav(data, "transactionManagement");
        break;

      case "promotionManagement":
        title = "Promotion Management",
          icon = <FaBullhorn />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, '/page/promotion-management')
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "promotion-management",
          subNav = [
            {
              title: "Promotion",
              path: getLinkHrefRoute(detail?.roleId, '/page/promotion-management'),
              icon: <FaBullhorn />,
              cName: "nav-text",
              path_active_name: "promotion-management",
            },

          ];
        break;

      case "offerManagement":
        title = "Offer Management",
          icon = <RiIcons.RiDiscountPercentLine />, // You can change the icon if needed
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, '/page/offer-management')
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "offer-management",
          subNav = [
            {
              title: "Offers",
              path: getLinkHrefRoute(detail?.roleId, '/page/offer-management'),
              icon: <RiIcons.RiDiscountPercentLine />, // You can change the icon if needed
              cName: "nav-text",
              path_active_name: "offer-management",
            },
          ];
        break;

      case "fortuneManagement":
        title = "Fortune Spin",
          icon = <PiSpinnerBallDuotone />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, '/page/fortune-spin') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/fortune-settings')
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "fortune-spin"
        subNav = getDynamicSubNav(data, "fortuneManagement");
        break;

      // case "logger":
      //   title = "Logger",
      //     icon = <FaIcons.FaHistory />,
      //     iconClosed = <FaIcons.FaCaretDown />,
      //     iconOpened = <FaIcons.FaCaretUp />,
      //     cName =
      //     pathName == getLinkHrefRoute(detail?.roleId, '/page/error-logs') ||
      //       pathName == getLinkHrefRoute(detail?.roleId, '/page/email-queue') ||
      //       pathName == getLinkHrefRoute(detail?.roleId, '/page/activity-logs')
      //       ? "nav-text nav-text-active"
      //       : "nav-text",
      //     path_active_name = "error-logs",
      //     subNav = [
      //       {
      //         title: "Error Logs",
      //         path: getLinkHrefRoute(detail?.roleId, '/page/error-logs'),
      //         icon: <MdError />,
      //         cName: "nav-text",
      //         path_active_name: "error-logs",
      //       },
      //       {
      //         title: "SMS Logs",
      //         path: getLinkHrefRoute(detail?.roleId, '/page/sms-logs'),
      //         icon: <BiMessage />,
      //         cName: "nav-text",
      //         path_active_name: "sms-logs",
      //       },
      //       {
      //         title: "Email Queue",
      //         path: getLinkHrefRoute(detail?.roleId, '/page/email-queue'),
      //         icon: <FaIcons.FaMailBulk />,
      //         cName: "nav-text",
      //         path_active_name: "error-logs",
      //       },
      //       {
      //         title: "Login Activity",
      //         path: getLinkHrefRoute(detail?.roleId, '/page/activity-logs'),
      //         icon: <FiActivity />,
      //         cName: "nav-text",
      //         path_active_name: "error-logs",
      //       },
      //     ];
      //   break;

      case "settings":
        title = "Settings",
          icon = <IoSettingsSharp />,
          iconClosed = <FaIcons.FaCaretDown />,
          iconOpened = <FaIcons.FaCaretUp />,
          cName =
          pathName == getLinkHrefRoute(detail?.roleId, '/page/content-management') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/testimonial-management') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/faq-management') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/manual-notifications') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/contact-us') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/contact-info') ||
            pathName == getLinkHrefRoute(detail?.roleId, '/page/dynamic-form')
            ? "nav-text nav-text-active"
            : "nav-text",
          path_active_name = "Settings"
        subNav = getDynamicSubNav(data, "settings");
        break;
      default:
        return null;
    }

    return {
      title,
      path,
      icon,
      iconClosed,
      iconOpened,
      cName,
      path_active_name,
      subNav,
    };
  }).filter(Boolean) || [] // Filter out any null values
];