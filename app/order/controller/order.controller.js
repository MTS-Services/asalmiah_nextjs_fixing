/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const {
  setResponseObject,
  generateAflaNumricCode,
  generateDiscountCode,
  generateUniqueID,
  generateOTP,
  formatNumber,
} = require("../../../middleware/commonFunction");
const ORDER = require("../model/order.model");
const { CART } = require("../../cart/model/model");
const { PRODUCT_MODEL } = require("../../product/model/product.model");
const { USER } = require("../../userService/model/userModel");
const { ADDRESS } = require("../../address/model/address.model");
const { PAYMENT, REFUND } = require("../../payment/model/payment.model");
const { CONST } = require("../../../helpers/constant");
const { NOTIFICATION } = require("../../notification/model/notification.model");
const { PROMO_CODE } = require("../../promoCode/model/model");
const { SCHEDULE_ORDER } = require("../../scheduleOrder/model/model");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const { COUPON } = require("../../coupon/model/model");
const { WALLET, POINT } = require("../../wallet/model/model");
const QRCode = require("qrcode");
const nodemailer = require("../../../helpers/nodemailer");
const JsBarcode = require("jsbarcode");
const { createCanvas } = require("canvas");
const mongoose = require("mongoose");
const moment = require("moment/moment");
const {
  ORDER_INCOICE,
  COUPON_TEMPLATE,
  SELLER_ORDER_TEMPLATE,
} = require("../../../helpers/email_template");
const fs = require("fs");
const { COMPANY_MODEL } = require("../../company/model/model");
const ExcelJS = require("exceljs");
const puppeteer = require("puppeteer");
const { BRANCH_MODEL } = require("../../branch/model/model");
const path = require("path");
const {
  createDelivery,
  cancelDelivery,
} = require("../../../helpers/armadaApis");
const { DELIVERY_COMPANY } = require("../../companyDelivery/model/model");
const dir = "../uploads/coupon";

const twilio = require("twilio");
const { STATEMENT_TRANSACTION } = require("../../statementAccount/model/model");
const { CASHBACK } = require("../../cashBack/model/model");
const { USER_SPINNER_MODEL } = require("../../spinner/model/spinner.model");
const { TWILLIO } = require("../../twillio/model/twillio.model");
const { CONTACTINFO } = require("../../contactInfo/model/model");
const { armadaWebhooks } = require("../../payment/model/webhook.model");
const { Sms_Logs } = require("../../errorLogs/model/logModal");
const company = require("../../company/controller/controller");
const { PERMISSION_MODEL } = require("../../permission/model/model");

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const order = {};

async function generateBarcode(code) {
  const canvas = createCanvas(200, 100);
  JsBarcode(canvas, code, {
    format: "CODE128",
    lineColor: "#000000",
    width: 2,
    height: 40,
    displayValue: true,
  });
  const barcodePath = path.join(dir, `${code}-${Date.now()}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(barcodePath, buffer);
  return barcodePath;
}

async function generateQRCode(code, couponCode) {
  const qrCodeCanvas = createCanvas(200, 200);
  await QRCode.toCanvas(qrCodeCanvas, code, { errorCorrectionLevel: "H" });
  const qrCodePath = path.join(dir, `${couponCode}-${Date.now()}.png`);
  const buffer = qrCodeCanvas.toBuffer("image/png");
  fs.writeFileSync(qrCodePath, buffer);
  return qrCodePath;
}

async function generateArmandaQRCode(link) {
  if (!link) {
    throw new Error("Link is required to generate QR code");
  }

  const qrCodeCanvas = createCanvas(200, 200);
  await QRCode.toCanvas(qrCodeCanvas, link, {
    errorCorrectionLevel: "H",
  });

  const qrCodePath = path.join(dir, `qrcode-${Date.now()}.png`);
  const buffer = qrCodeCanvas.toBuffer("image/png");
  fs.writeFileSync(qrCodePath, buffer);
  return qrCodePath;
}

/**
 * VERIFY ACCOUNT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.verifyAccount = async (req, res, next) => {
  try {
    let userData;
    if (req?.body?.email) {
      userData = await USER.findOne({
        $and: [{ email: req.body.email }, { stateId: CONST.ACTIVE }],
      });
    } else {
      userData = await USER.findById({ _id: req.userId });
    }

    let randomNumber = generateOTP();
    let resp =
      req.body.type == 1
        ? "Your account is not verified. An OTP has been sent to your WhatsApp number."
        : "Your account is not verified. An OTP has been sent to your SMS.";
    let twillioData = await TWILLIO.findOne({ stateId: CONST.ACTIVE });

    if (userData.isVerified == false) {
      try {
        if (req.body.type == 1) {
          // Send OTP on whats'aap
          const message = await client.messages.create({
            contentSid: process.env.TWILLIO_OTP_CONTENT_SID,
            contentVariables: JSON.stringify({ 1: randomNumber.toString() }),
            from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
            messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
            to: `whatsapp:${userData.countryCode + userData.mobile}`,
          });

          let sendSms = await Sms_Logs.create({
            from: process.env.TWILLIO_PHONE_NUMBER,
            to: userData?.countryCode + userData?.mobile,
            message: `Your verification OTP for offarat is : ${randomNumber}`,
          });
        } else {
          // Send OTP on mobile
          const sendOtp = await client.messages.create({
            contentSid: "HX845c3fc9da2561cf7d58568cd59400f2",
            contentVariables: JSON.stringify({ 1: randomNumber.toString() }),
            messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
            from: process.env.TWILLIO_PHONE_NUMBER,
            to: userData.countryCode + userData.mobile,
          });

          let sendSms = await Sms_Logs.create({
            from: process.env.TWILLIO_PHONE_NUMBER,
            to: userData?.countryCode + userData?.mobile,
            message: `Your verification OTP for offarat is : ${randomNumber}`,
          });
        }

        const updateOtp = await USER.findOneAndUpdate(
          {
            $and: [
              { email: userData.email },
              { stateId: { $ne: CONST.DELETED } },
            ],
          },
          { otp: randomNumber, otpExpiration: Date.now() + 5 * 60 * 1000 }, // OTP expires in 10 minutes
          { new: true }
        );
        userData.otp = randomNumber;
      } catch (error) {
        console.log("sendOtp", error);
      }

      await setResponseObject(req, true, resp);
      next();
      return;
    } else {
      await setResponseObject(req, true, "Account verify");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VERIFY OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.verifyOtpForOrder = async (req, res, next) => {
  try {
    let data = req.body;

    let findUser;
    if (req?.body?.email) {
      findUser = await USER.findOne({
        $and: [{ email: req.body.email }, { stateId: CONST.ACTIVE }],
      });
    } else {
      findUser = await USER.findOne({ _id: req.userId });
    }

    if (findUser.otpExpiration < Date.now()) {
      await setResponseObject(req, false, "The OTP has expired");
      next();
      return;
    }

    if (parseInt(findUser?.otp) == parseInt(data.otp)) {
      const updateUser = await USER.findOneAndUpdate(
        {
          _id: findUser._id,
        },
        {
          isVerified: true,
        },
        { new: true }
      );

      await setResponseObject(
        req,
        true,
        "OTP verified successfully",
        updateUser
      );
      next();
    } else {
      await setResponseObject(req, false, "Invalid otp");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * RESEND OTP
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.resendOtpForOrder = async (req, res, next) => {
  try {
    let resp =
      req.body.type == 1
        ? "Your account is not verified. An OTP has been sent to your WhatsApp number."
        : "Your account is not verified. An OTP has been sent to your SMS.";

    let randomNumber = generateOTP();

    let userData;
    if (req?.body?.email) {
      userData = await USER.findOne({
        $and: [{ email: req.body.email }, { stateId: CONST.ACTIVE }],
      });
    } else {
      userData = await USER.findById({ _id: req.userId });
    }
    let twillioData = await TWILLIO.findOne({ stateId: CONST.ACTIVE });

    try {
      if (req.body.type == 1) {
        // Send OTP on whats'aap
        const message = await client.messages.create({
          contentSid: process.env.TWILLIO_OTP_CONTENT_SID,
          contentVariables: JSON.stringify({ 1: randomNumber.toString() }),
          from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
          messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
          to: `whatsapp:${userData.countryCode + userData.mobile}`,
        });

        let sendSms = await Sms_Logs.create({
          from: process.env.TWILLIO_PHONE_NUMBER,
          to: userData?.countryCode + userData?.mobile,
          message: `Your verification OTP for offarat is : ${randomNumber}`,
        });
      } else {
        // Send OTP on mobile
        const sendOtp = await client.messages.create({
          contentSid: "HX845c3fc9da2561cf7d58568cd59400f2",
          contentVariables: JSON.stringify({ 1: randomNumber.toString() }),
          messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
          from: process.env.TWILLIO_PHONE_NUMBER,
          to: userData.countryCode + userData.mobile,
        });

        let sendSms = await Sms_Logs.create({
          from: process.env.TWILLIO_PHONE_NUMBER,
          to: userData?.countryCode + userData?.mobile,
          message: `Your verification OTP for offarat is : ${randomNumber}`,
        });
      }
    } catch (error) {
      console.log("sendOtp", error);
    }
    const updateOtp = await USER.findOneAndUpdate(
      {
        $and: [{ email: userData.email }, { stateId: { $ne: CONST.DELETED } }],
      },
      { otp: randomNumber, otpExpiration: Date.now() + 5 * 60 * 1000 }, // OTP expires in 10 minutes
      { new: true }
    );
    await setResponseObject(req, true, resp);
    next();
    return;
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * CREATE ORDER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.createOrder = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    let dates = new Date();
    let data = req.body;

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

    let validCharge;
    if (req.body.paymentType == CONST.ONLINE && req.body.chargeId != null) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${process.env.SECRET_KEY}`);
      myHeaders.append("accept", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      validCharge = await fetch(
        `https://api.tap.company/v2/charges/${data.chargeId}`,
        requestOptions
      ).then((response) => response.json());

      if (validCharge.status != "CAPTURED") {
        await setResponseObject(req, false, "Invalid payment charge Id", []);
        next();
        return;
      }
    }

    if (
      validCharge?.amount != formatNumber(data?.total) &&
      !data?.walletAmount &&
      req?.body?.chargeId != null
    ) {
      await setResponseObject(
        req,
        false,
        "Payment failed, try once again.",
        []
      );
      next();
      return;
    }
    const contactInfo = await CONTACTINFO.findOne({ stateId: CONST.ACTIVE });
    const myCart = await CART.find({ createdBy: req.userId });

    if (myCart.length == 0) {
      await setResponseObject(
        req,
        false,
        "There is no product in your cart",
        []
      );
      next();
      return;
    }

    const findProduct = await PRODUCT_MODEL.findById({
      _id: myCart[0]?.productId,
    });

    const findSeller = await USER.findById({ _id: findProduct.createdBy });

    const arr = [];
    let quentityLength = 0;
    myCart.map(async (e) => {
      const findProduct = await PRODUCT_MODEL.findById({ _id: e.productId });
      let record = {
        items: new mongoose.Types.ObjectId(e.productId),
        productName: e?.productName,
        productArabicName: findProduct?.productArabicName
          ? findProduct?.productArabicName
          : "",
        productImg:
          findProduct?.productImg?.map((img) => ({
            url: img.url,
            type: img.type,
          })) || [],
        size: e?.size,
        color: e?.color,
        shippingCharge: e?.shippingCharge,
        discount: e?.discount,
        mrp: e?.mrp,
        quantity: e?.quantity,
        product_price: e?.purchase_Price,
        product_cost: e?.product_cost,
        discount: e?.discount,
        promocode: e?.promocode,
        note: e?.note,
        answers: e?.answers.map((ele) => ({
          questionId: ele?.questionId,
          answerId: ele?.answerId,
        })),
        deliveryCharge: findProduct?.deliveryCost,
        productPrice: e?.productPrice,
        productCode: findProduct?.productCode,
      };
      quentityLength += e?.quantity;
      arr.push(record);
    });

    let promo = await PROMO_CODE.findOne({ promoCode: data.promocode });

    const findOrder = await ORDER.findOne().sort({ createdAt: -1 });
    if (findOrder) {
      data.orderId = findOrder.orderId + 1;
    } else {
      data.orderId = generateUniqueID(8);
    }

    const payload = {
      products: arr,
      deliveryCharge: data.charge,
      fullName: data.fullName,
      address: data?.address,
      branch: data?.branch,
      paymentType: data.paymentType,
      orderId: data.orderId,
      subTotal: data.subTotal,
      total: data.total,
      createdBy: req.userId,
      orderType: data.orderType,
      promocode: promo?._id,
      rewardId: data?.rewardId,
      company: myCart[0]?.companyId,
      deliveryStatus: CONST.PENDING,
      cashBack: data.cashBack,
    };

    if (data.walletAmount && data.walletAmount !== "null") {
      payload.walletAmount = data.walletAmount;
    }

    for (const element of myCart) {
      let productQuantity = await PRODUCT_MODEL.findOne({
        _id: new mongoose.Types.ObjectId(element.productId),
      });

      if (productQuantity.quantity === 0) {
        await sendNotification(
          findSeller?.deviceToken,
          findSeller.language && findSeller.language == "AR"
            ? "المنتج غير متوفر في المخزون"
            : "Product is out of stock",
          findSeller.language && findSeller.language == "AR"
            ? `${productQuantity.productName} غير متوفر في المخزون`
            : `${productQuantity.productName} is out of stock`,
          `${JSON.stringify(productQuantity)}`
        );

        // SEND NOTIFICATION TO SELLER
        var sellerNotificationBody = {
          to: findSeller._id,
          title: "Product is out of stock",
          arabicTitle: "المنتج غير متوفر في المخزون",
          arabicDescription: `${productQuantity.productName} غير متوفر في المخزون`,
          description: `${productQuantity.productName} is out of stock`,
          notificationType: CONST.PRODUCT,
        };

        let sellerNotificatioN = await NOTIFICATION.create(
          sellerNotificationBody
        );

        await setResponseObject(
          req,
          false,
          "Order not placed due to out of stock"
        );
        next();
        return; // Exit the entire process if any product is out of stock
      }

      if (productQuantity.quantity < element.quantity) {
        await setResponseObject(
          req,
          false,
          "Order not placed due to out of stock"
        );

        next();
        return;
      }

      let minus =
        parseInt(productQuantity.quantity) - parseInt(element.quantity);

      await PRODUCT_MODEL.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(element.productId) },
        { quantity: minus },
        { new: true }
      );
    }

    let order;

    order = await ORDER.create(payload);

    if (order?.rewardId) {
      await USER_SPINNER_MODEL.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(order?.rewardId),
        },
        { isUsed: true },
        { new: true, returnOriginal: false }
      );
    }

    cartTotal = 0;
    sum = [];
    order.products.map((e) => {
      sum.push(e.product_price);
      cartTotal = cartTotal + e.product_price;
    });

    charge = order.products[0].deliveryCharge;

    let totalPrice = cartTotal + charge;

    let findBranch;
    let findAddres;
    if (order?.address && order.address !== "null") {
      findAddres = await ADDRESS.findOne({
        $or: [
          { _id: order?.address },
          { createdBy: req.userId, isDefault: true },
        ],
      });
    }

    if (order?.branch && order.branch !== "null") {
      findBranch = await BRANCH_MODEL.findOne({ _id: order.branch });
    }

    let findCompany = await COMPANY_MODEL.findOne({
      $or: [{ _id: order?.company }, { _id: myCart[0]?.companyId }],
    });

    let findDeliveryCompany = await DELIVERY_COMPANY.findOne({
      _id: findCompany?.deliveryCompany,
    });

    let findPromo = await PROMO_CODE.findOne({ _id: order?.promocode });

    if (req.body.orderType == CONST.DELIVERY) {
      if (
        findCompany.deliveryService == true &&
        findCompany.deliveryCompanyChecked
      ) {
        await ORDER.findOneAndUpdate(
          { _id: order._id },
          {
            deliveryCompanyChecked: findCompany.deliveryCompanyChecked,
            deliveryCompany: findDeliveryCompany?.company,
          },
          { new: true }
        );
      }
    }

    //Give cashBack with promocode
    if (order.promocode && data.orderType == CONST.COUPON) {
      const findPromotion = await PROMO_CODE.findOne({
        _id: order.promocode,
      });
      if (findPromotion.actionType == CONST.CASHBACK) {
        const futureDate = new Date();
        findPromotion.cashbackvalidity = futureDate.setDate(
          futureDate.getDate() + parseInt(findPromotion.cashbackvalidity)
        );

        let amountValue;
        let cashBackData;
        let now = new Date();
        let formattedDate = now.toISOString().replace("Z", "+00:00");
        if (findPromotion.cashBackType == CONST.PERCENTAGE) {
          // amountValue =
          //   order.total - order.total * (findPromotion.discount / 100);

          amountValue = (findPromotion.discount / 100) * order.total;

          if (amountValue > findPromotion.maxDiscountAmount) {
            amountValue = findPromotion.maxDiscountAmount;
          }

          cashBackData = {
            cashBack: amountValue,
            startDate: formattedDate,
            endDate: findPromotion.cashbackvalidity,
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            orderId: new mongoose.Types.ObjectId(order._id),
          };

          const createCashback = await CASHBACK.create(cashBackData);

          const walletExist = await WALLET.findOne({
            userId: order.createdBy,
          });
          if (walletExist) {
            let updateWallet = await WALLET.findOneAndUpdate(
              { _id: walletExist._id },
              { amount: walletExist.amount + cashBackData.cashBack },
              { new: true }
            );
            const cashbackUpdate = await CASHBACK.findOneAndUpdate(
              { _id: createCashback._id },
              { isAdded: true },
              { new: true }
            );
          } else {
            let payload = {
              userId: findOrder.createdBy,
              amount: cashBackData.cashBack,
            };
            let createWallet = await WALLET.create(payload);
            const cashbackUpdate = await CASHBACK.findOneAndUpdate(
              { _id: createCashback._id },
              { isAdded: true },
              { new: true }
            );
          }
        } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
          if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
            amountValue = findPromotion.discount;
            cashBackData = {
              cashBack: amountValue,
              startDate: formattedDate,
              endDate: findPromotion.cashbackvalidity,
              createdBy: new mongoose.Types.ObjectId(order.createdBy),
              orderId: new mongoose.Types.ObjectId(order._id),
            };
            let createCashback = await CASHBACK.create(cashBackData);
            const walletExist = await WALLET.findOne({
              userId: order.createdBy,
            });
            if (walletExist) {
              let updateWallet = await WALLET.findOneAndUpdate(
                { _id: walletExist._id },
                { amount: walletExist.amount + cashBackData.cashBack },
                { new: true }
              );
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            } else {
              let payload = {
                userId: order.createdBy,
                amount: cashBackData.cashBack,
              };
              let createWallet = await WALLET.create(payload);
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            }
          } else if (findPromotion.rotationCashBack == CONST.SEVERAL_TIME) {
            let value = parseInt(order.total / findPromotion.minPurchaseAmount);
            amountValue = parseInt(value * findPromotion.discount);
            cashBackData = {
              cashBack: amountValue,
              startDate: formattedDate,
              endDate: findPromotion.cashbackvalidity,
              createdBy: new mongoose.Types.ObjectId(order.createdBy),
              orderId: new mongoose.Types.ObjectId(order._id),
            };
            let createCashback = await CASHBACK.create(cashBackData);
            const walletExist = await WALLET.findOne({
              userId: order.createdBy,
            });
            if (walletExist) {
              let updateWallet = await WALLET.findOneAndUpdate(
                { _id: walletExist._id },
                { amount: walletExist.amount + createCashback.cashBack },
                { new: true }
              );
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            } else {
              let payload = {
                userId: findOrder.createdBy,
                amount: createCashback.cashBack,
              };
              let createWallet = await WALLET.create(payload);
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            }
          }
        }
      }
    }

    let getSingle = await CONTACTINFO.findOne({ stateId: CONST.ACTIVE });

    if (
      req.body.paymentType == CONST.ONLINE &&
      (req.body.orderType == CONST.DELIVERY ||
        req.body.orderType == CONST.PICKUP)
    ) {
      if (order) {
        if (order?.promocode) {
          let count;

          const isExist = await PROMO_CODE.findOne({
            _id: order.promocode,
            uesdUserCount: { $elemMatch: { userId: req.userId } },
          });

          const matchedUser = isExist?.uesdUserCount.filter((user) =>
            user.userId.equals(req.userId)
          )[0];

          if (matchedUser) {
            count = matchedUser.count + 1;
            apply = await PROMO_CODE.findOneAndUpdate(
              {
                _id: new mongoose.Types.ObjectId(order.promocode),
                "uesdUserCount.userId": new mongoose.Types.ObjectId(req.userId),
              },
              { "uesdUserCount.$.count": count },
              { new: true, returnOriginal: false }
            );
          } else {
            count = 1;
            apply = await PROMO_CODE.findOneAndUpdate(
              { _id: new mongoose.Types.ObjectId(order.promocode) },
              {
                $push: {
                  uesdUserCount: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    count: count,
                  },
                },
              },
              { new: true }
            );
          }
        }
        //Schedule order
        const saveData = await SCHEDULE_ORDER.create({
          startDate: data.startDate,
          endDate: data.endDate,
          orderId: order._id,
          scheduleBy: req.userId,
        });

        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.PENDING,
        };

        updateTracking = await ORDER.findByIdAndUpdate(
          { _id: order._id },
          { $push: { orderTracking: obj } },
          { new: true }
        );

        const clearCart = await CART.deleteMany({
          createdBy: req.userId,
        });

        //SEND NOTIFICATION TO USER
        const findUser = await USER.findById({
          _id: req.userId,
        });
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم تقديم طلبك بنجاح"
              : "Your order placed successfully",
            findUser?.language && findUser?.language == "AR"
              ? "طلبك الذي تم إنشاؤه باستخدام معرف الطلب-" + order.orderId
              : "Your order created with order id-" + order.orderId,
            `${JSON.stringify(order)}`,
            CONST.ORDER
          );
        }

        var userNotificationBody = {
          from: findSeller._id,
          to: req.userId,
          title: "Your order placed successfully",
          description: "Your order created with order id-" + order.orderId,
          arabicTitle: "تم تقديم طلبك بنجاح",
          arabicDescription:
            "طلبك الذي تم إنشاؤه باستخدام معرف الطلب-" + order.orderId,
          notificationType: CONST.ORDER,
          orderId: order._id,
        };

        let userNotification = await NOTIFICATION.create(userNotificationBody);

        const findSellers = await USER.find({
          company: findProduct?.company,
        });

        findSellers?.map(async (e) => {
          // SEND PUSH NOTIFICATION TO SELLER
          var sellerNotificationBody = {
            from: req.userId,
            to: e._id,
            title: "New Order Alert",
            description: `You have received a new order! Order ID: ${order.orderId}. Please check your order list for details.`,
            arabicTitle: "تنبيه الطلب الجديد",
            arabicDescription: `لقد تلقيت طلبًا جديدًا! رقم الطلب: ${order.orderId}. يرجى التحقق من قائمة الطلبات الخاصة بك للحصول على التفاصيل.`,
            notificationType: CONST.ORDER,
            orderId: order._id,
          };

          let sellerNotificatioN = await NOTIFICATION.create(
            sellerNotificationBody
          );

          if (e.deviceToken) {
            await sendNotification(
              e?.deviceToken,
              e?.language && e?.language == "AR"
                ? "تنبيه الطلب الجديد"
                : "New Order Alert",
              e?.language && e?.language == "AR"
                ? `لقد تلقيت طلبًا جديدًا! رقم الطلب: ${order.orderId}. يرجى التحقق من قائمة الطلبات الخاصة بك للحصول على التفاصيل.`
                : `You have received a new order! Order ID: ${order.orderId}. Please check your order list for details.`,
              `${JSON.stringify(order)}`,
              CONST.ORDER
            );
          }

          // SEND INVOICE ON SELLER WHATS'APP
          const FilePath = "../uploads/invoice";

          async function generatePDF(htmlContent) {
            const browser = await puppeteer.launch({
              headless: true,
              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
              ],
            });

            const page = await browser.newPage();
            await page.setContent(htmlContent);

            if (!fs.existsSync(FilePath)) {
              fs.mkdirSync(FilePath, {
                recursive: true,
              });
            }

            const pdfPath = `${FilePath}/invoice-pdf${generateOTP(6)}.pdf`;

            const pdf = await page.pdf({
              path: pdfPath,
              format: "A3",
              displayHeaderFooter: false,
            });

            await browser.close();

            return pdfPath;
          }

          const htmlContent = SELLER_ORDER_TEMPLATE(
            findCompany.company,
            findUser.fullName || "user",
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );

          let pdfPath = await generatePDF(htmlContent);
          pdfPath = pdfPath.replace(/\.\.\//g, "");
          const pdfUrl = `${process.env.IMAGE_BASE_URL}${pdfPath}`;

          try {
            const message = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${e.countryCode + e.mobile}`,
            });
          } catch (error) {
            console.log("errror", error);
          }

          // SEND EMAIL TO SELLER
          await nodemailer.sellerOrderEmail(
            e.email,
            findCompany.company,
            findUser.fullName || "user",
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );
        });

        if (
          data.orderType == CONST.DELIVERY ||
          data.orderType == CONST.PICKUP
        ) {
          // SEND INVOICE ON USER WHATS'APP
          const FilePath = "../uploads/invoice";

          async function generatePDF(htmlContent) {
            const browser = await puppeteer.launch({
              headless: true,
              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
              ],
            });

            const page = await browser.newPage();
            await page.setContent(htmlContent);

            if (!fs.existsSync(FilePath)) {
              fs.mkdirSync(FilePath, {
                recursive: true,
              });
            }

            const pdfPath = `${FilePath}/invoice-pdf${generateOTP(6)}.pdf`;

            const pdf = await page.pdf({
              path: pdfPath,
              format: "A3",
              displayHeaderFooter: false,
            });

            await browser.close();

            return pdfPath;
          }

          const htmlContent = ORDER_INCOICE(
            findUser.fullName || "user",
            findCompany.company,
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );

          let pdfPath = await generatePDF(htmlContent);
          pdfPath = pdfPath.replace(/\.\.\//g, "");
          const pdfUrl = `${process.env.IMAGE_BASE_URL}${pdfPath}`;

          try {
            // Send invoice to user
            const message = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${findUser.countryCode + findUser.mobile}`,
            });
            // Send invoice to company
            const messages = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${findCompany.countryCode + findCompany.mobile}`,
            });

            // Send invoice to offarat
            const messagess = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${contactInfo.whatAppNumber}`,
            });
          } catch (error) {
            console.log("errror", error);
          }

          await nodemailer.userOrderInvoice(
            findUser.email,
            findCompany.company,
            findUser.fullName || "user",
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`,
            arr
          );
        }

        let findWallet;
        if (req.body.walletAmount && req.body.walletAmount !== null) {
          let todayDate = moment(dates).format("YYYY-MM-DD");

          let cashbacks = await CASHBACK.find({
            createdBy: req.userId,
            startDate: { $lte: todayDate },
          }).sort({ endDate: 1 });

          let remainingAmount = req.body.walletAmount;

          if (cashbacks) {
            for (const cashback of cashbacks) {
              if (cashback.cashBack > 0) {
                if (cashback.cashBack >= remainingAmount) {
                  // If the cashback can cover the remaining amount
                  cashback.cashBack -= remainingAmount; // Deduct the used amount
                  remainingAmount = 0; // Payment is fully covered
                } else {
                  // If the cashback cannot fully cover the remaining amount
                  remainingAmount -= cashback.cashBack; // Deduct the cashback amount
                  cashback.cashBack = 0; // Mark this cashback as fully used
                }

                // Save the updated cashback record
                await cashback.save();

                // If cashback is fully used, delete it from the database
                // if (cashback.cashBack === 0) {
                //   await CASHBACK.findOneAndDelete({ _id: cashback._id });
                // }
              }
            }

            let cashBackData = {
              cashBackDr: req.body.walletAmount,
              createdBy: new mongoose.Types.ObjectId(order.createdBy),
              orderId: new mongoose.Types.ObjectId(order._id),
              isAdded: true,
            };

            let createCashback = await CASHBACK.create(cashBackData);

            findWallet = await WALLET.findOne({ userId: req.userId });

            //Charge from wallet
            let updateWallet = await WALLET.findOneAndUpdate(
              { _id: findWallet?._id },
              { amount: findWallet?.amount - data.walletAmount },
              { new: true }
            );
          } else {
            findWallet = await WALLET.findOne({ userId: req.userId });

            //Charge from wallet
            let updateWallet = await WALLET.findOneAndUpdate(
              { _id: findWallet?._id },
              { amount: findWallet?.amount - data.walletAmount },
              { new: true }
            );
          }
        }

        const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
        const payloads = {
          customerId: req.customerId,
          amount: data.total,
          currency: "kwd",
          paidBy: req.userId,
          paidTo: findAdmin._id,
          orderId: order._id,
          status: "success",
          insertDate: Math.floor(Date.now() / 1000),
          paymentType: CONST.ONLINE,
          chargeId: data.chargeId,
        };

        let createPayment = await PAYMENT.create(payloads);

        await setResponseObject(
          req,
          true,
          "Your order place successfully",
          order
        );
        next();
      }
    } else if (
      (req.body.paymentType == CONST.WALLETS || req.body.paymentType == null) &&
      (req.body.orderType == CONST.DELIVERY ||
        req.body.orderType == CONST.PICKUP)
    ) {
      if (order) {
        if (order.promocode) {
          let count;

          const isExist = await PROMO_CODE.findOne({
            _id: order.promocode,
            uesdUserCount: { $elemMatch: { userId: req.userId } },
          });

          const matchedUser = isExist?.uesdUserCount.filter((user) =>
            user.userId.equals(req.userId)
          )[0];

          if (matchedUser) {
            count = matchedUser.count + 1;
            apply = await PROMO_CODE.findOneAndUpdate(
              {
                _id: new mongoose.Types.ObjectId(order.promocode),
                "uesdUserCount.userId": new mongoose.Types.ObjectId(req.userId),
              },
              { "uesdUserCount.$.count": count },
              { new: true, returnOriginal: false }
            );
          } else {
            count = 1;
            apply = await PROMO_CODE.findOneAndUpdate(
              { _id: new mongoose.Types.ObjectId(order.promocode) },
              {
                $push: {
                  uesdUserCount: {
                    userId: new mongoose.Types.ObjectId(req.userId),
                    count: count,
                  },
                },
              },
              { new: true }
            );
          }
        }

        //Schedule order
        const saveData = await SCHEDULE_ORDER.create({
          startDate: data.startDate,
          endDate: data.endDate,
          orderId: order._id,
          scheduleBy: req.userId,
        });

        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.PENDING,
        };

        updateTracking = await ORDER.findByIdAndUpdate(
          { _id: order._id },
          { $push: { orderTracking: obj } },
          { new: true }
        );

        const clearCart = await CART.deleteMany({
          createdBy: req.userId,
        });

        //SEND NOTIFICATION TO USER
        const findUser = await USER.findById({
          _id: req.userId,
        });
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم تقديم طلبك بنجاح"
              : "Your order placed successfully",
            findUser?.language && findUser?.language == "AR"
              ? "طلبك الذي تم إنشاؤه باستخدام معرف الطلب-" + order.orderId
              : "Your order created with order id-" + order.orderId,
            `${JSON.stringify(order)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          from: findSeller._id,
          to: req.userId,
          title: "Your order placed successfully",
          description: "Your order created with order id-" + order.orderId,
          arabicTitle: "تم تقديم طلبك بنجاح",
          arabicDescription:
            "طلبك الذي تم إنشاؤه باستخدام معرف الطلب-" + order.orderId,
          notificationType: CONST.ORDER,
          orderId: order._id,
        };

        let userNotification = await NOTIFICATION.create(userNotificationBody);

        const findSellers = await USER.find({
          company: findProduct?.company,
        });

        findSellers?.map(async (e) => {
          // SEND PUSH NOTIFICATION TO SELLER
          var sellerNotificationBody = {
            from: req.userId,
            to: e._id,
            title: "New Order Alert",
            description: `You have received a new order! Order ID: ${order.orderId}. Please check your order list for details.`,
            arabicTitle: "تنبيه الطلب الجديد",
            arabicDescription: `لقد تلقيت طلبًا جديدًا! رقم الطلب: ${order.orderId}. يرجى التحقق من قائمة الطلبات الخاصة بك للحصول على التفاصيل.`,
            notificationType: CONST.ORDER,
            orderId: order._id,
          };

          let sellerNotificatioN = await NOTIFICATION.create(
            sellerNotificationBody
          );

          if (e.deviceToken) {
            await sendNotification(
              e?.deviceToken,
              e?.language && e?.language == "AR"
                ? "تنبيه الطلب الجديد"
                : "New Order Alert",
              e?.language && e?.language == "AR"
                ? `لقد تلقيت طلبًا جديدًا! رقم الطلب: ${order.orderId}. يرجى التحقق من قائمة الطلبات الخاصة بك للحصول على التفاصيل.`
                : `You have received a new order! Order ID: ${order.orderId}. Please check your order list for details.`,
              `${JSON.stringify(order)}`,
              CONST.ORDER
            );
          }

          // SEND INVOICE ON SELLER WHATS'APP
          const FilePath = "../uploads/invoice";

          async function generatePDF(htmlContent) {
            const browser = await puppeteer.launch({
              headless: true,
              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
              ],
            });

            const page = await browser.newPage();
            await page.setContent(htmlContent);

            if (!fs.existsSync(FilePath)) {
              fs.mkdirSync(FilePath, {
                recursive: true,
              });
            }

            const pdfPath = `${FilePath}/invoice-pdf${generateOTP(6)}.pdf`;

            const pdf = await page.pdf({
              path: pdfPath,
              format: "A3",
              displayHeaderFooter: false,
            });

            await browser.close();

            return pdfPath;
          }

          const htmlContent = SELLER_ORDER_TEMPLATE(
            findCompany.company,
            findUser.fullName || "user",
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );

          let pdfPath = await generatePDF(htmlContent);
          pdfPath = pdfPath.replace(/\.\.\//g, "");
          const pdfUrl = `${process.env.IMAGE_BASE_URL}${pdfPath}`;

          try {
            const message = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${e.countryCode + e.mobile}`,
            });
          } catch (error) {
            console.log("errror", error);
          }

          // SEND EMAIL TO SELLER
          await nodemailer.sellerOrderEmail(
            e.email,
            findCompany.company,
            findUser.fullName || "user",
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );
        });

        if (
          data.orderType == CONST.DELIVERY ||
          data.orderType == CONST.PICKUP
        ) {
          // SEND INVOICE ON USER WHATS'APP
          const FilePath = "../uploads/invoice";

          async function generatePDF(htmlContent) {
            const browser = await puppeteer.launch({
              headless: true,
              args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
              ],
            });

            const page = await browser.newPage();
            await page.setContent(htmlContent);

            if (!fs.existsSync(FilePath)) {
              fs.mkdirSync(FilePath, {
                recursive: true,
              });
            }

            const pdfPath = `${FilePath}/invoice-pdf${generateOTP(6)}.pdf`;

            const pdf = await page.pdf({
              path: pdfPath,
              format: "A3",
              displayHeaderFooter: false,
            });

            await browser.close();

            return pdfPath;
          }

          const htmlContent = ORDER_INCOICE(
            findUser.fullName || "user",
            findCompany.company,
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser.countryCode + findUser.mobile}`,
            order.orderId,
            findUser?.fullName || "user",
            order.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order.products,
            order.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );

          let pdfPath = await generatePDF(htmlContent);
          pdfPath = pdfPath.replace(/\.\.\//g, "");
          const pdfUrl = `${process.env.IMAGE_BASE_URL}${pdfPath}`;
          try {
            // Send invoice to user
            const message = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${findUser.countryCode + findUser.mobile}`,
            });

            // Send invoice to company
            const messages = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${findCompany.countryCode + findCompany.mobile}`,
            });

            // Send invoice to offarat
            const messagess = await client.messages.create({
              contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
              contentVariables: JSON.stringify({
                1: `api/${pdfPath}`,
              }),
              from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
              messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
              to: `whatsapp:${contactInfo.whatAppNumber}`,
            });
          } catch (error) {
            console.log("errror", error);
          }

          await nodemailer.userOrderInvoice(
            findUser?.email,
            findCompany?.company,
            findUser?.fullName || "user",
            findAddres?.area ? findAddres?.area : findBranch?.area,
            findAddres?.appartment
              ? findAddres?.appartment
              : findBranch?.branchName,
            `${findUser?.countryCode + findUser?.mobile}`,
            order?.orderId,
            findUser?.fullName || "user",
            order?.createdAt,
            data.orderType == CONST.DELIVERY ? "Delivery" : "Pickup",
            order?.products,
            order?.subTotal,
            findPromo?.discount ? findPromo?.discount : 0,
            order.deliveryCharge ? order.deliveryCharge : 0,
            order?.total,
            `${getSingle.countryCode}${getSingle.mobile}`
          );
        }

        let findWallet;
        if (req.body.walletAmount && req.body.walletAmount !== null) {
          let todayDate = moment(dates).format("YYYY-MM-DD");

          let cashbacks = await CASHBACK.find({
            createdBy: req.userId,
            startDate: { $lte: todayDate },
          }).sort({ endDate: 1 });

          let remainingAmount = req.body.walletAmount;

          if (cashbacks) {
            for (const cashback of cashbacks) {
              if (cashback.cashBack > 0) {
                if (cashback.cashBack >= remainingAmount) {
                  // If the cashback can cover the remaining amount
                  cashback.cashBack -= remainingAmount; // Deduct the used amount
                  remainingAmount = 0; // Payment is fully covered
                } else {
                  // If the cashback cannot fully cover the remaining amount
                  remainingAmount -= cashback.cashBack; // Deduct the cashback amount
                  cashback.cashBack = 0; // Mark this cashback as fully used
                }

                // Save the updated cashback record
                await cashback.save();

                // If cashback is fully used, delete it from the database
                // if (cashback.cashBack === 0) {
                //   await CASHBACK.findOneAndDelete({ _id: cashback._id });
                // }
              }
            }

            let cashBackData = {
              cashBackDr: req.body.walletAmount,
              createdBy: new mongoose.Types.ObjectId(order.createdBy),
              orderId: new mongoose.Types.ObjectId(order._id),
              isAdded: true,
            };

            let createCashback = await CASHBACK.create(cashBackData);

            findWallet = await WALLET.findOne({ userId: req.userId });

            //Charge from wallet
            let updateWallet = await WALLET.findOneAndUpdate(
              { _id: findWallet?._id },
              { amount: findWallet?.amount - data.walletAmount },
              { new: true }
            );
          } else {
            findWallet = await WALLET.findOne({ userId: req.userId });

            //Charge from wallet
            let updateWallet = await WALLET.findOneAndUpdate(
              { _id: findWallet?._id },
              { amount: findWallet?.amount - data.walletAmount },
              { new: true }
            );
          }
        }

        const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
        const payloads = {
          customerId: req.customerId,
          amount: data.total,
          currency: "kwd",
          paidBy: req.userId,
          paidTo: findAdmin._id,
          orderId: order._id,
          status: "success",
          insertDate: Math.floor(Date.now() / 1000),
          paymentType: CONST.WALLETS,
        };

        let createPayment = await PAYMENT.create(payloads);

        await setResponseObject(
          req,
          true,
          "Your order place successfully",
          order
        );
        next();
      }
    } else if (
      req.body.orderType == CONST.COUPON &&
      (req.body.paymentType == CONST.ONLINE ||
        req.body.paymentType == CONST.WALLETS ||
        req.body.paymentType == null)
    ) {
      if (order.promocode) {
        let count;

        const isExist = await PROMO_CODE.findOne({
          _id: order.promocode,
          uesdUserCount: { $elemMatch: { userId: req.userId } },
        });

        const matchedUser = isExist?.uesdUserCount.filter((user) =>
          user.userId.equals(req.userId)
        )[0];

        if (matchedUser) {
          count = matchedUser.count + 1;
          apply = await PROMO_CODE.findOneAndUpdate(
            {
              _id: new mongoose.Types.ObjectId(order.promocode),
              "uesdUserCount.userId": new mongoose.Types.ObjectId(req.userId),
            },
            { "uesdUserCount.$.count": count },
            { new: true, returnOriginal: false }
          );
        } else {
          count = 1;
          apply = await PROMO_CODE.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(order.promocode) },
            {
              $push: {
                uesdUserCount: {
                  userId: new mongoose.Types.ObjectId(req.userId),
                  count: count,
                },
              },
            },
            { new: true }
          );
        }
      }


      //Update order traking
      obj = {
        date: dates.toISOString(),
        stateId: CONST.PENDING,
      };

      updateTracking = await ORDER.findByIdAndUpdate(
        { _id: order._id },
        { $push: { orderTracking: obj } },
        { new: true }
      );

      const now = new Date();
      const formattedDate = now.toISOString();

      let arr = [];
      await Promise.all(
        myCart.map(async (e) => {
          let discountCode = generateDiscountCode();
          for (let i = 0; i < e.quantity; i++) {
            let findProduct = await PRODUCT_MODEL.findOne({
              _id: e.productId,
            });
            // Create order
            let obj = {
              date: dates.toISOString(),
              stateId: CONST.PENDING,
            };

            // Create coupon
            let couponCode = generateAflaNumricCode(12);

            let productData = {
              items: new mongoose.Types.ObjectId(e.productId),
              productName: e?.productName,
              productArabicName: findProduct?.productArabicName
                ? findProduct?.productArabicName
                : "",
              productImg:
                findProduct?.productImg?.map((img) => ({
                  url: img.url,
                  type: img.type,
                })) || [],
              size: e.size,
              color: e.color,
              shippingCharge: e.shippingCharge,
              discount: e.discount,
              mrp: e.mrp,
              quantity: 1,
              product_price: e.productPrice,
              product_cost: e.productPrice,
              discount: e.discount,
              promocode: e?.promocode,
              note: e.note,
              answers: e.answers.map((ele) => ({
                questionId: ele.questionId,
                answerId: ele.answerId,
              })),
              deliveryCharge: findProduct.deliveryCost,
              productPrice: e.productPrice,
              productCode: findProduct?.productCode,
            };

            const orderPayload = {
              products: productData,
              fullName: data.fullName,
              paymentType: data.paymentType,
              subTotal: e.productPrice,
              total: e.productPrice,
              createdBy: req.userId,
              orderType: CONST.COUPON,
              promocode: promo?._id,
              rewardId: data?.rewardId,
              company: myCart[0]?.companyId,
              deliveryStatus: CONST.PENDING,
              orderTracking: obj,
              visibleToSeller: false,
              couponCode: couponCode,
            };

            if (e?.cashbackAmount) {
              orderPayload.promoAmount = e?.cashbackAmount / quentityLength;
              orderPayload.cashBack = e?.cashbackAmount / quentityLength;
            }

            const findOrder = await ORDER.findOne().sort({ createdAt: -1 });
            if (findOrder) {
              orderPayload.orderId = findOrder.orderId + 1;
            } else {
              orderPayload.orderId = generateUniqueID(8);
            }

            const createOrder = await ORDER.create(orderPayload);

            let datePart = findProduct.couponValidity;
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 5);
            const payload = {
              couponCode: couponCode,
              discount: discountCode,
              company: myCart[0]?.companyId,
              createdBy: req.userId,
              startDate: formattedDate,
              endDate: datePart ? new Date(datePart) : currentDate,
              item: e?.productName,
              itemDescription: findProduct?.description,
              images: findProduct?.productImg[0].url,
              productId: findProduct?._id,
              mrp: e?.mrp,
              itemPrice: e?.productPrice,
              productDiscount: e?.discount,
              size: e.size ? e?.size : "",
              color: e?.color ? e?.color : "",
              orderId: createOrder?._id,
              promoAmount: createOrder?.promoAmount,
              actualOrderId: order._id,
            };

            const saveData = await COUPON.create(payload);

            const qrData = {
              couponCode: couponCode,
              discount: discountCode,
              startDate: saveData.startDate,
              endDate: saveData.endDate,
              company: saveData.company,
              item: findProduct.productName,
              itemId: findProduct._id,
            };
            const payloadString = JSON.stringify(qrData);

            const barcodeBase64 = await generateBarcode(couponCode);
            const qrCodeBase64 = await generateQRCode(
              payloadString,
              couponCode
            );

            payload.barcodeBase64 = process.env.IMAGE_BASE_URL + barcodeBase64;
            payload.qrCodeBase64 = process.env.IMAGE_BASE_URL + qrCodeBase64;
            payload.barcodeBase64 = payload.barcodeBase64.replace(
              /\/\.\.\//g,
              "/"
            );
            payload.qrCodeBase64 = payload.qrCodeBase64.replace(
              /\/\.\.\//g,
              "/"
            );

            arr.push(payload);
          }
        })
      );

      const clearCart = await CART.deleteMany({
        createdBy: req.userId,
      });

      const findUser = await USER.findById({
        _id: req.userId,
      });

      //SEND NOTIFICATION TO USER
      if (findUser.deviceToken) {
        await sendNotification(
          findUser?.deviceToken,
          findUser?.language && findUser?.language == "AR"
            ? "تم تقديم طلبك بنجاح"
            : "Your order placed successfully",
          findUser?.language && findUser?.language == "AR"
            ? "طلبك الذي تم إنشاؤه باستخدام معرف الطلب-" + order.orderId
            : "Your order created with order id-" + order.orderId,
          `${JSON.stringify(order)}`,
          CONST.ORDER
        );
      }
      var userNotificationBody = {
        from: findSeller._id,
        to: req.userId,
        title: "Your order placed successfully",
        description: "Your order created with order id-" + order.orderId,
        arabicTitle: "تم تقديم طلبك بنجاح",
        arabicDescription:
          "طلبك الذي تم إنشاؤه باستخدام معرف الطلب-" + order.orderId,
        notificationType: CONST.ORDER,
        orderId: order._id,
      };

      let userNotification = await NOTIFICATION.create(userNotificationBody);

      // SEND INVOICE ON USER WHATS'APP

      const FilePath = "../uploads/invoice";

      async function generatePDF(htmlContent) {
        const browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
          ],
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent);

        if (!fs.existsSync(FilePath)) {
          fs.mkdirSync(FilePath, {
            recursive: true,
          });
        }

        const pdfPath = `${FilePath}/invoice-pdf${generateOTP(6)}.pdf`;

        const pdf = await page.pdf({
          path: pdfPath,
          format: "A3",
          displayHeaderFooter: false,
        });

        await browser.close();

        return pdfPath;
      }

      const htmlContent = COUPON_TEMPLATE(
        findCompany.company,
        findUser.fullName || "user",
        findAddres?.area ? findAddres?.area : findBranch?.area,
        findAddres?.appartment
          ? findAddres?.appartment
          : findBranch?.branchName,
        `${findUser.countryCode + findUser.mobile}`,
        order.orderId,
        findUser?.fullName || "user",
        order.createdAt,
        "Coupon",
        order.products,
        order.subTotal,
        findPromo?.discount ? findPromo?.discount : 0,
        order.deliveryCharge ? order.deliveryCharge : 0,
        order.total,
        `${getSingle.countryCode}${getSingle.mobile}`,
        arr
      );

      let pdfPath = await generatePDF(htmlContent);
      pdfPath = pdfPath.replace(/\.\.\//g, "");

      const pdfUrl = `${process.env.IMAGE_BASE_URL}${pdfPath}`;

      try {
        // Send invoice to user
        const message = await client.messages.create({
          contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
          contentVariables: JSON.stringify({
            1: `api/${pdfPath}`,
          }),
          from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
          messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
          to: `whatsapp:${findUser.countryCode + findUser.mobile}`,
        });
        // Send invoice to offarat
        const messagess = await client.messages.create({
          contentSid: process.env.TWILLIO_INVOICE_CONTENT_SID,
          contentVariables: JSON.stringify({
            1: `api/${pdfPath}`,
          }),
          from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
          messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
          to: `whatsapp:${contactInfo.whatAppNumber}`,
        });
      } catch (error) {
        console.log("errror", error);
      }

      await nodemailer.couponEmail(
        findUser.email,
        findCompany.company,
        findUser.fullName || "user",
        findAddres?.area ? findAddres?.area : findBranch?.area,
        findAddres?.appartment
          ? findAddres?.appartment
          : findBranch?.branchName,
        `${findUser.countryCode + findUser.mobile}`,
        "-",
        findUser?.fullName || "user",
        order.createdAt,
        "Coupon",
        order.products,
        order.subTotal,
        findPromo?.discount ? findPromo?.discount : 0,
        order?.deliveryCharge ? order?.deliveryCharge : 0,
        order.total,
        `${getSingle.countryCode}${getSingle.mobile}`,
        arr
      );

      let findWallet;
      if (req.body.walletAmount && req.body.walletAmount !== null) {
        let todayDate = moment(dates).format("YYYY-MM-DD");

        let cashbacks = await CASHBACK.find({
          createdBy: req.userId,
          startDate: { $lte: todayDate },
        }).sort({ endDate: 1 });

        let remainingAmount = req.body.walletAmount;

        if (cashbacks) {
          for (const cashback of cashbacks) {
            if (cashback.cashBack > 0) {
              if (cashback.cashBack >= remainingAmount) {
                // If the cashback can cover the remaining amount
                cashback.cashBack -= remainingAmount; // Deduct the used amount
                remainingAmount = 0; // Payment is fully covered
              } else {
                // If the cashback cannot fully cover the remaining amount
                remainingAmount -= cashback.cashBack; // Deduct the cashback amount
                cashback.cashBack = 0; // Mark this cashback as fully used
              }

              // Save the updated cashback record
              await cashback.save();

              // If cashback is fully used, delete it from the database
              // if (cashback.cashBack === 0) {
              //   await CASHBACK.findOneAndDelete({ _id: cashback._id });
              // }
            }
          }

          let cashBackData = {
            cashBackDr: req.body.walletAmount,
            createdBy: new mongoose.Types.ObjectId(order.createdBy),
            orderId: new mongoose.Types.ObjectId(order._id),
            isAdded: true,
          };

          let createCashback = await CASHBACK.create(cashBackData);

          findWallet = await WALLET.findOne({ userId: req.userId });

          //Charge from wallet
          let updateWallet = await WALLET.findOneAndUpdate(
            { _id: findWallet?._id },
            { amount: findWallet?.amount - data.walletAmount },
            { new: true }
          );
        } else {
          findWallet = await WALLET.findOne({ userId: req.userId });

          //Charge from wallet
          let updateWallet = await WALLET.findOneAndUpdate(
            { _id: findWallet?._id },
            { amount: findWallet?.amount - data.walletAmount },
            { new: true }
          );
        }
      }

      const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
      let payloads = {
        customerId: req.customerId,
        amount: formatNumber(data.total),
        currency: "kwd",
        paidBy: req.userId,
        paidTo: findAdmin._id,
        orderId: order._id,
        status: "success",
        insertDate: Math.floor(Date.now() / 1000),
        paymentType:
          req.body.paymentType == CONST.ONLINE
            ? req.body.paymentType == CONST.ONLINE
            : CONST.WALLETS,
        chargeId: data.chargeId,
      };

      let createPayment = await PAYMENT.create(payloads);
      let updateOrder = await ORDER.findByIdAndUpdate(
        { _id: order._id },
        { visibleToSeller: false, deliveryStatus: CONST.ORDERDELETED },
        { new: true }
      );

      await setResponseObject(
        req,
        true,
        "Your order place successfully",
        order
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY ORDER LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.myOrder = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let dates = new Date();
    let todayDate = moment(dates).format("YYYY-MM-DD");

    let cashBack = await CASHBACK.find({
      createdBy: req.userId,
      startDate: { $lte: todayDate },
    }).sort({ endDate: 1 });

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let deliveryFilter = {};
    switch (req.query.deliveryStatus) {
      case "5":
        deliveryFilter = {
          deliveryStatus: CONST.PENDING,
        };
        break;

      case "8":
        deliveryFilter = {
          deliveryStatus: CONST.SHIPPED,
        };
        break;

      case "9":
        deliveryFilter = {
          deliveryStatus: CONST.COMPLETED,
        };
        break;

      case "10":
        deliveryFilter = {
          deliveryStatus: CONST.CANCELED,
        };
        break;

      case "11":
        deliveryFilter = {
          deliveryStatus: CONST.READY,
        };
        break;

      default:
        break;
    }

    let deliveryState = { deliveryStatus: { $ne: CONST.ORDERDELETED } };
    switch (req.query.deliveryState) {
      case "1": // Ongoing
        deliveryState = {
          $or: [
            { deliveryStatus: CONST.PENDING },
            { deliveryStatus: CONST.READY },
            { deliveryStatus: CONST.SHIPPED },
          ],
        };
        break;

      case "2": // Past
        deliveryState = {
          $or: [
            { deliveryStatus: CONST.COMPLETED },
            { deliveryStatus: CONST.CANCELED },
          ],
        };
        break;

      default:
        break;
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search.replace(
        new RegExp("\\\\", "g"),
        "\\\\"
      );

      // Escape special characters in searchValue for regex
      const escapedSearchValue = searchValue.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

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
          orderId: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          orderId: {
            $eq: searchNumber,
          },
        },
        {
          mobileNumber: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
      ];
    }

    const orderList = await ORDER.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $match: deliveryFilter,
      },
      {
        $match: deliveryState,
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$id",
                        in: {
                          $toObjectId: "$$this",
                        },
                      },
                    },
                  ],
                },
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
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] },
              },
            },
            {
              $project: {
                _id: 1,
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
                as: "company",
              },
            },
            {
              $unwind: {
                path: "$company",
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
          from: "branches",
          let: { id: "$branch" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
          from: "scheduleorders",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$orderId"] },
              },
            },
          ],
          as: "scheduleorder",
        },
      },
      {
        $unwind: {
          path: "$scheduleorder",
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $match: searchFilter,
      },
      {
        $project: {
          _id: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                items: "$$product.items",
                productName: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Assuming you have a field that indicates the language
                    then: "$$product.productArabicName",
                    else: "$$product.productName",
                  },
                },
                productImg: "$$product.productImg",
                quantity: "$$product.quantity",
                product_price: "$$product.product_price",
                discount: "$$product.discount",
                mrp: "$$product.mrp",
                deliveryCharge: "$$product.deliveryCharge",
                size: "$$product.size",
                color: "$$product.color",
                answers: "$$product.answers",
                _id: "$$product._id",
              },
            },
          },
          orderId: 1,
          deliveryCharge: 1,
          subTotal: 1,
          total: 1,
          address: 1,
          deliveryStatus: 1,
          paymentType: 1,
          orderType: 1,
          paymentReturnType: 1,
          walletAmount: 1,
          orderTracking: 1,
          createdAt: 1,
          productDetails: 1,
          companyDetails: 1,
          branchDetails: 1,
          scheduleorder: 1,
          trackingLink: 1,
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

    if (orderList && orderList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        orderList[0].data,
        orderList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ORDER DETAILS FOR USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.orderDetails = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    const orderDetails = await ORDER.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$id",
                        in: {
                          $toObjectId: "$$this",
                        },
                      },
                    },
                  ],
                },
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
                      createdBy: new mongoose.Types.ObjectId(req.userId),
                    },
                  },
                ],
                as: "rating",
              },
            },

            {
              $addFields: {
                isWishlist: {
                  $cond: {
                    if: { $size: "$rating" },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
          as: "productDetails",
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
          as: "addressesDetails",
        },
      },
      {
        $unwind: {
          path: "$addressesDetails",
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
                country: 1,
                countryCode: 1,
                mobile: 1,
                email: 1,
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
        $lookup: {
          from: "scheduleorders",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$orderId"] },
              },
            },
          ],
          as: "scheduleorder",
        },
      },
      {
        $unwind: {
          path: "$scheduleorder",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] },
              },
            },
            {
              $project: {
                _id: 1,
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
                as: "company",
              },
            },
            {
              $unwind: {
                path: "$company",
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
          from: "branches",
          let: { id: "$branch" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
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
          from: "coupons",
          let: { id: "$couponCode" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "couponDetails",
        },
      },
      {
        $unwind: {
          path: "$couponDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "refundrequests",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$orderId"] },
                // stateId: CONST.REFUND,
              },
            },
          ],
          as: "refundDetails",
        },
      },
      {
        $unwind: {
          path: "$refundDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "payments",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$orderId"] },
              },
            },
            {
              $project: {
                _id: -1,
                isRefund: 1,
              },
            },
          ],
          as: "paymentDetails",
        },
      },
      {
        $unwind: {
          path: "$paymentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                items: "$$product.items",
                productName: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Assuming you have a field that indicates the language
                    then: "$$product.productArabicName",
                    else: "$$product.productName",
                  },
                },
                productImg: "$$product.productImg",
                quantity: "$$product.quantity",
                product_price: "$$product.product_price",
                discount: "$$product.discount",
                mrp: "$$product.mrp",
                deliveryCharge: "$$product.deliveryCharge",
                size: "$$product.size",
                color: "$$product.color",
                answers: "$$product.answers",
                _id: "$$product._id",
                isRefund: "$$product.isRefund",
                productCode: "$$product.productCode",
              },
            },
          },
          orderId: 1,
          deliveryCharge: 1,
          subTotal: 1,
          total: 1,
          deliveryStatus: 1,
          paymentType: 1,
          orderType: 1,
          paymentReturnType: 1,
          walletAmount: 1,
          orderTracking: 1,
          createdAt: 1,
          productDetails: 1,
          companyDetails: 1,
          branchDetails: 1,
          scheduleorder: 1,
          addressesDetails: 1,
          userDetails: 1,
          trackingLink: 1,
          qrCodeLink: 1,
          promoDetails: 1,
          paymentDetails: 1,
          refundDetails: 1,
          deliveryCompanyChecked: 1,
          deliveryCompany: 1,
          cashBack: 1,
        },
      },
    ]);

    if (orderDetails.length > 0) {
      await setResponseObject(
        req,
        true,
        "Order details found successfully",
        orderDetails[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Order details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * CANCEL ORDER BY USER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.cancelOrder = async (req, res, next) => {
  try {
    const data = req.body;

    const findOrder = await ORDER.findById({ _id: req.params.id });
    const findUser = await USER.findById({ _id: findOrder.createdBy });

    const findProduct = await PRODUCT_MODEL.findById({
      _id: findOrder.products[0].items,
    });
    const findSeller = await USER.findById({ _id: findProduct.createdBy });

    let findTransaction = await PAYMENT.findOne({
      orderId: findOrder._id,
    });

    let findCompany = await COMPANY_MODEL.findById({
      _id: findOrder?.company,
    });

    const cancelOrder = await ORDER.findByIdAndUpdate(
      { _id: req.params.id },
      {
        deliveryStatus: data.deliveryStatus,
        reason: data.reason,
        paymentReturnType: data.paymentReturnType,
      },
      { new: true }
    );

    if (cancelOrder) {
      const order = await ORDER.findById({ _id: req.params.id });

      order.products.map(async (e) => {
        const findProduct = await PRODUCT_MODEL.findById({
          _id: e.items,
        });
        const quantity = parseInt(findProduct.quantity) + parseInt(e.quantity);
        const update = await PRODUCT_MODEL.findByIdAndUpdate(
          { _id: e.items },
          { quantity: quantity },
          { new: true }
        );
      });

      //SEND NOTIFICATION TO USER
      if (findUser.deviceToken) {
        await sendNotification(
          findUser?.deviceToken,
          findUser?.language && findUser?.language == "AR"
            ? "تم إلغاء طلبك بنجاح."
            : "Your order cancelled successfully.",
          findUser?.language && findUser?.language == "AR"
            ? `تم إلغاء طلبك ${findOrder.orderId} بنجاح، وسيتم رد المبلغ في أقرب وقت ممكن.`
            : `Your order Id ${findOrder.orderId} is cancelled successfully, amount will be refunded in your account as soon as possible.`,
          `${JSON.stringify(findOrder)}`,
          CONST.ORDER
        );
      }
      var userNotificationBody = {
        to: findUser._id,
        title: "Your order cancelled successfully.",
        description: `Your order Id ${findOrder.orderId} is cancelled successfully, amount will be refunded in your account as soon as possible.`,
        arabicTitle: "تم إلغاء طلبك بنجاح.",
        arabicDescription: `تم إلغاء طلبك ${findOrder.orderId} بنجاح، وسيتم رد المبلغ في أقرب وقت ممكن.`,
        notificationType: CONST.ORDER,
        orderId: findOrder._id,
      };

      let saveNotification = await NOTIFICATION.create(userNotificationBody);

      //Update order traking
      let dates = new Date();
      obj = {
        date: dates.toISOString(),
        stateId: CONST.CANCELED,
      };

      updateTracking = await ORDER.findByIdAndUpdate(
        { _id: order._id },
        { $push: { orderTracking: obj } },
        { new: true }
      );

      // Add refund
      let walletExist = await WALLET.findOne({ userId: findOrder.createdBy });
      if (walletExist) {
        let updateWallet = await WALLET.findOneAndUpdate(
          { _id: walletExist._id },
          { amount: walletExist.amount + findOrder.total },
          { new: true }
        );
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
      } else {
        let payload = {
          userId: findOrder.createdBy,
          amount: findOrder.total,
        };
        let createWallet = await WALLET.create(payload);

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إنشاء استرداد المبلغ في محفظتك."
              : "Your refund created in your wallet",
            findUser?.language && findUser?.language == "AR"
              ? `تم إنشاء استرداد مبلغ ${formatNumber(
                  findOrder.total
                )} لطلب ${formatNumber(findOrder.orderId)} في محفظتك.`
              : `Your refund ${findOrder.total} KD created for order Id ${findOrder.orderId} in your wallet`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your refund created in your wallet",
          description: `Your refund ${findOrder.total} KD created for order Id ${findOrder.orderId} in your wallet`,
          arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
          arabicDescription: `تم إنشاء استرداد مبلغ ${formatNumber(
            findOrder.total
          )} لطلب ${formatNumber(findOrder.orderId)} في محفظتك.`,
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
      }

      if (findOrder?.deliveryCode) {
        let findBranch = await BRANCH_MODEL.findOne({ _id: findOrder.branch });
        let deliveryCancel = await cancelDelivery(
          findOrder?.deliveryCode,
          findBranch?.branchKey
        );

        let removeTrackingLink = await ORDER.findByIdAndUpdate(
          { _id: req.params.id },
          { $unset: { trackingLink: "", qrCodeLink: "" } }, // Use $unset to remove the fields
          { new: true }
        );
      }

      // Create statement transaction
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

      let updateOrder = await ORDER.findOneAndUpdate(
        { _id: findOrder?._id }, // Find the order by its ID
        { $set: { "products.$[].isRefund": true } }, // Update all products' isRefund field to true
        { new: true }
      );

      if (findTransaction) {
        await PAYMENT.findByIdAndUpdate(
          { _id: findTransaction._id },
          { isRefund: true },
          { new: true }
        );
      }

      await setResponseObject(
        req,
        true,
        "Order cancelled successfully, amount will be refunded",
        cancelOrder
      );
      next();
    } else {
      await setResponseObject(req, false, "Order not cancelled");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*******************************************************************FOR SELLER**********************************************************/

/**
 * UPDATE ORDER STATUS BY SEELER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.updateOrderState = async (req, res, next) => {
  try {
    let dates = new Date();
    let findOrder = await ORDER.findById({ _id: req.params.id });

    let findUser = await USER.findById({ _id: findOrder.createdBy });
    let findCompany = await COMPANY_MODEL.findById({
      _id: findOrder?.company,
    });

    let findPromo = await PROMO_CODE.findOne({ _id: findOrder?.promocode });

    let findSeller = await USER.findOne({
      _id: req.userId,
      roleId: CONST.SALES,
    });
    let filter = {};
    let resp;
    let saveNotification;
    let updateTracking;
    let obj;
    let cashBackData;

    switch (req.query.stateId) {
      case "5":
        filter = {
          deliveryStatus: CONST.PENDING,
        };
        resp = "Order Pending successfully";

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم وضع علامة على طلبك على أنه معلق."
              : "Your order mark as pending.",
            findUser?.language && findUser?.language == "AR"
              ? `طلبك ${findOrder.orderId} تم وضع علامة جاهزة عن طريق الخطأ وتم الآن إعادتها إلى "معلقة.`
              : `Your order ${findOrder.orderId} mistakenly marked as ready and has now been reverted back to Pending.`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your order mark as pending.",
          description: `Your order ${findOrder.orderId} mistakenly marked as ready and has now been reverted back to Pending.`,
          arabicTitle: "تم وضع علامة على طلبك على أنه معلق.",
          arabicDescription: `طلبك ${findOrder.orderId} تم وضع علامة جاهزة عن طريق الخطأ وتم الآن إعادتها إلى "معلقة.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };

        saveNotification = await NOTIFICATION.create(userNotificationBody);

        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.PENDING,
        };

        updateTracking = await ORDER.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { orderTracking: obj } },
          { new: true }
        );

        if (
          findOrder?.deliveryCompanyChecked == "Armada" &&
          findOrder?.deliveryCode
        ) {
          let deliveryBranch = await BRANCH_MODEL.findOne({
            _id: findOrder.branch,
          });

          let deliveryCancel = await cancelDelivery(
            findOrder?.deliveryCode,
            deliveryBranch?.branchKey
          );

          let removeTrackingLink = await ORDER.findByIdAndUpdate(
            { _id: req.params.id },
            { $unset: { trackingLink: "", qrCodeLink: "" } }, // Use $unset to remove the fields
            { new: true }
          );
        }

        break;

      case "8":

        filter = {
          deliveryStatus: CONST.SHIPPED,
        };
        resp = "Order shipped successfully";

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم شحن طلبك بنجاح."
              : "Your Order shipped successfully",
            findUser?.language && findUser?.language == "AR"
              ? `تم شحن طلبك ${findOrder.orderId} بنجاح.`
              : `Your Order Id ${findOrder.orderId} is shipped successfully`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your Order shipped successfully",
          description: `Your Order Id ${findOrder.orderId} is shipped successfully`,
          arabicTitle: "تم شحن طلبك بنجاح.",
          arabicDescription: `تم شحن طلبك ${findOrder.orderId} بنجاح.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };
        saveNotification = await NOTIFICATION.create(userNotificationBody);
        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.SHIPPED,
        };

        updateTracking = await ORDER.findByIdAndUpdate(
          { _id: req.params.id },
          {
            $push: { orderTracking: obj },
          },
          { new: true }
        );

        break;

      case "9":

        filter = {
          deliveryStatus: CONST.COMPLETED,
        };
        resp = "Order completed successfully";

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إتمام طلبك بنجاح."
              : "Your order is completed successfully",
            findUser?.language && findUser?.language == "AR"
              ? `تم إتمام طلبك ${findOrder.orderId} بنجاح.`
              : `Your order Id ${findOrder.orderId} is completed successfully`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your order is completed successfully",
          description: `Your order Id ${findOrder.orderId} is completed successfully`,
          arabicTitle: "تم إتمام طلبك بنجاح.",
          arabicDescription: `تم إتمام طلبك ${findOrder.orderId} بنجاح.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };

        saveNotification = await NOTIFICATION.create(userNotificationBody);

        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.COMPLETED,
        };
        updateTracking = await ORDER.findByIdAndUpdate(
          { _id: req.params.id },
          { $push: { orderTracking: obj } },
          { new: true }
        );
        //Add points
        const pointsEarned = findOrder.total * 0.001;
        let pointsExist = await POINT.findOne({ userId: findOrder.createdBy });
        if (pointsExist) {
          let updatePoint = await POINT.findOneAndUpdate(
            { _id: pointsExist._id },
            { points: pointsExist.points + pointsEarned },
            { new: true }
          );
        } else {
          let payload = {
            userId: findOrder.createdBy,
            points: pointsEarned,
          };
          let createPoint = await POINT.create(payload);
        }

        //Give cashBack with promocode
        if (findOrder.promocode) {
          const findPromotion = await PROMO_CODE.findOne({
            _id: findOrder.promocode,
          });
          //Give cashBack with promocode
          if (findPromotion.actionType == CONST.CASHBACK) {
            const futureDate = new Date();
            findPromotion.cashbackvalidity = futureDate.setDate(
              futureDate.getDate() + parseInt(findPromotion.cashbackvalidity)
            );

            let amountValue;
            let now = new Date();
            let formattedDate = now.toISOString().replace("Z", "+00:00");
            if (findPromotion.cashBackType == CONST.PERCENTAGE) {
              // amountValue =
              //   findOrder.total -
              //   findOrder.total * (findPromotion.discount / 100);
              amountValue = (findPromotion.discount / 100) * findOrder.total;

              if (amountValue > findPromotion.maxDiscountAmount) {
                amountValue = findPromotion.maxDiscountAmount;
              }

              cashBackData = {
                cashBack: amountValue,
                startDate: formattedDate,
                endDate: findPromotion.cashbackvalidity,
                createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                orderId: new mongoose.Types.ObjectId(findOrder._id),
              };

              if (
                findOrder.orderType == CONST.DELIVERY ||
                findOrder.orderType == CONST.PICKUP
              ) {
                const createCashback = await CASHBACK.create(cashBackData);

                const walletExist = await WALLET.findOne({
                  userId: findOrder.createdBy,
                });
                if (walletExist) {
                  let updateWallet = await WALLET.findOneAndUpdate(
                    { _id: walletExist._id },
                    { amount: walletExist.amount + cashBackData.cashBack },
                    { new: true }
                  );
                  const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                    { _id: createCashback._id },
                    { isAdded: true },
                    { new: true }
                  );
                } else {
                  let payload = {
                    userId: findOrder.createdBy,
                    amount: cashBackData.cashBack,
                  };
                  let createWallet = await WALLET.create(payload);
                  const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                    { _id: createCashback._id },
                    { isAdded: true },
                    { new: true }
                  );
                }
              }
            } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
              if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
                amountValue = findPromotion.discount;
                cashBackData = {
                  cashBack: amountValue,
                  startDate: formattedDate,
                  endDate: findPromotion.cashbackvalidity,
                  createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                  orderId: new mongoose.Types.ObjectId(findOrder._id),
                };

                if (
                  findOrder.orderType == CONST.DELIVERY ||
                  findOrder.orderType == CONST.PICKUP
                ) {
                  let createCashback = await CASHBACK.create(cashBackData);
                  const walletExist = await WALLET.findOne({
                    userId: findOrder.createdBy,
                  });
                  if (walletExist) {
                    let updateWallet = await WALLET.findOneAndUpdate(
                      { _id: walletExist._id },
                      { amount: walletExist.amount + cashBackData.cashBack },
                      { new: true }
                    );
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  } else {
                    let payload = {
                      userId: findOrder.createdBy,
                      amount: cashBackData.cashBack,
                    };
                    let createWallet = await WALLET.create(payload);
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  }
                }
              } else if (findPromotion.rotationCashBack == CONST.SEVERAL_TIME) {
                let value = parseInt(
                  findOrder.total / findPromotion.minPurchaseAmount
                );
                amountValue = parseInt(value * findPromotion.discount);
                cashBackData = {
                  cashBack: amountValue,
                  startDate: formattedDate,
                  endDate: findPromotion.cashbackvalidity,
                  createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                  orderId: new mongoose.Types.ObjectId(findOrder._id),
                };

                if (
                  findOrder.orderType == CONST.DELIVERY ||
                  findOrder.orderType == CONST.PICKUP
                ) {
                  let createCashback = await CASHBACK.create(cashBackData);
                  const walletExist = await WALLET.findOne({
                    userId: findOrder.createdBy,
                  });
                  if (walletExist) {
                    let updateWallet = await WALLET.findOneAndUpdate(
                      { _id: walletExist._id },
                      { amount: walletExist.amount + createCashback.cashBack },
                      { new: true }
                    );
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  } else {
                    let payload = {
                      userId: findOrder.createdBy,
                      amount: createCashback.cashBack,
                    };
                    let createWallet = await WALLET.create(payload);
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  }
                }
              }
            }
          }
          //If promocode has action type promotion
          if (findPromotion.actionType == CONST.PROMOTION) {
            let cashBack = (findPromotion.discount / 100) * findOrder.subTotal;

            if (cashBack > findPromotion.maxDiscountAmount) {
              cashBack = findPromotion.maxDiscountAmount;
            }

            cashBackData = {
              cashBack: cashBack,
            };
          }
        }

        //Give cashBack with spinner
        if (findOrder.rewardId) {
          const findPromotion = await USER_SPINNER_MODEL.findOne({
            _id: findOrder.rewardId,
          });

          let cashBackData;
          let amountValue;
          let now = new Date();
          let formattedDate = now.toISOString().replace("Z", "+00:00");
          if (findPromotion.spinType == CONST.PERCENTAGE) {
          
            amountValue = (findPromotion.value / 100) * findOrder.subTotal;
            if (amountValue > findPromotion.maxCashBack) {
              amountValue = findPromotion.maxCashBack;
            }
            cashBackData = {
              cashBack: amountValue,
              startDate: formattedDate,
              endDate: findPromotion.endDate,
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              orderId: new mongoose.Types.ObjectId(findOrder._id),
            };
            let createCashback = await CASHBACK.create(cashBackData);

            const walletExist = await WALLET.findOne({
              userId: findOrder.createdBy,
            });
            if (walletExist) {
              let updateWallet = await WALLET.findOneAndUpdate(
                { _id: walletExist._id },
                { amount: walletExist.amount + amountValue },
                { new: true }
              );
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            } else {
              let payload = {
                userId: findOrder.createdBy,
                amount: amountValue,
              };
              let createWallet = await WALLET.create(payload);
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            }
          } else if (findPromotion.spinType == CONST.FIX_AMOUNT) {
            cashBackData = {
              cashBack: findPromotion.value,
              startDate: formattedDate,
              endDate: findPromotion.endDate,
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              orderId: new mongoose.Types.ObjectId(findOrder._id),
            };
            let createCashback = await CASHBACK.create(cashBackData);
            const walletExist = await WALLET.findOne({
              userId: findOrder.createdBy,
            });
            if (walletExist) {
              let updateWallet = await WALLET.findOneAndUpdate(
                { _id: walletExist._id },
                { amount: walletExist.amount + findPromotion.value },
                { new: true }
              );
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            } else {
              let payload = {
                userId: findOrder.createdBy,
                amount: findPromotion.value,
              };
              let createWallet = await WALLET.create(payload);
              const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                { _id: createCashback._id },
                { isAdded: true },
                { new: true }
              );
            }
          }
        }

        //Create account statement

        cartTotal = 0;
        sum = [];
        let pickCost = 0;
        findOrder.products.map((e) => {
          sum.push(e.product_price);
          cartTotal = cartTotal + e.product_price;
          pickCost = pickCost + e.product_cost;
        });

        charge = findOrder.products[0].deliveryCharge;

        let totalPrice = cartTotal + charge;

        if (findCompany.commissionType == CONST.PERCENTAGE) {
          let isExist = await STATEMENT_TRANSACTION.find({
            company: findOrder.company,
            accountType: CONST.PERCENTAGE,
          })
            .sort({ createdAt: -1 })
            .limit(2);
          if (isExist.length > 0) {
            // Create invoice statement transaction
            let invoiceBalance = isExist[0].balance + cartTotal;
            let invoiceTranaction = {
              type: "Invoice",
              number: findOrder.orderId,
              amountCr: formatNumber(cartTotal),
              balance: formatNumber(invoiceBalance),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.PERCENTAGE,
            };
            await STATEMENT_TRANSACTION.create(invoiceTranaction);

            let commission = cartTotal * (findCompany.perCommission / 100);
            let commisonBalance = invoiceTranaction.balance - commission;
            // Create commission statement transaction
            let commissionTranaction = {
              type: "Commission",
              number: findOrder.orderId,
              amountDr: formatNumber(commission),
              balance: formatNumber(commisonBalance),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.PERCENTAGE,
            };
            await STATEMENT_TRANSACTION.create(commissionTranaction);

            if (findOrder.promocode || findOrder.rewardId) {
              if (
                findOrder.promocode &&
                findPromo?.supplierShare == CONST.SHARE
              ) {
                let cashBackBoth = cashBackData?.cashBack / 2;

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
                let walletBalanceSup =
                  walletTranactionOff.balance - cashBackBoth;
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Off",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Sup",
                  number: findOrder.orderId,
                  amountCr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Spinner reward",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
              number: findOrder.orderId,
              amountCr: formatNumber(cartTotal),
              balance: formatNumber(cartTotal),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.PERCENTAGE,
            };

            await STATEMENT_TRANSACTION.create(invoiceTranaction);
            let commission = cartTotal * (findCompany.perCommission / 100);
            let commisonBalance = invoiceTranaction.balance - commission;
            // Create commission statement transaction
            let commissionTranaction = {
              type: "Commission",
              number: findOrder.orderId,
              amountDr: formatNumber(commission),
              balance: formatNumber(commisonBalance),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.PERCENTAGE,
            };
            await STATEMENT_TRANSACTION.create(commissionTranaction);

            if (findOrder.promocode || findOrder.rewardId) {
              if (
                findOrder.promocode &&
                findPromo?.supplierShare == CONST.SHARE
              ) {
                let cashBackBoth = cashBackData?.cashBack / 2;

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
                let walletBalanceSup =
                  walletTranactionOff.balance - cashBackBoth;
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Off",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Sup",
                  number: findOrder.orderId,
                  amountCr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Spinner reward",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
            company: findOrder.company,
            accountType: CONST.FIX_AMOUNT,
          })
            .sort({ createdAt: -1 })
            .limit(2);

          if (isExist.length > 0) {
            // Create invoice statement transaction
            let invoiceBalance = isExist[0].balance + cartTotal;
            let invoiceTranaction = {
              type: "Invoice",
              number: findOrder.orderId,
              amountCr: formatNumber(cartTotal),
              balance: formatNumber(invoiceBalance),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.FIX_AMOUNT,
            };
            await STATEMENT_TRANSACTION.create(invoiceTranaction);
            // Create commission statement transaction
            let sellingPrice = 0;
            let deliveryCost = 0;
            let pickCost = 0;
            let commission = 0;
            let commissionBalance = 0;

            for (let e of findOrder.products) {
              let findProduct = await PRODUCT_MODEL.findOne({ _id: e.items });

              sellingPrice += e.product_price || 0;
              pickCost += e.product_cost || 0;
              deliveryCost += findProduct.deliveryCost * e.quantity || 0;
            }

            if (
              findOrder.orderType == CONST.PICKUP ||
              findOrder.orderType == CONST.COUPON
            ) {
              commission = sellingPrice - pickCost;
              commissionBalance = invoiceTranaction.balance - commission;
            } else if (findOrder.orderType == CONST.DELIVERY) {
              commission = sellingPrice - deliveryCost;
              commissionBalance = invoiceTranaction.balance - commission;
            }

            let commissionTranaction = {
              type: "Commission",
              number: findOrder.orderId,
              amountDr: formatNumber(commission),
              balance: formatNumber(commissionBalance),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.FIX_AMOUNT,
            };
            await STATEMENT_TRANSACTION.create(commissionTranaction);

            if (findOrder.promocode || findOrder.rewardId) {
              if (
                findOrder.promocode &&
                findPromo?.supplierShare == CONST.SHARE
              ) {
                let cashBackBoth = cashBackData?.cashBack / 2;

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
                let walletBalanceSup =
                  walletTranactionOff.balance - cashBackBoth;
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Off",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Sup",
                  number: findOrder.orderId,
                  amountCr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Spinner reward",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
              number: findOrder.orderId,
              amountCr: formatNumber(cartTotal),
              balance: formatNumber(cartTotal),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.FIX_AMOUNT,
            };

            await STATEMENT_TRANSACTION.create(invoiceTranaction);
            // Create commission statement transaction
            let sellingPrice = 0;
            let deliveryCost = 0;
            let pickCost = 0;
            let commission = 0;
            let commissionBalance = 0;

            for (let e of findOrder.products) {
              let findProduct = await PRODUCT_MODEL.findOne({ _id: e.items });

              sellingPrice += e.product_price || 0;
              pickCost += e.product_cost || 0;
              deliveryCost += findProduct.deliveryCost * e.quantity || 0;
            }

            if (
              findOrder.orderType == CONST.PICKUP ||
              findOrder.orderType == CONST.COUPON
            ) {
              commission = sellingPrice - pickCost;
              commissionBalance = invoiceTranaction.balance - commission;
            } else if (findOrder.orderType == CONST.DELIVERY) {
              commission = sellingPrice - deliveryCost;
              commissionBalance = invoiceTranaction.balance - commission;
            }

            let commissionTranaction = {
              type: "Commission",
              number: findOrder.orderId,
              amountDr: formatNumber(commission),
              balance: formatNumber(commissionBalance),
              company: new mongoose.Types.ObjectId(findOrder.company),
              createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
              date: dates.toISOString(),
              accountType: CONST.FIX_AMOUNT,
            };

            await STATEMENT_TRANSACTION.create(commissionTranaction);

            if (findOrder.promocode || findOrder.rewardId) {
              if (
                findOrder.promocode &&
                findPromo?.supplierShare == CONST.SHARE
              ) {
                let cashBackBoth = cashBackData?.cashBack / 2;

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
                let walletBalanceSup =
                  walletTranactionOff.balance - cashBackBoth;
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Off",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Wallet-Sup",
                  number: findOrder.orderId,
                  amountCr: formatNumber(cashBackData?.cashBack),
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
                  commissionTranaction.balance - cashBackData?.cashBack;
                let walletTranaction = {
                  type: "Spinner reward",
                  number: findOrder.orderId,
                  amountDr: formatNumber(cashBackData?.cashBack),
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

        break;

      case "10":
        filter = {
          deliveryStatus: CONST.CANCELED,
        };
        resp = "Order cancelled successfully";

        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "تم إلغاء طلبك بواسطة البائع."
              : "Your order cancelled by seller",
            findUser?.language && findUser?.language == "AR"
              ? `تم إلغاء طلبك ${findOrder.orderId} بواسطة البائع.`
              : `Your order Id ${findOrder.orderId} is cancelled by seller`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your order cancelled by seller",
          description: `Your order Id ${findOrder.orderId} is cancelled by seller`,
          arabicTitle: "تم إلغاء طلبك بواسطة البائع.",
          arabicDescription: `تم إلغاء طلبك ${findOrder.orderId} بواسطة البائع.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };

        saveNotification = await NOTIFICATION.create(userNotificationBody);

        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.CANCELED,
        };

        if (findSeller) {
          updateTracking = await ORDER.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { orderTracking: obj }, branch: findSeller?.branch },
            { new: true }
          );
        } else {
          updateTracking = await ORDER.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { orderTracking: obj } },
            { new: true }
          );
        }

        // Add refund
        let walletExist = await WALLET.findOne({ userId: findOrder.createdBy });
        if (walletExist) {
          let updateWallet = await WALLET.findOneAndUpdate(
            { _id: walletExist._id },
            { amount: walletExist.amount + findOrder.total },
            { new: true }
          );
          //SEND NOTIFICATION TO USER
          if (findUser.deviceToken) {
            await sendNotification(
              findUser?.deviceToken,
              findUser?.language && findUser?.language == "AR"
                ? "تم إنشاء استرداد المبلغ في محفظتك."
                : "Your refund created in your wallet",
              findUser?.language && findUser?.language == "AR"
                ? `تم إنشاء استرداد مبلغ ${formatNumber(
                    findOrder.total
                  )} لطلب ${findOrder.orderId} في محفظتك.`
                : `Your refund ${formatNumber(
                    findOrder.total
                  )} KD created for order Id ${
                    findOrder.orderId
                  } in your wallet`,
              `${JSON.stringify(findOrder)}`,
              CONST.ORDER
            );
          }
          var userNotificationBody = {
            to: findUser._id,
            title: "Your refund created in your wallet",
            description: `Your refund ${findOrder.total} KD created for order Id ${findOrder.orderId} in your wallet`,
            arabicTitle: "تم إنشاء استرداد المبلغ في محفظتك.",
            arabicDescription: `تم إنشاء استرداد مبلغ ${findOrder.total} لطلب ${findOrder.orderId} في محفظتك.`,
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
        } else {
          let payload = {
            userId: findOrder.createdBy,
            amount: findOrder.total,
          };
          let createWallet = await WALLET.create(payload);

          //SEND NOTIFICATION TO USER
          if (findUser.deviceToken) {
            await sendNotification(
              findUser?.deviceToken,
              findUser?.language && findUser?.language == "AR"
                ? "تم إنشاء استرداد المبلغ في محفظتك."
                : "Your refund created in your wallet",
              findUser?.language && findUser?.language == "AR"
                ? `تم إنشاء استرداد مبلغ ${formatNumber(
                    findOrder.total
                  )} لطلب ${findOrder.orderId} في محفظتك.`
                : `Your refund ${formatNumber(
                    findOrder.total
                  )} KD created for order Id ${
                    findOrder.orderId
                  } in your wallet`,
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
        }

        if (findOrder?.deliveryCode) {
          let deliveryBranch = await BRANCH_MODEL.findOne({
            _id: findOrder.branch,
          });
          let deliveryCancel = await cancelDelivery(
            findOrder?.deliveryCode,
            deliveryBranch?.branchKey
          );

          let removeTrackingLink = await ORDER.findByIdAndUpdate(
            { _id: req.params.id },
            { $unset: { trackingLink: "", qrCodeLink: "" } }, // Use $unset to remove the fields
            { new: true }
          );
        }

        let updateOrder = await ORDER.findOneAndUpdate(
          { _id: findOrder?._id }, // Find the order by its ID
          { $set: { "products.$[].isRefund": true } }, // Update all products' isRefund field to true
          { new: true }
        );

        break;

      case "11":
        filter = {
          deliveryStatus: CONST.READY,
        };
        resp = "Your order is ready for shipment";
        let findBranch = {};
        //SEND NOTIFICATION TO USER
        if (findUser.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "طلبك جاهز للشحن."
              : "Your order is ready for shipment",
            findUser?.language && findUser?.language == "AR"
              ? `طلبك ${findOrder.orderId} جاهز للشحن.`
              : `Your order Id ${findOrder.orderId} is ready for shipment`,
            `${JSON.stringify(findOrder)}`,
            CONST.ORDER
          );
        }
        var userNotificationBody = {
          to: findUser._id,
          title: "Your order is ready for shipment",
          description: `Your order Id ${findOrder.orderId} is ready for shipment`,
          arabicTitle: "طلبك جاهز للشحن.",
          arabicDescription: `طلبك ${findOrder.orderId} جاهز للشحن.`,
          notificationType: CONST.ORDER,
          orderId: findOrder._id,
        };

        saveNotification = await NOTIFICATION.create(userNotificationBody);

        //Update order traking
        obj = {
          date: dates.toISOString(),
          stateId: CONST.READY,
        };
        // Find the order by ID
        const order = await ORDER.findById(req.params.id);

        if (req.roleId == CONST.ADMIN) {
          if (findOrder.orderType == CONST.DELIVERY) {
            let findAddres = await ADDRESS.findOne({ _id: findOrder.address });

            let longitude = findAddres?.location?.coordinates[0];
            let latitude = findAddres?.location?.coordinates[1];
            let nearestBranchWithDistance = await BRANCH_MODEL.aggregate([
              {
                $geoNear: {
                  near: { type: "Point", coordinates: [longitude, latitude] }, // User's location
                  distanceField: "distance", // Field to store the distance
                  spherical: true, // Ensures calculation is done on a spherical surface
                  maxDistance: 100000, // Optional: Max distance in meters (1000 km for example)
                  query: {}, // Optional filter query if you want to filter branches
                },
              },
              {
                $match: {
                  companyId: new mongoose.Types.ObjectId(findOrder.company),
                  stateId: CONST.ACTIVE,
                },
              },
              {
                $limit: 1, // Limit to the nearest branch
              },
            ]);
            if (nearestBranchWithDistance.length > 0) {
              let nearestBranch = nearestBranchWithDistance[0];
              // if (!hasReadyState) {
              updateTracking = await ORDER.findByIdAndUpdate(
                { _id: req.params.id },
                { branch: nearestBranch._id },
                { new: true }
              );
              findBranch = await BRANCH_MODEL.findOne({
                _id: nearestBranch._id,
              });
              // }
            } else {
              await setResponseObject(
                req,
                false,
                "No nearest branch found for this order"
              );
              next();
              return;
            }
          } else if (findOrder.orderType == CONST.PICKUP) {
            // if (!hasReadyState) {
            updateTracking = await ORDER.findByIdAndUpdate(
              { _id: req.params.id },
              { branch: findOrder?.branch },
              { new: true }
            );
            // }
          }
        } else {
          if (findOrder.orderType == CONST.DELIVERY) {
            // if (!hasReadyState) {
            updateTracking = await ORDER.findByIdAndUpdate(
              { _id: req.params.id },
              { branch: findSeller?.branch },
              { new: true }
            );
            // }
            findBranch = await BRANCH_MODEL.findOne({
              _id: findSeller.branch,
            });
          } else if (findOrder.orderType == CONST.PICKUP) {
            // if (!hasReadyState) {
            updateTracking = await ORDER.findByIdAndUpdate(
              { _id: req.params.id },
              { branch: findOrder?.branch },
              { new: true }
            );
            // }
          }
        }

        // Create delivery basis of self delivery
        if (
          findCompany.deliveryEligible == false &&
          findCompany.deliveryService == true
        ) {
          // if order type is delivery
          if (findOrder.orderType == CONST.DELIVERY) {
            // if delivery service has armada delivery company
            if (findCompany.deliveryCompanyChecked == "Armada") {
              let findAddres = await ADDRESS.findOne({
                _id: findOrder?.address,
              });
              let longitude = findAddres?.location?.coordinates[0];
              let latitude = findAddres?.location?.coordinates[1];

              let dataObj = {
                platformName: "Offarat",
                orderId: findOrder?.orderId,
                name: findUser?.fullName,
                phone: findAddres?.countryCode + findAddres?.mobile,
                latitude: latitude,
                longitude: longitude,
                amount: formatNumber(findOrder?.total),
                type: "paid",
              };

              try {
                let deliveryCompany = await createDelivery(
                  dataObj,
                  findBranch?.branchKey
                );

                if (deliveryCompany?.message) {
                  await setResponseObject(req, false, deliveryCompany?.message);
                  next();
                  return;
                }

                const qrCodeBase64 = await generateArmandaQRCode(
                  deliveryCompany?.trackingLink
                );

                let link = process.env.IMAGE_BASE_URL + qrCodeBase64;
                let qrLink = link.replace(/\/\.\.\//g, "/");

                updateTracking = await ORDER.findByIdAndUpdate(
                  { _id: req.params.id },
                  {
                    $push: { orderTracking: obj },
                    trackingLink: deliveryCompany?.trackingLink,
                    deliveryCode: deliveryCompany?.code,
                    qrCodeLink: qrLink,
                  },
                  { new: true }
                );
              } catch (err) {
                await setResponseObject(
                  req,
                  false,
                  "Unable to fetch, please try once again.",
                  ""
                );
                next();
                return;
              }
            } else if (
              // if delivery service has delivery company
              findCompany.deliveryCompanyChecked == "Delivery Company"
            ) {
              await ORDER.findByIdAndUpdate(
                { _id: req.params.id },
                {
                  $push: { orderTracking: obj },
                  deliveryCompany: findCompany?.deliveryCompany,
                },
                { new: true }
              );
            }
          }
        }

        if (
          findOrder.orderType == CONST.PICKUP ||
          findOrder.orderType == CONST.COUPON
        ) {
          updateTracking = await ORDER.findByIdAndUpdate(
            { _id: req.params.id },
            {
              $push: { orderTracking: obj },
            },
            { new: true }
          );
        }

        break;

      default:
        break;
    }

    const orderState = await ORDER.findByIdAndUpdate(
      { _id: req.params.id },
      filter,
      { new: true }
    );
    if (orderState) {
      if (req.query.deliveryStatus == CONST.COMPLETED) {
        const findOrder = await ORDER.findById({ _id: req.params.id });

        for (let index = 0; index < findOrder.products.length; index++) {
          const element = findOrder.products[index].items;
          const puchaseCount = await PRODUCT_MODEL.findByIdAndUpdate(
            {
              _id: findOrder.products[index].items,
            },
            {
              $inc: {
                purchaseCount: 1,
              },
            },
            { new: true }
          );
        }
      }

      await setResponseObject(req, true, resp, orderState);
      next();
    } else {
      await setResponseObject(req, false, "Order state Id not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VENDER ORDER MANAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.sellerOrderlist = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let stateFilter = {};

    switch (req.query.deliveryStatus) {
      case "5":
        stateFilter = {
          deliveryStatus: CONST.PENDING,
        };
        break;
      case "8":
        stateFilter = {
          deliveryStatus: CONST.SHIPPED,
        };
        break;
      case "9":
        stateFilter = {
          deliveryStatus: CONST.COMPLETED,
        };
        break;

      case "10":
        stateFilter = {
          deliveryStatus: CONST.CANCELED,
        };
        break;

      case "11":
        stateFilter = {
          deliveryStatus: CONST.READY,
        };
        break;

      default:
        break;
    }

    let typeFilter = {};

    switch (req.query.type) {
      case "1":
        typeFilter = {
          orderType: CONST.DELIVERY,
        };
        break;
      case "2":
        typeFilter = {
          orderType: CONST.PICKUP,
        };
        break;

      default:
        break;
    }

    let filter = [];

    if (req.query.startDate && req.query.endDate) {
      const startDateString = new Date(req.query.startDate);

      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          createdAt: {
            $gte: startDateString,
            $lte: endDateString,
          },
        },
      });
    } else if (req.query.startDate) {
      const startDateString = new Date(req.query.startDate);

      filter.push({
        $match: {
          createdAt: {
            $gte: startDateString,
          },
        },
      });
    } else if (req.query.endDate) {
      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          createdAt: {
            $lte: endDateString,
          },
        },
      });
    }

    if (req.query.orderId) {
      filter.push({
        $match: {
          orderId: parseInt(req.query.orderId),
        },
      });
    }

    const seller = await USER.findById({
      _id: req.userId,
      stateId: { $ne: CONST.DELETED },
    });

    const findProduct = await PRODUCT_MODEL.find({ company: seller.company });

    const productArr = [];
    findProduct.map((e) => {
      productArr.push(e._id);
    });

    const findOrders = await ORDER.aggregate([
      {
        $match: {
          visibleToSeller: { $eq: true },
        },
      },
      {
        $match: {
          $or: [
            {
              orderType: { $ne: CONST.PICKUP },
              company: new mongoose.Types.ObjectId(seller.company),
            },
            {
              orderType: CONST.PICKUP,
              company: new mongoose.Types.ObjectId(seller.company),
              branch: new mongoose.Types.ObjectId(seller.branch),
            },
          ],
        },
      },
      {
        $match: stateFilter,
      },
      {
        $match: typeFilter,
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
                country: 1,
                countryCode: 1,
                mobile: 1,
              },
            },
            {
              $lookup: {
                from: "addresses",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$createdBy"] },
                    },
                  },
                ],
                as: "addressesDetails",
              },
            },
            {
              $unwind: {
                path: "$addressesDetails",
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
        $lookup: {
          from: "products",
          let: { id: "$products.items" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] },
              },
            },
            {
              $project: {
                _id: 1,
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
                      arabicCompany: 1,
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
          from: "coupons",
          let: { id: "$couponCode" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "couponDetails",
        },
      },
      {
        $unwind: {
          path: "$couponDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      ...filter,
      {
        $group: {
          _id: "$_id",
          products: { $first: "$products" },
          orderId: { $first: "$orderId" },
          deliveryCharge: { $first: "$deliveryCharge" },
          subTotal: { $first: "$subTotal" },
          total: { $first: "$total" },
          address: { $first: "$address" },
          createdBy: { $first: "$createdBy" },
          deliveryStatus: { $first: "$deliveryStatus" },
          paymentType: { $first: "$paymentType" },
          orderType: { $first: "$orderType" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          userDetails: { $first: "$userDetails" },
          companyDetails: { $first: "$companyDetails" },
          promoDetails: { $first: "$promoDetails" },
          couponDetails: { $first: "$couponDetails" },
          trackingLink: { $first: "$trackingLink" },
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
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (findOrders && findOrders[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        findOrders[0].data,
        findOrders[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * VENDER GRAPH DATA
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.sellerGraphData = async (req, res, next) => {
  try {
    let today = new Date();

    let filter = {};

    switch (req.query.dateFilter) {
      case "1": //  1 => Today
        const datePart = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        filter = {
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              datePart,
            ],
          },
        };
        break;

      case "2": //  2 => week
        const currentWeekStart = new Date(
          Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 0)
          )
        );

        const currentWeekEnd = new Date(
          Date.UTC(
            currentWeekStart.getFullYear(),
            currentWeekStart.getMonth(),
            currentWeekStart.getDate() + 6
          )
        );

        const weekStart = `${currentWeekStart.getFullYear()}-${String(
          currentWeekStart.getMonth() + 1
        ).padStart(2, "0")}-${String(currentWeekStart.getDate()).padStart(
          2,
          "0"
        )}`;
        const weekEnd = `${currentWeekEnd.getFullYear()}-${String(
          currentWeekEnd.getMonth() + 1
        ).padStart(2, "0")}-${String(currentWeekEnd.getDate()).padStart(
          2,
          "0"
        )}`;

        filter = {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                      timezone: "UTC",
                    },
                  },
                  weekStart,
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                      timezone: "UTC",
                    },
                  },
                  weekEnd,
                ],
              },
            ],
          },
        };
        break;

      case "3": //  3 => Month
        const currentMonthStart = new Date(
          Date.UTC(today.getFullYear(), today.getMonth(), 1)
        );

        const currentMonthEnd = new Date(
          Date.UTC(today.getFullYear(), today.getMonth() + 1, 0)
        );

        const monthStart = `${currentMonthStart.getFullYear()}-${String(
          currentMonthStart.getMonth() + 1
        ).padStart(2, "0")}-${String(currentMonthStart.getDate()).padStart(
          2,
          "0"
        )}`;
        const monthEnd = `${currentMonthEnd.getFullYear()}-${String(
          currentMonthEnd.getMonth() + 1
        ).padStart(2, "0")}-${String(currentMonthEnd.getDate()).padStart(
          2,
          "0"
        )}`;

        filter = {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                      timezone: "UTC",
                    },
                  },
                  monthStart,
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                      timezone: "UTC",
                    },
                  },
                  monthEnd,
                ],
              },
            ],
          },
        };
        break;

      case "4": //  4 => Year
        const currentYearStart = new Date(Date.UTC(today.getFullYear(), 0, 1));

        const currentYearEnd = new Date(Date.UTC(today.getFullYear(), 11, 31));

        const yearStart = `${currentYearStart.getFullYear()}-${String(
          currentYearStart.getMonth() + 1
        ).padStart(2, "0")}-${String(currentYearStart.getDate()).padStart(
          2,
          "0"
        )}`;
        const yearEnd = `${currentYearEnd.getFullYear()}-${String(
          currentYearEnd.getMonth() + 1
        ).padStart(2, "0")}-${String(currentYearEnd.getDate()).padStart(
          2,
          "0"
        )}`;

        filter = {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                      timezone: "UTC",
                    },
                  },
                  yearStart,
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: "$createdAt",
                      timezone: "UTC",
                    },
                  },
                  yearEnd,
                ],
              },
            ],
          },
        };
        break;

      default:
    }

    const seller = await USER.findById({ _id: req.userId });

    const findProduct = await PRODUCT_MODEL.find({ company: seller.company });

    const productArr = [];
    findProduct.map((e) => {
      productArr.push(e._id);
    });

    const list = await ORDER.aggregate([
      {
        $match: filter,
      },
      {
        $match: {
          "products.items": { $in: productArr },
        },
      },
      {
        $group: {
          _id: "$deliveryStatus",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          pending: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id", CONST.PENDING] },
                then: "$count",
                else: 0,
              },
            },
          },
          ready: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id", CONST.READY] },
                then: "$count",
                else: 0,
              },
            },
          },
          shipped: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id", CONST.SHIPPED] },
                then: "$count",
                else: 0,
              },
            },
          },
          completed: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id", CONST.COMPLETED] },
                then: "$count",
                else: 0,
              },
            },
          },
          canceled: {
            $sum: {
              $cond: {
                if: { $eq: ["$_id", CONST.CANCELED] },
                then: "$count",
                else: 0,
              },
            },
          },
          total: { $sum: "$count" },
        },
      },
    ]);

    if (list) {
      await setResponseObject(req, true, "", list);
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
 * ADMIN ORDER MANAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.adminOrderList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let stateFilter = { deliveryStatus: { $ne: CONST.ORDERDELETED } };

    switch (req.query.deliveryStatus) {
      case "5":
        stateFilter = {
          deliveryStatus: CONST.PENDING,
        };
        break;
      case "8":
        stateFilter = {
          deliveryStatus: CONST.SHIPPED,
        };
        break;
      case "9":
        stateFilter = {
          deliveryStatus: CONST.COMPLETED,
        };
        break;

      case "10":
        stateFilter = {
          deliveryStatus: CONST.CANCELED,
        };
        break;

      case "11":
        stateFilter = {
          deliveryStatus: CONST.READY,
        };
        break;

      default:
        break;
    }

    let filter = [];
    let startDateString;
    let endDateString;

    if (req.query.startDate) {
      const startDate = moment(req?.query?.startDate);
      if (!startDate.isValid()) {
        console.log("Invalid start date");
      } else {
        startDateString = startDate.format("YYYY-MM-DD"); // Use YYYY-MM-DD for comparison
      }
    }

    if (req?.query?.endDate) {
      const endDate = moment(req?.query?.endDate);
      if (!endDate.isValid()) {
        console.log("Invalid end date");
      } else {
        endDateString = endDate.format("YYYY-MM-DD"); // Use YYYY-MM-DD for comparison
      }
    }

    if (startDateString && endDateString) {
      filter.push({
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  startDateString,
                ],
              },
              {
                $lte: [
                  {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  endDateString,
                ],
              },
            ],
          },
        },
      });
    } else if (startDateString) {
      filter.push({
        $match: {
          $expr: {
            $gte: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              startDateString,
            ],
          },
        },
      });
    } else if (endDateString) {
      filter.push({
        $match: {
          $expr: {
            $lte: [
              {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              endDateString,
            ],
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

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchValue = req.query.search.replace(
        new RegExp("\\\\", "g"),
        "\\\\"
      );

      // Escape special characters in searchValue for regex
      const escapedSearchValue = searchValue.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

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
          orderId: {
            $regex: new RegExp(escapedSearchValue, "i"),
          },
        },
        {
          orderId: {
            $eq: searchNumber,
          },
        },
        {
          mobileNumber: {
            $regex: new RegExp(escapedSearchValue, "i"),
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

      if (companies.length > 0) {
        let companyIds = companies.map((company) => company._id);

        categoryFilter = {
          company: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    const findOrders = await ORDER.aggregate([
      {
        $match: categoryFilter,
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
                firstName: 1,
                lastName: 1,
                fullName: 1,
                country: 1,
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
        $addFields: {
          mobileNumber: {
            $concat: [
              { $toString: "$userDetails.countryCode" }, // Add a space or any separator if needed
              { $toString: "$userDetails.mobile" }, // Ensure it's a string
            ],
          },
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
                arabicCompany: 1,
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
        $match: searchFilter,
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
      ...filter,

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
    if (findOrders && findOrders[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        findOrders[0].data,
        findOrders[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * ADMIN INVOICE LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.adminInvoiceList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

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

    const list = await ORDER.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { productIds: "$products.items" }, // Reference the items array within products
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$productIds"] }, // Match products by their IDs
              },
            },
            {
              $limit: 1, // Limit to the first matching product
            },
          ],
          as: "productDetails",
        },
      },
      {
        $addFields: {
          product: { $arrayElemAt: ["$productDetails", 0] }, // Get the first product
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { companyId: "$product.company" }, // Use the company ID from the product
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$companyId", "$_id"] }, // Match with company ID
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true }, // Unwind company details
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
        $project: {
          _id: true,
          orderId: true,
          company: "$companyDetails.company",
          country: "$companyDetails.country",
          createdAt: true,
          updatedAt: true,
          subTotal: true,
          total: true,
          deliveryStatus: true,
          contactUser: "$user.email",
          promoDiscount: "$promoDetails.discount",
          // permission: true,
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
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * USER INVOICE LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.userInvoiceList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    const list = await ORDER.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
          deliveryStatus: CONST.COMPLETED,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { productIds: "$products.items" }, // Reference the items array within products
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$productIds"] }, // Match products by their IDs
              },
            },
            {
              $limit: 1, // Limit to the first matching product
            },
          ],
          as: "productDetails",
        },
      },
      {
        $addFields: {
          product: { $arrayElemAt: ["$productDetails", 0] }, // Get the first product
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { companyId: "$product.company" }, // Use the company ID from the product
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$companyId", "$_id"] }, // Match with company ID
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true }, // Unwind company details
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
        $project: {
          _id: true,
          orderId: true,
          company: "$companyDetails.company",
          createdAt: true,
          updatedAt: true,
          subTotal: true,
          total: true,
          deliveryStatus: true,
          contactUser: "$user.email",
          promoDiscount: "$promoDetails.discount",
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
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Order list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Order list not found", []);
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
order.downloadOrderReport = async (req, res, next) => {
  try {
    const findOrder = await ORDER.findOne({ _id: req.params.id }).lean();
    const findUser = await USER.findOne({ _id: findOrder.createdBy }).select(
      "_id fullName"
    );
    const findSeller = await USER.findOne({ _id: findOrder?.sellerId }).select(
      "_id fullName"
    );
    const findProduct = await PRODUCT_MODEL.findOne({
      _id: findOrder.products[0].items,
    });

    const findCompany = await COMPANY_MODEL.findOne({
      _id: findProduct?.company,
    });

    findOrder.userName = findUser.fullName;
    findOrder.companyName = findCompany?.company;

    async function generateExcel(order) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Order Details");

      // Prepare the data for the Excel file
      const data = [
        [
          "Invoice Number",
          "Order Date",
          "Ready Date",
          "Plan delivery date",
          "Order Type (Coupon, Delivery, Pickup)",
          "Ready User name",
          "Delivery cost ",
          "Company",
          "Ship company",
          "Customer",
          "Company Contact Person",
          "Ship Date",
          "Telephone",
          "Total",
        ],
        [
          findOrder.orderId,
          moment(findOrder.createdAt).format("DD-MMM-YYYY").toUpperCase(),
          moment(findOrder?.orderTracking[1]?.date)
            .format("DD-MMM-YYYY")
            .toUpperCase()
            ? moment(findOrder?.orderTracking[1]?.date)
                .format("DD-MMM-YYYY")
                .toUpperCase()
            : "-",
          moment(findOrder.orderTracking[2]?.date)
            .format("DD-MMM-YYYY")
            .toUpperCase()
            ? moment(findOrder.orderTracking[2]?.date)
                .format("DD-MMM-YYYY")
                .toUpperCase()
            : "-",
          findOrder.orderType == "2"
            ? "Pickup"
            : findOrder.orderType == "3"
            ? "Coupon"
            : "Delivery",
          findSeller?.fullName ? findSeller?.fullName : "Seller",
          findOrder.deliveryCharge ? findOrder.deliveryCharge : 0,
          findOrder.companyName,
          findCompany.company,
          findUser.fullName,
          `${findCompany.countryCode + findCompany.mobile}`,
          moment(findOrder?.orderTracking[2]?.date)
            .format("DD-MMM-YYYY")
            .toUpperCase()
            ? moment(findOrder?.orderTracking[2]?.date)
                .format("DD-MMM-YYYY")
                .toUpperCase()
            : "-",
          `${findCompany.countryCode + findCompany.mobile}`,
          findOrder.total,
        ],
      ];

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
      const excelPath = `../uploads/invoice/order-${order._id}-${generateOTP(
        6
      )}.xlsx`;

      // Write the workbook to a file
      await workbook.xlsx.writeFile(excelPath);

      return excelPath;
    }

    const excelPath = await generateExcel(findOrder);
    let excelUrl = `${process.env.IMAGE_BASE_URL}${excelPath}`; // Example URL format
    excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
    await setResponseObject(
      req,
      true,
      "Report download successfully",
      excelUrl
    );
    next();
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
order.downloadMonthlyReport = async (req, res, next) => {
  try {
    const start = req.query.startDate; // e.g., '2024-10-20'
    const end = req.query.endDate; // e.g., '2024-10-30'

    let filter = [];

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

    if (start || end) {
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

    if (req.query.customer) {
      filter.push({
        $match: {
          createdBy: {
            $in: req.query.customer
              .split(",")
              .map((i) => new mongoose.Types.ObjectId(i)),
          },
        },
      });
    }

    if (req.query.company) {
      filter.push({
        $match: {
          "orderDeatils.companyDetails._id": new mongoose.Types.ObjectId(
            req.query.company
          ),
        },
      });
    }

    if (req.query.deliveryStatus) {
      filter.push({
        $match: {
          "orderDeatils.deliveryStatus": parseInt(req.query.deliveryStatus),
        },
      });
    }

    const paymentDetails = await PAYMENT.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: {
          orderId: { $exists: true, $ne: null },
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
                  {
                    $lookup: {
                      from: "deliverycompanies",
                      let: { id: "$deliveryCompany" },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$$id", "$_id"] },
                          },
                        },
                      ],
                      as: "deliveryCompanyDetails",
                    },
                  },
                  {
                    $unwind: {
                      path: "$deliveryCompanyDetails",
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
          ],
          as: "orderDeatils",
        },
      },
      {
        $unwind: { path: "$orderDeatils", preserveNullAndEmptyArrays: true },
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
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      ...filter,
    ]);

    if (paymentDetails.length > 0) {
      async function generateExcel(paymentDetails) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Monthly Report");
        const data = [
          [
            "Order No",
            "Company",
            "Contact Person Name",
            "Contact Person Number",
            "Shipped company",
            "Promotion",
            "Discount %",
            "Delivery cost",
            "Subtotal",
            "Payment date",
            "Total",
            "Item count",
          ],
        ];
        paymentDetails?.forEach((paymentDetails) => {
          data.push([
            paymentDetails?.orderDeatils?.orderId,
            paymentDetails?.orderDeatils?.companyDetails?.company,
            paymentDetails?.userDetails?.fullName,
            paymentDetails?.userDetails?.countryCode +
              paymentDetails?.userDetails?.mobile,
            paymentDetails?.orderDeatils?.companyDetails?.deliveryCompanyDetails
              ?.company
              ? paymentDetails?.orderDeatils?.companyDetails
                  ?.deliveryCompanyDetails?.company
              : "-",
            paymentDetails?.orderDeatils?.promoDetails?.promoCode
              ? paymentDetails?.orderDeatils?.promoDetails?.promoCode
              : "-",
            paymentDetails?.orderDeatils?.promoDetails?.discount
              ? paymentDetails?.orderDeatils?.orderDeatils?.promoDetails
                  ?.discount
              : "-",
            paymentDetails?.orderDeatils?.deliveryCharge,
            paymentDetails?.orderDeatils?.subTotal,
            moment(paymentDetails?.createdAt).format("YYYY-MM-DD"),
            paymentDetails?.orderDeatils?.total,
            paymentDetails?.orderDeatils?.products?.length,
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
        const excelPath = `../uploads/invoice/monthlyreport-${generateOTP(
          6
        )}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(paymentDetails);
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
      await setResponseObject(req, true, "There is not order");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DOWNLOAD ORDER INVOICE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
order.downloadOrderInvoice = async (req, res, next) => {
  try {
    const orderDetails = await ORDER.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "sellerId",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      {
        $unwind: { path: "$sellerDetails", preserveNullAndEmptyArrays: true },
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
          from: "promo_codes",
          localField: "promocode",
          foreignField: "_id",
          as: "promoDetails",
        },
      },
      {
        $unwind: { path: "$promoDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      {
        $unwind: { path: "$addressDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      {
        $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true },
      },
    ]);

    const FilePath = "../uploads/invoice";

    async function generatePDF(htmlContent) {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent);

      if (!fs.existsSync(FilePath)) {
        fs.mkdirSync(FilePath, {
          recursive: true,
        });
      }

      const pdfPath = `${FilePath}/invoice-pdf${generateOTP(6)}.pdf`;

      const pdf = await page.pdf({
        path: pdfPath,
        format: "A3",
        displayHeaderFooter: false,
      });

      await browser.close();

      return pdfPath;
    }

    const htmlContent = ORDER_INCOICE(
      orderDetails.userDetails.fullName,
      orderDetails.addressDetails.area
        ? orderDetails.addressDetails.area
        : orderDetails.branchDetails.area,
      orderDetails.userDetails.countryCode +
        " " +
        orderDetails.userDetails.mobile,
      orderDetails.orderId,
      orderDetails.userDetails.fullName,
      orderDetails.createdAt,
      orderDetails.products,
      orderDetails.subTotal,
      orderDetails.promoDetails.discount
        ? orderDetails.promoDetails.discount
        : 0,
      orderDetails.total
    );

    const pdfPath = await generatePDF(htmlContent);

    const pdfUrl = `${process.env.LIVE_IP}/api/${pdfPath}`; // Example URL format, adjust as needed

    if (pdfUrl) {
      await setResponseObject(
        req,
        true,
        "Invoice download successfully",
        pdfUrl
      );
      next();
    } else {
      await setResponseObject(req, false, "Invoice not download");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Webhook api
 * @param {}
 * @param {*}
 * @param {*}
 */
order.armadaWebhook = async (req, res, next) => {
  try {
    let webhook = new armadaWebhooks();

    const event = req.body;
    webhook.record = event;
    let webhookData = await webhook.save();
    if (webhookData?.record) {
      try {
        if (webhookData?.record?.code) {
          let dates = new Date();
          let findOrder = await ORDER.findOne({
            deliveryCode: webhookData?.record?.code,
          });

          let findUser = await USER.findById({ _id: findOrder.createdBy });
          let findCompany = await COMPANY_MODEL.findById({
            _id: findOrder?.company,
          });

          let findPromo = await PROMO_CODE.findOne({
            _id: findOrder?.promocode,
          });

          let findSeller = await USER.findOne({
            _id: req.userId,
            roleId: CONST.SALES,
          });

          let findTransaction = await PAYMENT.findOne({
            orderId: findOrder._id,
          });
          let filter = {};
          let resp;
          let saveNotification;
          let updateTracking;
          let obj;
          let cashBackData;
          switch (webhookData?.record?.orderStatus) {
            case "dispatched":
              filter = {
                deliveryStatus: CONST.SHIPPED,
              };
              resp = "Order shipped successfully";

              //SEND NOTIFICATION TO USER
              if (findUser.deviceToken) {
                await sendNotification(
                  findUser?.deviceToken,
                  findUser?.language && findUser?.language == "AR"
                    ? "تم شحن طلبك بنجاح."
                    : "Your Order shipped successfully",
                  findUser?.language && findUser?.language == "AR"
                    ? `تم شحن طلبك ${findOrder.orderId} بنجاح.`
                    : `Your Order ${findOrder.orderId} is shipped successfully`,
                  `${JSON.stringify(findOrder)}`,
                  CONST.ORDER
                );
              }
              var userNotificationBody = {
                to: findUser._id,
                title: "Your Order shipped successfully",
                description: `Your Order ${findOrder.orderId} is shipped successfully`,
                arabicTitle: "تم شحن طلبك بنجاح.",
                arabicDescription: `تم شحن طلبك ${findOrder.orderId} بنجاح.`,
                notificationType: CONST.ORDER,
                orderId: findOrder._id,
              };
              saveNotification = await NOTIFICATION.create(
                userNotificationBody
              );
              //Update order traking
              obj = {
                date: dates.toISOString(),
                stateId: CONST.SHIPPED,
              };

              updateTracking = await ORDER.findByIdAndUpdate(
                { _id: findOrder?._id },
                {
                  $push: { orderTracking: obj },
                },
                { new: true }
              );
              break;

            case "completed":
              filter = {
                deliveryStatus: CONST.COMPLETED,
              };
              resp = "Order completed successfully";

              //SEND NOTIFICATION TO USER
              if (findUser.deviceToken) {
                await sendNotification(
                  findUser?.deviceToken,
                  findUser?.language && findUser?.language == "AR"
                    ? "تم إتمام طلبك بنجاح."
                    : "Your Order is completed successfully",
                  findUser?.language && findUser?.language == "AR"
                    ? `تم إتمام طلبك ${findOrder.orderId} بنجاح.`
                    : `Your Order ${findOrder.orderId} is completed successfully`,
                  `${JSON.stringify(findOrder)}`,
                  CONST.ORDER
                );
              }
              var userNotificationBody = {
                to: findUser._id,
                title: "Your Order is completed successfully",
                description: `Your Order ${findOrder.orderId} is completed successfully`,
                arabicTitle: "تم إتمام طلبك بنجاح.",
                arabicDescription: `تم إتمام طلبك ${findOrder.orderId} بنجاح.`,
                notificationType: CONST.ORDER,
                orderId: findOrder._id,
              };

              saveNotification = await NOTIFICATION.create(
                userNotificationBody
              );

              //Update order traking
              obj = {
                date: dates.toISOString(),
                stateId: CONST.COMPLETED,
              };
              updateTracking = await ORDER.findByIdAndUpdate(
                { _id: findOrder?._id },
                { $push: { orderTracking: obj } },
                { new: true }
              );

              //Add points
              const pointsEarned = findOrder.total * 0.001;
              const pointEntry = await POINT.findOneAndUpdate(
                { userId: findOrder.createdBy },
                {
                  $inc: { points: pointsEarned },
                },
                {
                  new: true,
                  upsert: true,
                }
              );

              //Give cashBack with promocode
              if (findOrder.promocode) {
                const findPromotion = await PROMO_CODE.findOne({
                  _id: findOrder.promocode,
                });
                //Give cashBack with promocode
                if (findPromotion.actionType == CONST.CASHBACK) {
                  const futureDate = new Date();
                  findPromotion.cashbackvalidity = futureDate.setDate(
                    futureDate.getDate() +
                      parseInt(findPromotion.cashbackvalidity)
                  );

                  let amountValue;
                  let now = new Date();
                  let formattedDate = now.toISOString().replace("Z", "+00:00");
                  if (findPromotion.cashBackType == CONST.PERCENTAGE) {
                    amountValue =
                      (findPromotion.discount / 100) * findOrder.total;

                    if (amountValue > findPromotion.maxDiscountAmount) {
                      amountValue = findPromotion.maxDiscountAmount;
                    }

                    cashBackData = {
                      cashBack: amountValue,
                      startDate: formattedDate,
                      endDate: findPromotion.cashbackvalidity,
                      createdBy: new mongoose.Types.ObjectId(
                        findOrder.createdBy
                      ),
                      orderId: new mongoose.Types.ObjectId(findOrder._id),
                    };
                  } else if (findPromotion.cashBackType == CONST.FIX_AMOUNT) {
                    if (findPromotion.rotationCashBack == CONST.ONE_TIME) {
                      amountValue = findPromotion.discount;
                      cashBackData = {
                        cashBack: amountValue,
                        startDate: formattedDate,
                        endDate: findPromotion.cashbackvalidity,
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        orderId: new mongoose.Types.ObjectId(findOrder._id),
                      };
                    } else if (
                      findPromotion.rotationCashBack == CONST.SEVERAL_TIME
                    ) {
                      let value = parseInt(
                        findOrder.total / findPromotion.minPurchaseAmount
                      );
                      amountValue = parseInt(value * findPromotion.discount);
                      cashBackData = {
                        cashBack: amountValue,
                        startDate: formattedDate,
                        endDate: findPromotion.cashbackvalidity,
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        orderId: new mongoose.Types.ObjectId(findOrder._id),
                      };
                      let createCashback = await CASHBACK.create(cashBackData);
                    }
                  }
                }
                //If promocode has action type promotion
                if (findPromotion.actionType == CONST.PROMOTION) {
                  let cashBack =
                    (findPromotion.discount / 100) * findOrder.subTotal;

                  if (cashBack > findPromotion.maxDiscountAmount) {
                    cashBack = findPromotion.maxDiscountAmount;
                  }

                  cashBackData = {
                    cashBack: cashBack,
                  };
                }
              }

              //Give cashBack with spinner
              if (findOrder.rewardId) {
                const findPromotion = await USER_SPINNER_MODEL.findOne({
                  _id: findOrder.rewardId,
                });

                let cashBackData;
                let amountValue;
                let now = new Date();
                let formattedDate = now.toISOString().replace("Z", "+00:00");
                if (findPromotion.spinType == CONST.PERCENTAGE) {
                  amountValue =
                    findOrder.total -
                    findOrder.total * (findPromotion.value / 100);
                  if (amountValue > findPromotion.maxCashBack) {
                    amountValue = findPromotion.maxCashBack;
                  }
                  cashBackData = {
                    cashBack: amountValue,
                    startDate: formattedDate,
                    endDate: findPromotion.endDate,
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    orderId: new mongoose.Types.ObjectId(findOrder._id),
                  };
                  let createCashback = await CASHBACK.create(cashBackData);

                  const walletExist = await WALLET.findOne({
                    userId: findOrder.createdBy,
                  });
                  if (walletExist) {
                    let updateWallet = await WALLET.findOneAndUpdate(
                      { _id: walletExist._id },
                      { amount: walletExist.amount + amountValue },
                      { new: true }
                    );
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  } else {
                    let payload = {
                      userId: findOrder.createdBy,
                      amount: amountValue,
                    };
                    let createWallet = await WALLET.create(payload);
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  }
                } else if (findPromotion.spinType == CONST.FIX_AMOUNT) {
                  cashBackData = {
                    cashBack: findPromotion.value,
                    startDate: formattedDate,
                    endDate: findPromotion.endDate,
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    orderId: new mongoose.Types.ObjectId(findOrder._id),
                  };
                  let createCashback = await CASHBACK.create(cashBackData);
                  const walletExist = await WALLET.findOne({
                    userId: findOrder.createdBy,
                  });
                  if (walletExist) {
                    let updateWallet = await WALLET.findOneAndUpdate(
                      { _id: walletExist._id },
                      { amount: walletExist.amount + findPromotion.value },
                      { new: true }
                    );
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  } else {
                    let payload = {
                      userId: findOrder.createdBy,
                      amount: findPromotion.value,
                    };
                    let createWallet = await WALLET.create(payload);
                    const cashbackUpdate = await CASHBACK.findOneAndUpdate(
                      { _id: createCashback._id },
                      { isAdded: true },
                      { new: true }
                    );
                  }
                }
              }

              //Create account statement

              cartTotal = 0;
              sum = [];
              let pickCost = 0;
              findOrder.products.map((e) => {
                sum.push(e.product_price);
                cartTotal = cartTotal + e.product_price;
                pickCost = pickCost + e.product_cost;
              });

              charge = findOrder.products[0].deliveryCharge;

              let totalPrice = cartTotal + charge;

              if (findCompany.commissionType == CONST.PERCENTAGE) {
                let isExist = await STATEMENT_TRANSACTION.find({
                  company: findOrder.company,
                  accountType: CONST.PERCENTAGE
                })
                  .sort({ createdAt: -1 })
                  .limit(2);

                if (isExist.length > 0) {
                  // Create invoice statement transaction
                  let invoiceBalance = isExist[0].balance + cartTotal;
                  let invoiceTranaction = {
                    type: "Invoice",
                    number: findOrder.orderId,
                    amountCr: formatNumber(cartTotal),
                    balance: formatNumber(invoiceBalance),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.PERCENTAGE,
                  };
                  await STATEMENT_TRANSACTION.create(invoiceTranaction);

                  let commission =
                    cartTotal * (findCompany.perCommission / 100);
                  let commisonBalance = invoiceTranaction.balance - commission;
                  // Create commission statement transaction
                  let commissionTranaction = {
                    type: "Commission",
                    number: findOrder.orderId,
                    amountDr: formatNumber(commission),
                    balance: formatNumber(commisonBalance),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.PERCENTAGE,
                  };
                  await STATEMENT_TRANSACTION.create(commissionTranaction);

                  if (findOrder.promocode || findOrder.rewardId) {
                    if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SHARE
                    ) {
                      let cashBackBoth = cashBackData?.cashBack / 2;

                      let walletBalanceOff =
                        commissionTranaction.balance - cashBackBoth;
                      let walletTranactionOff = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceOff),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionOff);
                      let walletBalanceSup =
                        walletTranactionOff.balance - cashBackBoth;
                      let walletTranactionSup = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceSup),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionSup);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.OFFARAT
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SUPPLIER
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountCr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    }
                    if (findOrder.rewardId) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Spinner reward",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
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
                    number: findOrder.orderId,
                    amountCr: formatNumber(cartTotal),
                    balance: formatNumber(cartTotal),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.PERCENTAGE,
                  };

                  await STATEMENT_TRANSACTION.create(invoiceTranaction);
                  let commission =
                    cartTotal * (findCompany.perCommission / 100);
                  let commisonBalance = invoiceTranaction.balance - commission;
                  // Create commission statement transaction
                  let commissionTranaction = {
                    type: "Commission",
                    number: findOrder.orderId,
                    amountDr: formatNumber(commission),
                    balance: formatNumber(commisonBalance),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.PERCENTAGE,
                  };
                  await STATEMENT_TRANSACTION.create(commissionTranaction);

                  if (findOrder.promocode || findOrder.rewardId) {
                    if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SHARE
                    ) {
                      let cashBackBoth = cashBackData?.cashBack / 2;

                      let walletBalanceOff =
                        commissionTranaction.balance - cashBackBoth;
                      let walletTranactionOff = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceOff),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionOff);
                      let walletBalanceSup =
                        walletTranactionOff.balance - cashBackBoth;
                      let walletTranactionSup = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceSup),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionSup);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.OFFARAT
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SUPPLIER
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountCr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    }

                    if (findOrder.rewardId) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Spinner reward",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.PERCENTAGE,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    }
                  }
                }
              } else if (findCompany.commissionType == CONST.FIX_AMOUNT) {
                let isExist = await STATEMENT_TRANSACTION.find({
                  company: findOrder.company,
                  accountType: CONST.FIX_AMOUNT
                })
                  .sort({ createdAt: -1 })
                  .limit(2);

                if (isExist.length > 0) {
                  // Create invoice statement transaction
                  let invoiceBalance = isExist[0].balance + cartTotal;
                  let invoiceTranaction = {
                    type: "Invoice",
                    number: findOrder.orderId,
                    amountCr: formatNumber(cartTotal),
                    balance: formatNumber(invoiceBalance),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.FIX_AMOUNT,
                  };
                  await STATEMENT_TRANSACTION.create(invoiceTranaction);
                  // Create commission statement transaction
                  let sellingPrice = 0;
                  let deliveryCost = 0;
                  let pickCost = 0;
                  let commission = 0;
                  let commissionBalance = 0;

                  for (let e of findOrder.products) {
                    let findProduct = await PRODUCT_MODEL.findOne({
                      _id: e.items,
                    });
                    sellingPrice += e.product_price || 0;
                    pickCost += e.product_cost || 0;
                    deliveryCost += findProduct.deliveryCost * e.quantity || 0;
                  }

                  if (
                    findOrder.orderType == CONST.PICKUP ||
                    findOrder.orderType == CONST.COUPON
                  ) {
                    commission = sellingPrice - pickCost;
                    commissionBalance = invoiceTranaction.balance - commission;
                  } else if (findOrder.orderType == CONST.DELIVERY) {
                    commission = sellingPrice - deliveryCost;
                    commissionBalance = invoiceTranaction.balance - commission;
                  }

                  let commissionTranaction = {
                    type: "Commission",
                    number: findOrder.orderId,
                    amountDr: formatNumber(commission),
                    balance: formatNumber(commissionBalance),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.FIX_AMOUNT,
                  };
                  await STATEMENT_TRANSACTION.create(commissionTranaction);

                  if (findOrder.promocode || findOrder.rewardId) {
                    if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SHARE
                    ) {
                      let cashBackBoth = cashBackData?.cashBack / 2;

                      let walletBalanceOff =
                        commissionTranaction.balance - cashBackBoth;
                      let walletTranactionOff = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceOff),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionOff);
                      let walletBalanceSup =
                        walletTranactionOff.balance - cashBackBoth;
                      let walletTranactionSup = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceSup),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionSup);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.OFFARAT
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SUPPLIER
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountCr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    }

                    if (findOrder.rewardId) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Spinner reward",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
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
                    number: findOrder.orderId,
                    amountCr: formatNumber(cartTotal),
                    balance: formatNumber(cartTotal),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.FIX_AMOUNT,
                  };

                  await STATEMENT_TRANSACTION.create(invoiceTranaction);
                  // Create commission statement transaction
                  let sellingPrice = 0;
                  let deliveryCost = 0;
                  let pickCost = 0;
                  let commission = 0;
                  let commissionBalance = 0;

                  for (let e of findOrder.products) {
                    sellingPrice += e.product_price || 0;
                    pickCost += e.product_cost || 0;
                    deliveryCost += findProduct.deliveryCost * e.quantity || 0;
                  }

                  if (
                    findOrder.orderType == CONST.PICKUP ||
                    findOrder.orderType == CONST.COUPON
                  ) {
                    commission = sellingPrice - pickCost;
                    commissionBalance = invoiceTranaction.balance - commission;
                  } else if (findOrder.orderType == CONST.DELIVERY) {
                    commission = sellingPrice - deliveryCost;
                    commissionBalance = invoiceTranaction.balance - commission;
                  }

                  let commissionTranaction = {
                    type: "Commission",
                    number: findOrder.orderId,
                    amountDr: formatNumber(commission),
                    balance: formatNumber(commissionBalance),
                    company: new mongoose.Types.ObjectId(findOrder.company),
                    createdBy: new mongoose.Types.ObjectId(findOrder.createdBy),
                    date: dates.toISOString(),
                    accountType: CONST.FIX_AMOUNT,
                  };

                  await STATEMENT_TRANSACTION.create(commissionTranaction);

                  if (findOrder.promocode || findOrder.rewardId) {
                    if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SHARE
                    ) {
                      let cashBackBoth = cashBackData?.cashBack / 2;

                      let walletBalanceOff =
                        commissionTranaction.balance - cashBackBoth;
                      let walletTranactionOff = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceOff),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionOff);
                      let walletBalanceSup =
                        walletTranactionOff.balance - cashBackBoth;
                      let walletTranactionSup = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackBoth),
                        balance: formatNumber(walletBalanceSup),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranactionSup);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.OFFARAT
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Off",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    } else if (
                      findOrder.promocode &&
                      findPromo?.supplierShare == CONST.SUPPLIER
                    ) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Wallet-Sup",
                        number: findOrder.orderId,
                        amountCr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    }
                    if (findOrder.rewardId) {
                      let walletBalance =
                        commissionTranaction.balance - cashBackData?.cashBack;
                      let walletTranaction = {
                        type: "Spinner reward",
                        number: findOrder.orderId,
                        amountDr: formatNumber(cashBackData?.cashBack),
                        balance: formatNumber(walletBalance),
                        company: new mongoose.Types.ObjectId(findOrder.company),
                        createdBy: new mongoose.Types.ObjectId(
                          findOrder.createdBy
                        ),
                        date: dates.toISOString(),
                        accountType: CONST.FIX_AMOUNT,
                      };
                      await STATEMENT_TRANSACTION.create(walletTranaction);
                    }
                  }
                }
              }

              break;

            case "canceled":

              filter = {
                deliveryStatus: CONST.PENDING,
              };

              resp = "Order cancelled successfully";

              //SEND NOTIFICATION TO USER
              if (findUser.deviceToken) {
                await sendNotification(
                  findUser?.deviceToken,
                  findUser?.language && findUser?.language == "AR"
                    ? "تم إلغاء طلبك بواسطة البائع."
                    : "Your Order cancelled by delivery company. We will deliver soon",
                  findUser?.language && findUser?.language == "AR"
                    ? `تم إلغاء طلبك ${findOrder.orderId} بواسطة البائع.`
                    : `Your Order ${findOrder.orderId} is cancelled delivery company. We will deliver soon`,
                  `${JSON.stringify(findOrder)}`,
                  CONST.ORDER
                );
              }
              var userNotificationBody = {
                to: findUser._id,
                title:
                  "Your Order cancelled by delivery company. We will deliver soon",
                description: `Your Order ${findOrder.orderId} is cancelled delivery company. We will deliver soon`,
                arabicTitle: "تم إلغاء طلبك بواسطة البائع.",
                arabicDescription: `تم إلغاء طلبك ${findOrder.orderId} بواسطة البائع.`,
                notificationType: CONST.ORDER,
                orderId: findOrder._id,
              };

              saveNotification = await NOTIFICATION.create(
                userNotificationBody
              );

              //Update order traking
              obj = {
                date: dates.toISOString(),
                stateId: CONST.PENDING,
              };
              updateTracking = await ORDER.findByIdAndUpdate(
                { _id: findOrder?._id },
                {
                  $push: { orderTracking: obj },
                  $unset: { trackingLink: "", qrCodeLink: "" },
                },
                { new: true }
              );
              
              break;

            default:
              break;
          }

          const orderState = await ORDER.findByIdAndUpdate(
            { _id: findOrder?._id },
            filter,
            { new: true }
          );
          if (orderState) {
            if (req.query.deliveryStatus == CONST.COMPLETED) {
              const findOrder = await ORDER.findById({ _id: findOrder?._id });

              for (let index = 0; index < findOrder.products.length; index++) {
                const element = findOrder.products[index].items;
                const puchaseCount = await PRODUCT_MODEL.findByIdAndUpdate(
                  {
                    _id: findOrder.products[index].items,
                  },
                  {
                    $inc: {
                      purchaseCount: 1,
                    },
                  },
                  { new: true }
                );
              }
            }
            console.log("Order Status updated");
          } else {
            console.log("Order Status updated error ");
          }
        } else {
          console.log("Code not find ");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    if (webhookData) {
      return res.status(200).send({ message: "Added successfully" });
    } else {
      return res.status(400).send({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = order;
