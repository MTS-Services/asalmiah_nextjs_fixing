/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { COMPANY_MODEL } = require("../model/model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const {
  setResponseObject,
  generateOTP,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { CATEGORY_MODEL } = require("../../category/model/category.model");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const logger = require("winston");
const ExcelJS = require("exceljs");
const moment = require("moment");

const company = {};

const multer = require("multer");
const fs = require("fs");
const { CART } = require("../../cart/model/model");
const dir = "../uploads/company";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "logo" },
  { name: "coverImg" },
]);

/*Add company*/
company.add = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      const isExists = await COMPANY_MODEL.findOne({
        $and: [
          { company: req?.body?.company },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        // Remove the file from local storage
        if (req?.files?.logo) {
          fs.unlink(req.files.logo[0].path, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }

        if (req?.files?.coverImg) {
          fs.unlink(req.files.coverImg[0].path, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }

        await setResponseObject(
          req,
          false,
          `Company already exist with this name`
        );
        next();
        return;
      }

      if (err) {
        await setResponseObject(req, false, err);
        next();
      }

      const data = req.body;
      data.createdBy = req.userId;
      data.refNumber = generateOTP(8);

      const orderExist = await COMPANY_MODEL.findOne({
        $and: [{ order: data.order }, { stateId: { $ne: CONST.DELETED } }],
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          "Order already exist with other company"
        );
        next();
        return;
      }

      if (req?.files?.logo) {
        data.logo =
          process.env.IMAGE_BASE_URL +
          req.files?.logo?.[0].path.replace(/\s+/g, "").replace(/\\/g, "/");
        data.logo = data.logo.replace(/\/\.\.\//g, "/");
      }

      if (req?.files?.coverImg) {
        data.coverImg =
          process.env.IMAGE_BASE_URL +
          req.files?.coverImg?.[0].path.replace(/\s+/g, "").replace(/\\/g, "/");
        data.coverImg = data.coverImg.replace(/\/\.\.\//g, "/");
      }

      if (data?.deliveryCompany == "undefined") {
        data.deliveryCompany = null;
      }
      const result = await COMPANY_MODEL.create(data);
      if (result) {
        await setResponseObject(
          req,
          true,
          "Company has been successfully added. Please ensure that you also add a branch.",
          result
        );

        next();
      } else {
        await setResponseObject(req, false, "Company not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all company*/
company.list = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let roleFilter = {};
    if (req.roleId == CONST.USER || req.query.active == true) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

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
          company: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          arabicCompany: {
            $regex: searchTerm,
            $options: "i",
          },
        },
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
                  { $toString: "$countryCode" },
                  { $toString: "$mobile" },
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

    if (req.query.categoryId) {
      searchFilter = {
        categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
      };
    }

    if (req.query.country) {
      searchFilter = {
        country: req.query.country,
      };
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

      if (companies.length > 0) {
        let companyIds = companies.map((company) => company._id);

        categoryFilter = {
          _id: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    let list = await COMPANY_MODEL.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: roleFilter,
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
          let: { id: "$categoryId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
        $lookup: {
          from: "subcategories",
          let: { id: "$subcategoryId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],

          as: "subCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },

      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
        },
      },
      {
        $lookup: {
          from: "promocodes",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$company"] }, // primary key (auths)
              },
            },
          ],

          as: "promoData",
        },
      },
      {
        $addFields: {
          promoCount: { $size: "$promoData" },
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
              },
            },
          ],
          as: "productsData",
        },
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
        $match: searchFilter,
      },
      {
        $project: {
          _id: 1,
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
          perCommission: 1,
          couponService: 1,
          deliveryEligible: 1,
          pickupService: 1,
          deliveryCompany: 1,
          costDelivery: 1,
          logo: 1,
          coverImg: 1,
          createdAt: 1,
          updatedAt: 1,
          stateId: 1,
          refNumber: 1,
          isWishlist: 1,
          totalAverageRating: 1,
          promoCount: 1,
          order: 1,
          commissionType: 1,
          paymentPeriod: 1,
          countryCode: 1,
          mobile: 1,
          country: 1,
          createdBy: 1,
          updatedBy: 1,
          permission: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          refNumber: { $first: "$refNumber" },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
          promoCount: { $first: "$promoCount" },
          order: { $first: "$order" },
          paymentPeriod: { $first: "$paymentPeriod" },
          commissionType: { $first: "$commissionType" },
          countryCode: { $first: "$countryCode" },
          mobile: { $first: "$mobile" },
          country: { $first: "$country" },
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
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View company */
company.detail = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let roleFilter = {};

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    } else {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    let getSingle;

    getSingle = await COMPANY_MODEL.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $match: roleFilter,
      },
      {
        $lookup: {
          from: "deliverycompanies",
          let: { id: "$deliveryCompany" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],

          as: "deliveryCompany",
        },
      },
      {
        $unwind: {
          path: "$deliveryCompany",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$categoryId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],
          as: "categoryId",
        },
      },
      {
        $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "subcategories",
          let: { id: "$subcategoryId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],
          as: "subcategoryId",
        },
      },
      {
        $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "categories",
          let: { id: "$categoryId._id" },
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
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "subcategories",
          let: { id: "$subcategoryId._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "subCategoryDetails",
        },
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: {
              if: { $gt: [{ $size: "$wishlist" }, 0] },
              then: true,
              else: false,
            },
          },
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
          from: "products",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$company"] },
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
          ],
          as: "productsData",
        },
      },
      {
        $project: {
          _id: 1,
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
          actualCompanyName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicActualCompanyName", "$actualCompanyName"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$actualCompanyName", // Use company otherwise
            },
          },
          arabicActualCompanyName: 1,
          perCommission: 1,
          commissionType: 1,
          couponService: 1,
          deliveryEligible: 1,
          pickupService: 1,
          deliveryCompany: 1,
          costDelivery: 1,
          logo: 1,
          coverImg: 1,
          createdAt: 1,
          updatedAt: 1,
          stateId: 1,
          refNumber: 1,
          paymentPeriod: 1,
          email: 1,
          countryCode: 1,
          deliveryService: 1,
          mobile: 1,
          order: 1,
          arabicCompany: 1,
          arabicDescription: 1,
          isWishlist: 1,
          totalAverageRating: 1,
          categoryDetails: 1,
          subCategoryDetails: 1,
          deliveryCompanyChecked: 1,
          country: {
            $cond: {
              if: { $ne: ["$country", null] }, // Check if country is not null
              then: "$country", // Project country if it exists
              else: "$$REMOVE", // Remove country if it doesn't exist
            },
          },
          createdBy: 1,
          updatedBy: 1,
        },
      },
    ]);

    if (getSingle.length > 0) {
      await setResponseObject(req, true, "Company details found", getSingle[0]);
      next();
    } else {
      await setResponseObject(req, true, "Company details not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update company*/
company.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      const isExists = await COMPANY_MODEL.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        company: req?.body?.company,
        stateId: { $ne: CONST.DELETED },
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          `Company already exist with ${req?.body?.company}`
        );
        next();
        return;
      }
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }
      const data = req.body;
      data.updatedBy = req.userId;
      const orderExist = await COMPANY_MODEL.findOne({
        $and: [
          { order: data.order },
          { stateId: { $ne: CONST.DELETED } },
          { _id: { $ne: new mongoose.Types.ObjectId(req.params.id) } },
        ],
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          "Order already exist with other company"
        );
        next();
        return;
      }

      const findCompany = await COMPANY_MODEL.findById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (req.files?.logo) {
        if (findCompany?.logo) {
          fs.stat(findCompany.logo, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findCompany.logo, async (err) => {
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
        data.logo =
          process.env.IMAGE_BASE_URL +
          req.files?.logo?.[0].path.replace(/\s+/g, "").replace(/\\/g, "/");
        data.logo = data.logo.replace(/\/\.\.\//g, "/");
      }

      if (req?.files?.coverImg) {
        if (findCompany?.coverImg) {
          fs.stat(findCompany.coverImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findCompany.coverImg, async (err) => {
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
        data.coverImg =
          process.env.IMAGE_BASE_URL +
          req.files?.coverImg?.[0].path.replace(/\s+/g, "").replace(/\\/g, "/");
        data.coverImg = data.coverImg.replace(/\/\.\.\//g, "/");
      }

      if (data?.deliveryCompany == "undefined") {
        data.deliveryCompany = null;
      }
      if (
        data?.deliveryService == "null" ||
        data?.deliveryCompany == "undefined" ||
        data?.deliveryService == ""
      ) {
        data.deliveryService = false;
      }

      const updateData = await COMPANY_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Company updated successfully",
          updateData
        );
        next();
      } else {
        await setResponseObject(req, false, "Company not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate company state*/
company.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;
    let findCompany = await COMPANY_MODEL.findOne({ _id: req.params.id });

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Company Active successfully";

        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Company In-Active successfully";
        let findCarts = await CART.find({ companyId: findCompany._id });
        findCarts.map(async (e) => {
          await CART.findByIdAndDelete({ _id: e._id });
        });
        break;

      default:
    }

    let updateState = await COMPANY_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Company state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete company*/
company.delete = async (req, res, next) => {
  try {
    const deleteData = await COMPANY_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Company deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Company not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all company by filter*/
company.companyFilter = async (req, res, next) => {
  try {
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 5;

    let filter = {};

    let subcategoryfilter = {};

    if (req.query.categoryId && req.query.subcategoryId) {
      subcategoryfilter = {
        $and: [
          { categoryId: new mongoose.Types.ObjectId(req.query.categoryId) },
          {
            subcategoryId: new mongoose.Types.ObjectId(req.query.subcategoryId),
          },
        ],
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          company: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          arabicCompany: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
      ];
    }

    let companyFilter;
    companyFilter = await COMPANY_MODEL.aggregate([
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
          $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // Ensure there is at least one active branch
          stateId: CONST.ACTIVE, // Filter active companies
          country: country, // Filter by country
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
        $match: searchFilter,
      },
      {
        $match: filter,
      },
      {
        $match: subcategoryfilter,
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
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
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          arabicCompany: { $first: "$arabicCompany" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          order: { $first: "$order" },
          stateId: { $first: "$stateId" },
          refNumber: { $first: "$refNumber" },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
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

    if (companyFilter && companyFilter[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Company list found successfully",
        companyFilter[0].data,
        companyFilter[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all company by category*/
company.companyByCategory = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 4;

    let filter = {};
    if (req.query.category) {
      filter = {
        categoryId: new mongoose.Types.ObjectId(req.query.category),
      };
    }

    let subcategoryfilter = {};

    if (req.query.categoryId && req.query.subcategoryId) {
      subcategoryfilter = {
        $and: [
          { categoryId: new mongoose.Types.ObjectId(req.query.categoryId) },
          {
            subcategoryId: new mongoose.Types.ObjectId(req.query.subcategoryId),
          },
        ],
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          company: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          arabicCompany: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
      ];
    }

    const products = await COMPANY_MODEL.aggregate([
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
          $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // Ensure there is at least one active branch
          stateId: CONST.ACTIVE, // Filter active companies
          country: country, // Filter by country
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
        $match: filter,
      },
      {
        $match: subcategoryfilter,
      },
      {
        $match: searchFilter,
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
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
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
          createdAt: { $first: "$createdAt" },
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
    if (products && products[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Company list found successfully",
        products[0].data,
        products[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active company list*/
company.activeCompanyList = async (req, res, next) => {
  try {
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      // Function to escape special regex characters
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
      );

      searchFilter.$or = [
        {
          company: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          actualCompanyName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let activeCompanyList;

    activeCompanyList = await COMPANY_MODEL.aggregate([
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
          stateId: CONST.ACTIVE, // Filter active companies
          country: country, // Filter by country
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
        $match: { "products.0": { $exists: true } },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          arabicCompany: { $first: "$arabicCompany" },
          createdAt: { $first: "$createdAt" },
          order: { $first: "$order" },
        },
      },
      {
        $match: searchFilter,
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

    if (activeCompanyList.length > 0) {
      await setResponseObject(
        req,
        true,
        "Company list found",
        activeCompanyList
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all company by filter*/
company.couponCompany = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let list = await COMPANY_MODEL.aggregate([
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
          $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // Ensure there is at least one active branch
          stateId: CONST.ACTIVE, // Filter active companies
          country: country, // Filter by country
          couponService: true,
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
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },

      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
        },
      },
      {
        $addFields: {
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          order: { $first: "$order" },
          refNumber: { $first: "$refNumber" },
          count: { $sum: { $ifNull: ["$products.orderCount", 0] } },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
        },
      },
      {
        $addFields: {
          sortKey: {
            $cond: {
              if: { $gt: ["$order", 0] }, // Check if 'order' exists and is greater than 0
              then: { $toInt: { $ifNull: ["$order", 0] } }, // Convert to integer safely
              else: Number.MAX_SAFE_INTEGER, // Assign  a high value for sorting purposes
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
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**Download Inactive product Report*/
company.downloadCompanyReport = async (req, res, next) => {
  try {
    let todayDate = new Date();

    const start = req.query.startDate; // e.g., '2024-10-20'
    const end = req.query.endDate; // e.g., '2024-10-30'

    const type = req.query.type;
    let findPromo;
    let excelPath;

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

      if (companies.length > 0) {
        let companyIds = companies.map((company) => company._id);

        categoryFilter = {
          _id: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    if (type == 2) {
      excelPath = `../uploads/invoice/inactiveProductReport-${generateOTP(
        6
      )}.xlsx`;
      findPromo = await PRODUCT_MODEL.aggregate([
        {
          $match: categoryFilter,
        },
        {
          $match: {
            $and: [
              { stateId: { $eq: CONST.INACTIVE } },
              {
                $expr: {
                  $and: [
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                          },
                        },
                        start,
                      ],
                    },
                    {
                      $lte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                          },
                        },
                        end,
                      ],
                    },
                  ],
                },
              },
            ],
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
                $lookup: {
                  from: "users",
                  let: { id: "$_id" }, // foreign key
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$$id", "$company"] }, // primary key (auths)
                        stateId: { $ne: CONST.DELETED },
                      },
                    },
                  ],

                  as: "usersDetails",
                },
              },
              {
                $unwind: {
                  path: "$usersDetails",
                  preserveNullAndEmptyArrays: true,
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
        {
          $lookup: {
            from: "categories",
            let: { id: "$companyDetails.categoryId" }, // foreign key
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                },
              },
            ],

            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      if (findPromo.length > 0) {
        async function generateExcel(findPromo) {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Order Details");

          // Prepare the data for the Excel file
          const data = [
            [
              "Company Name",
              "Contact Person Name",
              "Contact Person Number",
              "Category",
              "End Date",
              "Delivery Cost",
              "Pickup Cost",
            ],
          ];

          // Assuming findPromo is an array of objects
          findPromo?.forEach((promo) => {
            data.push([
              promo.companyDetails?.company,
              promo.companyDetails?.usersDetails?.fullName
                ? promo.companyDetails?.usersDetails?.fullName
                : "-",
              promo.companyDetails?.usersDetails?.countryCode +
              promo.companyDetails?.usersDetails?.mobile
                ? promo.companyDetails?.usersDetails?.countryCode +
                  promo.companyDetails?.usersDetails?.mobile
                : "-",
              promo.categoryDetails.category,
              moment.utc(promo?.endDate).format("DD/MM/YYYY"),
              promo?.deliveryCost ? promo.deliveryCost : "-",
              promo?.pickupCost ? promo.pickupCost : "-",
            ]);
          });

          // Add rows to the worksheet
          data.forEach((row) => {
            worksheet.addRow(row);
          });
          data[0].forEach((_, index) => {
            const maxLength = data.reduce(
              (max, row) =>
                Math.max(max, row[index] ? row[index].toString().length : 0),
              0
            );
            worksheet.getColumn(index + 1).width = maxLength + 2; // Adding some padding
          });

          await workbook.xlsx.writeFile(excelPath);

          return excelPath;
        }

        const excelsPath = await generateExcel(findPromo);
        let excelUrl = `${process.env.IMAGE_BASE_URL}${excelsPath}`; // Example URL format
        excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
        await setResponseObject(
          req,
          true,
          "Report download successfully",
          excelUrl
        );
        next();
      } else {
        await setResponseObject(req, true, "No inactive product");
        next();
      }
    } else {
      excelPath = `../uploads/invoice/generalreport-${generateOTP(6)}.xlsx`;
      findPromo = await PRODUCT_MODEL.aggregate([
        {
          $match: categoryFilter,
        },
        {
          $match: {
            $and: [
              { stateId: { $ne: CONST.DELETED } },
              {
                $or: [
                  {
                    $expr: {
                      $or: [
                        {
                          $gte: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                              },
                            },
                            start,
                          ],
                        },
                        {
                          $lte: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                              },
                            },
                            end,
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
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
                $lookup: {
                  from: "promocodes",
                  let: { id: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$$id", "$company"] },
                      },
                    },
                  ],
                  as: "promoDetails",
                },
              },
              {
                $addFields: {
                  promoCount: {
                    $size: "$promoDetails",
                  },
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
        {
          $lookup: {
            from: "categories",
            let: { id: "$companyDetails.categoryId" }, // foreign key
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                },
              },
            ],

            as: "categoryDetails",
          },
        },
        {
          $unwind: {
            path: "$categoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      if (findPromo.length > 0) {
        async function generateExcel(findPromo) {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Order Details");

          // Prepare the data for the Excel file
          const data = [
            [
              "Company Name",
              "Contact Person Number",
              "Enabled",
              "Category",
              "Item Name",
              "Item Code",
              "Offer (%)",
              "Price",
              "Offer Price",
              "Quantity",
              "Start Date",
              "End Date",
              "Delivery Cost",
              "Pickup Cost",
            ],
          ];

          // Assuming findPromo is an array of objects
          findPromo?.forEach((promo) => {
            data.push([
              promo.companyDetails.company,
              promo.companyDetails.countryCode + promo.companyDetails.mobile,
              true,
              promo?.categoryDetails.category,
              promo?.productName,
              promo?.productCode ? promo.productCode : "",
              promo?.discount ? promo.discount : 0,
              promo?.price ? promo?.price : promo?.size[0]?.price,
              promo?.price
                ? promo.price - promo?.price * (promo?.discount / 100)
                : promo?.size[0]?.price -
                  promo.size[0]?.price * (promo?.discount / 100),
              promo?.quantity ? promo?.quantity : 0,
              moment.utc(promo.startDate).format("DD/MM/YYYY"),
              moment.utc(promo.endDate).format("DD/MM/YYYY"),
              promo?.deliveryCost ? promo.deliveryCost : "-",
              promo?.pickupCost ? promo.pickupCost : "-",
            ]);
          });

          // Add rows to the worksheet
          data.forEach((row) => {
            worksheet.addRow(row);
          });
          data[0].forEach((_, index) => {
            const maxLength = data.reduce(
              (max, row) =>
                Math.max(max, row[index] ? row[index].toString().length : 0),
              0
            );
            worksheet.getColumn(index + 1).width = maxLength + 2; // Adding some padding
          });

          await workbook.xlsx.writeFile(excelPath);

          return excelPath;
        }

        const excelsPath = await generateExcel(findPromo);
        let excelUrl = `${process.env.IMAGE_BASE_URL}${excelsPath}`; // Example URL format
        excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
        await setResponseObject(
          req,
          true,
          "Report download successfully",
          excelUrl
        );
        next();
      } else {
        await setResponseObject(req, true, "No product in this company");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all company by category*/
company.allCompany = async (req, res, next) => {
  try {
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";
    let list;
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
      );

      searchFilter.$or = [
        {
          company: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          arabicCompany: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    list = await COMPANY_MODEL.aggregate([
      {
        $lookup: {
          from: "branches",
          let: { companyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$companyId", "$companyId"] },
                stateId: CONST.ACTIVE,
              },
            },
          ],
          as: "activeBranches",
        },
      },
      {
        $match: {
          $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // Ensure there is at least one active branch
          stateId: CONST.ACTIVE, // Filter active companies
          country: country, // Filter by country
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
                stateId: CONST.ACTIVE,
                quantity: { $gt: 0 },
              },
            },
          ],
          as: "products",
        },
      },
      {
        $match: { "products.0": { $exists: true } },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        $match: searchFilter,
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          arabicCompany: { $first: "$arabicCompany" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          order: { $first: "$order" },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
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
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all company by offer*/
company.companyByOffer = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        company: {
          $regex: req.query.search
            ? req.query.search
            : "".replace(new RegExp("\\\\", "g"), "\\\\"),
          $options: "i",
        },
      };
    }

    const list = await COMPANY_MODEL.aggregate([
      {
        $match: {
          country: country,
        },
      },
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $match: searchFilter,
      },
      {
        $lookup: {
          from: "offers",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$company"] },
                stateId: CONST.ACTIVE, // Ensure the product is active
              },
            },
          ],
          as: "offerDetails",
        },
      },
      {
        $unwind: { path: "$offerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $match: { offerDetails: { $exists: true } },
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
        $match: { "products.0": { $exists: true } },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
        },
      },
      {
        $addFields: {
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          order: { $first: "$order" },
          updatedAt: { $first: "$updatedAt" },
          stateId: { $first: "$stateId" },
          refNumber: { $first: "$refNumber" },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
          offerDetails: { $first: "$offerDetails" },
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
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get dropdown compny for add offer*/
company.dropDownCompany = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
      );

      searchFilter.$or = [
        {
          company: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          arabicCompany: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let countryFilter = {};
    if (req?.query?.country) {
      countryFilter = {
        country: req.query.country,
      };
    }

    let categoryFilter = {};
    if (req?.query?.categoryId) {
      categoryFilter = {
        categoryId: new mongoose.Types.ObjectId(req?.query?.categoryId),
      };
    }

    let companyFilter = {};

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

      if (companies.length > 0) {
        let companyIds = companies.map((company) => company._id);

        companyFilter = {
          _id: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }
    const list = await COMPANY_MODEL.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: searchFilter,
      },
      {
        $match: countryFilter,
      },
      {
        $match: categoryFilter,
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
        $match: { "products.0": { $exists: true } },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          arabicCompany: { $first: "$arabicCompany" },
          createdAt: { $first: "$createdAt" },
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
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all electric company*/
company.electricCompany = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let categoryData = await CATEGORY_MODEL.findOne({
      category: req.query.electricCategory,
    });

    if (!categoryData) {
      await setResponseObject(req, true, "", []);
      next();
      return;
    }

    let list = await COMPANY_MODEL.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(categoryData._id),
        },
      },
      {
        $match: {
          stateId: CONST.ACTIVE,
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
        $match: { "products.0": { $exists: true } },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
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
              },
            },
            {
              $lookup: {
                from: "reviews",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$productId"] },
                    },
                  },
                  {
                    $group: {
                      _id: "$productId",
                      averageRating: { $avg: "$rating" },
                    },
                  },
                ],
                as: "averageRating",
              },
            },
            {
              $unwind: {
                path: "$averageRating",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "productsData",
        },
      },
      {
        $addFields: {
          averageRating: {
            $sum: {
              $map: {
                input: "$productsData",
                as: "product",
                in: { $ifNull: ["$$product.averageRating.averageRating", 0] },
              },
            },
          },
          productCount: {
            $size: {
              $filter: {
                input: "$productsData",
                as: "product",
                cond: { $gt: ["$$product.averageRating.averageRating", 0] }, // Count only products with ratings
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalAverageRating: {
            $cond: {
              if: { $gt: ["$productCount", 0] },
              then: { $divide: ["$averageRating", "$productCount"] },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          stateId: { $first: "$stateId" },
          refNumber: { $first: "$refNumber" },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
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

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all electric company*/
company.popularToday = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to start of the day
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set to end of the day

    let list = await COMPANY_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
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
                stateId: CONST.ACTIVE,
                quantity: { $gt: 0 },
              },
            },
            {
              $lookup: {
                from: "orders",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $in: ["$$productId", "$products.items"] },
                      createdAt: { $gte: startOfToday, $lte: endOfToday },
                    },
                  },
                ],
                as: "orderCounts",
              },
            },
            {
              $addFields: {
                orderCount: { $size: { $ifNull: ["$orderCounts", []] } },
              },
            },
          ],
          as: "products",
        },
      },
      {
        // Unwind products to flatten the structure
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        // Match only companies that have products with orders
        $match: {
          "products.orderCount": { $gt: 0 }, // Only keep companies with at least one order
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },

      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
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
              },
            },
            {
              $lookup: {
                from: "reviews",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$productId"] },
                    },
                  },
                  {
                    $group: {
                      _id: "$productId",
                      averageRating: { $avg: "$rating" },
                    },
                  },
                ],
                as: "averageRating",
              },
            },
            {
              $unwind: {
                path: "$averageRating",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "productsData",
        },
      },
      {
        $addFields: {
          averageRating: {
            $sum: {
              $map: {
                input: "$productsData",
                as: "product",
                in: { $ifNull: ["$$product.averageRating.averageRating", 0] },
              },
            },
          },
          productCount: {
            $size: {
              $filter: {
                input: "$productsData",
                as: "product",
                cond: { $gt: ["$$product.averageRating.averageRating", 0] }, // Count only products with ratings
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalAverageRating: {
            $cond: {
              if: { $gt: ["$productCount", 0] },
              then: { $divide: ["$averageRating", "$productCount"] },
              else: 0,
            },
          },
        },
      },
      {
        $addFields: {
          company: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$company", // Use company otherwise
            },
          },
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicDescription if language is Arabic
              else: "$description", // Use description otherwise
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          stateId: { $first: "$stateId" },
          refNumber: { $first: "$refNumber" },
          count: { $sum: { $ifNull: ["$products.orderCount", 0] } },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
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

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all electric company*/
company.newArrival = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let list = await COMPANY_MODEL.aggregate([
      {
        $match: {
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
                stateId: CONST.ACTIVE,
                quantity: { $gt: 0 },
              },
            },
            {
              $lookup: {
                from: "orders",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $in: ["$$productId", "$products.items"] },
                      createdAt: { $gte: startOfToday, $lte: endOfToday },
                    },
                  },
                ],
                as: "orderCounts",
              },
            },
            {
              $addFields: {
                orderCount: { $size: { $ifNull: ["$orderCounts", []] } },
              },
            },
          ],
          as: "products",
        },
      },
      {
        $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$companyId"] },
                createdBy: new mongoose.Types.ObjectId(req.userId),
                isWishlist: true,
              },
            },
          ],
          as: "wishlist",
        },
      },

      {
        $addFields: {
          isWishlist: {
            $cond: { if: { $size: "$wishlist" }, then: true, else: false },
          },
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
              },
            },
            {
              $lookup: {
                from: "reviews",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$productId"] },
                    },
                  },
                  {
                    $group: {
                      _id: "$productId",
                      averageRating: { $avg: "$rating" },
                    },
                  },
                ],
                as: "averageRating",
              },
            },
            {
              $unwind: {
                path: "$averageRating",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "productsData",
        },
      },
      {
        $addFields: {
          averageRating: {
            $sum: {
              $map: {
                input: "$productsData",
                as: "product",
                in: { $ifNull: ["$$product.averageRating.averageRating", 0] },
              },
            },
          },
          productCount: {
            $size: {
              $filter: {
                input: "$productsData",
                as: "product",
                cond: { $gt: ["$$product.averageRating.averageRating", 0] }, // Count only products with ratings
              },
            },
          },
        },
      },
      {
        $addFields: {
          totalAverageRating: {
            $cond: {
              if: { $gt: ["$productCount", 0] },
              then: { $divide: ["$averageRating", "$productCount"] },
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          description: { $first: "$description" },
          perCommission: { $first: "$perCommission" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          stateId: { $first: "$stateId" },
          refNumber: { $first: "$refNumber" },
          count: { $sum: { $ifNull: ["$products.orderCount", 0] } },
          isWishlist: { $first: "$isWishlist" },
          totalAverageRating: { $first: "$totalAverageRating" },
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
        "Company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = company;
