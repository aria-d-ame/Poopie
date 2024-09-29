//bump reminder
const TIMER_DURATION = 2 * 1000; // 2 hours in milliseconds
let timer;
client.on(Events.MessageCreate, message => {
    // Check if the message is from Disboard and in disboards channel
    if (message.author.id === '302050872383242240') {
        const CHANNEL_ID = message.channel
        const responseChannel = client.channels.cache.get(CHANNEL_ID);
        if (responseChannel) {
            responseChannel.send({ content: 'Will remind in 2 hours'});
        }

        // Clear any existing timer
        if (timer) clearTimeout(timer);

        // Set a new timer
        timer = setTimeout(() => {
            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                channel.send({ content: 'Bump time lmao'});
            }
        }, TIMER_DURATION);
    }
});