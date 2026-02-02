const { Pool } = require('pg');

 const pool = new Pool({
    user: 'postgres',
    database: 'drive_car',
    password: 'bekjan000',
    host: 'localhost',
    port: 5432,
});
                                                                                            
module.exports = { pool };
