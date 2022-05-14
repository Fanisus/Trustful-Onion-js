const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
module.exports = (client, ban) => {
    console.log(`${ban.user.id} was banned from the server.`);
    
}