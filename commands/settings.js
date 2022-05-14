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
    aliases: ["setting"],
    run: async function (client, message, args) {
        if (args.length == 0) {
            message.channel.send('You need to specify whether server or user');
            return;
        }
        else if (args.length == 1) {
            message.channel.send('You need to specify a setting.');
        }
        else if (args[1].toLowerCase() == "banlimit") {
            if (args.length == 2) {
                message.channel.send(`The current ban limit is ${JSON.stringify(await db.get(`server_settings.${message.guild.id}.ban_limit`))}`);
            }
            else if (args.length >= 2) {
                if (args[2].toLowerCase() == "help") {
                    message.channel.send('Usage: `!settings <command> <type> <number>`');
                }
                else if (args[2].toLowerCase() == "disable") {
                    await db.set(`server_settings.${message.guild.id}.ban_limit.enabled`, false);
                    message.channel.send('The ban limit has been disabled.');
                    return;
                }
                else if (args[2].toLowerCase() == "enable") {
                    await db.set(`server_settings.${message.guild.id}.ban_limit.enabled`, true);
                    message.channel.send('The ban limit has been enabled.');
                    return;
                }
                else if (args[2].toLowerCase() == "forewarn" || args[2].toLowerCase() == "untrusted" || args[2].toLowerCase() == "trusted") {
                    if (args.length == 3) {
                        message.channel.send(`The current ${args[2].toLowerCase()} limit is ${JSON.stringify(await db.get(`server_settings.${message.guild.id}.ban_limit.${args[2].toLowerCase()}`))}`);
                    }
                    else if (isNaN(args[3])) {
                        message.channel.send('Please enter a number.');
                        return;
                    }
                    else if (args[3] < 1) {
                        message.channel.send('Please enter a number greater than 0.');
                        return;
                    }
                    else if (args[3] > 1000) {
                        message.channel.send('Please enter a number less than 100.');
                        return;
                    }
                    await db.set(`server_settings.${message.guild.id}.ban_limit.${args[2].toLowerCase()}`, parseInt(args[3]));
                }
                message.channel.send(`The ban limit has been set to ${JSON.stringify(await db.get(`server_settings.${message.guild.id}.ban_limit`))}`);
            }
        }
        else if (args[1].toLowerCase() == "trusted_member" || args[1].toLowerCase() == "untrusted_member") {
            if (args.length == 2) {
                message.channel.send(`The current ${args[1].toLowerCase()} is ${JSON.stringify(await db.get(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`))}`);
            }
            else if (args.length >= 3) {
                if (args[2].toLowerCase() == "add") {
                    let userid = message.mentions.members.first().user.id || args[3];
                    if (await db.has(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`)) {
                        let checker = await db.get(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`)
                        if (!checker.includes(userid)) {
                            db.push(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`, userid);
                            message.channel.send(`${userid} has been added to the ${args[1].toLowerCase()} list.`);
                        }
                        else {
                            message.channel.send(`${userid} is already in the ${args[1].toLowerCase()} list.`);
                        }
                    }
                    else {
                        db.set(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`, []);
                        let checker = await db.get(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`)
                        if (!checker.includes(userid)) {
                            db.push(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`, userid);
                            message.channel.send(`${userid} has been added to the ${args[1].toLowerCase()} list.`);
                        }
                        else {
                            message.channel.send(`${userid} is already in the ${args[1].toLowerCase()} list.`);
                        }
                    }
                }
                else if (args[2].toLowerCase() == "remove") {
                    let userid = message.mentions.members.first().user.id || args[3];
                    if (await db.has(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`)) {
                        let checker = await db.get(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`)
                        if (checker.includes(userid)) {
                            db.remove(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`, userid);
                            message.channel.send(`${userid} has been removed from the ${args[1].toLowerCase()} list.`);
                        }
                        else {
                            message.channel.send(`${userid} is not in the ${args[1].toLowerCase()} list.`);
                        }
                    }
                    else {
                        db.set(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`, []);
                        let checker = await db.get(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`)
                        if (checker.includes(userid)) {
                            db.remove(`server_settings.${message.guild.id}.${args[1].toLowerCase()}`, userid);
                            message.channel.send(`${userid} has been removed from the ${args[1].toLowerCase()} list.`);
                        }
                        else {
                            message.channel.send(`${userid} is not in the ${args[1].toLowerCase()} list.`);
                        }
                    }
                }
            }
        }
    }
}