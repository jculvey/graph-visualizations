var w = 980;
var h = 460;
var radius = 30;

var speeds = [
  2000,
  1600,
  1200,
  800,
  600,
  400,
]

var animationDelay = speeds[3];
var traverse = BFS;

var leftPull = 100;
var upPull = -55;
var currentNode = null;

//Create SVG element
var svg = d3.select("#svg-container")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "scale(0.6)")

function update(data) {
    //Create edges as lines
    var edgePaths = svg.selectAll("path")
      .data(data.edges)

    edgePaths.enter()
      .append("path")
      .attr('class', "edge")

    edgePaths.attr('d', function(d) {
          var deltaX = d.target.x - d.source.x,
              deltaY = d.target.y - d.source.y,
              dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
              normX = deltaX / dist,
              normY = deltaY / dist,
              sourcePadding = d.left ? 17 : 12,
              targetPadding = d.right ? 17 : 12,
              sourceX = d.source.x + (sourcePadding * normX) - leftPull,
              sourceY = d.source.y + (sourcePadding * normY) - upPull,
              targetX = d.target.x - (targetPadding * normX) - leftPull,
              targetY = d.target.y - (targetPadding * normY) - upPull;
          return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
      });

    //Create nodes as circles
    var nodes = svg.selectAll("circle")
      .data(d3.entries(data.G))

    nodes.enter()
      .append("circle")
      .attr("class", 'node')
      .attr("r", radius)

    nodes.attr("cx", function(d) {
          return d.value.x - leftPull;
      })
      .attr("cy", function(d) {
          return d.value.y - upPull;
      })
      .classed('node-visited', function(d) {
          return d.value.visited;
      })
      .classed('node-current', function(d) {
          return d.value === currentNode;
      })
      .classed('node-discovered', function(d) {
          return d.value.discovered && !d.value.visited;
      });

    // Label nodes with Data
    var labels = svg.selectAll("text")
      .data(d3.entries(data.G))

    labels.enter()
      .append("text")
      .text(function(d) { 
        return d.value.title; 
      })
      .attr("class", 'label')

    labels.attr("x", function(d) {
          return (d.value.x - leftPull) - radius / 2;
      })
      .attr("y", function(d) {
          return (d.value.y - upPull) + radius / 4;
      })
      .classed('label-visited', function(d) {
          return d.value.visited;
      })

    // Update stats
    //$("#seen_length").text('1');
}

d3.select("#speed_slider").on('input', function(d) {
  var speed = d3.event.target.value;
  animationDelay = speeds[speed];
});

$("input:radio[name=traversalType]").click(function() {
    var value = $(this).val();
});

d3.json("/data/alphabet-graph.json", function(error, json) {
  update({
    G: json.G,
    edges: json.edges,
    seen_length: 0
  });
  var visits = traverse(json.G, 1);
  printVisits(visits, json.G, json.edges);
});

