import mysql from 'mysql'
import { dbOptions } from './config/db.js';

export const db = mysql.createConnection(dbOptions);