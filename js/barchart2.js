//let parseDate1 = d3.timeParse('%Y-%m-%d'); // parses the data column in the data into readable time values
let parseDate2 = d3.timeParse('%m/%d/%y');

  let width1  = 900; //sets the measurements for the first visualization
  let height = 500;
  let margin = {
    top: 30,
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

  .attr('viewBox', [0, 0, width2 + margin.left + margin.right, height2 + margin.top + margin.bottom].join(' '))
  .classed("svg-content", true);

  

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
  .attr('y', 15) // gives y coordinate of label
  .attr('x', 20) //gives x coordinate of label 
  .style('stroke', 'black') //styles the text to black
  .text('Cell Count'); //adds Humidity as axis label


let xAxis = svg2
  .append('g')
  .attr('transform', `translate(0,${height2 - margin.bottom})`) //positions the x axis on the bottom margin
  .call(d3.axisBottom().scale(xScale))
  
  //Add label
  .append('text')
  .attr('x', width2 - margin.left) //gives x coordinate of label to left margin
  .attr('y', -10)// gives y coordinate of lable
  .style('stroke', 'black') //styles the text to black
  .text('Dates'); //adds Dates as text

  
//Draw bars
let bar = svg2
  .selectAll('rect') 
  .data(data)
  .enter()
  .append('rect') //adds rectangles
  .attr('x', function(d) {
    return xScale(d.Date); //makes the bars by date
  })
  .attr('y', function(d) {
    return yScale(d.TCC); //makes the y value humidity
  })
  .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
  .attr('fill', 'purple') //fills in the bar according to colormap
  .attr('height', function(d) {
    return height2 - margin.bottom - yScale(d.TCC); //makes the height of the bar match its humidity
  })
  bar.append("title")
  .text(function(d) { return d.Date + ":  " + d.TCC}); //adds a title tag to bar and displays date and humidity when hovered


  let bar2 = svg2
  .selectAll('rect') 
  .data(data)
  .enter()
  .append('rect') //adds rectangles
  .attr('x', function(d) {
   return xScale(d.Date); //makes the bars by date
  })
  .attr('y', function(d) {
    return yScale(d.ICC); //makes the y value humidity
  })
  .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
  .attr('fill', 'lightpurple') //fills in the bar according to colormap
  .attr('height', function(d) {
    return d.ICC; //makes the y value humidity
  }) //makes the height of the bar match its humidity
  bar.append("title")
  .text(function(d) { return d.Date + ":  " + d.TCC});

  

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


