const Database = require('flaster-db');
const discord = require('discord.js');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});

module.exports =  {
    /**
     * @param {discord.Client} client 
     * @param {discord.Interaction} interaction 
     */
    handleSelectMenu: async function (client, interaction) {

        

    },
}