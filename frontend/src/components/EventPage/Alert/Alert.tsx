import { useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import './Alert.css';

type ParsedTicket = {
    id: string,
    eventId: string,
    section: string,
    row: string,
    price: number,
    quantity: number,
    description: string
}

function Alert({id, eventId, section, price, row, quantity, description} : ParsedTicket) {
    const venueData = useAppSelector(state => state.stadium.data);
    const [alertVisible, setAlertVisible] = useState(false);

    function generateLink() {
        return `https://www.tickpick.com/checkout?listingId=${id}&quantity=${quantity}&listingType=TP&price=${price}&e=${eventId}&s=${section}`
    }

    return (
        <div className="confirmation-panel relative z-10">
                {/* <div onClick={() => setConfirmationVisible(false)}>X</div> */}
                <div className="mini-venue-map-container">
                    <svg className="mini-venue-map" width="500" height="400" stroke="red" fill="grey">
                        {venueData?.map(section => (
                            <>
                            <path data-section={section.id} data-selected="false" d={section.svg} transform='scale(0.2, 0.2)'></path>
                            </>
                        ))}
                    </svg>
                </div>
                <div>
                    <div>Section {section}</div>
                    <div>Row {row}</div>
                    <div>${price}</div>
                    <div>{quantity} left</div>
                    <div>{description}</div>
                </div>
                <div>
                    <button onClick={() => window.open(generateLink(), "_blank")}>Buy Now</button>
                </div>
                <div>
                    <button onClick={() => setAlertVisible(!alertVisible)}>Set up alert</button>
                    {alertVisible && (
                        <>
                        <div>Your Section: Section {section}</div>
                        <div>Your Price: <input></input></div>
                        </>
                    )}
                </div>
            </div>
    )
}

export default Alert;