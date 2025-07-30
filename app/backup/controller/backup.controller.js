/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var exec = require("child_process").exec;
const dotenv = require("dotenv");
const fs = require("fs");
const Path = require("path");
const logger = require("winston");
dotenv.config();
const { CONST } = require("../../../helpers/constant");
const { DB_BACKUP_MODEL } = require("../model/backup.model");
const moment = require("moment");
const { setResponseObject } = require("../../../middleware/commonFunction");

_BACKUP = {};

_BACKUP.create = async (req, res, next) => {
  var counter = await DB_BACKUP_MODEL.find();
  counter = counter.length;

  var filename =
    CONST.backupFileName +
    counter +
    "_" +
    Math.floor(10 + Math.random() * 90) +
    "_" +
    new Date().toJSON().slice(CONST.FileNAmeSliceFrom, CONST.FileNAmeSliceTo) +
    ".zip";

  var fileTitle =
    "baseProject" +
    "_" +
    counter +
    "_" +
    moment().format("YYYY_MM_DD").toString();

  if (!fs.existsSync(CONST.backupDirPath)) {
    fs.mkdirSync(CONST.backupDirPath);
  }
  //creating command for backup
  let cmd =
    "mongodump" +
    " --db " +
    "baseProject" +
    " --gzip" +
    " --archive=" +
    CONST.backupDirPath +
    filename;

  //executing the command for backup
  new exec(cmd, (error, stdout, stderr) => {
    if (error) {
      logger.info(error);
    } else {
      let file = fs.statSync(CONST.backupDirPath + filename);
      payload = {
        name: fileTitle,
        path: CONST.backupDirPath + filename,
        baseFolder: "backupDump",
        folder: filename,
        size: file.size,
        link: process.env.SERVER_API_URL + "/api/backupDump/" + filename,
      };
      async function save() {
        let save = await DB_BACKUP_MODEL(payload).save();
      }
      save();
      res.status(200).send({
        success: true,
        message: "backup created successfully",
      });
    }
  });
};

_BACKUP.listing = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || CONST.PAGE_NO;
    let pageLimit = parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;
    let result = await DB_BACKUP_MODEL.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          data: [
            { $skip: pageLimit * (page - CONST.PAGE_NO) },
            { $limit: pageLimit },
          ],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    if (result && result[0].data.length) {
      await setResponseObject(
        req,
        true,
        "Backup found successfully",
        result[0].data,
        result[0].count[0].count,
        page,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "Backup not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, error.stack);
    next();
  }
};

_BACKUP.download = async (req, res, next) => {
  try {
    let download = await DB_BACKUP_MODEL.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: download,
    });
  } catch (err) {
    logger.info(err);
    res.status(400).send("Bad Request");
  }
};

_BACKUP.deletebackup = async (req, res, next) => {
  try {
    let backup = await DB_BACKUP_MODEL.findById(req.params.id);

    if (backup) {
      // check if user already has profile image, if yes then delete previous image from respective directory
      fs.stat(backup.folder, function (err, stat) {
        if (err == null) {
          //Exist, remove previous image from directory
          fs.unlinkSync(backup.folder, async (err) => {
            if (err) {
              logger.warn(`error ${err}`);
            } else {
              logger.warn(`file was deleted`);
            }
          });
        } else if (err.code == "ENOENT") {
          // NOT exist
          logger.warn(`file doesnot exists`);
        }
      });
      await DB_BACKUP_MODEL.findByIdAndRemove(req.params.id);
      res.status(200).send({
        message: "backup deleted successfully",
      });
    } else {
      res.status(400).send({
        message: "backup failed to delete",
      });
    }
  } catch (err) {
    logger.info(err);
  }
};

_BACKUP.delete = async (req, res, next) => {
  try {
    const backup = await DB_BACKUP_MODEL.findById(req.params.id);
    if (!backup) {
      return res.status(404).send({
        success: false,
        message: "Backup not found",
      });
    }
    const deleteFolderRecursive = (filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };
    deleteFolderRecursive(backup.path);

    await DB_BACKUP_MODEL.findByIdAndDelete(req.params.id);
    await setResponseObject(req, true, "Backup deleted successfully", "");

    next();
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "An error occurred while deleting the backup",
    });
  }
};

_BACKUP.downloadZip = async (req, res, next) => {
  try {
    if (!fs.existsSync("./backupDump/zip_file")) {
      fs.mkdirSync("./backupDump/zip_file");
    }
    let download = await DB_BACKUP_MODEL.findById(req.params.id);

    let cmd = `zip -r ${download.path}.zip /backupDump/zip_file/`;
    new exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger.info(error);
      } else {
        res.status(200).send({
          success: true,
          message: "backup created",
          stdout,
        });
      }
    });
  } catch (err) {
    logger.info(err);
    res.status(400).send("Bad Request");
  }
};

module.exports = _BACKUP;
