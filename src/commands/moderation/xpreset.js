const { SlashCommandBuilder, PermissionsBitField, GuildWidgetStyle } = require('discord.js');
const levelSchema = require('../../Schemas/level.js');
module.exports = {
	data: new SlashCommandBuilder()
			.setName('resetxp')
			.setDescription('Reset XP for server'),
      async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `You don't have permissions to manage XP!`, ephemeral: true });
        }
  
        const { guild } = interaction;

        try {
            // Delete all XP records for the guild
            await levelSchema.deleteMany({ Guild: guild.id });

            // Send a success message
            await interaction.reply({ content: `XP for guild has been reset.` });
        } catch (err) {
            console.error('Error resetting XP:', err);
            await interaction.reply({ content: `There was an error resetting XP. Please try again later.`, ephemeral: true });
        }
    },
};