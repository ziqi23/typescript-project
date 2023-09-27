import {AiOutlineSearch } from "react-icons/ai"
import './SearchBar.css'
import { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { Link } from "react-router-dom";

type Event = {
    _id : string,
    tickpickURL : string,
    stadiumURL : string,
    eventCategory : string,
    eventTitle : string,
    eventImageURL : string,
    eventLocation : string,
    eventTime : string
}

type SearchResults = {
    foundInTitle : Event[],
    foundInVenue : Event[],
}

function SearchBar() {
    const emptySearchResults : SearchResults = {
        foundInTitle: [],
        foundInVenue: [],
    }
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(emptySearchResults);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const events = useAppSelector(state => state.event.data);

    useEffect(() => {
        
        let newSearchResults = emptySearchResults;
        let resultCount = 0;
        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i');
            events?.forEach(event => {
                if (event.eventTitle.search(regex) !== -1) {
                    newSearchResults = {...newSearchResults, foundInTitle: [...newSearchResults.foundInTitle, event]};
                    resultCount++;
                }
                if (event.eventLocation.search(regex) !== -1) {
                    newSearchResults = {...newSearchResults, foundInVenue: [...newSearchResults.foundInVenue, event]};
                    resultCount++;
                }
            })
        }
        setSearchResults(newSearchResults);
        setNumberOfResults(resultCount);
    }, [events, searchQuery])

    function handleChange(e : any) {
        setSearchQuery(e.target.value);
    }

    return (
        <>
            <form className="search-form">
                <input type="text" placeholder="Search an event" onChange={(e) => handleChange(e)}></input>
                <button type="submit"><AiOutlineSearch /></button>
            </form>
            {numberOfResults && (
                <div className="search-results">
                    <div>
                        <p className="text-lg font-bold">Performers</p>
                        <ul>
                            {searchResults.foundInTitle.map((ele) => (
                                <Link to={`/${ele._id}`}>
                                    <p className="individual-search-result">{ele.eventTitle}</p>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-lg font-bold">Venues</p>
                        <ul>
                            {searchResults.foundInVenue.map((ele) => (
                                <Link to={`/${ele._id}`}>
                                    <p className="individual-search-result">{ele.eventLocation}</p>
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-lg font-bold">Show All</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default SearchBar