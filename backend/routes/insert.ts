import express, {Request, Response} from 'express'
import { query, query_flatten, query_single } from '../db-utils';

let router = express.Router();

router.post('/route', async (req: Request, res: Response) => {

	console.log(req.body)
	let route = req.body["route"];
	let vehicle_type = req.body["type"];

	if(!route || !vehicle_type) return res.send({status: "error", msg: "Missing parameters"})

	const response : any = await query(`INSERT INTO jarat VALUES(?,?)`, route, vehicle_type);
	res.send({success : response.affectedRows == 1});
});

router.post('/vehicletype', async (req: Request, res: Response) => {

	console.log(req.body)
	let type_name = req.body["name"];
	let color :string = req.body["color"];
	let stops : string[] = req.body["stops"];

	if(!type_name || !color) return res.send({status: "error", msg: "Missing parameters"})

	if(color.startsWith("#")) color = color.substring(1);

	const {affectedRows, insertId} : {affectedRows : number, insertId : number} = (await query(
		`INSERT INTO jarmutipus (nev, szin) VALUES(?,?)`, type_name, color)) as any
	console.log(affectedRows,insertId)
	if(affectedRows != 1) return res.send({success : false});
	for (let stop of stops){
		await query(`INSERT INTO befogad (megallo, jarmutipus) VALUES(?,?)`, stop, insertId)
	}
	res.send({success : true});
});

router.post('/updatestop', async (req: Request, res: Response) => {

	let old_name = req.body["old_name"];
	let new_name = req.body["new_name"];
	let new_address =  req.body["new_address"];

	if(!old_name || !new_name || !new_address) return res.send({status: "error", msg: "Missing parameters"})

	const {affectedRows} : {affectedRows : number, insertId : number} = (await query(
		`UPDATE megallo SET megallonev = ?, cim = ? WHERE megallo.megallonev = ?;`, new_name,new_address, old_name)) as any

	res.send({success : affectedRows == 1});
});



export default router;