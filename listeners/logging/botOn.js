const { Listener } = require('gcommands');
const { ActivityType, EmbedBuilder } = require('discord.js');

const timerDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const bumpSchema = require('../../schemas/bumpSchema.js');
const counting = require('../../schemas/countingSchema.js');
const roleDuration = 43200000; // 12 hours in milliseconds
const mostActiveRole = ['1288605699064205424'];
const richestRole = ['1288865814874689567'];
const crimeLordRole = ['1288600551382319115'];
const levelSchema = require('../../schemas/level.js');
const moneySchema = require('../../schemas/money.js');
const crimeSchema = require('../../schemas/crimeSchema.js');

const setupBumpReminders = async (ctx) => {
    const bumps = await bumpSchema.find({});
    
    bumps.forEach(bump => {
        const timeSinceLastBump = new Date() - new Date(bump.lastBumpTime);
        const timeUntilNextBump = timerDuration - timeSinceLastBump;

        if (timeUntilNextBump > 0) {
            setTimeout(async () => {
                const channel = await ctx.channels.cache.get(bump.channelId);
                
                if (channel) {
                    const remindEmbed = new EmbedBuilder()
                        .setColor(0x8269c2)
                        .setTimestamp()
                        .setFooter({
                            text: channel.guild.name,
                            iconURL: channel.guild.iconURL() // Optional: Server icon URL
                        })
                        .setTitle(`<:xtriangle_small:1276263767872770108> 𝙸𝚝'𝚜 𝚝𝚒𝚖𝚎 𝚝𝚘 𝚋𝚞𝚖𝚙!`)
                        .setDescription(`<:xtriangle_small:1276263767872770108> Do /bump to bump 𝔸𝕕𝕖𝕡𝕥𝕦𝕤 𝔸𝕣𝕚𝕒⁺₊✧!`);

                    await channel.send({ content: '<:xannounce:1276188470250832014> <@&1279272272087220276> <:xannounce:1276188470250832014>', embeds: [remindEmbed] });
                }
            }, timeUntilNextBump);
        }
    });
}

const setupRoleAssignments = async (ctx) => {
    const allData = await counting.find();

    allData.forEach(async data => {
        data.RoleAssignments.forEach(async ({ userId, assignedAt }) => {
            const timeElapsed = Date.now() - assignedAt;
            if (timeElapsed > roleDuration) {
                const Guild = await ctx.guilds.fetch(data.Guild);
                const roleId = '1279589654055620719';
                
                try {
                    const member = await Guild.members.fetch(userId);
                    if (member) await member.roles.remove(roleId);
                } catch (error) {
                    console.log(`Failed to remove role from ${userId} in ${data.Guild}`);
                }

                data.RoleAssignments = data.RoleAssignments.filter(member => member.userId !== userId)
                await data.save()
            }
        });
    });
}

const rankingRoles = async (ctx) => {
    const guilds = ctx.guilds.cache;
    let lastAssignedUsers = {
        mostActive: null,
        richest: null,
        crimeLord: null,
    };

    for (const guild of guilds.values()) {
        const ownerId = guild.ownerId;

        // Get the top user excluding the server owner
        const topXPUser = await levelSchema.findOne({ Guild: guild.id, User: { $ne: ownerId } })
            .sort({ XP: -1 });
        const topStarsUser = await moneySchema.findOne({ Guild: guild.id, User: { $ne: ownerId } })
            .sort({ Money: -1 });
        const topCrimeUser = await crimeSchema.findOne({ Guild: guild.id, User: { $ne: ownerId } })
         .sort({ Crime: -1 });

        if (topXPUser) {
            const { User } = topXPUser;
            if (User !== lastAssignedUsers.mostActive) {
                try {
                    const member = await guild.members.fetch(User);
                    const oldMemberId = lastAssignedUsers.mostActive;
                    // Assign the leaderboard role
                    await member.roles.add(mostActiveRole);
                    console.log(`Assigned Most Active role to ${member.user.tag}`);
                    if (oldMemberId) {
                        try {
                            const oldMember = await guild.members.fetch(oldMemberId);
                            await oldMember.roles.remove(mostActiveRole);
                            console.log(`Removed Most Active role from ${oldMember.user.tag}`);
                        } catch (oldMemberError) {
                            console.log(`Failed to remove Most Active role from old member (ID: ${oldMemberId}):`, oldMemberError);
                        }
                    } else {
                        console.log(`No old member found for removal in guild ${guild.id}`);
                    }
                    lastAssignedUsers.mostActive = User;
                } catch (error) {
                    console.log(`Failed to assign ${mostActiveRole} to user ${User}`, error);
                }
            }
        }

        if (topStarsUser) {
            const { User } = topStarsUser;
            if (User !== lastAssignedUsers.richest) {
                try{
                    const member = await guild.members.fetch(User);
                    const oldMemberId = lastAssignedUsers.richest;
                    await member.roles.add(richestRole);
                    console.log(`Assigned Richest role to ${member.user.tag}`);
                    if (oldMemberId) {
                        try {
                            const oldMember = await guild.members.fetch(oldMemberId);
                            await oldMember.roles.remove(richestRole);
                            console.log(`Removed Richest role from ${oldMember.user.tag}`);
                        } catch (oldMemberError) {
                            console.log(`Failed to remove Richest role from old member (ID: ${oldMemberId}):`, oldMemberError);
                        }
                    } else {
                        console.log(`No old member found for removal in guild ${guild.id}`);
                    }
                    lastAssignedUsers.richest = User;
                } catch (error) {
                    console.log(`Failed to assign ${richestRole} to user ${User}`, error);
                }
            }
        }

        if (topCrimeUser) {
            const { User } = topCrimeUser;
            if (User !== lastAssignedUsers.crimeLord) {
                try{
                    const member = await guild.members.fetch(User);
                    const oldMemberId = lastAssignedUsers.crimeLord;
                    await member.roles.add(crimeLordRole);
                    console.log(`Assigned Crime Lord role to ${member.user.tag}`);
                    if (oldMemberId) {
                        try {
                            const oldMember = await guild.members.fetch(oldMemberId);
                            await oldMember.roles.remove(crimeLordRole);
                            console.log(`Removed Crime Lord role from ${oldMember.user.tag}`);
                        } catch (oldMemberError) {
                            console.log(`Failed to remove Crime Lord role from old member (ID: ${oldMemberId}):`, oldMemberError);
                        }
                    } else {
                        console.log(`No old member found for removal in guild ${guild.id}`);
                    }
                    lastAssignedUsers.crimeLord = User;
                } catch (error) {
                    console.log(`Failed to assign ${crimeLordRole} to user ${User}`, error);
                }
            }
        }
    }
}

new Listener({
  name: 'Bot Start',
  event: 'ready',

  run: async (ctx) => {
    console.log(`✅ ${ctx.user.tag} is online!`);
    ctx.user.setActivity("𝔸𝕕𝕖𝕡𝕥𝕦𝕤 𝔸𝕣𝕚𝕒⁺₊✧", {
        type: ActivityType.Watching,
        url: "https://discord.gg/MW3r57vamW"
    });
    const modChannelId = '1278877530635374675';
    const modChannel = ctx.channels.cache.get(modChannelId);
    if (modChannel) {
        await modChannel.send({ content: `${ctx.user.tag} is now online!` });
    } else {
        console.log('Mod channel not found.');
    };

    setInterval( async () => {
        await setupRoleAssignments(ctx);
    }, 600000);

    setInterval( async () => {
        await rankingRoles(ctx);
    }, 600000);

    // Fetch bumps and set reminders
    await setupBumpReminders(ctx);

},
})