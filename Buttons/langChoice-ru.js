const { ButtonInteraction, Client, EmbedBuilder } = require("discord.js");
const guilds = require("../Schemas/guilds");

module.exports = {
    customId: "lang_choice_ru",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.memberPermissions.has("Administrator")) return;

        if ((await guilds.count({ guildID: interaction.guildId })) == 0)
            await guilds.create({
                guildID: interaction.guildId,
                language: "ru",
            });
        else
            await guilds.updateOne(
                { guildID: interaction.guildId },
                { $set: { language: "ru" } }
            );

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x2f3136)
                    .setDescription("Установлен язык: 🇷🇺 **Русский**"),
            ],
            components: [],
        });
    },
};
