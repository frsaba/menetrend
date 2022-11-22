import express, { Request, Response } from 'express'
import { query, query_flatten, query_single } from '../db-utils';
import _ from 'lodash';
import { IDensityInfo, IRouteLengthInfo } from '../interfaces/interfaces';
import { group } from 'console';

let router = express.Router();

router.get('/averagetraveltime', async (req: Request, res: Response) => {
	const rows = await query(
		`SELECT AVG(menetido) as atlag, tipus FROM (
		SELECT jarat.jaratszam, MAX(utvonal.erkezes) as menetido, jarmutipus.nev as tipus 
		FROM utvonal INNER JOIN jarat ON utvonal.jaratszam = jarat.jaratszam 
			INNER JOIN jarmutipus ON jarmutipus.id = jarat.tipus 
		GROUP BY jaratszam) menetidok 
		GROUP BY tipus;`);
	res.send(rows)
});

router.get('/density', async (req: Request, res: Response) => {
	const rows: IDensityInfo[] = await query(
		`SELECT ora, jarmutipus.nev as tipus, COUNT(*) as db
	FROM indulas INNER JOIN jarat ON indulas.jaratszam = jarat.jaratszam 
	INNER JOIN jarmutipus ON jarmutipus.id = jarat.tipus 
	GROUP BY ora, jarat.tipus`) as any;

	const groups = _.groupBy(rows, x => x.tipus);
	const types = Object.keys(groups);
	const data = types.map(t =>
		_.range(24).map(h => _.find(groups[t], d => d.ora == h)?.db || 0))
	res.send(_.zip(types, data))
});

router.get('/longestroutes', async (req: Request, res: Response) => {
	const rows : IRouteLengthInfo[] = await query(
		`SELECT jarat.jaratszam, COUNT(*) as hossz, jarmutipus.nev as tipus 
		FROM utvonal INNER JOIN jarat ON utvonal.jaratszam = jarat.jaratszam 
		INNER JOIN jarmutipus ON jarmutipus.id = jarat.tipus 
		GROUP BY utvonal.jaratszam ORDER BY hossz DESC`) as any;

	// const groups = _.groupBy(rows, x => x.tipus);
	res.send(rows)
});

export default router;