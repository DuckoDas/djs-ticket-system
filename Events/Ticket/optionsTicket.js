const { Client, EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const ticketSchema = require("../../Schemas/ticketSchema");
const userSchema = require("../../Schemas/userTickets");

module.exports = {
  name: "interactionCreate",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    const { guild, channel, customId, member } = interaction;
    if (!["close", "lock", "unlock", "claim", "request"].includes(customId))
      return;

    const ticketData = await ticketSchema.findOne({ GuildId: guild.id });
    if (!ticketData)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(` Ticket Setup data is missing...`),
        ],
        ephemeral: true,
      });

    const userData = await userSchema.findOne({
      GuildId: guild.id,
      ChannelID: channel.id,
    });
    if (!userData)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(` Ticket data is missing...`),
        ],
        ephemeral: true,
      });

    if (!userSchema)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(`Ticket data missing... Please reinstall Ticket System!`),
        ],
      });

    switch (customId) {
      case "close":
        const attachment = await createTranscript(channel, {
          limit: -1,
          returnType: "attachment",
          saveImages: true,
          minify: true,
          fileName: `${userData.GuildID + "-" + userData.TicketID}.html`,
        });

        await userData.updateOne({ ChannelID: channel.id }, { Closed: true });

        const Channel = await guild.channels.cache.get(ticketData.Transcript);
        const Target = await guild.members.cache.get(userData.OwnerID);

        const Embed = new EmbedBuilder()
          .setColor("Blurple")
          .addFields({
            name: `Ticket Information:`,
            value: `
          **ID:** ${userData.TicketID}
          **Channel ID:** ${userData.ChannelID}
          **Closed By:** ${member}
          **Claimed By:** ${userData.ClaimedBy ? `<@${userData.ClaimedBy}>` : "None"}
          **Ticket Owner:** <@${userData.OwnerID}>
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
          guild.channels.cache
            .get(ticketData.ErrorLog)
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`Couldn't DM user`)
                  .setColor("Blurple")
                  .addFields({
                    name: `Error Information`,
                    value: 
                    `
                    **Mention Tag:** <@${userData.OwnerID}>
                    **ID:** ${userData.OwnerID}
                    `
                  })
              ],
            })
        );

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(` Closing Ticket...`),
          ],
        });
        userSchema
          .findOneAndDelete({ GuildID: guild.id })
          .catch((err) => console.log(err));
        setTimeout(() => {
        channel.delete();
          }, 1 * 1000)
        break;
      case "lock":
        if (userData.Locked == true)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(` Ticket is already locked.`),
            ],
            ephemeral: true,
          });

        if (!member.roles.cache.find((r) => r.id === ticketData.SupportRole))
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Your not allowed to use this button.`),
            ],
            ephemeral: true,
          });

        await userSchema.updateOne({ ChannelID: channel.id }, { Locked: true });

        userData.MembersID.forEach((m) => {
          channel.permissionOverwrites.edit(m, {
            SendMessages: false,
          });
        });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(` Ticket has been locked by staff.`),
          ],
        });
        break;
      case "unlock":
        if (userData.Locked == false)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(` Ticket is already unlocked.`),
            ],
            ephemeral: true,
          });

        if (!member.roles.cache.find((r) => r.id === ticketData.SupportRole))
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Your not allowed to use this button.`),
            ],
            ephemeral: true,
          });

        await userSchema.updateOne(
          { ChannelID: channel.id },
          { Locked: false }
        );

        userData.MembersID.forEach((m) => {
          channel.permissionOverwrites.edit(m, {
            SendMessages: true,
          });
        });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(` Ticket has been unlocked by staff.`),
          ],
        });
        break;
      case "claim":
        if (userData.Claimed == true)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(` Ticket has been claimed already.`),
            ],
            ephemeral: true,
          });

        if (!member.roles.cache.find((r) => r.id === ticketData.SupportRole))
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Your not allowed to use this button.`),
            ],
            ephemeral: true,
          });

        await userSchema.updateOne(
          { ChannelID: channel.id },
          { Claimed: true, ClaimedBy: member.id }
        );

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(` Ticket has been claimed`),
          ],
        });
        break;
      case "request":
        if (userData.Requested == true)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(` Support has been requested already.`),
            ],
            ephemeral: true,
          });

        if (member.roles.cache.find((r) => r.id === ticketData.SupportRole))
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Your not allowed to use this button.`),
            ],
            ephemeral: true,
          });

        await userSchema.updateOne(
          { ChannelID: channel.id },
          { Requested: true }
        );

        channel.permissionOverwrites.edit(ticketData.SupportRole, {
          ViewChannel: true,
        });

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(` Support now have access to the ticket.`),
          ],
        });
        break;
    }
  },
};
