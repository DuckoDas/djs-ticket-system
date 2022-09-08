const {
  TextInputBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputStyle
} = require("discord.js");

module.exports = {
  id: "close_ticket",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const InputField = new TextInputBuilder()
      .setCustomId("Close_Reason_Ticket")
      .setLabel("Provide a reason for closing this ticket!")
      .setPlaceholder("I didn't mean to open POGCHAMP")
      .setMaxLength(150)
      .setMinLength(1)
      .setStyle(TextInputStyle.Paragraph);

    const TestModalTextModalInputRow = new ActionRowBuilder().addComponents(
      InputField
    );

    const modal = new ModalBuilder()
      .setCustomId("ticketModal")
      .setTitle("Why do you want to close the ticket")
      .addComponents(TestModalTextModalInputRow);

    await interaction.showModal(modal);
  },
};
