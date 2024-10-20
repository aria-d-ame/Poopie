const { Listener } = require('gcommands');

new Listener({
  name: 'Message Delete',
  event: 'messageDelete',

  run: async (ctx) => {

  }
})