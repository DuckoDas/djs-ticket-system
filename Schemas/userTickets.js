const { Schema, model } = require("mongoose");
const ticketCreateSchema = new Schema({
  GuildID: String,
  TicketID: String,
  OwnerID: String,
  MembersID: [String],
  ChannelID: String,
  Locked: Boolean,
  Claimed: Boolean,
  ClaimedBy: String,
  Requested: Boolean,
});

module.exports = model("userTickets", ticketCreateSchema, "userTickets");
