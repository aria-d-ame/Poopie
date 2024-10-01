const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const levelSchema = require('../../Schemas/level.js');
const moneySchema = require('../../Schemas/money.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('rank')
  .setDescription(`Check someone's rank in the server!`)
  .addSubcommand(
    command => command
    .setName('xp')
    .setDescription(`Check someone's XP rank in the server!`)
    .addUserOption(option => option.setName(`user`).setDescription(`Member for rank check.`).setRequired(false)),
  )
  .addSubcommand(
    command => command
    .setName('stars')
    .setDescription(`Check someone's Pix-Stars in the server!`)
    .addUserOption(option => option.setName(`user`).setDescription(`Member for rank check.`).setRequired(false)),
  ),

  async execute(interaction) {
		const user = interaction.options.getUser(`user`) || interaction.user;
		const member = await interaction.guild.members.fetch(user.id);
    const {options, guild, client} = interaction
    const starData = await moneySchema.findOne({ Guild: guild.id, User: member.id });
    const xpData = await levelSchema.findOne({ Guild: guild.id, User: member.id });
    const sub = interaction.options.getSubcommand()
    const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });

    switch (sub) {
      case 'xp':

      const noxpdata = new EmbedBuilder()
      .setColor(0x8269c2)
      .setDescription(`${member} has not gained XP yet.`)
  
      if (!xpData) return await interaction.reply({ embeds: [noxpdata]});
      
      const Required = xpData.Level * xpData.Level * 30
  
      const rankxp = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce:1276188470250832014> 𝚁𝙰𝙽𝙺: 𝚇𝙿 <:announce:1276188470250832014>`)
      .setAuthor({ name: user.displayName })
      .setThumbnail(icon)
      .setFooter({
        text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
        iconURL: interaction.guild.iconURL() // Optional: Server icon URL
      })
      .setDescription('**«═══✧ ✦ ✧ ✦ ✧═══»**')
      .addFields(
        { name: '<:triangle_medium:1276262944836947999> Level:', value: `<:triangle_small:1276263767872770108> ${xpData.Level}`, inline: false }, 
        { name: '<:triangle_medium:1276262944836947999> Current XP:', value: `<:triangle_small:1276263767872770108> ${xpData.XP}`, inline: true }, 
        { name: '<:triangle_medium:1276262944836947999> Next Level:', value: `<:triangle_small:1276263767872770108> <@${Required}>`, inline: true },
      )
  
      await interaction.reply({embeds: [rankxp]})

      break;
      case 'stars':
      
      const nostarembed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setDescription(`${member} has not gained Pix-Stars yet.`)
  
      if (!starData) return await interaction.reply({ embeds: [nostarembed]});
  
      const embed3 = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce:1276188470250832014> 𝚁𝙰𝙽𝙺: 𝙿𝙸𝚇-𝚂𝚃𝙰𝚁𝚂 <:announce:1276188470250832014>`)
      .setAuthor({ name: user.displayName })
      .setThumbnail(icon)
      .setFooter({
        text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
        iconURL: interaction.guild.iconURL() // Optional: Server icon URL
      })
      .setDescription('**«═══✧ ✦ ✧ ✦ ✧═══»**')
      .addFields(
        { name: '<:triangle_medium:1276262944836947999> Pix-Stars:', value: `<:triangle_small:1276263767872770108> ${starData.Money}`, inline: false }, 
      )
  
      await interaction.reply({embeds: [embed3]})

	}
}
};