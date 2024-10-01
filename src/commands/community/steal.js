const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moneySchema = require('../../Schemas/money.js');

module.exports = {
  cooldown: 1200,
    data: new SlashCommandBuilder()
        .setName('steal')
        .setDescription(`Steal a user's Pix-Stars!`)
        .addUserOption(option => option.setName('user').setDescription('User to steal from.').setRequired(true)),
    async execute(interaction) {
        const { guild } = interaction;
        const target = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(target.id);
        const stealer = await interaction.guild.members.fetch(interaction.user.id);
        const minSteal = 10;
        const maxSteal = 700;
        const stealAmount = getRandomInt(minSteal, maxSteal);
        
    
        function getRandomInt(min, max) {
           return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const stealerData = await moneySchema.findOne({ Guild: guild.id, User: stealer.id });
        const targetData = await moneySchema.findOne({ Guild: guild.id, User: member.id });
        
        if (!targetData) {
            return interaction.reply({ content: "There's nothing to steal!", ephemeral: true });
        }

        // Debugging logs
        console.log(`Stealer Balance Before: ${stealerData.Money}`);
        
        if (targetData.Money < stealAmount) {
            return interaction.reply({ content: "There's not enough to steal!", ephemeral: true });
        }

        // Deduct stars from giver
        stealerData.Money += stealAmount;
        await stealerData.save();

        // Add stars to target
        if (!stealerData) {
            const newStealerData = new moneySchema({ Guild: guild.id, User: member.id, balance: stealAmount });
            await newStealerData.save();
        } else {
            targetData.Money -= stealAmount;
            await targetData.save();
        }

        // Debugging logs
        console.log(`Stealer Balance After: ${stealerData.Money}`);
        if (targetData) {
            console.log(`Target Balance After: ${targetData.Money}`);
        }

        // Create and send the embed
        const stealEmbed = new EmbedBuilder()
            .setColor(0x8269c2)
            .setTitle(`<:announce:1276188470250832014> 𝚂𝚃𝙴𝙰𝙻 <:announce:1276188470250832014>`)
            .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n Successfully stole <:xPix_Stars:1275118528844009563> ${stealAmount} from ${target.tag}!`);

        await interaction.reply({ embeds: [stealEmbed] });
    }
};