const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let lightListSchema = new Schema(
  {
    color: { type: String, required: true },
    size: { type: String, required: true },
    volt: { type: Number, required: true },
    lightTurnedOnTime: { type: String },
    lightTurnedOffTime: { type: String },
    isblubOn: { type: Boolean }
  },
  {
    collection: "lightlists"
  }
);

module.exports = mongoose.model("LightList", lightListSchema);
