/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CALSSIFICATION } = require("../model/model");
const {
  setResponseObject,
  validationData,
  capitalizeLetter,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const { CATEGORY_MODEL } = require("../../category/model/category.model");
const _classification = {};

/*Add classification*/
_classification.add = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    data.name = capitalizeLetter(data?.name)?.trim();
    data.arbicName = capitalizeLetter(data?.arbicName)?.trim();
    
    // Validate categoryId if provided
    if (data.categoryId) {
      const categoryExists = await CATEGORY_MODEL.findOne({
        _id: data.categoryId,
        stateId: { $ne: CONST.DELETED },
      });
      
      if (!categoryExists) {
        await setResponseObject(
          req,
          false,
          "Category not found or deleted"
        );
        next();
        return;
      }
    }
    
    const isExists = await CALSSIFICATION.findOne({
      $and: [
        { name: validationData(data.name) },
        { stateId: { $ne: CONST.DELETED } },
      ],
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        "Classification already exist with name"
      );
      next();
      return;
    }

    const result = await CALSSIFICATION.create(data);
    if (result) {
      await setResponseObject(
        req,
        true,
        "Classification added successfully",
        result
      );
      next();
    } else {
      await setResponseObject(req, false, "Classification not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all classification*/
_classification.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          name: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\"),
            $options: "i",
          },
        },
        {
          arbicName: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\"),
            $options: "i",
          },
        },
      ];
    }

    let stateFilter = {};
    switch (req.query.stateId) {
      case "1":
        stateFilter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2":
        stateFilter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        break;
    }

    let list = await CALSSIFICATION.aggregate([
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
        },
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
          from: "categories",
          let: { id: { $ifNull: ["$categoryId", ""] } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: { $ne: CONST.DELETED },
              },
            },
            {
              $project: {
                _id: 1,
                category: 1,
                arabicCategory: 1,
                categoryImg: 1,
                order: 1,
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
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
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          arbicName: { $first: "$arbicName" },
          categoryId: { $first: "$categoryId" },
          category: { $first: "$category" },
          order: { $first: "$order" },
          stateId: { $first: "$stateId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          permission: { $first: "$permission" },
        },
      },
      {
        $addFields: {
          sortKey: {
            $cond: {
              if: { $gt: ["$order", 0] }, // Check if 'order' exists and is greater than 0
              then: { $toInt: { $ifNull: ["$order", 0] } }, // Convert to integer safely
              else: Number.MAX_SAFE_INTEGER, // Assign a high value for sorting purposes
            },
          },
        },
      },
      {
        $sort: {
          sortKey: 1, // Sort by the new sortKey field first (ascending)
          createdAt: -1, // Then sort by createdAt in descending order
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
        "Classification list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Classification list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View classification */
_classification.detail = async (req, res, next) => {
  try {
    let findPermision = await PERMISSION_MODEL.findOne({
      $or: [{ promotionId: req.userId }, { designedId: req.userId }],
    });
    if (findPermision) {
      let parsePermission = findPermision.rolesPrivileges;
    }
    const getSingle = await CALSSIFICATION.aggregate([
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
      {
        $lookup: {
          from: "categories",
          let: { id: { $ifNull: ["$categoryId", ""] } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: { $ne: CONST.DELETED },
              },
            },
            {
              $project: {
                _id: 1,
                category: 1,
                arabicCategory: 1,
                categoryImg: 1,
                order: 1,
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
    ]);
    if (getSingle.length > 0) {
      await setResponseObject(
        req,
        true,
        "Classification found successfully",
        getSingle[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Classification not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update classification*/
_classification.update = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    data.name = capitalizeLetter(data?.name)?.trim();
    data.arbicName = capitalizeLetter(data?.arbicName)?.trim();
    
    // Validate categoryId if provided
    if (data.categoryId) {
      const categoryExists = await CATEGORY_MODEL.findOne({
        _id: data.categoryId,
        stateId: { $ne: CONST.DELETED },
      });
      
      if (!categoryExists) {
        await setResponseObject(
          req,
          false,
          "Category not found or deleted"
        );
        next();
        return;
      }
    }
    
    // if (data.order !== "") {
    //   const isExists = await CALSSIFICATION.findOne({
    //     _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
    //     name: validationData(data.name),
    //     stateId: { $ne: CONST.DELETED },
    //   });

    //   if (isExists) {
    //     await setResponseObject(
    //       req,
    //       false,
    //       `Classification already exist with this name`
    //     );
    //     next();
    //     return;
    //   }
    // }

    const updateData = await CALSSIFICATION.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Classification updated successfully",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Classification not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate classification state*/
_classification.updateState = async (req, _res, next) => {
  try {
    console.log("Updating classification state", req.params.id, req.body.stateId);
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Classification Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Classification In-Active successfully";
        break;

      default:
    }

    let updateState = await CALSSIFICATION.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Classification state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete classification*/
_classification.delete = async (req, res, next) => {
  try {
    const deleteData = await CALSSIFICATION.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Classification deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Classification not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all classification*/
_classification.activeList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          name: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        },
        {
          arbicName: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        },
      ];
    }

    let list = await CALSSIFICATION.aggregate([
      {
        $match: {
          stateId: { $eq: CONST.ACTIVE },
        },
      },
      {
        $match: searchFilter,
      },
      {
        $sort: {
          order: 1,
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
        "Classification list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Classification list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all classification*/
_classification.companyClassification = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let list = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(req.params.id),
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "classifications",
          let: { id: "$classification" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: CONST.ACTIVE,
              },
            },
            {
              $project: {
                _id: 1,
                name: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if language is 'AR'
                    then: {
                      $ifNull: ["$arbicName", "$name"], // Use arabicCategory if it exists, otherwise use category
                    },
                    else: "$name", // If language is not 'AR', use category
                  },
                },
                order: 1,
                stateId: 1,
                createdAt: 1,
              },
            },
            {
              $addFields: {
                sortKey: {
                  $cond: {
                    if: { $gt: ["$order", 0] }, // Check if 'order' exists and is greater than 0
                    then: { $toInt: { $ifNull: ["$order", 0] } }, // Convert to integer safely
                    else: Number.MAX_SAFE_INTEGER, // Assign a high value for sorting purposes
                  },
                },
              },
            },
          ],
          as: "classification",
        },
      },
      {
        $unwind: { path: "$classification", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$classification._id",
          classification: { $first: "$classification" },
        },
      },
      {
        $sort: {
          "classification.sortKey": 1, // Sort by the sortKey field first (ascending)
          "classification.createdAt": -1, // Then sort by createdAt in descending order
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
        "Classification list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Classification list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all classification*/
_classification.activeClassification = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

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

    let list = await CALSSIFICATION.aggregate([
      {
        $match: {
          stateId: { $eq: CONST.ACTIVE },
        },
      },
      {
        $match: roleFilter,
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$classification"] },
                stateId: CONST.ACTIVE,
                quantity: { $gt: 0 },
              },
            },
          ],
          as: "products",
        },
      },
      {
        $match: {
          products: { $ne: [] }, // Filter to include only classifications with products
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          name: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arbicName", "$name"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$name", // If language is not 'AR', use category
            },
          },
          arbicName: 1,
          order: 1,
          stateId: 1,
          createdAt: 1,
        },
      },
    ]);

    if (list) {
      await setResponseObject(
        req,
        true,
        "Classification list found successfully",
        list
      );
      next();
    } else {
      await setResponseObject(req, true, "Classification list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get classifications by category*/
_classification.getByCategory = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    
    // Validate categoryId parameter
    if (!req.params.categoryId || !mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
      await setResponseObject(
        req,
        false,
        "Invalid category ID provided"
      );
      next();
      return;
    }

    // First check if category exists
    const categoryExists = await CATEGORY_MODEL.findOne({
      _id: req.params.categoryId,
      stateId: { $ne: CONST.DELETED },
    });

    if (!categoryExists) {
      await setResponseObject(
        req,
        false,
        "Category not found or deleted"
      );
      next();
      return;
    }

    // Check if any classifications exist for this category (for debugging)
    const classificationCount = await CALSSIFICATION.countDocuments({
      categoryId: new mongoose.Types.ObjectId(req.params.categoryId),
    });

    console.log(`Total classifications for category ${req.params.categoryId}:`, classificationCount);

    const list = await CALSSIFICATION.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(req.params.categoryId),
          stateId: { $eq: CONST.ACTIVE },
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { id: { $ifNull: ["$categoryId", ""] } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: { $ne: CONST.DELETED },
              },
            },
            {
              $project: {
                _id: 1,
                category: {
                  $cond: {
                    if: { $eq: [language, "AR"] },
                    then: {
                      $ifNull: ["$arabicCategory", "$category"],
                    },
                    else: "$category",
                  },
                },
                categoryImg: 1,
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          name: {
            $cond: {
              if: { $eq: [language, "AR"] },
              then: {
                $ifNull: ["$arbicName", "$name"],
              },
              else: "$name",
            },
          },
          category: 1,
          order: 1,
          createdAt: 1,
        },
      },
      {
        $addFields: {
          sortKey: {
            $cond: {
              if: { $gt: ["$order", 0] },
              then: { $toInt: { $ifNull: ["$order", 0] } },
              else: Number.MAX_SAFE_INTEGER,
            },
          },
        },
      },
      {
        $sort: { sortKey: 1, createdAt: -1 },
      },
    ]);

    if (list && list.length > 0) {
      await setResponseObject(
        req,
        true,
        "Classifications found successfully",
        list
      );
      next();
    } else {
      await setResponseObject(
        req,
        true, 
        `No active classifications found for this category. Total classifications: ${classificationCount}`,
        []
      );
      next();
    }
  } catch (error) {
    console.error("Error in getByCategory:", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = _classification;
