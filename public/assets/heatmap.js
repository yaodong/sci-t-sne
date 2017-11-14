function draw_heatmap(type, selector) {
    d3.csv("heatmap.csv", function (data) {
        data = data.filter(function (d) {
            return d['type'] === type;
        });

        var svg = d3.select(selector);
        svg.attr('width', 960).attr('height', 300);

        var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];
        colors = colors.reverse();
        var maxDistance = d3.max(data, (d) => d['distance']);

        var colorScale = d3.scaleQuantile()
            .domain([0, maxDistance])
            .range(colors);

        var yCount = 20;
        var xCount = 99;

        // tiles ----------------------------------------------------------------------------
        var tileSize = 8;
        var tileGroupTranslate = {'x': 50, 'y': 10};

        var tileGroup = svg.append('g');
        var tiles = tileGroup.selectAll('rect').data(data);
        tiles = tiles.enter().append('rect').merge(tiles);

        tiles.attr('x', function (d) {
            return (d['perplexity'] - 2) * tileSize + tileGroupTranslate['x']
        }).attr('y', function (d) {
            return (yCount - d['epsilon']) * tileSize + tileGroupTranslate['y']
        }).attr('height', tileSize - 0.4)
            .attr('width', tileSize - 0.4)
            .attr('stroke-width', 0.2)
            .attr('stroke', '#fff')
            .style("fill", function (d) {
                return colorScale(d['distance']);
            });

        // axis ----------------------------------------------------------------------------

        var xTotalTileSize = tileSize * xCount;
        var yTotalTileSize = tileSize * yCount;
        var xScale = d3.scaleLinear().domain([2, 100]).range([0, xTotalTileSize]);
        var xAxis = d3.axisBottom(xScale);

        var xAxisXOffset = tileGroupTranslate['x'];
        var xAxisYOffset = yTotalTileSize + tileGroupTranslate['y'] + 5;

        svg.append("g").attr("transform", "translate(" + xAxisXOffset + ", " + xAxisYOffset + ")").call(xAxis);

        var yScale = d3.scaleLinear().domain([20, 1]).range([0, yTotalTileSize]);
        var yAxis = d3.axisLeft(yScale);
        svg.append("g").attr("transform", "translate(45, " + tileGroupTranslate['y'] + ")").call(yAxis);


        // legend ----------------------------------------------------------------------------

        var legendWidth = 60;
        var legendHeight = 10;
        var legendTranslate = {
            'x': tileGroupTranslate['x'],
            'y': tileGroupTranslate['y'] + tileSize * 20 + 100
        };

        var legendSegments = [0].concat(colorScale.quantiles()).map(function(d) {
            return parseInt(d * 100) / 100;
        });

        var legendGroup = svg.append('g')
            .attr('transform', 'translate(' + legendTranslate['x'] + ', ' + legendTranslate['y'] + ')');
        var legend = legendGroup.selectAll("g").data(legendSegments);

        legend = legend.enter().append("g").merge(legend);


        legend.append('rect')
            .attr("x", function (d, i) {
                return legendWidth * i;
            })
            .attr("y", 0)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", function (d, i) {
                return colors[i];
            });

        legend.append("text")
            .attr('class', 'heatmap-legend-text')
            .text(function (d) {
                return "≥ " + Math.floor(d * 100) / 100;
            })
            .attr("x", function (d, i) {
                return legendWidth * i;
            })
            .attr("y", 30);

        // axis label ------------------------------------------------------------------------------------
        svg.append('text')
            .attr('x', 415)
            .attr('y', 215)
            .text('Perplexity')
            .attr('class', 'heatmap-axis-label');

        svg.append('text')
            .attr('x', 100)
            .attr('y', 100)
            .text('Epsilon')
            .attr('class', 'heatmap-axis-label')
            .attr('transform', 'rotate(-90 45 45) translate(-100, -80)');
    });

}

draw_heatmap('b', '#heatmap svg.heatmap-type-b');
draw_heatmap('w', '#heatmap svg.heatmap-type-w');
