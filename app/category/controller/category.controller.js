/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CATEGORY_MODEL } = require("../model/category.model");
const {
  setResponseObject,
  validationData,
  capitalizeLetter,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const logger = require("winston");
const category = {};

const multer = require("multer");
const fs = require("fs");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const dir = "../uploads/category";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "categoryImg" }]);

/*Add category*/
category.add = async (req, res, next) => {
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

      const isExists = await CATEGORY_MODEL.findOne({
        $and: [
          { category: validationData(req?.body?.category) },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        // Remove the file from local storage
        if (req?.files?.categoryImg) {
          fs.unlink(req.files.categoryImg[0].path, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
        await setResponseObject(
          req,
          false,
          `Category already exist with ${req?.body?.category}`
        );
        next();
        return;
      }

      const data = req.body;

      data.createdBy = req.userId;
      data.category = capitalizeLetter(data?.category)?.trim();
      data.arabicCategory = capitalizeLetter(data?.arabicCategory)?.trim();

      // if (data.order) {
      //   const orderExist = await CATEGORY_MODEL.findOne({
      //     $and: [{ order: data?.order }, { stateId: { $ne: CONST.DELETED } }],
      //   });

      //   if (orderExist) {
      //     await setResponseObject(
      //       req,
      //       false,
      //       "Order already exist with other category"
      //     );
      //     next();
      //     return;
      //   }
      // }

      if (req?.files?.categoryImg) {
        data.categoryImg =
          process.env.IMAGE_BASE_URL +
          "uploads/category/" +
          req.files?.categoryImg?.[0].filename;
      }
      const result = await CATEGORY_MODEL.create(data);
      if (result) {
        await setResponseObject(
          req,
          true,
          "Category added successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Category not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all category*/
category.list = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let roleFilter = {};

    if (req.roleId == CONST.USER || req.roleId == CONST.SALES) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

    if (!req.roleId) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        category: {
          $regex: req.query.search.trim()
            ? req.query.search.trim()
            : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
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

    let permissionsData = await PERMISSION_MODEL.findOne({
      $or: [{ promotionId: req.userId }, { designedId: req.userId }],
    });

    let categoryFilter = {};
    if (permissionsData?.categoryId) {
      categoryFilter = {
        _id: {
          $in: permissionsData.categoryId.map(
            (i) => new mongoose.Types.ObjectId(i)
          ),
        },
      };
    }

    let list = await CATEGORY_MODEL.aggregate([
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
        $match: categoryFilter,
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
                roleId:1
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
                roleId:1

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
          arabicCategory: 1,
          categoryImg: 1,
          order: 1,
          stateId: 1,
          createdAt: 1,
          createdBy: 1,
          updatedBy: 1,
        },
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
        "Category list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Category list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View category */
category.detail = async (req, res, next) => {
  try {
    const getSingle = await CATEGORY_MODEL.findById({ _id: req.params.id });
    if (getSingle) {
      await setResponseObject(req, true, "Category details found", getSingle);
      next();
    } else {
      await setResponseObject(req, true, "Category details not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update category*/
category.update = async (req, res, next) => {
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

      const isExists = await CATEGORY_MODEL.findOne({
        $and: [
          { _id: { $ne: new mongoose.Types.ObjectId(req.params.id) } },
          { category: validationData(req?.body?.category) },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          `Category already exist with ${req.body.category}`
        );
        next();
        return;
      }

      const data = req.body;
      data.updatedBy = req.userId;
      data.category = capitalizeLetter(data?.category)?.trim();
      data.arabicCategory = capitalizeLetter(data?.arabicCategory)?.trim();
      // if (data.order) {
      //   const orderExist = await CATEGORY_MODEL.findOne({
      //     $and: [
      //       { order: data?.order },
      //       { stateId: { $ne: CONST.DELETED } },
      //       { _id: { $ne: new mongoose.Types.ObjectId(req.params.id) } },
      //     ],
      //   });

      //   if (orderExist) {
      //     await setResponseObject(
      //       req,
      //       false,
      //       "Order already exist with other category"
      //     );
      //     next();
      //     return;
      //   }
      // }

      const findCategory = await CATEGORY_MODEL.findById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (req.files?.categoryImg) {
        if (findCategory?.categoryImg) {
          fs.stat(findCategory.categoryImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findCategory.categoryImg, async (err) => {
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
        data.categoryImg =
          process.env.IMAGE_BASE_URL +
          "uploads/category/" +
          req.files?.categoryImg?.[0].filename;
      }
      const updateData = await CATEGORY_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Category updated successfully",
          updateData
        );
        next();
      } else {
        await setResponseObject(req, false, "Category not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate category state*/
category.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Category Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Category In-Active successfully";
        break;

      default:
    }

    let updateState = await CATEGORY_MODEL.findByIdAndUpdate(
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

/*Delete category*/
category.delete = async (req, res, next) => {
  try {
    const deleteData = await CATEGORY_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Category deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Category not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active category list*/
category.activeCategoryList = async (req, res, next) => {
  try {
    // const getSingle = await CATEGORY_MODEL.find({ stateId: CONST.ACTIVE }).sort(
    //   { order: 1 }
    // );
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    const getSingle = await CATEGORY_MODEL.aggregate([
      {
        $match: { stateId: CONST.ACTIVE }, // Match documents with active stateId
      },
      {
        $lookup: {
          from: "subcategories",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$categoryId"] },
              },
            },
          ],
          as: "subcategories",
        },
      },
      {
        $unwind: {
          path: "$subcategories",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { subcategories: { $exists: true } },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$categoryId"] },
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
        $project: {
          _id: 1,
          category: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicCategory", "$category"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$category", // If language is not 'AR', use category
            },
          },
          arabicCategory: 1,
          categoryImg: 1,
          createdBy: 1,
          stateId: 1,
          subcategoryId: "$subcategories._id",
          subcategoryName: "$subcategories.subcategory",
          companyId: "$companies._id",
          company: "$companies.company",
          order: 1,
        },
      },
      {
        $group: {
          _id: "$_id", // Group by category ID
          category: { $first: "$category" },
          arabicCategory: { $first: "$arabicCategory" },
          categoryImg: { $first: "$categoryImg" },
          createdBy: { $first: "$createdBy" },
          stateId: { $first: "$stateId" },
          // subcategories: {
          //   $push: { id: "$subcategoryId", name: "$subcategoryName" },
          // },
          // companies: {
          //   $push: { id: "$companyId", name: "$company" },
          // },
          order: { $first: "$order" },
        },
      },
      {
        $sort: { order: 1 }, // Sort by the new orderValue field
      },
    ]);

    if (getSingle.length > 0) {
      await setResponseObject(req, true, "Category list found", getSingle);
      next();
    } else {
      await setResponseObject(req, true, "Category list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = category;
