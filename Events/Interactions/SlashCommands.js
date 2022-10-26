const { ChatInputCommandInteraction, Client } = require("discord.js");
const { developers } = require("../../config.json");

module.exports = {
    name: "interactionCreate",
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
                content: "This command is outdated",
                ephemeral: true,
            });

        if (command.developer && !developers.includes(interaction.user.id))
            return interaction.reply({
                content: "This command is only available to the developers.",
                ephemeral: true,
            });

        command.execute(interaction, client);
    },
};
