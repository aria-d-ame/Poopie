const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const marrySchema = require('../../schemas/marrySchema.js');

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
    if (marryDataSpouse && marryDataSpouse.Spouse !== null) {
      return ctx.reply({ content: `<@${marryingUser}> is already married!`, ephemeral: true });
    }
    
    let marryDataUser = await marrySchema.findOne({ Guild: guild.id, User: author.id });
    if (marryDataUser && marryDataUser.Spouse !== null) {
      return ctx.reply({ content: `You're already married to <@${marryDataUser.Spouse}>!`, ephemeral: true });
    }

    const marryEmbed = new EmbedBuilder()
      .setAuthor({ name: proposingUser.displayName, iconURL: proposingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝙼𝙰𝚁𝚁𝚈 <:xannounce:1276188470250832014>`)
      .setDescription(`\n<@${marryingUser}>, <@${proposingUser}> would like to marry you!`)
      .setFooter({ text: marryingUser.displayName, iconURL: marryingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 })});

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

    collector.on('collect', async (confirmation) => {
      if (confirmation.user.id !== marryingUser) {
        return confirmation.reply({ content: "You can't accept this proposal!", ephemeral: true });
      }

      if (confirmation.customId === 'reject') {
        const rejectEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle(`<:xannounce:1276188470250832014> 𝙼𝙰𝚁𝚁𝚈 <:xannounce:1276188470250832014>`)
          .setDescription(`<@${proposingUser}>, <@${marryingUser}> has rejected your proposal!`)      
          .setAuthor({ name: proposingUser.displayName, iconURL: proposingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
          .setFooter({ text: marryingUser.displayName, iconURL: marryingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 })});

        await confirmation.update({ embeds: [rejectEmbed], components: [] });
      } else if (confirmation.customId === 'accept') {

        console.log(`${ctx.user.username} marrying ${confimation.user.username}`)

        dataProposer = await marrySchema.create({
          Guild: guild.id,
          User: proposingUser.id,
          Spouse: marryingUser.id
        });
        await dataProposer.save();

        dataMarrying = await marrySchema.create({
          Guild: guild.id,
          User: marryingUser.id,
          Spouse: proposingUser.id
        });
        await dataMarrying.save();

        // Send confirmation message
        const marriedEmbed = new EmbedBuilder()
          .setColor('Green')
          .setTitle(`<:xannounce:1276188470250832014> 𝙼𝙰𝚁𝚁𝚈 <:xannounce:1276188470250832014>`)
          .setDescription(`<@${proposingUser}>, <@${marryingUser}> has accepted your proposal! You're now married!`)
          .setAuthor({ name: proposingUser.displayName, iconURL: proposingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
          .setFooter({ text: marryingUser.displayName, iconURL: marryingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 })});

        await confirmation.update({ embeds: [marriedEmbed], components: [] });
      }
    });
  }
})