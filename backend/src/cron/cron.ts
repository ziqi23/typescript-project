import cron from 'node-cron';
import { AlertModel } from '../db/alerts';
import { EventModel } from '../db/events';
import mongoose from 'mongoose'
import fetch from 'node-fetch';

type Alert = {
    alertId : mongoose.Types.ObjectId,
    sections : number[],
    price: number
}

type Subscriptions = {
    [key : string]: Alert[]
}

type Ticket = {
    id: string, // identifier
    eid: string, // event identifier
    sid: string, // section
    r: string, // row
    p: number, // price
    q: number, // quantity
    n: string, // note
    sp: number[] // available quantities to be sold
}

export default function runScheduledJob() {
    // cron.schedule('45 * * * * *', async () => {
    //     console.log("performing job")
        
    //     let subscriptions : Subscriptions = {};
    //     const alerts = await AlertModel.find({});
    //     for (let alert of alerts) {
    //         const event = await EventModel.findOne({_id: alert.eventId});
    //         if (!subscriptions[event.tickpickURL]) {
    //             subscriptions[event.tickpickURL] = [{alertId: alert._id, sections: alert.desiredSections, price: alert.desiredPrice}];
    //         }
    //         else {
    //             subscriptions[event.tickpickURL].push({alertId: alert._id, sections: alert.desiredSections, price: alert.desiredPrice});
    //         }
    //     }
    //     // For each subscribed alert, need to find lowest price within desired sections and update alert model
    //     console.log(subscriptions)
    //     for (let tickpickURL of Object.keys(subscriptions)) {
    //         const res = fetch(tickpickURL, {
    //             headers: {
    //                 "User-Agent": "PostmanRuntime/7.32.2",
    //                 "Accept": "*/*",
    //                 "Accept-Encoding": "gzip, deflate, br",
    //                 "Content-Type": "application/json",
    //                 "Connection": "keep-alive"
    //             }
    //         })
    //             .then(res => res.json())
    //             .then(data => console.log(data))
    //             .catch(err => console.log("error"));
    //         // const data : Ticket[] = await res.json();
    //         // console.log("data", data);
    //         // for (let subscription of subscriptions[tickpickURL]) {
    //         //     let lowestPrice = Infinity;
    //         //     for (let ticket of data) {
    //         //         if (subscription.sections.includes(parseInt(ticket.sid))) {
    //         //             lowestPrice = Math.min(lowestPrice, ticket.p);
    //         //         }
    //         //     }
    //         //     console.log("lowest price is", lowestPrice);
    //         //     const alert = await AlertModel.findOne({_id: subscription.alertId});
    //         //     alert.priceHistory = alert.priceHistory.concat(`${lowestPrice},`);
    //         //     console.log("old alert", alert)
    //         //     await alert.save();
    //         //     console.log("new alert", alert)
    //         // }
    //     }
    //     //{eventTicketURL: [{alertId, section, price}]}
    // })
}