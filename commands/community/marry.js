const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
    })
  ],

  run: async (ctx) => {
    const proposingUser = ctx.user;
    const marryingUser = ctx.arguments.getUser('user');

    let marryDataSpouse = await marrySchema.findOne({ Guild: guild.id, User: marryingUser });
    if (marryDataSpouse.Spouse !== null) {
      return ctx.reply({ content: `<@${marryingUser}> is already married!`, ehpemeral: true });
    } 
    let marryDataUser = await marrySchema.findOne({ Guild: guild.id, User: author.id });
    if (marryDataUser.Spouse !== null) {
      return ctx.reply({ content: `You're already married to <@${marryDataUser.Spouse}>!`, ephemeral: true });
    }

    const marryEmbed = new EmbedBuilder()
      .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
      .setColor(0x8269c2)
      .setTitle(``)
      .setDescription(`\n<@${marryingUser}>, <@${proposingUser}> would like to marry you!`)

    const acceptButton = new ButtonBuilder()
      .setCustomId('accept')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1276185812257738823');
    const rejectButton = new ButtonBuilder()
      .setCustomId('reject')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('1276188176238645300')

    const marryButtons = new ActionRowBuilder()
      .addComponents(acceptButton, rejectButton);

    const response = await ctx.reply({
      embeds: [marryEmbed],
      components: [marryButtons],
      ephemeral: false,
      fetchReply: true
    });

    const collector = ctx.channel.createMessageComponentCollector({ time: 600_000 });

    let chosenItem;

    collector.on('collect', async (confirmation) => {
      if (confirmation.user.id !== marryingUser) {
        return confirmation.reply({ content: "You can't accept this proposal!", ephemeral: true });
      }

      if (confirmation.customId === 'reject') {
        await confirmation.update({ embeds: [rejectEmbed] });
        chosenItem = {  };
      } else if (confirmation.customId === 'accept') {

        console.log(`Button pressed: ${confirmation.customId}, buying: ${chosenItem.name}`)

        const role = guild.roles.cache.get(chosenItem.roleId);
        if (role) {
          await user.roles.add(role);
        }
        // Send confirmation message
        const marriedEmbed = new EmbedBuilder()
          .setColor(0x8269c2)
          .setTitle(`<:announce:1276188470250832014>  <:announce:1276188470250832014>`)
          .setDescription(``);

        await confirmation.update({ embeds: [marriedEmbed], components: [] });
      }
    });
  }
})