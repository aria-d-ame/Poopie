const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const levelSchema = require('./src/Schemas/level.js');
const moneySchema = require('./src/Schemas/money.js');
const rankPosition = require('../utility/rankPosition.js');
const { createCanvas } = require('canvas');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('profile')
  .setDescription(`Check someone's rank in the server!`)
  .addUserOption(option => option.setName(`user`).setDescription(`User for rank check.`).setRequired(false)),

  async execute(interaction) {
		const user = interaction.options.getUser(`user`) || interaction.user;
		const member = await interaction.guild.members.fetch(user.id);
    const {guild} = interaction
    const starData = await moneySchema.findOne({ Guild: guild.id, User: member.id });
    const xpData = await levelSchema.findOne({ Guild: guild.id, User: member.id });
    const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });
    const userXP = await levelSchema.findById(`${user.id}_${interaction.guild.id}`);
    const userStars = await moneySchema.findById(`${user.id}_${interaction.guild.id}`);
    const xp = userXP.XP;
    const level = userXP.Level;
    const stars = userStars.Money;
    const rank = await rankPosition(user.id, interaction.guild.id);
    const nextLevel = xpData.Level * xpData.Level * 30

    if (!userXP || !userStars) {
      return interaction.reply('Not enough information to create rank card.');
    }
    
	}
};