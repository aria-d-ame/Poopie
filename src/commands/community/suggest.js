const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Make a suggestion!')
    .addStringOption(option =>
      option.setName('suggestion')
        .setDescription('What is your suggestion?')
        .setRequired(true)),
	async execute(interaction) {
    try{
      const user = interaction.user;
      const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });
      const suggestion = interaction.options.getString('suggestion');

      const suggestEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> SUGGESTION <:xannounce:1276188470250832014>`)
      .setAuthor({ name: user.displayName, iconURL: icon })
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n\n <:xtriangle_small:1276263767872770108> **${suggestion}**`)
      .setTimestamp()
      .setFooter({
        text: `Vote using the emojis below!`, 
        iconURL: interaction.guild.iconURL() 
      })
      const message = await interaction.reply({ embeds: [suggestEmbed], fetchReply: true });
      await message.react('1276185812257738823');
      await message.react('1276188176238645300');
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await interaction.reply('⚠️ Error occurred during suggestion.');
    }
  }
}