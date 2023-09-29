import './VenueMap.css'
import { add, remove } from '../../../store/selectedSection';
import { getStadium } from "../../../store/stadium";
import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { useParams } from 'react-router-dom';

type ParsedSection = {
    id : string,
    rows? : number[],
    svg: string,
    rating: number,
    textX: number,
    textY: number 
}

function VenueMap() {
    const dispatch = useAppDispatch();
    const { id } = useParams<{id : string}>();
    const events = useAppSelector(state => state.event.data);
    const currentEvent = events ? events.filter(event => event._id === id)[0] : null;
    const selectedSections = useAppSelector(state => state.selectedSection.data);

    window.addEventListener('click', handleClick);

    function handleClick(e : any) {
        if (e.target.getAttribute('data-section')) {
            let section : string = e.target.getAttribute('data-section')
            if (!selectedSections.includes(section)) {
                dispatch(add(section));
            }
            else {
                dispatch(remove(section));
            }
        }
    }

    useEffect(() => {
        document.querySelectorAll("[data-section]").forEach(section => {
            let a = section.getAttribute("data-section")
            if (a && selectedSections.includes(a)) { // if section has been selected, highlight in different color
                section.setAttribute("fill", "blue");
            }
            else {
                section.setAttribute("fill", "gray")
            }
        })
    }, [selectedSections])

    const [zoom, setZoom] = useState(1);
    const mapElement = useRef<HTMLDivElement>(null);
    const venueData = useAppSelector(state => state.stadium.data);
    const [hoveredSection, setHoveredSection] = useState<ParsedSection | null>(null);

    useEffect(() => {
        if (currentEvent?.stadiumURL) {
            dispatch(getStadium(currentEvent.stadiumURL));
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

    function handleMouseOver(e : any) {
        const sectionId = e.target.getAttribute('data-section');
        const sectionData = venueData ? venueData.filter(section => section.id === sectionId)[0] : null;
        setHoveredSection(sectionData);
    }

    // Use section # data to also create tooltip of row x - y
    if (venueData) {
        return (
            <div className="venue-map-container relatvie" ref={mapElement}>
                {hoveredSection && (
                    <div className='absolute bg-black text-white'>
                        Section {hoveredSection.id}, 
                        Row {hoveredSection.rows ? hoveredSection.rows[0] : null}
                        to {hoveredSection.rows ? hoveredSection.rows[hoveredSection.rows.length - 1] : null}
                    </div>
                )}
                <svg className="venue-map" stroke="red" fill="grey" transform={`scale(${zoom} ${zoom})`}>
                    {venueData.map(section => (
                        <>
                        <path transform="scale(0.5 0.5)" data-section={section.id} data-selected="false" d={section.svg} onMouseOver={handleMouseOver} onMouseLeave={() => setHoveredSection(null)}></path>
                        {/* <text x={section.textX} y={section.textY} stroke='#000000'>{section.id}</text> */}
                        </>
                    ))}
                </svg>
                <button className="absolute top-0 right-40" onClick={() => {setZoom(zoom * 1.1)}}>Zoom In</button>
                <button className="absolute top-0 right-20" onClick={() => {setZoom(1)}}>Reset</button>
                <button className="absolute top-0 right-0" onClick={() => {setZoom(zoom * 0.9)}}>Zoom Out</button>
            </div>
        )
    }
    else {
        return null;
    }
}

export default VenueMap;