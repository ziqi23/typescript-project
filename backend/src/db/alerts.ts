// Needs to have reference to user id, and all fields necessary to perform routine search

import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, // Foreign key to user id
    eventId: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true}, // Foreign key to event id
    time: {type: Date, required: true}, // Time when alert was initially set up
    desiredPrice: {type: Number, required: true}, // Price threshold set by user
    desiredSections: {type: [Number], required: true}, // Sections set by user
    priceHistory: {type: String, required: true}, // Historical price by time interval
    notified: {type: Boolean, default: false, required: false} // Whether alert has already triggered (inactive)
})

export const AlertModel = mongoose.model('Alert', AlertSchema);