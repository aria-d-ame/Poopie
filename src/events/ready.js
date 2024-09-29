const { Events, Client, ActivityType, EmbedBuilder } = require('discord.js');
const TIMER_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const Bump = require('../Schemas/bumpSchema.js');
const counting = require('../Schemas/countingSchema.js'); // Ensure this import is correct
const ROLE_DURATION = 43200000; // 16 hours in milliseconds
//43200000
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
        }, 10000);

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
                            .setTitle(`<:xtriangle_small:1276263767872770108> It's time to bump!`)
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
                    const member = await Guild.members.fetch(userId);
                    const roleId = '1279589654055620719';
                    await member.roles.remove(roleId);

                    data.RoleAssignments = data.RoleAssignments.filter(member => member.userId !== userId)
                    await data.save()
                }
            });
        });
    }
};