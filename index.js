const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
const discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const client = new discord.Client({ intents: [discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING, discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_BANS, discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, discord.Intents.FLAGS.GUILD_INTEGRATIONS, discord.Intents.FLAGS.GUILD_INVITES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILD_WEBHOOKS] });
const moment = require('moment');
const now = moment().utc().format('D/M/YYYY/h/m/s')
let prefix = "!";
client.commands = new discord.Collection()
client.aliases = new discord.Collection()
fs.readdir(`./commands/`, (error, files) => {
    if (error) { return console.log("Error while trying to get the commmands."); };
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`);
        const commandName = file.split(".")[0];
        client.commands.set(commandName, command);
        if (command.aliases) {
            command.aliases.forEach(alias => {
                client.aliases.set(alias, command);
            });
        };
        console.log(`Loading Command '${commandName}'`);
    });
});
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Loading event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

/*
client.on('guildBanAdd', (guild, user) => {
    
})*/
client.on('guildBanAdd', async (ban) => {
    ban.guild.members.unban(ban.user.id)
    let banner
    await ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => { banner = audit.entries.first().executor.id })
    db.add(`server_data.${ban.guild.id}.ban_count_today`, 1);
    if (await db.get(`server_settings.${ban.guild.id}.ban_limit.trusted`) <= await db.get(`server_data.${ban.guild.id}.ban_count_today`)) {
        ban.guild.fetchOwner({ force: true, cache: false }).then(async owner => {
            owner.send(`${ban.guild.name} has reached the trusted ban limit. This message has been sent to you so you get to know about it`)
            let trusted_members = await db.get(`server_settings.${ban.guild.id}.trusted_member`)
            if (trusted_members == [] || trusted_members == undefined) return owner.send(`The trusted members list is empty. 0 roles will be removed.`)
            console.log(trusted_members);
            trusted_members.forEach(async id => {
                let member = await ban.guild.members.fetch({ user: id, cache: false, force: true })
                let trusted_member_roles = await ban.guild.members.fetch(id)
                trusted_member_roles.roles.cache.forEach(async role => {
                    role = await role.guild.roles.fetch(role.id)
                    if (role.permissions.has('ADMINISTRATOR') || role.permissions.has('BAN_MEMBERS')) {
                        console.log(`Removing role ${role.name} from ${member.user.username}`);
                        if (ban.guild.me.roles.highest.comparePositionTo(role) >= 0) {
                            member.roles.remove(role.id)
                            db.push(`server_data.${ban.guild.id}.trusted_member_role_removed`, member.id + "_" + role.id)
                        }
                        else {
                            owner.send(`${member.user.username} has a higher role than me. I cannot remove ${role.name} from them.`)
                        }
                    }
                })
            })
            owner.send(`The trusted members list has been checked and the roles have been removed.`)
            let trusted_member_role_removed = await db.get(`server_data.${ban.guild.id}.trusted_member_role_removed`)
            trusted_member_role_removed.forEach(id_role => {
                let id = id_role.split("_")[0]
                let role = id_role.split("_")[1]
                let data = "```"
                for (let index = 0; index < array.length; index++) {
                    data = data + id + " : " + role + "\n"
                }
                data = data + "```"
            })
            owner.send({ embeds: [new discord.MessageEmbed().color().description(data)] })
            owner.send(`The following roles have been removed from the trusted members: ${trusted_member_role_removed}`)
        })
        return
    }
    else if (await db.get(`server_settings.${ban.guild.id}.ban_limit.untrusted`) <= await db.get(`server_data.${ban.guild.id}.ban_count_today`)) {
        ban.guild.fetchOwner({ force: true, cache: false }).then(async owner => {
            owner.send(`${ban.guild.name} has reached the untrusted ban limit. This message has been sent to you so you get to know about it. Removing Roles from untrusted members`)
            let untrusted_members = await db.get(`server_settings.${ban.guild.id}.untrusted_member`)
            untrusted_members.forEach(async id => {
                let member = await ban.guild.members.fetch({ user: id, cache: false, force: true })
                let untrusted_member_roles = await ban.guild.members.fetch(id)
                untrusted_member_roles.roles.cache.forEach(async role => {
                    if (role.permissions.has('ADMINISTRATOR') || role.permissions.has('BAN_MEMBERS')) {
                        console.log(`Removing role ${role.name} from ${member.user.username}`);
                        if (ban.guild.me.roles.highest.comparePositionTo(role) >= 0) {
                            member.roles.remove(role.id)
                            db.push(`server_data.${ban.guild.id}.untrusted_member_role_removed`, member.id + "_" + role.id)
                        }
                        else {
                            owner.send(`${member.user.username} has a higher role than me. I cannot remove ${role.name} from them.`)
                        }
                    }
                })
            })
            owner.send(`The untrusted members list has been checked and the roles have been removed.`)
            let untrusted_member_role_removed = await db.get(`server_data.${ban.guild.id}.untrusted_member_role_removed`)
            untrusted_member_role_removed.forEach(id_role => {
                let id = id_role.split("_")[0]
                let role = id_role.split("_")[1]
                let data = "```"
                for (let index = 0; index < array.length; index++) {
                    data = data + id + " : " + role + "\n"
                }
                data = data + "```"
            })
            owner.send({ embeds: [new discord.MessageEmbed().color().description(data)] })
            owner.send(`The following roles have been removed from the untrusted members: ${untrusted_member_role_removed}`)
        })
        return
    }
    else if (await db.get(`server_settings.${ban.guild.id}.ban_limit.forewarn`) <= await db.get(`server_data.${ban.guild.id}.ban_count_today`)) {
        ban.guild.fetchOwner({ force: true, cache: false }).then(owner => {
            owner.send(`${ban.guild.name} has reached the foreban limit. This message has been sent to you so you get to know about it`)
        })
    }
    console.log(`${ban.user.id} was banned from the server.`);
    console.log(`${banner} banned ${ban.user.id}`);
})


client.login('OTYzNDU1MjI5MDIwNDc1NDEy.GRXK7r.C1IuXv83sT9gr5guLmpv6R__W7SDLkhSEUh04U')


client.on('messageCreate', async message => {
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    if (command === 'prof') {
        message.reply({allowedMentions: false, content: "OK"})
        let avatar_size = 175
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./download2.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = '20px Comic Sans MS';
        let font_size = ctx.measureText("M").width
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 40
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.moveTo(canvas.width / 2 - font_size, (canvas.height / 3) - (font_size / 2.25))
        ctx.lineTo(canvas.width / 1.05, canvas.height / 3)
        ctx.closePath()
        ctx.stroke()
        ctx.globalAlpha = 1
        
        ctx.fillText(`${message.author.username}#${message.author.discriminator}`, canvas.width / 2, canvas.height / 3);
        ctx.font = '20px Comic Sans MS';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${message.author.id}`, canvas.width / 2, canvas.height / 1);
        ctx.strokeStyle = '#000000';

        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png' }));
        ctx.lineWidth = 1
        ctx.globalAlpha = 1
        let avatarsize = (canvas.height - avatar_size) / 2 // 37.5
        ctx.strokeRect(avatarsize / 1.5, avatarsize, 175, 175); // Rectangle to fit it i
        ctx.beginPath()
        ctx.arc(avatarsize / 1.5 + avatar_size / 2, avatarsize + avatar_size / 2, avatar_size / 2, 0, Math.PI * 2, true);
        ctx.clip()

        ctx.drawImage(avatar, avatarsize / 1.5, avatarsize, 175, 175);
        ctx.stroke()



        message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'profile.png' }] });
    }
})

