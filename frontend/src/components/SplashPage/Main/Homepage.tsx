import "./Homepage.css"
import EventCard from "./../Events/EventCard";
import Header from "./../Header/Header";
import homepage from "../../../assets/homepage.jpg";
import splash1 from "../../../assets/splash1.jpg";
import splash2 from "../../../assets/splash2.jpg";
import splash3 from "../../../assets/splash3.jpg";
import splash4 from "../../../assets/splash4.jpg";
import SearchBar from "./SearchBar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getEvents } from "../../../store/event";
import { useEffect, useState } from "react";
import Footer from "../Footer/footer";
import { reset } from "../../../store/selectedSection";
import Line from "../../Utils/Line";
import { Link } from "react-router-dom";

type UserLocation = {
    city: string,
    region: string
}
// need a city search api, carassouel package, background photo
function Homepage() {
    const dispatch = useAppDispatch();
    const events = useAppSelector(state => state.event.data);
    const [featuredEvents, setFeaturedEvents] = useState(events);
    const [sportEvents, setSportEvents] = useState(events);
    const [concertEvents, setConcertEvents] = useState(events);
    const [showEvents, setShowEvents] = useState(events);
    const [userIP, setUserIP] = useState('');
    const [userGeolocation, setUserGeolocation] = useState<number[]>([]);
    const [userLocation, setUserLocation] = useState<UserLocation>({city: "San Francisco", region: "CA"});

    useEffect(() => {
        dispatch(getEvents()); // Fetch all events from database
        dispatch(reset());
        fetch("https://api.ipify.org")
            .then(res => res.text())
            .then(ip => setUserIP(ip))
    }, [])

    useEffect(() => {
        fetch(`http://ip-api.com/json/${userIP}`)
            .then(res => res.json())
            .then(locationData => {
                setUserLocation(locationData); 
                setUserGeolocation([locationData.lat, locationData.lon]);
            })
            .catch(error => setUserLocation({city: "San Francisco", region: "CA"}))
    }, [userIP])
    
    useEffect(() => {
        if (events) {
            setFeaturedEvents(events.slice(0, 4));
            setSportEvents(events.filter(event => event.eventCategory === "sport"));
            setConcertEvents(events.filter(event => event.eventCategory === "concert"));
            setShowEvents(events.filter(event => event.eventCategory === "show"));
        }
    }, [events])
    console.log(events, featuredEvents)
    // function handleFilter(e : any) { // Locally filter all events for specific criteria to display
    //     const filter = e.target.getAttribute("data-type");
    //     switch (filter) {
    //         case "all":
    //             setFilteredEvents(events);
    //             break;
    //         case "concert":
    //             setFilteredEvents(events ? events.filter(ele => ele.eventCategory === "concert") : null);
    //             break;
    //         case "theatre":
    //             setFilteredEvents(events ? events.filter(ele => ele.eventCategory === "theatre") : null);
    //             break;
    //         case "sport":
    //             setFilteredEvents(events ? events.filter(ele => ele.eventCategory === "sport") : null);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    function handleChangeLocation() {

    }
    return (
        <>
        <Header fill=""/>
        <div className="homepage-image-holder">
            <img src={homepage} className="absolute object-center"></img>
        </div>
        <div className="homepage-main max-width-screen-xl">
            <SearchBar />
        </div>
        <div className="homepage-featured-events relative z-20">
            <p className="text-xl font-bold ml-5 mb-5 text-white">Featured Events</p>
            <div className="flex">
                {featuredEvents && featuredEvents.length && featuredEvents.map(event => (
                    <EventCard 
                    id={event._id}
                    imageUrl={event.eventImageURL} 
                    name={event.eventTitle}
                    location={event.eventLocation}
                    time={event.eventTime}
                    />
                ))}
            </div>
        </div>
        <div className="mx-8">
            <p className="text-xl font-bold mb-2 ml-5 text-gray-900">Browse Events</p>
            <p className="text-4xl font-bold mb-5 ml-5 text-black">
                {`${userLocation.city}, ${userLocation.region}`}
            </p>
            <button type="button" onClick={() => handleChangeLocation()} className="bg-transparent text-black font-semibold border border-gray-500 hover:border-black rounded-full py-2 px-4 ml-5 mb-5">
                    Change Location
            </button>
        </div>
        <Line />
        <div className="homepage-event-filters relative z-20">
            <p className="text-xl font-bold mb-5 ml-5">Categories</p>
            <Link to="/sports">
                <button data-type="sport" className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 ml-5 rounded">Sports</button>
            </Link>
            <Link to="/concerts">
                <button data-type="concert" className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 ml-5 rounded">Concerts</button>
            </Link>
            <Link to="/shows">
                <button data-type="theatre" className="bg-transparent hover:bg-gray-100 outline text-black font-medium py-2 px-4 mr-5 ml-5 rounded">Shows</button>
            </Link>
        </div>
        <div className="homepage-featured-events">
            <p className="text-xl font-bold mb-5">Sports</p>
            <div className="flex">
                {sportEvents && sportEvents.length && sportEvents.map(event => (
                    <EventCard 
                    id={event._id}
                    imageUrl={event.eventImageURL} 
                    name={event.eventTitle}
                    location={event.eventLocation}
                    time={event.eventTime}
                    />
                ))}
            </div>
            <p className="text-xl font-bold mb-5">Concerts</p>
            <div className="flex">
                {concertEvents && concertEvents.length && concertEvents.map(event => (
                    <EventCard 
                    id={event._id}
                    imageUrl={event.eventImageURL} 
                    name={event.eventTitle}
                    location={event.eventLocation}
                    time={event.eventTime}
                    />
                ))}
            </div>
            <p className="text-xl font-bold mb-5">Shows</p>
            <div className="flex">
                {showEvents && showEvents.length && showEvents.map(event => (
                    <EventCard 
                    id={event._id}
                    imageUrl={event.eventImageURL} 
                    name={event.eventTitle}
                    location={event.eventLocation}
                    time={event.eventTime}
                    />
                ))}
            </div>
        </div>
        <div className="mt-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100"></div>
        <Footer />
        </>
    );
}

export default Homepage;