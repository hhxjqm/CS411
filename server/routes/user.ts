import { Router } from "express"
import { getConnection } from "../db/client"

const userRouter = Router()

userRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results, _]: [any[], any] = await conn.query('SELECT * FROM User WHERE userId = ?', [id])
    if (results.length === 0) {
        res.status(404).send('User not found')
    } else {
        res.send(results[0])
    }
})

userRouter.post('/', async (req, res) => {
    const body = req.body
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results, _] = await conn.query('INSERT INTO User SET ?', [body])
    res.json(results)
})

userRouter.put('/:id', async (req, res) => {
    const id = req.params.id
    const body = req.body
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results, _] = await conn.query('UPDATE User SET ? WHERE userId = ?', [body, id])
    res.json(results)
})

userRouter.delete('/:id', async (req, res) => {
    const id = req.params.id
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results, _] = await conn.query('DELETE FROM User WHERE userId = ?', [id])
    res.json(results)
})

export default userRouter