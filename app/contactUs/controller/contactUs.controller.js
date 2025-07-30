/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const { CONTACTUS } = require("../model/contactUs.model");
const mongoose = require("mongoose");

const contact = {
  /**
   * Add contact
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  add: async (req, res, next) => {
    try {
      const data = req.body;

      // Capitalize the first letter of the first name
      if (data.firstName) {
        data.firstName =
          data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
      }

      // Capitalize the first letter of the first name
      if (data.lastName) {
        data.lastName =
          data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1);
      }

      // Create fullName with both first and last names capitalized
      data.fullName = data.firstName + " " + data.lastName;

      const saveContactUs = await CONTACTUS.create(data);
      if (saveContactUs) {
        await setResponseObject(
          req,
          true,
          "We have received your inquiry. We appreciate you for your interest in our services. Our team will get back to you soon."
        );
        next();
      } else {
        await setResponseObject(req, false, "Something went wrong");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get all contactus List
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  list: async (req, res, next) => {
    try {
      let search = req.query.search.trim();

      let state = req.query.stateId;
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit) || 10;

      let filter = {};
      switch (state) {
        case "1": // ACTIVE
          filter = {
            stateId: CONST.NEW,
          };
          break;

        case "2": // INACTIVE
          filter = {
            stateId: CONST.REPLIED,
          };
          break;

        default:
      }
      let searchFilter = {};
      if (search && search !== "undefined") {
        searchFilter = {
          $or: [
            {
              fullName: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              firstName: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const list = await CONTACTUS.aggregate([
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
          "Contactus list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Contactus list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get contactus details
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  view: async (req, res, next) => {
    try {
      const contactusDetails = await CONTACTUS.findOne({
        _id: req.params.id,
      });
      if (contactusDetails) {
        await setResponseObject(
          req,
          true,
          "Contactus details found successfully",
          contactusDetails
        );
        next();
      } else {
        await setResponseObject(req, false, "Contactus details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete contactus api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete: async (req, res, next) => {
    try {
      var result = await CONTACTUS.findByIdAndDelete({ _id: req.params.id });
      if (result) {
        await setResponseObject(req, true, "Contact us deleted");
        next();
      } else {
        await setResponseObject(req, false, "Contact us not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },
};

module.exports = contact;
