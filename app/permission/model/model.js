/** 
@copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const mongoose = require("mongoose");
const SCHEMA = mongoose.Schema;
const { CONST } = require("../../../helpers/constant");

const permissionSchema = new SCHEMA(
  {
    roleId: {
      type: Number,
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    promotionId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    designedId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    rolesPrivileges: [
      {
        type: String,
        default: "",
      },
    ],
    categoryId: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    country: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    permissionsChecked: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.PERMISSION_MODEL = mongoose.model(
  "permissionSchema",
  permissionSchema
);
