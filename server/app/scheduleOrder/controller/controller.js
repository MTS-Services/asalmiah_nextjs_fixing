/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { BRANCH_MODEL } = require("../../branch/model/model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const mongoose = require("mongoose");
const moment = require("moment");
const { CONST } = require("../../../helpers/constant");
const { SCHEDULE_ORDER } = require("../model/model");
const scheduleorder = {};

/**
 * Get slot list
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
scheduleorder.slotList = async (req, res, next) => {
  try {
    const findDay = await BRANCH_MODEL.findById({ _id: req.params.id });

    const currentDay = moment().format("dddd");
    const currentDayWorkingHours = findDay.workingHours.find(
      (day) => day.day === req.query.day
    );

    if (currentDayWorkingHours) {
      const startTime = currentDayWorkingHours.startTime;
      const endTime = moment(currentDayWorkingHours.endTime, "HH:mm:ss")
        .subtract(3, "hours") // Optional: Adjusting end time if needed
        .format("HH:mm:ss");

      const startTimeMoment = moment(startTime, "HH:mm:ss");
      const endTimeMoment = moment(endTime, "HH:mm:ss");

      const timeDiffHours = endTimeMoment.diff(startTimeMoment, "hours");

      const slots = [];
      for (let i = 0; i < timeDiffHours; i += 3) {
        // Increment by 3 hours
        const slotStartTime = moment(startTimeMoment)
          .add(i, "hours")
          .format("HH:mm");
        const slotEndTime = moment(slotStartTime, "HH:mm")
          .add(3, "hours") // Each slot lasts for 3 hours
          .format("HH:mm");
        slots.push({ startTime: slotStartTime, endTime: slotEndTime });
      }

      await setResponseObject(req, true, "Slots found successfully", slots);
      next();
    } else {
      await setResponseObject(
        req,
        false,
        `No working hours found for ${currentDay}`
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Schedule order
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
scheduleorder.scheduleOrder = async (req, res, next) => {
  try {
    const data = req.body;
    data.scheduleBy = req.body;
    const saveData = await SCHEDULE_ORDER.create(data);
    if (saveData) {
      await setResponseObject(
        req,
        true,
        "Order schedule successfully",
        saveData
      );
      next();
    } else {
      await setResponseObject(req, false, "Order not schedule");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = scheduleorder;
