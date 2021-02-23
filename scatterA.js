const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';




fetch(url)
    .then((resp) => resp.json())
    .then(function(q) {
        var data = q;



        var timeParse = function(a) {
            return parseInt(a.split(":")[0]) * 60 + parseInt(a.split(":")[1]);
        }
        var parseTime = d3.timeParse("%M:%S");

        var yScale = d3.scaleLinear().domain([(new Date(parseTime(data[0].Time).getTime() - 15000)), (new Date(parseTime(data[data.length - 1].Time).getTime() + 15000))]).range([0, 300]);
        var xScale = d3.scaleLinear().domain([(d3.min(data.map((d) => d.Year))) - 1, (d3.max(data.map((d) => d.Year))) + 1]).range([0, 600]);
        var xAxis = d3.axisBottom(xScale).ticks(15).tickFormat(d => d);
        var yAxis = d3.axisLeft(yScale).ticks(20).tickFormat(d3.timeFormat("%M:%S"));

        var svg = d3.select("svg")
            .attr("width", 660)
            .attr("height", 360)
            .append("g")
            .attr("transform", "translate(45 15)");

        var tooltip = d3.select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden')
            .style('color', 'green')
            .style("font-size", "15px")

        var circleDot = svg.selectAll("g")
            .data(data)
            .enter().append("g")
            .append("circle")
            .attr("class", "dot")
            .attr("cy", (d) => yScale(parseTime(d.Time)))
            .attr("data-yvalue", (d) => new Date(1970, 2, 2, 2, d.Time.substr(0, 2), d.Time.substr(3, 2)))
            .attr("cx", (d) => xScale(d.Year))
            .attr("data-xvalue", (d) => d.Year)
            .attr("r", 4)
            .attr("fill", function(d) {
                if (d.Doping.length > 0) return 'purple';
                if (d.Doping.length === 0) return 'blue';
            })
            .attr("id", (d, i) => {
                if (d.Doping !== "") {
                    return "doping";
                } else return "non-doping";
            })
            .on("mouseover", function(d) {
                tooltip.style('visibility', 'visible')

                .html(d.Name + "," + d.Nationality + "<br>" + "Year:" + d.Year + ", Time:" +
                        d.Time + "<br>" + d.Doping)
                    .attr("data-year", d.Year)
            })
            .on("mouseout", function(d) {
                tooltip.style('visibility', 'hidden')
            });



        svg.append("g")

        .attr("id", "x-axis")
            .attr("transform", "translate(0," + 300 + ")")
            .style("color", "green")
            .call(xAxis);

        svg.append("g")

        .attr("id", "y-axis")
            .style("color", "green")
            .call(yAxis);

        svg.append('text').text('Time (min)')

        .attr('x', 25)
            .attr('y', 5)
            .style('fill', 'green');










    })