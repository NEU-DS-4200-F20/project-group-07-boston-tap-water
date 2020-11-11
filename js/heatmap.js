let margin = {top: 30, right: 200, bottom: 30, left: 30},
  width = 300 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#heatmap")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + (margin.left + 100) + "," + margin.top + ")");

// Labels of row and columns
let myGroups = ["3/1/19"]
let myVars = ["Betaproteobacteria","Nitrospira","Gammaproteobacteria","Planctomycetia","Actinobacteria", "Oligoflexia","Gemmatimonadetes","Chlamydiia","Flavobacteriia","Deltaproteobacteria"]

// Build X scales and axis:
let x = d3.scaleBand()
  .range([ 0, width ])
  .domain(myGroups)
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// Build Y scales and axis:
let y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
  .call(d3.axisLeft(y));

// Build color scale
let myColor = d3.scaleLinear()
  .range(["white", "blue"])
  .domain([1,100])
/*
svg
.append('rect')
.attr('x', 4)
.attr('y', 5)
.attr("width", x.bandwidth() )
.attr("height", y.bandwidth() )
.style('fill', 'blue')
*/

data = d3.csv("data/heatmap_data.csv", 
function(d) { return {date: d.Date, type: d.Type, prop : +d.Proportion}})
//console.log(data)

svg.selectAll()
.data(data, function(d) {
  console.log(d.date + ':' + d.type)
  return d.date + ':' + d.type})
.enter()
.append("rect")
	  .attr("x", function(d) { return x(d.date) })
	  .attr("y", function(d) { return y(d.type) })
	  .attr("width", x.bandwidth() )
	  .attr("height", y.bandwidth() )
	  .style("fill", function(d) { return myColor(d.prop)} )



//Read the data
//d3.csv("data/heatmap_data.csv").then(data =>
  //console.log(svg.selectAll('.cell'))
  //console.log(data)
  /*d3.selectAll('svg').selectAll('.rect')
    .data(data, function(d) {
        console.log(d.date)
        return d.date+':'+d.type;})
  
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.date) })
      .attr("y", function(d) { return y(d.type) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.prop)} )*/

