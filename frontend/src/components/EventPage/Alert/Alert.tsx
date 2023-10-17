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
        setVisible(false);
    }

    return (
        <div className="confirmation-panel relative z-10">
                <div onClick={() => setVisible(false)}>X</div>
                <div className="mini-venue-map-container">
                    <svg className="mini-venue-map" stroke="red" fill="grey">
                        {venueData?.map(section => (
                            <>
                            <path data-section={section.id} data-selected="false" d={section.svg} transform='scale(0.2, 0.2)'></path>
                            </>
                        ))}
                    </svg>
                </div>
                <div className='ml-5'>
                    <div className="text-large font-bold mt-5">Section {section}, Row {row}</div>
                    <div className="text-green-700 font-bold">${price} each</div>
                    <div>{quantity} left</div>
                    <div>{description}</div>
                </div>
                <div className='flex space-x-2 mt-5 ml-5'>
                    <button className='text-gray-700 bg-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center'>
                        {quantity} {quantity > 1 ? "Tickets" : "Ticket"}
                    </button>
                    <button onClick={() => setAlertVisible(!alertVisible)}
                    className='text-blue-700 bg-white hover:bg-slate-100 focus:ring focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center'>
                        Create Alert
                    </button>
                    <button onClick={() => window.open(generateLink(), "_blank")}
                    className='text-white bg-blue-700 hover:bg-blue-800 focus:ring focus:ring-white-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3'>
                        Buy Now
                    </button>
                </div>
                <div className="relative flex py-5 items-center z-40">
                    <div className="flex-grow border-t border-gray-400 z-40"></div>
                </div>
                <div className="ml-5">
                    {alertVisible && (
                        <>
                        <div className="text-large font-bold mt-5">Your Section: Section {section}</div>
                        <div className="mt-2">Your Price: 
                            <input onChange={(e : any) => setThresholdPrice(e.target.value)}
                            className="bg-gray-100"></input>
                        </div>
                        <button onClick={handleSetAlert}
                        className='mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring focus:ring-white-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3'>
                            Confirm
                        </button>
                        </>
                    )}
                </div>
            </div>
    )
}

export default Alert;