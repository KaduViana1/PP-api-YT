import mysql from 'mysql';
import { config } from 'dotenv';

config();
const pool = mysql.createPool({
  user: process.env.USER_DATABASE as string,
  password: process.env.PASSWORD_DATABASE as string,
  database: process.env.DATABASE as string,
  host: process.env.HOST_DATABASE as string,
  port: Number(process.env.PORT_DATABASE) as number,
});

export { pool };
