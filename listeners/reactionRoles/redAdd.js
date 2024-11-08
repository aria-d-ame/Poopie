const { Listener } = require('gcommands');

new Listener({
  name: 'Red Reaction Roles',
  event: 'messageReactionAdd',

  run: async (ctx) => {
    if (ctx.message.id != '1269828108836405301') return;

    const roleEmojis = {
      '🌹': '1269795741786836993', 
      '🐞': '1269795891473158311', 
      '🪱': '1269795964399652905',
      '🍄': '1269796050806509588',
    };
    if (roleEmojis[ctx.emoji.name]) {
      const roleId = roleEmojis[ctx.emoji.name];

      try {
        // Get the member who reacted (user who added the reaction)
        const member = await ctx.guild.members.fetch(ctx.author.id);

        // Get the role from the guild
        const role = await ctx.guild.roles.fetch(roleId);

        // Check if the member already has the role
        if (!member.roles.cache.has(roleId)) {
          await member.roles.add(role);
          console.log(`Assigned ${role.name} to ${member.user.tag}`);
        } else {
          console.log(`${member.user.tag} already has the role.`);
        }

      } catch (err) {
        console.error('Error assigning role:', err);
      }
    }
  }
});