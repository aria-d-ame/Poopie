const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const levelSchema = require('../../Schemas/level.js');
const moneySchema = require('../../Schemas/money.js');
const crimeSchema = require('../../Schemas/crimeSchema.js');
const pointSchema = require('../../Schemas/activityTournament.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription(`See the server leaderboards!`)
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type of leaderboard.')
        .setRequired(true)
        .addChoices(
          { name: 'XP', value: 'xp' },
          { name: 'Pix-Stars', value: 'stars' },
          { name: 'Crime', value: 'crime' },
          { name: 'Tournament Points', value: 'points'}
        )),

  async execute(interaction) {
    const { guild, client } = interaction;
    const rankType = interaction.options.getString('type');

    if (rankType === 'xp') {
        // Tell discord api to fuck off
        await interaction.deferReply();

        // Get top 10 docs in xpData based on XP, Level fields
        const xpData = await levelSchema.find({ Guild: guild.id })
          .sort({
            XP: -1,
            Level: -1,
          })
          .limit(10);

        // Create an embed to send the leaderboard
        const xpEmbed = new EmbedBuilder()
          .setTitle(`<:announce:1276188470250832014> 𝚇𝙿 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 <:announce:1276188470250832014>`)
          .setColor(0x8269c2)
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL()
          })
          .setTimestamp();

        // If no leaderboard, inform user.
        if (!xpData.length) {
          xpEmbed.setDescription('This server does not have a leaderboard yet!');
        } else {
          // Array consisting of name/level/xp details (string) for each user
          const userDescriptions = [];

          // Iterates through each xpData document to create name/level/xp details for user and pushes them to
          // to userDescriptions array
          for (xpDataDoc of xpData) {
            const { User, XP, Level } = xpDataDoc;
            const member = await client.users.fetch(User);
            userDescriptions.push(`${xpData.indexOf(xpDataDoc) + 1}. ${member.tag} | XP: ${XP} | Level: ${Level}`);
          };

          // Join elements in user descriptions array with \n (new line)
          xpEmbed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        // Send the leaderboard embed
        await interaction.editReply({ embeds: [xpEmbed] });
      }

      if (rankType === 'stars') {
      await interaction.deferReply();

        const starData = await moneySchema.find({ Guild: guild.id })
          .sort({
            Money: -1,
          })
          .limit(10)
        
        const starEmbed = new EmbedBuilder()
          .setTitle(`<:announce:1276188470250832014> 𝙿𝙸𝚇-𝚂𝚃𝙰𝚁𝚂 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 <:announce:1276188470250832014>`)
          .setColor(0x8269c2)
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL()
          })
          .setTimestamp();

        // If no leaderboard, inform user.
        if (!starData.length) {
          starEmbed.setDescription('This server does not have a leaderboard yet!');
        } else {
          // Array consisting of name/level/xp details (string) for each user
          const userDescriptions = [];

          // Iterates through each xpData document to create name/level/xp details for user and pushes them to
          // to userDescriptions array
          for (starDataDoc of starData) {
            const { User, Money } = starDataDoc;
            const member = await client.users.fetch(User);
            userDescriptions.push(`${starData.indexOf(starDataDoc) + 1}. ${member.tag} | Pix-Stars: ${Money}`);
          };

          // Join elements in user descriptions array with \n (new line)
          starEmbed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        // Send the leaderboard embed
        await interaction.editReply({ embeds: [starEmbed] });
      }

      if (rankType === 'crime') {
      await interaction.deferReply();

        const crimeData = await crimeSchema.find({ Guild: guild.id })
          .sort({
            Crime: -1,
          })

          const crimeEmbed = new EmbedBuilder()
          .setTitle(`<:announce:1276188470250832014> 𝙲𝚁𝙸𝙼𝙴 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 <:announce:1276188470250832014>`)
          .setColor(0x8269c2)
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL()
          })
          .setTimestamp();

        // If no leaderboard, inform user.
        if (!crimeData.length) {
          crimeEmbed.setDescription('This server does not have a leaderboard yet!');
        } else {
          // Array consisting of name/level/xp details (string) for each user
          const userDescriptions = [];

          // Iterates through each xpData document to create name/level/xp details for user and pushes them to
          // to userDescriptions array
          for (crimeDataDoc of crimeData) {
            const { User, Crime } = crimeDataDoc;
            const member = await client.users.fetch(User);
            userDescriptions.push(`${crimeData.indexOf(crimeDataDoc) + 1}. ${member.tag} | Crimes: ${Crime}`);
          };

          // Join elements in user descriptions array with \n (new line)
          crimeEmbed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        // Send the leaderboard embed
        await interaction.editReply({ embeds: [crimeEmbed] });
    }

    if (rankType === 'points') {
      await interaction.deferReply();

        const pointData = await pointSchema.find({ Guild: guild.id })
          .sort({
            Points: -1,
          })
          .limit(5)

          const pointEmbed = new EmbedBuilder()
          .setTitle(`<:announce:1276188470250832014> 𝙿𝙾𝙸𝙽𝚃 𝙻𝙴𝙰𝙳𝙴𝚁𝙱𝙾𝙰𝚁𝙳 <:announce:1276188470250832014>`)
          .setColor(0x8269c2)
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL()
          })
          .setTimestamp();

        // If no leaderboard, inform user.
        if (!pointData.length) {
          pointEmbed.setDescription('This server does not have a leaderboard yet!');
        } else {
          // Array consisting of name/level/xp details (string) for each user
          const userDescriptions = [];

          // Iterates through each xpData document to create name/level/xp details for user and pushes them to
          // to userDescriptions array
          for (pointDataDoc of pointData) {
            const { User, Points } = pointDataDoc;
            const member = await client.users.fetch(User);
            userDescriptions.push(`${pointData.indexOf(pointDataDoc) + 1}. ${member.tag} | Points: ${Points}`);
          };

          // Join elements in user descriptions array with \n (new line)
          pointEmbed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        // Send the leaderboard embed
        await interaction.editReply({ embeds: [pointEmbed] });
    }
  }
};