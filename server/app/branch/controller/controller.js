/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { BRANCH_MODEL } = require("../model/model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const {
  createBranch,
  updateBranch,
  deleteBranch,
} = require("../../../helpers/armadaApis");
const { COMPANY_MODEL } = require("../../company/model/model");
const permission = require("../../permission/controller/controller");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const branch = {};

/*Add branch*/
branch.add = async (req, res, next) => {
  try {
    const data = req.body;
    const isExists = await BRANCH_MODEL.findOne({
      $and: [
        { area: req?.body?.area },
        { stateId: { $ne: CONST.DELETED } },
        { companyId: req?.body?.companyId },
        { email: data.email },
        { branchName: data.branchName },
      ],
    });

    if (isExists) {
      await setResponseObject(req, false, `Branch already exist`);
      next();
      return;
    }
    data.workingHours = data.workingHours;
    data.createdBy = req.userId;

    const findCompany = await COMPANY_MODEL.findOne({
      _id: req?.body?.companyId,
    });

    if (data.longitude && data.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    let createBranchData = {
      name: findCompany?.actualCompanyName
        ? findCompany?.actualCompanyName + " - " + data.branchName
        : data.branchName,
      phone: data.CountryCode + data.deliveryWhatsUpNo,
      latitude: data?.latitude ? data?.latitude : 29.3342601,
      longitude: data?.longitude ? data?.longitude : 47.6731978,
      address: data.area,
    };

    let branchData = await createBranch(createBranchData);
    data.branchKey = branchData?.key;
    data.branchId = branchData?._id;

    const result = await BRANCH_MODEL.create(data);

    if (result) {
      await setResponseObject(req, true, "Branch added successfully", result);
      next();
    } else {
      await setResponseObject(req, false, "Branch not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Get all branch*/
branch.list = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

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

    if (req.roleId == CONST.SALES) {
      roleFilter = {
        $and: [
          { stateId: { $ne: CONST.DELETED } },
          { createdBy: new mongoose.Types.ObjectId(req.userId) },
        ],
      };
    }

    let searchFilter = {};

    if (req.query.search && req.query.search !== "undefined") {
      // Function to escape special regex characters
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
      );

      searchFilter.$or = [
        {
          branchName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          arabicBranchName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          deliveryEmail: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          area: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  { $toString: "$CountryCode" },
                  { $toString: "$deliveryWhatsUpNo" },
                ],
              },
              regex: searchTerm,
              options: "i",
            },
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

    let companyFilter = [];
    if (req.query.companyArr) {
      companyFilter.push({
        $match: {
          companyId: {
            $in: req.query.companyArr
              .split(",")
              .map((i) => new mongoose.Types.ObjectId(i)),
          }, // Using the array directly
        },
      });
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
          companyId: { $in: companyIds }, // ✅ Use $in here
        };
      }
    }

    let list = await BRANCH_MODEL.aggregate([
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
          from: "companies",
          let: { id: "$companyId" },
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
          as: "companyDetails",
        },
      },
      {
        $unwind: { path: "$companyDetails", preserveNullAndEmptyArrays: true },
      },
      ...companyFilter,
      {
        $project: {
          _id: 1,
          branchName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicBranchName", "$branchName"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$branchName", // Use company otherwise
            },
          },
          arabicBranchName: 1,
          location: 1,
          area: 1,
          isDeliveryPoint: 1,
          isCouponBranch: 1,
          CountryCode: 1,
          deliveryWhatsUpNo: 1,
          costDelivery: 1,
          deliveryEmail: 1,
          branchKey: 1,
          branchId: 1,
          companyId: 1,
          workingHours: 1,
          createdBy: 1,
          stateId: 1,
          companyDetails: 1,
          createdAt: 1,
          updatedBy: 1,
          // permission: 1,
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
        "Branch list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Branch list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*View branch */
branch.detail = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    const getSingle = await BRANCH_MODEL.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$companyId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "companyId",
        },
      },
      {
        $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true },
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
        $project: {
          _id: 1,
          branchName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicBranchName", "$branchName"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$branchName", // Use company otherwise
            },
          },
          arabicBranchName: 1,
          location: 1,
          area: 1,
          isDeliveryPoint: 1,
          isCouponBranch: 1,
          CountryCode: 1,
          deliveryWhatsUpNo: 1,
          costDelivery: 1,
          deliveryEmail: 1,
          branchKey: 1,
          branchId: 1,
          companyId: 1,
          workingHours: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: 1,
          updatedBy: 1,
          stateId: 1,
        },
      },
    ]);

    if (getSingle.length > 0) {
      await setResponseObject(req, true, "Branch details found", getSingle[0]);
      next();
    } else {
      await setResponseObject(req, false, "Branch details not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update branch*/
branch.update = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    const isExists = await BRANCH_MODEL.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      area: req?.body?.area,
      stateId: { $ne: CONST.DELETED },
      companyId: req?.body?.companyId,
      email: data.email,
    });

    if (isExists) {
      await setResponseObject(
        req,
        false,
        `Branch already exist with ${req?.body?.area}`
      );
      next();
      return;
    }
    data.workingHours = data?.workingHours;

    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    const updateData = await BRANCH_MODEL.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );

    const findCompany = await COMPANY_MODEL.findOne({
      _id: updateData.companyId,
    });

    if (updateData) {
      let createBranchData = {
        name: findCompany?.actualCompanyName
          ? findCompany?.actualCompanyName + " - " + data.branchName
          : data.branchName,
        phone: updateData?.CountryCode + updateData?.deliveryWhatsUpNo,
        latitude: data?.latitude ? data?.latitude : 29.3342601,
        longitude: data?.longitude ? data?.longitude : 47.6731978,
        address: updateData?.area,
        branchKey: updateData?.branchKey,
        branchId: updateData?.branchId,
      };

      let branchData = await updateBranch(createBranchData);

      await setResponseObject(
        req,
        true,
        "Branch updated successfully",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Branch not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Udate branch state*/
branch.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Branch Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Branch In-Active successfully";
        break;

      default:
    }

    let updateState = await BRANCH_MODEL.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Branch state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Delete branch*/
branch.delete = async (req, res, next) => {
  try {
    const deleteData = await BRANCH_MODEL.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      let branchData = await deleteBranch(
        deleteData?.branchId,
        deleteData?.branchKey
      );
      await setResponseObject(req, true, "Branch deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Branch not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Branch by filter*/
branch.companyFilter = async (req, res, next) => {
  try {
    const list = await BRANCH_MODEL.find({
      companyId: req.query.companyId,
      stateId: CONST.ACTIVE,
    });
    if (list) {
      await setResponseObject(req, true, "", list);
      next();
    } else {
      await setResponseObject(req, false, "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Branch by filter*/
branch.branchByCompany = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";

    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    const list = await BRANCH_MODEL.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(req.query.companyId),
        },
      },
      {
        $lookup: {
          from: "products",
          let: { id: new mongoose.Types.ObjectId(req.query.productId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$_id"],
                },
              },
            },
          ],
          as: "productDetails",
        },
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$companyId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
            {
              $project: {
                _id: -1,
                company: 1,
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
          stateId: CONST.ACTIVE,
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
          branchName: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if the language is Arabic
              then: {
                $ifNull: ["$arabicBranchName", "$branchName"], // Use arabicCategory if it exists, otherwise use category
              }, // Use arabicCompany if language is Arabic
              else: "$branchName", // Use company otherwise
            },
          },
          arabicBranchName: 1,
          location: 1,
          area: 1,
          isDeliveryPoint: 1,
          isCouponBranch: 1,
          costDelivery: 1,
          companyId: 1,
          workingHours: 1,
          createdBy: 1,
          stateId: 1,
          products: 1,
          CountryCode: 1,
          deliveryWhatsUpNo: 1,
          deliveryEmail: 1,
          companyId: 1,
          companyDetails: 1,
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
        "Branch list found successfully",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Branch list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = branch;
