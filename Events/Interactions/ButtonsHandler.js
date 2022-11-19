const { ButtonInteraction, Client, Events } = require("discord.js");
const localization = require("../../Configs/localization.json");
const guilds = require("../../Schemas/guilds");

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        let guild = await guilds.findOne({ guildID: interaction.guildId });
        if (!guild) {
            guild = {
                language: "en",
            };
        }

        const button = client.buttons.get(interaction.customId);
        if (!button)
            return interaction.reply({
                ephemeral: true,
                content: localization[guild.language].errors.invalidButton,
            });
        else button.execute(interaction, client);
    },
};
