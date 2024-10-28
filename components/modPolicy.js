const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Component({
  name: 'modPolicy',
  type: [ComponentType.BUTTON],
  // The function thats called when the button is pressed
  run: async (ctx) => {
    const rulesChannel = await ctx.guild.channels.fetch('1269443795368284273');

    const modPolicyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce_red:1276188522478436393> 𝙼𝙾𝙳𝙴𝚁𝙰𝚃𝙸𝙾𝙽 𝙿𝙾𝙻𝙸𝙲𝚈 <:announce_red:1276188522478436393>`)

    if (moderationChannel) {
      await moderationChannel.send(`<@&1269757597301604423> Report for vent:\nMessage ID: ${ctx.interaction.message.id}\nCase: ${venterID}`);
    } else {
      console.log('Moderation channel not found!');
    }

    await ctx.reply({ content: 'Report sent to moderation.', ephemeral: true });
  }
})