require("dotenv").config();

const {
    Client,
    ActivityType,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.events = new Collection();
loadEvents(client);

client.commands = new Collection();

client
    .login(process.env.TOKEN)
    .then(() => {
        console.log(`Client logged as ${client.user.tag}`);
    })
    .catch((err) => {
        console.log(`Client not connected. Error: ${err}`);
    });
