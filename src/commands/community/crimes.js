const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Money = require('../../Schemas/money.js');
const crimeSchema = require('../../Schemas/crimeSchema.js');

module.exports = {
  cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('commitcrimes')
		.setDescription('Commit a crime!'),
	async execute(interaction) {
    try{
      const userId = interaction.user.id;
      const guildId = interaction.guild.id;
      let userMoney = await Money.findOne({ Guild: guildId, User: userId });
      let userCrimes = await crimeSchema.findOne({ Guild: guildId, User: userId });
      
      if (!userMoney) {
        return interaction.reply({ content: "Please send your first message first!", ephemeral: true });
      }

      if (!userCrimes) {
        userCrimes = await crimeSchema.create({
            Guild: guildId,
            User: userId,
            Crime: 0,
        });
    }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      const minGive = 1;
      const maxGive = 1000;
      const crimeAmount = getRandomInt(minGive, maxGive)
  
      const choice = [
        `💨 | ${interaction.user} is making mustard gas in the room! Losers.`, //0
        `🔫 | Oh no! ${interaction.user} is about to shoot someone. Oh, they just shot his balls. Poor guy.`, //1
        `🔫 | Oh no! ${interaction.user} is about to shoot someone. Oh, and they stole his wallet. It had <:xPix_Stars:1275118528844009563>${crimeAmount} in it! Nice!`, //2
        `💣 | Oh. ${interaction.user} has a bomb. See ya guys.`, //3
        `🏦 | ${interaction.user} is robbing a bank! Yet walked out with nothing??`, //4
        `🏦 | ${interaction.user} is robbing a bank! They managed to steal <:xPix_Stars:1275118528844009563>${crimeAmount}!`, //5
        `🚨 | ${interaction.user} is robbing a bank! But the police are only a block away...`, //6
        `👿 | waluigi.`, //7
        `🐀 | Guys, ${interaction.user} just said "crazy."`, //8
        `🔥 | The building is burning down! I heard ${interaction.user} started the fire.`, //9
        `🚨 | The building is burning down! Looks like ${interaction.user} is getting arrested nearby, it was probably them.`, //10
        `🌆 | Oh no! ${interaction.user} is walking suspiciously towards that alleyway! Oh, they're just loitering.`, //11
        `💵 | ${interaction.user} hasn't paid their taxes in a while. They saved <:xPix_Stars:1275118528844009563>${crimeAmount}`, //12
        `🚨 | ${interaction.user} hasn't paid their taxes in a while. The IRS might get them...` //13
      ];
      const crime = Math.floor(Math.random() * choice.length);
      const goodOutcome = (crime === 2) || (crime === 5) || (crime === 12);
      const badOutcome = (crime === 6) || (crime === 7) || (crime === 10) || (crime === 13);
  
      if (goodOutcome) {
        userMoney.Money += crimeAmount;
        await userMoney.save(); 
      }
      if (badOutcome) {
          // Check if the member is the owner of the server
          if (interaction.member.id === interaction.guild.ownerId) {
            return interaction.reply({content: "⚠️ You cannot be timed out as the server owner.", ephemeral: true});
          }
        try{
        interaction.member.timeout(10 * 60 * 1000);
        } catch (error) {
          console.log(error);
          throw (error)
        }
      }

      userCrimes.Crime += 1;
      userCrimes.save();
  
      const embed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce:1276188470250832014> CRIME <:announce:1276188470250832014>`)
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${choice[crime]} Crime Counter: ${userCrimes.Crime}`)
  
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
  }
	},
};