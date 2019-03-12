const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let BlubsReportSchema = new Schema(
  {
    id: { type: String, required: true },
    blubOnOffHistory: { type: Array }
  },
  {
    collection: "blubsReport"
  }
);

module.exports = mongoose.model("BlubsReport", BlubsReportSchema);
