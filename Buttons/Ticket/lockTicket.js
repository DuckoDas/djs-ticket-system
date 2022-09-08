const { EmbedBuilder } = require("discord.js");
const ticketData = require("../../../Structures/Schemas/ticketData");
const userData = require("../../../Structures/Schemas/guildTickets");

module.exports = {
  id: "lock_ticket",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel, member } = interaction;
    const ticketDB = await ticketData.findOne({
      GuildId: guild.id,
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

    const userDB = await userData.findOne({
      GuildId: guild.id,
      ChannelID: channel.id,
    });
    if (!userDB)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#303135")
            .setDescription(`Can't find any data on this ticket:/`),
        ],
        ephemeral: true,
      });

    if (!member.roles.cache.find((r) => r.id === ticketDB.SupportRole))
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#303135")
            .setDescription(`Your not allowed to use this action!`),
        ],
        ephemeral: true,
      });

    if (userDB.Locked == true)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#303135")
            .setDescription(`Ticket is already locked.`),
        ],
        ephemeral: true,
      });

    await userData.updateOne({ ChannelID: channel.id }, { Locked: true });

    userDB.MembersID.forEach((m) => {
      channel.permissionOverwrites.edit(m, {
        SendMessages: false,
      });
    });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#303135")
          .setDescription(`You locked the ticket`),
      ],
      ephemeral: true,
    });

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#303135")
          .setDescription(`Ticket has been locked by staff.`)
          .setFooter({
            text: `Action By ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          }),
      ],
    });
  },
};
