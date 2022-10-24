const Database = require('flaster-db');
const discord = require('discord.js');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});

module.exports = {
    /**
     * @param {discord.Client} client 
     * @param {discord.Interaction} interaction 
     */
    handleSlash: async function (client, interaction) {
        const command = interaction.commandName
        const cmd = client.commands.get(command) || client.aliases.get(command);
        cmd.slashCommand(client, interaction);
    },
}