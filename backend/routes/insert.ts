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



export default router;