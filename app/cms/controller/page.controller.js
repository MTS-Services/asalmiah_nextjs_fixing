/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { PAGE_MODEL } = require("../model/page.model");
const {
  setResponseObject,
  validationData,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");

const logger = require("winston");
const multer = require("multer");
const fs = require("fs");
const dir = "../uploads/cms";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "image" }]);

module.exports = class cms_ {
  /*ADD CMS*/
  add = async (req, res, next) => {
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

        const isExists = await PAGE_MODEL.findOne({
          $and: [
            {
              $or: [
                { title: validationData(req.body.title) },
                { typeId: req?.body?.typeId },
              ],
            },
            { stateId: { $ne: CONST.DELETED } },
          ],
        });
        if (isExists) {
          await setResponseObject(req, false, "Cms Page already exist", "");
          next();
          return;
        }

        const data = req.body;
        data.title = data.title.trim();

        data.createdBy = req.userId;

        const findCms = await PAGE_MODEL.findOne({ _id: req.params.id });

        if (req.files?.image) {
          let img =
            process.env.IMAGE_BASE_URL +
            req.files?.image?.[0].path.replace(/\s+/g, "");
          data.image = img.replace(/\/\.\.\//g, "/");
        }

        const result = await PAGE_MODEL.create(data);
        if (result) {
          await setResponseObject(
            req,
            true,
            "Cms Page added successfully",
            result
          );
          next();
        } else {
          await setResponseObject(req, false, "Cms Page not added", "");
          next();
        }
      });
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL CMS*/
  list = async (req, res, next) => {
    try {
      let getList;

      getList = await PAGE_MODEL.aggregate([
        {
          $match: {
            stateId: { $ne: CONST.DELETED },
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
            title: { $first: "$title" },
            arabicTitle: { $first: "$arabicTitle" },
            description: { $first: "$description" },
            arabicDescription: { $first: "$arabicDescription" },
            typeId: { $first: "$typeId" },
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
      ]);
      if (getList.length > 0) {
        await setResponseObject(
          req,
          true,
          "Cms Pages found successfully",
          getList
        );
        next();
      } else {
        await setResponseObject(req, true, "Cms Pages not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE CMS*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await PAGE_MODEL.aggregate([
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
          "Cms Page details found",
          getSingle[0]
        );
        next();
      } else {
        await setResponseObject(req, false, "Cms Page details not found", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CMS*/
  update = async (req, res, next) => {
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

        const isExists = await PAGE_MODEL.findOne({
          _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
          typeId: req.body.typeId,
          title: validationData(req?.body?.title),
          stateId: { $ne: CONST.DELETED },
        });

        if (isExists) {
          await setResponseObject(req, false, ALREADY_EXISTS("Cms Page"), "");
          next();
          return;
        }

        const data = req.body;
        data.updatedBy = req.userId;
        data.title = data.title.trim();
        if (req.files?.image) {
          if (findUser?.image) {
            fs.stat(findUser.image, function (err, stat) {
              if (err == null) {
                fs.unlinkSync(findUser.image, async (err) => {
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
          let img =
            process.env.IMAGE_BASE_URL +
            req.files?.image?.[0].path.replace(/\s+/g, "");
          data.image = img.replace(/\/\.\.\//g, "/");
        }
        const updateData = await PAGE_MODEL.findByIdAndUpdate(
          { _id: req.params.id },
          data,
          { new: true }
        );
        if (updateData) {
          await setResponseObject(
            req,
            true,
            "Cms Page updated successfully",
            updateData,
            ""
          );
          next();
        } else {
          await setResponseObject(req, false, "Cms Page not updated", "");
          next();
        }
      });
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CMS STATE*/
  updateState = async (req, res, next) => {
    try {
      let filter = {};
      let resp;

      switch (req.query.stateId) {
        case "1":
          filter = {
            stateId: 1, // 1 => ACTIVE
          };
          resp = "Cms page Active successfully";
          break;

        case "2":
          filter = {
            stateId: 2, // 2 => INACTIVE
          };
          resp = "Cms page In-Active successfully";
          break;

        case "3":
          filter = {
            stateId: 3, // 3 => DELETED
          };
          resp = "Cms page Deleted successfully";
          break;
        default:
      }

      let updateState;

      updateState = await PAGE_MODEL.findByIdAndUpdate(
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
        await setResponseObject(req, false, "Cms page state not updated");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET BY TYPE CMS WITH ACTIVE STATE USER END API*/
  getByType = async (req, res, next) => {
    try {
      let language = req.headers["language"] ? req.headers["language"] : "EN";

      const getSingle = await PAGE_MODEL.aggregate([
        {
          $match: {
            typeId: parseInt(req.params.typeId),
          },
        },
        {
          $project: {
            _id: 1,
            title: {
              $cond: {
                if: { $eq: [language, "AR"] },
                then: { $ifNull: ["$arabicTitle", "$title"] },
                else: "$title",
              },
            },
            description: {
              $cond: {
                if: { $eq: [language, "AR"] },
                then: { $ifNull: ["$arabicDescription", "$description"] },
                else: "$description",
              },
            },
            arabicTitle: 1,
            arabicDescription: 1,
            typeId: 1,
            image: 1,
          },
        },
      ]);
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          "Cms Page found successfully",
          getSingle[0]
        );
        next();
      } else {
        await setResponseObject(req, true, "Cms Page not found ", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*DELETE CMS*/
  delete = async (req, res, next) => {
    try {
      const deleteData = await PAGE_MODEL.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(req, true, "Cms Page deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Cms Page not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
