const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas/level.js'); // Adjust the path as necessary

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assignlevels')
        .setDescription('Assign levels and roles to all users based on their XP'),
    async execute(interaction) {
        // Check for admin permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `You don't have permission to use this command.`, ephemeral: true });
        }

        const guildId = interaction.guild.id;

        // Notify that the process has started
        await interaction.reply({ content: `Assigning levels and roles to all users...`, ephemeral: true });

        try {
            const users = await levelSchema.find({ Guild: guildId });

            for (const user of users) {
                let newLevel = 0;
                const xp = user.XP;

                // Determine the new level based on XP
                while (true) {
                    const requiredXP = newLevel * newLevel * 30; // Adjust this formula to match your leveling system
                    if (xp < requiredXP) break;
                    newLevel++;
                }

                // Update the user's level in the database
                user.Level = newLevel;
                await user.save();

                // Fetch the member from the guild
                const member = await interaction.guild.members.fetch(user.User);
                if (!member) continue; // Skip if the member is not found

                // Define level roles
                const levelRoles = {
                    0: '1269693621536423949',
                    5: '1274157164054839346',
                    10: '1274157637457412168',
                    20: '1274158590122262650',
                    30: '1274159198971891865',
                    50: '1274160177020665856',
                    100: '1274160360701694044',
                    // Add more levels and their respective role IDs as needed
                };

                // Remove roles that are not applicable
                for (const [level, roleId] of Object.entries(levelRoles)) {
                    if (member.roles.cache.has(roleId)) {
                        await member.roles.remove(roleId);
                    }
                }

                // Assign the role for the new level if it exists
                const roleId = levelRoles[newLevel];
                if (roleId) {
                    await member.roles.add(roleId);
                    console.log(`Assigned role ${roleId} to ${member.user.tag}`);
                }
            }

            // Notify completion
            await interaction.followUp({ content: `Level and role assignment completed for all users.` });
        } catch (error) {
            console.error('Error assigning levels and roles:', error);
            await interaction.followUp({ content: `An error occurred while assigning levels and roles.`, ephemeral: true });
        }
    },
};