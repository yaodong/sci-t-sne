function pd_clear(svg) {
    while(svg.node().firstChild) {
        svg.node().removeChild(svg.node().firstChild);
    }
}

function pd_message(selector, text) {
    var svg = d3.select(selector);
    pd_clear(svg);
    svg.append('text').attr('x', 10).attr('y', 30).text(text);
}

function pd_display(selector, points) {

    var postData = points.map(function(p) {
        return p.coords.join(',')
    }).join("\n");

    d3.request("http://127.0.0.1:5000/ripser")
        .post(
            postData,
            function(error, res) {
                persistence_diagram(
                    selector,
                    JSON.parse(res.responseText));
            });
}

function persistence_diagram(selector, data) {
    var svg = d3.select(selector);

    // clean
    pd_clear(svg);

    var svgSize = svg.node().getBoundingClientRect().height - 10;
    var axisSpace = 30;
    var maxCoord = d3.max(data, function(d) { return d3.max(d); }) * 1.2;

    // scales
    var pointXScale = d3.scaleLinear().domain([0, maxCoord]).range([axisSpace, svgSize]);
    var pointYScale = d3.scaleLinear().domain([maxCoord, 0]).range([0, svgSize - axisSpace]);
    var axisXScale = d3.scaleLinear().domain([0, maxCoord]).range([0, svgSize - axisSpace]);
    var axisYScale = d3.scaleLinear().domain([maxCoord, 0]).range([0, svgSize - axisSpace]);

    // middle line
    svg.append('line')
        .attr('x1', axisSpace)
        .attr('y1', svgSize - axisSpace)
        .attr('x2', svgSize)
        .attr('y2', 0)
        .attr('stroke-width', 1)
        .attr('stroke', '#ddd');

    // axises
    var xAxis = d3.axisBottom(axisXScale);
    var yAxis = d3.axisLeft(axisYScale);
    svg.append('g')
        .attr('transform', 'translate(' + axisSpace + ', ' + (svgSize - axisSpace) + ')')
        .call(xAxis);

    svg.append('g')
        .attr('transform', 'translate(' + axisSpace + ', 0)')
        .call(yAxis);

    // points
    var pointsGroup = svg.append('g');
    var points = pointsGroup.selectAll('circle').data(data);

    points.exit().remove();
    points = points.enter().append('circle').merge(points);

    points
        .attr('cx', function(d) { return pointXScale(d[0]) })
        .attr('cy', function(d) { return pointYScale(d[1]) })
        .attr('r', 3)
        .attr('fill', '#FD9927');




}
