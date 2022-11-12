const { ButtonInteraction, Client, Events } = require("discord.js");
const localization = require("../../Configs/localization.json");

module.exports = {
    name: Events.InteractionCreate,
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
                content: localization["ru"].errors.invalidButton,
            });
        else button.execute(interaction, client);
    },
};
