const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Server Goodbye',
  event: 'guildMemberRemove',

  run: async (ctx) => {
    if (ctx.user.bot) return;

		try {
			const goodbyeChannel = await ctx.guild.channels.fetch('1269438676119846953');

			const leaveEmbed = new EmbedBuilder()
				.setTitle(`<:xtriangle_medium:1276262944836947999> ${ctx.user.username} 𝚑𝚊𝚜 𝚚𝚞𝚒𝚝 ${ctx.guild.name}!`)
				.setColor(0x8269c2)
				.setThumbnail(ctx.displayAvatarURL())
				.setTimestamp()
				.setFooter({
					text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
					iconURL: ctx.guild.iconURL() // Optional: Server icon URL
				})

			await goodbyeChannel.send({	embeds: [leaveEmbed] });

		} catch (error) {
			console.log(error);
		}
  }
})