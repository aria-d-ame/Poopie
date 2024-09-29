const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const levelSchema = require('../../Schemas/level.js');
const moneySchema = require('../../Schemas/money.js');
const crimeSchema = require('../../Schemas/crimeSchema.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription(`See the server leaderboards!`)
  .addSubcommand(
    command => command
    .setName('xp')
    .setDescription(`See the server's XP leaderboard!`)
  )
  .addSubcommand(
    command => command
    .setName('stars')
    .setDescription(`See the server's Pix-Stars leaderboard!`)
  )
  .addSubcommand(
    command => command
    .setName('crime')
    .setDescription(`See the server's crime leaderboard!`)
  ),

  async execute(interaction) {
    const { guild, client } = interaction;
    let text = ``;
    const xpData = await levelSchema.find({ Guild: guild.id })
    .sort({
      XP: -1,
      Level: -1,
    })
    .limit(10)
    const starData = await moneySchema.find({ Guild: guild.id })
    .sort({
      Money: -1,
    })
    .limit(10)
    const crimeData = await crimeSchema.find({ Guild: guild.id })
    .sort({
      Crime: -1,
    })
    const sub = interaction.options.getSubcommand()


    switch (sub) {
      case 'xp':

      const xpembed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setDescription(`This server does not have a leaderboard yet!`)
  
        if (!xpData) return await interaction.reply({ embed: [xpembed] });
  
        await interaction.deferReply();
  
        for (let counter = 0; counter < xpData.length; ++counter) {
          let { User, XP, Level } = xpData[counter];
          const value = await client.users.fetch(User) || 'Unknown member'
          const member = value.tag;
          text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`
  
          const xplbembed = new EmbedBuilder()
          .setColor(0x8269c2)
          .setTitle(`${interaction.guild.name}'s XP Leaderboard`)
          .setDescription(`\`\`\`${text}\`\`\``)
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL() // Optional: Server icon URL
          })
  
          interaction.editReply({ embeds: [xplbembed] })
        }

      break;
      case 'stars':
      
      const starembed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setDescription(`This server does not have a leaderboard yet!`)

  
        if (!starData) return await interaction.reply({ embed: [starembed] });
  
        await interaction.deferReply();
  
        for (let counter = 0; counter < starData.length; ++counter) {
          let { User, Money } = starData[counter];
          const value = await client.users.fetch(User) || 'Unknown member'
          const member = value.tag;
          text += `${counter + 1}. ${member} | Pix-Stars: ${Money} \n`
  
          const starlbembed = new EmbedBuilder()
          .setColor(0x8269c2)
          .setTitle(`${interaction.guild.name}'s Pix-Stars Leaderboard`)
          .setDescription(`\`\`\`${text}\`\`\``)
          .setTimestamp()
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL() // Optional: Server icon URL
          })
  
          interaction.editReply({ embeds: [starlbembed] })
        }

        case 'crime':
      
        const crimeembed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setDescription(`This server does not have a leaderboard yet!`)
  
    
          if (!starData) return await interaction.reply({ embed: [crimeembed] });
    
          await interaction.deferReply();
    
          for (let counter = 0; counter < crimeData.length; ++counter) {
            let { User, Crime } = crimeData[counter];
            const value = await client.users.fetch(User) || 'Unknown member'
            const member = value.tag;
            text += `${counter + 1}. ${member} | Crimes: ${Crime} \n`
    
            const crimelbembed = new EmbedBuilder()
            .setColor(0x8269c2)
            .setTitle(`${interaction.guild.name}'s Crime Leaderboard`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({
              text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
              iconURL: interaction.guild.iconURL() // Optional: Server icon URL
            })
    
            interaction.editReply({ embeds: [crimelbembed] })
          }

	}
}
};