const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const { marrySchema } = require('../../schemas/marrySchema.js');

new Command({
  name: 'marry',
  description: 'Marry someone in the server!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'Who would you like to marry?',
      type: ArgumentType.USER,
      required: true
    }),
    new Argument({
      name: 'ring',
      description: 'What ring would you like to use?',
      type: ArgumentType.STRING,
      required: true
    })
  ],

  run: async (ctx) => {
    const proposingUser = ctx.user;
    const marryingUser = ctx.arguments.getUser('user');

    
  }
})