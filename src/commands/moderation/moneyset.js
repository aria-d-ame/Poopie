const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const moneySchema = require('../../Schemas/money.js');
module.exports = {
	data: new SlashCommandBuilder()
			.setName('setmoney')
			.setDescription('Set Pix-Stars for a server member')
			.addUserOption(option => 
					option.setName('user')
							.setDescription('Member for Pix-Stars set.')
							.setRequired(true))
			.addIntegerOption(option => 
					option.setName('money')
							.setDescription('The amount of Pix-Stars to set.')
							.setRequired(true)),
	async execute(interaction) {
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
					return await interaction.reply({ content: `You don't have permissions to manage XP!`, ephemeral: true });
			}

			const { guild } = interaction;
			const target = interaction.options.getUser('user');
			const money = interaction.options.getInteger('money');

			// Update or create the XP record for the user
			await moneySchema.findOneAndUpdate(
					{ Guild: guild.id, User: target.id },
					{ Money: money },
					{ upsert: true, new: true } // upsert creates the document if it does not exist
			);

			const tag = target.tag;
      const escapedUsername = tag.replace(/_/g, '\\_');

			// Confirm the XP has been set
			await interaction.reply({ content: `<:xtriangle_small:1276263767872770108> Set ${money} Pix-Stars for ${escapedUsername}.`});
	},
};