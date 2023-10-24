import './VenueMap.css'
import { add, remove } from '../../../store/selectedSection';
import { getStadium } from "../../../store/stadium";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { useParams } from 'react-router-dom';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { GrPowerReset } from 'react-icons/gr'

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
    const mapElement = useRef<HTMLDivElement>(null);
    const events = useAppSelector(state => state.event.data);
    const selectedSections = useAppSelector(state => state.selectedSection.data);
    const tickets = useAppSelector(state => state.ticket.data);
    const venueData = useAppSelector(state => state.stadium.data);
    const currentEvent = events ? events.filter(event => event._id === id)[0] : null;
    const [zoom, setZoom] = useState(1);
    const [hoveredSection, setHoveredSection] = useState<ParsedSection | null>(null);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [initialX, setInitialX] = useState(0);
    const [initialY, setInitialY] = useState(0);
    const [scale, setScale] = useState(1);

    // set initial pointer position on mousedown
    async function handleMouseDown(e : any) {
        setInitialX(e.clientX);
        setInitialY(e.clientY);
    }
    
    // add event handler to listen for mousemove once initial pointer position updated
    useEffect(() => {
        if (initialX && initialY) {
            window.addEventListener('mousemove', handleMouseMove);
        }
    }, [initialX])
    
    // remove event handler on drag release
    function handleMouseUp(e : any) {
        setInitialX(0);
        setInitialY(0);
        window.removeEventListener('mousemove', handleMouseMove);
    }

    // use "useCallback" hook to keep reference to event handler function for proper removal
    const handleMouseMove = useCallback((e : any) => {
        if (initialX && initialY) {
            setOffsetX(e.clientX - initialX);
            setOffsetY(e.clientY - initialY)
        }
    }, [initialX, initialY]);

    // style buttons, dynamic sizing
    window.addEventListener('resize', handleResize)

    // find svg's min and max xy-coords and scale into parent element bounding box
    function handleResize() {
        let maxX = 0;
        let maxY = 0;
        venueData?.forEach(section => {
            maxX = Math.max(maxX, section.textX);
            maxY = Math.max(maxY, section.textY);
        })
        const rect = mapElement.current?.getBoundingClientRect();
        if (rect) {
            const width = rect.width;
            const height = rect.height;
            setScale(Math.min(height / maxY - 0.1, width / maxX - 0.1));
        }
    }

    useEffect(() => {
        handleResize();
    }, [])

    // Handle user clicking on a section of the event map, either add to selected or remove from selected
    window.addEventListener('click', handleClick);

    function handleClick(e : any) {
        if (e.target.getAttribute('data-section')) {
            let section : string = e.target.getAttribute('data-section')
            if (!selectedSections.includes(section) && tickets?.some(ticket => ticket.section === section)) {
                dispatch(add(section));
            }
            else {
                dispatch(remove(section));
            }
        }
    }

    // Highlight sections with available tickets in light green, selected sections in dark green
    useEffect(() => {
        document.querySelectorAll("[data-section]").forEach(element => {
            let section = element.getAttribute("data-section")
            if (tickets?.some(ticket => ticket.section === section)) {
                if (section && selectedSections.includes(section)) {
                    element.setAttribute("fill", "rgb(109, 193, 109)");
                }
                else {
                    element.setAttribute("fill", "rgb(185, 212, 185)");
                } 
            }
        })
    }, [selectedSections])

    // Fetch event stadium data
    useEffect(() => {
        if (currentEvent?.stadiumURL) {
            dispatch(getStadium(currentEvent.stadiumURL));
        }
    }, [currentEvent])

    // Handle tooltip display when mouse hovers over a section
    function handleMouseOver(e : any) {
        const sectionId = e.target.getAttribute('data-section');
        const sectionData = venueData ? venueData.filter(section => section.id === sectionId)[0] : null;
        setHoveredSection(sectionData);
    }

    if (venueData) {
        return (
            <div className="venue-map-container relative" ref={mapElement}>
                {hoveredSection && (
                    <div className='absolute px-3 py-2 font-bold bg-black text-white top-5 rounded-lg'>
                        Section {hoveredSection.id}, 
                        Rows {hoveredSection.rows ? hoveredSection.rows[0] : null}
                        {" to"} {hoveredSection.rows ? hoveredSection.rows[hoveredSection.rows.length - 1] : null}
                    </div>
                )}
                <svg className="venue-map" onMouseDown={(e) => handleMouseDown(e)} onMouseUp={(e) => handleMouseUp(e)}>
                    {venueData.map(section => {
                        if (tickets?.some(ticket => ticket.section === section.id)) {
                            return (
                                <>
                                <path transform={`translate(${offsetX}, ${offsetY}) scale(${scale * zoom} ${scale * zoom})`} fill="rgb(185, 212, 185)" data-section={section.id} data-selected="false" d={section.svg} onMouseOver={handleMouseOver} onMouseLeave={() => setHoveredSection(null)}></path>
                                <text transform={`translate(${offsetX}, ${offsetY}) scale(${scale * zoom} ${scale * zoom})`} pointerEvents="none" x={section.textX - 10} y={section.textY} stroke='#000000'>{section.id}</text>
                                </>
                            )
                        }
                        else {
                            return (
                                <>
                                <path transform={`translate(${offsetX}, ${offsetY}) scale(${scale * zoom} ${scale * zoom})`} fill="gray" data-section={section.id} data-selected="false" d={section.svg} onMouseOver={handleMouseOver} onMouseLeave={() => setHoveredSection(null)}></path>
                                <text transform={`translate(${offsetX}, ${offsetY}) scale(${scale * zoom} ${scale * zoom})`} pointerEvents="none" x={section.textX - 10} y={section.textY} stroke='#000000'>{section.id}</text>
                                </>
                            )
                        }

                    })}
                </svg>
                <div className='map-functional-buttons'>
                    <button onClick={() => {setZoom(zoom * 1.1)}}><AiOutlinePlus /></button>
                    <button onClick={() => {setZoom(1); setOffsetX(0); setOffsetY(0)}}><GrPowerReset /></button>
                    <button onClick={() => {setZoom(zoom * 0.9)}}><AiOutlineMinus /></button>
                </div>
            </div>
        )
    }
    else {
        return null;
    }
}

export default VenueMap;