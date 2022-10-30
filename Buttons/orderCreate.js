const {
    ButtonInteraction,
    Client,
    ChannelType,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    customId: "orderCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });
        const createdChannel = await interaction.guild.channels.create({
            name: `${interaction.member.user.tag}`,
            parent: "1035606250249003108",
            type: ChannelType.GuildText,
            topic: `Оформеление заказа на бота для ${interaction.member.user.tag}`,
        });
        await createdChannel.permissionOverwrites.create(interaction.member, {
            SendMessages: true,
            ViewChannel: true,
            ReadMessageHistory: true,
            AddReactions: false,
            EmbedLinks: true,
            AttachFiles: true,
            UseApplicationCommands: false,
        });
        await interaction.editReply({
            content: `Ваш канал создан: ${createdChannel}`,
        });
        await createdChannel.send({
            embeds: [new EmbedBuilder().setTimestamp().setAuthor({})],
        });
    },
};
