/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const admin = require("firebase-admin");
const serviceAccount = require("./../config/offarat-aeebb-firebase-adminsdk-mlicz-c81e75ad33.json"); // Replace with the path to your service account JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const fcm = admin.messaging();

module.exports = {
  sendNotification: async (deviceToken, title, body, description, type) => {
    try {
      const message = {
        token: deviceToken,
        data: {
          title: title,
          body: body,
          description: description ? description : "",
          type: type ? type?.toString() : "",
        },
        notification: {
          title: title,
          body: body,
        },
      };
      const response = await fcm.send(message);
      console.log("Successfully sent message:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
};
