const {
    Events,
    Guild,
    Client,
    EmbedBuilder,
    ChannelType,
    AuditLogEvent,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const guilds = require("../../Schemas/guilds");

module.exports = {
    name: Events.GuildCreate,
    /**
     *
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {
        if ((await guilds.count({ guildID: guild.id })) !== 0) return;

        const fetchedLog = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd,
        });

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

        if (guild.systemChannel)
            await guild.systemChannel.send({
                content: `${fetchedLog.entries.first().executor}`,
                embeds: addedEmbeds,
                components: languages,
            });
        else
            await (
                await guild.channels.fetch()
            )
                .filter((c) => c.type == ChannelType.GuildText)
                .sort((c1, c2) => c1.position > c2.position)
                .map((c) => c)[0]
                .send({
                    content: `${fetchedLog.entries.first().executor}`,
                    embeds: addedEmbeds,
                    components: languages,
                });
    },
};
