const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Money = require('../../Schemas/money.js');

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Gamble on a coinflip!')
    .addStringOption(option =>
      option.setName('side')
        .setDescription('Choose heads or tails.')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        ))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Pix-Stars to bet.')
        .setRequired(true)),
	async execute(interaction) {
    const betAmount = interaction.options.getInteger('amount');
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    let userMoney = await Money.findOne({ Guild: guildId, User: userId });
    

    if (!userMoney) {
      return interaction.reply({ content: "You don't have any Pix-Stars yet!", ephemeral: true });
    }

    if (userMoney.Money < betAmount) {
      return interaction.reply(`You don't have enough Pix-Stars to bet! You only have ${userMoney.Money}!`);
    }

		const choice = [
      `🪙 | ${interaction.user} bets <:xPix_Stars:1275118528844009563>${betAmount} to flip a coin... it's **HEADS**!`,
      `🪙 | ${interaction.user} bets <:xPix_Stars:1275118528844009563>${betAmount} to flip a coin... it's **TAILS**!`,
    ];
    const coin = Math.floor(Math.random() * 2); 
    let outcome = choice[coin];

    const userChoice = interaction.options.getString('side'); // 'heads' or 'tails'
    const isWin = (coin === 0 && userChoice === 'heads') || (coin === 1 && userChoice === 'tails');

    if (isWin) {
      userMoney.Money += betAmount;
      await userMoney.save(); 
      outcome += ` Nice one! You gained ${betAmount}!`;
    } else {
      userMoney.Money -= betAmount;
      if (userMoney.Money < 0) userMoney.Money = 0; 
      await userMoney.save(); 
      outcome += ` You're awful at this. You lost ${betAmount}.`;
    }

    const coinEmbed = new EmbedBuilder()
    .setColor(0x8269c2)
    .setTitle(`<:announce:1276188470250832014> COINFLIP <:announce:1276188470250832014>`)
    .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${outcome}`)

    await interaction.reply({ embeds: [coinEmbed] });
	},
};