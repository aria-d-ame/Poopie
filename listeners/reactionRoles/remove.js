const { Listener } = require('gcommands');
const { reactionRoles } = require('../../config.json');

new Listener({
  name: 'Red Reaction Roles Remove',
  event: 'messageReactionRemove',

  /**
   * Removes a role from a user who removes a reaction from the given message.
   * @param {Object} ctx - The context of the event.
   * @param {Object} reactor - The user who removed the reaction.
   */
  run: async (ctx, reactor) => {
    // Check if the message id exists in the messageIds array
    const reactRoleEntry = reactionRoles.find(item => item.messageId === ctx.message.id);
    if (!reactRoleEntry) return;

    // The role ID of the roles to assign and the emoji linked to them.
    const roleEmojis = reactRoleEntry.roleEmojis;

    // Get the role from the array of roleEmojis that matches the emoji of the reaction.
    const reactRole = roleEmojis.find(item => item.emoji === ctx.emoji.name);
    if (!reactRole) return;

    // Try to remove the role from the user who reacted.
    try {
      // Get the member who reacted (user who removed the reaction)
      const member = await ctx.message.guild.members.fetch(reactor.id);

      // Get the role from the guild
      const role = await ctx.message.guild.roles.fetch(reactRole.roleId);

      // Check if the member has the role
      if (member.roles.cache.has(reactRole.roleId)) {
        await member.roles.remove(role);
        console.log(`Removed ${role.name} from ${member.user.tag}`);
      } else {
        console.log(`${member.user.tag} does not have the role.`);
      }

    } catch (err) {
      console.error('Error removing role:', err);
    }
  }
});
