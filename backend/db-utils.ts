import dotenv from 'dotenv';
dotenv.config();
import mysql, { RowDataPacket } from 'mysql2/promise';
var pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB
});

export async function query(sql : string, ...params : any[]){
	try{
		let [rows, _] = await pool.execute(sql, params);
		return rows;
	}catch(e){
		console.log(e)
		return e;
	}

}

export async function query_flatten(sql : string, ...params : any[]){
	try{
		let [rows, _] = await pool.execute({ sql, rowsAsArray: true }, params);
		return (rows as RowDataPacket).flat();
	}catch(e){
		console.log(e)
		return e;
	}

}

export async function query_single(sql : string, ...params : any[]) : Promise<any>{
	return (await query(sql, ...params) as object[])[0]

}