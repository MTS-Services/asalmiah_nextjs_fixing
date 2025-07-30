/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { DYNAMIC_LABELING } = require("../model/model");
const { CONST } = require("../../../helpers/constant");
const {
  setResponseObject,
  validationData,
  capitalizeLetter,
} = require("../../../middleware/commonFunction");
const { default: mongoose } = require("mongoose");
const { COMPANY_MODEL } = require("../../company/model/model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const dynamic = {};

/**
 * Add dynamic labeling api
 */
dynamic.add = async (req, res, next) => {
  try {
    const data = req.body;
    data.title = capitalizeLetter(data?.title)?.trim();
    data.arabicTitle = capitalizeLetter(data?.arabicTitle)?.trim();

    data.createdBy = req.userId;
    const isExist = await DYNAMIC_LABELING.findOne({
      title: validationData(data?.title),
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "This Dynamic labeling is already in existence."
      );
      next();
    } else {
      const saveLabeling = await DYNAMIC_LABELING.create(data);

      if (saveLabeling) {
        await setResponseObject(
          req,
          true,
          "Dynamic labeling added successfully",
          saveLabeling
        );
        next();
      } else {
        await setResponseObject(req, false, "Dynamic labeling not added");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Edit dynamic labeling api
 */
dynamic.edit = async (req, res, next) => {
  try {
    const data = req.body;
    data.updatedBy = req.userId;
    data.title = capitalizeLetter(data?.title)?.trim();
    data.arabicTitle = capitalizeLetter(data?.arabicTitle)?.trim();

    const isExist = await DYNAMIC_LABELING.findOne({
      _id: { $ne: req.params.id },
      title: validationData(data?.title),
    });
    if (isExist) {
      await setResponseObject(
        req,
        false,
        "Dynamic labeling is already in existence."
      );
      next();
      return;
    }

    const updateLabeling = await DYNAMIC_LABELING.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );

    if (updateLabeling) {
      await setResponseObject(
        req,
        true,
        "Dynamic labeling updated successfuly",
        updateLabeling
      );
      next();
    } else {
      await setResponseObject(req, false, "Dynamic labeling not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Get dynamic labeling list api
 */
dynamic.list = async (req, res, next) => {
  try {
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    let pageNo = parseInt(req.query.pageNo) || 1;
    let filter = {};

    switch (req.query.state) {
      case "1": // ACTIVE
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2": // INACTIVE
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        break;
    }

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

    const list = await DYNAMIC_LABELING.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: searchFilter,
      },
      {
        $match: filter,
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
          company: { $first: "$company" },
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
    if (list && list[0]?.data.length) {
      await setResponseObject(
        req,
        true,
        "Dynamic labeling found successfuly",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Dynamic labeling not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Dynamic labeling view api
 */
dynamic.details = async (req, res, next) => {
  try {
    const details = await DYNAMIC_LABELING.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { companyIds: { $ifNull: ["$company", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$companyIds"] }, // Check if the company's _id is in the companyIds array
              },
            },
            {
              $addFields: {
                index: {
                  $indexOfArray: ["$$companyIds", "$_id"], // Get the index of the company ID in the original array
                },
              },
            },
            {
              $sort: { index: 1 },
            },
          ],
          as: "company",
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

    if (details.length > 0) {
      await setResponseObject(
        req,
        true,
        "Dynamic labeling details found successfully",
        details[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Dynamic labeling details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Update dynamic labeling state id
 */
dynamic.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Dynamic labeling Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Dynamic labeling In-Active successfully";
        break;

      default:
    }

    let updateState;

    updateState = await DYNAMIC_LABELING.findByIdAndUpdate(
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
      await setResponseObject(req, false, "Dynamic labeling state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Delete dynamic labeling state id
 */
dynamic.delete = async (req, res, next) => {
  try {
    let deleteRes = await DYNAMIC_LABELING.findByIdAndDelete({
      _id: req.params.id,
    });
    if (deleteRes) {
      await setResponseObject(
        req,
        true,
        "Dynamic labeling deleted successfully",
        deleteRes
      );
      next();
    } else {
      await setResponseObject(req, false, "Dynamic labeling not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/**
 * Active dynamic labeling list
 */
dynamic.activeLabeling = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    const list = await DYNAMIC_LABELING.aggregate([
      {
        $match: { stateId: CONST.ACTIVE },
      },
      {
        $lookup: {
          from: "companies",
          let: { companyIds: { $ifNull: ["$company", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$companyIds"] }, // Check if the company's _id is in the companyIds array
              },
            },
            {
              $addFields: {
                index: {
                  $indexOfArray: ["$$companyIds", "$_id"], // Get the index of the company ID in the original array
                },
              },
            },
            {
              $sort: { index: 1 },
            },
            {
              $limit: 10,
            },
            {
              $lookup: {
                from: "branches",
                let: { companyId: "$_id" }, // foreign key for branches
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$companyId", "$companyId"] }, // match branches by company ID
                      stateId: CONST.ACTIVE, // filter for active branches
                    },
                  },
                ],
                as: "activeBranches", // name of the array containing active branches
              },
            },
            {
              $match: {
                $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // ensure there is at least one active branch
                stateId: CONST.ACTIVE, // Filter active companies
                country: country, // Filter by country
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
            {
              $lookup: {
                from: "wishlists",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$companyId"] },
                      createdBy: new mongoose.Types.ObjectId(req.userId),
                      isWishlist: true,
                    },
                  },
                ],
                as: "wishlist",
              },
            },
            {
              $addFields: {
                isWishlist: {
                  $cond: {
                    if: { $size: "$wishlist" },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $project: {
                _id: 1,
                arabicCompany: 1,
                arabicDescription: 1,
                company: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicCompany if language is Arabic
                    else: "$company", // Use company otherwise
                  },
                },
                description: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicDescription if language is Arabic
                    else: "$description", // Use description otherwise
                  },
                },
                couponService: 1,
                deliveryEligible: 1,
                deliveryService: 1,
                pickupService: 1,
                deliveryCompany: 1,
                costDelivery: 1,
                logo: 1,
                coverImg: 1,
                refNumber: 1,
                stateId: 1,
                order: 1,
                createdAt: 1,
                updatedAt: 1,
                commissionType: 1,
                paymentPeriod: 1,
                wishlist: 1,
                isWishlist: 1,
                createAt: 1,
                totalAverageRating: 1,
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $match: {
          $expr: {
            $ne: [{ $size: "$companyDetails" }, 0], // Ensure company is not an empty array
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicTitle", "$title"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$title", // If language is not 'AR', use category
            },
          },
          arabicTitle: 1,
          createdBy: 1,
          stateId: 1,
          company: "$companyDetails",
          order: 1,
          createAt: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          arabicTitle: { $first: "$arabicTitle" },
          createdBy: { $first: "$createdBy" },
          stateId: { $first: "$stateId" },
          company: { $first: "$company" },
          order: { $first: "$order" },
          createAt: { $first: "$createAt" },
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
    ]);

    if (list.length > 0) {
      await setResponseObject(
        req,
        true,
        "Dynamic labeling list found successfuly",
        list
      );
      next();
    } else {
      await setResponseObject(req, true, "Dynamic labeling list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * All dynamic labeling list
 */
dynamic.allLabeling = async (req, res, next) => {
  try {
    let language = req.headers["language"] ? req.headers["language"] : "EN";
    let country = req.headers["country"] ? req.headers["country"] : "Kuwait";

    let searchFilter = {};
    if (req.query.title && req.query.title !== "undefined") {
      searchFilter = {
        title: {
          $regex: req.query.title
            ? req.query.title.replace(new RegExp("\\\\", "g"), "\\\\")
            : "",
          $options: "i",
        },
      };
    }

    const list = await DYNAMIC_LABELING.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
        },
      },
      {
        $match: searchFilter,
      },
      {
        $lookup: {
          from: "companies",
          let: { companyIds: { $ifNull: ["$company", []] } }, // Default to empty array
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$companyIds"] }, // Check if the company's _id is in the companyIds array
                // stateId: CONST.ACTIVE,
                // country: country,
              },
            },
            {
              $addFields: {
                index: {
                  $indexOfArray: ["$$companyIds", "$_id"], // Get the index of the company ID in the original array
                },
              },
            },
            {
              $sort: { index: 1 },
            },
            {
              $lookup: {
                from: "branches",
                let: { companyId: "$_id" }, // foreign key for branches
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$companyId", "$companyId"] }, // match branches by company ID
                      // stateId: CONST.ACTIVE, // filter for active branches
                    },
                  },
                ],
                as: "activeBranches", // name of the array containing active branches
              },
            },
            {
              $match: {
                $expr: { $gt: [{ $size: "$activeBranches" }, 0] }, // ensure there is at least one active branch
                stateId: CONST.ACTIVE, // Filter active companies
                country: country, // Filter by country
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
            {
              $lookup: {
                from: "wishlists",
                let: { id: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$companyId"] },
                      createdBy: new mongoose.Types.ObjectId(req.userId),
                      isWishlist: true,
                    },
                  },
                ],
                as: "wishlist",
              },
            },
            {
              $addFields: {
                isWishlist: {
                  $cond: {
                    if: { $size: "$wishlist" },
                    then: true,
                    else: false,
                  },
                },
              },
            },
            {
              $project: {
                _id: 1,
                arabicCompany: 1,
                arabicDescription: 1,
                company: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arabicCompany", "$company"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicCompany if language is Arabic
                    else: "$company", // Use company otherwise
                  },
                },
                description: {
                  $cond: {
                    if: { $eq: [language, "AR"] }, // Check if the language is Arabic
                    then: {
                      $ifNull: ["$arabicDescription", "$description"], // Use arabicCategory if it exists, otherwise use category
                    }, // Use arabicDescription if language is Arabic
                    else: "$description", // Use description otherwise
                  },
                },
                couponService: 1,
                deliveryEligible: 1,
                deliveryService: 1,
                pickupService: 1,
                deliveryCompany: 1,
                costDelivery: 1,
                logo: 1,
                coverImg: 1,
                refNumber: 1,
                stateId: 1,
                order: 1,
                createdAt: 1,
                updatedAt: 1,
                commissionType: 1,
                paymentPeriod: 1,
                wishlist: 1,
                isWishlist: 1,
                createAt: 1,
                totalAverageRating: 1,
              },
            },
          ],
          as: "company",
        },
      },
      {
        $match: { company: { $exists: true } },
      },
      {
        $project: {
          _id: 1,
          title: {
            $cond: {
              if: { $eq: [language, "AR"] }, // Check if language is 'AR'
              then: {
                $ifNull: ["$arabicTitle", "$title"], // Use arabicCategory if it exists, otherwise use category
              },
              else: "$title", // If language is not 'AR', use category
            },
          },
          arabicTitle: 1,
          createdBy: 1,
          stateId: 1,
          company: "$company",
          order: 1,
          createAt: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          arabicTitle: { $first: "$arabicTitle" },
          createdBy: { $first: "$createdBy" },
          stateId: { $first: "$stateId" },
          company: { $first: "$company" },
          order: { $first: "$order" },
          createAt: { $first: "$createAt" },
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
    ]);

    if (list.length > 0) {
      await setResponseObject(
        req,
        true,
        "Dynamic labeling list found successfuly",
        list[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Dynamic labeling list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = dynamic;
