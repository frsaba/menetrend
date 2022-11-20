import express, {Request, Response} from 'express'
import { query, query_flatten, query_single } from '../db-utils';
import { IJarat, IStopInfo } from '../interfaces/interfaces'

let router = express.Router();

router.get('/routes', async (req: Request, res: Response) => {
	if (req.query == undefined) {
		return res.send("Specify vehicle type")
	}
	let type = req.query["type"]
	res.send(await query('SELECT jaratszam FROM jarat WHERE tipus = ?', type));
});

router.get('/vehicle_types', async (req: Request, res: Response) => {
	res.send(await query('SELECT * FROM jarmutipus'));
});

router.get('/stops', async (req: Request, res: Response) => {
	let stops = await query('SELECT * FROM megallo');

	for (let stop of (stops as IStopInfo[])) {
		let routes_array = await query("SELECT DISTINCT(jaratszam) as jarat FROM utvonal WHERE megallo = ?", stop.megallonev)
		// routes: [ { jarat: '1' } , jarat: '76' }...]

		let routes = (routes_array as { jarat: string }[]).map(r => r.jarat);
		// routes: [ '1' ,'76' ...]
		stop.jaratok = routes;
	}
	res.send(stops);
});

router.get('/compatiblestops', async (req: Request, res: Response) => {
	let route = req.query["route"] || req.body["route"];
	const typeid = (await query_single(
		`SELECT id FROM jarmutipus INNER JOIN jarat ON jarat.tipus = jarmutipus.id WHERE jaratszam = ?`, route)).id;

		console.log(typeid)
	res.send(await query_flatten(
		`SELECT megallonev FROM megallo INNER JOIN befogad ON befogad.megallo = megallo.megallonev WHERE jarmutipus = ?;`, typeid))
});

router.get('/routecolors', async (req: Request, res: Response) => {
	res.send(await query('SELECT jaratszam, szin FROM jarat INNER JOIN jarmutipus ON tipus = jarmutipus.id'));
});

router.get('/path', async (req: Request, res: Response) => {
	let route = req.query["route"];
	let rows = await query('SELECT megallo, erkezes FROM utvonal WHERE jaratszam = ? ORDER BY sorszam', route);
	res.send(rows);
});

router.get('/timetable', async (req: Request, res: Response) => {
	let route = req.query["route"];
	let stop = req.query["stop"];
	let direction = req.query["direction"];

	console.log(route, stop, direction)
	res.send(await query(`
	SELECT ora + FLOOR((perc + erkezes) / 60) % 24 as ora, 
	(perc + erkezes) % 60 as perc 
	FROM utvonal INNER JOIN indulas ON utvonal.jaratszam = indulas.jaratszam
	WHERE indulas.jaratszam = ? AND irany = ?
	AND utvonal.megallo = ?`, route, direction, stop));
});

router.get('/routesatstop', async (req: Request, res: Response) => {
	let stop = req.query["stop"] || req.body["stop"];
	let rows = await query_flatten('SELECT jaratszam FROM utvonal WHERE megallo = ? ORDER BY jaratszam', stop);
	res.send(rows);
});

router.get('/arrivals', async (req: Request, res: Response) => {
	let stop = req.query["stop"] || req.body["stop"];
	let hour = req.query["hour"] || req.body["hour"];
	let direction = req.query["direction"] || req.body["direction"];
	res.send(await query(`
	SELECT indulas.jaratszam, ora + FLOOR((perc + erkezes) / 60) % 24 as ora, 
	(perc + erkezes) % 60 as perc 
	FROM utvonal INNER JOIN indulas ON utvonal.jaratszam = indulas.jaratszam
	WHERE utvonal.megallo = ? and ora = ? and irany = ?`, stop, hour, direction));
});

router.get('/terminalstops', async (req: Request, res: Response) => {
	let route = req.query["route"] || req.body["route"];
	let rows = await query(`SELECT * FROM
		(SELECT megallo as elso_megallo FROM utvonal
		WHERE jaratszam = ?
		ORDER BY utvonal.sorszam ASC
		LIMIT 1 ) elso
		INNER JOIN
		(SELECT megallo as utolso_megallo FROM utvonal
		WHERE jaratszam = ?
		ORDER BY utvonal.sorszam DESC LIMIT 1) utolso`, route, route);

	res.send((rows as object[])[0])
});

router.get('/firststop', async (req: Request, res: Response) => {
	let route = req.query["route"] || req.body["route"];

	res.send(await query_single(`SELECT megallo FROM utvonal
		WHERE jaratszam = ? ORDER BY utvonal.sorszam ASC LIMIT 1 `, route));
});

router.get('/laststop', async (req: Request, res: Response) => {
	let route = req.query["route"] || req.body["route"];

	res.send(await query_single(`SELECT megallo FROM utvonal
		WHERE jaratszam = ? ORDER BY utvonal.sorszam DESC LIMIT 1 `, route));
});

router.get('/routeexists', async (req: Request, res: Response) => {
	let route = req.query["route"] || req.body["route"];

	if(!route) return res.send(false)

	const response = await query_single(`SELECT * FROM jarat
		WHERE jaratszam LIKE ?`, route);
	res.send({exists : !!response});
});

router.get('/departures', async (req: Request, res: Response) => {
	let route = req.query["route"] || req.body["route"];

	if(!route) return res.send({status: "error", msg: "Missing parameter: route"})

	res.send(await query(`SELECT ora, perc, irany FROM indulas WHERE jaratszam = ?`, route))
});

export default router;