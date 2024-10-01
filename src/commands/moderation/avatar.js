const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName(`avatar`)
  .setDescription(`See a server member's avatar!`)
  .addUserOption(option => option.setName('user').setDescription(`User for avatar!`).setRequired(false)),
  async execute (interaction) {
    try{
      const user = interaction.options.getUser(`user`) || interaction.user;
      const member = await interaction.guild.members.fetch(user.id);

      const icon = user.displayAvatarURL({ dynamic: true, size: 2048 });

      const avatarembed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝚄𝚂𝙴𝚁 𝙰𝚅𝙰𝚃𝙰𝚁 <:xannounce:1276188470250832014>`)
      .setAuthor({ name: user.displayName })
      .setDescription('**«═══✧ ✦ ✧ ✦ ✧═══»**')
      .setImage(icon)
      .setFooter({
        text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
        iconURL: interaction.guild.iconURL() // Optional: Server icon URL
      })

      await interaction.reply({ embeds: [avatarembed] });
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await interaction.reply('⚠️ Error occurred while fetching user information.');
    }
  }
}