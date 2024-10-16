const { Events, Client, ActivityType, EmbedBuilder } = require('discord.js');
const TIMER_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const Bump = require('../Schemas/bumpSchema.js');
const counting = require('../Schemas/countingSchema.js'); // Ensure this import is correct
const ROLE_DURATION = 43200000; // 16 hours in milliseconds
//43200000
const mostActiveRole = '1288605699064205424';
const richestRole = '1288865814874689567';
const crimeLordRole = '1288600551382319115';
const levelSchema = require('../Schemas/level.js');
const moneySchema = require('../Schemas/money.js');
const crimeSchema = require('../Schemas/crimeSchema.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} is online!`);
        client.user.setActivity("𝔸𝕕𝕖𝕡𝕥𝕦𝕤 𝔸𝕣𝕚𝕒⁺₊✧", {
            type: ActivityType.Watching,
            url: "https://discord.gg/MW3r57vamW"
        });

        setInterval( async () => {
            await this.setupRoleAssignments(client);
        }, 600000);

        setInterval( async () => {
            await this.rankingRoles(client);
        }, 600000);

        // Fetch bumps and set reminders
        await this.setupBumpReminders(client);

    },

    async setupBumpReminders(client) {
        const bumps = await Bump.find({});
        
        bumps.forEach(bump => {
            const timeSinceLastBump = new Date() - new Date(bump.lastBumpTime);
            const timeUntilNextBump = TIMER_DURATION - timeSinceLastBump;

            if (timeUntilNextBump > 0) {
                setTimeout(async () => {
                    const channel = client.channels.cache.get(bump.channelId);
                    
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
    },

    async setupRoleAssignments(client) {
        const allData = await counting.find();

        allData.forEach(async data => {
            data.RoleAssignments.forEach(async ({ userId, assignedAt }) => {
                const timeElapsed = Date.now() - assignedAt;
                if (timeElapsed > ROLE_DURATION) {
                    const Guild = await client.guilds.fetch(data.Guild);
                    const roleId = '1279589654055620719';
                    
                    // Only remove the role if user is still in the server. Else it will give an (Unknown Member) error 
                    // as we are trying to modify a-non existent member
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
    },

    //TODO: make rank roles automatic! 
    async rankingRoles(client) {
        const guilds = client.guilds.cache;

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
                try {
                    const member = await guild.members.fetch(User);
                    // Assign the leaderboard role
                    await member.roles.add(mostActiveRole);
                    console.log(`Assigned Most Active role to ${member.user.tag}`);
                } catch (error) {
                    console.log(`Failed to assign role to user ${User} in guild ${guild.id}:`, error);
                }
            }

            if (topStarsUser) {
                const { User } = topStarsUser;
                try{
                    const member = await guild.members.fetch(User);
                    await member.roles.add(richestRole);
                    console.log(`Assigned Richest role to ${member.user.tag}`);
                } catch (error) {
                    console.log(`Failed to assign role to user ${User} in guild ${guild.id}:`, error);
                }
            }

            if (topCrimeUser) {
                const { User } = topCrimeUser;
                try{
                    const member = await guild.members.fetch(User);
                    await member.roles.add(crimeLordRole);
                    console.log(`Assigned Crime Lord role to ${member.user.tag}`);
                } catch (error) {
                    console.log(`Failed to assign role to user ${User} in guild ${guild.id}:`, error);
                }
            }
        }
    },
};