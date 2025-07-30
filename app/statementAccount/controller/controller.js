/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
let { STATEMENT_ACCOUNT, STATEMENT_TRANSACTION } = require("../model/model");
const {
  formatNumber,
  generateOTP,
} = require("../../../middleware/commonFunction");
const ExcelJS = require("exceljs");
const moment = require("moment");
const { COMPANY_MODEL } = require("../../company/model/model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
let statementAccount = {};

/**
 * Add statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.add = async (req, res, next) => {
  try {
    let data = req.body;
    data.createdBy = req.userId;

    if (
      data.IBAN == "" &&
      data.accountNumber == "" &&
      data.accountantName == "" &&
      data.accountantTelephone == "+965" &&
      data.bankCode == "" &&
      data.bankName == "" &&
      data.beneficiaryName == "" &&
      data.branchName == "" &&
      data.chequeCompany == "" &&
      data.flexiblePrice == false &&
      data.linkTelephoneNumber == "+965" &&
      data.paymentMethod == "" &&
      data.paymentPeriod == "" &&
      data.swiftCode == ""
    ) {
      await setResponseObject(req, false, "Please fill some information.");
      next();
      return;
    }

    let createData = await STATEMENT_ACCOUNT.create(data);

    if (createData) {
      await setResponseObject(
        req,
        true,
        "Statement account created successfully.",
        createData
      );
      next();
    } else {
      await setResponseObject(req, false, "Statement account not created.");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Get all statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.list = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

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

    let accountFilter = {};
    switch (req.query.accountType) {
      case "1":
        accountFilter = {
          accountType: CONST.PERCENTAGE,
        };
        break;
      case "2":
        accountFilter = {
          accountType: CONST.FIX_AMOUNT,
        };
        break;
      default:
    }

    let methodFilter = {};
    switch (req.query.paymentMethod) {
      case "1":
        accountFilter = {
          paymentMethod: CONST.CHEQUE,
        };
        break;
      case "2":
        accountFilter = {
          paymentMethod: CONST.BANK_TRANSFER,
        };
        break;

      case "3":
        accountFilter = {
          paymentMethod: CONST.LINK,
        };
        break;

      case "4":
        accountFilter = {
          paymentMethod: CONST.ONLINE_TRANSFER,
        };
        break;

      case "5":
        accountFilter = {
          paymentMethod: CONST.ADVANCE,
        };
        break;

      case "6":
        accountFilter = {
          paymentMethod: CONST.PAYPAL,
        };
        break;
      default:
    }

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter.$or = [
        {
          accountantName: {
            $regex: req.query.search.trim()
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\").trim()
              : "",
            $options: "i",
          },
        },
        {
          chequeCompany: {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
            $options: "i",
          },
        },
        {
          "companyDetails.company": {
            $regex: req.query.search
              ? req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
              : "",
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
    
    let list = await STATEMENT_ACCOUNT.aggregate([
      {
        $match: categoryFilter,
      },
      {
        $match: filterState,
      },
      {
        $match: accountFilter,
      },
      {
        $match: methodFilter,
      },
      {
        $sort: {
          createdAt: -1,
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
                company: 1,
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: {
          path: "$companyDetails",
          preserveNullAndEmptyArrays: true,
        },
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
        "Statement account created successfully.",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Statement account not created.", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Get statement account details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.details = async (req, res, next) => {
  try {
    let details = await STATEMENT_ACCOUNT.aggregate([
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
                company: 1,
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: {
          path: "$companyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    if (details) {
      await setResponseObject(
        req,
        true,
        "Statement account details found successfully.",
        details[0]
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Statement account details not found."
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Add statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.update = async (req, res, next) => {
  try {
    let data = req.body;
    data.updatedBy = req.userId;
    if (
      data.IBAN == "" &&
      data.accountNumber == "" &&
      data.accountantName == "" &&
      data.accountantTelephone == "+965" &&
      data.bankCode == "" &&
      data.bankName == "" &&
      data.beneficiaryName == "" &&
      data.branchName == "" &&
      data.chequeCompany == "" &&
      data.flexiblePrice == false &&
      data.linkTelephoneNumber == "+965" &&
      data.paymentMethod == "" &&
      data.paymentPeriod == "" &&
      data.swiftCode == ""
    ) {
      await setResponseObject(req, false, "Please fill some information.");
      next();
      return;
    }

    let updateData = await STATEMENT_ACCOUNT.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      data,
      { new: true }
    );

    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Statement account updated successfully.",
        updateData
      );
      next();
    } else {
      await setResponseObject(req, false, "Statement account not updated.");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Update statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.updateState = async (req, res, next) => {
  try {
    let updateObj = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        updateObj = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Statement account Active Successfully";
        break;

      case "2":
        updateObj = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Statement account In-Active Successfully";
        break;
      default:
    }

    let updateState = await STATEMENT_ACCOUNT.findByIdAndUpdate(
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
      await setResponseObject(
        req,
        false,
        "Statement account state not updated"
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Delete statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.delete = async (req, res, next) => {
  try {
    let update = await STATEMENT_ACCOUNT.findByIdAndDelete({
      _id: req.params.id,
    });

    if (update) {
      await setResponseObject(
        req,
        true,
        "Statement account deleted successfully"
      );
      next();
    } else {
      await setResponseObject(req, false, "Statement account not deleted");
      next();
    }
  } catch (err) {
    await setResponseObject(req, false, err.message);
    next();
  }
};

/*********************************************STATEMENT TRANSACTION API******************************************/

/**
 * Get all statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.statementTransaction = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let filter = [];
    let companyFilter = {};

    if (req.query.startDate && req.query.endDate) {
      const startDateString = new Date(req.query.startDate);

      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          date: {
            $gte: startDateString,
            $lte: endDateString,
          },
        },
      });
    } else if (req.query.startDate) {
      const startDateString = new Date(req.query.startDate);

      filter.push({
        $match: {
          date: {
            $gte: startDateString,
          },
        },
      });
    } else if (req.query.endDate) {
      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          date: {
            $lte: endDateString,
          },
        },
      });
    }

    if (req.query.company) {
      filter.push({
        $match: {
          company: new mongoose.Types.ObjectId(req.query.company),
        },
      });
      companyFilter = {
        $match: {
          company: new mongoose.Types.ObjectId(req.query.company),
        },
      };
    }

    let accountFilter = {};
    switch (req.query.accountType) {
      case "1":
        accountFilter = {
          accountType: CONST.PERCENTAGE,
        };
        break;
      case "2":
        accountFilter = {
          accountType: CONST.FIX_AMOUNT,
        };
        break;
      default:
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

    let list = await STATEMENT_TRANSACTION.aggregate([
      {
        $match: roleFilter,
      },
      {
        $match: accountFilter,
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

      ...filter,
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    const startDateString = new Date(req.query.startDate);
    // Check if the date is valid
    if (isNaN(startDateString.getTime())) {
      return res.status(400).send("Invalid start date format");
    }
    let openningbalence = await STATEMENT_TRANSACTION.aggregate([
      {
        $match: {
          date: {
            $lt: startDateString,
          },
        },
      },
      companyFilter,
    ])
      .sort({ date: -1 })
      .limit(1);
    // Ensure the balance property exists
    let balence = {
      openningBalence:
        openningbalence.length > 0 ? openningbalence[0]?.balance : 0,
    };

    // Get the last record from the data array
    const lastRecord = list[0].data[list[0].data.length - 1];

    const closingBalence = {
      closingBalence:
        lastRecord && lastRecord.balance !== null ? lastRecord.balance : 0,
    };

    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Statement account found successfully.",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit,
        balence,
        closingBalence
      );
      next();
      return;
    } else {
      await setResponseObject(req, true, "Statement account not found.", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Get statement account details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.viewStatementTransaction = async (req, res, next) => {
  try {
    let details = await STATEMENT_TRANSACTION.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$createdBy" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$id"] },
              },
            },
            {
              $project: {
                _id: 1,
                email: 1,
                fullName: 1,
                firstName: 1,
                lastName: 1,
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
                company: 1,
              },
            },
          ],
          as: "companyDetails",
        },
      },
      {
        $unwind: {
          path: "$companyDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    if (details) {
      await setResponseObject(
        req,
        true,
        "Statement account transaction details found successfully.",
        details[0]
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Statement account transaction details not found."
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Add statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.updateStatementTransaction = async (req, res, next) => {
  try {
    let data = req.body;
    data.updatedBy = req.userId;
    let findTransaction = await STATEMENT_TRANSACTION.findOne({
      _id: req.params.id,
    });
    let isExist = await STATEMENT_TRANSACTION.findOne({
      company: findTransaction.company,
      createdAt: { $lt: findTransaction.createdAt },
    }).sort({ createdAt: -1 });

    if (!findTransaction) {
      await setResponseObject(req, false, "Transaction not found.");
      return next();
    }

    // Ensure balance is a number
    let currentBalance = formatNumber(findTransaction.balance);
    if (isNaN(currentBalance)) {
      await setResponseObject(
        req,
        false,
        "Current balance is not a valid number."
      );
      next();
    }

    let invoiceTransaction;
    if (data.amountDr) {
      let amountDr = formatNumber(data.amountDr);
      if (isNaN(amountDr)) {
        await setResponseObject(req, false, "Debit amount is greater than 0.");
        next();
      }
      invoiceTransaction = {
        type: data.type,
        number: data.number,
        amountDr: formatNumber(amountDr),
        balance: formatNumber(isExist?.balance - amountDr),
      };
    } else {
      let amountCr = formatNumber(data.amountCr);
      if (isNaN(amountCr)) {
        await setResponseObject(
          req,
          false,
          "Credit amount is  greater than 0."
        );
        return next();
      }
      invoiceTransaction = {
        type: data.type,
        number: data.number,
        amountCr: formatNumber(amountCr),
        balance: formatNumber(isExist?.balance + amountCr),
      };
    }

    let updateData = await STATEMENT_TRANSACTION.findByIdAndUpdate(
      req.params.id,
      invoiceTransaction,
      { new: true }
    );

    if (updateData) {
      const transactionTimestamp = updateData.createdAt;

      const subsequentTransactions = await STATEMENT_TRANSACTION.find({
        company: updateData.company,
        createdAt: { $gt: transactionTimestamp },
      });

      for (let subData of subsequentTransactions) {
        let isExist = await STATEMENT_TRANSACTION.findOne({
          createdAt: { $lt: subData.createdAt },
        }).sort({ createdAt: -1 });

        if (isExist) {
          let previousBalance = formatNumber(isExist.balance);
          if (isNaN(previousBalance)) {
            await setResponseObject(
              req,
              false,
              "Previous balance is not a valid number."
            );
            return next();
          }

          let invoiceTransaction;
          if (subData.amountDr) {
            let balance = previousBalance - subData.amountDr;
            invoiceTransaction = {
              balance: formatNumber(balance),
            };
          } else {
            let balance = previousBalance + subData.amountCr;
            invoiceTransaction = {
              balance: formatNumber(balance),
            };
          }

          await STATEMENT_TRANSACTION.findByIdAndUpdate(
            subData._id,
            invoiceTransaction,
            { new: true }
          );
        }
      }

      await setResponseObject(
        req,
        true,
        "Statement account transaction updated successfully.",
        updateData
      );
      return next();
    } else {
      await setResponseObject(
        req,
        false,
        "Statement account transaction not updated."
      );
      return next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    return next();
  }
};
/**
 * Add statement account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.statementTransactionAdd = async (req, res, next) => {
  try {
    let data = req.body;
    data.createdBy = req.userId;

    if (
      data.type == "" &&
      data.number == "" &&
      data.paymentType == "" &&
      data.amountDr == "" &&
      data.amountCr == ""
    ) {
      await setResponseObject(req, false, "Please fill some information.");
      next();
      return;
    }

    if (data?.amountCr == 0 && data?.amountCr != "") {
      await setResponseObject(req, false, "AmountCr is greater than 0");
      next();
      return;
    }

    if (data?.amountDr == 0 && data?.amountDr != "") {
      await setResponseObject(req, false, "AmountDr is greater than 0");
      next();
      return;
    }

    let createData = "";
    let invoiceTranaction = "";
    let isExist = await STATEMENT_TRANSACTION.find({
      company: data.company,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    if (isExist.length > 0) {
      if (data?.amountCr && data?.amountCr != "") {
        let crAmount = isExist[0].balance + data?.amountCr;
        invoiceTranaction = {
          type: data.type,
          number: data.number,
          amountCr: formatNumber(data?.amountCr),
          balance: formatNumber(crAmount),
          company: new mongoose.Types.ObjectId(data.company),
          createdBy: new mongoose.Types.ObjectId(data.createdBy),
          date: new Date(data?.date).toISOString(),
          accountType: data?.accountType,
          isManuallyAdded: true,
        };
        createData = await STATEMENT_TRANSACTION.create(invoiceTranaction);
      }
      if (data?.amountDr && data?.amountDr != "") {
        // Create commission statement transaction
        let drAmount = invoiceTranaction.balance
          ? invoiceTranaction.balance - data.amountDr
          : isExist[0].balance - data.amountDr;

        let commissionTranaction = {
          type: data.type,
          number: data.number,
          amountDr: formatNumber(data.amountDr),
          balance: formatNumber(drAmount),
          company: new mongoose.Types.ObjectId(data.company),
          createdBy: new mongoose.Types.ObjectId(data.createdBy),
          date: new Date(data?.date).toISOString(),
          accountType: data?.accountType,
          isManuallyAdded: true,
        };
        createData = await STATEMENT_TRANSACTION.create(commissionTranaction);
      }
    }
    if (createData) {
      await setResponseObject(
        req,
        true,
        "Statement account created successfully.",
        createData
      );
      next();
    } else {
      await setResponseObject(req, false, "Statement account not created.");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Download statementAccount report
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
statementAccount.downloadStatementReport = async (req, res, next) => {
  try {
    let filter = [];
    let companyFilter = {};

    if (req.query.startDate && req.query.endDate) {
      const startDateString = new Date(req.query.startDate);

      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          date: {
            $gte: startDateString,
            $lte: endDateString,
          },
        },
      });
    } else if (req.query.startDate) {
      const startDateString = new Date(req.query.startDate);

      filter.push({
        $match: {
          date: {
            $gte: startDateString,
          },
        },
      });
    } else if (req.query.endDate) {
      const endDateString = new Date(req.query.endDate);
      endDateString.setDate(endDateString.getDate() + 1);

      filter.push({
        $match: {
          date: {
            $lte: endDateString,
          },
        },
      });
    }

    if (req.query.company) {
      filter.push({
        $match: {
          company: new mongoose.Types.ObjectId(req.query.company),
        },
      });
      companyFilter = {
        $match: {
          company: new mongoose.Types.ObjectId(req.query.company),
        },
      };
    }

    let accountFilter = {};
    switch (req.query.accountType) {
      case "1":
        accountFilter = {
          accountType: CONST.PERCENTAGE,
        };
        break;
      case "2":
        accountFilter = {
          accountType: CONST.FIX_AMOUNT,
        };
        break;
      default:
    }

    let list = await STATEMENT_TRANSACTION.aggregate([
      {
        $match: accountFilter,
      },
      ...filter,
    ]);

    if (list.length > 0) {
      async function generateExcel(list) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Account Statement Details");

        // Prepare the data for the Excel file
        const data = [
          ["Date", "Type", "Order Number", "Amount Dr", "Amount Cr", "Balance"],
        ];

        // Assuming findPromo is an array of objects
        list?.forEach((list) => {
          data.push([
            moment.utc(list?.date).format("DD/MM/YYYY"),
            list?.type,
            list?.number,
            list?.amountDr ?? "-",
            list?.amountCr ?? "-",
            list?.balance,
          ]);
        });

        // Add rows to the worksheet
        data.forEach((row) => {
          worksheet.addRow(row);
        });
        data[0].forEach((_, index) => {
          const maxLength = data.reduce(
            (max, row) =>
              Math.max(max, row[index] ? row[index].toString().length : 0),
            0
          );
          worksheet.getColumn(index + 1).width = maxLength + 2; // Adding some padding
        });

        // Define the file path for the Excel file
        const excelPath = `../uploads/invoice/accountstatement-${generateOTP(
          6
        )}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(list);
      let excelUrl = `${process.env.IMAGE_BASE_URL}${excelPath}`; // Example URL format
      excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
      await setResponseObject(
        req,
        true,
        "Report download successfully",
        excelUrl
      );
      next();
    } else {
      await setResponseObject(req, true, "No data available");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = statementAccount;
