/** 
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { REFUND_REQUEST } = require("../model/model");
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { COMPANY_MODEL } = require("../../company/model/model");
const ORDER = require("../../order/model/order.model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const orderModel = require("../../order/model/order.model");

const refundRequest = {};

/**
 * Request list api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
refundRequest.requestList = async (req, res, next) => {
  try {
    let page = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search.replace(
        new RegExp("\\\\", "g"),
        "\\\\"
      );

      // Escape special characters in searchValue for regex
      const escapedSearchValue = searchValue
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .trim();

      // Try to parse the orderId from the search value
      const searchNumber = parseInt(searchValue, 10);

      // Build the search filter
      searchFilter.$or = [
        {
          "userDetails.fullName": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          "userDetails.email": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          "orderDetails.orderId": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          "orderDetails.orderId": {
            $eq: searchNumber,
          },
        },
      ];
    }

    let stateFilter = {};

    switch (req.query.stateId) {
      case "6":
        stateFilter = {
          stateId: CONST.REJECT,
        };
        break;

      case "7":
        stateFilter = {
          stateId: CONST.REFUND,
        };
        break;

      default:
        break;
    }

    let categoryFilter = {};

    if (
      req.roleId === CONST.PROMOTION_USER ||
      req.roleId === CONST.DESIGNED_USER
    ) {
      // Find the permission based on user role
      const userIdObj = new mongoose.Types.ObjectId(req.userId);
      const permissionQuery = {
        $or: [{ promotionId: userIdObj }, { designedId: userIdObj }],
      };

      const findPermission = await PERMISSION_MODEL.findOne(permissionQuery);
      if (!findPermission) {
        throw new Error("Permission not found.");
      }

      const companies = await COMPANY_MODEL.find({
        categoryId: { $in: findPermission.categoryId },
      });

      const orders = await orderModel.find({
        company: { $in: companies._id },
      });

      if (orders.length > 0) {
        let orderIds = orders.map((order) => order._id);

        categoryFilter = {
          orderId: { $in: orderIds }, // ✅ Use $in here
        };
      }
    }

    let list = await REFUND_REQUEST.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: stateFilter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                fullName: 1,
                email: 1,
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "orders",
          let: { id: "$orderId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $lookup: {
                from: "companies",
                let: { id: "$company" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      company: 1,
                      country: 1,
                    },
                  },
                ],
                as: "companyDetails",
              },
            },
            {
              $unwind: {
                path: "$companyDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: new mongoose.Types.ObjectId(req.userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
                },
              },
            },
          ],
          as: "permission",
        },
      },
      {
        $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
      },
      {
        $match: searchFilter,
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (page - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Refund list found successfully",
        list[0].data,
        list[0].count[0].count,
        page,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Refund list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Approve or reject request api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
refundRequest.approveRequest = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "6":
        filter = {
          stateId: CONST.REJECT,
        };
        resp = "Request rejected successfully";

        break;

      case "7":
        filter = {
          stateId: CONST.APPROVE,
        };
        resp = "Request approved successfully";
        break;
    }
    const updateState = await REFUND_REQUEST.findByIdAndUpdate(
      { _id: req.params.id },
      filter,
      { new: true }
    );
    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Request state Id not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = refundRequest;
