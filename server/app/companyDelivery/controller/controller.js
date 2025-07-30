/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { DELIVERY_COMPANY } = require("../model/model");
const {
  setResponseObject,
  validationData,
  capitalizeLetter,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const logger = require("winston");
const delivery = {};
const { PERMISSION_MODEL } = require("../../permission/model/model");


const multer = require("multer");
const fs = require("fs");
const { COMPANY_MODEL } = require("../../company/model/model");
const dir = "../uploads/deliverycompany";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "logo" }]);

/*Add delivery company*/
delivery.add = async (req, res, next) => {
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

      const isExists = await DELIVERY_COMPANY.findOne({
        $and: [
          { company: validationData(req?.body?.company) },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        await setResponseObject(
          req,
          false,
          `Delivery company already exist with ${req?.body?.company}`
        );
        next();
        return;
      }

      const data = req.body;
      data.company = capitalizeLetter(data?.company).trim();
      if (data.longitude && data.latitude) {
        data.location = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
      }

      data.createdBy = req.userId;

      if (req?.files?.logo) {
        data.logo =
          process.env.IMAGE_BASE_URL +
          req.files?.logo?.[0].path.replace(/\s+/g, "");
        data.logo = data.logo.replace(/\/\.\.\//g, "/");
      }
      const result = await DELIVERY_COMPANY.create(data);

      if (result) {
        await setResponseObject(
          req,
          true,
          "Delivery company added successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Delivery company not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all delivery company*/
delivery.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let roleFilter = {};
    if (req.roleId == CONST.USER) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
    }

    if (req.query.active == true) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        company: {
          $regex: req.query.search.trim()
            ? req.query.search.trim()
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
        let companyIds = companies.map((company) => company._id);

        categoryFilter = {
          company: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    let list = await DELIVERY_COMPANY.aggregate([
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
        $group: {
          _id: "$_id",
          company: { $first: "$company" },
          arabicCompany: { $first: "$arabicCompany" },
          country: { $first: "$country" },
          email: { $first: "$email" },
          mobile: { $first: "$mobile" },
          description: { $first: "$description" },
          arabicDescription: { $first: "$arabicDescription" },
          registration: { $first: "$registration" },
          arabicRegistration: { $first: "$arabicRegistration" },
          startTime: { $first: "$startTime" },
          endTime: { $first: "$endTime" },
          address: { $first: "$address" },
          contactPersonName: { $first: "$contactPersonName" },
          arabicContactPersonName: { $first: "$arabicContactPersonName" },
          contactPersonMobile: { $first: "$contactPersonMobile" },
          active: { $first: "$active" },
          costDeliveryOffrat: { $first: "$costDeliveryOffrat" },
          costDeliveryCustomer: { $first: "$costDeliveryCustomer" },
          companyCode: { $first: "$companyCode" },
          default: { $first: "$default" },
          logo: { $first: "$logo" },
          location: { $first: "$location" },
          stateId: { $first: "$stateId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          permission: { $first: "$permission" },
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
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Delivery company list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Delivery company list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View delivery company */
delivery.detail = async (req, res, next) => {
  try {
    const getSingle = await DELIVERY_COMPANY.aggregate([
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
        "Delivery company details found",
        getSingle[0]
      );
      next();
    } else {
      await setResponseObject(
        req,
        false,
        "Delivery company details not found",
        ""
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update delivery company*/
delivery.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    const isExists = await DELIVERY_COMPANY.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      company: validationData(req?.body?.company),
      stateId: { $ne: CONST.DELETED },
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        `Delivery company already exist with ${req?.body?.company}`
      );
      next();
      return;
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }
      const data = req.body;
      data.updatedBy = req.userId;
      data.company = capitalizeLetter(data?.company).trim();

      if (data.longitude && data.latitude) {
        data.location = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
      }

      const findCompany = await DELIVERY_COMPANY.findById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (req.files?.logo) {
        if (findCompany?.logo) {
          fs.stat(findCompany.logo, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findCompany.logo, async (err) => {
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
        data.logo =
          process.env.IMAGE_BASE_URL +
          req.files?.logo?.[0].path.replace(/\s+/g, "");
        data.logo = data.logo.replace(/\/\.\.\//g, "/");
      }
      const updateData = await DELIVERY_COMPANY.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Delivery company updated successfully",
          updateData
        );
        next();
      } else {
        await setResponseObject(req, false, "Delivery company not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate delivery company state*/
delivery.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Delivery company Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Delivery company In-Active successfully";
        break;

      default:
    }

    let updateState = await DELIVERY_COMPANY.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Delivery company state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete delivery company*/
delivery.delete = async (req, res, next) => {
  try {
    const deleteData = await DELIVERY_COMPANY.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(
        req,
        true,
        "Delivery company deleted successfully"
      );
      next();
    } else {
      await setResponseObject(req, false, "Delivery company not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = delivery;
