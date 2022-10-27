const {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("orders-init")
        .setDescription("Send message, which created orders.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setAuthor({ name: "Создание заказа" })
            .setDescription(
                "Нажав на кнопку ниже Вы сможете оформить заказ для бота Discord."
            );
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Создать заказ")
                .setStyle(ButtonStyle.Success)
                .setCustomId("orderCreate")
        );

        await interaction.reply({
            content: "Message sended.",
            ephemeral: true,
        });

        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};
