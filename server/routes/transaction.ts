import { Router } from "express";
import { getConnection } from "../db/client";
const transactionRouter = Router();


// Get a specific transaction record by ID
transactionRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    await conn.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await conn.beginTransaction();
    const [results]: [any[], any] = await conn.query('SELECT * FROM Transaction JOIN User ON Transaction.ReceiverId = User.UserId WHERE SenderId = ?', [id]);
    const [results2]: [any[], any] = await conn.query('SELECT * FROM Transaction JOIN User ON Transaction.SenderId = User.UserId WHERE ReceiverId = ?', [id]);
    await conn.commit();

    if (results.length === 0 && results2.length === 0) {
        res.status(404).send('User not found')
    } else {
        // res.send(results)
        res.json({
            sentTransactions: results,
            receivedTransactions: results2
        });
    }
});

// Create a new transaction record
transactionRouter.post('/', async (req, res) => {
    const body = req.body;
    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }
    const [results, _] = await conn.query('INSERT INTO Transaction SET ?', [body]);
    res.json(results);
});

// Update an existing transaction record by ID
transactionRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }
    const [results, _] = await conn.query('UPDATE Transaction SET ? WHERE TransactionId = ?', [body, id]);
    res.json(results);
});

// Delete a spending record by ID
transactionRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }
    const [results, _] = await conn.query('DELETE FROM Transaction WHERE TransactionId = ?', [id]);
    res.json(results);
});

export default transactionRouter;