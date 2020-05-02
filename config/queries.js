require('custom-env').env(true);


var pg = require('pg');
pg.types.setTypeParser(1114, str => str);
const Pool = pg.Pool

const getDBPool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.Postgres_Host,
    database: process.env.Postgres_Database,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.Postgres_Port,
    min: 2,
    max: 5
})


module.exports = getDBPool;