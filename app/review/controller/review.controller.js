/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { REVIEW } = require("../model/review.model");
const ORDER = require("../../order/model/order.model");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const review = {};

const fs = require("fs");
const multer = require("multer");
const { CONST } = require("../../../helpers/constant");
const { COMPANY_MODEL } = require("../../company/model/model");
const dir = "../uploads/reviewImg";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "reviewImg" }]);

/**
 * ADD REVIEW
 */
review.addReview = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      !fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      const data = req.body;

      data.createdBy = req.userId;
      const isExist = await REVIEW.findOne({
        $and: [
          { createdBy: req.userId },
          {
            $and: [
              { productId: data.productId },
              { companyId: data.companyId },
            ],
          },
        ],
      });

      const findProduct = await PRODUCT_MODEL.findOne({ _id: data.productId });

      const findOrder = await ORDER.findOne({
        $and: [
          { createdBy: req.userId },
          { "products.items": { $in: findProduct?._id } },
          { deliveryStatus: CONST.COMPLETED },
        ],
      });

      if (findOrder) {
        if (findOrder.deliveryStatus !== CONST.COMPLETED) {
          await setResponseObject(
            req,
            false,
            "You can't rate an order that wasn't completed."
          );
          next();
          return;
        }

        if (isExist) {
          if (req.files.reviewImg) {
            const arr = [];
            req.files.reviewImg.map((e) => {
              let url = process.env.IMAGE_BASE_URL + e.path.replace(/\s+/g, "");
              url = url.replace(/\/\.\.\//g, "/");
              arr.push({
                url: url,
              });
            });
            data.reviewImg = arr;
          }

          const updateData = await REVIEW.findByIdAndUpdate(
            { _id: isExist._id },
            data,
            { new: true }
          );
          if (updateData) {
            // Update product average rating
            let allProductRating = await REVIEW.find({
              productId: data.productId,
            });

            let productAverageRating =
              allProductRating.reduce((acc, r) => acc + r.rating, 0) /
              allProductRating.length;

            let updateProductRating = await PRODUCT_MODEL.findOneAndUpdate(
              { _id: data.productId },
              { averageRating: productAverageRating },
              { new: true }
            );

            // Update company average rating
            let companyProducts = await PRODUCT_MODEL.find({
              company: findProduct.company,
            });
            let companyRatings = await REVIEW.find({
              productId: { $in: companyProducts.map((p) => p._id) },
            });
            let companyAverageRating =
              companyRatings.reduce((acc, r) => acc + r.rating, 0) /
              companyRatings.length;

            let updateCompanyRating = await COMPANY_MODEL.findOneAndUpdate(
              { _id: findProduct.company },
              { totalAverageRating: companyAverageRating },
              { new: true }
            );
            await setResponseObject(
              req,
              true,
              "Review added successfully",
              updateData
            );
            next();
          } else {
            await setResponseObject(req, true, "Review not added");
            next();
          }
        } else {
          if (req.files.reviewImg) {
            const arr = [];
            req.files.reviewImg.map((e) => {
              let url = process.env.IMAGE_BASE_URL + e.path.replace(/\s+/g, "");
              url = url.replace(/\/\.\.\//g, "/");
              arr.push({
                url: url,
              });
            });
            data.reviewImg = arr;
          }
          const addReview = await REVIEW.create(data);
          if (addReview) {
            // Update product average rating
            let allProductRating = await REVIEW.find({
              productId: data.productId,
            });

            let productAverageRating =
              allProductRating.reduce((acc, r) => acc + r.rating, 0) /
              allProductRating.length;

            let updateProductRating = await PRODUCT_MODEL.findOneAndUpdate(
              { _id: data.productId },
              { averageRating: productAverageRating },
              { new: true }
            );

            // Update company average rating
            let companyProducts = await PRODUCT_MODEL.find({
              company: findProduct.company,
            });
            let companyRatings = await REVIEW.find({
              productId: { $in: companyProducts.map((p) => p._id) },
            });
            let companyAverageRating =
              companyRatings.reduce((acc, r) => acc + r.rating, 0) /
              companyRatings.length;

            let updateCompanyRating = await COMPANY_MODEL.findOneAndUpdate(
              { _id: findProduct.company },
              { totalAverageRating: companyAverageRating },
              { new: true }
            );

            await setResponseObject(
              req,
              true,
              "Review added successfully",
              addReview
            );
            next();
          } else {
            await setResponseObject(req, false, "Review not added");
            next();
          }
        }
      } else {
        await setResponseObject(
          req,
          false,
          "Please place your order before leaving a rating."
        );
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE REVIEW
 */
review.deleteReview = async (req, res, next) => {
  try {
    const deleteReview = await REVIEW.findByIdAndDelete({ _id: req.params.id });
    if (deleteReview) {
      await setResponseObject(req, true, "Review deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Review not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * REVIEW LIST
 */
review.reviewByProduct = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageLimit = parseInt(req.query.pageLimit) || 10;

    const reviewList = await REVIEW.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(req.query.productId),
        },
      },
      {
        $sort: {
          createdAt: -1,
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
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (reviewList && reviewList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Review list found successfully",
        reviewList[0].data,
        reviewList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Review list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = review;
