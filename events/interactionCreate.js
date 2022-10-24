const Database = require('flaster-db');
const discord = require('discord.js');
const fs = require('fs')
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
/**
 * 
 * @param {discord.Client} client 
 * @param {discord.Interaction} interaction 
 * @returns 
 */
module.exports = (client, interaction) => {
    const command = interaction.commandName
    const cmd = client.commands.get(command) || client.aliases.get(command);
    if (!cmd) {
        if (message.channel.id != db.get(`music_request_channel-${message.guild.id}-text`)) return;
    }
    if (interaction.isCommand()) {
        require("../handler/slash").handleSlash(client, interaction)
        // cmd.slashCommand(client, interaction);
    }
    else if (interaction.isButton()) {
        console.log("Button")
        // cmd.buttonCommand(client, interaction)
    }
};
