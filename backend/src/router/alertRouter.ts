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
    eventURL: String,
    desiredSections: String,
    desiredPrice: String
}

router.post('/', async (req, res) => {
    const {userId, eventURL, desiredSections, desiredPrice} : Alert = req.body;
    const formattedDesiredSections : Number[] = desiredSections.split(" ").map(ele => parseInt(ele))
    const time = Date.now();
    const eventTime = Date.now(); // TO UPDATE: Event name, event picture
    if (!userId || !eventURL || !desiredSections || !desiredPrice) {
        throw new Error("Missing fields");
    }

    const alert = await AlertModel.create({
        userId,
        time,
        eventURL,
        eventTime,
        desiredPrice,
        desiredSections: formattedDesiredSections,
        priceHistory: "1"
    })
    if (alert) {
        res.status(200).json(null);
    }
    else {
        res.status(400);
        throw new Error("Alert data is not valid");
    }
})

export default router;