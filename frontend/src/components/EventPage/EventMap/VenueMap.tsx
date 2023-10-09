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
    const events = useAppSelector(state => state.event.data);
    const currentEvent = events ? events.filter(event => event._id === id)[0] : null;
    const selectedSections = useAppSelector(state => state.selectedSection.data);
    const tickets = useAppSelector(state => state.ticket.data);
    const [zoom, setZoom] = useState(1);
    const mapElement = useRef<HTMLDivElement>(null);
    const venueData = useAppSelector(state => state.stadium.data);
    const [hoveredSection, setHoveredSection] = useState<ParsedSection | null>(null);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    // const [initialX, setInitialX] = useState(0);
    // const [initialY, setInitialY] = useState(0);
    const [scale, setScale] = useState(1);

    // handle drag
    let initialX = 0, initialY = 0;
    function handleMouseDown(e : any) {
        initialX = e.clientX;
        initialY = e.clientY;
        if (e.target.getAttribute('listener') !== 'true') {
            e.currentTarget.addEventListener('mousemove', handleMouseMove);
            e.currentTarget.setAttribute('listener', 'true');
        }
        console.log("down", initialX, initialY)
    }

    const handleMouseMove = useCallback((e : any) => {
        console.log("move", e, initialX, initialY)
        setOffsetX(e.clientX - initialX);
        setOffsetY(e.clientY - initialY)
    },[]);

    function handleMouseUp(e : any) {
        console.log("up", e.currentTarget)
        e.currentTarget.removeEventListener('mousemove', handleMouseMove);
        e.currentTarget.setAttribute('listener', 'false');
    }
    // add color based on availability

    // update tooltip

    // add padding

    // style buttons, dynamic sizing
    window.addEventListener('resize', handleResize)

    function handleResize() {
        console.log(mapElement.current?.getBoundingClientRect())
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
            setScale(Math.min(height / maxY - 0.2, width / maxX - 0.2));
        }
        // find min and max coords, compare to bounding box and calculate scaling variable.
    }

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
            // else {
            //     section.setAttribute("fill", "gray")
            // }
        })
    }, [selectedSections])



    useEffect(() => {
        if (currentEvent?.stadiumURL) {
            dispatch(getStadium(currentEvent.stadiumURL));
        }
    }, [])

    // useEffect(() => {
    //     function handleWheel(e : WheelEvent) {
    //         if (e.deltaY > 0) {
    //             setZoom(zoom => zoom * 0.99);
    //         }
    //         else {
    //             setZoom(zoom => zoom * 1.01);
    //         }
    //     }

    //     window.addEventListener('wheel', handleWheel);
    //     // return mapElement?.current?.removeEventListener('scroll', handleScroll);

    // }, [mapElement.current])

    function handleMouseOver(e : any) {
        const sectionId = e.target.getAttribute('data-section');
        const sectionData = venueData ? venueData.filter(section => section.id === sectionId)[0] : null;
        setHoveredSection(sectionData);
    }

    // Use section # data to also create tooltip of row x - y
    if (venueData) {
        return (
            <div className="venue-map-container relative" ref={mapElement}>
                {hoveredSection && (
                    <div className='absolute bg-black text-white'>
                        Section {hoveredSection.id}, 
                        Row {hoveredSection.rows ? hoveredSection.rows[0] : null}
                        to {hoveredSection.rows ? hoveredSection.rows[hoveredSection.rows.length - 1] : null}
                    </div>
                )}
                <svg className="venue-map" transform={`scale(${zoom} ${zoom})`} onMouseDown={(e) => handleMouseDown(e)} onMouseUp={(e) => handleMouseUp(e)}>
                    {venueData.map(section => {
                        if (tickets?.some(ticket => ticket.section === section.id)) {
                            return (
                                <>
                                <path transform={`translate(${offsetX}, ${offsetY}) scale(${scale} ${scale})`} fill="green" data-section={section.id} data-selected="false" d={section.svg} onMouseOver={handleMouseOver} onMouseLeave={() => setHoveredSection(null)}></path>
                                <text transform={`translate(${offsetX}, ${offsetY}) scale(${scale} ${scale})`} pointerEvents="none" x={section.textX - 10} y={section.textY} stroke='#000000'>{section.id}</text>
                                </>
                            )
                        }
                        else {
                            return (
                                <>
                                <path transform={`translate(${offsetX}, ${offsetY}) scale(${scale} ${scale})`} fill="gray" data-section={section.id} data-selected="false" d={section.svg} onMouseOver={handleMouseOver} onMouseLeave={() => setHoveredSection(null)}></path>
                                <text transform={`translate(${offsetX}, ${offsetY}) scale(${scale} ${scale})`} pointerEvents="none" x={section.textX - 10} y={section.textY} stroke='#000000'>{section.id}</text>
                                </>
                            )
                        }

                    })}
                </svg>
                <div className='map-functional-buttons'>
                    <button onClick={() => {setZoom(zoom * 1.1)}}><AiOutlinePlus /></button>
                    <button onClick={() => {setZoom(1)}}><GrPowerReset /></button>
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