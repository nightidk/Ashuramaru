require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");
const { connect } = require("mongoose");
const { loadButtons } = require("./Functions/buttonsLoader");

const {
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildVoiceStates,
    MessageContent,
    GuildPresences,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildVoiceStates,
        MessageContent,
        GuildPresences,
    ],
    partials: [User, Message, GuildMember, ThreadMember],
});

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const { loadEvents } = require("./Handlers/eventHandler");

client.events = new Collection();
loadEvents(client);

client.commands = new Collection();

client.buttons = new Collection();
loadButtons(client);

client.selectMenus = new Collection();

client.distube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin(),
    ],
    leaveOnEmpty: true,
    nsfw: true,
});

connect(process.env.DATABASE, {})
    .catch((err) => console.log(`Error to connect to the database: ${err}`))
    .then(() => console.log("The client is now connected to the database."));

// ------- DisTube -------- //
const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.names.join(", ") || "Off"
    }\` | Loop: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? "All Queue"
                : "This Song"
            : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
client.distube
    .on("playSong", (queue, song) =>
        queue.textChannel.send(
            `Playing \`${song.name}\` - \`${
                song.formattedDuration
            }\`\nRequested by: ${song.user}\n${status(queue)}`
        )
    )
    .on("addSong", (queue, song) =>
        queue.textChannel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
        )
    )
    .on("addList", (queue, playlist) =>
        queue.textChannel.send(
            `Added \`${playlist.name}\` playlist (${
                playlist.songs.length
            } songs) to queue\n${status(queue)}`
        )
    )
    .on("error", (channel, e) => {
        if (channel)
            channel.send(
                `An error encountered: ${e.toString().slice(0, 1974)}`
            );
        else console.error(e);
    })
    .on("empty", (channel) =>
        channel.send("Voice channel is empty! Leaving the channel...")
    )
    .on("searchNoResult", (message, query) =>
        message.channel.send(`No result found for \`${query}\`!`)
    )
    .on("finish", (queue) => queue.textChannel.send("Finished!"));
// --------------------------

client
    .login(process.env.TOKEN)
    .then(() => {
        console.log(`Client logged as ${client.user.tag}`);
    })
    .catch((err) => {
        console.log(`Client not connected. Error: ${err}`);
    });
