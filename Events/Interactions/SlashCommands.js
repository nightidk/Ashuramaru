const {
    ChatInputCommandInteraction,
    Client,
    Events,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { developers, beta } = require("../../Configs/config.json");
const localization = require("../../Configs/localization.json");
const guilds = require("../../Schemas/guilds");

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const guild = await guilds.findOne({ guildID: interaction.guildId });

        const numbers_en = {
            0: "th",
            1: "st",
            2: "nd",
            3: "rd",
        };

        const numbers_ru = {
            0: "ый",
            1: "ый",
            2: "ой",
            3: "ий",
            4: "ый",
            5: "ый",
            6: "ой",
            7: "ой",
            8: "ой",
            9: "ый",
        };

        const addedEmbeds = [
            new EmbedBuilder().setColor(0x2f3136).setColor(0x2f3136).setAuthor({
                name: "Спасибо, что решили добавить нашего бота!/Thanks for adding our bot to your server!",
            }).setDescription(`🇷🇺 **Русский**:
Привет! Выражаем огромную благодарность за добавление бота на сервер. Вы ${
                client.guilds.cache.size
            }${
                (client.guilds.cache.size >= 9) &
                (client.guilds.cache.size <= 20)
                    ? "ый"
                    : numbers_ru[client.guilds.cache.size % 10]
            } сервер, который захотел воспользоваться нашими возможностями!
Для начала укажите, пожалуйста, на каком языке будет работать бот.
            
🇺🇸 **English**:
Hi! We express our great gratitude for adding the bot to the server. You are the ${
                client.guilds.cache.size
            }${
                (client.guilds.cache.size >= 4) &
                (client.guilds.cache.size <= 20)
                    ? "th"
                    : numbers_en[client.guilds.cache.size % 10]
            } server who wanted to take advantage of our capabilities!
To begin with, please indicate in which language the bot will work.`),
        ];

        const languages = [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("lang_choice_ru")
                    .setEmoji("🇷🇺")
                    .setLabel("Русский")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("lang_choice_en")
                    .setEmoji("🇺🇸")
                    .setLabel("English")
                    .setStyle(ButtonStyle.Secondary)
            ),
        ];

        if (!guild && interaction.memberPermissions.has("Administrator"))
            return await interaction.reply({
                embeds: addedEmbeds,
                components: languages,
                ephemeral: true,
            });
        else if (!guild && !interaction.memberPermissions.has("Administrator"))
            return;

        const command = client.commands.get(interaction.commandName);
        if (!command)
            return await interaction.reply({
                content: localization[guild.language].errors.commandOutdated,
                ephemeral: true,
            });

        if (
            command.beta &&
            !beta.includes(interaction.user.id) &&
            !developers.includes(interaction.user.id)
        )
            return interaction.reply({
                content: localization[guild.language].errors.onlyTesters,
                ephemeral: true,
            });

        if (command.developer && !developers.includes(interaction.user.id))
            return interaction.reply({
                content: localization[guild.language].errors.onlyDevelopers,
                ephemeral: true,
            });

        command.execute(interaction, client);
    },
};
