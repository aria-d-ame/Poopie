const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help about Cornelius!'),
	async execute(interaction) {
    const icon = interaction.guild.iconURL() || ''

    const helpEmbed = new EmberBuilder()
    .setColor(0x8269c2)
    .setAuthor({ name: interaction.user.displayName, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()
    .setFooter({
      text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
      iconURL: icon // Optional: Server icon URL
    })
    .setThumbnail(`https://i.ibb.co/jDCnxc2/image-20-scaled-37x-pngcrushed.png`)
    .setTitle(`Hello ${interation.user.username}! My name is Cornelius! Here's everything you need to get started!`)
    .setDescription(``)
		await interaction.reply({embed: helpEmbed});
	},
};