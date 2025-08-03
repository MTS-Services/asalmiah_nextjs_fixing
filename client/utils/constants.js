export const constant = Object.freeze({
  EMPTY_RECORD: "No Record Found",
  // role id
  ADMIN: 1,
  USER: 2,
  SALES: 3,

  PROMOTION_USER: 4,
  DESIGNED_USER: 5,

  // gender
  MALE: 1,
  FEMALE: 2,
  GENDER_OTHERS: 3,
  // cms

  TERMS_CONDITIONS: 3,
  PRIVACY_POLICY: 2,
  ABOUT_US: 1,
  REPORT: 4,
  REFUND_POLICY: 5,
  //state id
  ACTIVE: 1,
  INACTIVE: 2,
  DELETED: 3,
  BAN: 4,
  PENDING: 5,
  REJECT: 6,

  CATEGORY_ACTIVE: 0,

  // product specific state id
  // 1 => ACTIVE, 2 => INACTIVE, 3 => out of stock, 4 => DELETED, 5 => Discontinued, 6 => Banned/reported
  PRODUCT_OUTOFSTOCK: 3,
  PRODUCT_DISCONTINUED: 5,
  PRODUCT_BANNED: 6,

  // Pagination
  PER_PAGE: 10,

  ZERO: 0,
  ONE: 1,
  // contact us constant
  COMPLAIN: 1,
  SUGGESTION: 2,
  FEEDBACK: 3,
  ENQUIRY: 4,
  DELAY: 5,
  OTHER: 6,
  SUCCESS: 1,
  FAILED: 2,
  // payment
  COD: "0",
  UPI: "1",
  //Payment Type
  PAYMENT_TYPE_COD: 2,
  PAYMENT_TYPE_ONLINE: 1,
  WALLET: 3,
  CANCELLED_ORDER: 3,
  //Delivery Status
  DELIVERY_PENDING: 1,
  DELIVERY_ACCEPTED: 2,
  DELIVERY_CANCELLED: 3,
  DELIVERY_PACKAGING: 4,
  DELIVERY_ON_THE_WAY: 5,
  DELIVERY_DELIVERED: 6,

  // ORDER_STATUS
  ORDER_PENDING: 1,
  ORDER_ACTIVE: 2,
  ORDER_INACTIVE: 3,
  ORDER_COMPLETED: 4,
  ORDER_CANCELLED: 5,
  ORDER_DELETED: 6,
  // address location
  HOME: "0",
  OFFICE: "1",
  OTHERS: "2",

  // Store Status
  // 0 = active 1 => inactive 2 => delete
  STORE_ACTIVE: "0",
  STORE_INACTIVE: "1",
  STORE_DELETE: "2",

  //EMAIL QUEUE STATUS

  READ: 1,
  UNREAD: 0,
  NEW_ACTIVE: 0,
  NEW_INACTIVE: 1,
  NEW_DELETE: 2,

  // Complaint  delete
  COMPLAINT_DELETED: 3,
  DOLLAR: "$",
  PHONE: "2",
  EMAIL: "1",
  API: 1,
  APP: 2,
  WEB: 3,
  All: 1,
  CATEGORY: 2,
  SUBCATEGORY: 3,
  COMPANY: 4,

  ORDER_PENDING_STATUS: 5,
  ORDER_SHIPPE_STATUS: 8,
  ORDER_COMPLETED_STATUS: 9,
  ORDER_CANCELED_STATUS: 10,
  ORDER_READY_STATUS: 11,
  ORDER_ONLINE_INPROCESS: 12,
  ORDER_APPROVE: 7,
  ORDER_REJECT: 6,

  PRODUCT_STOCK: 6,
  PRODUCT_OUTOFSTOCK: 7,
  RADIO: 1,
  TEXT: 2,
  PRODUCT_DELTED: 3,
  FIX: 2,
  PERCENTAGE: 1,
  FREE_DELIVERY: 3,
  HARD_LUCK: 4,
  REFERRAL: 5,

  ENABLE: 1,
  DISABLE: 2,

  FIX_AMOUNT: 2,

  CHEQUE: 1,
  BANK_TRANSFER: 2,
  LINK: 3,
  ONLINE_TRANSFER: 4,
  ADVANCE: 5,
  PAYPAL: 6,
  ANDROID: 2,
  IOS: 3,
});
export const Paginations = Object.freeze({
  DEFAULT_PAGE: 1,
  PER_PAGE: 10,
  PRODUCT_PER_PAGE: 12,
});
export const PROVIDERS = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
};
