const { Schema, model } = require("mongoose");
const ticketCreateSchema = new Schema({
  GuildID: String,
  TicketCount: String,
});

module.exports = model("ticketCount", ticketCreateSchema, "ticketCount");