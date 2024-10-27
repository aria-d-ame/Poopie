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
      description: 'Time for mute',
      type: ArgumentType.USER,
      required: true
    })
  ]
})