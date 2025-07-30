/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let { USER } = require("../model/userModel");
let ORDER = require("../../order/model/order.model");
let { LOGIN_ACTIVITY } = require("../model/userLogModel");
let { CONST } = require("../../../helpers/constant");
let nodemailer = require("../../../helpers/nodemailer");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Error_Logs, Sms_Logs } = require("../../errorLogs/model/logModal");
let dotenv = require("dotenv");
dotenv.config();
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
const {
  getHashPassword,
  generateOTP,
  comparePasswords,
  formatNumber,
  validationData,
} = require("../../../middleware/commonFunction");
const logger = require("winston");
const multer = require("multer");
const fs = require("fs");
const { HTTP } = require("../../../helpers/http-status-code");
const { PAYMENT } = require("../../payment/model/payment.model");
const dir = "../uploads/profile";
const axios = require("axios");
const ExcelJS = require("exceljs");
const moment = require("moment");
const { WALLET, POINT } = require("../../wallet/model/model");
const twilio = require("twilio");
const {
  USER_SPINNER_MODEL,
  SPINNER_SETTING_MODEL,
} = require("../../spinner/model/spinner.model");
const { CASHBACK } = require("../../cashBack/model/model");
const { TWILLIO } = require("../../twillio/model/twillio.model");
const { CART } = require("../../cart/model/model");
const { PERMISSION_MODEL } = require("../../permission/model/model");
const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime().toString() + ".png");
  },
});

const upload = multer({ storage: storage }).fields([{ name: "profileImg" }]);

let _user = {};

/*USER SIGNUP*/
_user.signup = async (req, res, next) => {
  try {
    let data = req.body;
    data.firstName = data?.firstName?.trim();
    data.lastName = data?.lastName?.trim();
    data.password = data?.password?.trim();
    data.email = data?.email?.toLowerCase();
    data.email = data?.email?.trim();

    let userExists = await USER.findOne({
      email: validationData(data.email),
      stateId: { $ne: CONST.DELETED },
    });

    if (userExists) {
      await setResponseObject(
        req,
        false,
        "Account already created with this email"
      );
      next();
      return;
    }

    const mobileExists = await USER.findOne({
      mobile: data.mobile,
      countryCode: data.countryCode,
      stateId: { $ne: CONST.DELETED },
      roleId: { $eq: CONST.USER },
    });

    if (mobileExists) {
      await setResponseObject(
        req,
        false,
        "Account already created with this mobile number."
      );
      next();
      return;
    }

    const allowedCountryCodes = ["+962", "+965", "+971"];
    if (!allowedCountryCodes.includes(data.countryCode)) {
      await setResponseObject(req, false, "This country code is not allowed.");
      next();
      return;
    }

    if (data.referralCode) {
      const referralCode = await USER_SPINNER_MODEL.findOne({
        referralCode: data.referralCode,
      });
      data.joinedByReferral = data.referralCode;
      if (!referralCode) {
        await setResponseObject(req, false, "Invalid referral code");
        next();
        return;
      }
      let userLength = referralCode?.referralUserBy?.length;
      if (referralCode && referralCode?.numberOfUse == userLength) {
        await setResponseObject(req, false, "Referral code is already used.");
        next();
        return;
      }
    }

    data.password = await getHashPassword(data.password);
    let randomNumber = generateOTP();
    data.otp = randomNumber;

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

    // Create customerId for tap dashboard
    const options = {
      method: "POST",
      url: "https://api.tap.company/v2/customers",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
      },
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: { country_code: data.countryCode, number: data.mobile },
        currency: "KWD",
      },
    };

    const createCust = await axios.request(options);
    data.customerId = createCust.data.id;

    let signupUser = await new USER(data).save();
    signupUser.otp = "";
    if (data.referralCode) {
      const referralCode = await USER_SPINNER_MODEL.findOneAndUpdate(
        { referralCode: data.referralCode },
        { $push: { referralUserBy: signupUser._id } },
        { new: true }
      );
      if (referralCode) {
        let cashBackData = {
          cashBack: referralCode.maxCashBack,
          startDate: referralCode.startDate,
          endDate: referralCode.endDate,
          createdBy: referralCode.userId,
        };
        await CASHBACK.create(cashBackData);
        const walletExist = await WALLET.findOne({
          userId: new mongoose.Types.ObjectId(referralCode.userId),
        });
        if (walletExist) {
          let updateWallet = await WALLET.findOneAndUpdate(
            { _id: walletExist._id },
            {
              amount:
                (walletExist.amount ? parseInt(walletExist.amount) : 0) +
                (referralCode.maxCashBack
                  ? parseInt(referralCode.maxCashBack)
                  : 0),
            },
            { new: true }
          );
        } else {
          let payload = {
            userId: referralCode.userId,
            amount: referralCode.maxCashBack
              ? parseInt(referralCode.maxCashBack)
              : 0,
          };
          let createWallet = await WALLET.create(payload);
        }
      }
    }
    let token_Data = {
      email: signupUser.email,
      userId: signupUser._id,
      roleId: signupUser.roleId,
    };

    let token = jwt.sign(token_Data, process.env.JWT_SECRET);

    if (data?.isCart && data?.deviceToken) {
      let findCart = await CART.find({ createdBy: signupUser._id });

      let updateCart = await CART.updateMany(
        {
          $and: [
            { deviceToken: data?.deviceToken },
            { createdBy: { $eq: null } },
          ],
        },
        { $set: { createdBy: new mongoose.Types.ObjectId(signupUser._id) } },
        {
          upsert: true,
        }
      );
      // Get the updated documents
      let updatedCart = await CART.find({
        $and: [
          { deviceToken: data?.deviceToken },
          { createdBy: signupUser._id },
        ],
      });

      // Delete documents from findCart that don't match the companyId of the updated documents
      findCart.forEach(async (ele) => {
        if (
          !updatedCart.some(
            (e) => e.companyId.toString() === ele.companyId.toString()
          )
        ) {
          await CART.findByIdAndDelete({ _id: ele._id });
        }
      });
    }
    if (data?.isSpin && data?.deviceToken) {
      let updateSpinner = await USER_SPINNER_MODEL.updateMany(
        {
          $and: [{ deviceToken: data?.deviceToken }, { userId: { $eq: null } }],
        },
        { $set: { userId: new mongoose.Types.ObjectId(signupUser._id) } }
      );
    }

    let updateToken = await USER.findByIdAndUpdate(
      { _id: signupUser._id },
      { token: token },
      { new: true }
    );

    signupUser.token = token;

    if (!signupUser) {
      await setResponseObject(req, false, "Account not created");
      next();
    } else {
      await nodemailer.welcomeMail(
        signupUser?.email || "abc@g.in",
        signupUser.fullName || "user",
        signupUser.countryCode || "+1",
        signupUser?.mobile || "000"
      );
      await nodemailer.notificationMailForAdminRegardingNewUserRagiester(
        signupUser?.fullName || "User",
        signupUser?.email || "abc@g.in",
        signupUser.countryCode || "+1",
        signupUser.mobile || "0000",
        process.env.ADMIN_EMAIL
      );

      await setResponseObject(
        req,
        true,
        "Account created successfully",
        signupUser
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*SOCIAL LOGIN*/
_user.socialLogin = async (req, res, next) => {
  try {
    let data = req.body;

    // Initialize existingUser as null
    let existingUser = null;

    // Check if GoogleId exists and is not undefined
    if (req.body.googleId) {
      existingUser = await USER.findOne({
        googleId: req.body.googleId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    // If user doesn't exist based on Google ID, check Facebook ID
    if (!existingUser && req.body.facebookId) {
      existingUser = await USER.findOne({
        facebookId: req.body.facebookId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    // If user doesn't exist based on Facebook ID, check Apple ID
    if (!existingUser && req.body.appleId) {
      existingUser = await USER.findOne({
        appleId: req.body.appleId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    if (existingUser) {
      if (!existingUser?.customerId) {
        // Create customerId for tap dashboard
        const options = {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.SECRET_KEY}`,
          },
          body: JSON.stringify({
            first_name: data.first ? data.first : "OffaratUser",
            middle_name: data.first ? data.first : "OffaratUser",
            last_name: data.first ? data.first : "OffaratUser",
            email: "offaratuser@gmail.com",
            phone: { country_code: "965", number: "51234567" },
            currency: "KWD",
          }),
        };

        async function createCustomer() {
          try {
            const res = await fetch(
              "https://api.tap.company/v2/customers",
              options
            );
            const data = await res.json();
            return data;
          } catch (err) {
            console.error(err);
          }
        }

        let createCust = await createCustomer();
        let updateUserCustomerId = await USER.findByIdAndUpdate(
          { _id: existingUser._id },
          { customerId: createCust.id },
          { new: true }
        );
      }

      let token_Data = {
        userId: existingUser?._id,
        email: existingUser.email,
        roleId: existingUser.roleId,
      };
      let token = jwt.sign(token_Data, process.env.JWT_SECRET);
      let updateData = {
        lastVisitTime: Date.now(),
        token: token,
        isVerified: true,
        stateId: CONST.ACTIVE,
      };
      let record = await USER.findOneAndUpdate(
        { _id: existingUser._id },
        updateData,
        { new: true }
      );
      if (data?.isCart && data?.deviceToken) {
        let findCart = await CART.find({ createdBy: existingUser._id });

        let updateCart = await CART.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { createdBy: { $eq: null } },
            ],
          },
          {
            $set: { createdBy: new mongoose.Types.ObjectId(existingUser._id) },
          },
          {
            upsert: true,
          }
        );
        // Get the updated documents
        let updatedCart = await CART.find({
          $and: [
            { deviceToken: data?.deviceToken },
            { createdBy: existingUser._id },
          ],
        });

        // Delete documents from findCart that don't match the companyId of the updated documents
        findCart.forEach(async (ele) => {
          if (
            !updatedCart.some(
              (e) => e.companyId.toString() === ele.companyId.toString()
            )
          ) {
            await CART.findByIdAndDelete({ _id: ele._id });
          }
        });
      }
      if (data?.isSpin && data?.deviceToken) {
        let updateSpinner = await USER_SPINNER_MODEL.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { userId: { $eq: null } },
            ],
          },
          { $set: { userId: new mongoose.Types.ObjectId(existingUser._id) } }
        );
      }

      await setResponseObject(req, true, "Login Successfully", record);
      next();
    } else {
      if (data?.referralCode) {
        const referralCode = await USER_SPINNER_MODEL.findOne({
          referralCode: data.referralCode,
        });
        data.joinedByReferral = data.referralCode;
        if (!referralCode) {
          await setResponseObject(req, false, "Invalid referral code");
          next();
          return;
        }
        if (referralCode && referralCode.isUsed == true) {
          await setResponseObject(req, false, "Referral code is already used.");
          next();
          return;
        }
      }
      data.isVerified = true;
      data.stateId = CONST.ACTIVE;
      if (req.body.socialType != "apple") {
        data.profileImg = data?.profileImage ?? "";
        const [firstName, lastName] = data?.fullName?.split(" ");
        data.firstName = firstName ?? "";
        data.lastName = lastName ?? "";
      }

      // Create customerId for tap dashboard
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
        body: JSON.stringify({
          first_name: data.first ? data.first : "OffaratUser",
          middle_name: data.first ? data.first : "OffaratUser",
          last_name: data.first ? data.first : "OffaratUser",
          email: "offaratuser@gmail.com",
          phone: { country_code: "965", number: "51234567" },
          currency: "KWD",
        }),
      };

      async function createCustomer() {
        try {
          const res = await fetch(
            "https://api.tap.company/v2/customers",
            options
          );
          const data = await res.json();
          return data;
        } catch (err) {
          console.error(err);
        }
      }

      let createCust = await createCustomer();
      data.customerId = createCust.id;

      let signupUser = await new USER(data).save();
      let token_Data = {
        userId: signupUser?._id,
        email: signupUser?.email,
        roleId: signupUser?.roleId,
      };
      if (data?.referralCode) {
        const referralCode = await USER_SPINNER_MODEL.findOneAndUpdate(
          { referralCode: data.referralCode },
          { $set: { isUsed: true, referralUserBy: signupUser._id } },
          { new: true }
        );
        if (referralCode) {
          let cashBackData = {
            cashBack: referralCode.maxCashBack,
            startDate: referralCode.startDate,
            endDate: referralCode.endDate,
            createdBy: referralCode.userId,
          };
          await CASHBACK.create(cashBackData);
          const walletExist = await WALLET.findOne({
            userId: new mongoose.Types.ObjectId(referralCode.userId),
          });
          if (walletExist) {
            let updateWallet = await WALLET.findOneAndUpdate(
              { _id: walletExist._id },
              {
                amount:
                  (walletExist.amount ? parseInt(walletExist.amount) : 0) +
                  (referralCode.maxCashBack
                    ? parseInt(referralCode.maxCashBack)
                    : 0),
              },
              { new: true }
            );
          } else {
            let payload = {
              userId: referralCode.userId,
              amount: referralCode.maxCashBack
                ? parseInt(referralCode.maxCashBack)
                : 0,
            };
            let createWallet = await WALLET.create(payload);
          }
        }
      }
      let token = jwt.sign(token_Data, process.env.JWT_SECRET);
      signupUser.token = token;
      let record = await signupUser.save();
      if (data?.isCart && data?.deviceToken) {
        let findCart = await CART.find({ createdBy: signupUser._id });

        let updateCart = await CART.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { createdBy: { $eq: null } },
            ],
          },
          { $set: { createdBy: new mongoose.Types.ObjectId(signupUser._id) } },
          {
            upsert: true,
          }
        );
        // Get the updated documents
        let updatedCart = await CART.find({
          $and: [
            { deviceToken: data?.deviceToken },
            { createdBy: signupUser._id },
          ],
        });

        // Delete documents from findCart that don't match the companyId of the updated documents
        findCart.forEach(async (ele) => {
          if (
            !updatedCart.some(
              (e) => e.companyId.toString() === ele.companyId.toString()
            )
          ) {
            await CART.findByIdAndDelete({ _id: ele._id });
          }
        });
      }
      if (data?.isSpin && data?.deviceToken) {
        let updateSpinner = await USER_SPINNER_MODEL.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { userId: { $eq: null } },
            ],
          },
          { $set: { userId: new mongoose.Types.ObjectId(signupUser._id) } }
        );
      }
      await setResponseObject(req, true, "Login Successfully", record);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* user Exist */
_user.socialUserExists = async (req, res, next) => {
  try {
    let data = req.body;
    // Initialize existingUser as null
    let existingUser = null;

    // Check if GoogleId exists and is not undefined
    if (req.body.googleId) {
      existingUser = await USER.findOne({
        googleId: req.body.googleId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    // If user doesn't exist based on Google ID, check Facebook ID
    if (!existingUser && req.body.facebookId) {
      existingUser = await USER.findOne({
        facebookId: req.body.facebookId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    // If user doesn't exist based on Facebook ID, check Apple ID
    if (!existingUser && req.body.appleId) {
      existingUser = await USER.findOne({
        appleId: req.body.appleId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    if (existingUser) {
      let record = {
        userExists: true,
      };
      await setResponseObject(req, true, "YES", record);
      next();
    } else {
      let record = {
        userExists: false,
      };
      await setResponseObject(req, true, "NO", record);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*VERIFY OTP*/
_user.verifyOtp = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser;
    if (data?.email) {
      findUser = await USER.findOne({
        email: data?.email?.toLowerCase(),
        stateId: { $ne: CONST.DELETED },
      });
    }

    if (data?.countryCode && data?.mobile) {
      findUser = await USER.findOne({
        $and: [
          { mobile: data.mobile },
          { countryCode: data.countryCode },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });
    }

    if (findUser?.otp == parseInt(data.otp)) {
      const payload = {
        userId: findUser._id,
        email: findUser.email,
        roleId: findUser.roleId,
      };

      const token = await jwt.sign(payload, process.env.JWT_SECRET);

      const updateObj = {
        isVerified: true,
        token,
      };

      const updateUser = await USER.findOneAndUpdate(
        {
          $or: [
            {
              email: findUser?.email?.toLowerCase(),
              stateId: { $ne: CONST.DELETED },
            },
            {
              $and: [
                { countryCode: findUser?.countryCode },
                { mobile: findUser?.mobile },
                { stateId: { $ne: CONST.DELETED } },
              ],
            },
          ],
        },
        updateObj,
        { new: true }
      );

      await setResponseObject(
        req,
        true,
        "OTP verified successfully",
        updateUser
      );
      next();
    } else {
      await setResponseObject(req, false, "Invalid otp");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* user Exist */
_user.permissionDetails = async (req, res, next) => {
  try {
    let permissionData = await PERMISSION_MODEL.aggregate([
      {
        $match: {
          $or: [
            {
              promotionId: new mongoose.Types.ObjectId(req.userId),
            },
            {
              designedId: new mongoose.Types.ObjectId(req.userId),
            },
          ],
        },
      },
    ]);

    if (permissionData.length > 0) {
      await setResponseObject(req, true, "YES", permissionData[0]);
      next();
    } else {
      await setResponseObject(req, true, "NO", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN LOGIN */
_user.login = async (req, res, next) => {
  try {
    let data = req.body;
    let condition;
    if (data?.email) {
      condition = {
        $and: [
          { email: data?.email?.toLowerCase() },
          { stateId: { $ne: CONST.DELETED } },
        ],
      };
    }
    if (data?.mobile) {
      condition = {
        $and: [
          { mobile: data?.mobile },
          { countryCode: data.countryCode },
          { stateId: { $ne: CONST.DELETED } },
        ],
      };
    }
    //find data in user model
    // let findUser = await USER.findOne(condition)
    //   .populate("company")
    //   .populate("branch");

    let user = await USER.aggregate([
      {
        $match: condition,
      },
      // {
      //   $lookup: {
      //     from: "permissionschemas",
      //     let: { id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
      //           },
      //         },
      //       },
      //     ],
      //     as: "permission",
      //   },
      // },
      // {
      //   $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
      // },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company:" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$_id"],
                },
              },
            },
          ],
          as: "company",
        },
      },
      {
        $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "branches",
          let: { id: "$branch" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$_id"],
                },
              },
            },
          ],
          as: "branch",
        },
      },
      {
        $unwind: { path: "$branch", preserveNullAndEmptyArrays: true },
      },
    ]);

    findUser = user[0];

    if (!findUser) {
      data.loginAt = Date.now();
      data.failedReason = "Account not register.";
      data.stateId = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Account not register.", "");
      next();
    }

    let permissionData = await USER.aggregate([
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: new mongoose.Types.ObjectId(findUser._id) },
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
        $project: {
          _id: 1,
          permission: 1,
        },
      },
    ]);

    if (data.roleId && findUser?.roleId != data.roleId) {
      await setResponseObject(req, false, "You'r not authorized to login");
      next();
      return;
    }

    if ((await comparePasswords(data.password, findUser.password)) === false) {
      data.loginAt = Date.now();
      data.failedReason = "Invalid login credentials.";
      data.stateId = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Invalid login credentials.");
      next();
    } else if (findUser.stateId == CONST.INACTIVE) {
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = "Account is inactive contact admin";
      data.state = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Account is inactive contact admin");
      next();
    } else if (findUser.stateId == CONST.PENDING) {
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = "Account is not verified by admin";
      data.state = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Account is not verified by admin");
      next();
    } else {
      let token_Data = {
        email: findUser.email,
        userId: findUser._id,
        roleId: findUser.roleId,
      };

      let token = jwt.sign(token_Data, process.env.JWT_SECRET, {
        // expiresIn: "10m",
        expiresIn: "1d",
      });

      data.user = findUser._id;
      data.loginAt = Date.now();
      data.state = CONST.LOGIN;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await USER.findOneAndUpdate(
        { _id: findUser._id },
        {
          lastVisitTime: Date.now(),
          token: token,
          deviceToken: data.deviceToken,
          tokenExpiration: Date.now() + 10 * 60 * 1000,
        },
        { new: true }
      );

      findUser.token = token;
      findUser.deviceToken = data.deviceToken;

      if (data?.isCart && data?.deviceToken) {
        let updateCart = await CART.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { createdBy: { $eq: null } },
            ],
          },
          { $set: { createdBy: new mongoose.Types.ObjectId(findUser._id) } }
        );
      }
      if (data?.isSpin && data?.deviceToken) {
        let updateCart = await USER_SPINNER_MODEL.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { userId: { $eq: null } },
            ],
          },
          { $set: { userId: new mongoose.Types.ObjectId(findUser._id) } }
        );
      }

      let loginData = [permissionData[0], findUser];

      await setResponseObject(req, true, "Login successfully", loginData);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER LOGIN */
_user.userSignin = async (req, res, next) => {
  try {
    let data = req.body;
    let condition;
    if (data?.email) {
      condition = {
        $and: [
          { email: data?.email?.toLowerCase() },
          { stateId: { $ne: CONST.DELETED } },
        ],
      };
    }
    if (data?.mobile) {
      condition = {
        $and: [
          { mobile: data?.mobile },
          { countryCode: data.countryCode },
          { stateId: { $ne: CONST.DELETED } },
        ],
      };
    }
    //find data in user model
    // let findUser = await USER.findOne(condition)
    //   .populate("company")
    //   .populate("branch");

    let user = await USER.aggregate([
      {
        $match: condition,
      },
      // {
      //   $lookup: {
      //     from: "permissionschemas",
      //     let: { id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
      //           },
      //         },
      //       },
      //     ],
      //     as: "permission",
      //   },
      // },
      // {
      //   $unwind: { path: "$permission", preserveNullAndEmptyArrays: true },
      // },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company:" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$_id"],
                },
              },
            },
          ],
          as: "company",
        },
      },
      {
        $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "branches",
          let: { id: "$branch" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$_id"],
                },
              },
            },
          ],
          as: "branch",
        },
      },
      {
        $unwind: { path: "$branch", preserveNullAndEmptyArrays: true },
      },
    ]);

    findUser = user[0];

    if (!findUser) {
      data.loginAt = Date.now();
      data.failedReason = "Account not register.";
      data.stateId = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Account not register.", "");
      next();
    }

    if (data.roleId && findUser?.roleId != data.roleId) {
      await setResponseObject(req, false, "You'r not authorized to login");
      next();
      return;
    }

    if ((await comparePasswords(data.password, findUser.password)) === false) {
      data.loginAt = Date.now();
      data.failedReason = "Invalid login credentials.";
      data.stateId = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Invalid login credentials.");
      next();
    } else if (findUser.stateId == CONST.INACTIVE) {
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = "Account is inactive contact admin";
      data.state = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Account is inactive contact admin");
      next();
    } else if (findUser.stateId == CONST.PENDING) {
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = "Account is not verified by admin";
      data.state = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await setResponseObject(req, false, "Account is not verified by admin");
      next();
    } else {
      let token_Data = {
        email: findUser.email,
        userId: findUser._id,
        roleId: findUser.roleId,
      };

      let token = jwt.sign(token_Data, process.env.JWT_SECRET, {
        // expiresIn: "10m",
        expiresIn: "1d",
      });

      data.user = findUser._id;
      data.loginAt = Date.now();
      data.state = CONST.LOGIN;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);

      await USER.findOneAndUpdate(
        { _id: findUser._id },
        {
          lastVisitTime: Date.now(),
          token: token,
          deviceToken: data.deviceToken,
          tokenExpiration: Date.now() + 10 * 60 * 1000,
        },
        { new: true }
      );

      findUser.token = token;
      findUser.deviceToken = data.deviceToken;

      if (data?.isCart && data?.deviceToken) {
        let updateCart = await CART.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { createdBy: { $eq: null } },
            ],
          },
          { $set: { createdBy: new mongoose.Types.ObjectId(findUser._id) } }
        );
      }
      if (data?.isSpin && data?.deviceToken) {
        let updateCart = await USER_SPINNER_MODEL.updateMany(
          {
            $and: [
              { deviceToken: data?.deviceToken },
              { userId: { $eq: null } },
            ],
          },
          { $set: { userId: new mongoose.Types.ObjectId(findUser._id) } }
        );
      }

      await setResponseObject(req, true, "Login successfully", findUser);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER LOGOUT API*/
_user.logout = async (req, res, next) => {
  try {
    await USER.updateOne(
      { _id: req.userId },
      {
        $set: {
          token: "",
          deviceToken: "",
        },
      }
    );
    await setResponseObject(req, true, "Logout successfully");
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*EDIT USER'S OWN PR OFILE*/
_user.profile = async (req, res, next) => {
  let language = req.headers["language"] ? req.headers["language"] : "EN";

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set to start of the day
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  try {
    let spinnerData = await SPINNER_SETTING_MODEL.findOne({
      stateId: CONST.ACTIVE,
    });
    const findUser = await USER.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.userId),
        },
      },

      {
        $lookup: {
          from: "companies",
          let: { id: "$company" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
                pickupService: 1,
                deliveryCompany: 1,
                costDelivery: 1,
                logo: 1,
                coverImg: 1,
                createdAt: 1,
                updatedAt: 1,
                stateId: 1,
                refNumber: 1,
              },
            },
            {
              $lookup: {
                from: "categories",
                let: { id: "$categoryId" }, // foreign key
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                    },
                  },
                ],
                as: "categoryDetails",
              },
            },
            {
              $unwind: {
                path: "$categoryDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "company",
        },
      },
      {
        $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "branches",
          let: { id: "$branch" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
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
                createdBy: 1,
              },
            },
          ],
          as: "branch",
        },
      },
      {
        $unwind: { path: "$branch", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "carts",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$createdBy"] }, // primary key (auths)
              },
            },
            {
              $lookup: {
                from: "promocodes",
                let: { id: "$promocode" }, // foreign key
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                    },
                  },
                ],
                as: "promoDetails",
              },
            },
            {
              $unwind: {
                path: "$promoDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "spinnerwins",
                let: { id: "$rewardId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$$id", "$_id"] },
                    },
                  },
                  {
                    $lookup: {
                      from: "companies",
                      let: { id: "$company" }, // foreign key
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                          },
                        },
                      ],
                      as: "company",
                    },
                  },
                  {
                    $unwind: {
                      path: "$company",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $lookup: {
                      from: "categories",
                      let: { id: "$category" }, // foreign key
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
                          },
                        },
                      ],
                      as: "categoryDetails",
                    },
                  },
                  {
                    $unwind: {
                      path: "$categoryDetails",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                ],
                as: "rewardDetails",
              },
            },
            {
              $unwind: {
                path: "$rewardDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "carts",
        },
      },
      {
        $addFields: {
          cartCount: { $size: "$carts" },
          total: { $sum: "$carts.purchase_Price" },
        },
      },
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$sellerId"] }, // primary key (auths)
              },
            },
          ],
          as: "permissionDetails",
        },
      },
      {
        $unwind: {
          path: "$permissionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "wallets",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$userId"] }, // primary key (auths)
              },
            },
          ],
          as: "walletsDetails",
        },
      },
      {
        $unwind: {
          path: "$walletsDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "spinnerwins",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$userId", "$userId"] }, // Assuming spinnerwins has a userId field
                    { $gte: ["$createdAt", currentDate] }, // Check if created today
                    { $lt: ["$createdAt", nextDate] }, // Check if created before tomorrow
                  ],
                },
              },
            },
            {
              $count: "winCount", // Count the number of wins today
            },
          ],
          as: "todayWins",
        },
      },
      {
        $addFields: {
          isSpin: {
            $gte: [
              { $arrayElemAt: ["$todayWins.winCount", 0] },
              spinnerData?.userUserPerDay
                ? parseInt(spinnerData?.userUserPerDay)
                : 0,
            ],
          }, // Check if count > 3
        },
      },
      {
        $addFields: {
          spinnerData: spinnerData, // Check if count > 3
        },
      },
    ]);

    // let notificationCount = await Notification.find({
    //   to: req.userId,
    //   isSeen: false,
    // }).countDocuments();
    // findUser.unReadNotificationCount = notificationCount;
    if (findUser.length > 0) {
      await setResponseObject(
        req,
        true,
        "Profile view successfully",
        findUser[0]
      );
      next();
    } else {
      await setResponseObject(req, false, "Profile not view", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*FORGOT PASSWORD*/
_user.forgotPassword = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser;

    if (data?.mobile && data?.countryCode) {
      findUser = await USER.findOne({
        $and: [{ mobile: data?.mobile }, { countryCode: data?.countryCode }],
        stateId: { $ne: CONST.DELETED },
      });

      if (!findUser) {
        return res.status(400).send({
          message: "Account not registered with this mobile number",
          success: false,
        });
      }

      if (findUser?.roleId != data?.roleId) {
        return res.status(400).send({
          message: "Your not allowed to perform this action.",
          success: false,
        });
      }

      if (findUser?.stateId == CONST.INACTIVE) {
        res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Your account is Inactive, Kindly contact admin",
        });
        next();
        return;
      }

      let resp =
        req.body.type == 1
          ? "An OTP has been sent to your WhatsApp number."
          : "An OTP has been sent to your SMS.";

      const otp = generateOTP();

      try {
        if (data.type == 1) {
          // Send OTP on whats'aap
          const message = await client.messages.create({
            contentSid: process.env.TWILLIO_CONTENT_SID,
            contentVariables: JSON.stringify({ 1: otp.toString() }),
            from: `whatsapp:${process.env.TWILLIO_WHATS_APP_NUMBER}`,
            messagingServiceSid: process.env.TWILLIO_SERVICES_ID,
            to: `whatsapp:${findUser.countryCode + findUser.mobile}`,
          });
        } else {
          // Send OTP on SMS
          const sendOtp = await client.messages.create({
            body: `Your verification OTP for offarat is : ${otp}`,
            from: process.env.TWILLIO_PHONE_NUMBER,
            to: findUser.countryCode + findUser.mobile,
          });

          let sendSms = await Sms_Logs.create({
            from: process.env.TWILLIO_PHONE_NUMBER,
            to: findUser?.countryCode + findUser?.mobile,
            message: `Your verification OTP for offarat is : ${otp}`,
          });
        }
      } catch (error) {
        console.log("sendOtp", error);
      }

      const updateOtp = await USER.findOneAndUpdate(
        { email: findUser.email },
        { otp: otp },
        { new: true }
      );

      await setResponseObject(req, true, resp, updateOtp);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*RESTORE PASSWORD*/
_user.restorePassword = async (req, res, next) => {
  try {
    const data = req.body;
    const hash = await bcrypt.hash(
      data.password,
      parseInt(process.env.SALT_ROUNDS)
    );

    data.password = hash;
    data.token = "";

    let restorePassword;

    if (data.email && data.email != "") {
      restorePassword = await USER.findOneAndUpdate(
        {
          email: data?.email,
          roleId: data.roleId,
          stateId: { $ne: CONST.DELETED },
        },
        data,
        { new: true }
      );
    }

    if (data.mobile && data.countryCode != "") {
      restorePassword = await USER.findOneAndUpdate(
        {
          $and: [
            { countryCode: data.countryCode },
            { mobile: data.mobile },
            { roleId: data.roleId },
            { stateId: { $ne: CONST.DELETED } },
          ],
        },
        data,
        { new: true }
      );
    }

    if (restorePassword) {
      res.status(HTTP.SUCCESS).send({
        success: true,
        message: "Password restore successfully",
        data: restorePassword,
      });
      next();
    } else {
      res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Password restore failed",
      });
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*CHANGE PASSWORD*/
_user.changePassword = async (req, res, next) => {
  try {
    let data = req.body;

    let findUser = await USER.findOne({ _id: req.userId });

    let comparePassword = await bcrypt.compare(
      data.password,
      findUser.password
    );

    if (comparePassword) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Password can't same as old password",
      });
    } else {
      let hash = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );

      data.password = hash;

      let updatePassword = await USER.findOneAndUpdate(
        { _id: req.userId },
        { password: data.password },
        { new: true }
      ).select("_id fullName firstName lastName");

      let link = "https://offarat.toxsl.in/login";

      if (updatePassword) {
        let sendEmail = await nodemailer.changePasswordLink(
          findUser.email,
          link
        );
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: "Password changed successfully",
          data: updatePassword,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: ERROR_UPDATE,
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*EDIT USER'S OWN PROFILE*/
_user.editOwnProfile = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }
      let data = req.body;
      data.firstName = data?.firstName?.trim();
      data.lastName = data?.lastName?.trim();
      data.isProfileCompleted = true;

      const findUser = await USER.findOne({ _id: req.userId });

      if (req.files?.profileImg) {
        if (findUser?.profileImg) {
          fs.stat(findUser.profileImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findUser.profileImg, async (err) => {
                if (err) {
                  logger.warn(`error ${err}`);
                } else {
                  logger.warn(`file was deleted`);
                }
              });
            } else if (err.code == "ENOENT") {
              logger.warn(`file doesnot exists`);
              return;
            }
          });
        }
        let img =
          process.env.IMAGE_BASE_URL +
          req.files?.profileImg?.[0].path.replace(/\s+/g, "");
        data.profileImg = img.replace(/\/\.\.\//g, "/");
      }

      if (data.longitude && data.latitude) {
        data.location = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
      }

      if (data.firstName || data.lastName) {
        if (data.firstName) {
          data.firstName =
            data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
        }
        if (data.lastName) {
          data.lastName =
            data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1);
        }
        data.fullName = data.firstName
          ? data.firstName
          : "" + " " + data.lastName
          ? data.lastName
          : "";
      }

      if (
        data &&
        data?.mobile &&
        data?.countryCode + data?.mobile !=
          findUser?.countryCode + findUser?.mobile
      ) {
        data.isVerified = false;
      }

      let updateProfile = await USER.findOneAndUpdate(
        { _id: req.userId },
        data,
        {
          new: true,
        }
      )
        .populate("company")
        .populate("branch");

      if (!updateProfile) {
        await setResponseObject(req, false, ERROR_UPDATE);
        next();
      } else {
        await setResponseObject(
          req,
          true,
          "Profile updated successfully",
          updateProfile
        );
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADD USER BY ADMIN*/
_user.addUser = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    upload(req, res, async (err) => {
      let data = req.body;
      data.createdBy = req.userId;

      data.password = await getHashPassword(process.env.DEFAULT_PWD);

      let userExists;
      userExists = await USER.findOne({
        email: data.email.toLowerCase(),
        stateId: { $ne: CONST.DELETED },
        roleId: { $eq: CONST.SALES },
      });

      if (userExists) {
        await setResponseObject(
          req,
          false,
          "Account already created with this email"
        );
        next();
        return;
      }

      if (
        data?.roleId == CONST.DESIGNED_USER ||
        data?.roleId == CONST.PROMOTION_USER
      ) {
        userExists = await USER.findOne({
          email: data.email.toLowerCase(),
          stateId: { $ne: CONST.DELETED },
        });

        if (userExists) {
          await setResponseObject(
            req,
            false,
            "Account already created with this email"
          );
          next();
          return;
        }
      }

      let mobileExists;
      mobileExists = await USER.findOne({
        mobile: data.mobile,
        countryCode: data.countryCode,
        stateId: { $ne: CONST.DELETED },
        roleId: { $eq: CONST.SALES },
      });

      if (mobileExists) {
        await setResponseObject(
          req,
          false,
          "Account already created with this mobile number."
        );
        next();
        return;
      }

      if (
        data?.roleId == CONST.DESIGNED_USER ||
        data?.roleId == CONST.PROMOTION_USER
      ) {
        mobileExists = await USER.findOne({
          mobile: data.mobile,
          countryCode: data.countryCode,
          stateId: { $ne: CONST.DELETED },
        });

        if (mobileExists) {
          await setResponseObject(
            req,
            false,
            "Account already created with this mobile number."
          );
          next();
          return;
        }
      }

      const allowedCountryCodes = ["+962", "+965", "+971"];
      if (data?.countryCode) {
        if (!allowedCountryCodes.includes(data?.countryCode)) {
          await setResponseObject(
            req,
            false,
            "This country code is not allowed."
          );
          next();
          return;
        }
      }

      // if (data?.company && data?.branch) {
      //   const branchExist = await USER.findOne({
      //     company: data.company,
      //     branch: data.branch,
      //     stateId: { $ne: CONST.DELETED },
      //   });
      //   if (branchExist) {
      //     await setResponseObject(
      //       req,
      //       false,
      //       "This Branch already assign to other seller."
      //     );
      //     next();
      //     return;
      //   }
      // }
      data.isVerified = true;
      data.email = data?.email?.toLowerCase();
      data.createdBy = req.userId;
      data.isTermsCondition = true;

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

      if (req.files?.profileImg) {
        let img =
          process.env.IMAGE_BASE_URL +
          req.files?.profileImg?.[0].path.replace(/\s+/g, "");
        data.profileImg = img.replace(/\/\.\.\//g, "/");
      }

      // Create customerId for tap dashboard
      const options = {
        method: "POST",
        url: "https://api.tap.company/v2/customers",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: { country_code: data.countryCode, number: data.mobile },
          currency: "KWD",
        },
      };

      const createCust = await axios.request(options);
      data.customerId = createCust.data.id;

      let saveUser = await USER.create(data);
      if (!saveUser) {
        await setResponseObject(req, false, "User not added");
        next();
      } else {
        if (saveUser?.roleId == CONST.SALES) {
          let permission = {
            rolesPrivileges:
              '[{"label":"productManagement","value":{"add":true,"edit":true,"delete":true,"view":true,"active":true}},{"label":"orderManagement","value":{"view":true,"status":true,"refund":true,"cancel":true,"review":true}},{"label":"couponManagement","value":{"scan":true,"view":true}}]',
            sellerId: saveUser._id,
            createdBy: req.userId,
          };
          let savePermission = await PERMISSION_MODEL.create(permission);
        }

        if (saveUser?.roleId == CONST.PROMOTION_USER) {
          let permission = {
            rolesPrivileges:
              '[{"label":"promotionManagement","value":{"add":true,"edit":true,"delete":true,"view":true,"active":true}},{"label":"offerManagement","value":{"add":true,"edit":true,"delete":true,"view":true,"active":true}}]',
            promotionId: saveUser._id,
            createdBy: req.userId,
          };
          let savePermission = await PERMISSION_MODEL.create(permission);
        }

        if (saveUser?.roleId == CONST.DESIGNED_USER) {
          let permission = {
            rolesPrivileges:
              '[{"label":"offerManagement","value":{"add":false,"edit":true,"delete":false,"view":false,"active":true}}]',
            designedId: saveUser._id,
            createdBy: req.userId,
          };
          let savePermission = await PERMISSION_MODEL.create(permission);
        }
        await setResponseObject(
          req,
          true,
          `User added successfully, default password is ${process.env.DEFAULT_PWD}`,
          saveUser
        );
        await nodemailer.addUser(saveUser.email, process.env.DEFAULT_PWD);
        next();
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*GET ALL USERS*/
_user.getUsers = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let filter = {};

    switch (req.query.state) {
      case "1":
        filter = {
          stateId: CONST.ACTIVE, // 1 => ACTIVE
        };
        break;

      case "2":
        filter = {
          stateId: CONST.INACTIVE, // 2 => INACTIVE
        };
        break;
      default:
        filter = {};
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
          firstName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: [
                  { $trim: { input: { $toString: "$countryCode" } } },
                  { $trim: { input: { $toString: "$mobile" } } },
                ],
              },
              regex: searchTerm,
              options: "i",
            },
          },
        },
        {
          "companyDetails.company": {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    let userFilter = {};
    if (req.query.roleId) {
      userFilter = {
        roleId: parseInt(req.query.roleId),
      };
    }

    // let roleFilter = {};
    // if (
    //   req.roleId == CONST.PROMOTION_USER ||
    //   req.roleId == CONST.DESIGNED_USER
    // ) {
    //   roleFilter = {
    //     $and: [
    //       { stateId: { $ne: CONST.DELETED } },
    //       { createdBy: new mongoose.Types.ObjectId(req.userId) },
    //     ],
    //   };
    // }

    let getUsers = await USER.aggregate([
      // {
      //   $match: roleFilter,
      // },
      {
        $match: {
          stateId: { $ne: CONST.DELETED },
        },
      },
      {
        $match: {
          $and: [
            {
              roleId: { $ne: CONST.ADMIN },
            },
            {
              ...userFilter,
            },
          ],
        },
      },
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: CONST.ACTIVE,
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
        $lookup: {
          from: "branches",
          let: { id: "$branch" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: CONST.ACTIVE,
              },
            },
          ],
          as: "branchDetails",
        },
      },
      {
        $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "wallets",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$userId"] }, // primary key (auths)
              },
            },
          ],
          as: "walletsDetails",
        },
      },
      {
        $unwind: {
          path: "$walletsDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "points",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$userId"] }, // primary key (auths)
              },
            },
          ],
          as: "pointsDetails",
        },
      },
      {
        $unwind: {
          path: "$pointsDetails",
          preserveNullAndEmptyArrays: true,
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
          from: "permissionschemas",
          let: { id: new mongoose.Types.ObjectId(req.userId) },
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
        $group: {
          _id: "$_id",
          fullName: { $first: "$fullName" },
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          countryCode: { $first: "$countryCode" },
          mobile: { $first: "$mobile" },
          email: { $first: "$email" },
          isVerified: { $first: "$isVerified" },
          isProfileCompleted: { $first: "$isProfileCompleted" },
          isNotificationOn: { $first: "$isNotificationOn " },
          deviceType: { $first: "$deviceType " },
          roleId: { $first: "$roleId" },
          stateId: { $first: "$stateId" },
          customerId: { $first: "$customerId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          permission: { $first: "$permission" },
          createdBy: { $first: "$createdBy" },
          updatedBy: { $first: "$updatedBy" },
          companyDetails: { $first: "$companyDetails" },
          branchDetails: { $first: "$branchDetails" },
          walletsDetails: { $first: "$walletsDetails" },
          pointsDetails: { $first: "$pointsDetails" },
          profileImg: { $first: "$profileImg" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (getUsers && getUsers[0]?.data?.length) {
      await setResponseObject(
        req,
        true,
        "User list found successfully",
        getUsers[0].data,
        getUsers[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "User list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*GET SINGLE USER DETAIL*/
_user.getUserById = async (req, res, next) => {
  try {
    let getUser = await USER.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "companies",
          let: { id: "$company" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: CONST.ACTIVE,
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
        $lookup: {
          from: "branches",
          let: { id: "$branch" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
                stateId: CONST.ACTIVE,
              },
            },
          ],
          as: "branchDetails",
        },
      },
      {
        $unwind: { path: "$branchDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "permissionschemas",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$id", ["$sellerId", "$promotionId", "$designedId"]],
                },
              },
            },
            {
              $lookup: {
                from: "categories",
                let: { categoryIds: { $ifNull: ["$categoryId", []] } }, // Default to empty array
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ["$_id", "$$categoryIds"], // Check if category _id is in the categoryId array
                      },
                    },
                  },
                ],
                as: "categories",
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
        $lookup: {
          from: "wallets",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$userId"] }, // primary key (auths)
              },
            },
          ],
          as: "walletsDetails",
        },
      },
      {
        $unwind: {
          path: "$walletsDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "points",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$userId"] }, // primary key (auths)
              },
            },
          ],
          as: "pointsDetails",
        },
      },
      {
        $unwind: {
          path: "$pointsDetails",
          preserveNullAndEmptyArrays: true,
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
        $project: {
          token: 0,
          password: 0,
          otp: 0,
        },
      },
    ]);

    if (getUser) {
      return res.status(200).send({
        success: true,
        message: "User details found successfully",
        data: getUser[0],
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "User Details not found",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*EDIT USER'S PROFILE*/
_user.editUserProfile = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        await setResponseObject(req, false, err);
        next();
      }
      let data = req.body;
      data.updatedBy = req.userId;
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

      let userExists = await USER.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        email: data.email,
        stateId: { $ne: CONST.DELETED },
      });

      if (userExists) {
        await setResponseObject(
          req,
          false,
          "Account already created with this email"
        );
        next();
        return;
      }

      const mobileExists = await USER.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        mobile: data.mobile,
        countryCode: data.countryCode,
        stateId: { $ne: CONST.DELETED },
      });

      if (mobileExists) {
        await setResponseObject(
          req,
          false,
          "Account already created with this mobile number."
        );
        next();
        return;
      }

      const findUser = await USER.findOne({ _id: req.params.id });

      if (req.files?.profileImg) {
        if (findUser?.profileImg) {
          fs.stat(findUser.profileImg, function (err, stat) {
            if (err == null) {
              fs.unlinkSync(findUser.profileImg, async (err) => {
                if (err) {
                  logger.warn(`error ${err}`);
                } else {
                  logger.warn(`file was deleted`);
                }
              });
            } else if (err.code == "ENOENT") {
              logger.warn(`file doesnot exists`);
              return;
            }
          });
        }
        let img =
          process.env.IMAGE_BASE_URL +
          req.files?.profileImg?.[0].path.replace(/\s+/g, "");
        data.profileImg = img.replace(/\/\.\.\//g, "/");
      }

      let updateProfile = await USER.findOneAndUpdate(
        { _id: req.params.id },
        data,
        {
          new: true,
        }
      );

      if (!updateProfile) {
        return res.status(400).send({
          success: false,
          message: "User account updated successfully",
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "User account updated successfully",
          data: updateProfile,
        });
      }
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* UPDATE STATE USER */
_user.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "User account Active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "User account In-Active successfully";
        break;

      case "6":
        filter = {
          stateId: 6, // 2 => INACTIVE
        };
        resp = "User account rejected successfully";
        break;

      default:
    }

    let updateState;

    updateState = await USER.findByIdAndUpdate(
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
      await setResponseObject(req, false, "User account stateId not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* DELETE USER */
_user.delete = async (req, res, next) => {
  try {
    const deleteData = await USER.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "User deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "User not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* DELETE USER */
_user.deleteAccount = async (req, res, next) => {
  try {
    const deleteData = await USER.findByIdAndUpdate(
      {
        _id: req.userId,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Account deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Account not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*CONTACT-US FORM*/
_user.contactUs = async (req, res, next) => {
  try {
    let data = req.body;
    let from = data.from;
    let subject = data.subject;
    let text = data.text;

    await nodemailer.contactUs(from, subject, text);

    return res.status(HTTP.SUCCESS).send({
      success: true,
      message: GENERAL_MESSAGE(
        "Your query has been successfully, we will contact you soon"
      ),
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*SEND MAIL*/
_user.passwordLink = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser = await USER.findOne({
      email: data?.email.trim(),
      stateId: { $ne: CONST.DELETED },
      roleId: data.roleId,
    });

    if (!findUser) {
      return res.status(400).send({
        message: "Account not registered with this email",
        success: false,
      });
    }
    if (findUser.roleId != data.roleId) {
      return res.status(400).send({
        message: "Your not allowed to perform this action.",
        success: false,
      });
    }

    // let link = `https://offarat.toxsl.in/reset-password?email=${data.email}&type=forget`;
    // let sendMail = await nodemailer.resetPasswordLink(data.email, link);

    // Generate a simple token using email and timestamp
    const timestamp = Date.now();
    const token = Buffer.from(`${data.email}:${timestamp}`).toString("base64");
    const expires = timestamp + 15 * 60 * 1000;

    // Store the token and expiration in the user document
    findUser.resetPasswordToken = token;
    findUser.resetPasswordExpires = expires;

    await findUser.save();

    // Create the reset password link
    let link = `https://www.offarat.com/reset-password?email=${data.email}&type=forget&token=${token}&roleId=${data?.roleId}`;
    let sendMail = await nodemailer.resetPasswordLink(data.email, link);

    await setResponseObject(
      req,
      true,
      "Please check your email, we have sent a password recovery link to your email."
    );
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_user.expireLink = async (req, res, next) => {
  const { email, token } = req.body;
  const decoded = Buffer.from(token, "base64").toString("utf-8");
  const [userEmail, timestamp] = decoded.split(":");
  const user = await USER.findOne({
    email: userEmail,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    await setResponseObject(
      req,
      false,
      "Password reset token is invalid or has expired."
    );
    next();
    return;
  } else {
    await setResponseObject(req, true, "");
    next();
  }
};

/*NOTIFY ME*/
_user.notifyMe = async (req, res, next) => {
  try {
    let user = await USER.findById({ _id: req.userId });
    user.isNotify = !user.isNotify;
    let result = await user.save();
    result.password = undefined;
    if (result) {
      return res.status(HTTP.SUCCESS).send({
        success: false,
        message: "Data Updated Successfully",
        data: result,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Something Went Wrong",
        data: {},
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN GET DASHBOARD DATA*/
_user.dashboardCount = async (req, res, next) => {
  try {
    let totalUser = await USER.countDocuments({
      stateId: { $ne: CONST.DELETED },
      roleId: { $ne: CONST.ADMIN },
    });
    let userCount = await USER.countDocuments({
      stateId: CONST.ACTIVE,
      roleId: { $ne: CONST.ADMIN },
      roleId: CONST.USER,
    });
    let sellerCount = await USER.countDocuments({
      stateId: CONST.ACTIVE,
      roleId: { $ne: CONST.ADMIN },
      roleId: CONST.SALES,
    });

    let totalOrders = await ORDER.countDocuments();
    let totalTransaction = await PAYMENT.find();

    let subTotal = 0;
    let sum = [];

    totalTransaction.forEach((e) => {
      if (e.amount !== null && e.amount !== undefined) {
        sum.push(e.amount);
        subTotal += e.amount;
      }
    });

    let errorCount = await Error_Logs.countDocuments({});

    return res.status(200).send({
      message: "",
      success: true,
      data: {
        totalUser,
        userCount,
        sellerCount,
        totalOrders,
        subTotal,
        errorCount,
      },
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN GET GRAPH DATA*/
_user.graphData = async (req, res, next) => {
  try {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const collections = ["users", "orders", "payments"];
    const result = [];

    for (const month of allMonths) {
      const monthlyCounts = [month];

      for (const collectionName of collections) {
        let currentYear = req.params.year
          ? req.params.year
          : new Date().getFullYear();

        const lastDay = new Date(
          currentYear,
          allMonths.indexOf(month) + 1,
          0
        ).getDate();

        const query = {
          createdAt: {
            $gte: new Date(`${month} 01, ${currentYear}`),
            $lte: new Date(`${month} ${lastDay}, ${currentYear}`),
          },
        };
        let count;

        if (collectionName === "users") {
          // Total users/seller
          count = await USER.countDocuments({
            $and: [
              { roleId: { $ne: CONST.ADMIN } },
              { stateId: { $ne: CONST.DELETED } },
            ],
            ...query,
          });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "users") {
          // Total users

          count = await USER.countDocuments({
            $and: [
              { stateId: CONST.ACTIVE },
              { roleId: { $ne: CONST.ADMIN } },
              { roleId: CONST.USER },
            ],
            ...query,
          });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "users") {
          // Total seller

          count = await USER.countDocuments({
            $and: [
              { stateId: CONST.ACTIVE },
              { roleId: { $ne: CONST.ADMIN } },
              { roleId: CONST.SALES },
            ],
            ...query,
          });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "orders") {
          // Total order
          count = await ORDER.countDocuments({ ...query });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "payments") {
          // Total payment
          let totalTransaction = await PAYMENT.find({ ...query });

          let subTotal = 0;
          let sum = [];

          totalTransaction.forEach((e) => {
            if (e.amount !== null && e.amount !== undefined) {
              sum.push(e.amount);
              subTotal += e.amount;
            }
          });
          monthlyCounts.push(subTotal || 0);
        }
      }

      result.push(monthlyCounts);
    }
    return res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*CREATE APP CRUSH*/
_user.createAppCrash = async (req, res, next) => {
  try {
    let data = req.body;
    data.createdBy = req.userId;

    let save = await Error_Logs.create(data);
    if (!save) {
      await setResponseObject(req, false, "App Crash not save");
      next();
    } else {
      await setResponseObject(req, true, "App Crash save successfully", save);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER APP CRUSH LIST*/
_user.getUserApiLogs = async (req, res, next) => {
  try {
    const result = await Error_Logs.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: {
          createdBy: { $eq: new mongoose.Types.ObjectId(req.userId) },
        },
      },
    ]);

    if (result && result.length > 0) {
      await setResponseObject(
        req,
        true,
        "Error list found successfully",
        result[0]
      );
      next();
    } else {
      await setResponseObject(req, true, "Error list not found", {});
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER DASHBOARD COUNT*/
_user.userDashboardCount = async (req, res, next) => {
  try {
    let totalOrder = await ORDER.countDocuments({
      createdBy: req.userId,
      deliveryStatus: { $ne: CONST.CANCELED },
    });

    let myPoints = await POINT.findOne({
      userId: req.userId,
    });

    let myWallet = await WALLET.findOne({
      userId: req.userId,
    });

    let walletAmount;

    if (myWallet !== null) {
      walletAmount = myWallet?.amount;
    } else {
      walletAmount = 0;
    }

    let wallet = formatNumber(walletAmount);

    let points = myPoints?.points ? myPoints?.points : 0;

    return res.status(200).send({
      message: "",
      success: true,
      data: { totalOrder, walletAmount: wallet, points },
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**Download REPORT*/
_user.downloadLoginReport = async (req, res, next) => {
  try {
    const start = new Date(req.query.startDate); // Convert to Date object
    const end = new Date(req.query.endDate); // Convert to Date object

    let findActivity = await USER.aggregate([
      {
        $match: {
          $and: [
            { stateId: { $ne: CONST.DELETED } },
            { roleId: { $ne: CONST.ADMIN } },
            {
              $or: [
                {
                  $and: [
                    { createdAt: { $gte: start } }, // Compare createdAt with start
                    { createdAt: { $lte: end } }, // Compare createdAt with end
                  ],
                },
                { country: req.query.country },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "wallets",
          let: { id: "$_id" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$userId"] }, // primary key (auths)
              },
            },
          ],

          as: "walletDetails",
        },
      },
      {
        $unwind: { path: "$walletDetails", preserveNullAndEmptyArrays: true },
      },
    ]);

    if (findActivity.length > 0) {
      async function generateExcel(findActivity) {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Order Details");
        // Prepare the data for the Excel file
        const data = [
          [
            "User Name",
            "First Name",
            "Last Name",
            "Email",
            "Phone",
            "Country",
            "CreatedAt",
            "Login Type",
            "Wallet Start Date",
            "Wallet Update Date",
            "Wallet Amount",
          ],
        ];

        // Assuming findPromo is an array of objects
        findActivity?.forEach((userLoginData) => {
          data.push([
            userLoginData?.fullName,
            userLoginData?.firstName,
            userLoginData?.lastName,
            userLoginData?.email,
            userLoginData?.countryCode + " " + userLoginData?.mobile,
            userLoginData?.country ? userLoginData?.country : "-",
            `${moment(userLoginData?.createdAt)
              .format("DD-MMM-YYYY")
              .toUpperCase()}`,
            userLoginData?.stateId == CONST.ACTIVE ? "Active" : "Inactive",
            userLoginData?.walletDetails?.createdAt
              ? `${moment(userLoginData?.walletDetails?.createdAt)
                  .format("DD-MMM-YYYY")
                  .toUpperCase()}`
              : "-",
            userLoginData?.walletDetails?.updatedAt
              ? `${moment(userLoginData?.walletDetails?.updatedAt)
                  .format("DD-MMM-YYYY")
                  .toUpperCase()}`
              : "-",
            userLoginData?.walletDetails?.amount
              ? userLoginData?.walletDetails?.amount
              : "-",
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
        const excelPath = `../uploads/invoice/loginData-${generateOTP(6)}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(findActivity);
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
      await setResponseObject(req, true, "There is not data for this user ");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Active category list*/
_user.activeUserList = async (req, res, next) => {
  try {
    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      // Function to escape special regex characters
      const escapeRegex = (text) => {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
      };

      const searchTerm = escapeRegex(
        req.query.search.replace(new RegExp("\\\\", "g"), "\\\\")
      );

      searchFilter.$or = [
        {
          firstName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          fullName: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    const list = await USER.aggregate([
      {
        $match: {
          stateId: CONST.ACTIVE,
          roleId: CONST.USER,
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
          fullName: 1,
          firstName: 1,
          lastName: 1,
        },
      },
      {
        $match: searchFilter,
      },
    ]);
    if (list.length > 0) {
      await setResponseObject(req, true, "User list found successfully", list);
      next();
    } else {
      await setResponseObject(req, true, "User list not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*SEND MAIL*/
_user.resendEmail = async (req, res, next) => {
  try {
    let data = req.body;
    let sendMail = await nodemailer.sendMail(
      data.email,
      data.subject,
      data.description
    );

    await setResponseObject(req, true, "Email resend successfully");
    next();
  } catch (error) {
    // Check if the error message indicates a quota issue
    if (
      error.message.includes("Message would take you over your relay quota")
    ) {
      await setResponseObject(
        req,
        false,
        "You have reached your email sending quota. Please try again later."
      );
    } else {
      await setResponseObject(req, false, error.message, "");
    }
    next();
  }
};

/*Update user wallet*/
_user.updateWallet = async (req, res, next) => {
  try {
    let updateWallet;
    let cashBackData;
    let createCashback;
    let data = req.body;

    let amount = formatNumber(data?.cashBack);
    let deductedAmount = formatNumber(data?.deductedCashBack);
    let findUser = await USER.findOne({ _id: req.params.id });
    let walletExist = await WALLET.findOne({ userId: req.params.id });

    if (data?.showDeductionWallet == true) {
      // let lastCashback = await CASHBACK.findOne({ createdBy: findUser?._id })
      //   .sort({ createdAt: -1 })
      //   .limit(1);

      // let updateCashback = await CASHBACK.findOneAndUpdate({
      //   _id: lastCashback?._id,
      // });

      cashBackData = {
        deductedCashBack: deductedAmount,
        createdBy: new mongoose.Types.ObjectId(findUser?._id),
        description: data?.description,
      };

      createCashback = await CASHBACK.create(cashBackData);

      updateWallet = await WALLET.findOneAndUpdate(
        { _id: walletExist._id },
        { amount: Number(walletExist.amount) - Number(deductedAmount) },
        { new: true }
      );

      res.status(200).send({
        success: true,
        message: "Cashback updated successfully",
      });
    } else {
      cashBackData = {
        cashBack: amount,
        startDate: data?.startDate,
        endDate: data?.endDate,
        createdBy: new mongoose.Types.ObjectId(findUser?._id),
        description: data?.description,
      };
      createCashback = await CASHBACK.create(cashBackData);

      await nodemailer.walletMail(
        findUser.email,
        findUser.fullName,
        data.cashBack,
        data.startDate,
        data.endDate,
        data.description
      );

      let now = new Date();
      let todayDate = moment(now).format("YYYY-MM-DD");

      if (data?.startDate == todayDate) {
        if (walletExist) {
          updateWallet = await WALLET.findOneAndUpdate(
            { _id: walletExist._id },
            { amount: Number(walletExist.amount) + Number(amount) },
            { new: true }
          );
          const cashbackUpdate = await CASHBACK.findOneAndUpdate(
            { _id: createCashback._id },
            { isAdded: true },
            { new: true }
          );
          res.status(200).send({
            success: true,
            message: "Cashback added successfully",
            data: updateWallet,
          });
          next();
        } else {
          let payload = {
            userId: req.params.id,
            amount: amount,
          };
          let createWallet = await WALLET.create(payload);
          const cashbackUpdate = await CASHBACK.findOneAndUpdate(
            { _id: createCashback._id },
            { isAdded: true },
            { new: true }
          );
          res.status(200).send({
            success: true,
            message: "Cashback added successfully",
            data: createWallet,
          });
          next();
        }
      } else {
        res.status(200).send({
          success: true,
          message: "Cashback added successfully",
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*Update user points*/
_user.updatePoint = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser = await USER.findOne({ _id: req.params.id });

    let pointExist = await POINT.findOne({ userId: req.params.id });
    await nodemailer.pointsMail(findUser.email, findUser.fullName, data.points);
    if (pointExist) {
      let updatePoint = await POINT.findOneAndUpdate(
        { _id: pointExist._id },
        { points: data.points },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "User points updated successfully",
        data: updatePoint,
      });
      next();
    } else {
      let payload = {
        userId: req.params.id,
        points: data.points,
      };
      let createPoint = await POINT.create(payload);
      res.status(200).send({
        success: true,
        message: "User points updated successfully",
        data: createPoint,
      });
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*My cash back*/
_user.myCashBack = async (req, res, next) => {
  try {
    let findUser = await USER.findOne({ _id: req.userId });
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit = parseInt(req.query.pageLimit) || 10;
    const cashBackList = await CASHBACK.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { id: "$orderId" }, // foreign key
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] }, // primary key (auths)
              },
            },
          ],

          as: "orderDetails",
        },
      },
      {
        $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true },
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

    if (cashBackList && cashBackList[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Cashback list found successfully",
        cashBackList[0].data,
        cashBackList[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Cashback list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = _user;
