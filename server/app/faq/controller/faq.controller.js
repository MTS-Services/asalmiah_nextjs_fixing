/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { FAQ_MODEL } = require("../model/faq.model");
const { CONST } = require("../../../helpers/constant");
const {
  setResponseObject,
  validationData,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");

const faq = {};

/**
 * Add faq api
 */
faq.addFaq = async (req, res, next) => {
  try {
    const data = req.body;
    data.question = data?.question?.trim();
    data.answer = data?.answer?.trim();
    data.arabicQuestion = data?.arabicQuestion?.trim();
    data.arabicAnswer = data?.arabicAnswer?.trim();
    data.createdBy = req.userId;

    const isExist = await FAQ_MODEL.findOne({
      question: data.question,
    });

    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This Question is already in existence."
      );
      next();
    } else {
      const saveFaq = await FAQ_MODEL.create(data);

      if (saveFaq) {
        await setResponseObject(req, true, "FAQ added successfully", saveFaq);
        next();
      } else {
        await setResponseObject(req, false, "FAQ not added");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Edit faq api
 */
faq.editFaq = async (req, res, next) => {
  try {
    const data = req.body;
    data.question = data?.question?.trim();
    data.answer = data?.answer?.trim();
    data.arabicQuestion = data?.arabicQuestion?.trim();
    data.arabicAnswer = data?.arabicAnswer?.trim();
    data.updatedBy = req.userId;
    const isExist = await FAQ_MODEL.findOne({
      $and: [{ _id: { $ne: req.params.id } }, { question: data.question }],
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This Question is already in existence."
      );
      next();
    }
    const updateFaq = await FAQ_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateFaq) {
      await setResponseObject(req, true, "FAQ updated successfuly", updateFaq);
      next();
    } else {
      await setResponseObject(req, false, "FAQ not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get faq list api
 */
faq.faqList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
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

      case "3": // DELETED
        filter = {
          stateId: CONST.DELETED,
        };
        break;

      default:
        break;
    }

    // let roleFilter = {};

    // if (
    //   req.roleId == CONST.PROMOTION_USER ||
    //   req.roleId == CONST.DESIGNED_USER
    // ) {
    //   roleFilter = {
    //     createdBy: new mongoose.Types.ObjectId(req.userId),
    //   };
    // }

    const list = await FAQ_MODEL.aggregate([
      // {
      //   $match: roleFilter,
      // },
      {
        $match: filter,
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
        $project: {
          _id: 1,
          question: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicQuestion", "$question"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$question", // Use company otherwise
            },
          },
          arabicQuestion: 1,
          answer: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicAnswer", "$answer"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$answer", // Use company otherwise
            },
          },
          arabicAnswer: 1,
          createdBy: 1,
          updatedBy: 1,
          stateId: 1,
          createdAt: 1,
          updatedAt: 1,
          permission: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          question: { $first: "$question" },
          arabicQuestion: { $first: "$arabicQuestion" },
          answer: { $first: "$answer" },
          arabicAnswer: { $first: "$arabicAnswer" },
          stateId: { $first: "$stateId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          permission: { $first: "$permission" },
        },
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
        "FAQ found successfuly",
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
 * Faq view api
 */
faq.faqDetails = async (req, res, next) => {
  try {
    const details = await FAQ_MODEL.aggregate([
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
    if (details.length > 0) {
      await setResponseObject(
        req,
        true,
        "FAQ details found successfully",
        details[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "FAQ details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update page state id
 */
faq.updateFaqState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Faq Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Faq In-Active successfully";
        break;

      case "3":
        filter = {
          stateId: 3, // 3 => DELETED
        };
        resp = "Faq deleted successfully";
        break;
      default:
    }

    let updateState;

    updateState = await FAQ_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Faq state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update page state id
 */
faq.delete = async (req, res, next) => {
  try {
    let deleteRes = await FAQ_MODEL.findByIdAndDelete({ _id: req.params.id });
    if (deleteRes) {
      await setResponseObject(req, true, "Faq deleted successfully", deleteRes);
      next();
    } else {
      await setResponseObject(req, false, "Faq not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get faq list api
 */
faq.activeFaqList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    const list = await FAQ_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          question: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicQuestion", "$question"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$question", // Use company otherwise
            },
          },
          arabicQuestion: 1,
          answer: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicAnswer", "$answer"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$answer", // Use company otherwise
            },
          },
          arabicAnswer: 1,
          createdBy: 1,
          stateId: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        "FAQ found successfuly",
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

module.exports = faq;
