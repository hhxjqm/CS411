import { Router } from "express";
import { getConnection } from "../db/client";

const groupRouter = Router();

// Get all groups of current user
groupRouter.get('/:id', async (req, res) => {
    const id = req.params.id
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results, _]: [any[], any] = await conn.query('SELECT * FROM PartyMember pm JOIN Party p ON p.GroupId = pm.GroupId WHERE pm.UserId = ?', [id])
    if (results.length === 0) {
        res.status(404).send('User not found')
    } else {
        res.send(results)
    }
});

// Create a new group
groupRouter.post('/', async (req, res) => {
    const { GroupName, CreatedBy } = req.body
    console.log(GroupName, CreatedBy);
    const conn = await getConnection()
    if (!conn) {
        res.status(500).send('No database connection')
        return
    }
    const [results, _]: [any, any] = await conn.query('INSERT INTO Party (GroupName, CreatedBy) VALUES (?, ?)', [GroupName, CreatedBy])
    res.send({ id: results.insertId })
});

// Join an existing group
groupRouter.post('/:groupId/join', async (req, res) => {
    const { groupId } = req.params;
    const { userId } = req.body;
    const conn = await getConnection();
    if (!conn) {
        res.status(500).send('No database connection');
        return;
    }

    try {
        // Check if the group exists
        const [groupExists, _]: [any[], any] = await conn.query(
            'SELECT * FROM Party WHERE GroupId = ?',
            [groupId]
        );

        if (groupExists.length === 0) {
            res.status(404).send('Group not found');
            return;
        }

        // Check if the user is already a member
        const [membershipExists, __]: [any[], any] = await conn.query(
            'SELECT * FROM PartyMember WHERE GroupId = ? AND UserId = ?',
            [groupId, userId]
        );

        if (membershipExists.length > 0) {
            res.status(400).send('User is already a member of this group');
            return;
        }

        // Add the user to the group
        await conn.query(
            'INSERT INTO PartyMember (GroupId, UserId) VALUES (?, ?)',
            [groupId, userId]
        );

        res.send({ message: 'Successfully joined the group' });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).send('An error occurred while joining the group');
    }
});

export default groupRouter;
