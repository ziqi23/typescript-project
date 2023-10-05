import { ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import './Alert.css';
import { useParams } from 'react-router-dom';

type AlertProps = {
    id: string,
    eventURLId: string,
    section: string,
    row: string,
    price: number,
    quantity: number,
    description: string,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function Alert({id, eventURLId, section, row, price, quantity, description, setVisible} : AlertProps) {
    const venueData = useAppSelector(state => state.stadium.data);
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.session.data);
    const [alertVisible, setAlertVisible] = useState(false);
    const [thresholdPrice, setThresholdPrice] = useState(0);
    const event = useParams<{id: string | undefined}>()
    const eventId = event.id;

    function generateLink() {
        return `https://www.tickpick.com/checkout?listingId=${id}&quantity=${quantity}&listingType=TP&price=${price}&e=${eventURLId}&s=${section}`
    }

    function handleSetAlert() {
        console.log(thresholdPrice)
        console.log(section)
        console.log(userId)
        console.log(eventId)
        const body = {
            userId,
            eventId,
            desiredPrice: thresholdPrice,
            desiredSections: [section]
        }
        fetch('/api/alerts', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
    }

    return (
        <div className="confirmation-panel relative z-10">
                <div onClick={() => setVisible(false)}>X</div>
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
                        <div>Your Price: <input onChange={(e : any) => setThresholdPrice(e.target.value)}></input></div>
                        <button onClick={handleSetAlert}>Confirm</button>
                        </>
                    )}
                </div>
            </div>
    )
}

export default Alert;