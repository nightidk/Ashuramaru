const { ChatInputCommandInteraction, Client, Events } = require("discord.js");
const { developers } = require("../../Configs/config.json");
const localization = require("../../Configs/localization.json");

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return await interaction.reply({
                content: localization["ru"].errors.commandOutdated,
                ephemeral: true,
            });

        if (command.developer && !developers.includes(interaction.user.id))
            return interaction.reply({
                content: localization["ru"].errors.onlyDevelopers,
                ephemeral: true,
            });

        command.execute(interaction, client);
    },
};
