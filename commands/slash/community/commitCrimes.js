const { Command, CommandType } = require ('gcommands');
const { EmbedBuilder } = require('discord.js');
const starSchema = require('../../../schemas/money.js');
const crimeSchema = require('../../../schemas/crimeSchema.js');

// Allows users to commit a crime, with a chance to get a good or bad outcome.
new Command({
  name: 'crime',
  description: 'Commit a crime!',
  type: [CommandType.SLASH],
  cooldown: '60s',//so it work now? yes? it should. its either 60s or js 60

  run: async (ctx) => {
    try{
      const userId = ctx.user.id;
      const guildId = ctx.guild.id;
      let userMoney = await starSchema.findOne({ Guild: guildId, User: userId });
      let userCrimes = await crimeSchema.findOne({ Guild: guildId, User: userId });
      
      if (!userMoney) {
        return ctx.interaction.reply({ content: "Please send your first message first!", ephemeral: true });
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
        `💨 | ${ctx.user} is making mustard gas in the room! Losers.`, //0
        `🔫 | Oh no! ${ctx.user} is about to shoot someone. Oh, they just shot his balls. Poor guy.`, //1
        `🔫 | Oh no! ${ctx.user} is about to shoot someone. Oh, and they stole his wallet. It had <:xPix_Stars:1275118528844009563>${crimeAmount} in it! Nice!`, //2
        `💣 | Oh. ${ctx.user} has a bomb. See ya guys.`, //3
        `🏦 | ${ctx.user} is robbing a bank! Yet walked out with nothing??`, //4
        `🏦 | ${ctx.user} is robbing a bank! They managed to steal <:xPix_Stars:1275118528844009563>${crimeAmount}!`, //5
        `🚨 | ${ctx.user} is robbing a bank! But the police are only a block away...`, //6
        `👿 | waluigi.`, //7
        `🐀 | Guys, ${ctx.user} just said "crazy."`, //8
        `🔥 | The building is burning down! I heard ${ctx.user} started the fire.`, //9
        `🚨 | The building is burning down! Looks like ${ctx.user} is getting arrested nearby, it was probably them.`, //10
        `🌆 | Oh no! ${ctx.user} is walking suspiciously towards that alleyway! Oh, they're just loitering.`, //11
        `💵 | ${ctx.user} hasn't paid their taxes in a while. They saved <:xPix_Stars:1275118528844009563>${crimeAmount}`, //12
        `🚨 | ${ctx.user} hasn't paid their taxes in a while. The IRS might get them...` //13
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
          if (ctx.member.id === ctx.guild.ownerId) {
            return ctx.interaction.reply({content: "⚠️ You cannot be timed out as the server owner.", ephemeral: true});
          }
        try{
        ctx.member.timeout(5 * 60 * 1000);
        } catch (error) {
          console.log(error);
          throw (error)
        }
      }

      userCrimes.Crime += 1;
      userCrimes.save();
  
      const embed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce:1276188470250832014> 𝙲𝚁𝙸𝙼𝙴 <:announce:1276188470250832014>`)
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${choice[crime]} Crime Counter: ${userCrimes.Crime}`)
  
      await ctx.interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  }
})