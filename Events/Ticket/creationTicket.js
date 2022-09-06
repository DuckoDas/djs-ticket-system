const {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} = require("discord.js");
const ticketSchema = require("../../Schemas/ticketSchema");
const userSchema = require("../../Schemas/userTickets");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { guild, member } = interaction;

    data = await ticketSchema.findOne({ GuildId: interaction.guild.id });
    if (!data)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`This server has disabled their ticket system...`),
        ],
        ephemeral: true,
      });

    if (!interaction.customId.includes("createTicket")) return;

    const ID = Math.floor(Math.random() * 90000) + 10000;
    await guild.channels
      .create({
        name: `${interaction.user.username + "-" + ID}`,
        parent: data.Category,
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
        await userSchema.create({
          GuildID: guild.id,
          TicketID: ID,
          OwnerID: member.id,
          MembersID: member.id,
          ChannelID: channel.id,
          Locked: false,
          Claimed: false,
          Requested: false,
        });
        const Embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} | Ticket: ${ID}`,
            icon: guild.iconURL({ dynamic: true }),
          })
          .setColor("Blurple")
          .addFields({
            name: `Things you can do:`,
            value: `
            > - Provide reason for this ticket.
            > - Provide as much details as you can!
            > - Provide other thing you can think of that we should know:)
            `,
          })
          .addFields({
            name: `Warning:`,
            value: `
            > - By pressing "Close" the ticket will close instand...
            `,
          })
          .setFooter({
            text: `Powered By ${client.user.tag}`,
            iconURL: client.user.avatarURL(),
          });

        const Buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("request")
            .setLabel("Request Support")
            .setEmoji("📢")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("close")
            .setLabel("Close")
            .setEmoji("📥")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("claim")
            .setLabel("Claim")
            .setEmoji("🛠")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("unlock")
            .setLabel("Unlock")
            .setEmoji("🔓")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("lock")
            .setLabel("Lock")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Primary)
        );

        channel.send({
          embeds: [Embed],
          components: [Buttons],
        });

        await channel
          .send({
            content: `${member}`,
            embeds: [new EmbedBuilder().setColor("Blurple").setDescription(`Here is your ticket.`)]
          })
          .then((message) => {
            setTimeout(() => {
              message.delete().catch(() => {});
            }, 1 * 10000);
          });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(`Your ticket has been created: ${channel}`),
          ],
          ephemeral: true,
        });
      });
  },
};
