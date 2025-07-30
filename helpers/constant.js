/*
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
// constant values set for date check, failure status, crypt token
module.exports.CONST = {
  backupFileName: "backup_",
  FileNAmeSliceFrom: 0,
  FileNAmeSliceTo: 10,
  backupDirPath: "./backupDump/",
  PAGE_NO: 1,
  PAGE_LIMIT: 10,

  ADMIN: 1,
  USER: 2,
  SALES: 3,
  PROMOTION_USER: 4,
  DESIGNED_USER: 5,

  ACTIVE: 1,
  INACTIVE: 2,
  DELETED: 3,
  BAN: 4,
  PENDING: 5,
  REJECT: 6,
  OUT_STOCK: 7,
  SHIPPED: 8,
  COMPLETED: 9,
  CANCELED: 10,
  READY: 11,
  UNDERPROCESS: 12,
  ORDERDELETED: 13,

  MALE: 1,
  FEMALE: 2,
  OTHERS: 3,

  ABOUT: 1,
  PRIVACY: 2,
  TERMS: 3,
  REPORT: 4,
  RETURN_POLICY: 5,

  SUCCESS: 1,
  FAILED: 2,

  WEB: 1,
  ANDROID: 2,
  IOS: 3,

  LOGIN: 1,
  LOGIN_FAIL: 2,

  TRUE: 1,
  FALSE: 2,

  NOTIFICATION_OFF: 1,
  NOTIFICATION_ON: 2,

  NEW: 0,
  REPLIED: 1,

  COMPANY: 2,

  PRODUCT: 1,
  ORDER: 2,
  OFFERE: 3,
  NOTIFICATION_COMPANY: 4,
  ADMIN_NOTIFICATION: 5,
  COMPANY_NOTIFICATION: 6,

  ONLINE: 1,
  OFFLINE: 2,
  WALLETS: 3,

  HOME: 1,
  OFFICE: 2,
  OTHER: 3,

  ALL: 1,
  CATEGORY: 2,
  PROMO_COMPANY: 3,

  DELIVERY: 1,
  PICKUP: 2,
  COUPON: 3,

  RADIO: 1,
  TEXT: 2,

  APPROVE: 7,
  REFUND: 8,

  WALLET: 1,
  ACCOUNT: 2,

  PROMOTION: 1,
  CASHBACK: 2,

  OFFARAT: 1,
  SUPPLIER: 2,
  SHARE: 3,

  CHEQUE: 1,
  BANK_TRANSFER: 2,
  LINK: 3,
  ONLINE_TRANSFER: 4,
  ADVANCE: 5,
  PAYPAL: 6,

  ONE_TIME: 1,
  SEVERAL_TIME: 2,

  INVOICE: 1,
  COMMISION: 2,
  PAYMENT: 3,

  PERCENTAGE: 1,
  FIX_AMOUNT: 2,
  FREE_DELIVERY: 3,
  HARD_LUCK: 4,
  REFERRAL: 5,

  HEIGH: 1,
  MEDIUM: 2,
  LOW: 3,

  ERROR_TYPE: {
    API: 1,
    APP: 2,
    WEB: 3,
  },
  ERROR: 2,
};
