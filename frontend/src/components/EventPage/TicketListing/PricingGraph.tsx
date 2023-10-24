import './PricingGraph.css'
import * as d3 from "d3";
import { useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

type Data = {
    x: number,
    y: number
}

type GraphProps = {
    quantity: number,
    minPrice: number,
    maxPrice: number,
    setMinPrice: React.Dispatch<React.SetStateAction<number>>,
    setMaxPrice: React.Dispatch<React.SetStateAction<number>>,
    setFilterPanelVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function PricingGraph({quantity, minPrice, maxPrice, setMinPrice, setMaxPrice, setFilterPanelVisible} : GraphProps) {
    const ticketData = useAppSelector(state => state.ticket.data); // Pull ticket data from store
    const selectedSections = useAppSelector(state => state.selectedSection.data); // Pull selected sections from store
    const [leftOffset, setLeftOffset] = useState(0); // Set left offset location on page
    const [rightOffset, setRightOffset] = useState(0); // Set right offset location on page
    const [ticketPriceRange, setTicketPriceRange] = useState([0, 0]); // Track ticket price range
    const [averageTicketPrice, setAverageTicketPrice] = useState(0); // Track ticket average price
    const [totalQuantity, setTotalQuantity] = useState(0); // Track total number of tickets
    const [maxFrequency, setMaxFrequency] = useState(0); // Track ticket max frequency (for y-axis scaling)
    const [dataset, setDataset] = useState<Data[]>([]) // Track formatted ticket data for input into line graph

    useEffect(() => {
        let filteredTicketData;
        if (selectedSections.length && quantity) {
            filteredTicketData = ticketData?.filter(ticket => (
                selectedSections.includes(ticket.section) && ticket.quantitySplit.includes(quantity)
            ));
        }
        else if (selectedSections.length) {
            filteredTicketData = ticketData?.filter(ticket => (
                selectedSections.includes(ticket.section)
            ));
        }
        else if (quantity) {
            filteredTicketData = ticketData?.filter(ticket => (
                ticket.quantitySplit.includes(quantity)
            ));
        }
        else {
            filteredTicketData = ticketData;
        }

        if (filteredTicketData && filteredTicketData.length) {
            // Track local min and max price while iterating through tickets to find global min and max
            let minPrice = filteredTicketData[0].price;
            let maxPrice = filteredTicketData[0].price;
            // Track total price and quantity of all tickets to calculate average price to display
            let totalPrice = 0;
            let totalQuantity = 0;
            for (let data of filteredTicketData) {
                if (data.price > maxPrice) {
                    maxPrice = data.price;
                }
                if (data.price < minPrice) {
                    minPrice = data.price;
                }
                totalPrice += data.price;
                totalQuantity += 1;
            }
            setTicketPriceRange([minPrice, maxPrice]);
            setMinPrice(minPrice);
            setMaxPrice(maxPrice);
            setTotalQuantity(totalQuantity);
            setAverageTicketPrice(Math.ceil(totalPrice / totalQuantity));
            setLeftOffset(0);
            setRightOffset(100);
            (document.querySelector("#left-arrow") as HTMLElement).style.left = "50px";
            (document.querySelector("#right-arrow") as HTMLElement).style.left = "500px";

            // Create map to store {price: frequency} pairs for input into D3
            let prices = new Map<any, any>();       
            let maxFrequency = 0;
            for (let data of filteredTicketData) {
                // Categorize ticket prices into 20 sections (e.g. 0-5% lowest, 5-10% lowest, etc.)
                let price = Math.ceil(data.price / maxPrice * 20);
                // Track frequency for each price range as well as max frequency to scale y-axis appropriately
                prices.set(price, (prices.get(price) || 0) + 1);
                maxFrequency = Math.max(maxFrequency, prices.get(price));
            }
            setMaxFrequency(maxFrequency);

            // Push map information into formatted dataset
            // Close off x === 0 && x === 20 so that the graph fills to the x-axis
            const dataset : Data[] = [{x: 0, y: 0}];
            prices.forEach((val, key) => {
                dataset.push({x: key, y: val});
            })
            dataset.push({x: 20, y: 0})
            setDataset(dataset);
        }
        else {
            setTotalQuantity(0);
        }
    }, [quantity, ticketData, selectedSections])

    // Create D3 line graph
    const svg = d3.select("#svg");
    d3.selectAll("#svg > path").remove();
    const width = 450;
    const height = 200;

    // Scale x-axis and y-axis to width and height of container
    const xScale = d3.scaleLinear().domain([0, 20]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, maxFrequency]).range([height, 0]);

    const line = d3.line<Data>()
        .x(function(d) { return xScale(d["x"]); }) 
        .y(function(d) { return yScale(d["y"]); }) 
        .curve(d3.curveBasis)
        
    svg.append("path")
        .datum(dataset) 
        .attr("class", "line") 
        .attr("transform", "translate(50, 0)")
        .attr("d", line)
        .style("fill", "url(#solids")
        .style("stroke-width", "1");

    // On drag event, update the tickets displayed, arrow position on page, min/max price, and eventually event map availability
    function handleDrag(e : any) {
        if (e.pageX > 0) {
            if (e.target.id === "left-arrow") {
                const x = Math.min(Math.max(e.pageX, 50), (rightOffset * 4.5) || 450);
                e.target.style.left = `${x}px`
                setLeftOffset(Math.ceil((x - 50) / 450 * 100));
                setMinPrice(Math.ceil(ticketPriceRange[0] + leftOffset * (ticketPriceRange[1] - ticketPriceRange[0]) / 100));
            }
            else if (e.target.id === "right-arrow") {
                const x = Math.min(Math.max(e.pageX, (leftOffset * 4.5 + 100) || 100), 500);
                e.target.style.left = `${x}px`
                setRightOffset(Math.ceil((x - 50) / 450 * 100));
                setMaxPrice(Math.ceil(ticketPriceRange[0] + rightOffset * (ticketPriceRange[1] - ticketPriceRange[0]) / 100));
            }
        }
    }

    useEffect(() => {
        let filteredTicketData;
        if (selectedSections.length && quantity) {
            filteredTicketData = ticketData?.filter(ticket => (
                selectedSections.includes(ticket.section) && ticket.quantitySplit.includes(quantity)
            ));
        }
        else if (selectedSections.length) {
            filteredTicketData = ticketData?.filter(ticket => (
                selectedSections.includes(ticket.section)
            ));
        }
        else if (quantity) {
            filteredTicketData = ticketData?.filter(ticket => (
                ticket.quantitySplit.includes(quantity)
            ));
        }
        else {
            filteredTicketData = ticketData;
        }

        if (filteredTicketData) {
            setTotalQuantity(filteredTicketData.filter(ticket => ticket.price >= minPrice && ticket.price <= maxPrice).length)
        }
        document.querySelectorAll("[data-section]").forEach(section => {
            let data = section.getAttribute("data-section");
            if (!ticketData?.some(ticket => ticket.section === data && ticket.price >= minPrice && ticket.price <= maxPrice)) {
                section.setAttribute("fill", "gray");
            }
            else {
                if (data && selectedSections.includes(data)) {
                    section.setAttribute("fill", "rgb(109, 193, 109)");
                }
                else {
                    section.setAttribute("fill", "rgb(185, 212, 185)");
                }
            }
        })
    }, [minPrice, maxPrice])

    return (
        <>
        <div className="p-5">
            <p>Price per ticket</p>
            <p className='font-bold'>${minPrice} - ${maxPrice}</p>
            <p>Average Price ${averageTicketPrice}</p>
        </div>
        <div className="relative">
            <svg id="svg" width="500" height="250">
                <defs>
                    <linearGradient id="solids" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: "rgb(103, 103, 150)", stopOpacity: "1"}} />
                    <stop offset={`${leftOffset}%`} style={{stopColor: "rgb(103, 103, 150)", stopOpacity: "1"}} />
                    <stop offset={`${leftOffset}%`} style={{stopColor: "rgb(62, 62, 115)", stopOpacity: "1"}} />
                    <stop offset={`${rightOffset || 100}%`} style={{stopColor: "rgb(62, 62, 115)", stopOpacity: "1"}} />
                    <stop offset={`${rightOffset || 100}%`} style={{stopColor: "rgb(103, 103, 150)", stopOpacity: "1"}} />
                    <stop offset="100%" style={{stopColor: "rgb(103, 103, 150)", stopOpacity: "1"}} />
                    </linearGradient>
                    <linearGradient id="solids2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: "rgb(0, 0, 150)", stopOpacity: "1"}} />
                    <stop offset="100%" style={{stopColor: "rgb(103, 103, 150)", stopOpacity: "1"}} />
                    </linearGradient>
                </defs>
            </svg>
            <div className="text-white bg-gray-700 hover:bg-black font-medium rounded-lg text-sm px-4 py-2 text-center m-5"
            onClick={() => setFilterPanelVisible(false)}>
                View {totalQuantity} listings
            </div>
            <div id="left-arrow" draggable="true" onDrag={handleDrag} style={{position: "absolute", left: "50px", top: "200px"}}>
                <BiLeftArrow />
            </div>
            <div id="right-arrow" draggable="true" onDrag={handleDrag} style={{position: "absolute", left: "500px", top: "200px"}}>
                <BiRightArrow />
            </div>
        </div>
        </>
    );
}

export default PricingGraph;