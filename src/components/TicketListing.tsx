import './TicketListing.css';
import TicketListingCard from "./TicketListingCard";
import { getTicket } from "../store/ticket";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ChangeEvent, useEffect, useState } from "react";

function TicketListing() {
    type ParsedTicket = {
        id: string,
        eventId: string,
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
    }, [])

    useEffect(() => {
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
    }, [selectedSections])
    
    function handleMinPrice(e : ChangeEvent) {
        let minPrice = parseInt((e.target as HTMLInputElement).value);
        let ticketsToDisplay : ParsedTicket[] | null;
        if (displayedTickets) {
            ticketsToDisplay = displayedTickets.filter(ticket => ticket.price >= minPrice);
        } else {
            ticketsToDisplay = null;
        }
        setDisplayedTickets(ticketsToDisplay);
    }
    
    function handleMaxPrice(e : ChangeEvent) {
        let maxPrice = parseInt((e.target as HTMLInputElement).value);
        let ticketsToDisplay : ParsedTicket[] | null;
        if (displayedTickets) {
            ticketsToDisplay = displayedTickets.filter(ticket => ticket.price <= maxPrice);
        } else {
            ticketsToDisplay = null;
        }
        setDisplayedTickets(ticketsToDisplay);
    }

    return (
        <div className='ticket-container'>
            <div className="filters">
                <button>Lowest Price First</button>
                <button>Select Quantity</button>
                <button>Filter by description</button>
            </div>
            <div>Price Range <input onChange={handleMinPrice}></input> to <input onChange={handleMaxPrice}></input></div>
            <div>
                {displayedTickets?.map(ticket => (
                    <TicketListingCard {...ticket}/>
                ))}
            </div>
        </div>
    )
}

export default TicketListing;