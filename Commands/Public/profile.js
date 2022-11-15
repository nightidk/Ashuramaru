const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Client,
    AttachmentBuilder,
    ImageFormat,
    PresenceUpdateStatus,
} = require("discord.js");
const userDB = require("../../Schemas/user");
const Canvas = require("canvas");

module.exports = {
    beta: true,
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("View user's profile")
        .setDescriptionLocalization("ru", "Просмотр профиля пользователя")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("The user, whose profile you want to see")
                .setDescriptionLocalization(
                    "ru",
                    "Пользователь, чей профиль вы хотите увидеть"
                )
                .setRequired(false)
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const member =
            interaction.options.getMember("user") ?? interaction.member;
        // const user = await userDB.findOne({
        //     userID: interaction.member.id,
        //     guildID: interaction.guildId,
        // });

        const canvas = new Canvas.Canvas(1920, 1080, "image");
        const ctx = canvas.getContext("2d");
        Canvas.registerFont(`${process.cwd()}/Fonts/LTSD.otf`, {
            family: "Leto Text Sans Defect",
        });

        const backgroundImage = await Canvas.loadImage(
            `${process.cwd()}/Images/Profile/profile_background.png`
        );
        const previewImage = await Canvas.loadImage(
            `${process.cwd()}/Images/Profile/preview_image_default.png`
        );

        ctx.drawImage(backgroundImage, 0, 0);
        ctx.drawImage(previewImage, 0, 0);

        let memberAvatar = await Canvas.loadImage(
            member.displayAvatarURL({
                extension: ImageFormat.PNG,
                size: 512,
            })
        );

        memberAvatar = cropAvatar(memberAvatar);

        ctx.font = '75px "Leto Text Sans Defect"';
        ctx.strokeStyle = "#e9e9e9";
        ctx.lineWidth = 1;
        ctx.strokeText(member.displayName, 424, 503 + 57, 1392);
        ctx.fillStyle = "#e9e9e9";
        ctx.fillText(member.displayName, 424, 503 + 57, 1392);

        ctx.drawImage(memberAvatar, 82, 305, 300, 300);

        let statusImage;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 17;

        if (member.presence?.status === PresenceUpdateStatus.Online)
            statusImage = await Canvas.loadImage(
                `${process.cwd()}/Images/Profile/Statuses/OnlineStatus.png`
            );
        else if (member.presence?.status === PresenceUpdateStatus.Idle)
            statusImage = await Canvas.loadImage(
                `${process.cwd()}/Images/Profile/Statuses/IdleStatus.png`
            );
        else if (member.presence?.status === PresenceUpdateStatus.DoNotDisturb)
            statusImage = await Canvas.loadImage(
                `${process.cwd()}/Images/Profile/Statuses/DnDStatus.png`
            );
        else
            statusImage = await Canvas.loadImage(
                `${process.cwd()}/Images/Profile/Statuses/OfflineStatus.png`
            );

        ctx.shadowColor =
            member.presence?.status === PresenceUpdateStatus.Online
                ? "rgba(65, 150, 111, 0.69)"
                : member.presence?.status === PresenceUpdateStatus.Idle
                ? "rgba(249, 166, 50, 0.69)"
                : member.presence?.status === PresenceUpdateStatus.DoNotDisturb
                ? "rgba(237, 73, 76, 0.69)"
                : "rgba(95, 95, 95, 0.69)";
        ctx.drawImage(statusImage, 82, 305, 300, 300);
        clearAll(ctx);
        drawLevelLine(ctx, 20);

        const level = "1";
        ctx.fillStyle = "#757575";
        ctx.font = '39px "Leto Text Sans Defect"';
        ctx.strokeStyle = "#757575";
        ctx.lineWidth = 1;
        ctx.strokeText(
            level,
            1920 - 129 - ctx.measureText(level).width,
            675 + 29
        );
        ctx.fillText(
            level,
            1920 - 129 - ctx.measureText(level).width,
            675 + 29
        );
        clearAll(ctx);

        await interaction.reply({
            files: [
                new AttachmentBuilder()
                    .setFile(canvas.toBuffer())
                    .setName(`profile-${member.id}.png`),
            ],
        });
    },
};

/**
 *
 * @param {Canvas.Image} Image
 * @returns {Canvas.Image}
 */
function cropAvatar(Image) {
    const canvas = Canvas.createCanvas(Image.width, Image.height);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();

    ctx.arc(
        Image.width / 2,
        Image.height / 2,
        Image.width / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(Image, 0, 0, Image.width, Image.height);

    const newImage = new Canvas.Image();
    newImage.src = canvas.toBuffer();
    return newImage;
}

/**
 *
 * @param {Canvas.CanvasRenderingContext2D} ctx
 * @param {Number} procent
 */
function drawLevelLine(ctx, procent) {
    ctx.beginPath();
    ctx.strokeStyle = "#41966F";
    ctx.fillStyle = "#41966F";
    ctx.roundRect(110, 726, parseInt((1681 / 100) * procent), 22, 5);
    ctx.stroke();
    ctx.fill();
}

/**
 *
 * @param {Canvas.CanvasRenderingContext2D} ctx
 */
function clearAll(ctx) {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
}
