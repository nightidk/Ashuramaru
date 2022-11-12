const { Client, ActivityType, Events } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client
     */
    execute(client) {
        // Загружаем команды
        loadCommands(client);

        // Ставим статус "Не активен (idle)" и активность.
        client.user.setPresence({ status: "idle" });
        let activity = 0;
        setInterval(() => {
            client.user.setActivity({
                name:
                    activity == 0
                        ? "meow❤️"
                        : `за ${client.guilds.cache.size} сервер(ом/ами)`,
                type:
                    activity == 0
                        ? ActivityType.Listening
                        : ActivityType.Watching,
                url: "https://www.twitch.tv/night_idk",
            });
            activity = activity == 0 ? 1 : 0;
        }, 60000);
        console.log("Presence is ready.");
    },
};
