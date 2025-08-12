/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { CONTACTINFO } = require("../model/model");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { default: mongoose } = require("mongoose");
const info = {};

/**
 * Add info api
 */
info.add = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const isExist = await CONTACTINFO.findOne({ stateId: CONST.ACTIVE });

    if (isExist?.stateId == CONST.ACTIVE) {
      data.stateId = CONST.INACTIVE;
    } else {
      data.stateId = CONST.ACTIVE;
    }
    const saveFaq = await CONTACTINFO.create(data);

    if (saveFaq) {
      await setResponseObject(
        req,
        true,
        "Contact information added successfully",
        saveFaq
      );
      next();
    } else {
      await setResponseObject(req, false, "Contact information not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Edit info api
 */
info.update = async (req, res, next) => {
  try {
    const data = req.body;
    const isExist = await CONTACTINFO.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        {
          $or: [
            { email: data.email },
            {
              $and: [
                { countryCode: data.countryCode },
                { mobile: data.mobile },
              ],
            },
          ],
        },
      ],
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "Conatct information is already in existence."
      );
      next();
    }
    const updateFaq = await CONTACTINFO.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateFaq) {
      await setResponseObject(
        req,
        true,
        "Conatct information updated successfuly",
        updateFaq
      );
      next();
    } else {
      await setResponseObject(req, false, "Conatct information not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get info list api
 */
info.list = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      // Function to escape special regex characters
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
      );

      searchFilter.$or = [
        {
          email: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  { $trim: { input: { $toString: "$countryCode" } } },
                  { $trim: { input: { $toString: "$mobile" } } },
                ],
              },
              regex: searchTerm,
              options: "i",
            },
          },
        },
      ];
    }

    let stateFilter = {};

    switch (req.query.stateId) {
      case "1":
        stateFilter = {
          stateId: CONST.ACTIVE, // 1 => ACTIVE
        };
        break;

      case "2":
        stateFilter = {
          stateId: CONST.INACTIVE, // 2 => INACTIVE
        };
        break;
      default:
        stateFilter = {};
    }

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

    const list = await CONTACTINFO.aggregate([
      {
        $match: roleFilter,
      },
      {
        $match: searchFilter,
      },
      {
        $match: stateFilter,
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
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: "$createdBy._id" },
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
    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        "Conatct information found successfuly",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Conatct information not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Faq info api
 */
info.details = async (req, res, next) => {
  try {
    const details = await CONTACTINFO.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
    ]);
    if (details) {
      await setResponseObject(
        req,
        true,
        "Conatct information details found successfully",
        details
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Conatct information details not found"
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update info state id
 */
info.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Conatct information Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Conatct information In-Active successfully";
        break;
      default:
    }

    let updateState;

    updateState = await CONTACTINFO.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: filter,
      },
      { new: true }
    );
    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(
        req,
        false,
        "Conatct information state not updated"
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Delete info state id
 */
info.delete = async (req, res, next) => {
  try {
    let deleteRes = await CONTACTINFO.findByIdAndDelete({ _id: req.params.id });
    if (deleteRes) {
      await setResponseObject(
        req,
        true,
        "Conatct information deleted successfully"
      );
      next();
    } else {
      await setResponseObject(req, false, "Conatct information not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*
Active info list
*/
info.activeInfoList = async (req, res, next) => {
  try {
    const getSingle = await CONTACTINFO.findOne({ stateId: CONST.ACTIVE });
    if (getSingle) {
      await setResponseObject(
        req,
        true,
        "Conatct information list found",
        getSingle
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Conatct information list not found",
        []
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = info;
