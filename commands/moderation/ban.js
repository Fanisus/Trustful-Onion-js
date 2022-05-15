const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});

module.exports = {
    info: {
        name: ''
    },
    aliases: [],
    run: async function (client, message, args) {

        // Mak a ban command
        if (!message.member.permissions.has('KICK_MEMBERS') && (!message.member.permissions.has('ADMINISTRATOR'))) return message.channel.send('You do not have permission to use this command.');
        if (!args[0]) return message.channel.send('Please enter a user to ban.');
        let reason;
        if (!args[1]) reason = args.slice(1).join(' ') || `You were banned from ${message.guild.name} for no reason. One day you will be forgotten.`;
        let user = message.mentions.members.first();
        if (user.bannable) {
            user.ban({reason: reason});
            message.channel.send(`${user.id} was banned from the server.`);

            user.guild.bans.remove(user.id)
        } else {
            message.channel.send('This user cannot be banned.');
        }
    }
}