/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const {
  SPINNER_MODEL,
  USER_SPINNER_MODEL,
  SPINNER_SETTING_MODEL,
} = require("../model/spinner.model");
const {
  setResponseObject,
  generateAflaNumricCode,
  generateOTP,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const logger = require("winston");
const ExcelJS = require("exceljs");
const moment = require("moment");
const spinner = {};

const multer = require("multer");
const fs = require("fs");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const { COMPANY_MODEL } = require("../../company/model/model");
const dir = "../uploads/spinner";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "spinnerImg" }]);

/*Add spinner*/
spinner.add = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }

      const data = req.body;
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
      data.createdBy = req.userId;

      if (req?.files?.spinnerImg) {
        data.spinnerImg =
          process.env.IMAGE_BASE_URL +
          req.files?.spinnerImg?.[0].path.replace(/\s+/g, "");
        data.spinnerImg = data.spinnerImg.replace(/\/\.\.\//g, "/");
      }
      const result = await SPINNER_MODEL.create(data);

      if (result) {
        await setResponseObject(
          req,
          true,
          "Spinner added successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Spinner not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all spinner*/
spinner.list = async (req, res, next) => {
  try {
    const today = new Date();
    const todayDateStart = new Date(
      today.toISOString().split("T")[0] + "T00:00:00Z"
    ); // Start of the day in UTC

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let roleFilter = {};

    if (req.roleId == CONST.USER || req.roleId == CONST.SALES) {
      roleFilter = {
        stateId: CONST.ACTIVE,
        startDate: { $lte: today },
      };
    }

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

    if (!req.roleId) {
      roleFilter = {
        stateId: CONST.ACTIVE,
        startDate: { $lte: today },
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        spinner: {
          $regex: req.query.search
            ? req.query.search
            : "".replace(new RegExp("\\\\", "g"), "\\\\"),
          $options: "i",
        },
      };
    }

    let stateFilter = {};
    switch (req.query.stateId) {
      case "1":
        stateFilter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2":
        stateFilter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        break;
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
        const companyIds = companies.map((company) => company._id);

        categoryFilter = {
          company: { $in: companyIds }, // ✅ This works even if `company` is an array
        };
      }
    }

    let list = await SPINNER_MODEL.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: roleFilter,
      },
      {
        $match: searchFilter,
      },
      {
        $match: stateFilter,
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
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: "$createdBy._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
                },
              },
            },
          ],
          as: "permission",
        },
      },
      {
        $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
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

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Spinner list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Spinner list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View spinner */
spinner.detail = async (req, res, next) => {
  try {
    const getSingle = await SPINNER_MODEL.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
          ],
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: { $ifNull: ["$company", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] }, // Use $$id safely
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
          as: "company",
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { categoryId: "$category" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$categoryId"] },
              },
            },
          ],
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
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
    if (getSingle) {
      await setResponseObject(req, true, "Spinner details found", getSingle[0]);
      next();
    } else {
      await setResponseObject(req, true, "Spinner details not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update spinner*/
spinner.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }
      const data = req.body;

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

      const findSpinner = await SPINNER_MODEL.findById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (req.files?.spinnerImg) {
        if (findSpinner?.spinnerImg) {
          fs.stat(findSpinner.spinnerImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findSpinner.spinnerImg, async (err) => {
                if (err) {
                  logger.warn(`error ${err}`);
                } else {
                  logger.warn(`file was deleted`);
                }
              });
            } else if (err.code == "ENOENT") {
              logger.warn(`file doesnot exists`);
              return;
            }
          });
        }
        data.spinnerImg =
          process.env.IMAGE_BASE_URL +
          req.files?.spinnerImg?.[0].path.replace(/\s+/g, "");
        data.spinnerImg = data.spinnerImg.replace(/\/\.\.\//g, "/");
      }

      if (data?.company) {
        data.company = data?.company.split(",");
      }

      data.updatedBy = req.userId;

      const updateData = await SPINNER_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Spinner updated successfully",
          updateData
        );
        next();
      } else {
        await setResponseObject(req, false, "Spinner not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update spinner state*/
spinner.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Spinner Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Spinner In-Active successfully";
        break;

      default:
    }

    let updateState = await SPINNER_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: filter,
      },
      { new: true }
    );

    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Spinner state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete spinner*/
spinner.delete = async (req, res, next) => {
  try {
    const deleteData = await SPINNER_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Spinner deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Spinner not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active spinner list*/
spinner.activeSpinnerList = async (req, res, next) => {
  try {
    const today = new Date();
    const todayDateStart = new Date(
      today.toISOString().split("T")[0] + "T00:00:00Z"
    ); // Start of the day in UTC

    const getSingle = await SPINNER_MODEL.find({
      stateId: CONST.ACTIVE,
      startDate: { $lte: today },
    }).sort({
      order: 1,
    });

    if (getSingle) {
      await setResponseObject(req, true, "Spinner list found", getSingle);
      next();
    } else {
      await setResponseObject(req, true, "Spinner list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*************************************************************SPINNER SETTING API*******************************/

/*Add setting spinner setting*/
spinner.addSpinnerSetting = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.userId;
    const result = await SPINNER_SETTING_MODEL.create(data);
    if (result) {
      await setResponseObject(
        req,
        true,
        "Spinner setting added successfully",
        result
      );
      next();
    } else {
      await setResponseObject(req, false, "Spinner setting not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all spinner setting */
spinner.SpinnerSettingList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let roleFilter = {};

    if (req.roleId == CONST.USER || req.roleId == CONST.SALES) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

    if (!req.roleId) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        description: {
          $regex: req.query.search
            ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
            : "",
          $options: "i",
        },
      };
    }

    let stateFilter = {};
    switch (req.query.stateId) {
      case "1":
        stateFilter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2":
        stateFilter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        break;
    }

    let list = await SPINNER_SETTING_MODEL.aggregate([
      {
        $match: roleFilter,
      },
      {
        $match: searchFilter,
      },
      {
        $match: stateFilter,
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
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: "$createdBy._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
                },
              },
            },
          ],
          as: "permission",
        },
      },
      {
        $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
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

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Spinner setting list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Spinner setting list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View spinner setting*/
spinner.SpinnerSettingDetail = async (req, res, next) => {
  try {
    const getSingle = await SPINNER_SETTING_MODEL.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
    if (getSingle.length > 0) {
      await setResponseObject(
        req,
        true,
        "Spinner setting details found",
        getSingle[0]
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Spinner setting details not found",
        ""
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update spinner setting*/
spinner.SpinnerSettingUpdate = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    const updateData = await SPINNER_SETTING_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Spinner setting updated successfully",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Spinner setting  not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update spinner state setting*/
spinner.SpinnerSettingUpdateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    // Determine the new state based on stateId
    switch (req.query.stateId) {
      case "1":
        filter = { stateId: 1 }; // Set to ACTIVE
        resp = "Spinner setting activated successfully";
        break;

      case "2":
        filter = { stateId: 2 }; // Set to INACTIVE
        resp = "Spinner setting deactivated successfully";
        break;

      default:
        await setResponseObject(req, false, "Invalid stateId provided");
        return next();
    }

    // First, update the current spinner setting
    let updateState = await SPINNER_SETTING_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: filter },
      { new: true }
    );

    if (!updateState) {
      await setResponseObject(req, false, "Spinner setting state not updated");
      return next();
    }

    // If the new state is ACTIVE, set all others to INACTIVE
    if (filter.stateId === 1) {
      await SPINNER_SETTING_MODEL.updateMany(
        { _id: { $ne: req.params.id }, stateId: 1 }, // Exclude the updated spinner
        { $set: { stateId: 2 } } // Set others to INACTIVE
      );
    }

    await setResponseObject(req, true, resp, updateState);
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*Delete spinner setting*/
spinner.SpinnerSettingDelete = async (req, res, next) => {
  try {
    const deleteData = await SPINNER_SETTING_MODEL.findOneAndDelete({
      _id: req.params.id,
    });
    if (deleteData) {
      await setResponseObject(
        req,
        true,
        "Spinner setting deleted successfully"
      );
      next();
    } else {
      await setResponseObject(req, false, "Spinner setting not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Add spinner setting*/
spinner.winnerData = async (req, res, next) => {
  try {
    const data = req.body;
    data.userId = req.userId;
    let spinnerData = await SPINNER_MODEL.findOne({
      _id: new mongoose.Types.ObjectId(data.spinnerId),
    });
    data.startDate = spinnerData?.startDate;
    data.endDate = spinnerData?.endDate;
    data.size = spinnerData?.size;
    data.minAmount = spinnerData?.minAmount;
    data.maxCashBack = spinnerData?.maxCashBack;
    data.category = spinnerData?.category;
    // data.company = spinnerData?.company;
    data.spinType = spinnerData?.spinType;
    data.value = spinnerData?.value;
    data.spinnerImg = spinnerData?.spinnerImg;
    data.numberOfUse = spinnerData?.numberOfUse;
    data.spanMessage = spinnerData?.spanMessage;
    data.detail = spinnerData?.detail;
    data.productId = spinnerData?.productId;

    if (data.spinType == CONST.REFERRAL) {
      data.referralCode = generateAflaNumricCode(10);
    }
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
    const result = await USER_SPINNER_MODEL.create(data);

    if (result) {
      await setResponseObject(req, true, "Spinner added successfully", result);
      next();
    } else {
      await setResponseObject(req, false, "Spinner not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all spinner setting*/
spinner.winList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let roleFilter = {};
    let spinnerFilter = {};
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to start of the day
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set to end of the day
    if (req.roleId === CONST.USER) {
      roleFilter.userId = new mongoose.Types.ObjectId(req.userId);
      // roleFilter.startDate = { $lte: todayDate };
      spinnerFilter.spinType = {
        $in: [
          CONST.PERCENTAGE,
          CONST.FIX_AMOUNT,
          CONST.FREE_DELIVERY,
          CONST.REFERRAL,
        ],
      };

      if (req.query.type === "APPLY") {
        spinnerFilter.spinType.$in.pop(CONST.REFERRAL);
        roleFilter.isUsed = false;
        roleFilter.createdAt = { $gte: startOfToday, $lte: endOfToday };
      }
    }
    if (req.roleId === CONST.ADMIN) {
      roleFilter.stateId = { $ne: CONST.DELETED };
    }

    if (!req.roleId) {
      roleFilter.stateId = CONST.ACTIVE;
    }
    if (req.query.category) {
      spinnerFilter.category = new mongoose.Types.ObjectId(req.query.category);
    }
    if (req.query.company) {
      spinnerFilter.company = new mongoose.Types.ObjectId(req.query.company);
    }
    if (req.query.price && req.query.size) {
      spinnerFilter.minAmount = req.query.minAmount;
      spinnerFilter.size = req.query.size;
    }
    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.spinner = {
        $regex: req.query.search.replace(new RegExp("\\\\", "g"), "\\\\"),
        $options: "i",
      };
    }

    let stateFilter = {};
    switch (req.query.stateId) {
      case "1":
        stateFilter.stateId = CONST.ACTIVE;
        break;
      case "2":
        stateFilter.stateId = CONST.INACTIVE;
        break;
      default:
        break;
    }

    const combinedMatchFilter = {
      ...roleFilter,
      ...searchFilter,
      ...stateFilter,
      ...spinnerFilter,
    };

    let list = await USER_SPINNER_MODEL.aggregate([
      { $match: combinedMatchFilter },
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
                arabicCompany: 1,
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
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
      { $sort: { _id: -1, isUsed: 1 } },
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
        "Rewards list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Rewards list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * SPINNER REPORT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
spinner.downloadSpinnerReport = async (req, res, next) => {
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

    // if (req.query.isUsed) {
    //   filter.push({
    //     $match: {
    //       isUsed: req.query.isUsed == "true" ? true : false,
    //     },
    //   });
    // }

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
        const companyIds = companies.map((company) => company._id);

        categoryFilter = {
          company: { $in: companyIds }, // ✅ This works even if `company` is an array
        };
      }
    }

    const spinDetails = await USER_SPINNER_MODEL.aggregate([
      {
        $match: categoryFilter,
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
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "spinners",
          let: { id: "$spinnerId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "spinnerDetails",
        },
      },
      {
        $unwind: { path: "$spinnerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$category" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
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
      ...filter,
    ]);

    if (spinDetails.length > 0) {
      async function generateExcel(spinDetails) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Coupon Report");
        const data = [
          [
            "User Name",
            "Email",
            "Spin Type",
            "Start Date",
            "End Date",
            "Min Amount",
            "Max CashBack",
            "Referral Code",
            "isUsed",
          ],
        ];

        spinDetails?.forEach((spinDetails) => {
          const spinTypeMessage =
            spinDetails?.spinnerDetails?.spinType === CONST.PERCENTAGE
              ? "Percentage"
              : spinDetails?.spinnerDetails?.spinType === CONST.FIX_AMOUNT
              ? "Fixed Amount"
              : spinDetails?.spinnerDetails?.spinType === CONST.FREE_DELIVERY
              ? "Free Delivery"
              : spinDetails?.spinnerDetails?.spinType === CONST.HARD_LUCK
              ? "Hard Luck"
              : spinDetails?.spinnerDetails?.spinType === CONST.REFERRAL
              ? "Referral"
              : "Unknown Spin Type";

          data.push([
            spinDetails?.userDetails?.fullName,
            spinDetails?.userDetails?.email,
            spinTypeMessage,
            moment(spinDetails?.startDate).format("lll"),
            moment(spinDetails?.endDate).format("lll"),
            spinDetails?.minAmount ? spinDetails?.minAmount : "-",
            spinDetails?.maxCashBack ? spinDetails?.maxCashBack : "-",
            spinDetails?.referralCode ? spinDetails?.referralCode : "-",
            spinDetails?.isUsed ? spinDetails?.isUsed : "-",
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
        const excelPath = `../uploads/invoice/wonspinnerreport-${generateOTP(
          6
        )}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(spinDetails);
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

/*Add spinner setting*/
spinner.winnerDataPublic = async (req, res, next) => {
  try {
    const data = req.body;
    let spinnerData = await SPINNER_MODEL.findOne({
      _id: new mongoose.Types.ObjectId(data.spinnerId),
    });
    data.startDate = spinnerData?.startDate;
    data.endDate = spinnerData?.endDate;
    data.size = spinnerData?.size;
    data.minAmount = spinnerData?.minAmount;
    data.maxCashBack = spinnerData?.maxCashBack;
    data.category = spinnerData?.category;
    // data.company = spinnerData?.company;
    data.spinType = spinnerData?.spinType;
    data.value = spinnerData?.value;
    data.spinnerImg = spinnerData?.spinnerImg;
    data.numberOfUse = spinnerData?.numberOfUse;
    data.spanMessage = spinnerData?.spanMessage;
    data.detail = spinnerData?.detail;
    data.productId = spinnerData?.productId;

    if (data.spinType == CONST.REFERRAL) {
      data.referralCode = generateAflaNumricCode(10);
    }
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
    const result = await USER_SPINNER_MODEL.create(data);

    if (result) {
      await setResponseObject(req, true, "Spinner added successfully", result);
      next();
    } else {
      await setResponseObject(req, false, "Spinner not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all spinner setting*/
spinner.winListPublic = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let spinnerFilter = {};
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set to start of the day
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set to end of the day

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.spinner = {
        $regex: req.query.search.replace(new RegExp("\\\\", "g"), "\\\\"),
        $options: "i",
      };
    }

    let stateFilter = {};
    switch (req.query.stateId) {
      case "1":
        stateFilter.stateId = CONST.ACTIVE;
        break;
      case "2":
        stateFilter.stateId = CONST.INACTIVE;
        break;
      default:
        break;
    }
    spinnerFilter = {
      deviceToken: req.query.deviceToken,
    };
    const combinedMatchFilter = {
      ...searchFilter,
      ...stateFilter,
      ...spinnerFilter,
    };

    let list = await USER_SPINNER_MODEL.aggregate([
      {
        $match: {
          $and: [
            { deviceToken: req.query.deviceToken },
            { userId: { $eq: null } },
          ],
        },
      },
      { $match: combinedMatchFilter },
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
                arabicCompany: 1,
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
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
      { $sort: { _id: -1, isUsed: 1 } },
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
        "Rewards list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Rewards list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = spinner;
