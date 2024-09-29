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
    const sub = interaction.options.getSubcommand()


    switch (sub) {
      case 'xp':

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
        const embed = new EmbedBuilder()
          .setTitle(`<:announce:1276188470250832014> XP LEADERBOARD <:announce:1276188470250832014>`)
          .setColor(0x8269c2)
          .setFooter({
            text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
            iconURL: interaction.guild.iconURL()
          })
          .setTimestamp();

        // If no leaderboard, inform user.
        if (!xpData.length) {
          embed.setDescription('This server does not have a leaderboard yet!');
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
          embed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        // Send the leaderboard embed
        await interaction.editReply({ embeds: [embed] });

        break;
      case 'stars':

        const starData = await moneySchema.find({ Guild: guild.id })
          .sort({
            Money: -1,
          })
          .limit(10)

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
            .setTitle(`<:announce:1276188470250832014> PIX-STARS LEADERBOARD <:announce:1276188470250832014>`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({
              text: `${interaction.guild.name} • Members: ${interaction.guild.memberCount}`, // Footer text
              iconURL: interaction.guild.iconURL() // Optional: Server icon URL
            })

          interaction.editReply({ embeds: [starlbembed] })
        }

      case 'crime':

        const crimeData = await crimeSchema.find({ Guild: guild.id })
          .sort({
            Crime: -1,
          })

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
            .setTitle(`<:announce:1276188470250832014> CRIME LEADERBOARD <:announce:1276188470250832014>`)
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