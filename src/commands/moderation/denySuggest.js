const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deny')
		.setDescription('Deny a suggestion!')
    .addStringOption(option =>
      option.setName('message-id')
        .setDescription('Message ID of the suggestion')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Reason for rejection')
        .setRequired(true)
    ),
        async execute(interaction) {
          try{
            const messageId = interaction.options.getString('message-id');
            const message = await interaction.channel.messages.fetch(messageId);
            const reason = interaction.options.getString('reason');
            const embed = message.embeds[0];
      
            if (embed && message.author.id === interaction.client.user.id) {
              const currentDescription = embed.description || '';
              const suggestionDeniedEmbed = new EmbedBuilder(embed)
                .setDescription(`${currentDescription}\n\n<:xtriangle_small:1276263767872770108> **Denial Reason:** ${reason}`)
                .setTitle(`<:xdenied:1276188176238645300> 𝙳𝙴𝙽𝙸𝙴𝙳 <:xdenied:1276188176238645300>`)
                .setFooter({
                  text: `This suggestion was denied.`, 
                  iconURL: interaction.guild.iconURL() 
                });;
      
              message.edit({ embeds: [suggestionDeniedEmbed] })
              .then(async () => {
                  await interaction.reply({ content: 'Suggestion denied', ephemeral: true });
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