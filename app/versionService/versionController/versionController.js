/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { VERSION_MODEL } = require("../versionModel/versionModel");
const mongoose = require("mongoose");

let version = {};

/**
 * Add app version api
 */
version.addVersion = async (req, res, next) => {
  try {
    const { platform, latestVersion, forceUpdate, releaseNotes, type } =
      req.body;

    let version = await VERSION_MODEL.findOne({
      platform: platform,
      latestVersion: latestVersion,
      forceUpdate: forceUpdate,
      releaseNotes: releaseNotes,
      type: type,
      createdBy: req.userId,
    });

    if (version) {
      await setResponseObject(
        req,
        true,
        "Offarat App Version already exist.",
        version
      );
      next();
    } else {
      version = await VERSION_MODEL.create({
        platform,
        latestVersion,
        forceUpdate,
        releaseNotes,
        type,
        createdBy,
      });
      await setResponseObject(
        req,
        true,
        "Offarat App Version added successfully.",
        version
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * App versio list api
 */
version.list = async (req, res, next) => {
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

    const list = await VERSION_MODEL.aggregate([
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
        "Offarat App Versiont list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Offarat App Versiont list not found",
        []
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Edit app version api
 */
version.editVersion = async (req, res, next) => {
  try {
    const data = req.body;

    const editVersion = await VERSION_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (editVersion) {
      await setResponseObject(
        req,
        true,
        "Offarat App Versiont updated successfully.",
        editVersion
      );
      next();
    } else {
      await setResponseObject(req, false, "Offarat App Version not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View app version
 */
version.viewVersion = async (req, res, next) => {
  try {
    const viewVersion = await VERSION_MODEL.findById({
      _id: req.params.id,
    });
    if (viewVersion) {
      await setResponseObject(
        req,
        true,
        "Offarat App Version details found successfully",
        viewVersion
      );
      next();
    } else {
      await setResponseObject(req, true, "Offarat App Version details not");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * App versio list api
 */
version.versionList = async (req, res, next) => {
  try {
    let platform = req.query.platform ? req.query.platform : CONST.ANDROID;
    let type = req.query.type ? req.query.type : CONST.USER;

    const versionList = await VERSION_MODEL.findOne({
      platform: platform,
      type: type,
    });

    // Compare the user's version with the latest version
    if (versionList) {
      await setResponseObject(
        req,
        true,
        "Offarat App Version list found successfully",
        versionList
      );
      next();
    } else {
      await setResponseObject(req, true, "Offarat App Version list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete sapp versiontp
 */
version.deleteversion = async (req, res, next) => {
  try {
    const deleteKey = await SMTP.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteKey) {
      await setResponseObject(
        req,
        true,
        "Offarat App Version deleted successfully"
      );
      next();
    } else {
      await setResponseObject(req, true, "Offarat App Version not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = version;
