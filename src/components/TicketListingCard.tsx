import './TicketListingCard.css'

type ParsedTicket = {
    id: string,
    section: string,
    row: string,
    price: number,
    quantity: number,
    description: string
}

function TicketListingCard({section, price, row, quantity, description} : ParsedTicket) {
    function handleMouseEnter() {
        const mouseHoverSection = document.querySelector(`[data-section="${section}"]`);
        mouseHoverSection?.setAttribute('fill', 'green');
    }

    function handleMouseLeave() {
        const mouseHoverSection = document.querySelector(`[data-section="${section}"]`);
        mouseHoverSection?.setAttribute('fill', 'gray');
    }

    return (
        <div className="card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div>Section {section}</div>
            <div>Row {row}</div>
            <div>${price}</div>
            <div>{quantity} left</div>
            <div>{description}</div>
        </div>
    );
}

export default TicketListingCard;