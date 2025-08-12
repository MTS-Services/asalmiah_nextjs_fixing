/** 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CART } = require("../app/cart/model/model");
const { PRODUCT_MODEL } = require("../app/product/model/product.model");
const cron = require("node-cron");
const { sendNotification } = require("./fcmPushNotification");
const { USER } = require("../app/userService/model/userModel");
const { CONST } = require("./constant");
const {
  NOTIFICATION,
} = require("../app/notification/model/notification.model");
const { PROMO_CODE } = require("../app/promoCode/model/model");
const ORDER = require("../app/order/model/order.model");
const { SCHEDULE_ORDER } = require("../app/scheduleOrder/model/model");
const moment = require("moment");
const { CASHBACK } = require("../app/cashBack/model/model");
const { WALLET } = require("../app/wallet/model/model");
const { SPINNER_MODEL } = require("../app/spinner/model/spinner.model");
const { Error_Logs } = require("../app/errorLogs/model/logModal");

const userNotification = cron.schedule("0 * * * *", async function () {
  try {
    const findCarts = await CART.find();
    findCarts?.map(async (e) => {
      const findProduct = await PRODUCT_MODEL.findById({
        _id: e?.productId,
      });

      if (findProduct?.quantity == 0) {
        // PUSH NOTIFICATION TO USER
        const findUser = await USER.findById({
          _id: e.createdBy,
        });
        if (findUser?.deviceToken) {
          await sendNotification(
            findUser?.deviceToken,
            findUser?.language && findUser?.language == "AR"
              ? "المنتج غير متوفر في المخزن."
              : "Product is out of stock",
            findUser?.language && findUser?.language == "AR"
              ? `المنتج ${findProduct.productName} غير متوفر حاليًا في المخزن.`
              : `${findProduct.productName} is currently out of stock.`,
            `${JSON.stringify(findProduct)}`,
            CONST.OUT_STOCK
          );
        }

        // SEND NOTIFICATION TO USER
        var userNotificationBody = {
          to: e.createdBy,
          title: "Product is out of stock",
          description: `${findProduct.productName} is currently out of stock.`,
          arabicTitle: "المنتج غير متوفر في المخزن.",
          arabicDescription: `المنتج ${findProduct.productName} غير متوفر حاليًا في المخزن.`,
          notificationType: CONST.OUT_STOCK,
        };

        let notificationBody = await NOTIFICATION.create(userNotificationBody);
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

/*If product end point is expire then inactive product*/
const inactiveProduct = cron.schedule("0 0 * * *", async function () {
  try {
    let todayDate = new Date();
    let formattedDate = todayDate.toISOString();
    formattedDate = formattedDate.replace("Z", "+00:00");

    let date1 = formattedDate.split("T")[0];

    const findProduct = await PRODUCT_MODEL.find({
      stateId: { $eq: CONST.ACTIVE },
    });

    findProduct.map(async (e) => {
      let date2;

      if (e.endDate instanceof Date) {
        date2 = e.endDate.toISOString().split("T")[0];
      } else if (typeof e.endDate === "string") {
        date2 = e.endDate.split("T")[0];
      } else {
        console.error("e.endDate is not a valid type");
      }
      if (date2 < date1) {
        await PRODUCT_MODEL.findByIdAndUpdate(
          { _id: e._id },
          { stateId: CONST.INACTIVE },
          { new: true }
        );

        let findCarts = await CART.find({ productId: e._id });
        findCarts.map(async (ele) => {
          await CART.findByIdAndDelete({ _id: ele._id });
        });
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

/*If promocode expire remove from user cart*/
const expirePromo = cron.schedule("0 0 * * *", async function () {
  try {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // Add 1 and pad with zero
    const day = String(todayDate.getDate()).padStart(2, "0"); // Pad with zero
    const formattedDate = `${year}-${month}-${day}`;

    const findCart = await CART.find({ promotionApplied: true });

    findCart.map(async (e) => {
      const findPromo = await PROMO_CODE.findOne({ _id: e.promocode });
      if (findPromo?.endDate > formattedDate) {
        await CART.findOneAndUpdate(
          { _id: e._id },
          { promotionApplied: false, $unset: { promocode: "" } },
          { new: true }
        );
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

/*Send schedule order notification*/
const sendOrderReminder = cron.schedule("* * * * *", async function () {
  try {
    let todayDate = new Date();
    let formattedDate = todayDate.toISOString();
    formattedDate = formattedDate.replace("Z", "+00:00");

    const formattedDateOnly = formattedDate.split("T")[0];

    const findScheduleOrder = await SCHEDULE_ORDER.find();
    if (findScheduleOrder.length > 0) {
      await Promise.all(
        findScheduleOrder?.map(async (e) => {
          const findOrder = await ORDER.findOne({ _id: e.orderId });
          if (findOrder?.deliveryStatus !== CONST.COMPLETED) {
            // Convert startDate to a string if it's not already
            const startDateString =
              e.startDate instanceof Date
                ? e?.startDate.toISOString()
                : e?.startDate;
            const startDateOnly = startDateString?.split("T")[0];

            const findUser = await USER.findOne({
              _id: e?.scheduleBy,
            });

            if (formattedDateOnly === startDateOnly) {
              // PUSH NOTIFICATION TO USER
              if (findUser.deviceToken) {
                await sendNotification(
                  findUser?.deviceToken,
                  findUser?.language && findUser?.language == "AR"
                    ? "طلبك المجدول هو اليوم!"
                    : "Your Scheduled Order is Today!",
                  findUser?.language && findUser?.language == "AR"
                    ? `هذه تذكرة ودية بأن طلبك المجدول مقرر ليوم اليوم، ${moment
                        .utc(e.startDate)
                        .format(
                          "DD/MM/YYYY"
                        )}. نود التأكد من أنك مستعد لاستلام طلبك في الوقت المحدد.`
                    : `This is a friendly reminder that your scheduled order is set for today, ${moment
                        .utc(e.startDate)
                        .format(
                          "DD/MM/YYYY"
                        )}. We want to ensure that you are prepared to receive your order at the designated time.`,
                  `${JSON.stringify(e)}`,
                  CONST.ORDER
                );
              }

              // SEND NOTIFICATION TO USER
              var userNotificationBody = {
                to: findUser.createdBy,
                title: "Your Scheduled Order is Today!",
                description: `This is a friendly reminder that your scheduled order is set for today, ${moment
                  .utc(e.startDate)
                  .format(
                    "DD/MM/YYYY"
                  )}. We want to ensure that you are prepared to receive your order at the designated time.`,
                arabicTitle: "طلبك المجدول هو اليوم!",
                arabicDescription: `هذه تذكرة ودية بأن طلبك المجدول مقرر ليوم اليوم، ${moment
                  .utc(e.startDate)
                  .format(
                    "DD/MM/YYYY"
                  )}. نود التأكد من أنك مستعد لاستلام طلبك في الوقت المحدد.`,
                notificationType: CONST.ORDER,
              };

              let notificationBody = await NOTIFICATION.create(
                userNotificationBody
              );
            }
          }
        })
      );
    } else {
      console.log("No schedule order found");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

/*Expire user cashback*/
const expireCash = cron.schedule("* * * * *", async function () {
  let now = new Date();

  const findCash = await CASHBACK.find();
  if (findCash.length > 0) {
    for (const e of findCash) {
      // Convert endDate to a Date object
      const endDate = new Date(e.endDate);

      // Compare the dates
      if (endDate < now) {
        const cashback = await CASHBACK.findOneAndDelete({ _id: e._id });
        const walletExist = await WALLET.findOne({
          userId: cashback?.createdBy,
        });
        if (walletExist.amount > 0) {
          let wallet = walletExist.amount - cashback.cashBack;
          const updateWallet = await WALLET.findOneAndUpdate(
            {
              userId: cashback.createdBy,
            },
            { amount: wallet },
            { new: true }
          );
        }
      }
    }
  } else {
    console.log("NO cashback found");
  }
});

/*Update user wallet if cash back start date is match*/
const updateWallet = cron.schedule("0 0 * * *", async function () {
  let now = new Date();
  const findCash = await CASHBACK.find();
  if (findCash.length > 0) {
    for (const e of findCash) {
      // Convert startDate to a Date object
      const startDate = new Date(e.startDate);

      // Check if the current time is greater than or equal to startDate
      if ((now = startDate)) {
        const cashback = await CASHBACK.findOne({ _id: e._id, isAdded: false });

        const walletExist = await WALLET.findOne({
          userId: cashback?.createdBy,
        });

        if (walletExist) {
          let wallet = walletExist.amount + cashback.cashBack;
          const updatedWallet = await WALLET.findOneAndUpdate(
            {
              userId: cashback.createdBy,
            },
            { amount: wallet },
            { new: true }
          );
          const cashbackUpdate = await CASHBACK.findOneAndUpdate(
            { _id: e._id },
            { isAdded: true },
            { new: true }
          );
        } else {
          let payload = {
            userId: cashback.createdBy,
            amount: cashback.cashBack,
          };
          let createWallet = await WALLET.create(payload);
          const cashbackUpdate = await CASHBACK.findOneAndUpdate(
            { _id: e._id },
            { isAdded: true },
            { new: true }
          );
        }
      }
    }
  } else {
    console.log("NO cashback found");
  }
});

/*If product end point is expire then inactive product*/
const inactiveSpinner = cron.schedule("* * * * *", async function () {
  try {
    let todayDate = new Date();
    let formattedDate = todayDate.toISOString();
    formattedDate = formattedDate.replace("Z", "+00:00");

    let date1 = formattedDate.split("T")[0];

    const findSpin = await SPINNER_MODEL.find({
      stateId: { $eq: CONST.ACTIVE },
    });

    findSpin.map(async (e) => {
      let date2;

      if (e.endDate instanceof Date) {
        date2 = e.endDate.toISOString().split("T")[0];
      } else if (typeof e.endDate === "string") {
        date2 = e.endDate.split("T")[0];
      } else {
        console.error("e.endDate is not a valid type");
      }
      if (date2 < date1) {
        await SPINNER_MODEL.findByIdAndUpdate(
          { _id: e._id },
          { stateId: CONST.INACTIVE },
          { new: true }
        );
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

/*Remove error logs except today date*/
const removeErrorLog = cron.schedule("* * * * *", async function () {
  const todayDate = new Date();
  const today = moment(todayDate).format("YYYY-MM-DD");
  await Error_Logs.deleteMany({ createdAt: { $lt: today } });
});
