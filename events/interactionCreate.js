const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
module.exports = async (client, interaction) => {
    
    if (interaction.isButton()) {
        if (interaction.customId.toLowerCase() == "ticket_create") {
            await interaction.guild.channels.create(interaction.user.username + "_" + interaction.user.id, {
                type: "text",
                parent: interaction.channel.parentId,
                permissionOverwrites: [{ id: interaction.user.id, allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "READ_MESSAGE_HISTORY", "SEND_MESSAGES_IN_THREADS", "CREATE_PRIVATE_THREADS", "CREATE_PUBLIC_THREADS"] }, { id: interaction.guild.roles.everyone.id, deny: ['SEND_MESSAGES'] }, { id: interaction.guild.me.id, allow: ['SEND_MESSAGES', 'ADD_REACTIONS', 'ATTACH_FILES', 'CREATE_INSTANT_INVITE', 'CREATE_PRIVATE_THREADS', 'CREATE_PUBLIC_THREADS', 'EMBED_LINKS', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'MANAGE_THREADS', 'MANAGE_WEBHOOKS', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES_IN_THREADS', 'VIEW_CHANNEL', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS', 'USE_APPLICATION_COMMANDS'] }]
            }).then(async channel => {
                interaction.reply({ content: `Your ticket has been created. You can view it here: <#${channel.id}>`, ephemeral: true })
                db.push(`server_settings.${interaction.guild.id}.ticket.open_tickets`, channel.id)
                let ticket_channel = await channel.guild.channels.fetch(channel.id)
                const embed = new discord.MessageEmbed().setTitle("Support Ticket").setDescription(`<@${interaction.guild.id}> Welcome to your ticket! Ask your questions here. If your question is done answering you can close the ticket by clicking the button below.`).setColor("#00ff00")
                const button = new discord.MessageActionRow().addComponents([new discord.MessageButton().setCustomId("ticket_Close").setEmoji("❌").setLabel("Close Ticket").setStyle("DANGER"), new discord.MessageButton().setCustomId("ticket_Transcribe").setEmoji("📄").setLabel("Transcribe").setStyle("PRIMARY")])
                ticket_channel.send({ components: [button], embeds: [embed] })
            })
        }
        else if (interaction.customId.toLowerCase() == "ticket_close") {
            interaction.reply({ content: "Your ticket has been closed.", ephemeral: true })
            db.remove(`server_settings.${interaction.guild.id}.ticket.open_tickets`, interaction.channel.id)
            setTimeout(() => interaction.channel.delete(), 5000)
        }
        else if (interaction.customId.toLowerCase() == "ticket_transcribe") {
            interaction.deferReply()
            interaction.channel.messages.fetch().then(async messages => {
                fs.writeFileSync(`./ticket_${interaction.channel.id}.txt`, messages.map(message => message.author.username + " - " + message.content + "\n" + message.createdAt.toUTCString() + "\n").join("\n").toString())
                interaction.editReply({ files: [{ attachment: fs.readFileSync(`./ticket_${interaction.channel.id}.txt`), name: `ticket_${interaction.channel.id}.txt` }] }).finally(() => fs.unlinkSync(`./ticket_${interaction.channel.id}.txt`))
            })
        }
    }

};
