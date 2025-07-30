/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
let { TWILLIO } = require("../model/twillio.model");
let { CONST } = require("../../../helpers/constant");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
let mongoose = require("mongoose");

let twillio = {};

/**
 * Add twillio api
 */
twillio.addTwillio = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const isExist = await TWILLIO.findOne({
      $and: [
        {
          twillioAccountSid: data.twillioAccountSid,
        },
        {
          twillioAuthToken: data.twillioAuthToken,
        },
        {
          twillioWhatAppNumber: data.twillioWhatAppNumber,
        },
        {
          twillioSeriveId: data.twillioSeriveId,
        },
        {
          twillioPhoneNumber: data.twillioPhoneNumber,
        },
        {
          twillioContentSid: data.twillioContentSid,
        },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(
        req,
        true,
        "Twillio already exist with this email."
      );
      next();
    } else {
      const activeTWILLIO = await TWILLIO.findOne({ stateId: CONST.ACTIVE });
      if (activeTWILLIO) {
        data.stateId = CONST.INACTIVE;
      } else {
        data.stateId = CONST.ACTIVE;
      }
      const saveKey = await TWILLIO.create(data);

      if (saveKey) {
        await setResponseObject(
          req,
          true,
          "Twillio created successfully.",
          saveKey
        );
        next();
      } else {
        await setResponseObject(req, false, "Twillio not created.", saveKey);
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Edit twillio api
 */
twillio.editTwillio = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    const isExist = await TWILLIO.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        {
          twillioAccountSid: data.twillioAccountSid,
        },
        {
          twillioAuthToken: data.twillioAuthToken,
        },
        {
          twillioWhatAppNumber: data.twillioWhatAppNumber,
        },
        {
          twillioSeriveId: data.twillioSeriveId,
        },
        {
          twillioPhoneNumber: data.twillioPhoneNumber,
        },
        {
          twillioContentSid: data.twillioContentSid,
        },
        { stateId: CONST.ACTIVE },
      ],
    });
    if (isExist) {
      await setResponseObject(
        req,
        true,
        "Twillio already exist with this email."
      );
      next();
    } else {
      const editTWILLIO = await TWILLIO.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (editTWILLIO) {
        await setResponseObject(
          req,
          true,
          "Twillio updated successfully.",
          editTWILLIO
        );
        next();
      } else {
        await setResponseObject(req, false, "Twillio not updated");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Twillio list api
 */
twillio.twillioList = async (req, res, next) => {
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

    const list = await TWILLIO.aggregate([
      {
        $match: roleFilter,
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
        $sort: {
          createdAt: -1,
        },
      },
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
        "Twillio list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Twillio list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete twillio
 */
twillio.deleteTwillio = async (req, res, next) => {
  try {
    const deleteKey = await TWILLIO.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteKey) {
      await setResponseObject(req, true, "Twillio deleted successfully");
      next();
    } else {
      await setResponseObject(req, true, "Twillio not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View twillio
 */
twillio.viewTwillio = async (req, res, next) => {
  try {
    const viewTWILLIO = await TWILLIO.findById({
      _id: req.params.id,
    });
    if (viewTWILLIO) {
      await setResponseObject(
        req,
        true,
        "Twillio details found successfully",
        viewTWILLIO
      );
      next();
    } else {
      await setResponseObject(req, true, "Twillio details not");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = twillio;
