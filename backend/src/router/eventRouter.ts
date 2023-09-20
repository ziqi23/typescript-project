import express from 'express';
import { EventModel } from '../db/events';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    const events = await EventModel.find({});
    if (events) {
        res.status(200).json({events});
    }
    else {
        res.status(401);
        throw new Error("No events found");
    }
})

export default router;