/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
let { PROMO_CODE } = require("../model/model");
let { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { COMPANY_MODEL } = require("../../company/model/model");
const { CATEGORY_MODEL } = require("../../category/model/category.model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
let promoCode = {};

/**
 * Add promoCode
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.add = async (req, res, next) => {
  try {
    let data = req.body;

    let existPromoCode = await PROMO_CODE.findOne({
      promoCode: data.promoCode,
    });

    if (existPromoCode) {
      await setResponseObject(req, false, "This promocode is already exist");
      next();
      return;
    }

    if (data?.categoryId) {
      let findCategory = await CATEGORY_MODEL.findOne({
        _id: data?.categoryId,
      });
      let findCompany = await COMPANY_MODEL.findOne({
        categoryId: findCategory._id,
        stateId: CONST.ACTIVE,
      });
      if (!findCompany) {
        await setResponseObject(
          req,
          false,
          "No company associated with this category"
        );
        next();
        return;
      }
    }
    data.createdBy = req.userId;
    Object.keys(data).forEach((key) => {
      if (
        data[key] === "" ||
        data[key] == null ||
        data[key] == undefined ||
        data[key] == "undefined"
      ) {
        delete data[key];
      }
    });

    let isExist = await PROMO_CODE.findOne({
      $or: [
        { categoryId: data.categoryId },
        { subcategoryId: data.subcategoryId },
        { company: data.company },
      ],
    });

    if (isExist?.stateId == CONST.ACTIVE) {
      data.stateId = CONST.INACTIVE;
    } else {
      data.stateId = CONST.ACTIVE;
    }

    if (req.roleId == CONST.PROMOTION_USER) {
      let permissionsData = await PERMISSION_MODEL.findOne({
        promotionId: req.userId,
      });
      data.country = permissionsData?.country;
    }

    let createData = await PROMO_CODE.create(data);

    if (createData) {
      await setResponseObject(
        req,
        true,
        "Promotion code added successfully",
        createData
      );
      next();
    } else {
      await setResponseObject(req, false, "Promotion code not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Promocode list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        promoCode: {
          $regex: req.query.search
            ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
            : "",
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

    let roleFilter = {};

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

    let findPermission;
    let categoryFilter = [];
    if (
      req.roleId === CONST.PROMOTION_USER ||
      req.roleId === CONST.DESIGNED_USER
    ) {
      // Find the permission based on user role
      const userIdObj = new mongoose.Types.ObjectId(req.userId);
      const permissionQuery = {
        $or: [{ promotionId: userIdObj }, { designedId: userIdObj }],
      };

      findPermission = await PERMISSION_MODEL.findOne(permissionQuery);
      if (!findPermission) {
        throw new Error("Permission not found.");
      }

      categoryFilter.push({
        $match: {
          categoryId: { $in: findPermission.categoryId },
        },
      });
    }

    let list = await PROMO_CODE.aggregate([
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
        },
      },

      ...categoryFilter,

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
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
          let: { id: "$updatedBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
            {
              $project: {
                _id: 1,
                category: 1,
                categoryImg: 1,
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
            {
              $project: {
                _id: 1,
                subcategory: 1,
                subCategoryImg: 1,
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
          from: "companies",
          let: { id: "$companyId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],

          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
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
          country: { $first: "$country" },
          promoCode: { $first: "$promoCode" },
          discount: { $first: "$discount" },
          type: { $first: "$type" },
          company: { $first: "$company" },
          minPurchaseAmount: { $first: "$minPurchaseAmount" },
          maxDiscountAmount: { $first: "$maxDiscountAmount" },
          numberOfUsed: { $first: "$numberOfUsed" },
          numberOfUsedUser: { $first: "$numberOfUsedUser " },
          uesdUserCount: { $first: "$uesdUserCount " },
          forFreeDelivery: { $first: "$forFreeDelivery" },
          stateId: { $first: "$stateId" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          actionType: { $first: "$actionType" },
          cashBackType: { $first: "$cashBackType" },
          supplierShare: { $first: "$supplierShare" },
          rotationCashBack: { $first: "$rotationCashBack" },
          excludedCompany: { $first: "$excludedCompany" },
          categoryDetails: { $first: "$categoryDetails" },
          subCategoryDetails: { $first: "$subCategoryDetails" },
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

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Promotion code list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Promotion code list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * View promoCode
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.details = async (req, res, next) => {
  try {
    let details = await PROMO_CODE.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
            {
              $project: {
                _id: 1,
                category: 1,
                categoryImg: 1,
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
            {
              $project: {
                _id: 1,
                subcategory: 1,
                subCategoryImg: 1,
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
          from: "companies",
          let: { id: { $ifNull: ["$company", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] }, // Use $$id safely
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
          let: { id: "$updatedBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
          let: { id: { $ifNull: ["$productId", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] }, // Use $$id safely
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: { $ifNull: ["$excludedCompany", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] }, // Use $$id safely
              },
            },
            {
              $project: {
                _id: 1,
                company: 1,
                arabicCompany: 1,
              },
            },
          ],
          as: "excludedCompany",
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
    ]);
    if (details.length > 0) {
      await setResponseObject(
        req,
        true,
        "Promotion code details found successfully",
        details[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Promotion code not view");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Edit promoCode
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.update = async (req, res, next) => {
  try {
    let data = req.body;
    data.updatedBy = req.userId;

    let existPromoCode = await PROMO_CODE.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      promoCode: data.promoCode,
    });

    if (existPromoCode) {
      await setResponseObject(req, false, "This promocode is already exist");
      next();
      return;
    }

    Object.keys(data).forEach((key) => {
      if (
        data[key] === "" ||
        data[key] == null ||
        data[key] == undefined ||
        data[key] == "undefined"
      ) {
        delete data[key];
      }
    });

    if (req.roleId == CONST.PROMOTION_USER) {
      let permissionsData = await PERMISSION_MODEL.findOne({
        promotionId: req.userId,
      });
      data.country = permissionsData?.country;
    }

    let updateData = await PROMO_CODE.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );

    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Promotion code updated successfully",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Promotion code not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete promoCode
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.delete = async (req, res, next) => {
  try {
    let deleteData = await PROMO_CODE.findByIdAndUpdate(
      { _id: req.params.id },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(
        req,
        true,
        "Promotion code deleted successfully",
        deleteData
      );
      next();
    } else {
      await setResponseObject(req, false, "Promotion code not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * UPDATE PRODUCT STATEID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Promotion code Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Promotion code In-Active successfully";
        break;

      default:
    }

    let updateState = await PROMO_CODE.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Promotion code state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * UPDATE PRODUCT STATEID
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.actovePromoCode = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    const list = await PROMO_CODE.aggregate([
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
        "Promotion code list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Promotion code list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * APPLY PROMO CODE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
promoCode.applyPromoCode = async (req, res, next) => {
  try {
    const data = req.body;
    const todayDate = new Date();
    const findPromotion = await PROMO_CODE.findById({ _id: data.promoId });

    const findProduct = await PRODUCT_MODEL.findById({ _id: data.productId });

    const isExist = await PROMO_CODE.findOne({
      _id: data.promoId,
      uesdUserCount: { $elemMatch: { userId: req.userId } },
    });

    const matchedUser = isExist?.uesdUserCount.filter((user) =>
      user.userId.equals(req.userId)
    )[0];

    if (findPromotion.endDate > todayDate) {
      await setResponseObject(req, true, "Promotion code is expired", apply);
      next();
      return;
    } else if (
      findPromotion.type == CONST.CATEGORY &&
      findPromotion.categoryId != findProduct.categoryId
    ) {
      await setResponseObject(
        req,
        false,
        "This promotion code is not applicable for this product"
      );
      next();
      return;
    } else if (
      findPromotion.type == CONST.COMPANY &&
      findPromotion.company != findProduct.company
    ) {
      await setResponseObject(
        req,
        false,
        "This promotion code is not applicable for this product"
      );
      next();
      return;
    } else if (matchedUser.count == findPromotion.numberOfUsedUser) {
      await setResponseObject(
        req,
        false,
        "You've reached the maximum number of uses for this promotion code."
      );
      next();
      return;
    } else if (isExist.length > findPromotion.numberOfUsed) {
      await setResponseObject(
        req,
        false,
        "This promo code has reached its maximum user limit."
      );
      next();
      return;
    } else {
      let count;
      let apply;

      if (matchedUser) {
        count = matchedUser.count + 1;
        apply = await PROMO_CODE.findOneAndUpdate(
          { _id: data.promoId, "uesdUserCount.userId": req.userId },
          { "uesdUserCount.$.count": count },
          { new: true, returnOriginal: false }
        );
      } else {
        count = 1;
        apply = await PROMO_CODE.findByIdAndUpdate(
          { _id: data.promoId },
          { $push: { uesdUserCount: { userId: req.userId, count: count } } },
          { new: true }
        );
      }

      if (apply) {
        await setResponseObject(
          req,
          true,
          "Promotion code apply successfully",
          apply
        );
        next();
      } else {
        await setResponseObject(req, true, "Promotion code not apply");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = promoCode;
