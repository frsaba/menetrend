import express, { Express, Request, Response, json } from 'express';
import dotenv from 'dotenv';
import { IJarat } from './interfaces/interfaces'

import cors from 'cors'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(json())

import mysql from 'mysql2/promise';
var pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB
});

// pool.query('SELECT * FROM jarat', function (error: Error, results: any, fields: IJarat) {
// 	if (error) throw error;
// 	console.log('The solution is: ', results);
// });

app.get('/routes', async (req: Request, res: Response) => {
	if(req.query == undefined){
		return res.send("Specify vehicle type")
	}
	let type = req.query["type"]
	let [rows, _]= await pool.execute('SELECT jaratszam FROM jarat WHERE tipus = ?', [type]);
	res.send(rows);
});

app.get('/vehicle_types', async (req: Request, res: Response) => {
	let [rows, _]= await pool.execute('SELECT * FROM jarmutipus');
	res.send(rows);
});

app.get('/stops', async (req: Request, res: Response) => {
	let [rows, _]= await pool.execute('SELECT * FROM megallo');
	res.send(rows);
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});