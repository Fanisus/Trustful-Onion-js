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

        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return message.channel.send("I don't have the permission to create channels")
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.channel.send("I don't have the permission to send messages")
        if (!message.guild.me.permissions.has("VIEW_CHANNEL")) return message.channel.send("I don't have the permission to view channels")
        let old_ticket_channel = await db.get(`server_settings.${message.guild.id}.ticket.channel`)
        if (db.has(`server_settings.${message.guild.id}.ticket.channel`)) {
            let old_channel = await message.guild.channels.fetch()
            if (old_channel.has(old_ticket_channel)) {
                let old_channel = await message.guild.channels.fetch(old_ticket_channel)
                old_channel.delete()
            }
        }
        await message.guild.channels.create("ticket", { type: "text", permissionOverwrites: [{ id: message.guild.roles.everyone.id, deny: ['SEND_MESSAGES'] }, { id: message.guild.me.id, allow: ['SEND_MESSAGES', 'ADD_REACTIONS', 'ATTACH_FILES', 'CREATE_INSTANT_INVITE', 'CREATE_PRIVATE_THREADS', 'CREATE_PUBLIC_THREADS', 'EMBED_LINKS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'MANAGE_THREADS', 'MANAGE_WEBHOOKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES_IN_THREADS', 'VIEW_CHANNEL', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS', 'USE_APPLICATION_COMMANDS'] }] }).then(async channel => {
            message.channel.send(`Ticket channel created. Move it where you want it to be and make sure I and the Members can see it.`)
            db.set(`server_settings.${message.guild.id}.ticket.channel`, channel.id)
            let ticket_channel = await message.guild.channels.fetch(channel.id)
            const embed = new discord.MessageEmbed().setTitle("Support Ticket").setDescription("Click the button below to create a ticket").setColor("#00ff00").setFooter({ text: "You can change the text of this embed. Type !ticket embed help" })
            const button = new discord.MessageActionRow().addComponents(new discord.MessageButton().setCustomId("ticket_Create").setEmoji("📧").setLabel("Create a Ticket").setStyle("SECONDARY"))
            ticket_channel.send({ components: [button], embeds: [embed] })
        })

    }
}