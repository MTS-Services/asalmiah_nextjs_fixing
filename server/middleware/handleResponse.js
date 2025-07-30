/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { HTTP } = require("../helpers/http-status-code");
const responseMessage = require("./responseMessage");

module.exports.RESPONSE = async (req, res, next) => {
  try {
    if (req.newRespData) {
      if (req.newRespData.success) {
        res.status(HTTP.SUCCESS).json(req.newRespData);
      } else {
        res.status(HTTP.BAD_REQUEST).json(req.newRespData);
        next(400, req, res)
      }
    }
  } catch (error) {
    let respObject = {
      message: responseMessage["SOMETHING_WRONG"]
    }
    res.status(HTTP.SERVER_ERROR).json(respObject);
    next(400, req, res)
  }

};
