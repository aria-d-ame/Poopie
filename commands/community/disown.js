const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const relationshipsSchema = require('../../schemas/relationshipsSchema.js');

new Command({
    name: 'disown',
    description: 'Disown a child!',
    type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: 'user',
            description: 'The child to disown.',
            type: ArgumentType.USER,
            required: true
        })
    ],
    run: async (ctx) => {
        try {
            // Get command executors relationship doc and create if doesnt exist
            
            const childUser = ctx.arguments.getUser('user');
            let disownerRelationshipDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: ctx.user.id })
            if (!disownerRelationshipDoc) {
                disownerRelationshipDoc = await relationshipsSchema.create({
                    Guild: ctx.guild.id,
                    User: ctx.user.id
                })
            }

            // Check if command executor is married
            if (!disownerRelationshipDoc.Children?.length) return ctx.reply({ content: "You don't have any children!", ephemeral: true })

            // ? DIVORCE THE COUPLE

            // Get spouse's relationship doc
            const childRelationshipDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: disownerRelationshipDoc.Spouse });

            // Get spouse's dicord profile // ! May cause errors if the user is not in the server
            const childDiscordProfile = await ctx.guild.members.fetch(disownerRelationshipDoc.Spouse);
            
            // Set 'spouse' field in documents to null
            disownerRelationshipDoc.Spouse = null;
            childRelationshipDoc.Parent = null;

            await disownerRelationshipDoc.save();
            await childRelationshipDoc.save();

            // Reply with divorced embed
            const disownEmbed = new EmbedBuilder()
                .setAuthor({ name: ctx.user.displayName, iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
                .setColor(0x8269c2)
                .setTitle(`<:xannounce:1276188470250832014> 𝙳𝙸𝚂𝙾𝚆𝙽 <:xannounce:1276188470250832014>`)
                .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${ctx.user} has disowned ${childDiscordProfile}.`)
                .setFooter({ text: childDiscordProfile.displayName, iconURL: childDiscordProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) });

            ctx.reply({ embeds: [disownEmbed] });
        } catch (err) {
            console.log(err);
        }
    }
});