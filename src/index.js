const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const { Client, Collection, Events, IntentsBitField, Partials, EmbedBuilder, PermissionsBitField, userMention, } = require("discord.js");
import("mongoose");
const mongoose = require('mongoose');

//Client intents
const client = new Client({
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ],
        repliedUser: true
    },
    autoReconnect: true,
    disabledEvents: [
        "TYPING_START"
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.GuildScheduledEvent
    ],
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildBans,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildWebhooks,
        IntentsBitField.Flags.GuildInvites,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.MessageContent
    ],
    restTimeOffset: 0
});

//Connects mongoDB
(async function connect() {
    mongoose.set('strictQuery', false);
    try {
        console.log(`🔄 Connecting database...`);

        await mongoose.connect(process.env.MONGO_TOKEN,);
    } catch (error) {
        console.log(`Error ${error}`);
        console.log("⚠️ Database did not connect!");
    }
})();
 
//Logs mongoDB connect
mongoose.connection.once("open", () => {
    console.log("✅ Database connected successfully!");
});

client.commands = new Collection();
//Gets command files
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`⚠️ The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

//Gets event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.cooldowns = new Collection();

client.login(process.env.TOKEN);

//counting
const counting = require('./Schemas/countingSchema');
const moneySchema = require('./Schemas/money.js');

client.on(Events.MessageCreate, async message => {
    if (!message.guild) return;
    if (message.author.bot) return;

    try {
        const data = await counting.findOne({ Guild: message.guild.id });
        if (!data) return;

        if (message.channel.id !== data.Channel) return;

        // Check if message content is a number
        const number = Number(message.content);
        if (isNaN(number)) {
            // Optionally react or notify user for invalid input
            return;
        }

        const roleId = '1279589654055620719';
        const ROLE_DURATION = 12 * 60 * 60 * 1000


        if (number !== data.Number) {
            // Reset count data and notify user
            data.Number = 1; // Reset to initial value
            data.LastUser = null; // Reset the last user
            await data.save();
            await message.react('xdenied:1276188176238645300');
            const embed = new EmbedBuilder()
                .setColor(0x8269c2)
                .setDescription(`<:xtriangle_small:1276263767872770108> You ruined everything. Now we have to start from 1. Thanks.`)

            await message.reply({ embeds: [embed] });

            try {
                const member = await message.guild.members.fetch(message.author.id);
                if (member) {
                    await member.roles.add(roleId);
                    console.log(`Role ${roleId} added to ${message.author.tag}`);

                    // Add user to roleAssigments
                    const filteredArray = data.RoleAssignments.filter(member => member.userId !== message.author.id)
                    filteredArray.push({ userId: message.author.id, assignedAt: Date.now() })

                    data.RoleAssignments = filteredArray;

                    await data.save();
                } else {
                    console.error('Member not found:', message.author.id);
                }
            } catch (err) {
                console.error('Error assigning role:', err);
            }
        } else if (data.LastUser === message.author.id) {
            data.Number = 1; // Reset to initial value
            data.LastUser = null; // Reset the last user
            await data.save();
            await message.react('xdenied:1276188176238645300');
            const embed = new EmbedBuilder()
                .setColor(0x8269c2)
                .setDescription(`<:xtriangle_small:1276263767872770108> You can't count twice in a row silly! Start from 1!`)

            await message.reply({ embeds: [embed] });

            try {
                const member = await message.guild.members.fetch(message.author.id);
                if (member) {
                    await member.roles.add(roleId);
                    console.log(`Role <@&${roleId}> added to ${message.author.tag}`);
                    const roleAssignment = {
                        userId: message.author.id,
                        assignedAt: new Date()
                    };
                    data.RoleAssignments.push(roleAssignment);
                    await data.save();

                    // Remove the role after 24 hours (86,400,000 milliseconds)
                    setTimeout(async () => {
                        try {
                            await member.roles.remove(roleId);
                            console.log(`Role <@&${roleId}> removed from ${message.author.tag} after 24 hours`);
                        } catch (err) {
                            console.error('Error removing role:', err);
                        }
                    }, 43200000); // 12 hours in milliseconds
                } else {
                    console.error('Member not found:', message.author.id);
                }
            } catch (err) {
                console.error('Error assigning role:', err);
            }
        } else {
            await message.react('xapproved:1276185812257738823');
            data.LastUser = message.author.id;
            data.Number++;
            await data.save();
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

//xpgain
const levelSchema = require('./Schemas/level.js');
const excludedRoles = ['1279589654055620719'];
const extraXPRoleId = ['1289736392930361404'];
const boosterRole = ['1275906991511834688'];
const COOLDOWN_TIME = 10 * 1000; // 10 seconds

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
};

client.on(Events.MessageCreate, async (message) => {
    const { guild, author, channel, member } = message;
    if (!guild || author.bot) return;

    try {
        // Find or create a level record
        let data = await levelSchema.findOne({ Guild: guild.id, User: author.id });
        if (!data) {
            data = await levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0,
                LastXPTime: Date.now(),
            });
        }

        const hasExcludedRole = member.roles.cache.some(role => excludedRoles.includes(role.id));
        const hasExtraXPRole = member.roles.cache.some(role => extraXPRoleId.includes(role.id));
        const hasBoosterRole = member.roles.cache.some(role => boosterRole.includes(role.id));
        const levelRoles = [
            { level: 0, roleId: '1269693621536423949', moneyReward: 0 },
            { level: 5, roleId: '1274157164054839346', moneyReward: 100 },
            { level: 10, roleId: '1274157637457412168', moneyReward: 300 },
            { level: 20, roleId: '1274158590122262650', moneyReward: 1000 },
            { level: 30, roleId: '1274159198971891865', moneyReward: 2000 },
            { level: 40, roleId: '1286878355530186812', moneyReward: 5000 },
            { level: 50, roleId: '1274160177020665856', moneyReward: 10000 },
            { level: 60, roleId: '1286878507875700788', moneyReward: 15000 },
            { level: 70, roleId: '1286878584031547494', moneyReward: 20000 },
            { level: 80, roleId: '1286878638075281460', moneyReward: 25000 },
            { level: 90, roleId: '1286878724154724404', moneyReward: 50000 },
            { level: 100, roleId: '1274160360701694044', moneyReward: 100000 }
        ];

        const levelUpChannelId = '1274481457053827092';
        const levelUpChannel = await guild.channels.fetch(levelUpChannelId);

        if (hasExcludedRole) {
            console.log(`User has excluded role`)
            return;
            // Skip XP awarding if the user has an excluded role
        }

        const currentTime = Date.now();
        const timeSinceLastXP = currentTime - data.LastXPTime;

        if (timeSinceLastXP < COOLDOWN_TIME) {
            console.log(`User ${author.id} is still in cooldown.`);
            // Skip XP awarding if the cooldown period has not passed
            return;
        }

        const minGive = 5;
        const maxGive = 10;
        const give = getRandomInt(minGive, maxGive);

        const requiredXP = data.Level * data.Level * 30;

        console.log(data.XP, give, data.XP + give, requiredXP)
        // console.log(levelRoles[2])e

        if (data.XP + give >= requiredXP) {
            data.XP += give;
            data.Level += 1;
            await data.save();

            // Assign the role and reward money when they reach a specified level
            const currentLevel = data.Level;
            // Checks if current level is a milestone
            if (levelRoles.some(role => role.level === currentLevel)) {
                // ID and money award of the role to be added to member
                const { roleId, moneyReward, level } = levelRoles.find(role => role.level === currentLevel);
                const rolesToBeRemoved = []

                // Add roleids that are not the current milestone role id to rolesToBeRemoved
                for (role of levelRoles) {
                    if (role.roleId !== roleId) rolesToBeRemoved.push(role.roleId)
                }

                // Add milestone role to user
                await member.roles.add(roleId);
                console.log(`Assigned level ${level} milestone role to ${author.tag}`);

                // Remove previous milestone roles from user
                await member.roles.remove(rolesToBeRemoved);
                console.log(`Removed previous milestone roles from ${author.tag}`)

                // Get money schema. Create if doesnt exist for user.
                let moneyData = await moneySchema.findOne({ Guild: guild.id, User: author.id });
                if (!moneyData) {
                    moneyData = await moneySchema.create({
                        Guild: guild.id,
                        User: author.id,
                        Money: 0,
                    });
                }

                // Add money reward to user and save to db
                moneyData.Money += moneyReward;
                await moneyData.save();
                console.log(`Added ${moneyReward} money to ${author.tag}`);

                // Send level up message with milestone notification
                const embedrole = new EmbedBuilder()
                    .setColor(0x8269c2)
                    .setTitle(`<:xannounce:1276188470250832014> <@&${roleId}>! <:xannounce:1276188470250832014>`)
                    .setDescription(`<:xtriangle_small:1276263767872770108> ${author} has hit a level milestone! Here's ${moneyReward}<:xPix_Stars:1275118528844009563>!`);

                await levelUpChannel.send({ embeds: [embedrole] });
            }

            // Send level up message without milestone notification
            const embed = new EmbedBuilder()
                .setColor(0x8269c2)
                .setTitle('<:xannounce:1276188470250832014> 𝙻𝙴𝚅𝙴𝙻 𝚄𝙿! <:xannounce:1276188470250832014>')
                .setDescription(`<:xtriangle_small:1276263767872770108> ${author} has reached level ${data.Level}!`);

            await levelUpChannel.send({ embeds: [embed] });
        } else {
            const extraXP = 10;
            data.XP += give;
            data.LastXPTime = Date.now();
            if (hasExtraXPRole) { // Define how much extra XP to give
                data.XP += extraXP; // Add extra XP to the total
            }
            if (hasBoosterRole) { // Define how much extra XP to give
                data.XP += extraXP; // Add extra XP to the total
            }

            await data.save();


        }
    } catch (err) {
        console.error('Error handling message:', err);
    }
});

//cash gain 

const extraCashRoleId = ['1289736549675565117'];
const COOLDOWN_TIME_CASH = 5 * 1000; // 10 seconds

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

client.on(Events.MessageCreate, async (message) => {
    const { guild, author } = message;
    if (!guild || author.bot) return;

    try {
        // Find or create a money record for the user
        let data = await moneySchema.findOne({ Guild: guild.id, User: author.id });
        if (!data) {
            data = await moneySchema.create({
                Guild: guild.id,
                User: author.id,
                Money: 0,
            });
        }

        const member = await guild.members.fetch(author.id);
        const hasExtraCashRole = member.roles.cache.has(extraCashRoleId);
        const hasBoosterRole = member.roles.cache.some(role => boosterRole.includes(role.id));

        const currentTime = Date.now();
        const timeSinceLastMoney = currentTime - data.LastMoneyTime;

        if (timeSinceLastMoney < COOLDOWN_TIME_CASH) {
            console.log(`User ${author.id} is still in cooldown.`);
            // Skip XP awarding if the cooldown period has not passed
            return;
        }

        // Determine the amount of money to give
        const minGive = 1;
        const maxGive = 3;
        const baseAmount = getRandomInt(minGive, maxGive);

        // Add the base amount to the user's money
        data.Money += baseAmount;

        // If the user has the extra cash role, give an additional bonus
        if (hasExtraCashRole) {
            const extraCash = 10; // Define how much extra money to give
            data.Money += extraCash; // Add extra money to the total
        }
        if (hasBoosterRole) {
            const extraCash = 8; // Define how much extra money to give
            data.Money += extraCash; // Add extra money to the total
        }

        data.LastMoneyTime = Date.now();

        // Save the updated money data to the database
        await data.save();
    } catch (err) {
        console.error('Error handling message:', err);
    }
});

//bump reminder
const TIMER_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const Bump = require('./Schemas/bumpSchema.js');
let timer;

client.on(Events.MessageCreate, async message => {
    // Check if the message is from Disboard
    if (message.author.id === '302050872383242240') {
        const guildId = message.guild.id;
        const channelId = message.channel.id; // Get the channel ID
        const responseChannel = client.channels.cache.get(channelId);

        // Save the current bump time
        await Bump.findOneAndUpdate(
            { guildId, channelId },
            { lastBumpTime: new Date() },
            { upsert: true, new: true }
        );


        if (responseChannel) {
            const remind = new EmbedBuilder()
                .setColor(0x8269c2)
                .setTimestamp()
                .setFooter({
                    text: `${message.guild.name}`, // Footer text
                    iconURL: message.guild.iconURL() // Optional: Server icon URL
                })
                .setDescription(`<:xtriangle_small:1276263767872770108> 𝚃𝚑𝚊𝚗𝚔 𝚢𝚘𝚞 𝚏𝚘𝚛 𝚋𝚞𝚖𝚙𝚒𝚗𝚐!\nI'll be back in 2 hours!`)
            await responseChannel.send({ embeds: [remind] });

            // Clear any existing timer
            if (timer) clearTimeout(timer);

            // Set a new timer
            timer = setTimeout(async () => {
                const channel = client.channels.cache.get(channelId);
                if (channel) {
                    const remind2 = new EmbedBuilder()
                        .setColor(0x8269c2)
                        .setTimestamp()
                        .setFooter({
                            text: `${message.guild.name}`, // Footer text
                            iconURL: message.guild.iconURL() // Optional: Server icon URL
                        })
                        .setTitle(`<:xtriangle_small:1276263767872770108> 𝙸𝚝'𝚜 𝚝𝚒𝚖𝚎 𝚝𝚘 𝚋𝚞𝚖𝚙!`)
                        .setDescription(`<:xtriangle_small:1276263767872770108> Do /bump to bump 𝔸𝕕𝕖𝕡𝕥𝕦𝕤 𝔸𝕣𝕚𝕒⁺₊✧!`)
                    await responseChannel.send({ content: '<:xannounce:1276188470250832014> <@&1279272272087220276> <:xannounce:1276188470250832014>', embeds: [remind2] });

                }
            }, TIMER_DURATION);
        } else {
            console.error('Channel not found');
        }
    }
});