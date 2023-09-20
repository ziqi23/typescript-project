import "./Homepage.css"
import EventCard from "./../Events/EventCard";
import Header from "./../Header/Header";
import splash1 from "../../../assets/splash1.jpg";
import splash2 from "../../..//splash2.jpg";
import splash3 from "../../../assets/splash3.jpg";
import splash4 from "../../../assets/splash4.jpg";
import SearchBar from "./SearchBar";

type EventDetails = {
    imageUrl : string,
    name: string,
    location : string,
    time : string
}

function Homepage() {
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