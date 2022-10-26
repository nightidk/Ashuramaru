const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Will respond with pong."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.reply({ content: "Pong!", ephemeral: true });
    },
};
