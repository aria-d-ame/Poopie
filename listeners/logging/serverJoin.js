const { Listener } = require("gcommands");
const { EmbedBuilder } = require("discord.js");

// Listener to check if user joined the server and send a welcome message with png attachment
new Listener({
	name: "Server Welcome",
	event: "guildMemberAdd",
	run: async (ctx) => {
		if (ctx.user.bot) return;

		try {
			const welcomeChannel = await ctx.guild.channels.fetch('1269434806874411089')

			const joinEmbed = new EmbedBuilder()
				.setTitle(`<@${ctx.user.id}> has booted up ${ctx.guild.name}!`)
				.setDescription(``)
				.setColor(0x8269c2)
				.setThumbnail(`https://i.ibb.co/jDCnxc2/image-20-scaled-37x-pngcrushed.png`)
				.setImage(``)
				.setTimestamp();

			await welcomeChannel.send({
				content: `<:xannounce:1276188470250832014> <@&1270212130204811376> <:xannounce:1276188470250832014>`,
				embeds: [joinEmbed],
			});
		} catch (error) {
			console.log(error);
		}
	},
});