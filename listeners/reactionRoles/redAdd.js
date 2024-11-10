const { Listener } = require('gcommands');

new Listener({
  name: 'Red Reaction Roles',
  event: 'messageReactionAdd',

  run: async (ctx) => {
    if (ctx.message.id !== '1269828108836405301') return;

    const roleEmojis = [
      { emoji: '🌹',
        roleId: '1269795741786836993'}, 
      { emoji: '🐞', 
        roleId: '1269795891473158311'}, 
      { emoji: '🪱', 
        roleId: '1269795964399652905'},
      { emoji: '🍄', 
        roleId: '1269796050806509588'},
    ];

    const reactRole = roleEmojis.find(item => item.emoji === ctx.emoji.name);
    if (!reactRole) return;

    console.log(ctx.emoji.name);
    console.log(reactRole);

      try {
        // Get the member who reacted (user who added the reaction)
        const member = await ctx.guild.members.fetch(ctx.author.id);

        // Get the role from the guild
        const role = await ctx.guild.roles.fetch(reactRole.roleId);

        // Check if the member already has the role
        if (!member.roles.cache.has(reactRole.roleId)) {
          await member.roles.add(role);
          console.log(`Assigned ${role.name} to ${member.user.tag}`);
        } else {
          console.log(`${member.user.tag} already has the role.`);
        }

      } catch (err) {
        console.error('Error assigning role:', err);
      }
    }
});