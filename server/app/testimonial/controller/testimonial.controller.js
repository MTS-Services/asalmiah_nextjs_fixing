/** 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
const nmongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { TESTIMONIAL } = require("../model/testimonial.model");

const multer = require("multer");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const dir = "../uploads/testimonial";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "profileImg" }]);

const testimonial = {};

/*Add testimonial api*/
testimonial.add = async (req, res, next) => {
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
      const payloadData = req.body;
      if (req.files?.profileImg) {
        let img =
          process.env.IMAGE_BASE_URL +
          req?.files?.profileImg?.[0].path.replace(/\s+/g, "");
        payloadData.profileImg = img.replace(/\/\.\.\//g, "/");
      }

      payloadData.createdBy = req?.userId;
      const result = await new TESTIMONIAL(payloadData).save();

      if (result) {
        await setResponseObject(
          req,
          true,
          "Testimonial added successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Testimonial not added");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*Edit testimonial api */
testimonial.edit = async (req, res, next) => {
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

      const payloadData = req.body;
      payloadData.updatedBy = req.userId;

      const exist = await TESTIMONIAL.findById({ _id: req.params.id });

      if (req.files?.profileImg) {
        if (exist?.profileImg) {
          fs.stat(exist.profileImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(exist.profileImg, async (err) => {
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
        payloadData.profileImg =
          process.env.IMAGE_BASE_URL +
          req.files?.profileImg?.[0].path.replace(/\s+/g, "");
        payloadData.profileImg = payloadData.profileImg.replace(
          /\/\.\.\//g,
          "/"
        );
      }

      const result = await TESTIMONIAL.findByIdAndUpdate(
        { _id: req.params.id },
        payloadData,
        { new: true }
      );
      if (result) {
        await setResponseObject(
          req,
          true,
          "Testimonial updated successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Testimonial not updated");
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*GET all testimonial api*/
testimonial.list = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;

    let filter = {};

    switch (req.query.stateId) {
      case "1": // ACTIVE
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;
      case "2": // INACTIVE
        filter = {
          stateId: CONST.INACTIVE,
        };
      default:
        break;
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        name: {
          $regex: req.query.search
            ? req.query.search
            : "".replace(new RegExp("\\\\", "g"), "\\\\"),
          $options: "i",
        },
      };
    }

    // let roleFilter = {};

    // if (
    //   req.roleId == CONST.PROMOTION_USER ||
    //   req.roleId == CONST.DESIGNED_USER
    // ) {
    //   roleFilter = {
    //     $and: [
    //       { stateId: { $ne: CONST.DELETED } },
    //       { createdBy: new mongoose.Types.ObjectId(req.userId) },
    //     ],
    //   };
    // }

    const list = await TESTIMONIAL.aggregate([
      // {
      //   $match: roleFilter,
      // },
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
        $match: filter,
      },
      {
        $match: searchFilter,
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          profileImg: { $first: "$profileImg" },
          description: { $first: "$description" },
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

    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        "Testimonial found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Testimonial not found successfully",
        []
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*View testimonial details*/
testimonial.details = async (req, res, next) => {
  try {
    let findSingle = await TESTIMONIAL.aggregate([
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
    if (findSingle.length > 0) {
      await setResponseObject(
        req,
        true,
        "Testimonial details found successfully",
        findSingle[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Testimonial not details found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*Delete  testimonial api*/
testimonial.delete = async (req, res, next) => {
  try {
    let deleteData = await TESTIMONIAL.findOneAndDelete({ _id: req.params.id });
    if (deleteData) {
      await setResponseObject(req, true, "Testimonial deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Testimonial not deleted", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*Change testimonial state*/
testimonial.changeState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Testimonial Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Testimonial In-Active successfully";
        break;
      default:
    }

    let updateState;

    updateState = await TESTIMONIAL.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      {
        $set: filter,
      },
      {
        new: true,
      }
    );

    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Testimonial state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*Active testimonial list*/
testimonial.activeTestimonialList = async (req, res, next) => {
  try {
    const getSingle = await TESTIMONIAL.find({ stateId: CONST.ACTIVE });
    if (getSingle) {
      await setResponseObject(
        req,
        true,
        "Testimonial list found successfully",
        getSingle
      );
      next();
    } else {
      await setResponseObject(req, true, "Testimonial list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = testimonial;
