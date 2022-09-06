const { Schema, model } = require("mongoose");
const ticketCreateSchema = new Schema({
  GuildId: String,
  Channel: String,
  Category: String,
  Transcript: String,
  SupportRole: String,
  ErrorLog: String
});

module.exports = model("ticketSchema", ticketCreateSchema, "ticketSetups");
