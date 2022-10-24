"use strict"
const Database = require('flaster-db');
const fs = require('fs');
const discord = require('discord.js');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
const rest = new discord.REST({ version: '10' }).setToken("NzQ3ODIzNzgzODQyNDE0NjYz.GcFjtd.X-UfKnpDugJBq1BmTjeVCCceTBkiqfmgl3MGBw");
const CLIENT_ID = "747823783842414663"
module.exports = {
    /**
     * @param {discord.Client} client
     * @param {String} guildId
     */
    registerAll: async function (client, guildId) {
        let guildSlashCommands = []
        let globalSlashCommands = []
        try {
            let folders = fs.readdirSync('./commands/')
            for await (let folder of folders) {
                let files = fs.readdirSync(`./commands/${folder}/`)
                for await (let file of files) {
                    if (!file) return;
                    if (!file.endsWith('.js')) return
                    try {
                        let data = await require(`../commands/${folder}/${file}`).registerSlash()
                        if (guildId) {
                            let guilds = await client.guilds.fetch()
                            guilds.find(async (guild) => {
                                if (guild.id == guildId) {
                                    guildSlashCommands.push(data)
                                    // await rest.put(discord.Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: [data] });
                                    console.log(`Registering ${folder}/${file} as slash command for the guild ${guildId}`);
                                    return true
                                }
                            })
                        } else if (!guildId) {
                            globalSlashCommands.push(data)
                            // await rest.put(discord.Routes.applicationCommands(CLIENT_ID), { body: [data] })
                            console.log(`Registered ${folder}/${file} as slash command globally!`);
                        }
                    } catch (error) {
                        console.log('Failed registering slash command: ' + file);
                        console.log(error)
                    }
                }
            }
        } 
        catch (error) {
            console.log(error)
        }
        if (guildId) {
            try {
                console.log(guildSlashCommands)
                if (guildSlashCommands.length > 50) {return console.log("Failed Registering Slash Command Error: Exceeded 50 commands")}
                await rest.put(discord.Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: guildSlashCommands });
                console.log("Successfully Registered All Guild Slash Command")
            } catch (error) {
                console.log(error)
            }
        } else if (!guildId) {
            try {
                console.log(globalSlashCommands)
                if (globalSlashCommands.length > 50) {return console.log("Failed Registering Slash Command Error: Exceeded 50 commands")}
                await rest.put(discord.Routes.applicationCommands(CLIENT_ID), { body: globalSlashCommands })
                console.log("Successfully Registered All Global Slash Command")
            } catch (error) {
                console.log(error)
            }
        }
    }
}