import * as d3 from "d3";
import { useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";

type Data = {
    x: number,
    y: number
}

function PricingGraph() {
    // x-axis: price data
    // y-axis: frequency data
    const ticketData = useAppSelector(state => state.ticket.data);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    // const [dataset, setDataset] = useState<Data[]>([])
    // need min-max price range, frequency data, not too many data points, frequency as a range?
    useEffect(() => {
        if (ticketData) {
            let minPrice = ticketData[0].price;
            let maxPrice = ticketData[0].price;
            let prices = new Map<any, any>();
            for (let data of ticketData) {
                let idx = data.price.toString();
                prices.set(idx, (prices.get(idx) || 0) + 1);
                if (data.price > maxPrice) {
                    maxPrice = data.price;
                }
                if (data.price < minPrice) {
                    minPrice = data.price;
                }
            }
            setMaxPrice(maxPrice);
            setMinPrice(minPrice);
            console.log(prices)
        }
    }, [ticketData])

    const dataset : Data[] = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 5, y: 10}, {x: 10, y: 12}, {x: 40, y: 5}, {x: 70, y: 2}, {x: 100, y: 0}];
    const svg = d3.select("#svg");
    const margin = 200;
    const width = 450;
    const height = 350;

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 20]).range([height, 0]);
    
    svg.append("g")
    .attr("transform", "translate(50," + height + ")")
    .call(d3.axisBottom(xScale));
    
    svg.append("g")
    .attr("transform", "translate(50, 0)")
    .call(d3.axisLeft(yScale));

    svg.append('g')
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d["x"]); } )
    .attr("cy", function (d) { return yScale(d["y"]); } )
    .attr("r", 2)
    .attr("transform", "translate(50, 0)")
    .style("fill", "#CC0000");

    var line = d3.line<Data>()
        .x(function(d) { return xScale(d["x"]); }) 
        .y(function(d) { return yScale(d["y"]); }) 
        .curve(d3.curveBasis)
        
    svg.append("path")
        .datum(dataset) 
        .attr("class", "line") 
        .attr("transform", "translate(50, 0)")
        .attr("d", line)
        .style("fill", "#CC0000")
        .style("stroke", "#CC0000")
        .style("stroke-width", "1");

    return (
        <svg id="svg" width="500" height="400">
        </svg>
    );
}

export default PricingGraph;