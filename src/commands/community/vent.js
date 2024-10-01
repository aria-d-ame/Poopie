const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vent')
		.setDescription('Vent anonymously!')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('What would you like to say?')
        .setRequired(true)),
	async execute(interaction) {
    try{
      const user = interaction.user.id
      const content = interaction.options.getString('content');
      const reportButton = new ButtonBuilder()
        .setCustomId('report')
        .setLabel('Report')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('1276188522478436393');

      const reportRow = new ActionRowBuilder()
        .addComponents(reportButton);

      const ventEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> VENT <:xannounce:1276188470250832014>`)
      .setAuthor({ name: 'Anonymous', iconURL: interaction.guild.iconURL() })
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n <:xtriangle_small:1276263767872770108> **${content}**`)
      .setTimestamp()

      await interaction.reply({ content: 'Your vent is being sent!', ephemeral: true });

      const response = await interaction.channel.send({
        embeds: [ventEmbed],
        components: [reportRow],
        ephemeral: false,
        fetchReply: true
      });

      const collectorFilter = i => i.user.id !== interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ time: 600_000 });
  
      collector.on('collect', async (confirmation) => {
        if (confirmation.user.id === interaction.user.id)
          return confirmation.reply({ content: "You can't report yourself!", ephemeral: true });
        
  
				if (confirmation.customId === 'report') {
					const moderationChannel = interaction.guild.channels.cache.get('1278877530635374675');
					if (moderationChannel) {
						await moderationChannel.send(`<@&1269757597301604423> Report for vent:\nMessage ID: ${response.id}\nCase: ${user}`);
					} else {
						console.log('Moderation channel not found!');
					}
					
					await confirmation.reply({ content: 'Report sent to moderation.', ephemeral: true });
				}
			});

    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await interaction.reply({ content: '⚠️ Error occurred during vent.', ephemeral: true });
    }
  }
}