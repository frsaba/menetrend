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

router.post('/updatestop', async (req: Request, res: Response) => {

	let old_name = req.body["old_name"];
	let new_name = req.body["new_name"];
	let new_address =  req.body["new_address"];

	if(!old_name || !new_name || !new_address) return res.send({status: "error", msg: "Missing parameters"})

	const response : any = await query(`UPDATE megallo SET megallonev = ?, cim = ? WHERE megallo.megallonev = ?;`, new_name,new_address, old_name);
	res.send({success : response.affectedRows == 1});
});



export default router;