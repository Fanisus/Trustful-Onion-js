const Database = require('flaster-db');
const db = new Database.Database('./Database', {
    file: 'Data.json',
    cli: false,
    deep: true
});
module.exports = (client, interaction) => {
    
};
