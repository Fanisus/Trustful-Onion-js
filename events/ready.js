const Database = require('flaster-db');
const discord = require('discord.js');
const { REST, Routes } = require('discord.js');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
module.exports = async (client) => {
    console.log(`${client.user.username} is online!`);

    console.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);
    console.log("Becoming a hard coded stuff")
    client.user.setActivity("Hi, Um I don't have enough inspiration", { type: 'STREAMING' })
    // console.log(moment().utc().format('D/M/YYYY/h/m/s'))
    const rest = new discord.REST({ version: '10' }).setToken("NzQ3ODIzNzgzODQyNDE0NjYz.GcFjtd.X-UfKnpDugJBq1BmTjeVCCceTBkiqfmgl3MGBw");

    // rest.put(Routes.applicationGuildCommands("747823783842414663", "710847318886449152"), { body: [] })
	// .then(() => console.log('Successfully deleted all guild commands.'))
	// .catch(console.error);
    require('../handler/registerSlash').registerAll(client, "710847318886449152")
    // require('../handler/registerSlash').registerAll(client)
};
async function slashify() {
    try {
        const rest = new discord.REST({ version: '10' }).setToken("NzQ3ODIzNzgzODQyNDE0NjYz.GcFjtd.X-UfKnpDugJBq1BmTjeVCCceTBkiqfmgl3MGBw");
        const CLIENT_ID = "747823783842414663"
        const GUILD_ID = "710847318886449152"
        let data = new discord.SlashCommandBuilder()
            .setName("kick")
            .setDescription("Kicks the mentioned member")
            .addUserOption(option => option.setName('target').setDescription('Select the target user to kick'))
            .toJSON()
        console.log(data)
        console.log('Started refreshing application (/) commands.');
        await rest.put(discord.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [data] });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.log(error)
    }
}
// slashify()