const { Schema, model } = require("mongoose");
const ticketCreateSchema = new Schema({
  GuildID: String,
  OwnerID: String,
  MembersID: [String],
  ChannelID: String,
  TicketCount: String,
  Locked: Boolean,
  Claimed: Boolean,
  ClaimedBy: String,
  Requested: Boolean,
});

module.exports = model("guildTickets", ticketCreateSchema, "guildTickets");