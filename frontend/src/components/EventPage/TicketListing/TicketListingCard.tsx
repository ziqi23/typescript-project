import { useEffect, useState } from 'react';
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
    const [flag, setFlag] = useState(false);

    // partial view, side view, obstructed view, partial obstructed view, limited view
    useEffect(() => {
        const constraints = ["partial", "side", "obstructed", "limited"];
        constraints.forEach(constraint => {
            if (description.toLowerCase().includes(constraint)) {
                setFlag(true); // BUG
            }
        })
    }, [selectedSections])

    function handleMouseEnter() {
        const mouseHoverSection = document.querySelector(`[data-section="${section}"]`);
        mouseHoverSection?.setAttribute('stroke', 'black');
    }

    function handleMouseLeave() {
        const mouseHoverSection = document.querySelector(`[data-section="${section}"]`);
        mouseHoverSection?.removeAttribute('stroke');
    }

    return (
        <>
        <div className="ticket-listing-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setConfirmationVisible(!confirmationVisible)}>
            <div className='ticket-pricing'>
                <p className='ticket-pricing-bold'>${price} each, </p><p>all fees included</p>
            </div>
            <div className='ticket-quantity'>{quantity} ticket{quantity > 1 ? "s" : ""}</div>
            <div className='ticket-location'>
                <p>Section {section}, </p><p>Row {row}</p>
            </div>
            <div>{flag ? "Obstructed or Limited View": ""}</div>
        </div>
        {confirmationVisible && (
            <Alert {...{id, eventURLId:eventId, section, price, row, quantity, description, setVisible: setConfirmationVisible}}/>
        )}
        </>
    );
}

export default TicketListingCard;