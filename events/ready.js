const moment = require('moment');
const Database = require('flaster-db');
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
    console.log(moment().utc().format('D/M/YYYY/h/m/s'))
    


    
};
