const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moneySchema = require('../../Schemas/money.js');
const COOLDOWN_DAILY = 86400000

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your daily Pix-Stars!'),
	async execute(interaction) {

    const user = interaction.user;
		const member = await interaction.guild.members.fetch(user.id);
    const { guild } = interaction
    const data = await moneySchema.findOne({ Guild: guild.id, User: member.id });
    const extraCashRoleId = '1275906991511834688';
    const hasExtraCashRole = member.roles.cache.has(extraCashRoleId);
    const minGive = 50;
    const maxGive = 250;
    const baseAmount = getRandomInt(minGive, maxGive);
		const currentTime = Date.now();
		const timeSinceLastDaily = currentTime - data.LastDailyTime;

		if (timeSinceLastDaily < COOLDOWN_DAILY) {
			const expirationTime = data.LastDailyTime + COOLDOWN_DAILY;
			return interaction.reply({ content: `You can use this command again <t:${Math.floor(expirationTime / 1000)}:R>!`, ephemeral: true });
		}

  

    function getRandomInt(min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Add the base amount to the user's money
    data.Money += baseAmount;

    // If the user has the extra cash role, give an additional bonus
    if (hasExtraCashRole) {
        const extraCash = 500; // Define how much extra money to give
        data.Money += extraCash;// Add extra money to the total
        const dailybooster = new EmbedBuilder()
        .setColor(0x8269c2)
        .setTitle(`<:announce:1276188470250832014> DAILY <:announce:1276188470250832014>`)
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n You have claimed your daily for <:xPix_Stars:1275118528844009563>${baseAmount}, and you have recieved an additional <:xPix_Stars:1275118528844009563>500 for boosting! Come back in 24 hours!`)
        await interaction.reply({ embeds: [dailybooster] });
    }
    data.LastDailyTime = currentTime;
    await data.save();

    if (!hasExtraCashRole) {
    const daily = new EmbedBuilder()
    .setColor(0x8269c2)
    .setTitle(`<:announce:1276188470250832014> DAILY <:announce:1276188470250832014>`)
    .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n You have claimed your daily for <:xPix_Stars:1275118528844009563>${baseAmount}! Come back in 24 hours!`)

    await interaction.reply({ embeds: [daily] });
    data.LastDailyTime = currentTime;
    await data.save();

    }
	},
};