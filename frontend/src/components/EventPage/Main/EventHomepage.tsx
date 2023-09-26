import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { add, remove } from '../../../store/selectedSection';
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import './EventHomepage.css'
import Header from "./../../SplashPage/Header/Header";
import TicketListing from "./../TicketListing/TicketListing";
import VenueMap from "./../EventMap/VenueMap";

function EventHomepage() {
    // Should take in an event ID, fetch database for relevant URLs, then call API for event data
    const { id } = useParams<{id : string}>();
    const events = useAppSelector(state => state.event.data);
    const currentEvent = events ? events.filter(event => event._id === id)[0] : null;
    const selectedSections = useAppSelector(state => state.selectedSection.data);
    const dispatch = useAppDispatch();

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
            // if (selectedSections[section]) {
            //     selectedSections.delete(section);
            // }
            // else {
            //     selectedSections[section];
            // }
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
    
    return (
        <div className="event-page">
            <Header />
            <div className="event-main">
            <TicketListing url={currentEvent?.tickpickURL}/>
            <VenueMap url={currentEvent?.stadiumURL}/>
            </div> 
        </div>
    );
}

export default EventHomepage;