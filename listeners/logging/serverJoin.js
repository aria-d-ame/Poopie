const { Listener } = require("gcommands");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const level = require("../../schemas/level");

// Listener to check if user joined the server and send a welcome message with png attachment
new Listener({
	name: "Server Welcome",
	event: "guildMemberAdd",
	run: async (ctx) => {
		if (ctx.user.bot) return;

		try {
			const welcomeChannel = await ctx.guild.channels.fetch('1269434806874411089');
			const levelZeroRole = ctx.guild.roles.cache.get('1269693621536423949');

			const joinEmbed = new EmbedBuilder()
				.setTitle(`<:xtriangle_medium:1276262944836947999> ${ctx.user.username} 𝚑𝚊𝚜 𝚋𝚘𝚘𝚝𝚎𝚍 𝚞𝚙 ${ctx.guild.name}!`)
				.setDescription(`«════✧ ✦ ✧ ✦ ✧════»`)
				.setColor(0x8269c2)
				.setThumbnail(ctx.displayAvatarURL())
				.setImage('https://i.ibb.co/GQjsbtK/image-19-scaled-14x-pngcrushed.png')
				.setTimestamp()
				.setFooter({
					text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
					iconURL: ctx.guild.iconURL() // Optional: Server icon URL
				})

				const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('<:xtriangle_small:1276263767872770108> Write your intro!')
						.setStyle(ButtonStyle.Link)
						.setURL('https://discord.com/channels/1269419817811709952/1269445235239424010'),
					new ButtonBuilder()
						.setLabel('<:xtriangle_small:1276263767872770108> Get colors!')
						.setStyle(ButtonStyle.Link)
						.setURL('https://discord.com/channels/1269419817811709952/1269445113227251765'), 
				);

			await welcomeChannel.send({
				content: `<:xannounce:1276188470250832014> <@&1270212130204811376> welcome <@${ctx.user.id}> <:xannounce:1276188470250832014>`,
				embeds: [joinEmbed],
				components: [row],
			});

			if (levelZeroRole) {
				await ctx.member.roles.add(levelZeroRole);
				console.log(`Assigned level zero role to ${ctx.user.tag}`);
			} else {
				console.log(`Level zero role not found in guild ${ctx.guild.id}`);
			}
		} catch (error) {
			console.log(error);
		}
	},
});