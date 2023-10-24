import './TicketListing.css';
import TicketListingCard from "./TicketListingCard";
import { getTicket } from "../../../store/ticket";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import PricingGraph from './PricingGraph';
import { GiSettingsKnobs } from 'react-icons/gi'
import Line from '../../Utils/Line';
import { reset } from '../../../store/selectedSection';

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
    const [quantity, setQuantity] = useState(0);
    const [quantityPanelVisible, setQuantityPanelVisible] = useState(false);
    const [filterPanelVisible, setFilterPanelVisible] = useState(false);
    const [availableQuantities, setAvailableQuantities] = useState<number[]>([]);

    // Fetch ticket data upon mounting
    useEffect(() => {
        if (currentEvent?.tickpickURL) {
            dispatch(getTicket(currentEvent.tickpickURL));
        }
    }, [events])

    // Filter to handle => price, quantity, sections
    useEffect(() => {
        let ticketsToDisplay = allTickets;
        if (ticketsToDisplay && allTickets) {
            if (selectedSections.length && quantity) {
                ticketsToDisplay = allTickets?.filter(ticket => (
                    selectedSections.includes(ticket.section) && ticket.quantitySplit.includes(quantity)
                ));
            }
            else if (selectedSections.length) {
                ticketsToDisplay = allTickets?.filter(ticket => (
                    selectedSections.includes(ticket.section)
                ));
            }
            else if (quantity) {
                ticketsToDisplay = allTickets?.filter(ticket => (
                    ticket.quantitySplit.includes(quantity)
                ));
            }
        
            // Handle price filter
            ticketsToDisplay = ticketsToDisplay.filter(ticket => ticket.price >= minPrice);
            ticketsToDisplay = ticketsToDisplay.filter(ticket => ticket.price <= maxPrice);

            // highlight available quantities
            let availability : number[] = [];
            ticketsToDisplay.forEach(ticket => {
                ticket.quantitySplit.forEach(quantity => {
                    if (quantity <= 10 && !availability.includes(quantity)) {
                        availability.push(quantity);
                    }
                })
            })
            setAvailableQuantities(availability);
        }
        setDisplayedTickets(ticketsToDisplay);
    }, [selectedSections, minPrice, maxPrice, quantity])

    console.log(availableQuantities)
    function handleSetQuantity(e : any) {
        if (isNaN(parseInt(e.target.innerHTML))) {
            setQuantity(0);
        }
        else {
            setQuantity(parseInt(e.target.innerHTML));
        }
        setQuantityPanelVisible(false);
    }

    function handleResetFilters() {
        setMinPrice(-Infinity);
        setMaxPrice(Infinity);
        setQuantity(0);
        dispatch(reset());
    }

    return (
        <div className="ticket-listing-container relative z-10">
            <div className="my-5 p-5">
                <p className="text-xl font-bold">{currentEvent?.eventTitle}</p>
                <p className="mt-2 text-base">{currentEvent?.eventTime} · {currentEvent?.eventLocation}</p>
            </div>
            <div className="filters p-5 my-2">
                <div className="filter-logo-container mr-3" onClick={() => setFilterPanelVisible(!filterPanelVisible)}>
                    <GiSettingsKnobs className='filter-logo'/>
                </div>
                <button type="button" onClick={() => setQuantityPanelVisible(!quantityPanelVisible)} className="bg-transparent text-black font-semibold border border-gray-500 hover:border-black rounded-full py-2 px-4 mr-3">
                    {quantity ? `${quantity} Ticket${quantity > 1 ? "s" : ""}`: "Quantity"}
                </button>
                <button type="button" onClick={() => handleResetFilters()} className="bg-transparent text-black font-semibold border border-gray-500 hover:border-black rounded-full py-2 px-4 mr-3">
                    Reset All Filters
                </button>
            </div>
            {quantityPanelVisible && (
                <div className='flex items-center'>
                    <div className='flex items-center justify-content py-2 px-4'>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(ele => {
                            if (availableQuantities.includes(ele)) {
                                return <div onClick={(e) => handleSetQuantity(e)} className='cursor-pointer bg-gray-300 hover:bg-gray-500 mr-3 rounded py-2 px-2 border-solid border-sky-500'>{`${ele}`}</div>
                            }
                            else {
                                return <div className='cursor-pointer bg-gray-900 mr-3 rounded py-2 px-2 border-solid border-sky-500'>{`${ele}`}</div>
                            }
                        })}
                        <div onClick={(e) => handleSetQuantity(e)} className='cursor-pointer bg-gray-300 hover:bg-gray-500 mr-3 rounded py-2 px-2 border-solid border-sky-500'>Any Quantity</div>
                    </div>
                </div>
            )}
            {filterPanelVisible && (
                <PricingGraph quantity={quantity} minPrice={minPrice} maxPrice={maxPrice} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} setFilterPanelVisible={setFilterPanelVisible}/>
            )}
            <Line />
            <div className='z-30'>
                {displayedTickets?.map(ticket => (
                    <TicketListingCard {...ticket}/>
                ))}
            </div>
        </div>
    )
}

export default TicketListing;