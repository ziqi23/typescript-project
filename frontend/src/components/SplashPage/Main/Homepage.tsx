import "./Homepage.css"
import EventCard from "./../Events/EventCard";
import Header from "./../Header/Header";
import splash1 from "../../../assets/splash1.jpg";
import splash2 from "../../../assets/splash2.jpg";
import splash3 from "../../../assets/splash3.jpg";
import splash4 from "../../../assets/splash4.jpg";
import SearchBar from "./SearchBar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getEvents } from "../../../store/event";
import { useEffect, useState } from "react";
import Footer from "../Footer/footer";

function Homepage() {
    const dispatch = useAppDispatch();
    const events = useAppSelector(state => state.event.data);
    const [filteredEvents, setFilteredEvents] = useState(events);
    
    useEffect(() => {
        dispatch(getEvents()); // Fetch all events from database
    }, [])
    
    function handleFilter(e : any) { // Locally filter all events for specific criteria to display
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
        <div className="homepage-main max-width-screen-xl h-96">
            <img src={splash1} className="h-full w-full"></img>
            <SearchBar />
        </div>
        <div className="homepage-event-filters">
            <p className="text-xl font-bold mb-5">Categories</p>
            <button data-type="all" onClick={(e) => handleFilter(e)} className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 rounded">All events</button>
            <button data-type="concert" onClick={(e) => handleFilter(e)} className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 rounded">Concerts</button>
            <button data-type="theatre" onClick={(e) => handleFilter(e)} className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 rounded">Theatre</button>
            <button data-type="sport" onClick={(e) => handleFilter(e)} className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 rounded">Sports</button>
        </div>
        <div className="homepage-featured-events">
            <p className="text-xl font-bold mb-5">Featured Events</p>
            <div className="flex">
                {filteredEvents && filteredEvents.length && filteredEvents.map(event => (
                    <EventCard 
                    id={event._id}
                    imageUrl={event.eventImageURL} 
                    name={event.eventTitle}
                    location={event.eventLocation}
                    time={event.eventTime}
                    />
                ))}
            </div>
            {filteredEvents && !filteredEvents.length && (
                <p>No events found</p>
            )}
        </div>
        <div className="mt-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100"></div>
        <Footer />
        </>
    );
}

export default Homepage;