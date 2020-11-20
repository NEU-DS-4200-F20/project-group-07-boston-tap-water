
let margin = {top: 30, right: 200, bottom: 30, left: 30},
width = 300 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#heatmap")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.attr('id', 'heatmapid')
//.on('click', clear_heatmap())
.append("g")
.attr("transform",
      "translate(" + (margin.left + 100) + "," + margin.top + ")");

d3.select('#heatmapid')
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)


function heatmap(d){

d3.select('#heatmap')
  .append("g")
  .attr("transform",
        "translate(" + (margin.left + 100) + "," + margin.top + ")");


let title = svg
    .append('g')
    .append('text')
    .attr('x', -80) //gives x coordinate of label to left margin
    .attr('y', -17)// gives y coordinate of lable
    .style('fill', 'black') //styles the text to black
    .style("font", "30px")
    .style("font-weight", "bold")
    .text('Bacterial Phyla Percentages');

// Labels of row and columns





d3.csv("data/heatmap_data.csv").then(function(data){
  //data = data.slice().sort((a, b) => d3.ascending(a.Proportion, b.Proportion))

  let myGroups = [d]
  //console.log(d)
  /*
  let myVars = ["Betaproteobacteria","Nitrospira","Gammaproteobacteria","Planctomycetia","Actinobacteria", "Oligoflexia","Gemmatimonadetes","Chlamydiia","Flavobacteriia","Deltaproteobacteria"]
  */
  //console.log(data[0].Type)
  let myVars = []

  for(i=0; i < 120; i++) { //makes an array with the bacteria phyla names
    if (data[i].Date == d){
    myVars.push(data[i].Type)
    }
  }
  //console.log(myVars)

  let subset = [];

  for(i=0; i < 120; i++) { //makes subset of data with corresponding date
    if (data[i].Date == d){
    subset.push(data[i])
    }
  }
  //console.log(subset)
  //myVars = myVars
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
  /*let myColor = d3.scaleSequential()
    .range(["#FFECEC", "red"])
    .domain([0, 5.95])*/

  let myColor = d3.scaleSequential()
      .interpolator(d3.interpolateGreens)
      .domain([.1, 6])


//console.log(data)
let tooltip = "x";
let tooltip_x = 0;
let tooltip_y = 0;
svg.selectAll()
.data(subset, function(d) {
  return d.Date + ':' + d.Type})
.enter()
.append("rect") //places rectangles on axis based on attributes below
    .attr("class", "foo")
	  .attr("x", function(d) { return x(d.Date) })
	  .attr("y", function(d) { return y(d.Type) })
	  .attr("width", x.bandwidth() )
	  .attr("height", y.bandwidth() )
	  .style("fill", function(d) {  //fills color based on proportion values
	    console.log(d.Proportion)
	    return myColor(+d.Proportion)} )
    .append("text")
    .attr("x", function(d) { return x(d.Date) })
    .attr("y", function(d) { return y(d.Type) })
    .attr('font-size', "12px")
    .attr('fill-opacity', 0)
    .text(function(d) { return (+d.Proportion).toString() })

d3.select("svg").selectAll("rect")
  .on("mouseover", function(d) {
      //d3.select(this).text(tooltip)
      tooltip_x = x(d.Date)
      tooltip_y = y(d.Type)
      tooltip = (+d.Proportion).toString()

      d3.select("rect")
      .append("text")
      .attr("x", tooltip_x)
      .attr("y", tooltip_y)
      .attr('font-size', "12px")
      .text(tooltip)
    })


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
  .attr("x", 120)
  .attr("y", d => legend_y(d) + 50)
  .attr("width", 30)
  .attr("height", 17)
  .attr("fill", d => myColor(d))
  svg.append("text")
  .attr("x", 100)
  .attr("y", 60)
  .attr('font-size', "10px")
  .text(min + "%")
  svg.append("text")
  .attr("x", 95)
  .attr("y", 250)
  .attr('font-size', "10px")
  .text(max + "%+")

  svg.append("rect")
  .attr("class", "foo")
  .attr("x", 120)
  .attr("y", 50)
  .attr("width", 30)
  .attr("height", 200)

});

}

function clear_heatmap(){

  d3.selectAll('#heatmapid > *').selectAll('g').remove()

}
