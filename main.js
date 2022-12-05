/*
    CS 4460 Final Project
    Comparing Transportation Fatalities Based on Mode (1975-2020)
    by Masaki Asanuma
*/

// Constants
const sideMargin = 90;
const vertMargin = 40;

const width = 800 - sideMargin;
const height = 700 - vertMargin;

const keyList = ['Car_Occupant', 'Pedestrian', 'Motorcycle', 'Bicycle', 'Trucks'];
const colorList = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];
const highestValue = [37500, 8500, 6000, 1500, 1500];
const cumulativeHighestValue = [1500000, 300000, 200000, 50000, 50000];
const areaList = [];
let transportBool = new Array(5).fill(true);

d3.csv('transportation.csv').then(data => {
    // Main area chart svg
    let chart = d3.select('#area-chart')
        .append('svg')
        .attr('width', width + sideMargin)
        .attr('height', height + vertMargin);

    // Set up x-axis
    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d['Year']))
        .range([0, width]);

    chart
        .append('g')
        .attr('transform', 'translate(70,' + (height + 10) + ')')
        .attr('class', 'xaxis')
        .call(d3.axisBottom().ticks(20).tickFormat(d3.format('d')).scale(xScale));

    chart
        .append('text')
        .attr('x', (width + sideMargin + 30) / 2)
        .attr('y', height + vertMargin)
        .attr('font-size', '12px')
        .text('Year');

    // Set up y-axis
    let yScale = d3.scaleLinear()
        .domain([0, highestValue[0]])
        .range([height, 0]);

    chart
        .append('g')
        .attr('transform', 'translate(70,10)')
        .attr('class', 'yaxis')
        .call(d3.axisLeft().scale(yScale));

    chart
        .append('text')
        .attr('x', -(width + sideMargin) / 2)
        .attr('y', 20)
        .attr('font-size', '12px')
        .attr('transform', 'rotate(-90)')
        .text('Deaths');

    // Add color to corresponding mode for checkboxes
    d3.selectAll('.horizontal-checkbox')
        .data(colorList)
        .style('background-color', d => d);

    // Calculate cumulative death data
    let cumulativeData = data.map(d => ({...d}));
    for (let i = 0; i < keyList.length; i++) {
        let sum = 0;
        for (let j = 0; j < cumulativeData.length; j++) {
            let currDeath = Number(cumulativeData[j][keyList[i]])
            currDeath += sum;
            sum = currDeath;
            cumulativeData[j][keyList[i]] = sum;
        }
    }

    // Default to non-cumulative data
    let selectedData = data;

    // Generate and append areas for each transportation mode
    for (let i = 0; i < keyList.length; i++) {
        areaList.push(
            d3.area()
                .x(d => xScale(d['Year']))
                .y0(yScale(0))
                .y1(d => yScale(d[keyList[i]]))
        );
    }

    for (let i = 0; i < areaList.length; i++) {
        chart
            .append('g')
            .attr('transform', `translate(71, 10)`)
            .append('path')
            .datum(selectedData)
            .attr('id', keyList[i])
            .attr('d', areaList[i])
            .attr('fill', colorList[i]);
    }

    // Calculated pixel distance between each x-axis tick
    const tickDist = width / 45;

    // Insert tooltip div
    let tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip');

    // For each year, insert vertical line to display when hovered over
    for (let i = 0; i <= 45; i++) {
        chart
            .append('line')
            .attr('id', 'detail-line' + i)
            .attr('x1', 70.5 + (tickDist * i))
            .attr('x2', 70.5 + (tickDist * i))
            .attr('y1', 10)
            .attr('y2', height + 10)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('opacity', 0)
            .clone()
            .attr('stroke', 'transparent').attr('stroke-width', 15)
            .attr('id', 'detail-line-invis' + i)
            .on('mouseout', d => {
                d3.selectAll('#detail-line' + i).attr('opacity', 0);
                tooltip.transition().duration(500).style('visibility', 'hidden');
            });
    }

    // Update chart based on checkbox filter selection
    const update = () => {
        // Boolean logic to show/hide selected transportation mode
        if (d3.select('#car-check').property('checked')) {
            d3.select('#Car_Occupant').transition('opacity').duration(500).attr('opacity', 1);
            transportBool[0] = true;
        } else {
            d3.select('#Car_Occupant').transition('opacity').duration(500).attr('opacity', 0);
            transportBool[0] = false;
        }

        if (d3.select('#pedestrian-check').property('checked')) {
            d3.select('#Pedestrian').transition('opacity').duration(500).attr('opacity', 1);
            transportBool[1] = true;
        } else {
            d3.select('#Pedestrian').transition('opacity').duration(500).attr('opacity', 0);
            transportBool[1] = false;
        }

        if (d3.select('#motorcycle-check').property('checked')) {
            d3.select('#Motorcycle').transition('opacity').duration(500).attr('opacity', 1);
            transportBool[2] = true;
        } else {
            d3.select('#Motorcycle').transition('opacity').duration(500).attr('opacity', 0);
            transportBool[2] = false;
        }

        if (d3.select('#bicycle-check').property('checked')) {
            d3.select('#Bicycle').transition('opacity').duration(500).attr('opacity', 1);
            transportBool[3] = true;
        } else {
            d3.select('#Bicycle').transition('opacity').duration(500).attr('opacity', 0);
            transportBool[3] = false;
        }

        if (d3.select('#truck-check').property('checked')) {
            d3.select('#Trucks').transition('opacity').duration(500).attr('opacity', 1);
            transportBool[4] = true;
        } else {
            d3.select('#Trucks').transition('opacity').duration(500).attr('opacity', 0);
            transportBool[4] = false;
        }

        // Choose cumulative or non-cumulative data based on selection
        // Find highest y-axis value based on selected modes
        let yAxisMax;
        if (d3.select('#cumulative').property('checked')) {
            selectedData = cumulativeData;
            yAxisMax = cumulativeHighestValue[transportBool.findIndex(d => d)]
        } else {
            selectedData = data;
            yAxisMax = highestValue[transportBool.findIndex(d => d)]
        }

        // Update y-axis domain to reflect currently checked modes
        yScale.domain([0, yAxisMax]);
        d3.selectAll('g.yaxis').transition('axis').duration(500).call(d3.axisLeft().scale(yScale));
        for (let i = 0; i < areaList.length; i++) {
            d3.select('#' + keyList[i]).datum(selectedData).transition('path').duration(500).attr('d', areaList[i]);
        }

        // Update tooltip to show only filtered transportation mode
        for (let i = 0; i <= 45; i++) {
            chart.select('#detail-line-invis' + i).on('mouseover', d => {
                let tooltipHtml = `
                    <b>Year</b>: ${selectedData[i]['Year']}<br>
                    <b>Population</b>: ${selectedData[i]['Population']}<br><br>
                `;

                tooltipHtml += transportBool[0] ? `<b>Car</b>: ${selectedData[i]['Car_Occupant']}<br>` : ``;
                tooltipHtml += transportBool[1] ? `<b>Pedestrian</b>: ${selectedData[i]['Pedestrian']}<br>` : ``;
                tooltipHtml += transportBool[2] ? `<b>Motorcycle</b>: ${selectedData[i]['Motorcycle']}<br>` : ``;
                tooltipHtml += transportBool[3] ? `<b>Bicycle</b>: ${selectedData[i]['Bicycle']}<br>` : ``;
                tooltipHtml += transportBool[4] ? `<b>Trucks</b>: ${selectedData[i]['Trucks']}<br>` : ``;

                d3.selectAll('#detail-line' + i).attr('opacity', 1);
                tooltip.transition().duration(200).style('visibility', 'visible');
                tooltip.html(tooltipHtml)
                    .style('left', (d3.event.pageX + 28) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            });
        }
    }

    d3.select('#filter-options').on('change', update);
    update();
});