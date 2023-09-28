import './EventHomepage.css'
import Header from "./../../SplashPage/Header/Header";
import TicketListing from "./../TicketListing/TicketListing";
import VenueMap from "./../EventMap/VenueMap";

function EventHomepage() {

    return (
        <div className="event-page">
            <Header />
            <div className="event-main">
                <TicketListing/>
                <VenueMap/>
            </div> 
        </div>
    );
}

export default EventHomepage;