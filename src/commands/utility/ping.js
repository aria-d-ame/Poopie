const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Check Cornelius' ping!`),

    async execute(interaction) {
      try {
        // Acknowledge the interaction
        await interaction.deferReply();
  
        // Fetch the reply to measure latency
        const reply = await interaction.fetchReply();
  
        // Calculate ping
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
  
        // Edit the reply to include the ping
        await interaction.editReply(`<:xtriangle_small:1276263767872770108> Bot latency: ${ping}ms | <:xtriangle_small:1276263767872770108> API Latency: ${interaction.client.ws.ping}ms`);
      } catch (error) {
        console.error('Error executing ping command:', error);
  
        // If the interaction has already been responded to or deferred, use editReply
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply('⚠️ Error occurred while processing the command.');
        } else {
          // Otherwise, reply to the interaction
          await interaction.reply('⚠️ Error occurred while processing the command.');
        }
      }
    },
  };