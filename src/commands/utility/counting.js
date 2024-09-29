const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const counting = require('../../Schemas/countingSchema');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('counting')
  .setDescription('Manage counting!')
  .addSubcommand(
    command => command
    .setName('setup')
    .setDescription('Setup counting system')
    .addChannelOption(option => option.setName('channel').setDescription('Set counting channel').addChannelTypes(ChannelType.GuildText).setRequired(true))
  )
  .addSubcommand(
    command => command
    .setName('disable')
    .setDescription('Disable counting')
  ),
  async execute (interaction) {
    const { options } = interaction;
    const sub = interaction.options.getSubcommand()
    const data = await counting.findOne({ Guild: interaction.guild.id});

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have permissions to manage counting!`, ephermal: true })

    switch (sub) {
      case 'setup':

      if (data) {
        return await interaction.reply({ content: 'Counting has already been set up!', emphermal: true})
      } else {
        const channel = interaction.options.getChannel('channel');
        await counting.create({
          Guild: interaction.guild.id,
          Channel: channel.id,
          Number: 1
        });
        const embed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setDescription(`Counting has been set up! Start counting in ${channel}!`)

        await interaction.reply({ embeds: [embed] });
      }

      break;
      case 'disable':
        
      if (!data) {
        return await interaction.reply({ content: `You don't have counting set up!` })
      } else {
        await counting.deleteOne({
          Guild: interaction.guild.id,
        });

        const embed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setDescription(`Counting disabled!`)

        await interaction.reply({ embeds: [embed] });
      }
    }
  }
} 