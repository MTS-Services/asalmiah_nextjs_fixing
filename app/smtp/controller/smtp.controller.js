/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let { SMTP } = require("../model/smtp.model");
let { CONST } = require("../../../helpers/constant");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
  const mongoose = require("mongoose");

let smtp = {};

/**
 * Add smtp api
 */
smtp.addSmtp = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await SMTP.findOne({
      $and: [
        {
          email: data.email,
        },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(req, true, "Smtp already exist with this email.");
      next();
    } else {
      const activeSmtp = await SMTP.findOne({ stateId: CONST.ACTIVE });
      if (activeSmtp) {
        data.stateId = CONST.INACTIVE;
      } else {
        data.stateId = CONST.ACTIVE;
      }
      const saveKey = await SMTP.create(data);
      if (saveKey) {
        await setResponseObject(
          req,
          true,
          "Smtp created successfully.",
          saveKey
        );
        next();
      } else {
        await setResponseObject(req, false, "Smtp not created.", saveKey);
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Edit smtp api
 */
smtp.editSmtp = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    const isExist = await SMTP.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        {
          email: data.email,
        },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(req, true, "Smtp already exist with this email.");
      next();
    } else {
      const editSmtp = await SMTP.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (editSmtp) {
        await setResponseObject(
          req,
          true,
          "Smtp updated successfully.",
          editSmtp
        );
        next();
      } else {
        await setResponseObject(req, false, "Smtp not updated");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * SmtP list api
 */
smtp.smtpList = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    let roleFilter = {};

    if (
      req.roleId == CONST.PROMOTION_USER ||
      req.roleId == CONST.DESIGNED_USER
    ) {
      roleFilter = {
        $and: [
          { stateId: { $ne: CONST.DELETED } },
          { createdBy: new mongoose.Types.ObjectId(req.userId) },
        ],
      };
    }

    const list = await SMTP.aggregate([
      {
        $match: roleFilter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: { $ifNull: ["$createdBy", ""] } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                email: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                roleId: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          let: { id: { $ifNull: ["$updatedBy", ""] } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                email: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                roleId: 1,
              },
            },
          ],
          as: "updatedBy",
        },
      },
      {
        $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $lookup: {
      //     from: "permissionschemas",
      //     let: { id: "$createdBy._id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
      //           },
      //         },
      //       },
      //     ],
      //     as: "permission",
      //   },
      // },
      // {
      //   $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
      // },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Smtp list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Smtp list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete smtp
 */
smtp.deleteSmtp = async (req, res, next) => {
  try {
    const deleteKey = await SMTP.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteKey) {
      await setResponseObject(req, true, "Smtp deleted successfully");
      next();
    } else {
      await setResponseObject(req, true, "Smtp not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View smtp
 */
smtp.viewSmtp = async (req, res, next) => {
  try {
    const viewSmtp = await SMTP.findById({
      _id: req.params.id,
    });
    if (viewSmtp) {
      await setResponseObject(
        req,
        true,
        "Smtp details found successfully",
        viewSmtp
      );
      next();
    } else {
      await setResponseObject(req, true, "Smtp details not");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = smtp;
