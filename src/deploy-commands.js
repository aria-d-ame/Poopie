const { REST, Routes, GuildDefaultMessageNotifications } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grabs all the command folders 
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);

	if (!fs.existsSync(commandsPath) || !fs.statSync(commandsPath).isDirectory()) {
			console.error(`⚠️ Path ${commandsPath} is not a directory or does not exist`);
			continue;
	}

	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);

			console.log(`🔸 Processing file: ${filePath}`);

			try {
					const command = require(filePath);
					if ('data' in command && 'execute' in command) {
							commands.push(command.data.toJSON());
					} else {
							console.log(`⚠️ The command at ${filePath} is missing a required "data" or "execute" property.`);
					}
			} catch (error) {
					console.error(`Error requiring file ${filePath}:`, error);
			}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`🔄 Loading ${commands.length} (/) commands...`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`✅ Loaded ${data.length} (/) commands!`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
