const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const caseSchema = require('../../../schemas/caseSchema');

new Command({
  name: 'view-cases',
  description: 'Moderation: Cases',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'case',
      description: 'If looking for specific case',
      type: ArgumentType.STRING,
      required: false,
    }),
    new Argument({
      name: 'sort',
      description: 'Sort, default sorted by time',
      type: ArgumentType.STRING,
      required: false,
      choices: [
        { name: 'User', value: 'user' },
        { name: 'Type', value: 'type' },
        { name: 'Moderator', value: 'mod' },
      ],
    })
  ],


  run: async (ctx) => {
    const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
    if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
      return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    const sortType = ctx.arguments.getString('sort');
    const specCase = ctx.arguments.getString('case');

   if (sortType === null) {
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
              text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
              iconURL: ctx.guild.iconURL()
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
          await ctx.interaction.editReply({ embeds: [xpEmbed] });
   } 
  }
})