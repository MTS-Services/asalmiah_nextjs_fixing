/** 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CART } = require("../model/model");
const { PRODUCT_MODEL } = require("../../../app/product/model/product.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { PROMO_CODE } = require("../../promoCode/model/model");
const { CONST } = require("../../../helpers/constant");
const moment = require("moment");
const { ANSWER_MODEL } = require("../../dynamicQuestion/model/model");
const {
  USER_SPINNER_MODEL,
  SPINNER_MODEL,
} = require("../../spinner/model/spinner.model");
const { COMPANY_MODEL } = require("../../company/model/model");

const cart = {};

/**
 * ADD PRODUCT IN CART
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.addCart = async (req, res, next) => {
  try {
    const data = req.body;

    data.createdBy = req.userId;

    const findProduct = await PRODUCT_MODEL.findById({ _id: data.productId });
    const findCompany = await COMPANY_MODEL.findOne({
      _id: findProduct?.company,
    });

    data.companyId = findProduct?.company;
    data.productName = findProduct?.productName;
    data.shippingCharge = findCompany.costDelivery;
    data.deliveryCost = findProduct.deliveryCost;

    const product = await PRODUCT_MODEL.findOne({
      _id: data.productId,
    });

    const myCart = await CART.findOne({ createdBy: req.userId }).sort({
      createdAt: -1,
    });

    if (myCart) {
      DiffCompany = {
        DiffCompany: true,
      };
      if (data.branch) {
        if (
          data.branch != myCart?.branch &&
          findProduct.company == findProduct?.company
        ) {
          await setResponseObject(
            req,
            false,
            "Your cart having products from different company or branch, please completed the current purchase",
            "",
            "",
            "",
            "",
            DiffCompany
          );
          next();
          return;
        }
      }
      if (!myCart.companyId.equals(findProduct.company)) {
        await setResponseObject(
          req,
          false,
          "Your cart having products from different company, please completed the current purchase",
          "",
          "",
          "",
          "",
          DiffCompany
        );
        next();
        return;
      }
    }

    const filter = [{ createdBy: new mongoose.Types.ObjectId(req.userId) }];

    // Check for productId, size, and color in the request body
    if (req.body.productId) {
      filter.push({ productId: req.body.productId });
    }

    if (req.body.size) {
      filter.push({ size: req.body.size });
    }

    if (req.body.color) {
      filter.push({ color: req.body.color });
    }

    // Use $and to combine all conditions in the filter
    let isExist = await CART.findOne({ $and: filter });

    if (isExist) {
      let quantity = parseInt(data.quantity) + parseInt(isExist.quantity);

      if (quantity <= findProduct.quantity) {
        const quantity = parseInt(isExist.quantity) + parseInt(data.quantity);
        data.quantity = quantity;

        const price = parseInt(quantity) * data.purchase_Price;
        const productCost = parseInt(quantity) * data.product_cost;

        data.purchase_Price = price;
        data.product_cost = productCost;

        const updateCart = await CART.findByIdAndUpdate(
          { _id: isExist._id },
          data,
          {
            new: true,
          }
        )
          .populate("productId")
          .populate("companyId")
          .populate("branch");
        if (updateCart) {
          await setResponseObject(
            req,
            true,
            "Product added in cart successfully",
            updateCart
          );
          next();
        } else {
          await setResponseObject(req, false, "Product not added in cart");
          next();
        }
      } else {
        await setResponseObject(req, false, "Product reached the limit");
        next();
      }
    } else {
      if (data.quantity <= findProduct.quantity) {
        data.productPrice = data.purchase_Price;
        data.mrp = data.purchase_Price;
        const price = data.quantity * data.purchase_Price;
        data.purchase_Price = price;

        const newCart = await CART.create(data);
        const addCart = await CART.findById(newCart._id)
          .populate("productId")
          .populate("companyId")
          .populate("branch");

        if (addCart) {
          const storeAnswer = await ANSWER_MODEL.create({
            answers: data.answers,
          });

          await setResponseObject(
            req,
            true,
            "Product added in cart successfully",
            addCart
          );
          next();
        } else {
          await setResponseObject(req, false, "Product not added in cart");
          next();
        }
      } else {
        await setResponseObject(req, false, "Product reached the limit");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY CART LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.myCart = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let cartList = await CART.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" },
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
                quantity: 1,
                stateId: 1,
                company: 1,
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
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "promocodes",
          let: { id: "$promocode" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "promoDetails",
        },
      },
      {
        $unwind: { path: "$promoDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "spinnerwins",
          let: { id: "$rewardId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
                      arabicCompany: 1,
                      couponService: 1,
                      deliveryEligible: 1,
                      deliveryService: 1,
                      pickupService: 1,
                      deliveryCompany: 1,
                      costDelivery: 1,
                      logo: 1,
                      coverImg: 1,
                    },
                  },
                ],
                as: "company",
              },
            },
            {
              $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "categories",
                let: { id: "$category" }, // foreign key
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
          ],
          as: "rewardDetails",
        },
      },
      {
        $unwind: {
          path: "$rewardDetails",
          preserveNullAndEmptyArrays: true,
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
                firstName: 1,
                lastName: 1,
                fullName: 1,
                profileImg: 1,
              },
            },
            {
              $lookup: {
                from: "wallets",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$userId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      amount: 1,
                    },
                  },
                ],
                as: "walletDetails",
              },
            },
            {
              $unwind: {
                path: "$walletDetails",
                preserveNullAndEmptyArrays: true,
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
        $project: {
          _id: true,
          quantity: true,
          purchase_Price: true,
          shippingCharge: true,
          note: true,
          size: true,
          color: true,
          note: true,
          discount: true,
          promocode: true,
          rewardDetails: true,
          productDetails: true,
          userDetails: true,
          promoDetails: true,
          productPrice: true,
          answers: true,
          rewardApplied: true,
          promotionApplied: true,
          companyId: 1,
        },
      },
    ]);
    let subTotal;
    let sum;
    let charge;
    let total;

    let findCompany = await COMPANY_MODEL.findOne({
      _id: cartList[0]?.companyId,
    });

    if (req?.query?.type == "REWARD") {
      if (req?.query?.rewardId) {
        const todayDate = new Date();
        const findPromotion = await USER_SPINNER_MODEL.findOne({
          _id: new mongoose.Types.ObjectId(req?.query?.rewardId),
        });

        const findSpinner = await SPINNER_MODEL.findOne({
          _id: new mongoose.Types.ObjectId(findPromotion.spinnerId),
        });

        const findProduct = await PRODUCT_MODEL.findOne({
          _id: cartList[0]?.productDetails._id,
        });

        const findCompany = await COMPANY_MODEL.findOne({
          _id: findProduct.company,
        });


        if (!findPromotion) {
          await setResponseObject(req, false, "Invalid reward");
          next();
          return;
        }

        if (findPromotion.isUsed == true) {
          await setResponseObject(req, false, "Already Used");
          next();
          return;
        }

        if (new Date(findPromotion.endDate) < todayDate) {
          await setResponseObject(req, false, "Reward  is expired");
          next();
          return;
        } else if (new Date(findPromotion.startDate) > todayDate) {
          await setResponseObject(req, false, "Reward not applicable");
          next();
          return;
        } else if (
          findSpinner?.category.toString() !==
          findCompany?.categoryId.toString()
        ) {
          await setResponseObject(
            req,
            false,
            "This Reward code is not applicable for this product"
          );
          next();
          return;
        } else if (
          findPromotion?.category &&
          findSpinner?.company.includes(findProduct?.company.toString())
        ) {
          await setResponseObject(
            req,
            false,
            "This Reward code is not applicable for this product"
          );
          next();
          return;
        } else {
          subTotal = 0;
          sum = [];
          cartList.map((e) => {
            sum.push(e.purchase_Price);
            subTotal = subTotal + e.purchase_Price;
          });

          const cartCount = cartList.length;

          if (cartList) {
            if (
              findPromotion.spinType == CONST.PERCENTAGE ||
              findPromotion.spinType == CONST.FIX_AMOUNT
            ) {
              total = subTotal;
              if (subTotal < findPromotion.minAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than Reward min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    {
                      rewardApplied: true,
                      rewardId: new mongoose.Types.ObjectId(findPromotion?._id),
                    },
                    { new: true }
                  );
                });
              }
              let orderTotal = subTotal;
              charge = cartList[0]?.shippingCharge;
              total = subTotal + charge;

              let cashBack;
              if (findPromotion.spinType == CONST.PERCENTAGE) {
                cashBack = (findPromotion.value / 100) * orderTotal;
                if (cashBack > findPromotion.maxCashBack) {
                  cashBack = findPromotion.maxCashBack;
                }
              } else if (findPromotion.spinType == CONST.FIX_AMOUNT) {
                cashBack = findPromotion.maxCashBack;
              }
              cartList = await CART.aggregate([
                {
                  $match: {
                    createdBy: new mongoose.Types.ObjectId(req.userId),
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    rewardDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  orderTotal,
                  charge,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
              return;
            } else {
              if (findPromotion.spinType == CONST.FREE_DELIVERY) {
                charge = 0;
              } else {
                charge = cartList[0]?.shippingCharge;
              }

              let orderTotal = subTotal;
              total = subTotal + charge;

              if (subTotal < findPromotion.minAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than Reward min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    { rewardApplied: true, rewardId: findPromotion._id },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    createdBy: new mongoose.Types.ObjectId(req.userId),
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    rewardDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              let cashBack;
              if (findPromotion.spinType == CONST.PERCENTAGE) {
                cashBack = (findPromotion.discount / 100) * orderTotal;
              } else if (findPromotion.spinType == CONST.FIX_AMOUNT) {
                cashBack = findPromotion.discount;
              }

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  charge,
                  orderTotal,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
            }
          } else {
            await setResponseObject(req, true, "Cart list not found");
            next();
          }
        }
      }
    }

    // With promo code
    if (req?.query?.promoId) {
      const todayDate = moment(new Date()).format("YYYY-MM-DD");
      const findPromotion = await PROMO_CODE.findOne({
        promoCode: req?.query?.promoId,
      });

      if (!findPromotion) {
        await setResponseObject(req, false, "Invalid promocode");
        next();
        return;
      }

      if (
        findPromotion.stateId == CONST.INACTIVE ||
        findPromotion.stateId == CONST.DELETED
      ) {
        await setResponseObject(req, false, "Invalid promocode");
        next();
        return;
      }

      const findProduct = await PRODUCT_MODEL.findOne({
        _id: cartList[0]?.productDetails._id,
      });

      const isExist = await PROMO_CODE.findOne({
        promoCode: req?.query?.promoId,
        uesdUserCount: { $elemMatch: { userId: req.userId } },
      });

      const matchedUser = isExist?.uesdUserCount.filter((user) =>
        user.userId.equals(req.userId)
      )[0];

      if (findPromotion.endDate < todayDate) {
        await setResponseObject(req, false, "Promotion code is expired");
        next();
        return;
      } else if (findPromotion.startDate > todayDate) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion.type == CONST.CATEGORY &&
        findPromotion.categoryId.toString() != findCompany.categoryId.toString()
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion?.type == CONST.PROMO_COMPANY &&
        !findPromotion?.company.includes(findProduct?.company.toString())
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion?.type == CONST.CATEGORY &&
        findPromotion?.excludedCompany.includes(findProduct?.company.toString())
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion?.type == CONST.PROMO_COMPANY &&
        findPromotion?.productId.length > 0 &&
        cartList.some(
          (cartItem) =>
            !findPromotion?.productId.includes(cartItem.productDetails._id)
        )
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (matchedUser?.count >= findPromotion.numberOfUsedUser) {
        await setResponseObject(
          req,
          false,
          "You've reached the maximum number of uses for this promotion code."
        );
        next();
        return;
      } else if (
        findPromotion.uesdUserCount.length == findPromotion.numberOfUsed
      ) {
        await setResponseObject(
          req,
          false,
          "This promo code has reached its maximum user limit."
        );
        next();
        return;
      } else if (isExist?.length > findPromotion.numberOfUsed) {
        await setResponseObject(
          req,
          false,
          "This promo code has reached its maximum user limit."
        );
        next();
        return;
      } else {
        subTotal = 0;
        sum = [];
        cartList.map((e) => {
          sum.push(e.purchase_Price);
          subTotal = subTotal + e.purchase_Price;
        });

        const cartCount = cartList.length;
        if (cartList) {
          if (findPromotion.actionType == CONST.PROMOTION) {
            // With order type pickup and coupon
            if (
              req.query.orderType == CONST.PICKUP ||
              req.query.orderType == CONST.COUPON
            ) {
              total = subTotal;
              charge = 0;
              let cashbackType = (findPromotion.discount / 100) * subTotal;
              if (cashbackType > findPromotion.maxDiscountAmount) {
                cashbackType = findPromotion.maxDiscountAmount;
              }
              total = total - cashbackType;
              let orderTotal = total;

              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min pruchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    {
                      promotionApplied: true,
                      promocode: findPromotion._id,
                      cashbackAmount: cashbackType,
                    },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    createdBy: new mongoose.Types.ObjectId(req.userId),
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  charge,
                  subTotal,
                  orderTotal,
                  total,
                  cartCount,
                }
              );
              next();
              return;
            }
            // With out order type pickup and coupon
            else {
              if (findPromotion.forFreeDelivery == true) {
                charge = 0;
              } else {
                charge = cartList[0]?.shippingCharge;
              }

              let cashbackType = (findPromotion.discount / 100) * subTotal;
              if (cashbackType > findPromotion.maxDiscountAmount) {
                cashbackType = findPromotion.maxDiscountAmount;
              }
              let orderTotal = subTotal - cashbackType;
              total = orderTotal + charge;

              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    { promotionApplied: true, promocode: findPromotion._id },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    createdBy: new mongoose.Types.ObjectId(req.userId),
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  charge,
                  orderTotal,
                  total,
                  cartCount,
                }
              );
              next();
              return;
            }
          } else {
            if (
              req.query.orderType == CONST.PICKUP ||
              req.query.orderType == CONST.COUPON
            ) {
              total = subTotal;
              let orderTotal = subTotal;
              charge = 0;
              let cashBack;
              if (findPromotion.cashBackType == CONST.PERCENTAGE) {
                // cashBack = total - total * (findPromotion.discount / 100);
                cashBack = (findPromotion.discount / 100) * subTotal;

                if (cashBack > findPromotion.maxDiscountAmount) {
                  cashBack = findPromotion.maxDiscountAmount;
                }
              } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
                if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
                  cashBack = findPromotion.discount;
                }
                if (findPromotion.rotationCashBack == CONST.SEVERAL_TIME) {
                  let value = parseInt(total / findPromotion.minPurchaseAmount);
                  cashBack = parseInt(value * findPromotion.discount);
                }
              }
              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    {
                      promotionApplied: true,
                      promocode: findPromotion._id,
                      cashbackAmount: cashBack,
                    },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    createdBy: new mongoose.Types.ObjectId(req.userId),
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);
              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  orderTotal,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
              return;
            } else {
              if (findPromotion.forFreeDelivery == true) {
                charge = 0;
              } else {
                charge = cartList[0]?.shippingCharge;
              }

              let orderTotal = subTotal;
              total = subTotal + charge;

              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    { promotionApplied: true, promocode: findPromotion._id },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    createdBy: new mongoose.Types.ObjectId(req.userId),
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                arabicCompany: 1,
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);
              let cashBack;
              if (findPromotion.cashBackType == CONST.PERCENTAGE) {
                // cashBack = total - total * (findPromotion.discount / 100);
                cashBack = (findPromotion.discount / 100) * subTotal;
                if (cashBack > findPromotion.maxDiscountAmount) {
                  cashBack = findPromotion.maxDiscountAmount;
                }
              } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
                if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
                  cashBack = findPromotion.discount;
                }
                if (findPromotion.rotationCashBack == CONST.SEVERAL_TIME) {
                  let value = parseInt(total / findPromotion.minPurchaseAmount);
                  cashBack = parseInt(value * findPromotion.discount);
                }
              }

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  charge,
                  orderTotal,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
              return;
            }
          }
        } else {
          await setResponseObject(req, true, "Cart list not found");
          next();
        }
      }
    }
    // With out promo code
    cartList.map(async (e) => {
      if (e?.rewardApplied == true) {
        const findProduct = await CART.findOneAndUpdate(
          { _id: e._id },
          { rewardApplied: false, $unset: { rewardId: "" } },
          { new: true }
        );
      }
      if (e?.promotionApplied == true) {
        const findProduct = await CART.findOneAndUpdate(
          { _id: e._id },
          { promotionApplied: false, $unset: { promocode: "" } },
          { new: true }
        );
      }
    });

    subTotal = 0;
    sum = [];
    cartList.map((e) => {
      sum.push(e.purchase_Price);
      subTotal = subTotal + e.purchase_Price;
    });

    charge = cartList[0]?.shippingCharge;

    total = subTotal + charge;
    let orderTotal = subTotal + charge;

    const cartCount = cartList.length;

    cartList = await CART.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" },
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
                quantity: 1,
                stateId: 1,
                company: 1,
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
                      couponService: 1,
                      deliveryEligible: 1,
                      deliveryService: 1,
                      pickupService: 1,
                      deliveryCompany: 1,
                      costDelivery: 1,
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
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "promocodes",
          let: { id: "$promocode" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "promoDetails",
        },
      },
      {
        $unwind: { path: "$promoDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "spinnerwins",
          let: { id: "$rewardId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
                      arabicCompany: 1,
                      couponService: 1,
                      deliveryEligible: 1,
                      deliveryService: 1,
                      pickupService: 1,
                      deliveryCompany: 1,
                      costDelivery: 1,
                      logo: 1,
                      coverImg: 1,
                    },
                  },
                ],
                as: "company",
              },
            },
            {
              $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "categories",
                let: { id: "$category" }, // foreign key
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
          ],
          as: "rewardDetails",
        },
      },
      {
        $unwind: {
          path: "$rewardDetails",
          preserveNullAndEmptyArrays: true,
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
                // email: 1,
                firstName: 1,
                lastName: 1,
                fullName: 1,
                profileImg: 1,
                // countryCode: 1,
                // mobile: 1,
              },
            },
            {
              $lookup: {
                from: "wallets",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$userId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      amount: 1,
                    },
                  },
                ],
                as: "walletDetails",
              },
            },
            {
              $unwind: {
                path: "$walletDetails",
                preserveNullAndEmptyArrays: true,
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
        $project: {
          _id: true,
          quantity: true,
          purchase_Price: true,
          shippingCharge: true,
          note: true,
          size: true,
          color: true,
          note: true,
          discount: true,
          promocode: true,
          rewardDetails: true,
          productDetails: true,
          userDetails: true,
          promoDetails: true,
          productPrice: true,
          answers: true,
          rewardApplied: true,
          promotionApplied: true,
        },
      },
    ]);

    if (cartList) {
      if (
        req.query.orderType == CONST.PICKUP ||
        req.query.orderType == CONST.COUPON
      ) {
        total = subTotal;
        let orderTotal = subTotal;
        charge = 0;
        await setResponseObject(req, true, "Cart list found successfully", {
          cartList,
          // charge,
          subTotal,
          orderTotal,
          total,
          cartCount,
        });
        next();
      } else {
        await setResponseObject(req, true, "Cart list found successfully", {
          cartList,
          subTotal,
          charge,
          orderTotal,
          total,
          cartCount,
        });
        next();
      }
    } else {
      await setResponseObject(req, true, "Cart list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * REMOVE PRODUCT FROM CART
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.removeProduct = async (req, res, next) => {
  try {
    const removeProduct = await CART.findByIdAndDelete({ _id: req.params.id });
    if (removeProduct) {
      await setResponseObject(
        req,
        true,
        "Product remove from cart successfully"
      );
      next();
    } else {
      await setResponseObject(req, false, "Product not remove from cart");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * CLEAR PRODUCT FROM CART
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.cartClear = async (req, res, next) => {
  try {
    const clearCart = await CART.deleteMany({ createdBy: req.userId });
    if (clearCart) {
      await setResponseObject(req, true, "Cart clear successfully");
      next();
    } else {
      await setResponseObject(req, false, "Cart not clear");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * INCREASE CART QUANTITY
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.increaseQuantity = async (req, res, next) => {
  try {
    const data = req.body;

    const findCart = await CART.findById({ _id: req.params.id });

    const findProduct = await PRODUCT_MODEL.findById({
      _id: findCart?.productId,
    });

    let quantity;
    if (data.quantity && data.web == true) {
      quantity = data.quantity;

      const price = data.quantity * findCart.productPrice;
      const productCost = data.quantity * findProduct.pickupCost;

      if (data.quantity <= findProduct.quantity) {
        const increaseQuantity = await CART.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
          {
            quantity: data.quantity,
            purchase_Price: price,
            product_cost: productCost,
          },
          {
            new: true,
          }
        );
        if (increaseQuantity) {
          await setResponseObject(
            req,
            true,
            "Qantity added successfully",
            increaseQuantity
          );
          next();
        } else {
          await setResponseObject(req, false, "Qantity not added successfully");
          next();
        }
      } else {
        await setResponseObject(req, false, "Product not sufficient");
        next();
      }
    } else {
      quantity = parseInt(findCart.quantity) + parseInt(data.quantity);
      const price = quantity * findCart.productPrice;

      if (data.quantity <= findProduct.quantity) {
        const increaseQuantity = await CART.findByIdAndUpdate(
          {
            _id: req.params.id,
          },
          {
            $inc: {
              quantity: data.quantity,
            },
            purchase_Price: price,
          },
          {
            new: true,
          }
        );
        if (increaseQuantity) {
          await setResponseObject(
            req,
            true,
            "Qantity added successfully",
            increaseQuantity
          );
          next();
        } else {
          await setResponseObject(req, false, "Qantity not added successfully");
          next();
        }
      } else {
        await setResponseObject(req, false, "Product not sufficient");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**s
 * DECREASE CART QUANTITY
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.decreaseQuantity = async (req, res, next) => {
  try {
    const data = req.body;

    const findCart = await CART.findById({ _id: req.params.id });

    const findProduct = await PRODUCT_MODEL.findById({
      _id: findCart.productId,
    });

    if (data.quantity && data.web == true) {
      const price = data.quantity * findCart.productPrice;

      const decreaseQuantity = await CART.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          quantity: data.quantity,

          purchase_Price: price,
        },
        {
          new: true,
        }
      );
      if (decreaseQuantity) {
        await setResponseObject(
          req,
          true,
          "Qantity remove successfully",
          decreaseQuantity
        );
        next();
      } else {
        await setResponseObject(req, false, "Qantity not remove");
        next();
      }
    } else {
      const price = data.quantity * findCart.productPrice;

      const minusPrice = findCart.purchase_Price - price;
      const decreaseQuantity = await CART.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $inc: {
            quantity: data.quantity * -1,
          },
          purchase_Price: minusPrice,
        },
        {
          new: true,
        }
      );
      if (decreaseQuantity) {
        await setResponseObject(
          req,
          true,
          "Qantity remove successfully",
          decreaseQuantity
        );
        next();
      } else {
        await setResponseObject(req, false, "Qantity not remove");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ADD PRODUCT IN CART PUBLIC
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.addCartPublic = async (req, res, next) => {
  try {
    const data = req.body;
    data.deviceToken = data.deviceToken;
    data.createdBy = null;

    const findProduct = await PRODUCT_MODEL.findById({ _id: data.productId });
    const findCompany = await COMPANY_MODEL.findOne({
      _id: findProduct?.company,
    });

    data.companyId = findProduct?.company;
    data.productName = findProduct?.productName;
    data.shippingCharge = findCompany.costDelivery;
    data.deliveryCost = findProduct.deliveryCost;

    const product = await PRODUCT_MODEL.findOne({
      _id: data.productId,
    });

    const myCart = await CART.findOne({ deviceToken: data.deviceToken }).sort({
      createdAt: -1,
    });

    if (myCart) {
      DiffCompany = {
        DiffCompany: true,
      };

      if (data.branch) {
        if (
          data.branch != myCart?.branch &&
          findProduct.company == findProduct?.company
        ) {
          await setResponseObject(
            req,
            false,
            "Your cart having products from different company or branch, please completed the current purchase",
            "",
            "",
            "",
            "",
            DiffCompany
          );
          next();
          return;
        }
      }
      if (!myCart.companyId.equals(findProduct.company)) {
        await setResponseObject(
          req,
          false,
          "Your cart having products from different company, please completed the current purchase",
          "",
          "",
          "",
          "",
          DiffCompany
        );
        next();
        return;
      }
    }

    const filter = [{ deviceToken: data.deviceToken }];

    // Check for productId, size, and color in the request body
    if (req.body.productId) {
      filter.push({ productId: req.body.productId });
    }

    if (req.body.size) {
      filter.push({ size: req.body.size });
    }

    if (req.body.color) {
      filter.push({ color: req.body.color });
    }

    // Use $and to combine all conditions in the filter
    let isExist = await CART.findOne({ $and: filter });

    if (isExist) {
      let quantity = parseInt(data.quantity) + parseInt(isExist.quantity);

      if (quantity <= findProduct.quantity) {
        const quantity = parseInt(isExist.quantity) + parseInt(data.quantity);
        data.quantity = quantity;

        const price = parseInt(quantity) * data.purchase_Price;
        const productCost = parseInt(quantity) * data.product_cost;

        data.purchase_Price = price;
        data.product_cost = productCost;
        // data.shippingCharge = findProduct?.deliveryCost
        //   ? findProduct?.deliveryCost
        //   : 0
        //   ? findProduct?.deliveryCost
        //   : 0;

        const updateCart = await CART.findByIdAndUpdate(
          { _id: isExist._id },
          data,
          {
            new: true,
          }
        )
          .populate("productId")
          .populate("companyId")
          .populate("branch");
        if (updateCart) {
          await setResponseObject(
            req,
            true,
            "Product added in cart successfully",
            updateCart
          );
          next();
        } else {
          await setResponseObject(req, false, "Product not added in cart");
          next();
        }
      } else {
        await setResponseObject(req, false, "Product reached the limit");
        next();
      }
    } else {
      if (data.quantity <= findProduct.quantity) {
        data.productPrice = data.purchase_Price;
        data.mrp = data.purchase_Price;
        const price = data.quantity * data.purchase_Price;
        data.purchase_Price = price;

        const newCart = await CART.create(data);

        const addCart = await CART.findById(newCart._id)
          .populate("productId")
          .populate("companyId")
          .populate("branch");

        if (addCart) {
          const storeAnswer = await ANSWER_MODEL.create({
            answers: data?.answers,
          });

          await setResponseObject(
            req,
            true,
            "Product added in cart successfully",
            addCart
          );
          next();
        } else {
          await setResponseObject(req, false, "Product not added in cart");
          next();
        }
      } else {
        await setResponseObject(req, false, "Product reached the limit");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY CART LIST PUBLIC
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.myCartPublic = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let cartList = await CART.aggregate([
      {
        $match: {
          $and: [
            { deviceToken: req.query.deviceToken },
            { createdBy: { $eq: null } },
          ],
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" },
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
                quantity: 1,
                stateId: 1,
                company: 1,
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
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "promocodes",
          let: { id: "$promocode" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "promoDetails",
        },
      },
      {
        $unwind: { path: "$promoDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "spinnerwins",
          let: { id: "$rewardId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
                      couponService: 1,
                      deliveryEligible: 1,
                      deliveryService: 1,
                      pickupService: 1,
                      deliveryCompany: 1,
                      costDelivery: 1,
                      logo: 1,
                      coverImg: 1,
                    },
                  },
                ],
                as: "company",
              },
            },
            {
              $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "categories",
                let: { id: "$category" }, // foreign key
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
          ],
          as: "rewardDetails",
        },
      },
      {
        $unwind: {
          path: "$rewardDetails",
          preserveNullAndEmptyArrays: true,
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
                firstName: 1,
                lastName: 1,
                fullName: 1,
                profileImg: 1,
              },
            },
            {
              $lookup: {
                from: "wallets",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$userId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      amount: 1,
                    },
                  },
                ],
                as: "walletDetails",
              },
            },
            {
              $unwind: {
                path: "$walletDetails",
                preserveNullAndEmptyArrays: true,
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
        $project: {
          _id: true,
          quantity: true,
          purchase_Price: true,
          shippingCharge: true,
          note: true,
          size: true,
          color: true,
          note: true,
          discount: true,
          promocode: true,
          rewardDetails: true,
          productDetails: true,
          userDetails: true,
          promoDetails: true,
          productPrice: true,
          answers: true,
          rewardApplied: true,
          promotionApplied: true,
          companyId: 1,
        },
      },
    ]);
    let subTotal;
    let sum;
    let charge;
    let total;

    let findCompany = await COMPANY_MODEL.findOne({
      _id: cartList[0]?.companyId,
    });

    if (req?.query?.type == "REWARD") {
      if (req?.query?.rewardId) {
        const todayDate = new Date();
        const findPromotion = await USER_SPINNER_MODEL.findOne({
          _id: new mongoose.Types.ObjectId(req?.query?.rewardId),
        });

        if (!findPromotion) {
          await setResponseObject(req, false, "Invalid reward");
          next();
          return;
        }

        if (findPromotion.isUsed == true) {
          await setResponseObject(req, false, "Already Used");
          next();
          return;
        }

        const findProduct = await PRODUCT_MODEL.findOne({
          _id: cartList[0]?.productDetails._id,
        });

        if (new Date(findPromotion.endDate) < todayDate) {
          await setResponseObject(req, false, "Reward  is expired");
          next();
          return;
        } else if (new Date(findPromotion.startDate) > todayDate) {
          await setResponseObject(req, false, "Reward not applicable");
          next();
          return;
        } else if (
          findPromotion?.company &&
          findPromotion?.company.toString() !== findProduct?.company.toString()
        ) {
          await setResponseObject(
            req,
            false,
            "This Reward code is not applicable for this product"
          );
          next();
          return;
        } else {
          subTotal = 0;
          sum = [];
          cartList.map((e) => {
            sum.push(e.purchase_Price);
            subTotal = subTotal + e.purchase_Price;
          });

          const cartCount = cartList.length;

          if (cartList) {
            if (
              findPromotion.spinType == CONST.PERCENTAGE ||
              findPromotion.spinType == CONST.FIX_AMOUNT
            ) {
              total = subTotal;
              if (subTotal < findPromotion.minAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than Reward min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    {
                      rewardApplied: true,
                      rewardId: new mongoose.Types.ObjectId(findPromotion._id),
                    },
                    { new: true }
                  );
                });
              }
              let orderTotal = subTotal;
              charge = cartList[0]?.shippingCharge;
              total = subTotal + charge;

              let cashBack;
              if (findPromotion.spinType == CONST.PERCENTAGE) {
                cashBack =
                  orderTotal - orderTotal * (findPromotion.value / 100);
                if (cashBack > findPromotion.maxCashBack) {
                  cashBack = findPromotion.maxCashBack;
                }
              } else if (findPromotion.spinType == CONST.FIX_AMOUNT) {
                cashBack = findPromotion.maxCashBack;
              }
              cartList = await CART.aggregate([
                {
                  $match: {
                    $and: [
                      { deviceToken: req.query.deviceToken },
                      { createdBy: { $eq: null } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    rewardDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  orderTotal,
                  charge,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
              return;
            } else {
              if (findPromotion.spinType == CONST.FREE_DELIVERY) {
                charge = 0;
              } else {
                charge = cartList[0]?.shippingCharge;
              }

              let orderTotal = subTotal;
              total = subTotal + charge;

              if (subTotal < findPromotion.minAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than Reward min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    { rewardApplied: true, rewardId: findPromotion._id },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    $and: [
                      { deviceToken: req.query.deviceToken },
                      { createdBy: { $eq: null } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    rewardDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              let cashBack;
              if (findPromotion.spinType == CONST.PERCENTAGE) {
                cashBack = total - total * (findPromotion.discount / 100);
              } else if (findPromotion.spinType == CONST.FIX_AMOUNT) {
                cashBack = findPromotion.discount;
              }

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  charge,
                  orderTotal,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
            }
          } else {
            await setResponseObject(req, true, "Cart list not found");
            next();
          }
        }
      }
    }

    // With promo code
    if (req?.query?.promoId) {
      const todayDate = moment(new Date()).format("YYYY-MM-DD");
      const findPromotion = await PROMO_CODE.findOne({
        promoCode: req?.query?.promoId,
      });

      if (!findPromotion) {
        await setResponseObject(req, false, "Invalid promocode");
        next();
        return;
      }

      if (
        findPromotion.stateId == CONST.INACTIVE ||
        findPromotion.stateId == CONST.DELETED
      ) {
        await setResponseObject(req, false, "Invalid promocode");
        next();
        return;
      }

      const findProduct = await PRODUCT_MODEL.findOne({
        _id: cartList[0]?.productDetails._id,
      });

      const isExist = await PROMO_CODE.findOne({
        promoCode: req?.query?.promoId,
        uesdUserCount: { $elemMatch: { userId: req.userId } },
      });

      const matchedUser = isExist?.uesdUserCount.filter((user) =>
        user.userId.equals(req.userId)
      )[0];

      if (findPromotion.endDate < todayDate) {
        await setResponseObject(req, false, "Promotion code is expired");
        next();
        return;
      } else if (findPromotion.startDate > todayDate) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion.type == CONST.CATEGORY &&
        findPromotion.categoryId.toString() != findCompany.categoryId.toString()
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion?.type == CONST.PROMO_COMPANY &&
        !findPromotion?.company.includes(findProduct?.company.toString())
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (
        findPromotion?.type == CONST.PROMO_COMPANY &&
        findPromotion?.productId.length > 0 &&
        cartList.some(
          (cartItem) =>
            !findPromotion?.productId.includes(cartItem.productDetails._id)
        )
      ) {
        await setResponseObject(
          req,
          false,
          "This promotion code is not applicable"
        );
        next();
        return;
      } else if (matchedUser?.count >= findPromotion.numberOfUsedUser) {
        await setResponseObject(
          req,
          false,
          "You've reached the maximum number of uses for this promotion code."
        );
        next();
        return;
      } else if (
        findPromotion.uesdUserCount.length == findPromotion.numberOfUsed
      ) {
        await setResponseObject(
          req,
          false,
          "This promo code has reached its maximum user limit."
        );
        next();
        return;
      } else if (isExist?.length > findPromotion.numberOfUsed) {
        await setResponseObject(
          req,
          false,
          "This promo code has reached its maximum user limit."
        );
        next();
        return;
      } else {
        subTotal = 0;
        sum = [];
        cartList.map((e) => {
          sum.push(e.purchase_Price);
          subTotal = subTotal + e.purchase_Price;
        });

        const cartCount = cartList.length;

        if (cartList) {
          if (findPromotion.actionType == CONST.PROMOTION) {
            // With order type pickup and coupon
            if (
              req.query.orderType == CONST.PICKUP ||
              req.query.orderType == CONST.COUPON
            ) {
              total = subTotal;
              charge = 0;
              let cashbackType = total * (findPromotion.discount / 100);
              if (cashbackType > findPromotion.maxDiscountAmount) {
                cashbackType = findPromotion.maxDiscountAmount;
              }
              total = total - cashbackType;
              let orderTotal = total;

              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min pruchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    {
                      promotionApplied: true,
                      promocode: findPromotion._id,
                      cashbackAmount: cashbackType,
                    },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    $and: [
                      { deviceToken: req.query.deviceToken },
                      { createdBy: { $eq: null } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  charge,
                  subTotal,
                  orderTotal,
                  total,
                  cartCount,
                }
              );
              next();
              return;
            }
            // Wissth out order type pickup and coupon
            else {
              if (findPromotion.forFreeDelivery == true) {
                charge = 0;
              } else {
                charge = cartList[0]?.shippingCharge;
              }

              let cashbackType = subTotal * (findPromotion.discount / 100);
              if (cashbackType > findPromotion.maxDiscountAmount) {
                cashbackType = findPromotion.maxDiscountAmount;
              }
              let orderTotal = subTotal - cashbackType;
              total = orderTotal + charge;

              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    { promotionApplied: true, promocode: findPromotion._id },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    $and: [
                      { deviceToken: req.query.deviceToken },
                      { createdBy: { $eq: null } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  charge,
                  orderTotal,
                  total,
                  cartCount,
                }
              );
              next();
              return;
            }
          } else {
            if (
              req.query.orderType == CONST.PICKUP ||
              req.query.orderType == CONST.COUPON
            ) {
              total = subTotal;
              let orderTotal = subTotal;
              charge = 0;
              let cashBack;
              if (findPromotion.cashBackType == CONST.PERCENTAGE) {
                cashBack = total - total * (findPromotion.discount / 100);
                if (cashBack > findPromotion.maxDiscountAmount) {
                  cashBack = findPromotion.maxDiscountAmount;
                }
              } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
                if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
                  cashBack = findPromotion.discount;
                }
                if (findPromotion.rotationCashBack == CONST.SEVERAL_TIME) {
                  let value = parseInt(total / findPromotion.minPurchaseAmount);
                  cashBack = parseInt(value * findPromotion.discount);
                }
              }
              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    {
                      promotionApplied: true,
                      promocode: findPromotion._id,
                      cashbackAmount: cashBack,
                    },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    $and: [
                      { deviceToken: req.query.deviceToken },
                      { createdBy: { $eq: null } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);
              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  orderTotal,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
              return;
            } else {
              if (findPromotion.forFreeDelivery == true) {
                charge = 0;
              } else {
                charge = cartList[0]?.shippingCharge;
              }

              let orderTotal = subTotal;
              total = subTotal + charge;

              if (subTotal < findPromotion.minPurchaseAmount) {
                await setResponseObject(
                  req,
                  false,
                  "Cart subTotal amount is less than promocode's min purchase amount"
                );
                next();
                return;
              } else {
                cartList.map(async (e) => {
                  const findProduct = await CART.findOneAndUpdate(
                    { _id: e._id },
                    { promotionApplied: true, promocode: findPromotion._id },
                    { new: true }
                  );
                });
              }

              cartList = await CART.aggregate([
                {
                  $match: {
                    $and: [
                      { deviceToken: req.query.deviceToken },
                      { createdBy: { $eq: null } },
                    ],
                  },
                },
                {
                  $lookup: {
                    from: "products",
                    let: { id: "$productId" },
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
                          quantity: 1,
                          stateId: 1,
                          company: 1,
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
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
                    ],
                    as: "productDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$productDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "promocodes",
                    let: { id: "$promocode" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
                        },
                      },
                    ],
                    as: "promoDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$promoDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "spinnerwins",
                    let: { id: "$rewardId" },
                    pipeline: [
                      {
                        $match: {
                          $expr: { $eq: ["$$id", "$_id"] },
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
                                      $ifNull: [
                                        "$arabicDescription",
                                        "$description",
                                      ], // Use arabicCategory if it exists, otherwise use category
                                    }, // Use arabicDescription if language is Arabic
                                    else: "$description", // Use description otherwise
                                  },
                                },
                                couponService: 1,
                                deliveryEligible: 1,
                                deliveryService: 1,
                                pickupService: 1,
                                deliveryCompany: 1,
                                costDelivery: 1,
                                logo: 1,
                                coverImg: 1,
                              },
                            },
                          ],
                          as: "company",
                        },
                      },
                      {
                        $unwind: {
                          path: "$company",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                      {
                        $lookup: {
                          from: "categories",
                          let: { id: "$category" }, // foreign key
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
                    ],
                    as: "rewardDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$rewardDetails",
                    preserveNullAndEmptyArrays: true,
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
                          // email: 1,
                          firstName: 1,
                          lastName: 1,
                          fullName: 1,
                          profileImg: 1,
                          // countryCode: 1,
                          // mobile: 1,
                        },
                      },
                      {
                        $lookup: {
                          from: "wallets",
                          let: { id: "$_id" },
                          pipeline: [
                            {
                              $match: {
                                $expr: { $eq: ["$$id", "$userId"] },
                              },
                            },
                            {
                              $project: {
                                _id: 1,
                                amount: 1,
                              },
                            },
                          ],
                          as: "walletDetails",
                        },
                      },
                      {
                        $unwind: {
                          path: "$walletDetails",
                          preserveNullAndEmptyArrays: true,
                        },
                      },
                    ],
                    as: "userDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: true,
                    quantity: true,
                    purchase_Price: true,
                    shippingCharge: true,
                    note: true,
                    size: true,
                    color: true,
                    note: true,
                    discount: true,
                    promocode: true,
                    rewardDetails: true,
                    productDetails: true,
                    userDetails: true,
                    promoDetails: true,
                    productPrice: true,
                    answers: true,
                    rewardApplied: true,
                    promotionApplied: true,
                  },
                },
              ]);
              let cashBack;
              if (findPromotion.cashBackType == CONST.PERCENTAGE) {
                cashBack = total - total * (findPromotion.discount / 100);
                if (cashBack > findPromotion.maxDiscountAmount) {
                  cashBack = findPromotion.maxDiscountAmount;
                }
              } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
                if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
                  cashBack = findPromotion.discount;
                }
                if (findPromotion.rotationCashBack == CONST.SEVERAL_TIME) {
                  let value = parseInt(total / findPromotion.minPurchaseAmount);
                  cashBack = parseInt(value * findPromotion.discount);
                }
              }

              await setResponseObject(
                req,
                true,
                "Cart list found successfully",
                {
                  cartList,
                  subTotal,
                  charge,
                  orderTotal,
                  total,
                  cartCount,
                  cashBack,
                }
              );
              next();
              return;
            }
          }
        } else {
          await setResponseObject(req, true, "Cart list not found");
          next();
        }
      }
    }
    // With out promo code
    cartList.map(async (e) => {
      if (e?.rewardApplied == true) {
        const findProduct = await CART.findOneAndUpdate(
          { _id: e._id },
          { rewardApplied: false, $unset: { rewardId: "" } },
          { new: true }
        );
      }
      if (e?.promotionApplied == true) {
        const findProduct = await CART.findOneAndUpdate(
          { _id: e._id },
          { promotionApplied: false, $unset: { promocode: "" } },
          { new: true }
        );
      }
    });

    subTotal = 0;
    sum = [];
    cartList.map((e) => {
      sum.push(e.purchase_Price);
      subTotal = subTotal + e.purchase_Price;
    });

    charge = cartList[0]?.shippingCharge;

    total = subTotal + charge;
    let orderTotal = subTotal + charge;

    const cartCount = cartList.length;

    cartList = await CART.aggregate([
      {
        $match: {
          $and: [
            { deviceToken: req.query.deviceToken },
            { createdBy: { $eq: null } },
          ],
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" },
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
                quantity: 1,
                stateId: 1,
                company: 1,
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
                      couponService: 1,
                      deliveryEligible: 1,
                      deliveryService: 1,
                      pickupService: 1,
                      deliveryCompany: 1,
                      costDelivery: 1,
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
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "promocodes",
          let: { id: "$promocode" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "promoDetails",
        },
      },
      {
        $unwind: { path: "$promoDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "spinnerwins",
          let: { id: "$rewardId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
                      couponService: 1,
                      deliveryEligible: 1,
                      deliveryService: 1,
                      pickupService: 1,
                      deliveryCompany: 1,
                      costDelivery: 1,
                      logo: 1,
                      coverImg: 1,
                    },
                  },
                ],
                as: "company",
              },
            },
            {
              $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: "categories",
                let: { id: "$category" }, // foreign key
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
          ],
          as: "rewardDetails",
        },
      },
      {
        $unwind: {
          path: "$rewardDetails",
          preserveNullAndEmptyArrays: true,
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
                // email: 1,
                firstName: 1,
                lastName: 1,
                fullName: 1,
                profileImg: 1,
                // countryCode: 1,
                // mobile: 1,
              },
            },
            {
              $lookup: {
                from: "wallets",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$userId"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      amount: 1,
                    },
                  },
                ],
                as: "walletDetails",
              },
            },
            {
              $unwind: {
                path: "$walletDetails",
                preserveNullAndEmptyArrays: true,
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
        $project: {
          _id: true,
          quantity: true,
          purchase_Price: true,
          shippingCharge: true,
          note: true,
          size: true,
          color: true,
          note: true,
          discount: true,
          promocode: true,
          rewardDetails: true,
          productDetails: true,
          userDetails: true,
          promoDetails: true,
          productPrice: true,
          answers: true,
          rewardApplied: true,
          promotionApplied: true,
        },
      },
    ]);

    if (cartList) {
      if (
        req.query.orderType == CONST.PICKUP ||
        req.query.orderType == CONST.COUPON
      ) {
        total = subTotal;
        let orderTotal = subTotal;
        charge = 0;
        await setResponseObject(req, true, "Cart list found successfully", {
          cartList,
          // charge,
          subTotal,
          orderTotal,
          total,
          cartCount,
        });
        next();
      } else {
        await setResponseObject(req, true, "Cart list found successfully", {
          cartList,
          subTotal,
          charge,
          orderTotal,
          total,
          cartCount,
        });
        next();
      }
    } else {
      await setResponseObject(req, true, "Cart list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * CLEAR PRODUCT FROM CART PUBLIC
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
cart.cartClearPublic = async (req, res, next) => {
  try {
    const clearCart = await CART.deleteMany({ deviceToken: req.params.id });
    if (clearCart) {
      await setResponseObject(req, true, "Cart clear successfully");
      next();
    } else {
      await setResponseObject(req, false, "Cart not clear");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = cart;
