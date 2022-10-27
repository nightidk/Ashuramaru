const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
async function loadButtons(client) {
    const { loadFiles } = require("./fileLoader");
    const ascii = require("ascii-table");
    const table = new ascii().setHeading("Button", "Status");

    await client.buttons.clear();

    const Files = await loadFiles("Buttons");

    Files.forEach((file) => {
        const button = require(file);
        client.buttons.set(button.customId, button);

        table.addRow(button.customId, "🟢");
    });

    return console.log(table.toString(), "\nButtons loaded.");
}

module.exports = { loadButtons };
