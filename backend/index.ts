import express, { Express, Request, Response, json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import morgan from 'morgan'
import insertRouter from './routes/crud'
import routeQueriesRouter from './routes/route-queries'
import statsRouter from './routes/stats'

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors())
app.use(morgan("tiny"))
app.use(json())

app.use(insertRouter);
app.use(routeQueriesRouter);
app.use("/stats", statsRouter)


app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});