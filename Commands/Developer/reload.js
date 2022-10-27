const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    Client,
    PermissionFlagsBits,
} = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { loadEvents } = require("../../Handlers/eventHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload your commands/events")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) =>
            options.setName("events").setDescription("Reload your events.")
        )
        .addSubcommand((options) =>
            options.setName("commands").setDescription("Reload your commands.")
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "events":
                {
                    for (const [key, value] of client.events)
                        client.removeListener(`${key}`, value, true);
                    await loadEvents(client);
                    await interaction.reply({
                        content: "Reloaded Events",
                        ephemeral: true,
                    });
                }
                break;
            case "commands":
                {
                    await loadCommands(client);
                    await interaction.reply({
                        content: "Reloaded Events",
                        ephemeral: true,
                    });
                }
                break;
        }
    },
};
