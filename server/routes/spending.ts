import { Router } from "express";
import { getConnection } from "../db/client";
const spendingRouter = Router();

// Get a specific transaction record by UserId
spendingRouter.get('/:userId', async (req, res) => {
    const {userId} = req.params
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    await conn.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await conn.beginTransaction();
    const [results]: [any[], any] = await conn.query('SELECT * FROM Spending AS s JOIN Party AS p ON p.GroupId = s.GroupId JOIN User AS u ON u.UserId = p.CreatedBy WHERE p.CreatedBy =  ?', [userId]);
    const [results2]: [any[], any] = await conn.query('SELECT * FROM Party AS p JOIN PartyMember AS pm ON pm.GroupId = p.GroupId JOIN Spending as s ON s.GroupId = pm.GroupId WHERE p.CreatedBy != ? AND pm.UserId = ? ', [userId, userId]);
    await conn.commit();

    if (results.length === 0 && results2.length === 0) {
        res.status(404).send('User not found')
    } else {
        // res.send(results)
        res.json({
            sendSpending: results,
            receivedSpending: results2
        });
    }
});

// Create a new spending record
spendingRouter.post('/', async (req, res) => {
    const body = req.body;
    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }
    const [results, _] = await conn.query('INSERT INTO Spending SET ?', [body]);
    res.json(results);
});

// Update an existing spending record by ID
// spendingRouter.put('/:id', async (req, res) => {
//     const id = req.params.id;
//     const body = req.body;
//     const conn = await getConnection();
//     if (!conn) {
//         res.status(500).send('No database connection');
//         return;
//     }
//     const [results, _] = await conn.query('UPDATE Spending SET ? WHERE SpendingId = ?', [body, id]);
//     res.json(results);
// });

spendingRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { CurrencyType, Amount, SenderId } = req.body;

    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }

    // const [results, _] = await conn.query(
    //     `CALL AddTransaction(?, ?, ?, ?)`,
    //     [id, CurrencyType, Amount, SenderId]
    // );
    // res.json(results);
    await conn.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    await conn.beginTransaction();
    const [results, _] = await conn.query(
        `CALL AddTransaction(?, ?, ?, ?)`,
        [id, CurrencyType, Amount, SenderId]
    );
    await conn.commit();
    res.json(results);
});

// Delete a spending record by ID
spendingRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }
    const [results, _] = await conn.query('DELETE FROM Spending WHERE SpendingId = ?', [id]);
    res.json(results);
});

export default spendingRouter;