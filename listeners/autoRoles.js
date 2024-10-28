const { Listener } = require('gcommands');

new Listener({
  name: 'Role Connections',
  event: 'guildMemberUpdate',

  run: async (ctx) => {
    const member = await ctx.guild.members.fetch(ctx.user.id);
    const guild = ctx.guild;

    const aboutRole = await ctx.guild.roles.cache.get('1281722705959456798');
    const pingsRole = await ctx.guild.roles.cache.get('1281722400253411338');
    const logChannel = await ctx.guild.channels.fetch('1278877530635374675');

    const hasAboutRole = aboutRole.some(role => member.roles.cache.has(role.id));
    const hasPingsRole = aboutRole.some(role => member.roles.cache.has(role.id));

    if (hasAboutRole) {
      return console.log(`Role updated user already has about role.`);
    }
    if (hasPingsRole) {
      return console.log(`Role updated user already has pings role.`)
    }

    const sheRole = await ctx.guild.roles.cache.get('1269679504280916064');
    const theyRole = await ctx.guild.roles.cache.get('1269679631901130832');
    const heRole = await ctx.guild.roles.cache.get('1269679823194820609');
    const aboutTriggerRoles = [sheRole, theyRole, heRole];

    const anncRole = await guild.roles.cache.get('1269842766385381448');
    const birthdayRole = await guild.roles.cache.get('1269842839479521422'); 
    const chatReviveRole = await guild.roles.cache.get('1269843357387980851'); 
    const genEventRole = await guild.roles.cache.get('1273042447219556454');
    const artEventRole = await guild.roles.cache.get('1269843478595239936');
    const gameEventRole = await guild.roles.cache.get('1269843429878140999'); 
    const pollRole = await guild.roles.cache.get('1272640682200268810'); 
    const welcomeRole = await guild.roles.cache.get('1270212130204811376');
    const bumpRole = await guild.roles.cache.get('1279272272087220276'); 
    const qotdRole = await guild.roles.cache.get('1281734946247016578'); 
    const botRole = await guild.roles.cache.get('1295208277873000448'); 

    const pingsTriggerRoles = [anncRole, birthdayRole, chatReviveRole, genEventRole, artEventRole, gameEventRole, pollRole, welcomeRole, bumpRole, qotdRole, botRole];

    const hasAboutTriggerRole = aboutTriggerRoles.some(role => member.roles.cache.has(role.id));
    const hasPingsTriggerRole = pingsTriggerRoles.some(role => member.roles.cache.has(role.id));

    if (!hasAboutTriggerRole) {
      await member.roles.remove(aboutRole);
      await logChannel.send(`Automatic about role removed from ${member.user.tag}.`);
    }

    if (!hasPingsTriggerRole) {
      await member.roles.remove(aboutRole);
      await logChannel.send(`Automatic pings role removed from ${member.user.tag}.`);
    }

    if (hasAboutTriggerRole) {
      await member.roles.add(aboutRole);
      await logChannel.send(`Automatic about role added to ${member.user.tag}.`);
    }

    if (hasPingsTriggerRole) {
      await member.roles.add(pingsRole);
      await logChannel.send(`Automatic pings role added to ${member.user.tag}.`);
    }

  }
})