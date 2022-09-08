const { EmbedBuilder, CommandInteraction } = require("discord.js");
const ticketData = require("../../../Structures/Schemas/ticketData");
const ticketCount = require("../../../Structures/Schemas/ticketCount");
const userData = require("../../../Structures/Schemas/guildTickets");
const { createTranscript } = require("discord-html-transcripts");
module.exports = {
  id: "ticketModal",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, channel } = interaction;

    const ticketDB = await ticketData.findOne({
      GuildId: interaction.guild.id,
    });
    if (!ticketDB)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#303135")
            .setDescription(`Can't find any data on the ticket system:/`),
        ],
        ephemeral: true,
      });

    const userDB = await userData.findOne({ GuildId: interaction.guild.id });
    if (!userDB)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#303135")
            .setDescription(`Can't find any data on this ticket:/`),
        ],
        ephemeral: true,
      });

    const attachment = await createTranscript(channel, {
      limit: -1,
      returnType: "attachment",
      saveImages: true,
      minify: true,
      fileName: `${userData.OwnerID + "-" + "Ticket"}.html`,
    });

    await userData.updateOne({ ChannelID: channel.id }, { Closed: true });

    const TicketCount = ticketCount.findOne({ GuildID: guild.id });
    const Count = ((await TicketCount.countDocuments())).toString();

    const Channel = guild.channels.cache.get(ticketDB.Transcript);
    const Target = guild.members.cache.get(userDB.OwnerID);
    const input = interaction.fields.getTextInputValue("Close_Reason_Ticket");

    const Embed = new EmbedBuilder().setColor(`#303135`).setFields({
      name: `Ticket Information`,
      value: `
        **ID:** ${Count}
        **Close Reason:** ${input}
        **Closed By:** ${member}
        **Claimed By:** ${userDB.ClaimedBy ? `<@${userDB.ClaimedBy}>` : "None"}
        **Ticket Owner:** <@${userDB.OwnerID}>
        `,
    });

    Channel.send({
      embeds: [Embed],
      files: [attachment],
    });
    Target.send({
      embeds: [Embed],
      files: [attachment],
    }).catch((err) =>
      guild.channels.cache.get(ticketDB.ErrorLog).send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Couldn't DM user`)
            .setColor("#303135")
            .addFields({
              name: `Error Information`,
              value: `**Mention Tag:** <@${userData.OwnerID}>\n**ID:** ${userData.OwnerID}`,
            }),
        ],
      })
    );
    await interaction.deferReply({
      embeds: [
        new EmbedBuilder()
          .setColor("#303135")
          .setDescription(`Closing Ticket...`),
      ],
    });
    userData
      .findOneAndDelete({ GuildID: guild.id, ChannelID: channel.id })
      .catch((err) => console.log(err));
    channel.delete();
  },
};
