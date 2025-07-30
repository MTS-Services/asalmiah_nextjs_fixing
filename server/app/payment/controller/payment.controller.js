/** 
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const {
  setResponseObject,
  generateOTP,
  formatNumber,
} = require("../../../middleware/commonFunction");
const { PAYMENT, REFUND } = require("../model/payment.model");
const dotenv = require("dotenv");
const { USER } = require("../../userService/model/userModel");
const { webhooks } = require("../model/webhook.model");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { CONST } = require("../../../helpers/constant");
const ORDER = require("../../order/model/order.model");
const { REFUND_REQUEST } = require("../../redundRequest/model/model");
const { WALLET } = require("../../wallet/model/model");
const ExcelJS = require("exceljs");
const moment = require("moment");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const { NOTIFICATION } = require("../../notification/model/notification.model");
const { CASHBACK } = require("../../cashBack/model/model");
const { STATEMENT_TRANSACTION } = require("../../statementAccount/model/model");
const { COMPANY_MODEL } = require("../../company/model/model");
const nodemailer = require("../../../helpers/nodemailer");
const orderModel = require("../../order/model/order.model");
const { PERMISSION_MODEL } = require("../../permission/model/model");

dotenv.config();

const payment = {};

/**
 * Creates charage
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.addCharge = async (req, res, next) => {
  try {
    let data = req.body;

    let findUser = await USER.findOne({ _id: req.userId });

    // Validate required fields
    if (!data.amount || !req.user.customerId) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields: amount, customerId",
      });
    }
    let tokenData = "";
    if (data.cardId) {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
        body: JSON.stringify({
          saved_card: {
            card_id: data.cardId,
            customer_id: req.user.customerId,
          },
          client_ip: "127.0.0.1",
        }),
      };

      tokenData = await fetch("https://api.tap.company/v2/tokens", options)
        .then((res) => res.json())
        .then((token) => {
          return token;
        })

        .catch((err) => {
          console.error(err);
        });
    }

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "KWD",
        customer_initiated: true,
        threeDSecure: true,
        save_card: data.isCardSave == true ? data.isCardSave : false,
        description: req.body.productId,
        metadata: { udf1: "Metadata 1" },
        reference: { transaction: "txn_01" },
        receipt: { email: true, sms: false },
        customer: {
          id: req.user.customerId,
          first_name: findUser.firstName,
          email: findUser.email,
        },
        merchant: { id: process.env.MERCHENT_ID },
        source: { id: tokenData.id ? tokenData.id : "src_all" },
        post: { url: process.env.POST_URL },
        redirect: { url: process.env.REDIRECT_URL },
      }),
    };

    await fetch("https://api.tap.company/v2/charges/", options)
      .then((response) => response.json())
      .then((responseData) => {
        res.status(200).send({
          success: true,
          message: "Charge created successfully",
          data: responseData,
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: "Failed to create charge",
          error: err.message,
        });
      });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Creates charage
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.createAppCharge = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser = await USER.findOne({ _id: req.userId });

    // Validate required fields
    if (!data.amount || !req.user.customerId) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields: amount, customerId.",
      });
    }
    let tokenData = "";
    if (data.cardId) {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
        body: JSON.stringify({
          saved_card: {
            card_id: data.cardId,
            customer_id: req.user.customerId,
          },
          client_ip: "127.0.0.1",
        }),
      };

      tokenData = await fetch("https://api.tap.company/v2/tokens", options)
        .then((res) => res.json())
        .then((token) => {
          return token;
        })

        .catch((err) => {
          console.error(err);
        });
    }

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "KWD",
        customer_initiated: true,
        threeDSecure: true,
        save_card: false,
        description: req.body.productId,
        metadata: { udf1: "Metadata 1" },
        reference: { transaction: "txn_01" },
        receipt: { email: true, sms: false },
        customer: {
          id: req.user.customerId,
          first_name: findUser.firstName,
          email: findUser.email,
        },
        merchant: { id: process.env.MERCHENT_ID },
        source: { id: data.sourceId },
        source: { id: tokenData.id ? tokenData.id : data.sourceId },
        post: { url: process.env.POST_URL },
        redirect: { url: process.env.REDIRECT_URL },
      }),
    };

    await fetch("https://api.tap.company/v2/charges/", options)
      .then((response) => response.json())
      .then((responseData) => {
        res.status(200).send({
          success: true,
          message: "Charge created successfully",
          data: responseData,
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: "Failed to create charge",
          error: err.message,
        });
      });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

/**
 * get Charge
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.getChargeRecord = async (req, res, next) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${process.env.SECRET_KEY}`);
    myHeaders.append("accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.tap.company/v2/charges/${req.query.chargeId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == "CAPTURED") {
          res.status(200).send({
            success: true,
            message: "Charge found successfully",
            data: {
              _id: responseData.id,
              object: responseData.object,
              status: responseData.status,
              amount: responseData?.amount,
              currency: responseData?.currency,
              threeDSecure: responseData?.threeDSecure,
              transaction: responseData.transaction,
            },
          });
        } else {
          res.status(400).send({
            success: false,
            message: "Payment failed",
          });
        }
        // res.status(200).send({
        //   success: true,
        //   message: "Charge found successfully",
        //   data: {
        //     _id: responseData.id,
        //     object: responseData.object,
        //     status: responseData.status,
        //     amount: responseData?.amount,
        //     currency: responseData?.currency,
        //     threeDSecure: responseData?.threeDSecure,
        //     transaction: responseData.transaction,
        //   },
        // });
      })

      .catch((err) => {
        console.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to create charge",
          error: err.message,
        });
      });
  } catch (error) {
    // Send the error response
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Creates charage Refund api
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.addRefund = async (req, res, next) => {
  try {
    let saveNotification;
    let dates = new Date();

    let findRefund = await REFUND_REQUEST.findById({ _id: req.params.id });
    let findOrder = await ORDER.findById({ _id: findRefund.orderId });
    let findUser = await USER.findOne({ _id: findRefund.userId });
    let findTransaction = await PAYMENT.findOne({ orderId: findOrder._id });
    let findCompany = await COMPANY_MODEL.findOne({ _id: findOrder.company });

    if (findOrder.paymentReturnType == CONST.WALLET) {
      let walletExist = await WALLET.findOne({ userId: findRefund.userId });
      if (walletExist) {
        let updateWallet = await WALLET.findOneAndUpdate(
          { _id: walletExist._id },
          { amount: walletExist.amount + findRefund.amount },
          { new: true }
        );
        let updateRefundStateId = await REFUND_REQUEST.findByIdAndUpdate(
          { _id: req.params.id },
          { stateId: CONST.REFUND },
          { new: true }
        );

        let cashBackData = {
          cashBack: findRefund.amount,
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          orderId: new mongoose.Types.ObjectId(findOrder._id),
          isAdded: true,
        };
        let createCashback = await CASHBACK.create(cashBackData);
        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إنشاء استرداد المبلغ في محفظتك."
              : "Your refund created in your wallet",
            findUser?.language && findUser?.language == "AR"
              ? `تم إنشاء استرداد مبلغ ${formatNumber(
                  findRefund.amount
                )} لطلب ${findOrder.orderId} في محفظتك.`
              : `Your refund ${formatNumber(
                  findRefund.amount
                )} KD created for order Id ${findOrder.orderId} in your wallet`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your refund created in your wallet",
          description: `Your refund ${formatNumber(
            findRefund.amount
          )} KD created for order Id ${findOrder.orderId} in your wallet`,
          arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
          arabicDescription: `تم إنشاء استرداد مبلغ ${formatNumber(
            findRefund.amount
          )} لطلب ${findOrder.orderId} في محفظتك.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };
        saveNotification = await NOTIFICATION.create(userNotificationBody);

        let payloadData = {
          userId: findRefund.userId,
          amount: findRefund.amount,
          orderId: findOrder._id,
          status: "success",
          chargeId: findTransaction?.chargeId ? findTransaction?.chargeId : "",
          paymentReturnType: CONST.ACCOUNT,
        };

        let createRefund = await REFUND.create(payloadData);

        let isExist = await STATEMENT_TRANSACTION.find({
          company: findOrder.company,
        })
          .sort({ createdAt: -1 })
          .limit(2);

        if (isExist.length > 0) {
          // Create Cashback statement transaction
          let walletTranaction = {
            type: "Refund to wallet",
            number: findOrder.orderId,
            amountDr: formatNumber(cashBackData?.cashBack),
            balance: formatNumber(isExist[0]?.balance - cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        } else {
          let walletTranaction = {
            type: "Refund to wallet",
            number: findOrder.orderId,
            amountDr: formatNumber(cashBackData?.cashBack),
            balance: formatNumber(cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        }
        const cashbackUpdate = await CASHBACK.findOneAndUpdate(
          { _id: createCashback._id },
          { isAdded: true },
          { new: true }
        );
        await PAYMENT.findByIdAndUpdate(
          { _id: findTransaction._id },
          { isRefund: true },
          { new: true }
        );

        res.status(200).send({
          success: true,
          message: "Refund created successfully",
          data: updateWallet,
        });
        next();
      } else {
        let payload = {
          userId: findRefund.userId,
          amount: findRefund.amount,
        };
        let createWallet = await WALLET.create(payload);

        let updateRefund = await REFUND_REQUEST.findByIdAndUpdate(
          { _id: req.params.id },
          { stateId: CONST.REFUND },
          { new: true }
        );

        let cashBackData = {
          cashBack: findRefund.amount,
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          orderId: new mongoose.Types.ObjectId(findOrder._id),
          isAdded: true,
        };
        let createCashback = await CASHBACK.create(cashBackData);

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إنشاء استرداد المبلغ في محفظتك."
              : "Your refund created in your wallet",
            findUser?.language && findUser?.language == "AR"
              ? `تم إنشاء استرداد مبلغ ${formatNumber(
                  findRefund.amount
                )} لطلب ${findOrder.orderId} في محفظتك.`
              : `Your refund ${formatNumber(
                  findRefund.amount
                )} KD created for order Id ${findOrder.orderId} in your wallet`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your refund created in your wallet",
          description: `Your refund ${formatNumber(
            findRefund.amount
          )} KD created for order Id ${findOrder.orderId} in your wallet`,
          arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
          arabicDescription: `تم إنشاء استرداد مبلغ ${formatNumber(
            findRefund.amount
          )} لطلب ${findOrder.orderId} في محفظتك.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };
        saveNotification = await NOTIFICATION.create(userNotificationBody);

        let payloadData = {
          userId: findRefund.userId,
          amount: findRefund.amount,
          orderId: findOrder._id,
          status: "success",
          chargeId: findTransaction?.chargeId ? findTransaction?.chargeId : "",
          paymentReturnType: CONST.ACCOUNT,
        };

        let createRefund = await REFUND.create(payloadData);

        let isExist = await STATEMENT_TRANSACTION.find({
          company: findOrder.company,
        })
          .sort({ createdAt: -1 })
          .limit(2);

        if (isExist.length > 0) {
          // Create Cashback statement transaction
          let walletTranaction = {
            type: "Refund to account",
            number: findOrder.orderId,
            amountDr: cashBackData?.cashBack,
            balance: formatNumber(isExist[0]?.balance - cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        } else {
          let walletTranaction = {
            type: "Refund to account",
            number: findOrder.orderId,
            amountDr: cashBackData?.cashBack,
            balance: formatNumber(cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        }
        await PAYMENT.findByIdAndUpdate(
          { _id: findTransaction._id },
          { isRefund: true },
          { new: true }
        );

        res.status(200).send({
          success: true,
          message: "Refund created successfully",
          data: createWallet,
        });
        next();
      }
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${process.env.SECRET_KEY}`);
      myHeaders.append("accept", "application/json");
      myHeaders.append("content-type", "application/json");

      const raw = JSON.stringify({
        charge_id: findTransaction.chargeId,
        amount: findRefund.amount,
        currency: "KWD",
        // reason: data.reason,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://api.tap.company/v2/refunds/", requestOptions)
        .then(async (response) => response.json())
        .then(async (responseData) => {
          // Send the response back to the client
          let payload = {
            userId: findRefund.userId,
            amount: findRefund.amount,
            orderId: findOrder._id,
            status: "success",
            chargeId: findTransaction?.chargeId
              ? findTransaction?.chargeId
              : "",
            paymentReturnType: CONST.ACCOUNT,
          };
          let createRefund = await REFUND.create(payload);
          let updateRefund = await REFUND_REQUEST.findByIdAndUpdate(
            { _id: req.params.id },
            { stateId: CONST.REFUND },
            { new: true }
          );
          //SEND NOTIFICATION TO USER
          if (findUser.deviceToken) {
            await sendNotification(
              findUser?.deviceToken,
              findUser?.language && findUser?.language == "AR"
                ? "تم إنشاء استرداد المبلغ في حسابك."
                : "Your refund created in your account",
              findUser?.language && findUser?.language == "AR"
                ? `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في حسابك.`
                : `Your refund ${findRefund.amount} KD created for order ${findOrder.orderId} in your account`,
              `${JSON.stringify(findOrder)}`,
              CONST.ORDER
            );
          }
          var userNotificationBody = {
            to: findUser._id,
            title: "Your refund created in your account",
            description: `Your refund ${findRefund.amount} KD created for order ${findOrder.orderId} in your account`,
            arabicTitle: "تم إنشاء استرداد المبلغ في حسابك.",
            arabicDescription: `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في حسابك.`,
            notificationType: CONST.ORDER,
            orderId: findOrder._id,
          };
          saveNotification = await NOTIFICATION.create(userNotificationBody);
          res.status(200).send({
            success: true,
            message: "Refund created successfully",
            data: responseData,
          });
        })
        .catch((err) => {
          console.error(err);

          // Handle error case
          res.status(500).send({
            success: false,
            message: "Failed to create charge",
            error: err.message,
          });
        });

      let cashBackData = {
        cashBack: findRefund.amount,
        createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
        orderId: new mongoose.Types.ObjectId(findOrder._id),
        isAdded: true,
      };
      let createCashback = await CASHBACK.create(cashBackData);

      let isExist = await STATEMENT_TRANSACTION.find({
        company: findOrder.company,
      })
        .sort({ createdAt: -1 })
        .limit(2);

      if (isExist.length > 0) {
        // Create Cashback statement transaction
        let walletTranaction = {
          type: "Refund to account",
          number: findOrder.orderId,
          amountDr: cashBackData?.cashBack,
          balance: formatNumber(isExist[0]?.balance - cashBackData?.cashBack),
          company: new mongoose.Types.ObjectId(findOrder.company),
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          date: dates.toISOString(),
          accountType: findCompany.commissionType,
        };
        await STATEMENT_TRANSACTION.create(walletTranaction);
      } else {
        let walletTranaction = {
          type: "Refund to account",
          number: findOrder.orderId,
          amountDr: cashBackData?.cashBack,
          balance: formatNumber(cashBackData?.cashBack),
          company: new mongoose.Types.ObjectId(findOrder.company),
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          date: dates.toISOString(),
          accountType: findCompany.commissionType,
        };
        await STATEMENT_TRANSACTION.create(walletTranaction);
      }

      await PAYMENT.findByIdAndUpdate(
        { _id: findTransaction._id },
        { isRefund: true },
        { new: true }
      );
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Webhook api
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.webhook = async (req, res, next) => {
  try {
    let webhook = new webhooks();
    const event = req.body;
    webhook.record = event;
    let webhookData = await webhook.save();
    const account_updated = event;

    let user = await USER.findOne({ customerId: account_updated.customer?.id });
    description = account_updated.description.replace(/(^"|"$)/g, "");

    let array = description.split(",");
    let productRecord = await PRODUCT_MODEL.findOne({ _id: array[0] });
    let findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Transaction list api
 * @param {}
 * @param {}
 * @param {}
 */
payment.transactionList = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search.replace(
        new RegExp("\\\\", "g"),
        "\\\\"
      );

      // Escape special characters in searchValue for regex
      const escapedSearchValue = searchValue
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .trim();

      // Try to parse the orderId from the search value
      const searchNumber = parseInt(searchValue, 10);

      // Build the search filter
      searchFilter.$or = [
        {
          "userDetails.fullName": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          "userDetails.email": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          "ordersDetails.orderId": {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          "ordersDetails.orderId": {
            $eq: searchNumber,
          },
        },
      ];
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

      const orders = await orderModel.find({
        company: { $in: companies._id },
      });

      if (orders.length > 0) {
        let orderIds = orders.map((order) => order._id);

        categoryFilter = {
          orderId: { $in: orderIds }, // ✅ Use $in here
        };
      }
    }

    const transactionList = await PAYMENT.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$paidBy" },
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
                email: 1,
                state: 1,
                createdAt: 1,
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
        $lookup: {
          from: "orders",
          let: { id: "$orderId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
                      company: 1,
                      country: 1,
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
          as: "ordersDetails",
        },
      },
      {
        $unwind: { path: "$ordersDetails", preserveNullAndEmptyArrays: true },
      },
      // {
      //   $lookup: {
      //     from: "permissionschemas",
      //     let: { id: new mongoose.Types.ObjectId(req.userId) },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
      //           },
      //         },
      //       },
      //     ],
      //     as: "permission",
      //   },
      // },
      // {
      //   $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
      // },
      {
        $match: searchFilter,
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
    if (transactionList && transactionList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Payment list found successfully",
        transactionList[0].data,
        transactionList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Payment list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * View transaction details api
 * @param {}
 * @param {}
 * @param {}
 */
payment.transactionView = async (req, res, next) => {
  try {
    const details = await PAYMENT.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      // {
      //   $lookup: {
      //     from: "webhooks",
      //     let: { id: "$webhookId" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: { $eq: ["$$id", "$record._id"] },
      //         },
      //       },
      //     ],
      //     as: "webhooks",
      //   },
      // },
      // {
      //   $unwind: { path: "$webhooks", preserveNullAndEmptyArrays: true },
      // },
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
            {
              $lookup: {
                from: "addresses",
                let: { id: "$address" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] },
                    },
                  },
                ],
                as: "addressDetails",
              },
            },
            {
              $unwind: {
                path: "$addressDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "branches",
                let: { id: "$branch" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      branchName: 1,
                      arabicBranchName: 1,
                      location: 1,
                      countryCode: 1,
                      deliveryWhatsUpNo: 1,
                      deliveryEmail: 1,
                      area: 1,
                    },
                  },
                ],
                as: "branchDetails",
              },
            },
            {
              $unwind: {
                path: "$branchDetails",
                preserveNullAndEmptyArrays: true,
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
                      company: 1,
                      country: 1,
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
          as: "ordersDetails",
        },
      },
      {
        $unwind: { path: "$ordersDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$paidBy" },
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
                email: 1,
                countryCode: 1,
                mobile: 1,
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
        $lookup: {
          from: "users",
          let: { id: "$paidTo" },
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
                email: 1,
                countryCode: 1,
                mobile: 1,
              },
            },
          ],
          as: "paidToDetails",
        },
      },
      {
        $unwind: { path: "$paidToDetails", preserveNullAndEmptyArrays: true },
      },
    ]);

    if (details) {
      await setResponseObject(
        req,
        true,
        "Transaction details found successfully",
        details[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Transaction details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * My transaction list api
 * @param {}
 * @param {}
 * @param {}
 */
payment.myTransaction = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    const transactionList = await PAYMENT.aggregate([
      {
        $match: { paidBy: new mongoose.Types.ObjectId(req.userId) },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$paidTo" },
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
                createdAt: 1,
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
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
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
    if (transactionList && transactionList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Payment list found successfully",
        transactionList[0].data,
        transactionList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Payment list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Seller graph product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
payment.transactionGraph = async (req, res, next) => {
  try {
    const findSeller = await USER.findOne({ _id: req.userId });
    const allOrders = await ORDER.find({ branch: findSeller.branch });
    const orders = allOrders.map((e) => {
      return e._id;
    });
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const collections = ["orders"];
    const result = [];

    for (const month of allMonths) {
      const monthlyCounts = [month];

      for (const collectionName of collections) {
        let currentYear = req.params.year
          ? req.params.year
          : new Date().getFullYear();

        const lastDay = new Date(
          currentYear,
          allMonths.indexOf(month) + 1,
          0
        ).getDate();

        const query = {
          createdAt: {
            $gte: new Date(`${month} 01, ${currentYear}`),
            $lte: new Date(`${month} ${lastDay}, ${currentYear}`),
          },
          orderId: { $in: orders },
        };

        if (collectionName === "orders") {
          const payment = await PAYMENT.find(query);
          let total = 0;
          let sum = [];

          payment.forEach((e) => {
            if (e.total !== null && e.amount !== total) {
              sum.push(e.amount);
              total += e.amount;
            }
          });
          monthlyCounts.push(total || 0);
        }
      }

      result.push(monthlyCounts);
    }
    return res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Download Report
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
payment.downloadRefundReport = async (req, res, next) => {
  try {
    const start = req.query.startDate; // e.g., '2024-10-20'
    const end = req.query.endDate; // e.g., '2024-10-30'

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

      const orders = await orderModel.find({
        company: { $in: companies._id },
      });

      if (orders.length > 0) {
        let orderIds = orders.map((order) => order._id);

        categoryFilter = {
          orderId: { $in: orderIds }, // ✅ Use $in here
        };
      }
    }

    let findRefund = await REFUND.aggregate([

     {
      $match: categoryFilter,
    },
      {
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
          as: "ordersDetails",
        },
      },
      {
        $unwind: {
          path: "$ordersDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$userId" },
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
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (findRefund.length > 0) {
      async function generateExcel(findRefund) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Refund Details");
        const data = [
          [
            "Purchase Order No",
            "Company",
            "Contact Person",
            "Refund date",
            "Telephone Contact Person",
            "Item",
            "Quantity",
            "Sell Price",
            "Payment date",
          ],
        ];

        // Assuming findPromo is an array of objects
        findRefund?.forEach((findRefund) => {
          data.push([
            findRefund?.ordersDetails?.orderId,
            findRefund?.ordersDetails?.companyDetails?.company
              ? findRefund?.ordersDetails?.companyDetails?.company
              : "-",
            findRefund?.userDetails?.fullName,
            `${moment(findRefund.createdAt).format("YYYY-MM-DD")}`,
            findRefund?.userDetails?.countryCode +
              findRefund?.userDetails?.mobile,
            findRefund?.ordersDetails?.products
              .map((e) => e.productName)
              .join(", "), // Join product names into a single string
            findRefund?.ordersDetails?.products?.length,
            findRefund?.amount,
            `${moment(findRefund?.ordersDetails?.createdAt).format(
              "YYYY-MM-DD"
            )}`,
          ]);
        });

        data.forEach((row) => {
          worksheet.addRow(row);
        });
        data[0].forEach((_, index) => {
          const maxLength = data.reduce(
            (max, row) =>
              Math.max(max, row[index] ? row[index].toString().length : 0),
            0
          );
          worksheet.getColumn(index + 1).width = maxLength + 2;
        });

        const excelPath = `../uploads/invoice/refundData-${generateOTP(
          6
        )}.xlsx`;

        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(findRefund);
      let excelUrl = `${process.env.IMAGE_BASE_URL}${excelPath}`;
      excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
      await setResponseObject(
        req,
        true,
        "Report download successfully",
        excelUrl
      );
      next();
    } else {
      await setResponseObject(req, true, "There is no data for refund");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * My transaction list api
 * @param {}
 * @param {}
 * @param {}
 */
payment.myRefundList = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    const refundList = await REFUND.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.userId) },
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
          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
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
    if (refundList && refundList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Payment list found successfully",
        refundList[0].data,
        refundList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Payment list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Card list api
 * @param {}
 * @param {}
 * @param {}
 */
payment.cardList = async (req, res, next) => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
      },
    };

    fetch(`https://api.tap.company/v2/card/${req.user.customerId}`, options)
      .then((res) => res.json())
      .then(async (responseData) => {
        if (responseData.data) {
          res.status(200).send({
            success: true,
            message: "Cards found successfully",
            data: responseData.data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to get card list",
          error: err.message,
        });
      });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
  }
};

/**
 * Card list api
 * @param {}
 * @param {}
 * @param {}
 */
payment.deleteCard = async (req, res, next) => {
  try {
    const options = {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
      },
    };

    fetch(
      `https://api.tap.company/v2/card/${req.user.customerId}/${req.params.cardId}`,
      options
    )
      .then((res) => res.json())
      .then(async (responseData) => {
        res.status(200).send({
          success: true,
          message: "Card deleted successfully",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          success: false,
          message: "Failed to delete card",
          error: err.message,
        });
      });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
  }
};

/**
 * Creates charage Refund api
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.sellerAddRefund = async (req, res, next) => {
  try {
    let data = req.body;
    let saveNotification;
    let findOrder = await ORDER.findById({ _id: data.orderId });
    let findUser = await USER.findOne({ _id: findOrder.createdBy });
    let findCompany = await COMPANY_MODEL.findById({
      _id: findOrder?.company,
    });

    let findTransaction = await PAYMENT.findOne({
      orderId: findOrder._id,
    });

    // For future ref.
    // if (
    //   findOrder.deliveryStatus != CONST.CANCELED ||
    //   findOrder.deliveryStatus != CONST.COMPLETED
    // ) {
    //   res.status(400).send({
    //     success: false,
    //     message:
    //       "You can't refund untill order is mark as canceled or completed",
    //   });
    //   next();
    //   return;
    // }

    //SEND NOTIFICATION TO USER
    if (findUser.deviceToken) {
      await sendNotification(
        findUser?.deviceToken,
        findUser?.language && findUser?.language == "AR"
          ? "تم إنشاء المبلغ المسترد في محفظتك مرة واحدة"
          : "Your refund created in your wallet as soon as.",
        findUser?.language && findUser?.language == "AR"
          ? `تم إنشاء استرداد مبلغ ${formatNumber(data.amount)} لطلب ${
              findOrder.orderId
            } في محفظتك في أقرب وقت`
          : `Your refund ${formatNumber(data.amount)} KD created for order Id ${
              findOrder.orderId
            } in your wallet as soon as`,
        `${JSON.stringify(findOrder)}`,
        CONST.ORDER
      );
    }
    var userNotificationBody = {
      to: findUser._id,
      title: "Your refund created in your wallet as soon as.",
      description: `Your refund ${formatNumber(
        data.amount
      )} KD created for order Id ${
        findOrder.orderId
      } in your wallet as soon as`,
      arabicTitle: "تم إنشاء المبلغ المسترد في محفظتك مرة واحدة",
      arabicDescription: `تم إنشاء استرداد مبلغ ${formatNumber(
        data.amount
      )} لطلب ${findOrder.orderId} في محفظتك في أقرب وقت.`,
      notificationType: CONST.ORDER,
      orderId: findOrder._id,
    };

    saveNotification = await NOTIFICATION.create(userNotificationBody);

    // Add refund to wallet
    let walletExist = await WALLET.findOne({ userId: findOrder.createdBy });
    if (walletExist) {
      let updateWallet = await WALLET.findOneAndUpdate(
        { _id: walletExist._id },
        { amount: walletExist.amount + findOrder.total },
        { new: true }
      );
    } else {
      let payload = {
        userId: findOrder.createdBy,
        amount: findOrder.total,
      };
      let createWallet = await WALLET.create(payload);
    }

    //SEND NOTIFICATION TO USER
    if (findUser.deviceToken) {
      await sendNotification(
        findUser?.deviceToken,
        findUser?.language && findUser?.language == "AR"
          ? "تم إنشاء استرداد المبلغ في محفظتك."
          : "Your refund created in your wallet",
        findUser?.language && findUser?.language == "AR"
          ? `تم إنشاء استرداد مبلغ ${formatNumber(findOrder.total)} لطلب ${
              findOrder.orderId
            } في محفظتك.`
          : `Your refund ${formatNumber(
              findOrder.total
            )} KD created for order Id ${findOrder.orderId} in your wallet`,
        `${JSON.stringify(findOrder)}`,
        CONST.ORDER
      );
    }
    var userNotificationBody = {
      to: findUser._id,
      title: "Your refund created in your wallet",
      description: `Your refund ${formatNumber(
        findOrder.total
      )} KD created for order Id ${findOrder.orderId} in your wallet`,
      arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
      arabicDescription: `تم إنشاء استرداد مبلغ ${formatNumber(
        findOrder.total
      )} لطلب ${findOrder.orderId} في محفظتك.`,
      notificationType: CONST.ORDER,
      orderId: findOrder._id,
    };
    saveNotification = await NOTIFICATION.create(userNotificationBody);

    let payloadData = {
      userId: findOrder.createdBy,
      amount: findOrder.total,
      orderId: findOrder._id,
      status: "success",
      paymentReturnType: CONST.WALLET,
    };

    let createRefund = await REFUND.create(payloadData);

    // Create statement transaction
    let dates = new Date();
    let isExist = await STATEMENT_TRANSACTION.find({
      company: findOrder.company,
    })
      .sort({ createdAt: -1 })
      .limit(2);

    if (isExist.length > 0) {
      let walletTranaction = {
        type: "Refund to wallet",
        number: findOrder.orderId,
        amountDr: formatNumber(findOrder?.total),
        balance: formatNumber(isExist[0]?.balance - findOrder?.total),
        company: new mongoose.Types.ObjectId(findOrder.company),
        createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
        date: dates.toISOString(),
        accountType: findCompany.commissionType,
      };
      await STATEMENT_TRANSACTION.create(walletTranaction);
    } else {
      let walletTranaction = {
        type: "Refund to wallet",
        number: findOrder.orderId,
        amountDr: formatNumber(findOrder?.total),
        balance: formatNumber(findOrder?.total),
        company: new mongoose.Types.ObjectId(findOrder.company),
        createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
        date: dates.toISOString(),
        accountType: findCompany.commissionType,
      };
      await STATEMENT_TRANSACTION.create(walletTranaction);
    }

    if (findTransaction) {
      await PAYMENT.findOneAndUpdate(
        { _id: findTransaction._id },
        { isRefund: true },
        { new: true }
      );
    }

    let updateOrder = await ORDER.findOneAndUpdate(
      { _id: findOrder._id, "products.items": data.productId },
      { $set: { "products.$.isRefund": true } }, // Use positional operator to update the correct product
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Refund created successfully",
    });
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Creates charage Refund api
 * @param {}
 * @param {*}
 * @param {*}
 */
payment.transactionRefund = async (req, res, next) => {
  try {
    let dates = new Date();
    let saveNotification;
    let findRefund = await PAYMENT.findById({ _id: req.params.id });
    let findOrder = await ORDER.findOne({ _id: findRefund.orderId });

    let findUser = await USER.findOne({ _id: findRefund.paidBy });
    let findTransaction = await PAYMENT.findOne({ orderId: findOrder._id });
    let findCompany = await COMPANY_MODEL.findOne({ _id: findOrder.company });
    if (findOrder.paymentReturnType == CONST.WALLET) {
      let walletExist = await WALLET.findOne({ userId: findRefund.paidBy });
      if (walletExist) {
        let updateWallet = await WALLET.findOneAndUpdate(
          { _id: walletExist._id },
          { amount: walletExist.amount + findRefund.amount },
          { new: true }
        );

        let cashBackData = {
          cashBack: findRefund.amount,
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          orderId: new mongoose.Types.ObjectId(findOrder._id),
          isAdded: true,
        };

        let createCashback = await CASHBACK.create(cashBackData);

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إنشاء استرداد المبلغ في محفظتك."
              : "Your refund created in your wallet",
            findUser?.language && findUser?.language == "AR"
              ? `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في محفظتك.`
              : `Your refund ${findRefund.amount} KD created for order Id ${findOrder.orderId} in your wallet`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your refund created in your wallet",
          description: `Your refund ${findRefund.amount} KD created for order Id ${findOrder.orderId} in your wallet`,
          arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
          arabicDescription: `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في محفظتك.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };
        saveNotification = await NOTIFICATION.create(userNotificationBody);

        let payloadData = {
          userId: findRefund.paidBy,
          amount: findRefund.amount,
          orderId: findOrder._id,
          status: "success",
          chargeId: findTransaction?.chargeId ? findTransaction?.chargeId : "",
          paymentReturnType: CONST.ACCOUNT,
        };

        let createRefund = await REFUND.create(payloadData);

        // Create Cashback statement transaction
        let isExist = await STATEMENT_TRANSACTION.find({
          company: findOrder.company,
        })
          .sort({ createdAt: -1 })
          .limit(2);

        if (isExist.length > 0) {
          let walletTranaction = {
            type: "Refund to wallet",
            number: findOrder.orderId,
            amountDr: formatNumber(cashBackData?.cashBack),
            balance: formatNumber(isExist[0]?.balance - cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        } else {
          let walletTranaction = {
            type: "Refund to wallet",
            number: findOrder.orderId,
            amountDr: formatNumber(cashBackData?.cashBack),
            balance: formatNumber(cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        }

        await PAYMENT.findByIdAndUpdate(
          { _id: findRefund._id },
          { isRefund: true },
          { new: true }
        );

        res.status(200).send({
          success: true,
          message: "Refund created successfully",
          data: updateWallet,
        });
        next();
      } else {
        let payload = {
          userId: findRefund.paidBy,
          amount: findRefund.amount,
        };
        let createWallet = await WALLET.create(payload);

        let cashBackData = {
          cashBack: findRefund.amount,
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          orderId: new mongoose.Types.ObjectId(findOrder._id),
          isAdded: true,
        };
        let createCashback = await CASHBACK.create(cashBackData);

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إنشاء استرداد المبلغ في محفظتك."
              : "Your refund created in your wallet",
            findUser?.language && findUser?.language == "AR"
              ? `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في محفظتك.`
              : `Your refund ${findRefund.amount} KD created for order Id ${findOrder.orderId} in your wallet`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your refund created in your wallet",
          description: `Your refund ${findRefund.amount} KD created for order Id ${findOrder.orderId} in your wallet`,
          arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
          arabicDescription: `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في محفظتك.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };
        saveNotification = await NOTIFICATION.create(userNotificationBody);

        let payloadData = {
          userId: findRefund.paidBy,
          amount: findRefund.amount,
          orderId: findOrder._id,
          status: "success",
          chargeId: findTransaction?.chargeId ? findTransaction?.chargeId : "",
          paymentReturnType: CONST.ACCOUNT,
        };

        let createRefund = await REFUND.create(payloadData);

        let isExist = await STATEMENT_TRANSACTION.find({
          company: findOrder.company,
        })
          .sort({ createdAt: -1 })
          .limit(2);

        if (isExist.length > 0) {
          // Create Cashback statement transaction
          let walletTranaction = {
            type: "Refund to account",
            number: findOrder.orderId,
            amountDr: cashBackData?.cashBack,
            balance: formatNumber(isExist[0]?.balance - cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        } else {
          let walletTranaction = {
            type: "Refund to account",
            number: findOrder.orderId,
            amountDr: cashBackData?.cashBack,
            balance: formatNumber(cashBackData?.cashBack),
            company: new mongoose.Types.ObjectId(findOrder.company),
            createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
            date: dates.toISOString(),
            accountType: findCompany.commissionType,
          };
          await STATEMENT_TRANSACTION.create(walletTranaction);
        }

        await PAYMENT.findByIdAndUpdate(
          { _id: findRefund._id },
          { isRefund: true },
          { new: true }
        );

        res.status(200).send({
          success: true,
          message: "Refund created successfully",
          data: createWallet,
        });
        next();
      }
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${process.env.SECRET_KEY}`);
      myHeaders.append("accept", "application/json");
      myHeaders.append("content-type", "application/json");

      const raw = JSON.stringify({
        charge_id: findTransaction.chargeId,
        amount: findRefund.amount,
        currency: "KWD",
        // reason: data.reason,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://api.tap.company/v2/refunds/", requestOptions)
        .then(async (response) => response.json())
        .then(async (responseData) => {
          // Send the response back to the client
          let payload = {
            userId: findRefund.paidBy,
            amount: findRefund.amount,
            orderId: findOrder._id,
            status: "success",
            chargeId: findTransaction?.chargeId
              ? findTransaction?.chargeId
              : "",
            paymentReturnType: CONST.ACCOUNT,
          };
          let createRefund = await REFUND.create(payload);
          //SEND NOTIFICATION TO USER
          if (findUser.deviceToken) {
            await sendNotification(
              findUser?.deviceToken,
              findUser?.language && findUser?.language == "AR"
                ? "تم إنشاء استرداد المبلغ في حسابك."
                : "Your refund created in your account",
              findUser?.language && findUser?.language == "AR"
                ? `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في حسابك.`
                : `Your refund ${findRefund.amount} KD created for order Id ${findOrder.orderId} in your account`,
              `${JSON.stringify(findOrder)}`,
              CONST.ORDER
            );
          }
          var userNotificationBody = {
            to: findUser._id,
            title: "Your refund created in your account",
            description: `Your refund ${findRefund.amount} KD created for order Id ${findOrder.orderId} in your account`,
            arabicTitle: "تم إنشاء استرداد المبلغ في حسابك.",
            arabicDescription: `تم إنشاء استرداد مبلغ ${findRefund.amount} لطلب ${findOrder.orderId} في حسابك.`,
            notificationType: CONST.ORDER,
            orderId: findOrder._id,
          };
          saveNotification = await NOTIFICATION.create(userNotificationBody);
          res.status(200).send({
            success: true,
            message: "Refund created successfully",
            data: responseData,
          });
        })
        .catch((err) => {
          console.error(err);

          // Handle error case
          res.status(500).send({
            success: false,
            message: "Failed to create charge",
            error: err.message,
          });
        });

      let cashBackData = {
        cashBack: findRefund.amount,
        createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
        orderId: new mongoose.Types.ObjectId(findOrder._id),
        isAdded: true,
      };
      let createCashback = await CASHBACK.create(cashBackData);

      let isExist = await STATEMENT_TRANSACTION.find({
        company: findOrder.company,
      })
        .sort({ createdAt: -1 })
        .limit(2);

      if (isExist.length > 0) {
        // Create Cashback statement transaction
        let walletTranaction = {
          type: "Refund to account",
          number: findOrder.orderId,
          amountDr: cashBackData?.cashBack,
          balance: formatNumber(isExist[0]?.balance - cashBackData?.cashBack),
          company: new mongoose.Types.ObjectId(findOrder.company),
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          date: dates.toISOString(),
          accountType: findCompany.commissionType,
        };
        await STATEMENT_TRANSACTION.create(walletTranaction);
      } else {
        let walletTranaction = {
          type: "Refund to account",
          number: findOrder.orderId,
          amountDr: cashBackData?.cashBack,
          balance: formatNumber(cashBackData?.cashBack),
          company: new mongoose.Types.ObjectId(findOrder.company),
          createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
          date: dates.toISOString(),
          accountType: findCompany.commissionType,
        };
        await STATEMENT_TRANSACTION.create(walletTranaction);
      }

      await PAYMENT.findByIdAndUpdate(
        { _id: findRefund._id },
        { isRefund: true },
        { new: true }
      );

      let findRefundRequest = await REFUND_REQUEST.findOne({
        orderId: findOrder._id,
      });

      let updateRefundStateId = await REFUND_REQUEST.findOneAndUpdate(
        { _id: findRefundRequest._id },
        { stateId: CONST.REFUND },
        { new: true }
      );

      let findRequest = await REFUND_REQUEST.findOneAndDelete({
        orderId: findOrder._id,
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = payment;
