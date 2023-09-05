import './TicketListing.css';
import TicketListingCard from "./TicketListingCard";
import { getTicket } from "../store/ticket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";

function TicketListing() {
    type ParsedTicket = {
        id: string,
        section: string,
        row: string,
        price: number,
        quantity: number,
        description: string
    }

    const selectedSections = useAppSelector(state => state.selectedSection.data);
    const allTickets = useAppSelector(state => state.ticket.data)
    const [displayedTickets, setDisplayedTickets] = useState<ParsedTicket[] | null>([]);
    const dispatch = useAppDispatch();
    const tmpUrl = "https://api.tickpick.com/1.0/listings/internal/event/5555490?trackView=true&lid=5555490";

    useEffect(() => {
        dispatch(getTicket(tmpUrl));
        if (selectedSections.length === 0) {
            setDisplayedTickets(allTickets)
        }
        else {
            // only display tickets that are of selected sections
            let ticketsToDisplay : ParsedTicket[] = [];
            allTickets?.forEach(ticket => {
                if (selectedSections.includes(ticket.section)) {
                    ticketsToDisplay.push(ticket);
                }
            })
            setDisplayedTickets(ticketsToDisplay);
        }
    }, [allTickets, selectedSections])
    
    return (
        <div className='ticket-container'>
            <div className="filters">
                <button>Lowest Price First</button>
                <button>Select Quantity</button>
                <button>Filter by description</button>
            </div>
            <div>
                {displayedTickets?.map(ticket => (
                    <TicketListingCard {...ticket}/>
                ))}
            </div>
        </div>
    )
}

export default TicketListing;