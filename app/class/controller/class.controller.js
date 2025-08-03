/** 

@copyright : Mak tech solutions 
@author     : Md. shariar hosain sanny 

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CLASS_MODEL } = require("../model/class.model");
const {
  setResponseObject,
  validationData,
  capitalizeLetter,
} = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const _class = {};

/*Add class*/
_class.add = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    data.name = capitalizeLetter(data?.name)?.trim();
    data.arbicName = capitalizeLetter(data?.arbicName)?.trim();
    
    const isExists = await CLASS_MODEL.findOne({
      $and: [
        { name: validationData(data.name) },
        { stateId: { $ne: CONST.DELETED } },
      ],
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        "Class already exist with name"
      );
      next();
      return;
    }

    const result = await CLASS_MODEL.create(data);
    if (result) {
      await setResponseObject(
        req,
        true,
        "Class added successfully",
        result
      );
      next();
    } else {
      await setResponseObject(req, false, "Class not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all classes*/
_class.list = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          name: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\"),
            $options: "i",
          },
        },
        {
          arbicName: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\"),
            $options: "i",
          },
        },
      ];
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

    let list = await CLASS_MODEL.aggregate([
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
        },
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
          name: { $first: "$name" },
          arbicName: { $first: "$arbicName" },
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
              if: { $gt: ["$order", 0] },
              then: { $toInt: { $ifNull: ["$order", 0] } },
              else: Number.MAX_SAFE_INTEGER,
            },
          },
        },
      },
      {
        $sort: {
          sortKey: 1,
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
        "Class list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Class list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View class details*/
_class.detail = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let findPermision = await PERMISSION_MODEL.findOne({
      $or: [{ promotionId: req.userId }, { designedId: req.userId }],
    });
    if (findPermision) {
      let parsePermission = findPermision.rolesPrivileges;
    }
    
    const getSingle = await CLASS_MODEL.aggregate([
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
        "Class found successfully",
        getSingle[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Class not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update class*/
_class.update = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    data.name = capitalizeLetter(data?.name)?.trim();
    data.arbicName = capitalizeLetter(data?.arbicName)?.trim();

    const updateData = await CLASS_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    
    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Class updated successfully",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Class not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update class state*/
_class.updateState = async (req, res, next) => {
  try {
    const data = req.body;
    let filter = {};
    let resp;

    switch (data.stateId) {
      case CONST.ACTIVE:
      case 1:
        filter = {
          stateId: CONST.ACTIVE,
        };
        resp = "Class Active successfully";
        break;

      case CONST.INACTIVE:
      case 2:
        filter = {
          stateId: CONST.INACTIVE,
        };
        resp = "Class In-Active successfully";
        break;

      default:
        await setResponseObject(req, false, "Invalid state provided");
        next();
        return;
    }

    let updateState = await CLASS_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Class state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete class*/
_class.delete = async (req, res, next) => {
  try {
    const deleteData = await CLASS_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    
    if (deleteData) {
      await setResponseObject(req, true, "Class deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Class not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get active classes*/
_class.activeList = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          name: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        },
        {
          arbicName: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        },
      ];
    }

    let list = await CLASS_MODEL.aggregate([
      {
        $match: {
          stateId: { $eq: CONST.ACTIVE },
        },
      },
      {
        $match: searchFilter,
      },
      {
        $sort: {
          order: 1,
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
        "Class list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Class list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get dropdown class list*/
_class.dropDownClass = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          name: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        },
        {
          arbicName: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        },
      ];
    }

    let roleFilter = {};
    if (
      req.roleId == CONST.PROMOTION_USER ||
      req.roleId == CONST.DESIGNED_USER
    ) {
      roleFilter = {
        $and: [
          { stateId: { $ne: CONST.DELETED } },
          { createdBy: new mongoose.Types.ObjectId(req.userId) },
        ],
      };
    }

    let list = await CLASS_MODEL.aggregate([
      {
        $match: {
          stateId: { $eq: CONST.ACTIVE },
        },
      },
      {
        $match: roleFilter,
      },
      {
        $match: searchFilter,
      },
      {
        $addFields: {
          sortKey: {
            $cond: {
              if: { $gt: ["$order", 0] },
              then: { $toInt: { $ifNull: ["$order", 0] } },
              else: Number.MAX_SAFE_INTEGER,
            },
          },
        },
      },
      {
        $sort: {
          sortKey: 1,
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          name: {
            $cond: {
              if: { $eq: [language, "AR"] },
              then: {
                $ifNull: ["$arbicName", "$name"],
              },
              else: "$name",
            },
          },
          arbicName: 1,
          order: 1,
          stateId: 1,
          createdAt: 1,
        },
      },
    ]);

    if (list) {
      await setResponseObject(
        req,
        true,
        "Class list found successfully",
        list
      );
      next();
    } else {
      await setResponseObject(req, true, "Class list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get classes by classification*/
_class.getClassesByClassification = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    
    const classes = await CLASS_MODEL.aggregate([
      {
        $match: {
          classificationId: new mongoose.Types.ObjectId(req.params.classificationId),
          stateId: { $eq: CONST.ACTIVE },
        },
      },
      {
        $lookup: {
          from: "classifications",
          let: { id: { $ifNull: ["$classificationId", ""] } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: { $ne: CONST.DELETED },
              },
            },
            {
              $project: {
                _id: 1,
                name: {
                  $cond: {
                    if: { $eq: [language, "AR"] },
                    then: {
                      $ifNull: ["$arbicName", "$name"],
                    },
                    else: "$name",
                  },
                },
              },
            },
          ],
          as: "classification",
        },
      },
      {
        $unwind: { path: "$classification", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          name: {
            $cond: {
              if: { $eq: [language, "AR"] },
              then: {
                $ifNull: ["$arbicName", "$name"],
              },
              else: "$name",
            },
          },
          classification: 1,
          order: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { order: 1, createdAt: -1 },
      },
    ]);

    if (classes && classes.length > 0) {
      await setResponseObject(
        req,
        true,
        "Classes found successfully",
        classes
      );
      next();
    } else {
      await setResponseObject(req, true, "No classes found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = _class;