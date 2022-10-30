const {
    Client,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music system")
        .addSubcommand((options) =>
            options.setName("join").setDescription("Joins to voice channel.")
        )
        .addSubcommand((options) =>
            options.setName("leave").setDescription("Leaves from voice channel")
        )
        .addSubcommand((options) =>
            options
                .setName("play")
                .setDescription("Plays the music")
                .addStringOption((optionsString) =>
                    optionsString
                        .setName("search")
                        .setDescription("Song name")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((options) =>
            options
                .setName("volume")
                .setDescription("Sets the volume")
                .addIntegerOption((optionInteger) =>
                    optionInteger
                        .setName("arg")
                        .setDescription("Number of volume")
                        .setRequired(true)
                )
        )
        .addSubcommand((options) =>
            options.setName("skip").setDescription("Skip song")
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "join":
                {
                    let voiceChannel = interaction.member.voice.channel;

                    if (interaction.guild.members.me.voice.channel) {
                        await interaction.reply({
                            ephemeral: true,
                            content: "I'm already in voice channel.",
                        });
                    }

                    if (!voiceChannel) {
                        await interaction.reply({
                            ephemeral: true,
                            content: "You must be in a voice channel.",
                        });
                    }

                    client.distube.voices.join(voiceChannel);
                    await interaction.reply({
                        ephemeral: true,
                        content: `I'm joined to ${voiceChannel}`,
                    });
                }
                break;
            case "leave":
                {
                    client.distube.voices.leave(interaction.guild);
                    await interaction.reply({
                        ephemeral: true,
                        content: "I'm disconnected from voice channel.",
                    });
                }
                break;
            case "play":
                {
                    const string = interaction.options.getString("search");
                    await interaction.reply({
                        ephemeral: true,
                        content: "Searching...",
                    });
                    client.distube.play(
                        interaction.member.voice.channel,
                        string,
                        {
                            member: interaction.member,
                            textChannel: interaction.channel,
                            interaction,
                        }
                    );
                }
                break;
            case "volume":
                {
                    const queue = client.distube.getQueue(interaction);
                    if (!queue)
                        return await interaction.reply({
                            content: `There is nothing in the queue right now!`,
                            ephemeral: true,
                        });
                    const volume = interaction.options.getInteger("arg");
                    queue.setVolume(volume);
                    await interaction.reply({
                        ephemeral: true,
                        content: `Volume set to \`${volume}\``,
                    });
                }
                break;
            case "skip":
                {
                    const queue = client.distube.getQueue(interaction);
                    if (!queue)
                        return await interaction.reply({
                            content: `There is nothing in the queue right now!`,
                            ephemeral: true,
                        });
                    try {
                        const song = await queue.skip();
                        await interaction.reply({
                            ephemeral: true,
                            content: `Skipped! Now playing:\n${song.name}`,
                        });
                    } catch (e) {
                        await interaction.reply({
                            ephemeral: true,
                            content: `${e}`,
                        });
                    }
                }
                break;
            case "stop":
                {
                    const queue = client.distube.getQueue(interaction);
                    if (!queue)
                        return await interaction.reply({
                            content: `There is nothing in the queue right now!`,
                            ephemeral: true,
                        });
                    queue.stop();
                    await interaction.reply({
                        ephemeral: true,
                        content: `Stopped!`,
                    });
                }
                break;
        }
    },
};
