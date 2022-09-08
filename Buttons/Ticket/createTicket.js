const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const ticketData = require("../../../Structures/Schemas/ticketData");
const ticketCount = require("../../../Structures/Schemas/ticketCount");
const userData = require("../../../Structures/Schemas/guildTickets");

module.exports = {
  id: "createTicket",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;

    const ticketDB = await ticketData.findOne({ GuildId: interaction.guild.id });
    if (!ticketDB)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#303135")
            .setDescription(`Can't find any data on the ticket system:/`),
        ],
        ephemeral: true,
      });

    const TicketCount = ticketCount.findOne({ GuildID: guild.id });
    const Count = ((await TicketCount.countDocuments()) + 1).toString();

    const TicketAlreadyOpen = await userData.findOne({ GuildID: guild.id, OwnerID: member.id, Closed: false });
    if (TicketAlreadyOpen) return interaction.reply({ embeds: [ new EmbedBuilder().setColor("#303135").setDescription(`You have a ticket open already`) ], ephemeral: true });

    await guild.channels
      .create({
        name: `${"Ticket" + "-" + interaction.user.username + "-" + Count}`,
        topic: `Your ID **${member.id}**\nTicket ID **${Count}**`,
        parent: ticketDB.Category,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: ticketDB.SupportRole,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.ManageMessages,
            ],
          },
          {
            id: interaction.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.ManageMessages,
            ],
          },
        ],
      })
      .then(async (channel) => {
        await userData
          .create({
            GuildID: guild.id,
            OwnerID: member.id,
            MembersID: member.id,
            ChannelID: channel.id,
            Locked: false,
            Claimed: false,
            Requested: false,
          })
          .then(async () => {
            await ticketCount.create({
              GuildID: guild.id,
              TicketCount: Count,
            });
          });

        const Embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} | Ticket ID: ${Count}`,
            icon: guild.iconURL({ dynamic: true }),
          })
          .setColor("#303135")
          .addFields({
            name: `While your waiting you can do these things:`,
            value: `
            > \`-\` Provide reason for this ticket.
            > \`-\` Provide as much details as you can!
            `,
          })
          .addFields({
            name: `Admin Actions`,
            value: `
            > \`🔒\` - Locks the ticket
            > \`🔓\` - Unlocks the ticket
            > \`📥\` - Claims the ticket
            `,
          });

        const TicketActions = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setEmoji("⛔")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("lock_ticket")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("unlock_ticket")
            .setEmoji("🔓")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("claim")
            .setEmoji("📥")
            .setStyle(ButtonStyle.Success)
        );

        channel.send({
          embeds: [Embed],
          components: [TicketActions],
        });

        await channel
          .send({
            content: `${member}`,
          })
          .then((message) => {
            setTimeout(() => {
              message.delete().catch(() => {});
            }, 1 * 5000);
          });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#303135")
              .setDescription(`Your ticket has been created: ${channel}`),
          ],
          ephemeral: true,
        });
      });
  },
};
