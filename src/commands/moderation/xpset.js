const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas/level.js');
module.exports = {
	data: new SlashCommandBuilder()
			.setName('setxp')
			.setDescription('Set XP for a server member')
			.addUserOption(option => 
					option.setName('user')
							.setDescription('Member for XP set.')
							.setRequired(true))
			.addIntegerOption(option => 
					option.setName('xp')
							.setDescription('The amount of XP to set.')
							.setRequired(true)),
	async execute(interaction) {
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
					return await interaction.reply({ content: `You don't have permissions to manage XP!`, ephemeral: true });
			}

			const { guild } = interaction;
			const target = interaction.options.getUser('user');
			const xp = interaction.options.getInteger('xp');

			// Update or create the XP record for the user
			await levelSchema.findOneAndUpdate(
					{ Guild: guild.id, User: target.id },
					{ XP: xp },
					{ upsert: true, new: true } // upsert creates the document if it does not exist
			);

			const tag = target.tag;
      const escapedUsername = tag.replace(/_/g, '\\_');

			// Confirm the XP has been set
			await interaction.reply({ content: `<:xtriangle_small:1276263767872770108> Set ${xp} XP for ${escapedUsername}.`});
	},
};