const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve')
		.setDescription('Approve a suggestion')
    .addStringOption(option =>
      option.setName('message-id')
        .setDescription('Message ID of the suggestion')
        .setRequired(true)),
	async execute(interaction) {
    try{
      const messageId = interaction.options.getString('message-id');
      const message = await interaction.channel.messages.fetch(messageId);
      const embed = message.embeds[0];

      if (embed && message.author.id === interaction.client.user.id) {
        const suggestionAcceptedEmbed = new EmbedBuilder(embed)
          .setTitle(`<:xapproved:1276185812257738823> 𝙰𝙿𝙿𝚁𝙾𝚅𝙴𝙳 <:xapproved:1276185812257738823>`)
          .setFooter({
            text: `This suggestion was approved.`, 
            iconURL: interaction.guild.iconURL() 
          });

        await message.edit({ embeds: [suggestionAcceptedEmbed] })
        .then(async () => {
            await interaction.reply({ content: 'Suggestion accepted', ephemeral: true });
        })
    } else {
        return interaction.reply({ content: 'Invalid suggestion', ephemeral: true });
    }
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await interaction.reply('⚠️ Error occurred during suggestion.');
    }
  }
}