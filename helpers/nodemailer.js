/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const nodemailer = require("nodemailer");
const { EMAIL_LOGS } = require("../app/errorLogs/model/logModal");
const { CONTACTINFO } = require("../app/contactInfo/model/model");
const { CONST } = require("../helpers/constant");
const {
  FORGOT_PASSWORD_OTP,
  ADD_USER_MAIL,
  ACCOUNT_VERIFICATION_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  WELCOME_NOTIFY_EMAIL_TEMPLATE_FOR_ADMIN,
  RESET_PASSWORD_LINK,
  COUPON_TEMPLATE,
  ORDER_INCOICE,
  SELLER_ORDER_TEMPLATE,
  WALLET_EMAIL,
  POINT_EMAIL,
  NOTIFY_COMPANY,
  NOTIFY_CHANGE_PASSWORD,
  REFUND_REQUEST,
} = require("../helpers/email_template");
const { SMTP } = require("../app/smtp/model/smtp.model");
const dotenv = require("dotenv");
const notification = require("../app/notification/controller/notification.controller");
dotenv.config();

module.exports = {
  async sendMail(to, subject, html, pdfArray = "") {
    const smtpData = await SMTP.findOne({ stateId: CONST.ACTIVE });

    const smtp = {
      host: smtpData?.host ? smtpData?.host : process.env.SMTP_HOST,
      port: smtpData?.port ? smtpData?.port : process.env.SMTP_PORT,
      email: smtpData?.email ? smtpData?.email : process.env.SMTP_AUTH_EMAIL,
      password: smtpData?.password
        ? smtpData?.password
        : process.env.SMTP_AUTH_PASSWORD,
    };

    const transporter = nodemailer.createTransport({
      // create smtp protocol values
      host: smtp.host,
      port: smtp.port,
      secure: false,
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
    });

    let mailOptions = {
      from: smtp.email,
      to: to,
      subject: subject,
      html: html,
      cc: "support@offarat.com",
    };

    if (pdfArray) {
      mailOptions.attachments = pdfArray;
    }

    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions, async (err, res) => {
        if (err) {
          reject(Error(err.message));
          // Log the error
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.FAILED,
          }).save();
          resolve(null);
        } else {
          // Log success
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.SUCCESS,
          }).save();
          resolve(0);
        }
      });
    });
  },

  async forgotPassword(email, username, otp) {
    const subject = "Otp for restore password";
    const html = FORGOT_PASSWORD_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async resendOtp(email, username, otp) {
    const subject = "Rend Otp for restore password";
    const html = RESEND_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async signUp(email, username, otp) {
    const subject = "Verify Email !";
    const html = ACCOUNT_VERIFICATION_TEMPLATE(username, otp);
    const sendMail = this.sendMail(email, subject, html);
  },

  async welcomeMail(email, username, countryCode, mobile) {
    const subject = "Welcome email";
    const html = WELCOME_EMAIL_TEMPLATE(username, email, countryCode, mobile);
    const sendMail = this.sendMail(email, subject, html);
  },

  async notificationMailForAdminRegardingNewUserRagiester(
    userName,
    email,
    countryCode,
    mobile,
    adminEmail
  ) {
    const subject = "New User register";
    const html = WELCOME_NOTIFY_EMAIL_TEMPLATE_FOR_ADMIN(
      userName,
      email,
      countryCode,
      mobile
    );
    const sendMail = this.sendMail(adminEmail, subject, html);
  },

  async addUser(email, password) {
    const subject = `Login credential for ${process.env.PROJECT_NAME}`;
    const html = ADD_USER_MAIL(email, password);
    const sendMail = this.sendMail(email, subject, html);
  },

  async changePasswordLink(email, link) {
    const subject = `Your password change on ${process.env.PROJECT_NAME}`;
    const html = NOTIFY_CHANGE_PASSWORD(link);
    const sendMail = this.sendMail(email, subject, html);
  },

  async resetPasswordLink(email, link) {
    const subject = `Reset password link for ${process.env.PROJECT_NAME}`;
    const html = RESET_PASSWORD_LINK(link);
    const sendMail = this.sendMail(email, subject, html);
  },

  async sellerOrderEmail(
    email,
    companyName,
    username,
    area,
    address,
    mobile,
    invoiceNumber,
    payBy,
    date,
    delivery,
    products,
    subTotal,
    discount,
    deliveryCharge,
    total,
    contactMobile
  ) {
    const subject = "New order place";
    const html = SELLER_ORDER_TEMPLATE(
      username,
      companyName,
      area,
      address,
      mobile,
      invoiceNumber,
      payBy,
      date,
      delivery,
      products,
      subTotal,
      discount,
      deliveryCharge,
      total,
      contactMobile
    );
    let sendMail = this.sendMail(email, subject, html);
  },

  async couponEmail(
    email,
    companyName,
    username,
    area,
    address,
    mobile,
    invoiceNumber,
    payBy,
    date,
    delivery,
    products,
    subTotal,
    discount,
    deliveryCharge,
    total,
    contactMobile,
    couponArray
  ) {
    const subject = "New order place";
    const html = COUPON_TEMPLATE(
      companyName,
      username,
      area,
      address,
      mobile,
      invoiceNumber,
      payBy,
      date,
      delivery,
      products,
      subTotal,
      discount,
      deliveryCharge,
      total,
      contactMobile,
      couponArray
    );
    let sendMail = this.sendMail(email, subject, html);
  },

  async userOrderInvoice(
    email,
    companyName,
    username,
    area,
    address,
    mobile,
    invoiceNumber,
    payBy,
    date,
    delivery,
    products,
    subTotal,
    discount,
    deliveryCharge,
    total,
    contactMobile
  ) {
    const subject = "New order place";
    const html = ORDER_INCOICE(
      username,
      companyName,
      area,
      address,
      mobile,
      invoiceNumber,
      payBy,
      date,
      delivery,
      products,
      subTotal,
      discount,
      deliveryCharge,
      total,
      contactMobile
    );
    let sendMail = this.sendMail(email, subject, html);
  },

  async walletMail(email, username, amount, startDate, endDate, description) {
    const subject = "Cash back email";
    const html = WALLET_EMAIL(
      username,
      amount,
      startDate,
      endDate,
      description
    );
    const sendMail = this.sendMail(email, subject, html);
  },

  async pointsMail(email, username, points) {
    const subject = "Refferal points created email";
    const html = POINT_EMAIL(username, points);
    const sendMail = this.sendMail(email, subject, html);
  },

  async notifytDelivertMail(email, deliveryCompany, orderId) {
    const subject = "Email for not deliverable items.";
    const html = NOTIFY_COMPANY(deliveryCompany, orderId);
    const sendMail = this.sendMail(email, subject, html);
  },

  async refundRequest(email, orderId) {
    const subject = `Refund request created for order ${orderId}`;
    const html = REFUND_REQUEST(orderId);
    const sendMail = this.sendMail(email, subject, html);
  },
};
