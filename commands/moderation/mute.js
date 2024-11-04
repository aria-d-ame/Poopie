const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'mute',
  description: 'Moderation: Mute',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'User for mute',
      type: ArgumentType.USER,
      required: true
    }),
    new Argument({
      name: 'time',
      description: 'Time for mute (minutes)',
      type: ArgumentType.INTEGER,
      required: true
    }),
    new Argument({
      name: 'reason',
      description: 'Rule broken/reason for mute',
      type: ArgumentType.STRING,
      required: true
    })
  ],

  run: async (ctx) => {
    const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
    if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
      return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    const targetUser = ctx.arguments.getUser('user');
    const muteTime = ctx.arguments.getInteger('time') * 60 * 1000;
    const muteReason = ctx.arguments.getString('reason');

    const member = await ctx.guild.members.fetch(targetUser.id);

    await member.timeout(muteTime, muteReason);

    const muteEmbed = new EmbedBuilder()
    .setColor('YELLOW')
    .setDescription(`You have muted ${targetUser} for ${ctx.arguments.getInteger('time')} minutes. Reason: ${muteReason}`);

  ctx.reply({ embeds: [muteEmbed], ephemeral: true });

  const notifyEmbed = new EmbedBuilder()
  .setColor('RED')
  .setDescription(`You have been muted for ${ctx.arguments.getInteger('time')} minutes. Reason: ${muteReason}`);

  // Send the notification to the muted user, if they share a server
  try {
    await member.send({ embeds: [notifyEmbed] });
  } catch (err) {
    console.log('Could not send message to the muted user:', err);
    }
  }
})