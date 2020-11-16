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

        
let title = svg
    .append('g')
    .append('text')
    .attr('x', -80) //gives x coordinate of label to left margin
    .attr('y', -17)// gives y coordinate of lable
    .style('fill', 'black') //styles the text to black
    .style("font", "30px")
    .style("font-weight", "bold")
    .text('Bacterial Phyla Proportions');

// Labels of row and columns





d3.csv("data/heatmap_data.csv").then(function(data){  
  //data = data.slice().sort((a, b) => d3.ascending(a.Proportion, b.Proportion))
  
  let myGroups = ["3/1/19"]
  /*
  let myVars = ["Betaproteobacteria","Nitrospira","Gammaproteobacteria","Planctomycetia","Actinobacteria", "Oligoflexia","Gemmatimonadetes","Chlamydiia","Flavobacteriia","Deltaproteobacteria"]
  */
  //console.log(data[0].Type)
  let myVars = []
  
  for(i=0; i < 120; i++) {
    if (data[i].Date == "3/1/19"){
    myVars.push(data[i].Type)
    }
  }
  //console.log(myVars)

  let subset = [];

  for(i=0; i < 120; i++) {
    if (data[i].Date == "3/1/19"){
    subset.push(data[i])
    }
  }
  console.log(subset)
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
   
  var myColor = d3.scaleSequential()
      .interpolator(d3.interpolateGreens)
      .domain([.1, 6])
  
    
//console.log(data)
svg.selectAll()
.data(subset, function(d) {
  return d.Date + ':' + d.Type})
.enter()
.append("rect")
	  .attr("x", function(d) { return x(d.Date) })
	  .attr("y", function(d) { return y(d.Type) })
	  .attr("width", x.bandwidth() )
	  .attr("height", y.bandwidth() )
	  .style("fill", function(d) { 
	    console.log(d.Proportion)
	    return myColor(+d.Proportion)} )
	  
});
