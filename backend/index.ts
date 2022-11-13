import express, { Express, Request, Response, json } from 'express';
import dotenv from 'dotenv';
import { IJarat, IStopInfo } from './interfaces/interfaces'

import cors from 'cors'
import morgan from 'morgan'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(morgan("tiny"))
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
	let [stops, _] = await pool.execute('SELECT * FROM megallo');
	for (let stop of (stops as IStopInfo[]) ){
		let [routes_array, _] = (await pool.execute("SELECT DISTINCT(jaratszam) as jarat FROM utvonal WHERE megallo = ?", [stop.megallonev]))
		// routes: [ { jarat: '1' } , jarat: '76' }...]

		let routes = (routes_array as {jarat: string}[]).map(r => r.jarat);
		// routes: [ '1' ,'76' ...]
		stop.jaratok = routes;
	}
	res.send(stops);
});

app.get('/routecolors', async (req: Request, res: Response) => {
	let [rows, _]= await pool.execute('SELECT jaratszam, szin FROM jarat INNER JOIN jarmutipus ON tipus = jarmutipus.id');
	res.send(rows);
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});