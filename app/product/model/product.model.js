/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product = new Schema(
  {
    productName: {
      type: String,
    },
    productArabicName: {
      type: String,
    },
    description: {
      type: String,
    },
    arabicDescription: {
      type: String,
    },
    productImg: [
      {
        url: {
          type: String,
        },
        type: { type: String },
      },
    ],
    price: {
      type: Number,
    },
    mrpPrice: {
      type: Number,
    },
    pickupCost: {
      type: Number,
    },
    discount: {
      type: Number,
      default: null,
    },
    size: [
      {
        sizes: {
          type: String,
        },
        price: {
          type: Number,
        },
        mrp: {
          type: Number,
        },
        discount: {
          type: Number,
          default: null,
        },
      },
    ],
    color: [
      {
        type: String,
      },
    ],
    weight: {
      type: String,
    },
    material: {
      type: String,
    },
    model: {
      type: String,
    },
    modelNumber: {
      type: String,
    },
    productCode: {
      type: String,
    },
    serialCode: {
      type: String,
    },
    power: {
      type: String,
    },
    madeIn: {
      type: String,
    },
    warranty: {
      type: String,
    },
    deliveryCost: {
      type: Number,
    },
    prepareTime: {
      type: String,
    },
    brand: {
      type: String,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    classification: {
      type: mongoose.Types.ObjectId,
      ref: "classification",
    },
    subcategoryId: {
      type: mongoose.Types.ObjectId,
      ref: "subcategory",
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "branch",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    address: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    stateId: {
      type: Number,
      enum: [
        CONST.ACTIVE,
        CONST.INACTIVE,
        CONST.DELETED,
        CONST.PENDING,
        CONST.REJECT,
        CONST.OUT_STOCK,
      ],
      default: CONST.PENDING,
    },
    couponValidity: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    termsCondition: {
      type: String,
    },
    arabicTermsCondition: {
      type: String,
    },
    offerContent: {
      type: String,
    },
    arabicOfferContent: {
      type: String,
    },
    order: {
      type: Number,
    },
    returnPolicy: {
      type: String,
    },
    arabicReturnPolicy: {
      type: String,
    },
    isDelivered: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
    },
  },
  { timestamps: true }
);

product.index({ company: 1 });
module.exports.PRODUCT_MODEL = mongoose.model("product", product);
