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

        if (!message.member.permissions.has('MANAGE_NICKNAMES')) return message.channel.send("You do not have permission to nickname")
        const member = message.mentions.members.first() || message.guild.members.fetch(args[0]) || message.member;
        if (!member) return message.reply("<:excl:819930667974131712> Please specify a member!");
        const arguments = args.slice(1).join(" ");
        if (!arguments) return message.reply("<:excl:819930667974131712> Please specify a nickname!");
        try {
            let before_nickname = await member.nickname
            await member.setNickname(arguments);
            let after_nickname = await member.nickname
            message.channel.send(`Successfully changed ${member.user.tag}'s nickname from ${before_nickname} to ${after_nickname}`)
        } catch (err) {
            console.log(err);
            message.member.send("I do not have permission to set " + member.toString() + " nickname!");
        }
    }
}