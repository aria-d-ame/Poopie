const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Say hello to Cornelius!'),
	async execute(interaction) {
		await interaction.reply(`Hello there <@${interaction.user.id}>!`);
	},
};