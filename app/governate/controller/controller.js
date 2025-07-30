/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { GOVERNATE, AREA } = require("../model/model");
const { CONST } = require("../../../helpers/constant");

let governate = {};

governate.governateList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      searchFilter = {
        title: {
          $regex: req.query.search ? req.query.search : "",
          $options: "i",
        },
      };
    }

    let list = await GOVERNATE.aggregate([
      {
        $match: { stateId: {$eq: CONST.ACTIVE  } },
      },
      {
        $match: searchFilter,
      },
      {
        $facet: {
          data: [
            { $skip: pageLimit * (pageNo - CONST.PAGE_NO) },
            { $limit: pageLimit },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);
    if (list && list[0].data.length) {
      await setResponseObject(
        req,
        true,
        "",
        list[0].data,
        list[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


governate.governateAreaList = async (req, res, next) => {
    try {

      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;
  
      let searchFilter = {};
      if (req.query.search && req.query.search !== "undefined") {
        searchFilter = {
          title: {
            $regex: req.query.search ? req.query.search : "",
            $options: "i",
          },
        };
      }
      if(req.query.governateId){
        searchFilter.governateId = {$eq :  new mongoose.Types.ObjectId(req.query.governateId)}
      }
      let list = await AREA.aggregate([
        {
          $match: { stateId: { $eq: CONST.ACTIVE } },
        },
        {
          $match: searchFilter,
        },
        {
          $facet: {
            data: [
              { $skip: pageLimit * (pageNo - CONST.PAGE_NO) },
              { $limit: pageLimit },
            ],
            count: [{ $count: "count" }],
          },
        },
      ]);
      if (list && list[0].data.length) {
        await setResponseObject(
          req,
          true,
          "",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

module.exports = governate;
