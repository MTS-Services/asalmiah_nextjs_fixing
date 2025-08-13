/**
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Ozvid Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const { BANNER } = require("../model/banner.Model");
let multer = require("multer");
const dir = "../uploads/banner";
let fs = require("fs");
const mongoose = require("mongoose");
const logger = require("winston");
const { COMPANY_MODEL } = require("../../company/model/model");
const { PERMISSION_MODEL } = require("../../permission/model/model");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

let banner = {};

const upload = multer({ storage }).fields([{ name: "bannerImg" }]);

/**
 * Add banner
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.add = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      let bannerExists = await BANNER.findOne({
        title: req.body.title,
        stateId: { $ne: CONST.DELETED },
      });

      if (bannerExists) {
        // // Remove the file from local storage
        // if (req?.files?.bannerImg) {
        //   fs.unlink(req.files.bannerImg[0].path, (err) => {
        //     if (err) {
        //       console.error("Error deleting file:", err);
        //     }
        //   });
        // }

        await setResponseObject(
          req,
          false,
          "Banner already exist with this title"
        );
        next();
        return;
      }

      if (err) {
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        let data = req.body;
        data.createdBy = req.userId;

        if (req?.files?.bannerImg) {
          data.bannerImg =
            process.env.IMAGE_BASE_URL +
            req.files?.bannerImg?.[0].path.replace(/\s+/g, "");
          const updatedUrl = data.bannerImg.replace(/\/\.\.\//g, "/");
          data.bannerImg = updatedUrl;
        }

        let saveBanner = await BANNER.create(data);
        if (!saveBanner) {
          await setResponseObject(req, false, "Banner not created");
          next();
        } else {
          await setResponseObject(req, true, "Banner created", saveBanner);
          next();
        }
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Banner list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
      );

      searchFilter.$or = [
        {
          title: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let filterState = {};
    switch (req.query.stateId) {
      case "1":
        filterState = {
          stateId: CONST.ACTIVE,
        };
        break;
      case "2":
        filterState = {
          stateId: CONST.INACTIVE,
        };
        break;
      default:
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

    let list = await BANNER.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: filterState,
      },
      {
        $match: searchFilter,
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
          description: { $first: "$description" },
          bannerImg: { $first: "$bannerImg" },
          productId: { $first: "$productId" },
          order: { $first: "$order" },
          stateId: { $first: "$stateId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          permission: { $first: "$permission" },
        },
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
        "Banner list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Banner list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Banner details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.details = async (req, res, next) => {
  try {
    let bannerDetails = await BANNER.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
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
          from: "products",
          let: { id: { $ifNull: ["$productId", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$id"] }, // Use $$id safely
              },
            },
            {
              $project: {
                _id: 1,
                productName: 1,
              },
            },
          ],
          as: "productId",
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

    if (bannerDetails.length > 0) {
      await setResponseObject(
        req,
        true,
        "Banner details found successfully",
        bannerDetails[0]
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Banner details not found successfully"
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, true, error.message, "");
    next();
  }
};

/**
 * Update banner
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.update = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    const isExists = await BANNER.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      title: req.body.title,
      stateId: { $ne: CONST.DELETED },
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        "Banner already exist with this title"
      );
      next();
      return;
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err.message, "");
        next();
      } else {
        let data = req.body;
        data.updatedBy = req.userId;

        let findBanner = await BANNER.findOne({
          _id: req.params.id,
        });

        // Handle banner image upload
        if (req.files?.bannerImg) {
          if (findBanner?.bannerImg) {
            fs.stat(findBanner.bannerImg, function (err, stat) {
              if (err == null) {
                fs.unlinkSync(findBanner.bannerImg, (err) => {
                  if (err) {
                    logger.warn(`error ${err}`);
                  } else {
                    logger.warn(`file was deleted`);
                  }
                });
              } else if (err.code == "ENOENT") {
                logger.warn(`file does not exist`);
                return;
              }
            });
          }
          data.bannerImg =
            process.env.IMAGE_BASE_URL +
            req.files?.bannerImg?.[0].path.replace(/\s+/g, "");
          const updatedUrl = data.bannerImg.replace(/\/\.\.\//g, "/");
          data.bannerImg = updatedUrl;
        }

        // Handle order field
        if (data.order === "undefined" || data.order === "null") {
          data.order = null;
        }

        // Set company and productId to undefined if they are not in data
        if (!data.company) {
          await BANNER.findByIdAndUpdate(
            { _id: req.params.id },
            { $unset: { company: "" } },
            {
              new: true,
            }
          );
        }

        if (!data.productId || data.productId.length === 0) {
          await BANNER.findByIdAndUpdate(
            { _id: req.params.id },
            { $unset: { productId: "" } },
            {
              new: true,
            }
          );
        }

        // Update the banner
        let updateBanner = await BANNER.findByIdAndUpdate(
          { _id: req.params.id },
          data,
          { new: true }
        );
        if (!updateBanner) {
          await setResponseObject(req, false, "Banner not updated");
          next();
        } else {
          await setResponseObject(
            req,
            true,
            "Banner updated successfully",
            updateBanner
          );
          next();
        }
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Update banner stateId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.updateState = async (req, res, next) => {
  try {
    let updateObj = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        updateObj = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Banner Active Successfully";
        break;

      case "2":
        updateObj = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Banner In-Active Successfully";
        break;
      default:
    }

    let updateState = await BANNER.findByIdAndUpdate(
      { _id: req.params.id },
      updateObj,
      {
        new: true,
      }
    );
    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Banner state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete banner
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.delete = async (req, res, next) => {
  try {
    let bannerCheck = await BANNER.findOne({ _id: req.params.id });
    if (bannerCheck) {
      let update = await BANNER.findByIdAndUpdate(
        { _id: req.params.id },
        { stateId: 2 },
        { new: true }
      );
      if (update) {
        await setResponseObject(req, true, "Banner deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Banner not deleted");
        next();
      }
    } else {
      await setResponseObject(req, false, "Banner not exit");
      next();
    }
  } catch (err) {
    await setResponseObject(req, false, err.message);
    next();
  }
};

/**
 * Active banner
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
banner.activeBanner = async (req, res, next) => {
  try {

    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let list = await BANNER.aggregate([
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
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: 1,
                stateId: 1,
                country: 1,
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
        $match: {
          $or: [
            { company: { $exists: false } },
            {
              "companyDetails.stateId": CONST.ACTIVE,
              "companyDetails.country": country,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: "$productId" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", { $ifNull: ["$$id", []] }] },
                stateId: CONST.ACTIVE,
              },
            },
            {
              $project: {
                _id: 1,
                productName: 1,
              },
            },
          ],
          as: "productId",
        },
      },
      {
        $sort: {
          order: 1,
        },
      },
    ]);

    if (list.length > 0) {
      await setResponseObject(
        req,
        true,
        "Banner list found successfully",
        list
      );
      next();
    } else {
      await setResponseObject(req, true, "Banner list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = banner;
