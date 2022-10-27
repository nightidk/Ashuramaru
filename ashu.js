require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");
const { connect } = require("mongoose");
const { loadButtons } = require("./Functions/buttonsLoader");

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

client.buttons = new Collection();
loadButtons(client);

client.selectMenus = new Collection();

connect(process.env.DATABASE, {})
    .catch((err) => console.log(`Error to connect to the database: ${err}`))
    .then(() => console.log("The client is now connected to the database."));

client
    .login(process.env.TOKEN)
    .then(() => {
        console.log(`Client logged as ${client.user.tag}`);
    })
    .catch((err) => {
        console.log(`Client not connected. Error: ${err}`);
    });
