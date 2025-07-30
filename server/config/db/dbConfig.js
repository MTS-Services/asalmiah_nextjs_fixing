/** 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
let dotenv = require("dotenv");
let logger = require("winston");
dotenv.config();

// Connect with MongoDB using mongoose at default port 27017
try {
    mongoose
        .connect(process.env.DB_URL)
        .then(() => logger.info(
            `Database connected ${process.env.DB_URL}`
        ));
}
catch (error) {
    console.error("error", error);
}
