const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);
        if (!button)
            return interaction.reply({
                ephemeral: true,
                content: "Invalid button, please dm developers about it.",
            });
        else button.execute(interaction, client);
    },
};
