const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
async function loadCommands(client) {
    const { loadFiles } = require("../Functions/fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Command", "Status");

    await client.commands.clear();

    let commandsArray = [];
    let commandsNames = [];

    const Files = await loadFiles("Commands");

    Files.forEach((file) => {
        const command = require(file);
        client.commands.set(command.data.name, command);

        commandsArray.push(command.data.toJSON());
        commandsNames.push(command.data.name);

        table.addRow(command.data.name, "🟢");
    });

    (await client.guilds.fetch())
        .map((g) => g)
        .forEach(async (g, i, array) => {
            const guild = await g.fetch();
            (await guild.commands.fetch())
                .map((c) => c)
                .forEach(async (command) => {
                    if (!commandsNames.includes(command.name)) {
                        await command.delete();
                        console.log(
                            `[Delete command] ${command.name} is outdated and deleted. [${guild.id}]`
                        );
                    }
                });
            if (i + 1 == array.length)
                client.application.commands.set(commandsArray) &&
                    console.log("[Set commands] Commands added to client.");
        });

    return console.log(table.toString(), "\nCommands loaded.");
}

module.exports = { loadCommands };
