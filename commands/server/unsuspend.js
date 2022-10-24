const Database = require('flaster-db');
const discord = require('discord.js');
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
    /**
     * @param {discord.Client} client 
     * @param {discord.Message} message
     * @param {Array} args
     */
    messageCommand: async function (client, message, args) {



    },
    /**
     * @param {discord.Client} client 
     * @param {discord.Interaction} interaction 
     */
    slashCommand: async function (client, interaction) {



    },
    /**
     * @param {discord.Client} client 
     */
    registerSlash: async function (client) {
        try {
            let data = new discord.SlashCommandBuilder()
                .setName("kick")
                .setDescription("Unsuspends the server")
                .addStringOption("Hi")
                .toJSON()
            return data
        } catch (error) {
            console.log(error)
        }
    }
}