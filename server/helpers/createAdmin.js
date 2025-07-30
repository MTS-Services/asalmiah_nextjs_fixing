/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { USER } = require("../app/userService/model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { CONST } = require("./constant");
const logger = require("winston");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.DB_URL);

async function create() {
  const payload = {
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(
      process.env.ADMIN_EMAIL_PWD,
      parseInt(process.env.SALT_ROUNDS)
    ),
    roleId: CONST.ADMIN,
    stateId: CONST.ACTIVE,
    isVerified: true,
  };

  const isEXists = await USER.findOne({
    email: payload.email,
  });
  if (isEXists) {
    logger.info(`Admin already created`);
    process.exit();
  } else {
    const createAdmin = await USER.create(payload);
    if (createAdmin) {
      logger.info(`Admin created successfully`);
      process.exit();
    } else {
      logger.info(`Admin not created`);
      process.exit();
    }
  }
}

create();
