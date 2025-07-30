const { mongoose, Schema } = require("mongoose");

const webhookSchema = new Schema(
  {
    record: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports.webhooks = mongoose.model("webhook", webhookSchema);


const webhookArmadaSchema = new Schema(
  {
    record: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports.armadaWebhooks = mongoose.model("armadaWebhook", webhookArmadaSchema);