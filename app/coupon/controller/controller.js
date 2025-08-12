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
let { COUPON } = require("../model/model");
const mongoose = require("mongoose");
const QRCode = require("qrcode");
const ExcelJS = require("exceljs");
const moment = require("moment/moment");
const {
  generateOTP,
  generateUniqueID,
  formatNumber,
} = require("../../../middleware/commonFunction");
const ORDER = require("../../order/model/order.model");
const { USER } = require("../../userService/model/userModel");
const { BRANCH_MODEL } = require("../../branch/model/model");
const { COMPANY_MODEL } = require("../../company/model/model");
const { CONST } = require("../../../helpers/constant");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { PAYMENT } = require("../../payment/model/payment.model");
const { NOTIFICATION } = require("../../notification/model/notification.model");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const { STATEMENT_TRANSACTION } = require("../../statementAccount/model/model");
const { PROMO_CODE } = require("../../promoCode/model/model");

let couponCode = {};

/**
 * Promocode list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
couponCode.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search;
      const isNumber = !isNaN(parseFloat(searchValue));

      searchFilter = {
        $or: [
          {
            discount: isNumber
              ? parseFloat(searchValue)
              : { $regex: searchValue, $options: "i" },
          },
          { points: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    let list = await COUPON.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: searchFilter,
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
        "Coupon list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Coupon list not found", []);
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
couponCode.details = async (req, res, next) => {
  try {
    let details = await COUPON.aggregate([
      {
        $match: {
          $or: [
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { couponCode: req.params.id },
          ],
        },
      },
    ]);
    if (details.length > 0) {
      const qrData = {
        couponCode: details[0]?.couponCode,
        discount: details[0]?.discount,
        startDate: details[0]?.startDate,
        endDate: details[0]?.endDate,
        orderId: details[0]?.orderId,
      };
      const payloadString = JSON.stringify(qrData);
      // Generate the QR code
      let code = await QRCode.toDataURL(payloadString);
      details[0].qrcode = code;
      await setResponseObject(
        req,
        true,
        "Coupon code details found successfully",
        details[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Coupon code not view");
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
couponCode.manuallyAddCode = async (req, res, next) => {
  try {
    let data = req.body;

    let findSeller = await USER.findOne({
      _id: req.userId,
      stateId: { $ne: CONST.DELETED },
    });
    let details = await COUPON.findOne({
      couponCode: req.query.couponCode,
    }).populate("productId");

    const findOrder = await ORDER.findOne({
      _id: new mongoose.Types.ObjectId(details?.orderId),
    });
    data.orderId = findOrder._id;

    if (findSeller?.company?.toString() !== details?.company.toString()) {
      await setResponseObject(
        req,
        false,
        "This coupon not applicable for this company."
      );
      next();
      return;
    }

    if (findOrder?.products[0]?.isRefund == true) {
      await setResponseObject(req, false, "This coupon has been refunded.");

      next();
      return;
    }

    if (findOrder?.deliveryStatus == CONST.CANCELED) {
      await setResponseObject(req, false, "This coupon has been refunded.");

      next();
      return;
    }

    if (details) {
      let todayDate = new Date();
      let formattedDate = todayDate.toISOString();
      formattedDate = formattedDate.replace("Z", "+00:00");

      let date = formattedDate.split("T")[0];
      const today = new Date(date);

      const couponEndDate = details?.endDate;
      const couponEnd = new Date(couponEndDate);

      const todayDatePart = today.toISOString().split("T")[0];
      const couponEndDatePart = couponEnd?.toISOString().split("T")[0];

      if (details?.isUsed === true) {
        await setResponseObject(req, false, "Coupon code is already used");
        next();
        return;
      }
      if (todayDatePart > couponEndDatePart) {
        await setResponseObject(req, false, "Coupon code is expired");
        next();
        return;
      }

      await setResponseObject(
        req,
        true,
        "Coupon code details found successfully",
        details
      );

      next();
      let updateState = await COUPON.findOneAndUpdate(
        { couponCode: req.query.couponCode },
        { isUsed: true },
        { new: true }
      );

      // let data = req.body;
      // const findOrder = await ORDER.findOne({
      //   _id: new mongoose.Types.ObjectId(details?.orderId),
      // });
      // data.orderId = findOrder._id;
      const findProduct = await PRODUCT_MODEL.findOne({
        _id: details.productId,
      });

      const findUser = await USER.findOne({
        _id: details.createdBy,
      });

      const findBranch = await BRANCH_MODEL.findOne({
        _id: findSeller.branch,
      });

      const findCompany = await COMPANY_MODEL.findOne({
        _id: findSeller.company,
      });

      let order = findOrder;
      let dates = new Date();
      let obj = {
        date: dates.toISOString(),
        stateId: CONST.COMPLETED,
      };

      let updateOrder = await ORDER.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(order._id) },
        {
          couponCode: details._id,
          deliveryStatus: CONST.COMPLETED,
          orderTracking: obj,
          visibleToSeller: true,
        },
        { new: true }
      );

      let findPromo = await PROMO_CODE.findOne({ _id: order?.promocode });

      if (findCompany.commissionType == CONST.PERCENTAGE) {
        let isExist = await STATEMENT_TRANSACTION.find({
          company: findCompany._id,
          accountType: CONST.PERCENTAGE,
        })
          .sort({ createdAt: -1 })
          .limit(2);

        if (isExist.length > 0) {
          // Create invoice statement transaction
          let invoiceBalance = isExist[0].balance + details.itemPrice;
          let invoiceTranaction = {
            type: "Invoice",
            number: order.orderId,
            amountCr: formatNumber(details.itemPrice),
            balance: formatNumber(invoiceBalance),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.PERCENTAGE,
          };
          await STATEMENT_TRANSACTION.create(invoiceTranaction);

          let commission =
            details.itemPrice * (findCompany.perCommission / 100);
          let commisonBalance = invoiceTranaction.balance - commission;
          // Create commission statement transaction
          let commissionTranaction = {
            type: "Commission",
            number: order.orderId,
            amountDr: formatNumber(commission),
            balance: formatNumber(commisonBalance),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.PERCENTAGE,
          };
          await STATEMENT_TRANSACTION.create(commissionTranaction);

          if (findOrder.promocode || findOrder.rewardId) {
            if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SHARE
            ) {
              let cashBackBoth = details.promoAmount / 2;

              let walletBalanceOff =
                commissionTranaction.balance - cashBackBoth;
              let walletTranactionOff = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceOff),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };

              await STATEMENT_TRANSACTION.create(walletTranactionOff);
              let walletBalanceSup = walletTranactionOff.balance - cashBackBoth;
              let walletTranactionSup = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceSup),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionSup);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.OFFARAT
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SUPPLIER
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountCr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
            if (findOrder.rewardId) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Spinner reward",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
          }
        } else {
          // Create invoice statement transaction
          let invoiceTranaction = {
            type: "Invoice",
            number: order.orderId,
            amountCr: formatNumber(details.itemPrice),
            balance: formatNumber(details.itemPrice),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.PERCENTAGE,
          };

          await STATEMENT_TRANSACTION.create(invoiceTranaction);
          let commission =
            details.itemPrice * (findCompany.perCommission / 100);
          let commisonBalance = invoiceTranaction.balance - commission;
          // Create commission statement transaction
          let commissionTranaction = {
            type: "Commission",
            number: order.orderId,
            amountDr: formatNumber(commission),
            balance: formatNumber(commisonBalance),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.PERCENTAGE,
          };
          await STATEMENT_TRANSACTION.create(commissionTranaction);
          if (findOrder.promocode || findOrder.rewardId) {
            if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SHARE
            ) {
              let cashBackBoth = details.promoAmount / 2;

              let walletBalanceOff =
                commissionTranaction.balance - cashBackBoth;
              let walletTranactionOff = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceOff),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionOff);
              let walletBalanceSup = walletTranactionOff.balance - cashBackBoth;
              let walletTranactionSup = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceSup),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionSup);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.OFFARAT
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SUPPLIER
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountCr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
            if (findOrder.rewardId) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Spinner reward",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.PERCENTAGE,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
          }
        }
      } else if (findCompany.commissionType == CONST.FIX_AMOUNT) {
        let isExist = await STATEMENT_TRANSACTION.find({
          company: order.company,
          accountType: CONST.FIX_AMOUNT,
        })
          .sort({ createdAt: -1 })
          .limit(2);

        if (isExist.length > 0) {
          // Create invoice statement transaction
          let invoiceBalance = isExist[0].balance + details.itemPrice;
          let invoiceTranaction = {
            type: "Invoice",
            number: order.orderId,
            amountCr: formatNumber(details.itemPrice),
            balance: formatNumber(invoiceBalance),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.FIX_AMOUNT,
          };
          await STATEMENT_TRANSACTION.create(invoiceTranaction);
          // Create commission statement transaction
          let sellingPrice = 0;
          let pickCost = 0;
          let commission = 0;
          let commissionBalance = 0;

          let findProduct = await PRODUCT_MODEL.findOne({
            _id: details.productId,
          });

          sellingPrice = order.subTotal || 0;
          pickCost = findProduct.pickupCost || 0;

          commission = sellingPrice - pickCost;
          commissionBalance = invoiceTranaction.balance - commission;

          let commissionTranaction = {
            type: "Commission",
            number: order.orderId,
            amountDr: formatNumber(commission),
            balance: formatNumber(commissionBalance),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.FIX_AMOUNT,
          };
          await STATEMENT_TRANSACTION.create(commissionTranaction);
          if (findOrder.promocode || findOrder.rewardId) {
            if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SHARE
            ) {
              let cashBackBoth = details.promoAmount / 2;

              let walletBalanceOff =
                commissionTranaction.balance - cashBackBoth;
              let walletTranactionOff = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceOff),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionOff);
              let walletBalanceSup = walletTranactionOff.balance - cashBackBoth;
              let walletTranactionSup = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceSup),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionSup);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.OFFARAT
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SUPPLIER
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountCr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
            if (findOrder.rewardId) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Spinner reward",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
          }
        } else {
          // Create invoice statement transaction
          let invoiceTranaction = {
            type: "Invoice",
            number: order.orderId,
            amountCr: formatNumber(details.itemPrice),
            balance: formatNumber(details.itemPrice),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.FIX_AMOUNT,
          };

          await STATEMENT_TRANSACTION.create(invoiceTranaction);
          // Create commission statement transaction
          let sellingPrice = 0;
          let pickCost = 0;
          let commission = 0;
          let commissionBalance = 0;

          let findProduct = await PRODUCT_MODEL.findOne({
            _id: details.productId,
          });

          sellingPrice = order.subTotal || 0;
          pickCost = findProduct.pickupCost || 0;

          commission = sellingPrice - pickCost;
          commissionBalance = invoiceTranaction.balance - commission;

          let commissionTranaction = {
            type: "Commission",
            number: order.orderId,
            amountDr: formatNumber(commission),
            balance: formatNumber(commissionBalance),
            company: new mongoose.Types.ObjectId(order.company),
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            date: todayDate.toISOString(),
            accountType: CONST.FIX_AMOUNT,
          };

          await STATEMENT_TRANSACTION.create(commissionTranaction);
          if (findOrder.promocode || findOrder.rewardId) {
            if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SHARE
            ) {
              let cashBackBoth = details.promoAmount / 2;

              let walletBalanceOff =
                commissionTranaction.balance - cashBackBoth;
              let walletTranactionOff = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceOff),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionOff);
              let walletBalanceSup = walletTranactionOff.balance - cashBackBoth;
              let walletTranactionSup = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountDr: formatNumber(cashBackBoth),
                balance: formatNumber(walletBalanceSup),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranactionSup);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.OFFARAT
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Off",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            } else if (
              findOrder.promocode &&
              findPromo?.supplierShare == CONST.SUPPLIER
            ) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Wallet-Sup",
                number: findOrder.orderId,
                amountCr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
            if (findOrder.rewardId) {
              let walletBalance =
                commissionTranaction.balance - details.promoAmount;
              let walletTranaction = {
                type: "Spinner reward",
                number: findOrder.orderId,
                amountDr: formatNumber(details.promoAmount),
                balance: formatNumber(walletBalance),
                company: new mongoose.Types.ObjectId(findOrder.company),
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                date: dates.toISOString(),
                accountType: CONST.FIX_AMOUNT,
              };
              await STATEMENT_TRANSACTION.create(walletTranaction);
            }
          }
        }
      }
    } else {
      await setResponseObject(req, false, "Invalid coupon code");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Scan coupon code
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
couponCode.scanCoupon = async (req, res, next) => {
  try {
    const todayDate = moment().startOf("day");

    let details = await COUPON.findOne({ couponCode: req.params.id }).populate(
      "productId"
    );

    const findUser = await USER.findOne({
      _id: details.createdBy,
    });

    const findOrder = await ORDER.findOne({
      _id: new mongoose.Types.ObjectId(details?.orderId),
    });

    if (findOrder?.products[0]?.isRefund == true) {
      await setResponseObject(req, false, "This coupon has been refunded.");

      next();
      return;
    }

    if (findOrder?.deliveryStatus == CONST.CANCELED) {
      await setResponseObject(req, false, "This coupon has been refunded.");

      next();
      return;
    }

    if (details?.isUsed === true) {
      await setResponseObject(req, false, "Coupon code is already used");
      next();
    } else if (moment(details?.endDate).startOf("day").isBefore(todayDate)) {
      await setResponseObject(req, false, "Coupon code is expired");
      next();
    } else {
      // PUSH NOTIFICATION TO USER
      if (findUser.deviceToken) {
        await sendNotification(
          findUser?.deviceToken,
          findUser?.language && findUser?.language == "AR"
            ? "تم مسح رمز القسيمة بنجاح!"
            : "Coupon code Redeemed Successfully!",
          findUser?.language && findUser?.language == "AR"
            ? `رمز القسيمة ${details.couponCode}المسح بنجاح!`
            : `Coupon code ${details.couponCode} Redeemed Successfully!`,
          "",
          CONST.ORDER
        );
      }
      var userNotificationBody = {
        to: findUser.createdBy,
        title: "Coupon code Redeemed Successfully!",
        description: `Coupon code ${details.couponCode} Redeemed Successfully!`,
        arabicTitle: "تم مسح رمز القسيمة بنجاح!",
        arabicDescription: `رمز القسيمة ${details.couponCode}المسح بنجاح!`,
        notificationType: CONST.ORDER,
      };

      let notificationBody = await NOTIFICATION.create(userNotificationBody);
      await setResponseObject(req, true, "Coupon code scan successfully");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DOWNLOAD REPORT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
couponCode.downloadCouponReport = async (req, res, next) => {
  try {
    let filter = [];

    if (req?.query?.startDate || req?.query?.endDate) {
      const start = new Date(req?.query?.startDate).toISOString(); // Converts '20/10/2024' to '2024-10-20'
      const end = new Date(req?.query?.endDate).toISOString(); // Converts '30/10/2024' to '2024-10-30'
      filter.push({
        $match: {
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
      });
    }

    if (req.query.isUsed) {
      filter.push({
        $match: {
          isUsed: req.query.isUsed == "true" ? true : false,
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

    const couponDetails = await COUPON.aggregate([
      {
        $match: categoryFilter,
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
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "orders",
          let: { id: "$orderId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "OrderDetails",
        },
      },
      {
        $unwind: { path: "$OrderDetails", preserveNullAndEmptyArrays: true },
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
      ...filter,
    ]);

    if (couponDetails.length > 0) {
      async function generateExcel(couponDetails) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Coupon Report");
        const data = [
          [
            "Purchase Order No",
            "Coupon used Date",
            "Company",
            "Contract Person Name",
            "Contract Person No",
            "Item - Offer %",
            "Coupon Code",
            "Used / Not Used",
            "Price(Only for coupon)",
            "Payment date",
          ],
        ];
        couponDetails?.forEach((couponDetails) => {
          data.push([
            couponDetails?.OrderDetails?.orderId,
            couponDetails?.isUsed == true
              ? moment(couponDetails?.updatedAt).format("YYYY-MM-DD")
              : "-",
            couponDetails?.companyDetails?.company,
            couponDetails?.userDetails?.fullName,
            couponDetails?.userDetails?.countryCode +
            " " +
            couponDetails?.userDetails?.mobile
              ? couponDetails?.userDetails?.countryCode +
                " " +
                couponDetails?.userDetails?.mobile
              : "-",
            couponDetails?.discount,
            couponDetails?.couponCode,
            couponDetails?.isUsed == true ? "Used" : "Not Used",
            couponDetails?.itemPrice ? couponDetails?.itemPrice : "-",
            moment(couponDetails?.OrderDetails?.createdAt).format("YYYY-MM-DD")
              ? moment(couponDetails?.OrderDetails?.createdAt).format(
                  "YYYY-MM-DD"
                )
              : "-",
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
        const excelPath = `../uploads/invoice/couponreport-${generateOTP(
          6
        )}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(couponDetails);
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

module.exports = couponCode;
