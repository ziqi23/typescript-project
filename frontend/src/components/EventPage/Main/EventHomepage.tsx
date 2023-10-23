import './EventHomepage.css'
import Header from "./../../SplashPage/Header/Header";
import TicketListing from "./../TicketListing/TicketListing";
import VenueMap from "./../EventMap/VenueMap";

function EventHomepage() {

    return (
        <div className="event-page">
            <Header fill="bg-gray-900"/>
            <div className="event-main">
                <TicketListing/>
                <VenueMap/>
            </div> 
        </div>
    );
}

export default EventHomepage;