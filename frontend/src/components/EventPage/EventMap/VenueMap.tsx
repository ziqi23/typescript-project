import './VenueMap.css'
import { add, remove } from '../../../store/selectedSection';
import { getStadium } from "../../../store/stadium";
import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../../store/hooks";

type Venue = {
    url: string | undefined
}
function VenueMap(data : Venue) {
    const [zoom, setZoom] = useState(1);
    const mapElement = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const venueData = useAppSelector(state => state.stadium.data);

    useEffect(() => {
        if (data.url) {
            dispatch(getStadium(data.url));
        }
    }, [])

    useEffect(() => {
        function handleWheel(e : WheelEvent) {
            if (e.deltaY > 0) {
                setZoom(zoom => zoom * 0.99);
            }
            else {
                setZoom(zoom => zoom * 1.01);
            }
        }

        window.addEventListener('wheel', handleWheel);
        // return mapElement?.current?.removeEventListener('scroll', handleScroll);

    }, [mapElement.current])

    // Use section # data to also create tooltip of row x - y
    if (venueData) {
        return (
            <div className="venue-map-container" ref={mapElement}>
                <svg className="venue-map" width="1000" height="1000" stroke="red" fill="grey" transform={`scale(${zoom} ${zoom})`}>
                    {venueData.map(section => (
                        <>
                        <path data-section={section.id} data-selected="false" d={section.svg}></path>
                        <text x={section.textX - 25} y={section.textY - 25} stroke='#000000'>{section.id}</text>
                        </>
                    ))}
                </svg>
                <button onClick={() => {setZoom(zoom * 1.1)}}>Zoom In</button>
                <button onClick={() => {setZoom(1)}}>Reset</button>
                <button onClick={() => {setZoom(zoom * 0.9)}}>Zoom Out</button>
            </div>
        )
    }
    else {
        return null;
    }
}

export default VenueMap;