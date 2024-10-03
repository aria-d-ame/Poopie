const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST().setToken(process.env.TOKEN);

// for global commands
rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, '1291217402553696256'))
	.then(() => console.log('✅ Successfully deleted (/) command!'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, '1291217402553696256'))
	.then(() => console.log('✅ Successfully deleted (/) command!'))
	.catch(console.error);