const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moneySchema = require('../../Schemas/money.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Give a user Pix-Stars!')
        .addUserOption(option => option.setName('user').setDescription('User to give to.').setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The amount of Pix-Stars to give.')
                .setRequired(true)),
    async execute(interaction) {
        const { guild } = interaction;
        const target = interaction.options.getUser('user');
        const stars = interaction.options.getInteger('amount');
        const member = await interaction.guild.members.fetch(target.id);
        const giver = await interaction.guild.members.fetch(interaction.user.id);

        const giverData = await moneySchema.findOne({ Guild: guild.id, User: giver.id });
        const targetData = await moneySchema.findOne({ Guild: guild.id, User: member.id });
        
        if (!giverData) {
            return interaction.reply({ content: "You don't have anything to give!", ephemeral: true });
        }

        // Debugging logs
        console.log(`Giver Balance Before: ${giverData.Money}`);
        
        if (giverData.Money < stars) {
            return interaction.reply({ content: "You don't have enough Pix-Stars!", ephemeral: true });
        }

        // Deduct stars from giver
        giverData.Money -= stars;
        await giverData.save();

        // Add stars to target
        if (!targetData) {
            const newTargetData = new moneySchema({ Guild: guild.id, User: member.id, balance: stars });
            await newTargetData.save();
        } else {
            targetData.Money += stars;
            await targetData.save();
        }

        // Debugging logs
        console.log(`Giver Balance After: ${giverData.Money}`);
        if (targetData) {
            console.log(`Target Balance After: ${targetData.Money}`);
        }

        // Create and send the embed
        const giveEmbed = new EmbedBuilder()
            .setColor(0x8269c2)
            .setTitle(`<:announce:1276188470250832014> 𝙶𝙸𝚅𝙴 <:announce:1276188470250832014>`)
            .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n Successfully gave <:xPix_Stars:1275118528844009563> ${stars} to ${target.tag}!`);

        await interaction.reply({ embeds: [giveEmbed] });
    }
};