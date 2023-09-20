import {AiOutlineSearch } from "react-icons/ai"
import './SearchBar.css'

function SearchBar() {
    return (
        <>
            <form className="search-form">
                <input type="text" placeholder="Search an event"></input>
                <button type="submit"><AiOutlineSearch /></button>
            </form>
        </>
    );
}

export default SearchBar