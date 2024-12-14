import { Router } from "express";
import { getConnection } from "../db/client";
import { QueryResult } from "mysql2";
const exchangeRouter = Router();

// Get a specific Rate by SourceCurrency and TargetCurrency
exchangeRouter.get('/:target/:source', async (req , res) => {
    const { source, target } = req.params
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results] = await conn.query<number[] & QueryResult>(
        `SELECT Rate FROM CurrencyExchange
         WHERE SourceCurrency = ? and TargetCurrency = ? 
         ORDER BY Id DESC LIMIT 1`, 
        [source, target]);

    if (results.length === 0) {
        res.status(404).send('Exchange not found')
    } else {
        res.send(results)
    }
});

export default exchangeRouter;