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

        if (interaction.member.permissions.has("KICK_MEMBERS") || interaction.member.permissions.has("BAN_MEMBERS") || interaction.member.permissions.has("ADMIN")) {
            await interaction.deferReply()
            let target = interaction.options.getUser('target')
            let reason = interaction.options.getString('reason')
            if (!reason) {
                reason = "No Reason Provided"
            }
            // await interaction.guild.members.kick(target, reason)
            let member = await interaction.guild.members.fetch(target)
            await interaction.editReply("Kicked " + member.user.username + "#" + member.user.discriminator + " " + target)
        }

    },
    /**
     * @param {discord.Client} client 
     */
    registerSlash: async function (client) {
        try {
            let data = new discord.SlashCommandBuilder()
                .setName("kick")
                .setDescription("Kick the mentioned member")
                .addUserOption(option => option.setName('target').setDescription('select the target user to kick').setRequired(true))
                .addStringOption(option => option.setName('reason').setDescription('reason for kick'))
                .toJSON()
            return data
        } catch (error) {
            console.log(error)
        }
    }
}