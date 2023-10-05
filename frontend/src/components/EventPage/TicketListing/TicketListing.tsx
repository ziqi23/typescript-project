import './TicketListing.css';
import TicketListingCard from "./TicketListingCard";
import { getTicket } from "../../../store/ticket";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import PricingGraph from './PricingGraph';

type ParsedTicket = {
    id: string,
    eventId: string,
    section: string,
    row: string,
    price: number,
    quantity: number,
    description: string
}

function TicketListing() {
    const dispatch = useAppDispatch();
    const events = useAppSelector(state => state.event.data); // Pull event data
    const selectedSections = useAppSelector(state => state.selectedSection.data); // Pull current section data
    const allTickets = useAppSelector(state => state.ticket.data) // Pull ticket data

    // Find event relevant to the current page
    const { id } = useParams<{id : string}>();
    const currentEvent = events ? events.filter(event => event._id === id)[0] : null;

    // Track tickets to be displayed (reflects user selected filters)
    const [displayedTickets, setDisplayedTickets] = useState<ParsedTicket[] | null>([]);
    const [minPrice, setMinPrice] = useState(-Infinity);
    const [maxPrice, setMaxPrice] = useState(Infinity);
    const [quantity, setQuantity] = useState(1);
    const [pricePanelVisible, setPricePanelVisible] = useState(false);
    const [quantityPanelVisible, setQuantityPanelVisible] = useState(false);

    // Fetch ticket data upon mounting
    useEffect(() => {
        if (currentEvent?.tickpickURL) {
            dispatch(getTicket(currentEvent.tickpickURL));
        }
    }, [])

    // Filter to handle => price, quantity, sections
    useEffect(() => {
        let ticketsToDisplay : ParsedTicket[] = [];

        // Handle section filter
        if (allTickets && selectedSections.length === 0) {
            ticketsToDisplay = allTickets;
        }
        else {
            allTickets?.forEach(ticket => {
                if (selectedSections.includes(ticket.section)) {
                    ticketsToDisplay.push(ticket);
                }
            })
        }
    
        // Handle price filter
        ticketsToDisplay = ticketsToDisplay.filter(ticket => ticket.price >= minPrice);
        ticketsToDisplay = ticketsToDisplay.filter(ticket => ticket.price <= maxPrice);

        // Handle quantity filter
        ticketsToDisplay = ticketsToDisplay.filter(ticket => {
            console.log(ticket.quantity, quantity, ticket.quantity >= quantity)
            return ticket.quantity >= quantity
        });

        setDisplayedTickets(ticketsToDisplay);
    }, [selectedSections, minPrice, maxPrice, quantity])
    
    function handleMinPrice(e : ChangeEvent) {
        let minPrice = parseInt((e.target as HTMLInputElement).value);
        if (isNaN(minPrice)) {
            minPrice = -Infinity;
        }
        setMinPrice(minPrice);
    }
    
    function handleMaxPrice(e : ChangeEvent) {
        let maxPrice = parseInt((e.target as HTMLInputElement).value);
        if (isNaN(maxPrice)) {
            maxPrice = Infinity;
        }
        setMaxPrice(maxPrice);
    }

    function handleSortTickets(e : any) {
        console.log(e.target.classList)
        if (e.target.classList.contains('bg-gray-300')) {
            e.target.classList.remove('bg-gray-300');
        }
        else {
            e.target.classList.add('bg-gray-300');
            let ticketsToDisplay = displayedTickets ? displayedTickets.sort((a, b) => a.price - b.price) : [];
            setDisplayedTickets(ticketsToDisplay);
        }
    }

    function handleSetQuantity(e : any) {
        setQuantity(parseInt(e.target.innerHTML));
    }

    return (
        <div className='ticket-listing-container relative z-10'>
            <PricingGraph />
            <div className="sticky top-0 filters mt-5 mx-3 bg-gray-100">
                <button type="button" onClick={() => setPricePanelVisible(!pricePanelVisible)} className="bg-transparent text-black font-semibold border border-gray-500 hover:border-black rounded-full py-2 px-4 mr-3">Price</button>
                <button type="button" onClick={() => setQuantityPanelVisible(!quantityPanelVisible)} className="bg-transparent text-black font-semibold border border-gray-500 hover:border-black rounded-full py-2 px-4 mr-3">Quantity</button>
                <button type="button" onClick={e => handleSortTickets(e)} className="bg-transparent text-black font-semibold border border-gray-500 hover:border-black rounded-full py-2 px-4 mr-3">Lowest Price First</button>
            </div>
            {pricePanelVisible && (
                <div className='flex bg-gray-100 items-center'>
                    <div className='rounded-full py-2 px-4'>
                        $<input className="user-price-input px-1" onChange={handleMinPrice}></input>
                    </div>
                    to 
                    <div className='rounded-full py-2 px-4'>
                        $<input className="user-price-input px-1" onChange={handleMaxPrice}></input>
                    </div>
                </div>
            )}
            {quantityPanelVisible && (
                <div className='flex items-center'>
                    <div className='flex items-center justify-content py-2 px-4'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(ele => (
                            <div onClick={(e) => handleSetQuantity(e)} className='bg-gray-300 hover:bg-gray-500 mr-3 rounded py-2 px-2 border-solid border-sky-500'>{`${ele}`}</div>
                        ))}
                    </div>
                </div>
            )}
            <div className='relative z-30'>
                {displayedTickets?.map(ticket => (
                    <TicketListingCard {...ticket}/>
                ))}
            </div>
        </div>
    )
}

export default TicketListing;