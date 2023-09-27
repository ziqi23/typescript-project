import "./EventCard.css"
import { Link } from "react-router-dom";

type EventDetails = {
    id: string,
    imageUrl : string,
    name: string,
    location : string,
    time : string
}
function EventCard(props : EventDetails) {
    const {id, imageUrl, name, location, time} = props;

    return (
        <Link to={`/event/${id}`}>
            <div className="individual-event-card rounded-lg hover:bg-gray-100">
                <div className="card-top">
                    <img src={imageUrl}></img>
                </div>
                <div className="card-main">
                    <div className="text-white m-3 font-bold">{name}</div>
                    <div className="ml-3 mr-3 text-zinc-400">{location}</div>
                    <div className="ml-3 mr-3 text-zinc-400">{time}</div>
                </div>
            </div>
        </Link>
    )
}

export default EventCard;