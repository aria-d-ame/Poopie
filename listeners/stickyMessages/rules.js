const { Listener } = require('gcommands');
const { EmbedBuilder, ButtonBuilder, ActionRow, ActionRowBuilder } = require('discord.js');

new Listener({
  name: 'Rules Sticky',
  event: 'messageCreate',

  run: async (ctx) => {
    const rulesStickyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:triangle_large:1276185605268832277> 𝙲𝚕𝚒𝚌𝚔 𝚋𝚎𝚕𝚘𝚠 𝚝𝚘 𝚟𝚒𝚎𝚠 𝚘𝚞𝚛 𝚖𝚘𝚍𝚎𝚛𝚊𝚝𝚒𝚘𝚗 𝚙𝚘𝚕𝚒𝚌𝚢!`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });

    const modPolicyButton = new ButtonBuilder()
      .setCustomId(customId('modPolicy', ctx.userId))
      .setLabel('Moderation Policy')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188522478436393');

    const modAppButton = new ButtonBuilder()
      .setCustomId(custionId('modApp', ctx.userId))
      .setLabel('Mod Application')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188470250832014');

    const ruleRow = new ActionRowBuilder()
      .addComponents(modPolicyButton, modAppButton);
  }
})