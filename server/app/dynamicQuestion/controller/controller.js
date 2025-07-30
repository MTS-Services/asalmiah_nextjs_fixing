/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { QUESTION_MODEL, ANSWER_MODEL } = require("../model/model");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const dynamic = {};
const mongoose = require("mongoose");

/**
 * Add dynamic question api
 */
dynamic.add = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const isExist = await QUESTION_MODEL.findOne({
      question: data.question,
      stateId: { $ne: CONST.DELETED },
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This dynamic question is already in existence."
      );
      next();
    } else {
      const saveque = await QUESTION_MODEL.create(data);

      if (saveque) {
        await setResponseObject(
          req,
          true,
          "Dynamic question added successfully",
          saveque
        );
        next();
      } else {
        await setResponseObject(req, false, "Dynamic question not added");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Edit dynamic question api
 */
dynamic.edit = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    const isExist = await QUESTION_MODEL.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { question: data.question },
        { stateId: { $ne: CONST.DELETED } },
      ],
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This dynamic question is already in existence."
      );
      next();
    }
    const updateFaq = await QUESTION_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateFaq) {
      await setResponseObject(
        req,
        true,
        "Dynamic question updated successfully",
        updateFaq
      );
      next();
    } else {
      await setResponseObject(req, false, "Dynamic question not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get dynamic question list api
 */
dynamic.list = async (req, res, next) => {
  try {
    let filter = {};
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    switch (req.query.state) {
      case "1": // ACTIVE
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2": // INACTIVE
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        break;
    }

    let roleFilter = {};

    // if (
    //   req.roleId == CONST.PROMOTION_USER ||
    //   req.roleId == CONST.DESIGNED_USER
    // ) {
    //   roleFilter = {
    //     $and: [
    //       { stateId: { $ne: CONST.DELETED } },
    //       { createdBy: new mongoose.Types.ObjectId(req.userId) },
    //     ],
    //   };
    // }

    const list = await QUESTION_MODEL.aggregate([
      // {
      //   $match: roleFilter,
      // },
      {
        $match: filter,
      },
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
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
        "Dynamic question found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Dynamic question not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Dynamic question view api
 */
dynamic.details = async (req, res, next) => {
  try {
    const details = await QUESTION_MODEL.findById({ _id: req.params.id });
    if (details) {
      await setResponseObject(
        req,
        true,
        "Dynamic question details found successfully",
        details
      );
      next();
    } else {
      await setResponseObject(req, true, "Dynamic question details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update dynamic question state
 */
dynamic.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Dynamic question Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Dynamic question In-Active successfully";
        break;

      default:
    }

    let updateState;

    updateState = await QUESTION_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Dynamic question state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Delete dynamic question
 */
dynamic.delete = async (req, res, next) => {
  try {
    let deleteRes = await QUESTION_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteRes) {
      await setResponseObject(
        req,
        true,
        "Dynamic question deleted successfully",
        deleteRes
      );
      next();
    } else {
      await setResponseObject(req, false, "Dynamic question not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get dynamic question list api
 */
dynamic.productQuestion = async (req, res, next) => {
  try {
    let filter = {};
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    const list = await QUESTION_MODEL.aggregate([
      {
        $match: filter,
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
        "FAQ found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "FAQ not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Assign dynamic question to product
 */
dynamic.assignQuestion = async (req, res, next) => {
  try {
    const isAssign = await QUESTION_MODEL.findOne({
      _id: req.params.id,
      productId: {
        $exists: true,
        $ne: [],
        $elemMatch: { $eq: req.query.productId },
      },
    });
    if (isAssign) {
      await setResponseObject(
        req,
        false,
        "This Dynamic question already assign this product"
      );
      next();
      return;
    }
    const assignProduct = await QUESTION_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { productId: req.query.productId } },
      {
        new: true,
      }
    );

    if (assignProduct) {
      await setResponseObject(
        req,
        true,
        "Dynamic question assigned successfully",
        assignProduct
      );
      next();
    } else {
      await setResponseObject(req, false, "Dynamic question not assigned");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Assign dynamic question to product
 */
dynamic.sendAnswer = async (req, res, next) => {
  try {
    const data = req.body;

    data.createdBy = req.userId;
    const storeAnswer = await ANSWER_MODEL.create(data);

    if (storeAnswer) {
      await setResponseObject(
        req,
        true,
        "Question submitted successfully!",
        storeAnswer
      );
      next();
    } else {
      await setResponseObject(req, false, "Your question not submitted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

module.exports = dynamic;
