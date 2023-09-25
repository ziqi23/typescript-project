import "./EventCard.css"
import { Link } from "react-router-dom";

type EventDetails = {
    id: string,
    imageUrl : string,
    name: string,
    location : string,
    time : string
}
function EventCard(data : EventDetails) {
    let eventImage = require('../../../assets/beyonce.jpeg');
    console.log(data.imageUrl)
    return (
        <Link to={`/event/${data.id}`}>
            <div className="event-card">
                <img src={data.imageUrl}></img>
                <div>{data.name}</div>
                <div>{data.location}</div>
                <div>{data.time}</div>
            </div>
        </Link>
    )
}

export default EventCard;