/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { SUBCATEGORY_MODEL } = require("../model/subCategory.model");
const {
  setResponseObject,
  validationData,
  capitalizeLetter,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const logger = require("winston");
const subcategory = {};

const multer = require("multer");
const fs = require("fs");
const dir = "../uploads/subCategoryImg";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "subCategoryImg" },
]);

/*Add subcategory*/
subcategory.add = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }

      const isExists = await SUBCATEGORY_MODEL.findOne({
        $and: [
          { subcategory: validationData(req?.body?.subcategory) },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        // Remove the file from local storage
        if (req?.files?.subCategoryImg) {
          fs.unlink(req?.files?.subCategoryImg[0].path, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }

        await setResponseObject(
          req,
          false,
          `Sub category already exist with ${req?.body?.subcategory}`
        );
        next();
        return;
      }

      const data = req.body;

      data.createdBy = req.userId;
      data.subcategory = capitalizeLetter(data?.subcategory)?.trim();
      data.arabicSubcategory = capitalizeLetter(
        data?.arabicSubcategory
      )?.trim();

      if (req?.files?.subCategoryImg) {
        data.subCategoryImg =
          process.env.IMAGE_BASE_URL +
          req?.files?.subCategoryImg?.[0].path.replace(/\s+/g, "");
        data.subCategoryImg = data?.subCategoryImg.replace(/\/\.\.\//g, "/");
      }
      const result = await SUBCATEGORY_MODEL.create(data);
      if (result) {
        await setResponseObject(
          req,
          true,
          "Sub category added successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Sub category not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all subcategory*/
subcategory.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let roleFilter = {};
    if (
      req.roleId == CONST.USER ||
      req.roleId == CONST.SALES ||
      req.query.active == true
    ) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    if (req.roleId == CONST.ADMIN && !req.query.categoryId) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

    let categoryFilter = {};

    if (req.roleId == CONST.ADMIN && req.query.categoryId) {
      categoryFilter = {
        categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
        stateId: { $ne: CONST.DELETED },
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        subcategory: {
          $regex: req.query.search.trim()
            ? req.query.search.trim()
            : "".replace(new RegExp("\\\\", "g"), "\\\\"),
          $options: "i",
        },
      };
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

    let list = await SUBCATEGORY_MODEL.aggregate([
      {
        $match: categoryFilter,
      },
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
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$id"] },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          as: "createdBy",
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$categoryId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
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
        "Sub category list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Sub category list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View subcategory */
subcategory.detail = async (req, res, next) => {
  try {
    const getSingle = await SUBCATEGORY_MODEL.findById({ _id: req.params.id })
      .populate({
        path: "createdBy",
        select: "_id fullName firstName lastName",
      })
      .populate({
        path: "categoryId",
        select: "_id category",
      });
    if (getSingle) {
      await setResponseObject(
        req,
        true,
        "Sub category details found",
        getSingle
      );
      next();
    } else {
      await setResponseObject(req, true, "Sub category details not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update subcategory*/
subcategory.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }

      const isExists = await SUBCATEGORY_MODEL.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        subcategory: validationData(req.body.subcategory),
        stateId: { $ne: CONST.DELETED },
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          `Sub category already exist with ${req.body.subcategory}`
        );
        next();
        return;
      }

      const data = req.body;
      data.subcategory = capitalizeLetter(data?.subcategory)?.trim();
      data.arabicSubcategory = capitalizeLetter(
        data?.arabicSubcategory
      )?.trim();
      const findsubCategory = await SUBCATEGORY_MODEL.findById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (req.files?.subCategoryImg) {
        if (findsubCategory?.subCategoryImg) {
          fs.stat(findsubCategory.subCategoryImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findsubCategory.subCategoryImg, async (err) => {
                if (err) {
                  logger.warn(`error ${err}`);
                } else {
                  logger.warn(`file was deleted`);
                }
              });
            } else if (err.code == "ENOENT") {
              logger.warn(`file doesnot exists`);
              return;
            }
          });
        }
        data.subCategoryImg =
          process.env.IMAGE_BASE_URL +
          req.files?.subCategoryImg?.[0].path.replace(/\s+/g, "");
        data.subCategoryImg = data.subCategoryImg.replace(/\/\.\.\//g, "/");
      }
      const updateData = await SUBCATEGORY_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Sub category updated successfully",
          updateData
        );
        next();
      } else {
        await setResponseObject(req, false, "Sub category not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate subcategory state*/
subcategory.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Sub category Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Sub category In-Active successfully";
        break;

      default:
    }

    let updateState = await SUBCATEGORY_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Category state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete subcategory*/
subcategory.delete = async (req, res, next) => {
  try {
    const deleteData = await SUBCATEGORY_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Sub category deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Sub category not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Subcategory by filter*/
subcategory.activeSubcategory = async (req, res, next) => {
  try {
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let filter = {};

    if (req.query.categoryId) {
      filter = {
        categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
      };
    }

    const list = await SUBCATEGORY_MODEL.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$subcategoryId"] },
                stateId: CONST.ACTIVE,
                country: country,
              },
            },
            {
              $lookup: {
                from: "products",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$company"] },
                      stateId: CONST.ACTIVE, // Ensure the product is active
                      quantity: { $gt: 0 },
                    },
                  },
                ],
                as: "products",
              },
            },
            {
              // Match only companies with at least one product
              $match: { "products.0": { $exists: true } }, // Ensures at least one product exists
            },
            {
              $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "branches",
                let: { companyId: "$_id" }, // foreign key for branches
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$companyId", "$companyId"] }, // match branches by company ID
                      stateId: CONST.ACTIVE, // filter for active branches
                    },
                  },
                ],
                as: "activeBranches", // name of the array containing active branches
              },
            },
            {
              $match: {
                $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // ensure there is at least one active branch
              },
            },
          ],
          as: "companies",
        },
      },
      {
        $unwind: {
          path: "$companies",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { companies: { $exists: true } },
      },
      {
        $group: {
          _id: "$_id", // Group by subcategory ID
          categoryId: { $first: "$categoryId" },
          subcategory: { $first: "$subcategory" },
          arabicSubcategory: { $first: "$arabicSubcategory" },
          subCategoryImg: { $first: "$subCategoryImg" },
          createdBy: { $first: "$createdBy" },
          stateId: { $first: "$stateId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          order: { $first: "$order" },
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
        "List found",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "List not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active subcategory list*/
subcategory.activeSubcategoryList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    const getSingle = await SUBCATEGORY_MODEL.aggregate([
      {
        $match: { stateId: CONST.ACTIVE }, // Match documents with active stateId
      },
      {
        $project: {
          _id: 1,
          categoryId: 1,
          subcategory: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicSubcategory", "$subcategory"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$subcategory", // If language is not 'AR', use category
            },
          },
          arabicSubcategory: 1,
          categoryImg: 1,
          createdBy: 1,
          stateId: 1,
          order: 1,
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
    ]);

    if (getSingle) {
      await setResponseObject(req, true, "Sub category list found", getSingle);
      next();
    } else {
      await setResponseObject(req, true, "Sub category list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = subcategory;
