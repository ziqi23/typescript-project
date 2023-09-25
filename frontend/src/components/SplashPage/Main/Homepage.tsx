import "./Homepage.css"
import EventCard from "./../Events/EventCard";
import Header from "./../Header/Header";
import splash1 from "../../../assets/splash1.jpg";
import splash2 from "../../..//splash2.jpg";
import splash3 from "../../../assets/splash3.jpg";
import splash4 from "../../../assets/splash4.jpg";
import SearchBar from "./SearchBar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getEvents } from "../../../store/event";
import { useEffect, useState } from "react";

type EventDetails = {
    imageUrl : string,
    name: string,
    location : string,
    time : string
}

function Homepage() {
    const dispatch = useAppDispatch();
    const events = useAppSelector(state => state.event.data);
    const [filteredEvents, setFilteredEvents] = useState(events);
    useEffect(() => {
        dispatch(getEvents());
    }, [])
    
    function handleFilter(e : any) {
        const filter = e.target.getAttribute("data-type");
        switch (filter) {
            case "all":
                setFilteredEvents(events);
                break;
            case "concert":
                setFilteredEvents(events ? events.filter(ele => ele.eventCategory === "concert") : null);
                break;
            case "theatre":
                setFilteredEvents(events ? events.filter(ele => ele.eventCategory === "theatre") : null);
                break;
            case "sport":
                setFilteredEvents(events ? events.filter(ele => ele.eventCategory === "sport") : null);
                break;
            default:
                break;
        }
    }
    return (
        <>
        <Header />
        <div className="homepage">
            <img src={splash1}></img>
            <SearchBar />
        </div>
        <button data-type="all" onClick={(e) => handleFilter(e)}>All events</button>
        <button data-type="concert" onClick={(e) => handleFilter(e)}>Concerts</button>
        <button data-type="theatre" onClick={(e) => handleFilter(e)}>Theatre</button>
        <button data-type="sport" onClick={(e) => handleFilter(e)}>Sports</button>
        <div>
            {filteredEvents && filteredEvents.map(event => (
                <EventCard 
                id={event._id}
                imageUrl={event.eventImageURL} 
                name={event.eventTitle}
                location={event.eventLocation}
                time={event.eventTime}
                />
            ))}
        </div>
        </>
    );
}

export default Homepage;