// imageUrl: '../assets/beyonce.jpeg',
// name: "Beyonce",
// location: "Levi's Stadium",
// time: "Wed, Aug 30, 7:00 PM"


import mongoose from 'mongoose';

// need sub categories (NFL, NBA, Rock, Country, Comedy, Theatre, etc)
// need performer(s)
// need event city, event state, event geolocation

const EventSchema = new mongoose.Schema({
    tickpickURL: {type: String, required: true}, // Expand to other sites in the future
    stadiumURL: {type: String, required: true},
    eventCategory: {type: String, required: false},
    eventTitle: {type: String, required: true},
    eventLocation: {type: String, required: true},
    eventTime: {type: String, required: true},
    eventImageURL: {type: String, required: true}
})

export const EventModel = mongoose.model('Event', EventSchema);