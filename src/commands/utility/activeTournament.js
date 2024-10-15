const { Client, SlashCommandBuilder, EmbedBuilder, InteractionCollector } = require('discord.js');

const tournamentStatus = require('../../tournamentStatus.js');
const config = require('../../Schemas/config.js');
const activityTournament = require('../../Schemas/activityTournament.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tournament')
    .setDescription('Start or end the activity tournament.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Start or stop?')
        .setRequired(true)
        .addChoices(
          { name: 'Start', value: 'start' },
          { name: 'Stop', value: 'stop' }
        )),
  async execute(interaction) {

    try {
      
      // status (stop, start) fetched from argument
      const status = interaction.options.getString('type');
      // guild the command was executed in
      const guild = interaction.guild
      const { client } = interaction;
      
      // starts the tournament
      if (status === 'start') {
        
        await interaction.deferReply({ ephemeral: true });
        
        // If tournament is already running, notify command executor
        if (await tournamentStatus() === true) {
          return interaction.editReply({ content: 'The tournament is running already!', ephemeral: true });
        }

        // Fetch server's tournament config. If doesnt exist, then create.
        const configDoc = await config.findById('config');
        if (configDoc) {
          // Set tournament to true
          configDoc.tournamentStatus = true;
          await configDoc.save();
        } else {
          await config.create({ _id: 'config', tournamentStatus: true });
        }

        interaction.editReply({ content: 'Tournament started.' });
      }

      if (status === 'stop') {

        await interaction.deferReply({ ephemeral: false });

        // If tournament is not running, notify command executor. (They are trying to stop a tournament that is not even in progress)
        if (await tournamentStatus() === false) {
          return interaction.editReply({ content: 'Tournament has not started yet!' });
        }

        // Get single user with the highest Points.
        const pointData = await activityTournament.find({ Guild: guild.id })
          .sort({
            Points: -1,
          })
          .limit(1);

        console.log(pointData)
        // Create an embed to send the winner
        const tournamentEmbed = new EmbedBuilder()
          .setTitle(`<:announce:1276188470250832014> 𝚃𝙾𝚄𝚁𝙽𝙰𝙼𝙴𝙽𝚃 𝚆𝙸𝙽𝙽𝙴𝚁 <:announce:1276188470250832014>`)
          .setColor(0x8269c2)
          .setFooter({
            text: `${interaction.guild.name}`, // Footer text
            iconURL: interaction.guild.iconURL()
          })
          .setTimestamp();

        // If there are no users
        if (!pointData.length) {
          tournamentEmbed.setDescription('No points to load!');
        } else {
          // Array consisting of name/level/xp details (string) for each user
          const userDescriptions = [];

          // Iterates through each xpData document to create name/level/xp details for user and pushes them to
          // to userDescriptions array
          for (pointDataDoc of pointData) {
            const { User, Points } = pointDataDoc;
            const member = await client.users.fetch(User);
            userDescriptions.push(`${member.tag} | Points: ${Points}`);
          };

          // Join elements in user descriptions array with \n (new line)
          tournamentEmbed.setDescription(`\`\`\`${userDescriptions.join('\n')}\`\`\``);
        }

        await interaction.editReply({ content: `## <:announce:1276188470250832014> <@&1273042447219556454> <:announce:1276188470250832014>\n**«════✧ ✦ ✧ ✦ ✧════»**`, embeds: [tournamentEmbed] });
        // Go through each user and delete their mowPoints and voted fields if exist
        await activityTournament.updateMany({}, { $unset: { Points: "" } })
          .then(() => {
            console.log('Fields removed from all users successfully');
          })
          .catch(err => {
            console.error(err);
            return interaction.channel.send({ content: 'An error occurred while trying to stop the member of the week tournament', ephemeral: true });
          });

        const configDoc = await config.findById('config');
        if (configDoc) {
          configDoc.tournamentStatus = false;
          await configDoc.save();
        } else {
          await config.create({ _id: 'config', tournamentStatus: false });
        }

        return interaction.channel.send({ content: 'Tournament stopped.', ephemeral: true });
      }

    } catch (error) {
      console.error(error);
    }
  }
};
