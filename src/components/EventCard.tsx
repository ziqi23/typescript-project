import "./EventCard.css"
import { Link } from "react-router-dom";

type EventDetails = {
    imageUrl : string,
    name: string,
    location : string,
    time : string
}
function EventCard(data : EventDetails) {
    let eventImage = require('../assets/beyonce.jpeg');
    console.log(data.imageUrl)
    return (
        <Link to="/event">
            <div className="event-card">
                <img src={eventImage}></img>
                <div>{data.name}</div>
                <div>{data.location}</div>
                <div>{data.time}</div>
            </div>
        </Link>
    )
}

export default EventCard;