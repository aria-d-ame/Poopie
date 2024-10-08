const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const levelSchema = require('../../Schemas/level.js')
const moneySchema = require('../../Schemas/money.js')
const xpRankPosition = require('../../xpRankPosition.js')
const starRankPosition = require('../../starRankPosition.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('rank')
  .setDescription(`Check someone's rank in the server!`)
  .addUserOption(option => option.setName(`user`).setDescription(`Member for rank check.`).setRequired(false)),

  async execute(interaction) {
		const user = interaction.options.getUser(`user`) || interaction.user;
		const member = await interaction.guild.members.fetch(user.id);
    const {options, guild, client} = interaction
    const starData = await moneySchema.findOne({ Guild: guild.id, User: member.id });
    const xpData = await levelSchema.findOne({ Guild: guild.id, User: member.id });
    const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });
    const xpRank = await xpRankPosition(user.id, interaction.guild.id);
    const starRank = await starRankPosition(user.id, interaction.guild.id);
  
      if (!xpData) return await interaction.reply({ });
      if (!starData) return await interaction.reply({ content: 'This user does not have any data yet!', ephemeral: true });
      
      const Required = xpData.Level * xpData.Level * 30
  
      const rankEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce:1276188470250832014> 𝚁𝙰𝙽𝙺 <:announce:1276188470250832014>`)
      .setAuthor({ name: user.displayName })
      .setThumbnail(icon)
      .setFooter({
        text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`,
        iconURL: interaction.guild.iconURL()
      })
      .setDescription(' ')
      .addFields(
        { name: '𝚇𝙿', value: '«═══✧ ✦ ✧═══»', inline: false },
        { name: '<:triangle_medium:1276262944836947999> Level:', value: `<:triangle_small:1276263767872770108> ${xpData.Level}`, inline: true },
        { name: '<:triangle_medium:1276262944836947999> Rank:', value: `<:triangle_small:1276263767872770108> ${xpRank}`, inline: true }, 
        { name: ' ', value: ' ', inline: false },
        { name: '<:triangle_medium:1276262944836947999> Current XP:', value: `<:triangle_small:1276263767872770108> ${xpData.XP}`, inline: true }, 
        { name: '<:triangle_medium:1276262944836947999> Next Level:', value: `<:triangle_small:1276263767872770108> ${Required}`, inline: true },
        { name: '𝙿𝙸𝚇-𝚂𝚃𝙰𝚁𝚂', value: '«═══✧ ✦ ✧═══»', inline: false },
        { name: '<:triangle_medium:1276262944836947999> Pix-Stars:', value: `<:triangle_small:1276263767872770108> ${starData.Money}`, inline: true },
        { name: '<:triangle_medium:1276262944836947999> Rank:', value: `<:triangle_small:1276263767872770108> ${starRank}`, inline: true },
      );
  
      await interaction.reply({embeds: [rankEmbed]})
	}
};