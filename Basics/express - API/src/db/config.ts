import dotenv from 'dotenv';
import assert from 'assert';
import sql from 'mssql';

dotenv.config();

const {
    PORT,
SQL_SERVER,
SQL_USER,
SQL_PWD,
SQL_DB,
SQL_ENCRYPT
} = process.env;

assert(PORT, "PORT required");
assert(SQL_SERVER, "SQL_SERVER required");
assert(SQL_USER, "SQL_USER required");
assert(SQL_PWD, "SQL_PWD required");
assert(SQL_DB, "SQL_DB required");
assert(SQL_ENCRYPT, "SQL_ENCRYPT required");

export const config ={
    port: PORT,
    sqlConfig:{
        user: SQL_USER,
        password: SQL_PWD,
        database: SQL_DB,
        server: SQL_SERVER,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        },
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
};

export const getPool = async () => {
    try {
        const pool = await sql.connect(config.sqlConfig);
        console.log('SQL Server Connected!')
        return pool;
    } catch (error) {
        console.log('SQL Server Connection Failed! ', error);
        throw error;
    }
};