/** 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const SCHEMA = mongoose.Schema;

let dynamicquestion = new SCHEMA(
  {
    question: {
      type: String,
    },

    answerType: {
      type: Number,
      enum: [CONST.RADIO, CONST.TEXT],
      default: CONST.RADIO,
    },

    isMandatory: {
      type: Boolean,
      default: false,
    },

    answers: [
      {
        answer_text: {
          type: String,
        },
        id: {
          type: Number,
        },
      },
    ],

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },


    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    productId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
        default: "",
      },
    ],

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

let answer = new SCHEMA(
  {
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "dynamicquestion",
          autopopulate: true,
        },
        answerId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "dynamicquestion.answers",
        },
        _id: false,
      },
    ],

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports.ANSWER_MODEL = mongoose.model("answers", answer);

module.exports.QUESTION_MODEL = mongoose.model(
  "dynamicquestion",
  dynamicquestion
);
