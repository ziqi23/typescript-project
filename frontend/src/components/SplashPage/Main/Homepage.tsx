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
import { useEffect } from "react";

type EventDetails = {
    imageUrl : string,
    name: string,
    location : string,
    time : string
}

type Event = {
    _id : string,
    tickpickURL : string,
    stadiumURL : string,
    eventCategory : string,
    eventTitle : string,
    eventImageURL : string,
    eventLocation : string,
    eventTime : string
}

function Homepage() {
    const dispatch = useAppDispatch();
    const events : Event[] | null = useAppSelector(state => state.event.data);
    console.log(events)
    useEffect(() => {
        dispatch(getEvents());
    }, [])

    let placeholderEventDetails : EventDetails = {
        imageUrl: '../assets/beyonce.jpeg',
        name: "Beyonce",
        location: "Levi's Stadium",
        time: "Wed, Aug 30, 7:00 PM"
    }

    return (
        <>
        <Header />
        <div className="homepage">
            <img src={splash1}></img>
            <SearchBar />
        </div>
        {/* {events && events.forEach(event => {
            <h1>1</h1>
        })} */}
        <EventCard 
        imageUrl={placeholderEventDetails.imageUrl} 
        name={placeholderEventDetails.name}
        location={placeholderEventDetails.location}
        time={placeholderEventDetails.time}
        />
        </>
    );
}

export default Homepage;