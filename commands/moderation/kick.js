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
    aliases: ["boot"],
    run: async function (client, message, args) {
        if (!message.member.permissions.has('KICK_MEMBERS') && (!message.member.permissions.has('ADMINISTRATOR'))) return message.channel.send('You do not have permission to use this command.');
        if (!args[0]) return message.channel.send('Please enter a user to kick.');
        let reason;
        if (!args[1]) reason = args.slice(1).join(' ') || `You were kicked from ${message.guild.name} for no reason. One day you will be forgotten.`;
        let user
        if (isNaN(args[0])) {
            user = "<@" + args[0] + ">"
        } else user = user = args[0]
        if (user.kickable) {
            user.kick({ reason: reason });
            message.channel.send(`${user.id} was kicked from the server.`);
        } else {
            message.channel.send('This user cannot be kicked.');
        }
    }
}