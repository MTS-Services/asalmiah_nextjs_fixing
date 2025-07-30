/** 
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { PERMISSION_MODEL } = require("../model/model");

const permission = {};

/**
 * Add permission
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
permission.add = async (req, res, next) => {
  try {
    const data = req.body;
    if (
      Array.isArray(data.rolesPrivileges) &&
      data.rolesPrivileges.length === 0
    ) {
      await setResponseObject(req, false, "Permission can't be empty");
      next();
      return;
    }

    if (data?.categoryId) {
      data.categoryId = data?.categoryId.split(",");
    }

    let saveData;
    data.createdBy = req.userId;
    const isRoleExists = await PERMISSION_MODEL.findOne({
      $or: [
        { sellerId: new mongoose.Types.ObjectId(data?.sellerId) },
        { promotionId: new mongoose.Types.ObjectId(data?.promotionId) },
        { designedId: new mongoose.Types.ObjectId(data?.designedId) },
      ],
    });


    if (isRoleExists != null) {
      saveData = await PERMISSION_MODEL.findOneAndUpdate(
        {
          sellerId: isRoleExists?.sellerId,
          promotionId: isRoleExists?.promotionId,
          designedId: isRoleExists?.designedId,
        },
        data,
        { new: true }
      );
      await setResponseObject(
        req,
        true,
        "Permission updated successfully",
        saveData
      );
      next();
      return;
    } else {
      saveData = await PERMISSION_MODEL.create(data);
      if (saveData) {
        await setResponseObject(
          req,
          true,
          "Permission created successfully",
          saveData
        );
        next();
      } else {
        await setResponseObject(req, false, "Permission not created", "");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = permission;
