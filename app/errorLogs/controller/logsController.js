/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let { CONST } = require("../../../helpers/constant");
const { Error_Logs, EMAIL_LOGS, Sms_Logs } = require("../model/logModal");
const { HTTP } = require("../../../helpers/http-status-code");
let { setResponseObject } = require("../../../middleware/commonFunction");
const { LOGIN_ACTIVITY } = require("../../userService/model/userLogModel");

module.exports.errorLogs_ = {
  /**
   * GET ERROR Error_Logs
   * @param {*} req
   */

  getLogs: async (req, res, next) => {
    try {
      let filter = {};
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;
      if (req.query.filter && req.query.filter !== "undefined") {
        filter = {
          $or: [
            {
              errorCode: {
                $regex: req.query.filter ? req.query.filter : "",
                $options: "i",
              },
            },
            {
              ip: {
                $regex: req.query.filter ? req.query.filter : "",
                $options: "i",
              },
            },
            {
              errorName: {
                $regex: req.query.filter ? req.query.filter : "",
                $options: "i",
              },
            },
          ],
        };
      }

      switch (req.query.role.toString()) {
        case "1":
          filter = {
            error_type: CONST.ERROR_TYPE.API,
          };

          break;

        case "2":
          filter = {
            error_type: CONST.ERROR_TYPE.APP,
          };
          break;
        case "3":
          filter = {
            error_type: CONST.ERROR_TYPE.WEB,
          };

          break;

        default:
      }

      let getErrorLogs = await Error_Logs.find(filter)
        .skip(pageLimit * (pageNo - CONST.PAGE_NO))
        .limit(pageLimit)
        .sort({ createdAt: -1 });

      let totalCount = await Error_Logs.countDocuments(filter);
      if (getErrorLogs.length > 0) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "Error logs found successfully",
          data: getErrorLogs,
          _meta: {
            totalCount,
            pageCount: Math.ceil(totalCount / parseInt(pageLimit)),
            pageNo,
            pageLimit,
          },
        });
      } else {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "Error logs not found",
          data: [],
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  logDetails: async (req, res, next) => {
    try {
      const details = await Error_Logs.findById({ _id: req.params.id });
      if (details) {
        await setResponseObject(
          req,
          true,
          "Error logs detail found successfully",
          details
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          NOT_FOUND("Error logs detail not found")
        );
        next();
      }
    } catch (err) {
      await setResponseObject(req, false, err.message, "");
      next();
    }
  },

  deleteAllErrorLog: async (req, res, next) => {
    try {
      let deleteErrorLog = await Error_Logs.deleteMany({});

      if (deleteErrorLog) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "All error logs deleted successfully",
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "All error logs not deleted",
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  deleteError: async (req, res, next) => {
    try {
      var result = await Error_Logs.findByIdAndDelete({
        _id: req.params.id,
      });

      if (result) {
        await setResponseObject(req, true, "Error logs deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Error logs not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};

module.exports._emailLogs = {
  /**
   * Get all email list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  emailList: async (req, res, next) => {
    try {
      let search = req.query.search;
      let state = req.query.stateId;
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit) || 10;

      let filter = {};
      switch (state) {
        case "1": // SUCCESS
          filter = {
            stateId: CONST.SUCCESS,
          };
          break;

        case "2": // FAILED
          filter = {
            stateId: CONST.FAILED,
          };
          break;
        default:
          break;
      }

      let searchFilter = {};
      if (search && search !== "undefined") {
        searchFilter = {
          $or: [
            {
              to: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              from: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const list = await EMAIL_LOGS.aggregate([
        {
          $match: searchFilter,
        },
        {
          $match: filter,
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
          "Email list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Email list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get email details
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  emailDetails: async (req, res, next) => {
    try {
      const emailDetails = await EMAIL_LOGS.findOne({
        _id: req.params.id,
      });
      if (emailDetails) {
        await setResponseObject(req, true, "Email details found", emailDetails);
        next();
      } else {
        await setResponseObject(req, true, "Email details not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete email list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteEmail: async (req, res, next) => {
    try {
      var result = await EMAIL_LOGS.findByIdAndDelete({
        _id: req.params.id,
      });

      if (result) {
        await setResponseObject(req, true, "Email queue deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Email log not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * Delete all email list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteAllEmail: async (req, res, next) => {
    try {
      var result = await EMAIL_LOGS.deleteMany({});
      if (result) {
        await setResponseObject(
          req,
          true,
          "All email queue deleted successfully"
        );
        next();
      } else {
        await setResponseObject(req, false, "Email logs not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};

module.exports._loginActivity = {
  /**
   * Get all login history list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  loginHistoryList: async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo || req.body.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

      const list = await LOGIN_ACTIVITY.aggregate([
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
          "Login history list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Login history list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete Login History
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteAllLoginHistory: async (req, res, next) => {
    try {
      var result = await LOGIN_ACTIVITY.deleteMany({});

      if (result) {
        await setResponseObject(
          req,
          true,
          "Login activity deleted successfully"
        );
        next();
      } else {
        await setResponseObject(req, false, "Login activity not deleted");
        next();
      }
    } catch (error) {
      res;
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * View login details api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  viewLoginDetails: async (req, res, next) => {
    try {
      const details = await LOGIN_ACTIVITY.findOne({
        _id: req.params.id,
      });
      if (details) {
        await setResponseObject(
          req,
          true,
          "Login history details found successfully",
          details
        );
        next();
      } else {
        await setResponseObject(req, false, "Login history details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete login history list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteLogs: async (req, res, next) => {
    try {
      var result = await LOGIN_ACTIVITY.findByIdAndDelete({
        _id: req.params.id,
      });

      if (result) {
        await setResponseObject(
          req,
          true,
          "Login history deleted successfully"
        );
        next();
      } else {
        await setResponseObject(req, false, "Login history not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};

module.exports._smsLogs = {
  /**
   * Get all login history list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  smsList: async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo || req.body.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

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
            to: {
              $regex: searchTerm,
              $options: "i",
            },
          },
          {
            from: {
              $regex: searchTerm,
              $options: "i",
            },
          },
        ];
      }

      const list = await Sms_Logs.aggregate([
        {
          $match: searchFilter,
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
          "Sms logs found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Sms logs not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete Login History
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteAllSms: async (req, res, next) => {
    try {
      var result = await Sms_Logs.deleteMany({});

      if (result) {
        await setResponseObject(req, true, "Sms logs deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Sms logs not deleted");
        next();
      }
    } catch (error) {
      res;
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },

  /**
   * View login details api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  viewSmsDetails: async (req, res, next) => {
    try {
      const details = await Sms_Logs.findOne({
        _id: req.params.id,
      });
      if (details) {
        await setResponseObject(
          req,
          true,
          "Sms logs details found successfully",
          details
        );
        next();
      } else {
        await setResponseObject(req, false, "Sms logs details not found");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete login history list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  deleteSms: async (req, res, next) => {
    try {
      var result = await Sms_Logs.findByIdAndDelete({
        _id: req.params.id,
      });

      if (result) {
        await setResponseObject(req, true, "Sms logs deleted successfully");
        next();
      } else {
        await setResponseObject(req, false, "Sms logs not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};
