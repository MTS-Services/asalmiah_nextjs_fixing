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
const schema = mongoose.Schema;
const order = new schema(
  {
    products: [
      {
        items: {
          type: mongoose.Types.ObjectId,
          ref: "products",
        },
        productName: {
          type: String,
        },
        productArabicName: {
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
        quantity: {
          type: Number,
        },
        product_price: {
          type: Number,
        },
        product_cost: {
          type: Number,
        },
        discount: {
          type: Number,
        },
        mrp: {
          type: Number,
        },
        deliveryCharge: {
          type: Number,
        },
        note: {
          type: String,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
        },
        deliveryCost: {
          type: Number,
        },
        productPrice: {
          type: Number,
        },
        answers: [
          {
            questionId: {
              type: mongoose.Schema.Types.Mixed,
              ref: "dynamicquestion",
              autopopulate: true,
            },
            answerId: {
              type: mongoose.Schema.Types.Mixed,
              ref: "dynamicquestion.answers",
            },
            _id: false,
          },
        ],
        isRefund: {
          type: Boolean,
          default: false,
        },
        productCode: {
          type: String,
        },
      },
    ],
    promoAmount: {
      type: Number,
    },
    orderId: {
      type: Number,
    },
    paymentIntentId: {
      type: String,
    },
    deliveryCharge: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    fullName: {
      type: String,
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: "address",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    reason: {
      type: String,
    },
    chargeId: {
      type: String,
    },
    promocode: {
      type: mongoose.Types.ObjectId,
      ref: "promocode",
    },
    rewardId: {
      type: mongoose.Types.ObjectId,
      ref: "spinnerwin",
    },
    couponCode: {
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    },
    isScan: {
      type: Boolean,
    },
    deliveryStatus: {
      type: Number,
      enum: [
        CONST.PENDING,
        CONST.READY,
        CONST.SHIPPED,
        CONST.COMPLETED,
        CONST.CANCELED,
        CONST.UNDERPROCESS,
        CONST.ORDERDELETED,
      ],
      default: CONST.UNDERPROCESS,
    },
    paymentStatus: {
      type: String,
    },
    paymentType: {
      type: Number,
      enum: [CONST.ONLINE, CONST.OFFLINE, CONST.WALLETS],
    },
    purchaseCount: {
      type: Number,
    },
    offerType: {
      type: Number,
      enum: [CONST.ALL, CONST.CATEGORY, CONST.COMPANY],
    },
    branch: {
      type: mongoose.Types.ObjectId,
      ref: "branch",
    },
    orderType: {
      type: Number,
      enum: [CONST.DELIVERY, CONST.PICKUP, CONST.COUPON],
    },
    orderTracking: [
      {
        date: {
          type: String,
        },
        stateId: {
          type: Number,
          enum: [
            CONST.PENDING,
            CONST.READY,
            CONST.SHIPPED,
            CONST.COMPLETED,
            CONST.CANCELED,
          ],
          default: CONST.PENDING,
        },
      },
    ],
    asSoonas: {
      type: Boolean,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "company",
    },
    paymentReturnType: {
      type: Number,
      enum: [CONST.WALLET, CONST.ACCOUNT],
      default: CONST.WALLET,
    },
    code: {
      type: String,
    },
    trackingLink: {
      type: String,
    },
    walletAmount: {
      type: Number,
    },
    visibleToSeller: {
      type: Boolean,
      default: true,
    },
    deliveryCompanyChecked: {
      type: String,
    },
    deliveryCompany: {
      type: String,
    },
    deliveryCode: {
      type: String,
    },
    cashBack: {
      type: Number,
    },
    couponCode: {
      type: String,
    },
    qrCodeLink: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
