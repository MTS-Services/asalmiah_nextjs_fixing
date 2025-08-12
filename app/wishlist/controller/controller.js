/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { WISHLIST } = require("../model/model");
const { CONST } = require("../../../helpers/constant");
const wishlist = {};

/**
 *  ADD PRODUCT IN WISHLIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
wishlist.addWishlist = async (req, res, next) => {
  try {
    const data = req.body;

    data.createdBy = req.userId;
    let isExist;

    let resp;
    if (data?.productId) {
      resp =
        data.isWishlist == true
          ? "Product added in Wishlist"
          : "Product removed from Wishlist";

      isExist = await WISHLIST.findOne({
        createdBy: req.userId,
        productId: data?.productId,
        type: data.type,
        isWishlist: true,
      });
    }

    if (data?.companyId) {
      resp =
        data.isWishlist == true
          ? "Company added in Wishlist"
          : "Company removed from Wishlist";

      isExist = await WISHLIST.findOne({
        createdBy: req.userId,
        companyId: data?.companyId,
        type: data.type,
        isWishlist: true,
      });
    }

    if (!isExist) {
      const addWishList = await WISHLIST.create(data);
      await setResponseObject(req, true, resp);
      next();
    } else {
      const updateData = await WISHLIST.findByIdAndDelete({
        _id: isExist._id,
      });

      if (data?.web == true) {
        await setResponseObject(req, true, resp);
        next();
      }
      await setResponseObject(req, true, resp, updateData);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY WISHLIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
wishlist.getwishList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let typeFilter = {};
    switch (req.query.type) {
      case "1":
        typeFilter = {
          type: CONST.PRODUCT,
        };
        break;

      case "2":
        typeFilter = {
          type: CONST.COMPANY,
        };
        break;

      default:
        break;
    }

    let resp =
      req.query.type == 1
        ? "Wishlist product found successfully"
        : "Wishlist company found successfully";

    const wishList = await WISHLIST.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $match: typeFilter,
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" }, // LOCAL FIELD
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
                isWishlist: 1,
                companyDetails: 1,
                branchDetails: 1,
                createdBy: 1,
                cartDetails: 1,
                totalQuantityInCart: 1,
                dynamicquestions: 1,
                averageRating: 1,
                classification: 1,
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$companyId" }, // LOCAL FIELD
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
              },
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
            {
              $unset: ["activeBranches"],
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: {
          createdAt: -1,
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
    if (wishList && wishList[0].data.length) {
      await setResponseObject(
        req,
        true,
        resp,
        wishList[0].data,
        wishList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Wishlist data not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = wishlist;
