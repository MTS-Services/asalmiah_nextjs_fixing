/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { OFFAR_MODEL } = require("../model/model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const logger = require("winston");
const offer = {};

const multer = require("multer");
const fs = require("fs");
const { title } = require("process");
const { USER } = require("../../userService/model/userModel");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const { COMPANY_MODEL } = require("../../company/model/model");
// const order = require("../../order/controller/order.controller");
const dir = "../uploads/category";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "image" }]);

/*Add offer*/
offer.add = async (req, res, next) => {
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

      const isExists = await OFFAR_MODEL.findOne({
        $and: [
          { title: req?.body?.title },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });

      if (isExists) {
        // // Remove the file from local storage
        // if (req?.files?.image) {
        //   fs.unlink(req?.files?.categoryImg[0]?.path, (err) => {
        //     if (err) {
        //       console.error("Error deleting file:", err);
        //     }
        //   });
        // }

        await setResponseObject(
          req,
          false,
          `Offer already exist with ${req?.body?.title}`
        );
        next();
        return;
      }

      const data = req.body;
      data.createdBy = req.userId;

      if (req?.files?.image) {
        data.image =
          process.env.IMAGE_BASE_URL +
          req.files?.image?.[0].path.replace(/\s+/g, "");
        data.image = data.image.replace(/\/\.\.\//g, "/");
      }

      if (req.roleId == CONST.PROMOTION_USER) {
        data.stateId = CONST.INACTIVE;
      }
      const result = await OFFAR_MODEL.create(data);
      if (result) {
        await setResponseObject(req, true, "Offer added successfully", result);
        next();
      } else {
        await setResponseObject(req, false, "Offer not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all offer*/
offer.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        title: {
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

    let roleFilter = {};
    if (req.roleId == CONST.USER || req.query.active == true) {
      roleFilter = {
        stateId: CONST.ACTIVE,
      };
    }

    if (req.roleId == CONST.ADMIN) {
      roleFilter = {
        stateId: { $ne: CONST.DELETED },
      };
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

    let list = await OFFAR_MODEL.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: roleFilter,
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
                fullName: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
          let: { id: "$updatedBy" },
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
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
        $match: searchFilter,
      },
      {
        $addFields: {
          sortKey: {
            $cond: {
              if: { $gt: ["$order", 0] }, // Check if 'order' exists and is greater than 0
              then: { $toInt: { $ifNull: ["$order", 0] } }, // Convert to integer safely
              else: Number.MAX_SAFE_INTEGER, // Assign a high value for sorting purposes
            },
          },
        },
      },
      {
        $sort: {
          sortKey: 1, // Sort by the new sortKey field first (ascending)
          createdAt: -1, // Then sort by createdAt in descending order
        },
      },
      {
        $group: {
          _id: "$_id", // Group by the unique identifier of the offer
          title: { $first: "$title" },
          arabicTitle: { $first: "$arabicTitle" },
          discount: { $first: "$discount" },
          image: { $first: "$image" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          stateId: { $first: "$stateId" },
          company: { $first: "$company" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          permission: { $first: "$permission" },
          sortKey: { $first: "$sortKey" },
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
        "Offer list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Offer list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View offer */
offer.detail = async (req, res, next) => {
  try {
    // const getSingle = await OFFAR_MODEL.findById({ _id: req.params.id })
    const getSingle = await OFFAR_MODEL.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
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
                fullName: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
          let: { id: "$updatedBy" },
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
                firstName: 1,
                lastName: 1,
                email: 1,
                countryCode: 1,
                mobile: 1,
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
    ]);

    if (getSingle) {
      await setResponseObject(
        req,
        true,
        "Offer details found successfully",
        getSingle[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Offer details not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update offer*/
offer.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    const isExists = await OFFAR_MODEL.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      title: req.body.title,
      stateId: { $ne: CONST.DELETED },
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        `Offer already exist with ${req.body.title}`
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
      const findOffer = await OFFAR_MODEL.findById({
        _id: new mongoose.Types.ObjectId(req.params.id),
      });
      if (req.files?.image) {
        if (findOffer?.image) {
          fs.stat(findOffer.image, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findOffer.image, async (err) => {
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
        data.image =
          process.env.IMAGE_BASE_URL +
          req.files?.image?.[0].path.replace(/\s+/g, "");
        data.image = data.image.replace(/\/\.\.\//g, "/");
      }
      const updateData = await OFFAR_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Offer updated successfully",
          updateData
        );
        next();
      } else {
        await setResponseObject(req, false, "Offer not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate offer state*/
offer.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Offer Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Offer In-Active successfully";
        break;

      default:
    }

    let updateState = await OFFAR_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Offer state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete offer*/
offer.delete = async (req, res, next) => {
  try {
    const deleteData = await OFFAR_MODEL.findByIdAndDelete(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Offer deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Offer not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active offer list*/
offer.activeOfferList = async (req, res, next) => {
  try {
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    const getSingle = await OFFAR_MODEL.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: ["$$id", "$_id"],
                    },
                  },
                  {
                    stateId: CONST.ACTIVE,
                  },
                  {
                    country: country,
                  },
                ],
              },
            },

            {
              $lookup: {
                from: "branches",
                let: { companyId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$companyId", "$companyId"] },
                      stateId: CONST.ACTIVE,
                    },
                  },
                ],
                as: "activeBranches",
              },
            },
            {
              $match: {
                $expr: { $gt: [{ $size: "$activeBranches" }, 0] },
              },
            },
            {
              $lookup: {
                from: "products",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$company"] },
                      stateId: CONST.ACTIVE,
                      quantity: { $gt: 0 },
                    },
                  },
                ],
                as: "products",
              },
            },
            {
              $match: { "products.0": { $exists: true } },
            },
          ],
          as: "companyDetails",
        },
      },
      // {
      //   $unwind:{path:"$companyDetails",preserveNullAndEmptyArrays:true}
      // },
      {
        $match: {
          $expr: {
            $ne: [{ $size: "$companyDetails" }, 0], // Ensure company is not an empty array
          },
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
          title: 1,
          arabicTitle: 1,
          discount: 1,
          image: 1,
          createdBy: 1,
          stateId: 1,
          company: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (getSingle) {
      await setResponseObject(
        req,
        true,
        "Offer list found successfully",
        getSingle
      );
      next();
    } else {
      await setResponseObject(req, true, "Offer list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = offer;
