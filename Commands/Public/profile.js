const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
} = require("discord.js");
const userDB = require("../../Schemas/user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("View user's profile")
        .setDescriptionLocalization("ru", "Просмотр профиля пользователя")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("The user, whose profile you want to see")
                .setDescriptionLocalization(
                    "ru",
                    "Пользователь, чей профиль вы хотите увидеть"
                )
                .setRequired(true)
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const user = await userDB.findOne({
            userID: interaction.member.id,
            guildID: interaction.guildId,
        });
    },
};
