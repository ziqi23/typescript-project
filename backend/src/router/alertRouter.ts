import express from 'express';
import { AlertModel } from '../db/alerts';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const userAlerts = await AlertModel.find({userId});
    if (userAlerts) {
        res.status(200).json({userAlerts});
    }
    else {
        res.status(401);
        throw new Error("No alerts found");
    }
})

type Alert = {            
    userId: String,
    eventId: String,
    desiredSections: string[]
    desiredPrice: String
}

router.post('/', async (req, res) => {
    const {userId, eventId, desiredSections, desiredPrice} : Alert = req.body;
    if (!userId || !eventId || !desiredSections || !desiredPrice) {
        res.status(400).send("Missing fields");
    }
    console.log(desiredSections)
    const formattedDesiredSections : Number[] = desiredSections.map(ele => parseInt(ele))
    const time = Date.now();

    const alert = await AlertModel.create({
        userId,
        eventId,
        time,
        desiredPrice,
        desiredSections: formattedDesiredSections,
        priceHistory: 1
    })
    if (alert) {
        res.status(200).json(null);
    }
    else {
        res.status(400).send("Alert data is not valid");
    }
})

export default router;