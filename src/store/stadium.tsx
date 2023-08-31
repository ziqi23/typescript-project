import { Dispatch } from 'redux';

type Section = {
    id : string,
    rows?: string[],
    svg_path : string,
    star_rating : number
}

type parsedSection = {
    id : string,
    rows? : number[],
    svg: string,
    rating: number
}

// Define types of actions handled by reducer
enum ActionType {
    getEvent = "GETSTADIUM"
}

// Define the action type
type Action = {
    type: string,
    payload?: object
}

const getStadium = (data : parsedSection[]) => (
    {
        "type": ActionType.getEvent,
        "payload": data
    }
)

export const showStadium = (stadiumUrl : string) => async (dispatch : Dispatch) => {
    const res = await fetch(stadiumUrl);
    const data = await res.json();
    let parsedStadiumData : parsedSection[] = [];
    // also need row x thru y;
    // personal twist to data: 1) split into halves 
    data.sections.forEach((section : Section) => {
        let formattedRows = section.rows ? section.rows.map(ele => parseInt(ele)) : [];
        parsedStadiumData.push({ id: section.id, svg: section.svg_path, rating: section.star_rating, rows: formattedRows })
    })
    dispatch(getStadium(parsedStadiumData));
}

const initialState = {};

const stadiumReducer = (state=initialState, action : Action) => {
    switch (action.type) {
        case ActionType.getEvent:
            return action.payload;
        default:
            return {};
    }
}

export default stadiumReducer;