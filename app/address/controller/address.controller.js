/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { ADDRESS } = require("../model/address.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const address = {};

/**
 * ADD ADDRESS if data come like this mobile: "+9639876543215"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
address.addAddress = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;

    if (!data.longitude && !data.latitude) {
      await setResponseObject(
        req,
        false,
        "Address longitude and longitude can't empty"
      );
      next();
      return;
    }

    const allowedCountryCodes = ["+962", "+965", "+971"];
    const mobileCountryCode = data.countryCode;

    if (!allowedCountryCodes.includes(mobileCountryCode)) {
      await setResponseObject(req, false, "This country code is not allowed.");
      next();
      return;
    }

    let exist = await ADDRESS.findOne({
      createdBy: req.userId,
      isDefault: true,
      stateId: { $ne: CONST.DELETED },
    });

    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data?.longitude, data?.latitude],
      };
    }

    if (exist) {
      data.isDefault = false;
    } else {
      data.isDefault = true;
    }

    const addAddress = await ADDRESS.create(data);
    if (addAddress) {
      await setResponseObject(
        req,
        true,
        "Address added successfully",
        addAddress
      );
      next();
    } else {
      await setResponseObject(req, false, "Address not added");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY ADDRESS LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
address.myAddress = async (req, res, next) => {
  try {
    const addressList = await ADDRESS.find({
      createdBy: req.userId,
      stateId: { $eq: CONST.ACTIVE },
    }).sort({
      createdAt: -1,
    });
    if (addressList) {
      await setResponseObject(
        req,
        true,
        "Address list found successfully",
        addressList
      );
      next();
    } else {
      await setResponseObject(req, true, "Address list not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * MY ADDRESS LIST
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
address.addressDetails = async (req, res, next) => {
  try {
    const addressDetails = await ADDRESS.findById({ _id: req.params.id });
    if (addressDetails) {
      await setResponseObject(
        req,
        true,
        "Address details found successfully",
        addressDetails
      );
      next();
    } else {
      await setResponseObject(req, true, "Address details not found");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * UPDATE ADDRESS
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
address.editAddress = async (req, res, next) => {
  try {
    const data = req.body;

    const allowedCountryCodes = ["+962", "+965", "+971"];
    const mobileCountryCode = data.countryCode;
    if (!allowedCountryCodes.includes(mobileCountryCode)) {
      await setResponseObject(req, false, "This country code is not allowed.");
      next();
      return;
    }

    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data?.longitude, data?.latitude],
      };
    }

    const dataUpdate = await ADDRESS.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );

    if (dataUpdate) {
      await setResponseObject(
        req,
        true,
        "Address updated successfully",
        dataUpdate
      );
      next();
    } else {
      await setResponseObject(req, false, "Address not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * SET DEFAULT ADDRESS
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
address.setDefaultAddress = async (req, res, next) => {
  try {
    const data = req.body;

    const isDefault = await ADDRESS.findOne({
      $and: [
        { createdBy: req.userId },
        { isDefault: true },
        { stateId: { $ne: CONST.DELETED } },
      ],
    });

    if (isDefault) {
      const updateDefault = await ADDRESS.findOneAndUpdate(
        { _id: isDefault._id },
        { isDefault: false },
        { new: true }
      );
    }
    const setDefault = await ADDRESS.findOneAndUpdate(
      { _id: req.params.id },
      { isDefault: data.isDefault },
      { new: true }
    );
    if (setDefault) {
      await setResponseObject(
        req,
        true,
        "Address set as default successfully",
        setDefault
      );
      next();
    } else {
      await setResponseObject(req, false, "Address not set as default");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * DELETE ADDRESS
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
address.deleteAddress = async (req, res, next) => {
  try {
    const deleteAddress = await ADDRESS.findByIdAndDelete(
      {
        _id: req.params.id,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );

    if (deleteAddress.isDefault == true) {
      const findAddres = await ADDRESS.findOne({ createdBy: req.userId });
      if (findAddres) {
        await ADDRESS.findByIdAndUpdate(
          { _id: findAddres._id },
          { isDefault: true },
          { new: true }
        );
      }
    }
    if (deleteAddress) {
      await setResponseObject(req, true, "Address deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Address not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = address;
