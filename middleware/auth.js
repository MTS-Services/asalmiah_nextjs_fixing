/** 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const jwt = require("jsonwebtoken");
const { CONST } = require("../helpers/constant");
const dotenv = require("dotenv");
const { USER } = require("../app/userService/model/userModel");
const { log } = require("winston");
dotenv.config();

const _tokenManager = {};

const getToken = function (req) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(" ")[1];
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized)
  // to the client for this request
  return null;
};

/*User middleware*/
_tokenManager.authenticate = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    jwt.verify(token, secret, async (err, decoded) => {
      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
          token: token,
        });

        if (!checkUser) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        if (checkUser?.stateId == CONST.DELETED) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account has been deleted",
          });
        }
        if (checkUser?.stateId == CONST.INACTIVE) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account is inactive, Contact admin",
          });
        }
        if (checkUser?.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        // req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

/*Admin middleware*/
_tokenManager.admin = (req, res, next) => {
  if (req.headers["authorization"]) {

    let token = getToken(req);

    let allPathName = [
      "/dashboard/count",
      "/dashboard/graphData",

      "/user/add",
      "/user/list",
      "/user/view",
      "/user/edit",
      "/user/updateState",
      "/user/delete",
      "/user/downloadLoginReport",

      "/promotion/add",
      "/promotion/list",
      "/promotion/detail",
      "/promotion/update",
      "/promotion/updateState",
      "/promotion/delete",

      "/offer/add",
      "/offer/list",
      "/offer/detail",
      "/offer/update",
      "/offer/updateState",
      "/offer/delete",

      "/product/pendingProduct",

      "/category/add",
      "/category/list",
      "/category/detail",
      "/category/update",
      "/category/updateState",
      "/category/delete",

      "/subcategory/add",
      "/subcategory/list",
      "/subcategory/detail",
      "/subcategory/edit",
      "/subcategory/updateState",
      "/subcategory/delete",

      "/classification/add",
      "/classification/list",
      "/classification/detail",
      "/classification/update",
      "/classification/updateState",
      "/classification/delete",
      "/classification/dropDown",

      "/deliverycompany/add",
      "/deliverycompany/list",
      "/deliverycompany/detail",
      "/deliverycompany/edit",
      "/deliverycompany/updateState",
      "/deliverycompany/delete",

      "/company/add",
      "/company/list",
      "/company/detail",
      "/company/edit",
      "/company/updateState",
      "/company/delete",
      "/company/downloadCompanyReport",
      "/company/dropDownCompany",

      "/branch/add",
      "/branch/list",
      "/branch/detail",
      "/branch/edit",
      "/branch/updateState",
      "/branch/delete",
      "/branch/downloadCompanyReport",
      "/branch/companyFilter",

      "/statementAccount/add",
      "/statementAccount/list",
      "/statementAccount/details",
      "/statementAccount/edit",
      "/statementAccount/updateState",
      "/statementAccount/delete",

      "/statementTransaction/add",
      "/statementTransaction",
      "/statementTransaction/downloadStatementReport",

      "/product/add",
      "/product/pendingProduct",
      "/product/detail",
      "/product/edit",
      "/product/updateState",
      "/product/deleteProduct",
      "/product/deleteImg",
      "/product/downloadItemReport",
      "/product/setDefaultImage",

      "/spinner/add",
      "/spinner/list",
      "/spinner/detail",
      "/spinner/update",
      "/spinner/updateState",
      "/spinner/delete",
      "/spinner/downloadSpinnerReport",

      "/spinner/setting/add",
      "/spinner/setting/list",
      "/spinner/setting/detail",
      "/spinner/setting/update",
      "/spinner/setting/updateState",
      "/spinner/setting/delete",

      "/refundRequest/requestList",
      "/refundRequest/updateRequest",

      "/payment/transactionList",
      "/payment/transactionView",
      "/payment/downloadRefundReport",
      "/payment/itemRefund",
      "/payment/refund",

      "/order/adminOrderList",
      "/order/orderDetails",
      "/order/adminOrderList",
      "/order/updateOrderState",
      "/order/cancelOrder",
      "/order/invoiceList",
      "/order/downloadOrderReport",
      "/order/downloadMonthlyReport",

      "/banner/add",
      "/banner/list",
      "/banner/detail",
      "/banner/update",
      "/banner/updateState",
      "/banner/delete",

      "/dynamicLabeling/add",
      "/dynamicLabeling/list",
      "/dynamicLabeling/detail",
      "/dynamicLabeling/update",
      "/dynamicLabeling/updateState",
      "/dynamicLabeling/delete",

      "/cms/add",
      "/cms/list",
      "/cms/detail",
      "/cms/update",
      "/cms/updateState",
      "/cms/delete",
      "/cms/getByType",

      "/testimonial/add",
      "/testimonial/list",
      "/testimonial/detail",
      "/testimonial/update",
      "/testimonial/updateState",
      "/testimonial/delete",

      "/faq/add",
      "/faq/list",
      "/faq/detail",
      "/faq/edit",
      "/faq/updateState",
      "/faq/delete",

      "/notification/sendNotification",
      "/notification/getAdminNotificationList",
      "/notification/notificationView",

      "/contactUs/list",
      "/contactUs/view",
      "/contactUs/delete",

      "/dynamic/add",
      "/dynamic/list",
      "/dynamic/detail",
      "/dynamic/update",
      "/dynamic/updateState",
      "/dynamic/delete",
      "/dynamic/assignQuestion",

      "/smtp/add",
      "/smtp/list",
      "/smtp/view",
      "/smtp/update",
      "/smtp/delete",

      "/twillio/add",
      "/twillio/list",
      "/twillio/view",
      "/twillio/update",
      "/twillio/delete",

      "/appversion/add",
      "/appversion/list",
      "/appversion/details",
      "/appversion/update",
      "/appversion/delete",

      "/permission/permissionDetails",
      "/coupon/downloadCouponReport"
    ];

    const secret = process.env.JWT_SECRET || "Development";

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        // Custom error handling for expired/invalid tokens
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your session has expired. Please log in again.",
          });
        } else if (err.name === "JsonWebTokenError") {
          // Handles other JWT errors like invalid signature
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "Invalid token. Please contact support.", // Custom message for invalid token
          });
        } else {
          // Handle other potential errors
          console.error("JWT Verification Error:", err);
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "An unexpected error occurred. Please contact support.", // Generic error message
          });
        }
      }

      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });

        if (!checkUser) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }

        // if (checkUser.tokenExpiration < Date.now()) {
        //   await USER.findOneAndUpdate(
        //     { _id: checkUser._id },
        //     {
        //       $set: {
        //         token: "",
        //         deviceToken: "",
        //       },
        //     },
        //     { new: true }
        //   );
        //   return res.status(401).send({
        //     statusCode: 401,
        //     success: false,
        //     message: "Session expired",
        //   });
        // }

        if (checkUser.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }

        if (
          allPathName.some((path) => req.path?.startsWith(path)) &&
          (checkUser.roleId == CONST.PROMOTION_USER ||
            checkUser.roleId == CONST.DESIGNED_USER)
        ) {
          req.user = checkUser;
          req.userId = decoded.userId;
          req.roleId = decoded.roleId;
          req.email = decoded.email;
          req.customerId = decoded.customerId;
          next();
          return;
        }
        if (checkUser.roleId != CONST.ADMIN) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "unauthorized access",
          });
        }

        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        req.customerId = decoded.customerId;
        // req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

module.exports = _tokenManager;
