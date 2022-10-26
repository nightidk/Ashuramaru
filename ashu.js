require("dotenv").config();

const { Client, ActivityType } = require("discord.js");
const client = new Client({ intents: ["Guilds"] });

client
    .login(process.env.TOKEN)
    .then(() => {
        console.log(`Client logged as ${client.user.tag}`);
        client.user.setActivity({
            name: "meow❤️",
            type: ActivityType.Streaming,
            url: "https://www.twitch.tv/night_idk",
        });
    })
    .catch((err) => {
        console.log(`Client not connected. Error: ${err}`);
    });
