const dotenv = require("dotenv").config({})
const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
const discord = require('discord.js');
const fs = require('fs');
const client = new discord.Client({
    intents: [
        
        discord.GatewayIntentBits.DirectMessageReactions,
        discord.GatewayIntentBits.DirectMessageTyping,
        discord.GatewayIntentBits.DirectMessages,
        discord.GatewayIntentBits.GuildBans,
        discord.GatewayIntentBits.GuildEmojisAndStickers,
        discord.GatewayIntentBits.GuildIntegrations,
        discord.GatewayIntentBits.GuildInvites,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildMessageReactions,
        discord.GatewayIntentBits.GuildMessageTyping,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildPresences,
        discord.GatewayIntentBits.GuildScheduledEvents,
        discord.GatewayIntentBits.GuildVoiceStates,
        discord.GatewayIntentBits.GuildWebhooks,
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.MessageContent
    ]
})

const now = new Date().getTime()
let prefix = "$";
client.commands = new discord.Collection()
client.aliases = new discord.Collection()
client.handler = new discord.Collection()
let TotalCommands = 0
fs.readdirSync('./commands/').forEach(dir => {
    fs.readdirSync(`./commands/${dir}/`).forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${dir}/${file}`);
        const commandName = file.split(".")[0];
        client.commands.set(commandName, command);
        if (command.aliases) {
            command.aliases.forEach(alias => {
                client.aliases.set(alias, command);
            });
        };
        TotalCommands++
        console.log(`NAME: '${commandName}'\nLOCATION: './commands/${dir}/${file}'\n`);
    })
});
console.log("Total Number of Commands: " + TotalCommands);
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`Loading event ${eventName}`);
        client.on(eventName, event.bind(null, client));
    });
});

client.login(process.env.TOKEN);

client.on('messageCreate', async message => {
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    
})
client.on('interactionCreate', async interaction => {

})
client.on('inviteCreate', (invite) => {

})