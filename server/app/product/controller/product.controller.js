/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { PRODUCT_MODEL } = require("../model/product.model");
const { CONST } = require("../../../helpers/constant");
const { USER } = require("../../userService/model/userModel");
const { COMPANY_MODEL } = require("../../company/model/model");
const { CALSSIFICATION } = require("../../classification/model/model");

const {
  setResponseObject,
  generateOTP,
} = require("../../../middleware/commonFunction");
const csvtojson = require("csvtojson");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const path = require("path");
const xlsx = require("xlsx");

const dir = "../uploads/productImg";
const fs = require("fs");
const multer = require("multer");
const { REVIEW } = require("../../review/model/review.model");
const { NOTIFICATION } = require("../../notification/model/notification.model");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const ExcelJS = require("exceljs");
const { CART } = require("../../cart/model/model");
const { PERMISSION_MODEL } = require("../../permission/model/model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const filePath = file.originalname;
    const fileExtension = path.extname(filePath).toLowerCase();
    cb(null, new Date().getTime().toString() + fileExtension);
  },
});

const upload = multer({
  storage: storage,
}).fields([{ name: "productImg" }, { name: "csvFile" }]);

const product = {};

/**
 * ADD PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.add = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      !fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    const isExist = await PRODUCT_MODEL.findOne({
      productName: req?.body?.productName,
      productCode: req?.body?.productCode,
      serialCode: req?.body?.serialCode,
      createdBy: req.userId,
      stateId: { $ne: CONST.DELETED },
    });
    if (isExist) {
      await setResponseObject(req, false, "Product already exist");
      next();
      return;
    }

    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      } else {
        const data = req.body;
        data.createdBy = req.userId;

        if (req.roleId == CONST.SALES) {
          const findUser = await USER.findById({ _id: req.userId });
          const findCompany = await COMPANY_MODEL.findById({
            _id: findUser?.company,
          });
          data.company = findCompany?._id;
        }

        if (req?.files?.productImg) {
          const arr = [];
          req.files.productImg.map((e) => {
            let url = process.env.IMAGE_BASE_URL + e.path.replace(/\s+/g, "");
            let type = e.mimetype;
            url = url.replace(/\/\.\.\//g, "/");
            arr.push({
              url: url,
              type: type,
            });
            const img = arr;
            data.productImg = img;
          });
        }
        if (data.longitude && data.latitude) {
          data.location = {
            type: "Point",
            coordinates: [data.longitude, data.latitude],
          };
        }

        if (data?.size?.length > 0 && data?.size[0].sizes !== "") {
          const requestBodySize = req.body.size;

          if (requestBodySize.length > 0) {
            const hasDuplicateSizes = (array) => {
              const sizeSet = new Set();
              for (const obj of array) {
                if (sizeSet.has(obj.sizes)) {
                  return true;
                }
                sizeSet.add(obj.sizes);
              }
              return false;
            };

            if (hasDuplicateSizes(requestBodySize)) {
              await setResponseObject(
                req,
                false,
                "You can't add same size multiple times"
              );
              next();
              return;
            }
          }
        }

        if (data?.size?.sizes == "undefined") {
          data.size.sizes = "";
        }

        if (data?.price != "" && data?.mrpPrice != "") {
          data.size = [];
        }

        if (data.price == "" && data.mrpPrice == "") {
          if (!data.size || !Array.isArray(data.size)) {
            data.size = data.size ? [data.size] : [];
          }
        }

        if (!data.color || !Array.isArray(data.color)) {
          data.color = data.color ? [data.color] : [];
        }

        if (req.roleId == CONST.ADMIN) {
          data.stateId = CONST.ACTIVE;
        }

        if (data.couponValidity) {
          data.couponValidity = parseDate(data?.couponValidity);
        }
        data.startDate = parseDate(data?.startDate);
        data.endDate = parseDate(data?.endDate);

        function parseDate(dateStr) {
          let parts = dateStr?.split("-");
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Rearrange to 'YYYY-MM-DD'
        }

        if (
          data.isDelivered &&
          (data.isDelivered == "" ||
            data.isDelivered == "undefined" ||
            data.isDelivered == "null")
        ) {
          data.isDelivered = true;
        }

        const addProduct = await PRODUCT_MODEL.create(data);

        if (addProduct) {
          if (addProduct.stateId == CONST.ACTIVE && addProduct.discount > 50) {
            const findUser = await USER.find({ stateId: CONST.ACTIVE });

            findUser.map(async (e) => {
              // PUSH NOTIFICATION TO USER
              if (e.deviceToken) {
                await sendNotification(
                  findUser?.deviceToken,
                  findUser?.language && findUser?.language == "AR"
                    ? "عرض حصري!"
                    : "Exclusive Offer!",
                  findUser?.language && findUser?.language == "AR"
                    ? `افتح عرضًا خاصًا على ${addProduct.productName}!`
                    : `Unlock a special deal on ${addProduct.productName}!`,
                  `${JSON.stringify(addProduct)}`,
                  CONST.PRODUCT
                );
              }
              var userNotificationBody = {
                to: e.createdBy,
                title: "Exclusive Offer!",
                description: `Unlock a special deal on ${addProduct.productName}!`,
                arabicTitle: "عرض حصري!",
                arabicDescription: `افتح عرضًا خاصًا على ${addProduct.productName}!`,
                notificationType: CONST.PRODUCT,
              };

              let notificationBody = await NOTIFICATION.create(
                userNotificationBody
              );
            });
          }
          await setResponseObject(
            req,
            true,
            "Product added successfully",
            addProduct
          );
          next();
        } else {
          await setResponseObject(req, false, "Product not added");
          next();
        }
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * EDIT PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      !fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    const isExist = await PRODUCT_MODEL.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { productName: req?.body?.productName },
        { productCode: req?.body?.productCode },
        { serialCode: req?.body?.serialCode },
        { stateId: { $ne: CONST.DELETED } },
      ],
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "Product already exist with this name"
      );
      next();
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      } else {
        const data = req.body;
        data.updatedBy = req.userId;
        if (
          data.isDelivered === undefined ||
          data.isDelivered === null ||
          data.isDelivered === ""
        ) {
          data.isDelivered = true;
        }

        if (data.couponValidity) {
          data.couponValidity = parseDate(data?.couponValidity);
        }
        data.startDate = parseDate(data.startDate);
        data.endDate = parseDate(data.endDate);

        function parseDate(dateStr) {
          if (dateStr?.includes("T")) {
            return dateStr;
          }
          let parts = dateStr?.split("-");
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // Rearrange to 'YYYY-MM-DD'
        }

        if (req?.files?.productImg) {
          const findproduct = await PRODUCT_MODEL.findById({
            _id: req.params.id,
          });

          const previousImages = findproduct.productImg;
          const arr = [];
          req.files.productImg.map(async (e) => {
            let url = process.env.IMAGE_BASE_URL + e.path.replace(/\s+/g, "");
            let type = e.mimetype;
            url = url.replace(/\/\.\.\//g, "/");
            arr.push({
              url: url,
              type: type,
            });
          });

          data.productImg = [...previousImages, ...arr];
        }

        if (data.longitude && data.latitude) {
          data.location = {
            type: "Point",
            coordinates: [data.longitude, data.latitude],
          };
        }

        if (data?.size?.length > 0 && data?.size[0].sizes !== "") {
          const requestBodySize = req.body.size;

          if (requestBodySize.length > 0) {
            const hasDuplicateSizes = (array) => {
              const sizeSet = new Set();
              for (const obj of array) {
                if (sizeSet.has(obj.sizes)) {
                  return true;
                }
                sizeSet.add(obj.sizes);
              }
              return false;
            };

            if (hasDuplicateSizes(requestBodySize)) {
              await setResponseObject(
                req,
                false,
                "You can't add same size multiple times"
              );
              next();
              return;
            }
          }
        }

        if (data?.size?.sizes == "undefined") {
          data.size.sizes = "";
        }

        if (data.price != "" && data.mrpPrice != "") {
          data.size = [];
        }

        if (data?.price == "" && data?.mrpPrice == "") {
          if (!data.size || !Array.isArray(data.size)) {
            data.size = data.size ? [data.size] : [];
          }
        }

        if (!data.color || !Array.isArray(data.color)) {
          data.color = data.color ? [data.color] : [];
        }

        const now = new Date();
        const formattedDate = now.toISOString().replace("Z", "+00:00");
        if (data.endDate < formattedDate) {
          await setResponseObject(
            req,
            false,
            "The end date cannot be in the past. Please select a valid end date."
          );
          next();
          return;
        }

        if (data.couponValidity < formattedDate) {
          await setResponseObject(
            req,
            false,
            "The coupon validity cannot be in the past. Please select a valid coupon validity."
          );
          next();
          return;
        }

        if (req.roleId == CONST.ADMIN) {
          data.stateId = CONST.ACTIVE;
        } else {
          data.stateId = CONST.PENDING;
        }

        const updateProduct = await PRODUCT_MODEL.findByIdAndUpdate(
          { _id: req.params.id },
          data,
          { new: true }
        );
        if (updateProduct) {
          let findCart = await CART.find({ productId: req.params.id });
          for (let e of findCart) {
            if (e?.size && e?.size != "") {
              let size = updateProduct.size;
              let result = size.find((item) => item.sizes == e?.size);
              updateProduct.price = result?.price;
              updateProduct.discount = result?.discount;
            }
            const price = e.quantity * updateProduct.price;
            let payload = {
              purchase_Price: price,
              product_cost: updateProduct.price,
              productPrice: updateProduct.price,
              mrp: updateProduct.mrp,
              discount: updateProduct.discount,
            };
            let updateCartPrice = await CART.findOneAndUpdate(
              { _id: e._id },
              payload,
              { new: true }
            );
          }
          await setResponseObject(
            req,
            true,
            "Product updated successfully",
            updateProduct
          );
          next();
        } else {
          await setResponseObject(req, false, "Product not updated");
          next();
        }
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ALL PRODUCT LIST FOR VENDER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.list = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let filter = {};
    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "1":
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      case "5":
        filter = {
          stateId: CONST.PENDING,
        };
        break;

      default:
        break;
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          productName: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
        {
          productArabicName: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
        {
          productCode: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
        {
          "categoryDetails.category": {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
        {
          "subCategoryDetails.subcategory": {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
      ];
    }

    const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
    const findUser = await USER.findById({ _id: req.userId });

    const productList = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          $or: [
            { createdBy: new mongoose.Types.ObjectId(req.userId) },
            {
              $and: [
                { createdBy: new mongoose.Types.ObjectId(findAdmin._id) },
                { company: new mongoose.Types.ObjectId(findUser.company) },
              ],
            },
          ],
        },
      },
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
        },
      },
      {
        $match: filter,
      },
      {
        $match: searchFilter,
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
          from: "carts",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] }, // primary key (auths)
              },
            },
          ],

          as: "cartDetails",
        },
      },
      {
        $addFields: {
          cartCount: {
            $size: "$cartDetails",
          },
        },
      },
      {
        $match: searchFilter,
      },
      {
        $project: {
          _id: 1,
          productName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$productName", // If language is not 'AR', use category
            },
          },
          productArabicName: 1,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: 1,
          productImg: 1,
          price: 1,
          mrpPrice: 1,
          size: 1,
          color: 1,
          weight: 1,
          material: 1,
          model: 1,
          modelNumber: 1,
          productCode: 1,
          serialCode: 1,
          power: 1,
          madeIn: 1,
          warranty: 1,
          deliveryCost: 1,
          pickupCost: 1,
          discount: 1,
          prepareTime: 1,
          classification: 1,
          company: 1,
          createdBy: 1,
          location: 1,
          quantity: 1,
          stateId: 1,
          couponValidity: 1,
          startDate: 1,
          endDate: 1,
          termsCondition: 1,
          arabicTermsCondition: 1,
          offerContent: 1,
          arabicOfferContent: 1,
          order: 1,
          returnPolicy: 1,
          arabicReturnPolicy: 1,
          isDelivered: true,
          createdAt: 1,
          categoryDetails: 1,
          subCategoryDetails: 1,
          cartDetails: 1,
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
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);
    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VIEW PRODUCT DETAILS
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.detail = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let roleFilter = {};

    if (
      req.roleId == CONST.ADMIN ||
      req.roleId == CONST.PROMOTION_USER ||
      req.roleId == CONST.DESIGNED_USER
    ) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    } else {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    const viewProduct = await PRODUCT_MODEL.aggregate([
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
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
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
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
                perCommission: 1,
                couponService: 1,
                deliveryEligible: 1,
                pickupService: 1,
                deliveryCompany: 1,
                costDelivery: 1,
                logo: 1,
                coverImg: 1,
                country: 1,
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
          from: "branches",
          let: { id: "$branchId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],

          as: "branchDetails",
        },
      },
      {
        $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true },
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
          from: "carts",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] }, // primary key (auths)
                createdBy: new mongoose.Types.ObjectId(req.userId),
              },
            },
            {
              $group: {
                _id: null,
                totalQuantity: { $sum: "$quantity" }, // sum up the quantities
              },
            },
          ],
          as: "cartDetails",
        },
      },
      {
        $addFields: {
          totalQuantityInCart: {
            $arrayElemAt: ["$cartDetails.totalQuantity", 0],
          },
        },
      },
      {
        $lookup: {
          from: "dynamicquestions",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$id", { $ifNull: ["$productId", []] }] }, // primary key (auths)
                stateId: CONST.ACTIVE,
              },
            },
          ],
          as: "dynamicquestions",
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
        $project: {
          _id: 1,
          productName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$productName", // If language is not 'AR', use category
            },
          },
          productArabicName: 1,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: 1,
          productImg: 1,
          price: 1,
          mrpPrice: 1,
          size: 1,
          color: 1,
          weight: 1,
          material: 1,
          model: 1,
          modelNumber: 1,
          productCode: 1,
          serialCode: 1,
          power: 1,
          madeIn: 1,
          warranty: 1,
          deliveryCost: 1,
          pickupCost: 1,
          discount: 1,
          prepareTime: 1,
          classification: 1,
          company: 1,
          createdBy: 1,
          updatedBy: 1,
          location: 1,
          quantity: 1,
          stateId: 1,
          couponValidity: 1,
          startDate: 1,
          endDate: 1,
          termsCondition: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicTermsCondition", "$termsCondition"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$termsCondition", // If language is not 'AR', use category
            },
          },
          arabicTermsCondition: 1,
          offerContent: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicOfferContent", "$offerContent"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$offerContent", // If language is not 'AR', use category
            },
          },
          arabicOfferContent: 1,
          order: 1,
          returnPolicy: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicReturnPolicy", "$returnPolicy"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$returnPolicy", // If language is not 'AR', use category
            },
          },
          arabicReturnPolicy: 1,
          isDelivered: true,
          createdAt: 1,
          categoryDetails: 1,
          subCategoryDetails: 1,
          companyDetails: 1,
          branchDetails: 1,
          cartDetails: 1,
          totalQuantityInCart: 1,
          dynamicquestions: 1,
          classification: 1,
          wishlist: 1,
          isWishlist: 1,
          averageRating: {
            averageRating: { $ifNull: ["$averageRating", 0] },
          },
        },
      },
    ]);

    if (viewProduct.length > 0) {
      await setResponseObject(
        req,
        true,
        "Product details found successfully",
        viewProduct[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Product details not found", []);
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
product.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    const findProduct = await PRODUCT_MODEL.findOne({ _id: req.params.id });

    if (req.query.stateId == CONST.ACTIVE) {
      const now = new Date();
      const formattedDate = new Date(now.toISOString()); // Create a Date object from the current time

      // Compare endDate and couponValidity with the current date
      if (findProduct.endDate < formattedDate) {
        await setResponseObject(
          req,
          false,
          "The end date cannot be in the past. Please select a valid end date."
        );
        next();
        return;
      }

      if (findProduct.couponValidity < formattedDate) {
        await setResponseObject(
          req,
          false,
          "The coupon validity cannot be in the past. Please select a valid coupon validity."
        );
        next();
        return;
      }
    }

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Product Active successfully";

        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Product In-Active successfully";
        let findCarts = await CART.find({ productId: findProduct._id });
        findCarts.map(async (e) => {
          await CART.findByIdAndDelete({ _id: e._id });
        });
        break;

      case "6":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Product rejected successfully";
        break;

      default:
    }

    let updateState = await PRODUCT_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Product state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.delete = async (req, res, next) => {
  try {
    let data = req.body;

    data?.map(async (e) => {
      const deleteProduct = await PRODUCT_MODEL.findByIdAndUpdate(
        {
          _id: e,
        },
        {
          stateId: CONST.DELETED,
        },
        {
          new: true,
        }
      );
      if (deleteProduct) {
        let findCart = await CART.find({ productId: e });
        if (findCart?.length > 0) {
          findCart.map(async (e) => {
            await CART.findOneAndDelete({ _id: e?._id });
          });
        }
      }
    });

    await setResponseObject(req, true, "Product deleted successfully");
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE PRODUCT IMAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.deleteImg = async (req, res, next) => {
  try {
    const findProduct = await PRODUCT_MODEL.findById({ _id: req.params.id });
    if (findProduct) {
      const deleteImg = await PRODUCT_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $pull: {
            productImg: { $or: [{ _id: req.body.id }, { _id: req.query.id }] },
          }, // Replace 'images' with the actual field name that contains the array
        },
        { new: true }
      );
      await setResponseObject(req, true, "Image deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Product not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*
 * SET IMAGE AT 0TH INDEX
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.setDefaultImage = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const imageId = req.body.id;
    const findProduct = await PRODUCT_MODEL.findById({ _id: productId });
    if (findProduct) {
      const imageIndex = findProduct.productImg.findIndex(
        (img) => img._id.toString() === imageId
      );

      if (imageIndex !== -1 && imageIndex !== 0) {
        const imageToMove = findProduct.productImg.splice(imageIndex, 1)[0];

        findProduct.productImg.unshift(imageToMove);

        await findProduct.save();

        await setResponseObject(
          req,
          true,
          "Image set to the default successfully"
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          "Image set to the default successfully"
        );
        next();
      }
    } else {
      await setResponseObject(req, false, "Product not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * ALL PRODUCT LIST FOR ADMIN
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.pendingProduct = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          productName: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          description: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          productArabicName: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          productCode: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          "categoryDetails.category": {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          "subCategoryDetails.subcategory": {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          "companyDetails.company": {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
      ];
    }

    let filter = {};
    switch (req.query.state) {
      case "1":
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2":
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      case "3":
        filter = {
          stateId: CONST.DELETED,
        };
        break;

      case "5":
        filter = {
          stateId: CONST.PENDING,
        };
        break;

      case "6":
        filter = {
          quantity: { $gt: 0 },
        };
        break;

      case "7":
        filter = {
          quantity: { $eq: 0 },
        };
        break;

      default:
        filter = {
          stateId: { $ne: CONST.DELETED },
        };
        break;
    }

    let companyFilter = [];
    if (req.query.companyArr) {
      companyFilter.push({
        $match: {
          company: {
            $in: req.query.companyArr
              .split(",")
              .map((i) => new mongoose.Types.ObjectId(i)),
          }, // Using the array directly
        },
      });
    }

    if (req.query.company) {
      companyFilter.push({
        $match: {
          company: {
            $in: req.query.company.map((i) => new mongoose.Types.ObjectId(i)),
          }, // Using the array directly
        },
      });
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
          company: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    const productList = await PRODUCT_MODEL.aggregate([
      {
        $match: categoryFilter,
      },
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
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
          from: "dynamicquestions",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$id", { $ifNull: ["$productId", []] }] }, // primary key (auths)
              },
            },
          ],
          as: "dynamicquestions",
        },
      },
      {
        $addFields: {
          isAssign: {
            $cond: {
              if: { $size: "$dynamicquestions" },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $match: searchFilter,
      },
      ...companyFilter,
      {
        $project: {
          _id: true,
          productName: true,
          productArabicName: true,
          description: true,
          productImg: true,
          price: true,
          quantity: true,
          shippingCharge: true,
          size: true,
          color: true,
          stateId: true,
          createdAt: true,
          discount: true,
          order: true,
          companyDetails: true,
          productCode: true,
          categoryDetails: {
            _id: true,
            categoryName: true,
          },
          subCategoryDetails: {
            _id: true,
            subcategoryName: true,
          },
          isAssign: true,
          createdBy: 1,
          updatedBy: 1,
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
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Download sample file for csv
 * @param {*} res
 * @param {*} next
 */
product.downloadSample = async function (req, res, next) {
  try {
    const filePath = path.join("../uploads", "product");
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.DB_URL);

    await client.connect();
    const db = client.db(); // Get the database object

    const csvPromises = [];
    try {
      const csvContent = await generateCSV();
      const csvFilePath = path.join(
        filePath,
        `productFile${Math.floor(1000 + Math.random() * 9000)}.csv`
      );
      fs.writeFileSync(csvFilePath, csvContent);
      csvPromises.push(csvFilePath);
    } catch (error) {
      await setResponseObject(req, false, "Error generating CSV", error);
      next();
    }

    // Close the MongoDB connection
    await client.close();

    if (csvPromises.length === 0) {
      return res.status(404).json({ message: "No valid CSV files generated" });
    }

    // Send the first CSV file as response
    const firstCsvFilePath = csvPromises[0]; // Only sending the first CSV file
    let url = process.env.IMAGE_BASE_URL + firstCsvFilePath;
    url = url.replace(/\/\.\.\//g, "/");
    res.status(200).json({
      message: "File downloaded successfully",
      url: url,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*
 * Function to generate CSV content for product
 * @param {*} res
 * @param {*} next
 */
async function generateCSV() {
  const productData = [
    {
      productName: "productName",
      productArabicName: "productArabicName",
      productCode: "productCode",
      company: "company",
      classification: "classification",
      startDate: "startDate",
      endDate: "endDate",
      couponValidity: "couponValidity",
      deliveryCost: "deliveryCost",
      pickupCost: "pickupCost",
      size: "size",
      mrpPrice: "mrpPrice",
      price: "price",
      discount: "discount",
      quantity: "quantity",
      weight: "weight",
      material: "material",
      color: "color",
      model: "model",
      modelNumber: "modelNumber",
      serialCode: "serialCode",
      power: "power",
      madeIn: "madeIn",
      warranty: "warranty",
      prepareTime: "prepareTime",
      description: "description",
      arabicDescription: "arabicDescription",
      termsCondition: "termsCondition",
      arabicTermsCondition: "arabicTermsCondition",
      offerContent: "offerContent",
      arabicOfferContent: "arabicOfferContent",
      order: "order",
      productImg: "productImg",
      isDelivered: "isDelivered",
    },
    {
      productName: "Mobile",
      productArabicName: "متحرك",
      productCode: "2411JH4544",
      company: "White Beauty Salon",
      classification: "Spy",
      startDate: "2024-10-30",
      endDate: "2024-10-31",
      couponValidity: "2024-10-30",
      deliveryCost: "200",
      pickupCost: "100",
      size: `[{"sizes":"S","price":"70","mrp":"80","discount":"80"},{"sizes":"M","price":"80","mrp":"100","discount":"80"}]`,
      mrpPrice: "",
      price: "",
      discount: "",
      quantity: "5",
      weight: "weight",
      material: "material",
      color: "Red,Blue",
      model: "model",
      modelNumber: "1254785",
      serialCode: "2411JH45487",
      power: "power",
      madeIn: "India",
      warranty: "1 Year",
      prepareTime: "45",
      description: "Good product",
      arabicDescription: "منتج جيد",
      termsCondition: "Not returnable",
      arabicTermsCondition: "غير قابلة للإرجاع",
      offerContent: "Latest offer",
      arabicOfferContent: "أحدث العرض",
      order: "1",
      productImg:
        "https://www.gstatic.com/webp/gallery3/1.png,https://www.gstatic.com/webp/gallery3/2.png,http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",

      isDelivered: "true",
    },
  ];

  const csvContent = productData
    .map((product) => {
      return (
        Object.values(product)
          .map((value) => `"${value.toString().replace(/"/g, '""')}"`) // Wrap in quotes and escape inner quotes
          .join(",") + "\n"
      ); // Join values with a comma and add a newline
    })
    .join(""); // Join all products into one string

  return csvContent;
}

product.importCsv = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        var product = [];

        const filePath = req.files.csvFile[0].path;
        const fileExtension = path.extname(filePath).toLowerCase();

        // Read the file based on its extension
        if (fileExtension === ".csv") {
          jsonObj = await csvtojson().fromFile(filePath);
        } else if (fileExtension === ".xlsx") {
          const workbook = xlsx.readFile(filePath);
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonObj = xlsx.utils.sheet_to_json(firstSheet);
        } else {
          await setResponseObject(req, false, "Unsupported file format");
          return next();
        }

        csvtojson()
          .fromFile(filePath)
          .then(async (jsonObj) => {
            for (var i = 0; i < jsonObj.length; i++) {

              // Check if the row is empty
              if (Object.values(jsonObj[i]).every((value) => value === "")) {
                continue; // Skip this iteration if the row is empty
              }
              var obj = {};
              obj.productName = jsonObj[i]["productName"] || "";
              obj.productArabicName = jsonObj[i]["productArabicName"] || "";

              const companyName = jsonObj[i]["company"];

              const companies = await COMPANY_MODEL.findOne({
                company: companyName,
              });

              if (companies) {
                obj.company = companies._id;
              } else {
                await setResponseObject(
                  req,
                  false,
                  `${companyName} company does not exist`
                );
                next();
                return;
              }

              const classificationName = jsonObj[i]["classification"];

              const classification = await CALSSIFICATION.findOne({
                name: classificationName,
              });

              if (classification) {
                obj.classification = classification?._id;
              } else {
                await setResponseObject(
                  req,
                  false,
                  `${classificationName} classification not exist`
                );
                next();
                return;
              }

              const isValidISODate = (dateString) =>
                /^\d{4}-\d{2}-\d{2}$/.test(dateString);
              if (
                !isValidISODate(jsonObj[i]["startDate"]) ||
                !isValidISODate(jsonObj[i]["endDate"]) ||
                !isValidISODate(jsonObj[i]["couponValidity"])
              ) {
                await setResponseObject(
                  req,
                  false,
                  "Invalid date format,date should be in this format 2024-11-26"
                );
                next();
                return;
              }

              if (
                jsonObj[i]["size"] == "" &&
                jsonObj[i]["mrpPrice"] == "" &&
                jsonObj[i]["price"] == "" &&
                jsonObj[i]["discount"] == ""
              ) {
                await setResponseObject(
                  req,
                  false,
                  "Size field can't be empty"
                );
                return next();
              }

              if (
                jsonObj[i]["size"] !== "" &&
                jsonObj[i]["mrpPrice"] !== "" &&
                jsonObj[i]["price"] !== "" &&
                jsonObj[i]["discount"] !== ""
              ) {
                await setResponseObject(
                  req,
                  false,
                  "You can't add all fields at a time size,mrpPrice,price,discount"
                );
                return next();
              }

              obj.startDate = jsonObj[i]["startDate"] || "";
              obj.endDate = jsonObj[i]["endDate"] || "";

              obj.couponValidity = jsonObj[i]["couponValidity"] || "";

              if (!obj.deliveryCost) {
                await setResponseObject(
                  req,
                  false,
                  "Delivery Cost can't be empty"
                );
              }

              if (obj.deliveryCost == "0") {
                await setResponseObject(
                  req,
                  false,
                  "Delivery Cost can't be zero"
                );
              }

              obj.deliveryCost = jsonObj[i]["deliveryCost"] || "";
              obj.deliveryCost = parseFloat(obj.deliveryCost);

              // Check if deliveryCost is a valid number
              if (isNaN(obj.deliveryCost)) {
                await setResponseObject(
                  req,
                  false,
                  "Delivery cost must be a valid number"
                );
                return next();
              }

              if (!obj.pickupCost) {
                await setResponseObject(
                  req,
                  false,
                  "Pickup Cost can't be empty"
                );
              }

              if (obj.pickupCost == "0") {
                await setResponseObject(
                  req,
                  false,
                  "Pickup Cost can't be zero"
                );
              }

              obj.pickupCost = jsonObj[i]["pickupCost"] || "";
              obj.pickupCost = parseFloat(obj.pickupCost);

              // Check if pickupCost is a valid number
              if (isNaN(obj.pickupCost)) {
                await setResponseObject(
                  req,
                  false,
                  "Pickup cost must be a valid number"
                );
                return next();
              }

              if (
                jsonObj[i]["mrpPrice"] == "" &&
                jsonObj[i]["price"] == "" &&
                jsonObj[i]["discount"] == ""
              ) {
                if (jsonObj[i]["size"]) {
                  obj.size = JSON.parse(
                    jsonObj[i].size.replace(/({|,)(\w+):/g, '$1"$2":')
                  );
                }
              }

              if (jsonObj[i]["size"] == "") {
                obj.mrpPrice = jsonObj[i]["mrpPrice"] || "";

                // Check if mrpPrice is not an empty field
                if (obj.mrpPrice !== "") {
                  obj.mrpPrice = parseFloat(obj.mrpPrice);

                  // Check if mrpPrice is a valid number
                  if (isNaN(obj.mrpPrice)) {
                    await setResponseObject(
                      req,
                      false,
                      "Mrp must be a valid number"
                    );
                    return next();
                  }
                }

                obj.price = jsonObj[i]["price"] || "";
                if (obj.price !== "") {
                  obj.price = parseFloat(obj.price);

                  // Check if price is a valid number
                  if (isNaN(obj.price)) {
                    await setResponseObject(
                      req,
                      false,
                      "Price must be a valid number"
                    );
                    return next();
                  }
                }

                obj.discount = jsonObj[i]["discount"] || "";
                if (obj.discount !== "") {
                  obj.discount = parseFloat(obj.discount);
                  // Check if quantity is a valid number
                  if (isNaN(obj.discount)) {
                    await setResponseObject(
                      req,
                      false,
                      "Discount must be a valid number"
                    );
                    return next();
                  }
                }
              }

              obj.quantity = jsonObj[i]["quantity"] || "";
              obj.quantity = parseFloat(obj.quantity);
              // Check if quantity is a valid number
              if (isNaN(obj.quantity)) {
                await setResponseObject(
                  req,
                  false,
                  "Quantity must be a valid number"
                );
                return next();
              }

              obj.weight = jsonObj[i]["weight"] || "";
              obj.material = jsonObj[i]["material"] || "";
              obj.color = jsonObj[i]["color"]
                ? jsonObj[i]["color"]?.split(",")
                : [] || "";
              obj.model = jsonObj[i]["model"] || "";
              obj.modelNumber = jsonObj[i]["modelNumber"] || "";
              obj.productCode = jsonObj[i]["productCode"] || "";
              obj.serialCode = jsonObj[i]["serialCode"] || "";
              obj.power = jsonObj[i]["power"] || "";
              obj.madeIn = jsonObj[i]["madeIn"] || "";
              obj.warranty = jsonObj[i]["warranty"] || "";
              obj.prepareTime = jsonObj[i]["prepareTime"] || "";
              obj.description = jsonObj[i]["description"] || "";
              obj.arabicDescription = jsonObj[i]["arabicDescription"] || "";
              obj.termsCondition = jsonObj[i]["termsCondition"] || "";
              obj.arabicTermsCondition =
                jsonObj[i]["arabicTermsCondition"] || "";
              obj.offerContent = jsonObj[i]["offerContent"] || "";
              obj.arabicOfferContent = jsonObj[i]["arabicOfferContent"] || "";
              obj.order = jsonObj[i]["order"] || "";
              obj.order = parseFloat(obj.order);
              // Check if order is a valid number
              if (isNaN(obj.order)) {
                await setResponseObject(
                  req,
                  false,
                  "Order must be a valid number"
                );
                return next();
              }

              const validImageExtensions = [".png", ".jpg", ".jpeg", ".mp4"];

              // Assuming jsonObj is defined and i is the current index
              const productImgUrls = jsonObj[i]["productImg"]
                ? jsonObj[i]["productImg"].split(",").map((url) => url.trim()) // Trim spaces
                : [];

              let allImagesValid = true;
              const imgArray = productImgUrls
                .map((url) => {
                  const ext = path.extname(url).toLowerCase();
                  if (validImageExtensions.includes(ext)) {
                    return {
                      url: url,
                      type:
                        ext == ".mp4"
                          ? `video/${ext.replace(/^\./, "")}`
                          : `image/${ext.replace(/^\./, "")}`,
                    }; // Store URL and type
                  } else {
                    allImagesValid = false;
                    return null; // Return null for invalid URLs
                  }
                })
                .filter(Boolean); // Filter out null values
              if (!allImagesValid) {
                await setResponseObject(
                  req,
                  false,
                  "Image should be jpeg, jpg, png"
                );
                return next();
              }
              obj.productImg = imgArray;
              obj.isDelivered = (jsonObj[i]["isDelivered"] || "").toLowerCase();

              obj.stateId = 1;

              obj.createdBy = req.userId;
              product.push(obj);
            }

            for (let i in product) {
              await PRODUCT_MODEL.create(product[i]);
            }

            // Delete the CSV file after data creation
            fs.unlink(req.files.csvFile[0].path, (err) => {
              if (err) {
                console.error("Error deleting CSV file:", err);
              } else {
                console.log("CSV file deleted successfully");
              }
            });
            await setResponseObject(req, true, "File imported successfully");
            next();
          });
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*********************************************FOR USERS************************************************************************/
/**
 * PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.userProduct = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 5;

    let filter = [];
    if (
      req.query.companyId ||
      req.query.categoryId ||
      req.query.subcategoryId
    ) {
      filter.push({
        $match: {
          $or: [
            { company: new mongoose.Types.ObjectId(req.query.companyId) },
            {
              categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
            },
            {
              subcategoryId: new mongoose.Types.ObjectId(
                req.query.subcategoryId
              ),
            },
          ],
        },
      });
    }

    if (req.query.classificationArr) {
      filter.push({
        $match: {
          classification: {
            $in: req.query.classificationArr
              .split(",")
              .map((i) => new mongoose.Types.ObjectId(i)),
          },
        },
      });
    }

    if (req.query.companyArr) {
      filter.push({
        $match: {
          company: {
            $in: req.query.companyArr
              .split(",")
              .map((i) => new mongoose.Types.ObjectId(i)),
          }, // Using the array directly
        },
      });
    }

    if (req.query.minPrice && req.query.maxPrice) {
      filter.push({
        $match: {
          $or: [
            {
              $and: [
                {
                  price: {
                    $gte: parseFloat(req.query.minPrice),
                  },
                },
                {
                  price: {
                    $lte: parseFloat(req.query.maxPrice),
                  },
                },
              ],
            },
            {
              $and: [
                {
                  size: {
                    $ne: [],
                  },
                },
                {
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          { $arrayElemAt: ["$size.price", 0] },
                          parseFloat(req.query.minPrice),
                        ],
                      },
                      {
                        $lte: [
                          { $arrayElemAt: ["$size.price", 0] },
                          parseFloat(req.query.maxPrice),
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      });
    } else if (req.query.maxPrice) {
      filter.push({
        $match: {
          $or: [
            {
              price: {
                $lte: parseFloat(req.query.maxPrice),
              },
            },
            {
              $and: [
                {
                  size: {
                    $ne: [],
                  },
                },
                {
                  $expr: {
                    $lte: [
                      { $arrayElemAt: ["$size.price", 0] },
                      parseFloat(req.query.maxPrice),
                    ],
                  },
                },
              ],
            },
          ],
        },
      });
    } else if (req.query.minPrice) {
      filter.push({
        $match: {
          $or: [
            {
              price: {
                $gte: parseFloat(req.query.minPrice),
              },
            },
            {
              $and: [
                {
                  size: {
                    $ne: [],
                  },
                },
                {
                  $expr: {
                    $gte: [
                      { $arrayElemAt: ["$size.price", 0] },
                      parseFloat(req.query.minPrice),
                    ],
                  },
                },
              ],
            },
          ],
        },
      });
    }

    if (req.query.minDiscount && req.query.maxDiscount) {
      filter.push({
        $match: {
          $or: [
            {
              $and: [
                {
                  discount: {
                    $gte: parseFloat(req.query.minDiscount),
                  },
                },
                {
                  discount: {
                    $lte: parseFloat(req.query.maxDiscount),
                  },
                },
              ],
            },
            {
              $and: [
                {
                  size: {
                    $ne: [],
                  },
                },
                {
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          { $arrayElemAt: ["$size.discount", 0] },
                          parseFloat(req.query.minDiscount),
                        ],
                      },
                      {
                        $lte: [
                          { $arrayElemAt: ["$size.discount", 0] },
                          parseFloat(req.query.maxDiscount),
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      });
    } else if (req.query.maxDiscount) {
      filter.push({
        $match: {
          $or: [
            {
              discount: {
                $lte: parseFloat(req.query.maxDiscount),
              },
            },
            {
              $and: [
                {
                  size: {
                    $ne: [],
                  },
                },
                {
                  $expr: {
                    $lte: [
                      { $arrayElemAt: ["$size.discount", 0] },
                      parseFloat(req.query.maxDiscount),
                    ],
                  },
                },
              ],
            },
          ],
        },
      });
    } else if (req.query.minDiscount) {
      filter.push({
        $match: {
          $or: [
            {
              discount: {
                $gte: parseFloat(req.query.minDiscount),
              },
            },
            {
              $and: [
                {
                  size: {
                    $ne: [],
                  },
                },
                {
                  $expr: {
                    $gte: [
                      { $arrayElemAt: ["$size.discount", 0] },
                      parseFloat(req.query.minDiscount),
                    ],
                  },
                },
              ],
            },
          ],
        },
      });
    }

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
          productName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          productArabicName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          "companyDetails.company": {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          "companyDetails.arabicCompany": {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    if (req.query.classification && req.query.classificationCompany) {
      filter.push({
        $match: {
          $and: [
            {
              classification: new mongoose.Types.ObjectId(
                req.query.classification
              ),
            },
            {
              company: new mongoose.Types.ObjectId(
                req.query.classificationCompany
              ),
            },
          ],
        },
      });
    }

    if (req.query.discount == "true") {
      filter.push({
        $match: {
          $and: [{ discount: { $ne: null } }, { discount: { $gt: 0 } }],
        },
      });
    }

    let sorting = {};
    if (req.query.sort) {
      let sortOrder = req.query.sort === "2" ? 1 : -1;
      sorting = {
        effectivePrice: sortOrder,
      };
    } else {
      sorting = {
        createdAt: -1,
      };
    }

    let productList;
    productList = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
            // Send product if company has branch
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
                arabicCompany: 1,
                logo: 1,
                coverImg: 1,
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
        $match: { companyDetails: { $exists: true } },
      },
      {
        $group: {
          _id: "$company",
          totalQuantity: { $sum: "$quantity" }, // Assuming 'quantity' is the field for product quantity
          products: { $push: "$$ROOT" }, // Push the entire product document
        },
      },
      {
        $match: {
          totalQuantity: { $gt: 0 }, // Filter out companies with total quantity of 0
        },
      },
      {
        $unwind: "$products", // Unwind back to individual products
      },
      {
        $replaceRoot: { newRoot: "$products" }, // Replace root with product document
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
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
          from: "classifications",
          let: { id: "$classification" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arbicName", "$name"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicCompany if language is Arabic
                    else: "$name", // Use company otherwise
                  },
                },
                arbicName: 1,
                order: 1,
                createdAt: 1,
              },
            },
          ],
          as: "classificationDetails",
        },
      },
      {
        $unwind: {
          path: "$classificationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...filter,
      {
        $project: {
          _id: 1,
          productName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$productName", // If language is not 'AR', use category
            },
          },
          productArabicName: 1,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: 1,
          productImg: { $slice: ["$productImg", 1] },
          price: 1,
          mrpPrice: 1,
          pickupCost: 1,
          size: 1,
          discount: 1,
          quantity: 1,
          order: 1,
          isDelivered: true,
          createdAt: 1,
          isWishlist: 1,
          averageRating: {
            averageRating: { $ifNull: ["$averageRating", 0] },
          },
        },
      },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $ne: ["$price", null] }, // Check if price is not null
              then: "$price", // Use price if available
              else: { $arrayElemAt: ["$size.price", 0] }, // Use the first size price if price is null
            },
          },
        },
      },
      {
        $match: searchFilter,
      },
      {
        $sort: sorting,
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

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.userProducts = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let filter = [];
    if (req.query.classification && req.query.classificationCompany) {
      filter.push({
        $match: {
          $and: [
            {
              classification: new mongoose.Types.ObjectId(
                req.query.classification
              ),
            },
            {
              company: new mongoose.Types.ObjectId(
                req.query.classificationCompany
              ),
            },
          ],
        },
      });
    }

    let productList;
    productList = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                stateId: CONST.ACTIVE,
                country: country,
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
                arabicCompany: 1,
                logo: 1,
                coverImg: 1,
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
        $match: { companyDetails: { $exists: true } },
      },
      {
        $group: {
          _id: "$company",
          totalQuantity: { $sum: "$quantity" }, // Assuming 'quantity' is the field for product quantity
          products: { $push: "$$ROOT" }, // Push the entire product document
        },
      },
      {
        $match: {
          totalQuantity: { $gt: 0 }, // Filter out companies with total quantity of 0
        },
      },
      {
        $unwind: "$products", // Unwind back to individual products
      },
      {
        $replaceRoot: { newRoot: "$products" }, // Replace root with product document
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
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
          from: "classifications",
          let: { id: "$classification" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arbicName", "$name"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicCompany if language is Arabic
                    else: "$name", // Use company otherwise
                  },
                },
                arbicName: 1,
                order: 1,
              },
            },
          ],
          as: "classificationDetails",
        },
      },
      {
        $unwind: {
          path: "$classificationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...filter,
      {
        $project: {
          _id: 1,
          productName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$productName", // If language is not 'AR', use category
            },
          },
          productArabicName: 1,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: 1,
          productImg: { $slice: ["$productImg", 1] },
          price: 1,
          mrpPrice: 1,
          pickupCost: 1,
          size: 1,
          discount: 1,
          // company: 1,
          isWishlist: 1,
          averageRating: {
            averageRating: { $ifNull: ["$averageRating", 0] },
          },
          order: 1,
          createdAt: 1,
        },
      },

      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $ne: ["$price", null] }, // Check if price is not null
              then: "$price", // Use price if available
              else: { $arrayElemAt: ["$size.price", 0] }, // Use the first size price if price is null
            },
          },
        },
      },
      // {
      //   $match: searchFilter,
      // },
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
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.searchProductList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

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
          productName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          productArabicName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          "companyDetails.company": {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          "companyDetails.arabicCompany": {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let productList;
    productList = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                stateId: CONST.ACTIVE,
                country: country,
              },
            },
            // Send product if company has branch
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
                arabicCompany: 1,
                logo: 1,
                coverImg: 1,
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
        $match: { companyDetails: { $exists: true } },
      },
      {
        $group: {
          _id: "$company",
          totalQuantity: { $sum: "$quantity" }, // Assuming 'quantity' is the field for product quantity
          products: { $push: "$$ROOT" }, // Push the entire product document
        },
      },
      {
        $match: {
          totalQuantity: { $gt: 0 }, // Filter out companies with total quantity of 0
        },
      },
      {
        $unwind: "$products", // Unwind back to individual products
      },
      {
        $replaceRoot: { newRoot: "$products" }, // Replace root with product document
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
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
          from: "classifications",
          let: { id: "$classification" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arbicName", "$name"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicCompany if language is Arabic
                    else: "$name", // Use company otherwise
                  },
                },
                arbicName: 1,
                order: 1,
              },
            },
          ],
          as: "classificationDetails",
        },
      },
      {
        $unwind: {
          path: "$classificationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          productName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$productName", // If language is not 'AR', use category
            },
          },
          productArabicName: 1,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: 1,
          productImg: { $slice: ["$productImg", 1] },
          price: 1,
          mrpPrice: 1,
          pickupCost: 1,
          size: 1,
          discount: 1,
          // company: 1,
          isWishlist: 1,
          averageRating: {
            averageRating: { $ifNull: ["$averageRating", 0] },
          },
          order: 1,
          createdAt: 1,
        },
      },

      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $ne: ["$price", null] }, // Check if price is not null
              then: "$price", // Use price if available
              else: { $arrayElemAt: ["$size.price", 0] }, // Use the first size price if price is null
            },
          },
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

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Similar product list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.similarProductList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    const list = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          categoryId: new mongoose.Types.ObjectId(req.query.categoryId),
        },
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
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
          from: "companies",
          let: { id: "$companyId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
        "Similar product found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Similar product not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Seller graph product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.sellerGraphProduct = async (req, res, next) => {
  try {
    const list = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { productId: "$_id" },
          pipeline: [
            {
              $unwind: "$products",
            },
            {
              $match: {
                $expr: { $eq: ["$products.items", "$$productId"] },
              },
            },
            {
              $group: {
                _id: "$products.items",
                totalQuantity: { $sum: "$products.quantity" },
                orderCount: { $sum: 1 }, // Count of orders containing this product
              },
            },
          ],
          as: "orderDetails",
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orderDetails" }, // Number of orders for each product
          totalQuantity: { $sum: "$orderDetails.totalQuantity" }, // Total quantity of the product
        },
      },
      {
        $match: {
          orderCount: { $gt: 0 }, // Filter products that have orders
        },
      },
      {
        $sort: {
          orderCount: -1,
        },
      },
    ]);

    if (list.length > 0) {
      await setResponseObject(req, true, "", list);
    } else {
      await setResponseObject(req, true, "", []);
    }
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VENDER DASHBOARD
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.venderDashboard = async (req, res, next) => {
  try {
    const products = await PRODUCT.find({ createdBy: req.userId });

    const productArr = [];
    products.map((e) => {
      productArr.push(e._id);
    });

    let totalOrder = await PRODUCT_MODEL.aggregate([
      {
        $match: { createdBy: mongoose.Types.ObjectId(req.userId) },
      },
      {
        $lookup: {
          from: "orders",
          let: { itemId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$itemId", "$products.items"] },
              },
            },
          ],
          as: "orderRecords",
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { itemId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$itemId", "$products.items"] },
                    { $eq: ["$deliveryStatus", CONST.COMPLETED] },
                  ],
                },
              },
            },
          ],
          as: "orderRecord",
        },
      },
      {
        $addFields: { totalOrder: { $size: "$orderRecords" } },
      },
      {
        $addFields: { totalEarning: { $sum: "$orderRecord.orderTotal" } },
      },
      {
        $group: {
          _id: 0,
          totalEarning: { $sum: "$totalEarning" },
          total_order: { $sum: "$totalOrder" },
          totalCustomers: { $addToSet: "$orderRecords.createdBy" },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarning: 1,
          total_order: 1,
          totalCustomers: {
            $reduce: {
              input: "$totalCustomers",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
      {
        $unwind: "$totalCustomers",
      },
      {
        $group: {
          _id: 0,
          totalEarning: { $first: "$totalEarning" },
          total_order: { $first: "$total_order" },
          totalCustomers: { $addToSet: "$totalCustomers" },
        },
      },
      {
        $project: {
          _id: 0,
          totalEarning: 1,
          total_order: 1,
          totalCustomers: { $size: "$totalCustomers" },
        },
      },
    ]);

    const orderTotal = await ORDER.find({
      "products.items": { $in: productArr },
    }).countDocuments();

    const response = {};
    response.totalProduct = productArr.length || 0;
    response.totalOrder = orderTotal || 0;
    response.totalCustomer = totalOrder[0]?.totalCustomers || 0;
    response.totalPayment = totalOrder[0]?.totalEarning || 0;

    if (response) {
      await setResponseObject(req, true, "", response);
      next();
    } else {
      await setResponseObject(req, true, "", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * BEST SELLER PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.bestSellerProduct = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
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
          arabicCompany: {
            $regex: searchTerm,
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
                stateId: CONST.ACTIVE,
                quantity: { $gt: 0 },
              },
            },
            {
              $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "products.items",
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
          arabicCompany: { $first: "$arabicCompany" },
          description: { $first: "$description" },
          couponService: { $first: "$couponService" },
          deliveryEligible: { $first: "$deliveryEligible" },
          pickupService: { $first: "$pickupService" },
          deliveryCompany: { $first: "$deliveryCompany" },
          costDelivery: { $first: "$costDelivery" },
          logo: { $first: "$logo" },
          coverImg: { $first: "$coverImg" },
          order: { $first: "$order" },
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
        $match: {
          count: { $gt: 0 },
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

/**
 * RATING COUNT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.ratingPerformance = async (req, res, next) => {
  try {
    const products = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
    ]);

    if (products) {
      for (let productData of products) {
        const reviews = await REVIEW.find({
          productId: new mongoose.Types.ObjectId(productData._id),
        });
        const reviewers = await REVIEW.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              _id: 0,
              reviewer: {
                fullName: "$user.fullName",
                email: "$user.email",
                profileImg: "$user.profileImg",
              },
              review: {
                rating: "$rating",
                review: "$review",
                reviewImg: "$reviewImg",
              },
            },
          },
        ]).limit(2);

        const totalReviews = reviews.length;
        const totalRatings = reviews.reduce(
          (acc, curr) => acc + curr.rating,
          0
        );
        const averageRating = totalRatings / totalReviews;
        const starRatings = [0, 0, 0, 0, 0];
        reviews.forEach((review) => {
          starRatings[review.rating - 1]++;
        });
        starRatings.reverse();

        const getSingleRating = {
          averageRating,
          starRatings,
          totalReviews,
          reviewers, // add reviewers array to getSingleRating
        };
        productData.ratingData = getSingleRating;
      }
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        products
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Download REPORT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.downloadItemReport = async (req, res, next) => {
  try {
    const start = req.query.startDate; // e.g., '2024-10-20'
    const end = req.query.endDate; // e.g., '2024-10-30'
    let findPromo;

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
          company: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    findPromo = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          $and: [
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
            { quantity: { $gt: 0 } },
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
            "Item Name",
            "Product Code",
            "Offer (%)",
            "Quantity",
            "Number of items sold",
          ],
        ];

        // Assuming findPromo is an array of objects
        findPromo?.forEach((promo) => {
          data.push([
            promo?.companyDetails.company,
            promo?.companyDetails.countryCode + promo?.companyDetails?.mobile,
            promo?.productName,
            promo?.productCode ? promo?.productCode : "-",
            promo?.discount ? promo?.discount : promo?.size[0]?.discount,
            promo?.quantity ? promo?.quantity : 0,
            promo?.order ? promo?.order : 0,
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

        // Define the file path for the Excel file
        const excelPath = `../uploads/invoice/itemreport-${generateOTP(
          6
        )}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(findPromo);
      let excelUrl = `${process.env.IMAGE_BASE_URL}${excelPath}`; // Example URL format
      excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
      await setResponseObject(
        req,
        true,
        "Report download successfully",
        excelUrl
      );
      next();
    } else {
      await setResponseObject(req, true, "No data available");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * PRODUCT LIST FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.newArrival = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let filter = [];

    if (req.query.discount == "true") {
      filter.push({
        $match: {
          $and: [{ discount: { $ne: null } }, { discount: { $gt: 0 } }],
        },
      });
    }

    const productList = await PRODUCT_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                // stateId: CONST.ACTIVE,
                // country: country,
              },
            },
            // Send product if company has branch
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
                arabicCompany: 1,
                logo: 1,
                coverImg: 1,
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
        $match: { companyDetails: { $exists: true } },
      },
      {
        $group: {
          _id: "$company",
          totalQuantity: { $sum: "$quantity" }, // Assuming 'quantity' is the field for product quantity
          products: { $push: "$$ROOT" }, // Push the entire product document
        },
      },
      {
        $match: {
          totalQuantity: { $gt: 0 }, // Filter out companies with total quantity of 0
        },
      },
      {
        $unwind: "$products", // Unwind back to individual products
      },
      {
        $replaceRoot: { newRoot: "$products" }, // Replace root with product document
      },
      {
        $lookup: {
          from: "wishlists",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$productId"] },
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
          from: "classifications",
          let: { id: "$classification" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                name: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arbicName", "$name"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicCompany if language is Arabic
                    else: "$name", // Use company otherwise
                  },
                },
                arbicName: 1,
                order: 1,
              },
            },
          ],
          as: "classificationDetails",
        },
      },
      {
        $unwind: {
          path: "$classificationDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...filter,
      {
        $project: {
          _id: 1,
          productName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$productArabicName", "$productName"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$productName", // If language is not 'AR', use category
            },
          },
          productArabicName: 1,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: 1,
          productImg: { $slice: ["$productImg", 1] },
          price: 1,
          mrpPrice: 1,
          pickupCost: 1,
          size: 1,
          color: 1,
          deliveryCost: 1,
          pickupCost: 1,
          discount: 1,
          classification: 1,
          company: 1,
          order: 1,
          companyDetails: 1,
          classificationDetails: 1,
          isWishlist: 1,
          averageRating: {
            averageRating: { $ifNull: ["$averageRating", 0] },
          },
          createdAt: 1,
        },
      },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $ne: ["$price", null] }, // Check if price is not null
              then: "$price", // Use price if available
              else: { $arrayElemAt: ["$size.price", 0] }, // Use the first size price if price is null
            },
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 50,
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

    if (productList && productList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Product list found successfully",
        productList[0].data,
        productList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Product list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = product;
