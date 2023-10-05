import { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import './TicketListingCard.css'
import { Link, useParams } from 'react-router-dom';
import Alert from '../Alert/Alert';

type ParsedTicket = {
    id: string,
    eventId: string,
    section: string,
    row: string,
    price: number,
    quantity: number,
    description: string
}

function TicketListingCard({id, eventId, section, price, row, quantity, description} : ParsedTicket) {
    const venueData = useAppSelector(state => state.stadium.data);
    const selectedSections = useAppSelector(state => state.selectedSection.data);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    
    // function createAlert(desiredSections : Number[], desiredPrice : String) {
    //     const eventId = useParams<{id : string}>();
    //     fetch('/api/alerts', {
    //         method: "POST",
    //         // body: {
    //         //     // userId, 
    //         //     eventId, 
    //         //     desiredSections, 
    //         //     desiredPrice
    //         // }
    //     })
    // }

    function handleMouseEnter() {
        const mouseHoverSection = document.querySelector(`[data-section="${section}"]`);
        mouseHoverSection?.setAttribute('fill', 'green');
    }

    function handleMouseLeave() {
        const mouseHoverSection = document.querySelector(`[data-section="${section}"]`);
        if (selectedSections.includes(section)) {
            mouseHoverSection?.setAttribute('fill', 'blue');
        }
        else {
            mouseHoverSection?.setAttribute('fill', 'gray');
        }
    }

    return (
        <>
        <div className="ticket-listing-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setConfirmationVisible(!confirmationVisible)}>
            <div className='ticket-pricing'>
                <p className='ticket-pricing-bold'>${price} each, </p><p>all fees included</p>
            </div>
            <div className='ticket-quantity'>{quantity} tickets</div>
            <div className='ticket-location'>
                <p>Section {section}, </p><p>Row {row}</p>
            </div>
            <div>{description}</div>
        </div>
        {confirmationVisible && (
            <Alert {...{id, eventId, section, price, row, quantity, description}}/>
        )}
        </>
    );
}

export default TicketListingCard;