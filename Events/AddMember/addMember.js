const { Events, GuildMember, Client } = require("discord.js");
const userDB = require("../../Schemas/user");

module.exports = {
    name: Events.GuildMemberAdd,
    /**
     *
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client) {
        if (
            (await userDB.count({
                userID: member.id,
                guildID: member.guild.id,
            })) !== 0
        ) {
            await userDB.create({
                userID: member.id,
                guildID: member.guild.id,
            });
        }
    },
};
