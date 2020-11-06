//let parseDate1 = d3.timeParse('%Y-%m-%d'); // parses the data column in the data into readable time values
let parseDate2 = d3.timeParse('%m/%d/%y');


  let margin = {
    top: 40,
    bottom: 30,
    left: 30,
    right: 30
  };


// first visualization

let width2  = 1000; //adjusts the dimensions for second visualization
let height2 = 550;

function barChart(data){
  console.log(data); //loads the data into the console
  let maxDate  = d3.max(data, function(d){return d.Date; }); //finds the maximum date for x axis
  let minDate  = d3.min(data, function(d){return d.Date; }); //finds the minimum date for x axis
  let maxCount = d3.max(data, function(d){return d.TCC;}); // finds the max meantemp for y axis
  console.log(maxDate, minDate, maxCount); //prints out these values in console
  
  let svg2 = d3.select('#barChart')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#fff') // change the background color to white
  .attr('viewBox', [0, 0, width2 + margin.left + margin.right , height2 + margin.top + margin.bottom].join(' '))
  

  

let yScale = d3.scaleLinear()
  .domain([0,maxCount]) //sets the y axis to scale humidity from min to max
  .range([height2 - margin.bottom, margin.top]); //formats the axis so it is between the margins

let xScale = d3.scaleBand()
  .domain(
    data.map(function(d) {
      return d.Date;
    }) // makes the x values the dates
  )
  .range([margin.left, width2 - margin.right]) //scales it to fit between the left and right margins
  .padding(0.5);

//Draw Axes
let yAxis = svg2
  .append('g')
  .attr('transform', `translate(${margin.left},0)`) //positions the y axis on the left margin
  .call(d3.axisLeft().scale(yScale))

  //Add label
  .append('text')
  .attr('y', 30) // gives y coordinate of label
  .attr('x', 125) //gives x coordinate of label 
  .style('fill', 'black') //styles the text to black
  .attr('font-size', 30)
  .text('Cell Count'); //adds Humidity as axis label


let xAxis = svg2
  .append('g')
  .attr('transform', `translate(0,${height2 - margin.bottom})`) //positions the x axis on the bottom margin
  .call(d3.axisBottom().scale(xScale))
  
  //Add label
  .append('text')
  /*.attr('x', width2 - margin.left) //gives x coordinate of label to left margin
  .attr('y', -10)// gives y coordinate of lable
  .style('stroke', 'black')*/
  .attr('x', 500) //gives x coordinate of label to left margin
  .attr('y', 50)// gives y coordinate of lable
  .attr('font-size', 30)
  .style('fill', 'black') //styles the text to black
  
  .text('Dates'); //adds Dates as text

  
//Draw bars

let g = svg2.selectAll(".rect")
  .data(data)
  .enter()
  .append("g")
  .classed('rect', true)



g.append("rect")
  .attr('x', function(d) {
    return xScale(d.Date); //makes the bars by date
  })
  .attr('y', function(d) {
    return yScale(d.TCC); //makes the y value humidity
  })
  .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
  .attr('fill', '#9370DB') //fills in the bar according to colormap
  .attr('height', function(d) {
    return height2 - margin.bottom - yScale(d.TCC); //makes the height of the bar match its humidity
  })


  g.append("rect")
  .attr('x', function(d) {
   return xScale(d.Date); //makes the bars by date
  })
  .attr('y', function(d) {
    return yScale(d.ICC); //makes the y value humidity
  })
  .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
  .attr('fill', '#3A1D90') //fills in the bar according to colormap
  .attr('height', function(d) {
    return height2 - margin.bottom - yScale(d.ICC); //makes the y value humidity
  }) 

  colors = ['#9370DB', '#3A1D90']

let legend = svg2.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
 
legend.append("rect")
  .attr("x", width2 - 400 )
  //.attr ("y", height2 + 20)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors[i];});
 
legend.append("text")
  .attr("x", width2 - 375 )
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function(d, i) { 
    switch (i) {
      case 0: return "Membrane Non_Intact Cells";
      case 1: return "Membrane Intact Cells";
    }
  });


  //Interaction
/*bar
  .on('mouseover', function(event, d) {
    d3.select(this)
      .transition()
      .delay(200)
      .duration(1000)
      .attr('fill', 'pink') // changes bar to pink when mouseover
    
  })

  .on('mouseout', function(d) {
    d3.select(this)
      .transition()
          .delay(200)
          .duration(1000)
      .attr('fill', d => {return findColor(d.humidity)}) //returns bar to its original color
  });
}

function findColor(x){
  if (x > 35)
  {
    return 'MediumBlue'}
  else if (x>25) {return "RoyalBlue"}
  else { return 'Dodgerblue'} //creates the colormap for the barchart based on humidity values

};
  
*/
}




let data2 = d3.csv('data/project.csv', function(d) {
  return {
    Date: d.Date, //parses the date column and loads into array
     // loads values into array
    ICC: +d.ICC,
    TCC: +d.TCC

  };
})

//data1.then(lineChart); //makes a linechart using this data array
data2.then(barChart); //makes a bar chart using this data array


