import mysql from 'mysql2/promise';
import { dbOptions } from './config/db.js';

export const pool = mysql.createPool(dbOptions);