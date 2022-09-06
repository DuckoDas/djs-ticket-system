const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const DB = require("../../Schemas/ticketSchema");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ticket")
      .setDescription("Configue the ticket system")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("setup")
          .setDescription("Setup the ticket system")
          .addChannelOption((option) => {
            return option
              .setName("channel")
              .setDescription("The channel to send the ticket panel in.")
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildText);
          })
          .addChannelOption((option) => {
            return option
              .setName("category")
              .setDescription("The category to create the ticket in.")
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildCategory);
          })
          .addChannelOption((option) => {
            return option
              .setName("transcript")
              .setDescription("Logs a ticket after its been closed")
              .setRequired(true)
              .addChannelTypes(ChannelType.GuildText);
          })
          .addChannelOption((option) => {
            return option
              .setName("error_log")
              .setDescription("The ticket systems error channel")
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true);
          })
          .addRoleOption((option) => {
            return option
              .setName("support_role")
              .setDescription("The role to assign to support tickets.")
              .setRequired(true);
          })
          .addStringOption((option) => {
            return option
              .setName("description")
              .setDescription("The ticket systems description")
              .setRequired(false);
          })
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("delete")
          .setDescription("Deletes config for the tickets.")
      ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const { guild, options } = interaction;

      if (interaction.options.getSubcommand() === "setup") {
        const channel = interaction.options.getChannel("channel");
        const category = interaction.options.getChannel("category");
        const transcript = interaction.options.getChannel("transcript");
        const erorrlog = interaction.options.getChannel("error_log");
        const supportRole = interaction.options.getRole("support_role");
        const description =interaction.options.getString("description") || "Press 📩 to Create a Ticket";
  
        await DB.findOneAndUpdate(
          { GuildId: guild.id },
          {
            Channel: channel.id,
            Category: category.id,
            Transcript: transcript.id,
            ErrorLog: erorrlog.id,
            SupportRole: supportRole.id,
          },
          {
            new: true,
            upsert: true,
          }
        );
  
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Create a ticket!")
              .setDescription(description)
              .setColor("Blurple"),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setCustomId("createTicket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("📩")
            ),
          ],
        });
  
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Ticket setup complete!")
              .setColor("Green"),
          ],
          ephemeral: true
        });
      }
      if (interaction.options.getSubcommand() === "delete") {
        const ticketConfig = await DB.findOne({
          GuildId: interaction.guild.id,
        });
        if (!ticketConfig) {
          const NotCreatedSystem = new EmbedBuilder()
            .setDescription("An error occured:(")
            .setColor("Red");
          interaction.reply({ embeds: [NotCreatedSystem], ephemeral: true });
        } else {
          await DB.findOneAndDelete({ GuildId: interaction.guild.id });
  
          const CreatedSystem = new EmbedBuilder()
            .setDescription("Ticket system successfully deleted!")
            .setColor("Green");
          interaction.reply({ embeds: [CreatedSystem], ephemeral: true });
        }
      }
    },
  };