/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { NOTIFICATION } = require("../model/notification.model");
const notification = {};

const dir = "../uploads/notification";
let fs = require("fs");
let multer = require("multer");
const { USER } = require("../../userService/model/userModel");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const nodemailer = require("../../../helpers/nodemailer");
const { SMTP } = require("../../smtp/model/smtp.model");
const { EMAIL_LOGS } = require("../../errorLogs/model/logModal");
const { ADMIN_TEMPLATE } = require("../../../helpers/email_template");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage }).fields([{ name: "image" }]);

/**
 * Api for users get notification list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
notification.getUserNotification = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo || req.body.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

    const list = await NOTIFICATION.aggregate([
      { $sort: { _id: -1 } },
      { $match: { stateId: CONST.ACTIVE } },
      {
        $match: {
          $or: [{ to: new mongoose.Types.ObjectId(req.userId) }],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$from" },
          pipeline: [{ $match: { $expr: { $eq: ["$$id", "$_id"] } } }],
          as: "sendFrom",
        },
      },
      { $unwind: { path: "$sendFrom", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: true,
          title: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicTitle", "$title"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$title", // If language is not 'AR', use category
            },
          },
          arabicTitle: true,
          description: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$description", // If language is not 'AR', use category
            },
          },
          arabicDescription: true,
          image: true,
          stateId: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          productId: true,
          isSeen: true,
          amount: true,
          sendFrom: { _id: true, fullName: true, phoneNumber: true },
          orderId: true,
          company: true,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    await NOTIFICATION.updateMany(
      { to: req.userId },
      { $set: { isSeen: true } }
    );

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Notification list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Notification list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, error.stack);
    next();
  }
};

/**
 * get admin notification list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
notification.getAdminNotificationList = async (req, res, next) => {
  try {
    let page = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    // let findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
    // let findPromotion = await USER.find({ roleId: CONST.PROMOTION_USER });
    // let findDesigned = await USER.find({ roleId: CONST.DESIGNED_USER });

    const myAllNotification = await NOTIFICATION.aggregate([
      // {
      //   $match: {
      //     $or: [
      //       {
      //         roleId: CONST.ADMIN,
      //       },
      //       {
      //         roleId: CONST.PROMOTION_USER,
      //       },
      //       {
      //         roleId: CONST.DESIGNED_USER,
      //       },
      //     ],
      //   },
      // },
      {
        $lookup: {
          from: "users",
          let: { userIds: "$userId" }, // Assuming userId is an array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$userIds"] },
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
          as: "userId",
        },
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
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          arabicTitle: { $first: "$arabicTitle" },
          description: { $first: "$description" },
          arabicDescription: { $first: "$arabicDescription" },
          userId: { $first: "$userId" },
          from: { $first: "$from" },
          to: { $first: "$to" },
          orderId: { $first: "$orderId" },
          isSeen: { $first: "$isSeen" },
          type: { $first: "$type" },
          notificationType: { $first: "$notificationType" },
          image: { $first: "$image" },
          stateId: { $first: "$stateId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          createdBy: { $first: "$createdBy" },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (page - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (myAllNotification && myAllNotification[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Notification list found successfully",
        myAllNotification[0].data,
        myAllNotification[0].count[0].count,
        page,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Notification list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, error.stack);
    next();
  }
};

/**
 * get admin notification view
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
notification.notificationView = async (req, res, next) => {
  try {
    const details = await NOTIFICATION.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "users",
          let: { userIds: "$userId" }, // Assuming userId is an array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$userIds"] },
              },
            },
          ],
          as: "userId",
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
          ],

          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
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
    ]);

    if (details.length > 0) {
      await setResponseObject(
        req,
        true,
        "Notification details found",
        details[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Notification details not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, error.stack);
    next();
  }
};

/**
 * My delete all notification
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
notification.deleteNotification = async (req, res, next) => {
  try {
    let notification = await NOTIFICATION.deleteMany({
      to: new mongoose.Types.ObjectId(req.userId),
    });

    if (notification) {
      await setResponseObject(req, true, "Notification deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Notification not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Send notification
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
notification.sendNotification = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      !fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      const data = req.body;
      data.createdBy = req.userId;

      if (req.roleId == CONST.ADMIN) {
        data.roleId = CONST.ADMIN;
      }

      if (req.roleId == CONST.DESIGNED_USER) {
        data.roleId = CONST.DESIGNED_USER;
      }

      if (req.roleId == CONST.PROMOTION_USER) {
        data.roleId = CONST.PROMOTION_USER;
      }

      const arr = [];
      if (data.type == "true") {
        const findUser = await USER.find({
          stateId: CONST.ACTIVE,
          roleId: CONST.USER,
        });
        findUser.map((e) => {
          arr.push(e._id);
        });
        data.userId = arr;
        data.type = true;
      }

      if (req?.files?.image) {
        const arr = [];
        req.files.image.map((e) => {
          let url = process.env.IMAGE_BASE_URL + e.path.replace(/\s+/g, "");
          url = url.replace(/\/\.\.\//g, "/");
          arr.push({
            url: url,
          });
          const img = arr;
          data.image = img;
        });
      }
      const saveData = await NOTIFICATION.create(data);

      if (saveData) {
        saveData.userId.map(async (e) => {
          const user = await USER.findOne({ _id: e });
          //SEND PUSH NOTIFICATION TO USER
          if (user.deviceToken) {
            await sendNotification(
              user?.deviceToken,
              `${
                user.language && user.language == "AR"
                  ? saveData.arabicTitle
                    ? saveData.arabicTitle
                    : saveData.title
                  : saveData.title
              }`,
              `${
                user.language && user.language == "AR"
                  ? saveData.arabicDescription
                    ? saveData.arabicDescription
                    : saveData.description
                  : saveData.description
              }`,
              `${saveData.company}`,
              `${data.notificationType}`
            );
          }

          //SEND NOTIFICATION TO USER
          var notificationBody = {
            to: user._id,
            title: saveData.title,
            description: saveData.description,
            arabicTitle: saveData.arabicTitle,
            arabicDescription: saveData.arabicDescription,
            image: saveData.image,
            company: saveData.company,
            notificationType: data.notificationType,
          };

          let saveNotificatioN = await NOTIFICATION.create(notificationBody);
        });

        await setResponseObject(
          req,
          true,
          "Notification send successfully.",
          saveData
        );
        next();
      } else {
        await setResponseObject(req, false, "Notification not created.");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = notification;
