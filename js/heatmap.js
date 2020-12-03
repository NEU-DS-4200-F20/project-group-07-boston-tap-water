let margin = {top: 30, right: 200, bottom: 30, left: 100},
width = 800 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

let div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// append the svg object to the body of the page
let svg = d3.select("#heatmap")
.append("svg")
.attr("width", width + margin.left + margin.right + 60)
.attr("height", height + margin.top + margin.bottom)
.attr('id', 'heatmapid')
//.on('click', clear_heatmap())
.append("g")
.attr("transform",
      "translate(" + (margin.left + 100) + "," + margin.top + ")");

function heatmap(d){

d3.select('#heatmap')
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", d.length * 95 + margin.left + margin.right + 60)
  .append("g")
  .attr("transform",
        "translate(" + (margin.left + 100) + "," + margin.top + ")");

let title = svg
    .append('g')
    .append('text')
    .attr('x', 90) //gives x coordinate of label to left margin
    .attr('y', -17)// gives y coordinate of lable
    .style('fill', 'black') //styles the text to black
    .style("font", "30px")
    .style("font-weight", "bold")
    .text('Bacterial Phyla Relative Abundance (%)');

d3.csv("data/heatmap_data.csv").then(function(data){

  let myGroups = d
  let myVars = ["Betaproteobacteria", "Nitrospira", "Gammaproteobacteria", "Actinobacteria", "Oligoflexia", "Gemmatimonadetes", "Planctomycetia", "Flavobacteriia", "Deltaproteobacteria", "Chlamydiia"]
  let subset = [];

  for(i=0; i < 120; i++) { //makes subset of data with corresponding date
    if (myGroups.includes(data[i].Date)){
    subset.push(data[i])
    }
  }

    // Build X scales and axis:
  let x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([height, 0])
    .domain(myVars.reverse());
  svg.append("g")
    .call(d3.axisLeft(y));

  let myColor = d3.scaleSequential()
      .interpolator(d3.interpolateGreens)
      .domain([.1, 6])

svg.selectAll()
.data(subset, function(d) {
  return d.Date + ':' + d.Type})
.enter()
.append("rect") //places rectangles on axis based on attributes below
    .attr("class", "foo")
	  .attr("x", function(d) { return x(d.Date) })
	  .attr("y", function(d) { return y(d.Type) })
	  .attr("width", x.bandwidth())
	  .attr("height", y.bandwidth() )
	  .style("fill", function(d) {  //fills color based on proportion values
	    //console.log(d.Proportion)
      return myColor(+d.Proportion)} )
    .on("mouseover", function(event,d) {
      div.transition()
      .duration(0)
      .style("opacity", 0.7);
      div.html(d.Type + ":" + "<br/>" + d.Proportion + "%")
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("width", "120px")
      .style("height", "30px")
      .style("font-size", "12px");
    })
    .on("mouseout", function(d) {
      div.transition()
      .duration(0)
      .style("opacity", 0);
    });
  /*
  .on("mouseover", (event, f) =>  {
    d3.select(this) // identifies which rect is being hovered over
    svg.append('text')
    .attr('class', 'details')
    .attr('x', this.width)// x position of text
    .attr('y', this.height)// y position of text
    .attr('font-size', '17') // font size of text
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .text(function() { // defines content of the textbox
      return [f.Proportion + "%"];
    })
  })
  .on("mouseout", function() {
    d3.selectAll('.details') // removes textbox with details from chart
    .remove()
  })*/

  /*let texts = svg.selectAll(".text")
    .data(subset, function(d) { return d.Date + ':' + d.Type})
    .enter()
    .append("text");*/

/*
texts
    .attr("x", function(d) { return x.bandwidth()/2})
    .attr("y", function(d) {return y(d.Type) + 24 })
    .attr('font-size', "12px")
    .attr("fill", "#FD1783")
    .attr('fill-opacity', 0)
    .text(function(d) {return(+d.Proportion).toString() + "%" })
    .on("mouseover", function(d){
      d3.select(this).attr('fill-opacity', 1)})
    .on("mouseout", function(d){
      d3.select(this).transition().delay(500).attr('fill-opacity', 0)})
*/

  let min = 0;
  let max = 6;
  let legend = []
  for (var i = min; i < max; i+=0.5){
    legend.push(i);
  }
  let legend_y = d3.scaleLinear()
  .domain([min, max])
  .range([0, 200]);
  svg.append("g")
  .selectAll("rect")
  .data(legend)
  .enter()
  .append("rect")
  .attr("x", -170)
  .attr("y", d => legend_y(d) + 50)
  .attr("width", 30)
  .attr("height", 17)
  .attr("fill", d => myColor(d))
  svg.append("text")
  .attr("x", -190)
  .attr("y", 60)
  .attr('font-size', "10px")
  .text(min + "%")
  svg.append("text")
  .attr("x", -195)
  .attr("y", 250)
  .attr('font-size', "10px")
  .text(max + "%+")

  svg.append("rect")
  .attr("class", "foo")
  .attr("x", -170)
  .attr("y", 50)
  .attr("width", 30)
  .attr("height", 200)

});
}

function clear_heatmap() {
  d3.selectAll('#heatmapid > *').selectAll('g').remove()
}
