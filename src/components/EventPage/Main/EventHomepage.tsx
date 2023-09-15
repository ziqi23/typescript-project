import { useState, useEffect } from 'react';
import { add, remove } from '../../../store/selectedSection';
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import './EventHomepage.css'
import Header from "./../../SplashPage/Header/Header";
import TicketListing from "./../TicketListing/TicketListing";
import VenueMap from "./../EventMap/VenueMap";

function EventHomepage() {
    // Should take in an event ID, fetch database for relevant URLs, then call API for event data
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
        <>
        <Header />
        <div className="event-main">
        <TicketListing />
        <VenueMap />
        </div> 
        </>
    );
}

export default EventHomepage;