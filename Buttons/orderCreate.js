const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    customId: "orderCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.reply({
            ephemeral: true,
            content: "This is working!",
        });
    },
};
