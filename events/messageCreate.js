const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
module.exports = (client, message) => {
    if (message.author.bot) return;
    const prefix = "$";
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.aliases.get(command);
    if (!cmd) {
        if (message.channel.id != db.get(`music_request_channel-${message.guild.id}-text`)) return;
    }
    cmd.run(client, message, args);

};
