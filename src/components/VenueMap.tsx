import { showStadium } from "../store/stadium";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { AppDispatch } from "..";

function VenueMap() {
    const useAppDispatch: () => AppDispatch = useDispatch;
    const dispatch = useAppDispatch();
    let tmpStr = "https://api.tickpick.com/1.0/venues/chart/v2?venueId=LEVISSTADIUM_BEY2";
    useEffect(() => {
        dispatch(showStadium(tmpStr));
    }, [])
    return null;
}

export default VenueMap;