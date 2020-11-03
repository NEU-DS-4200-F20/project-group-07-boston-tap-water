




function barChart(){

    let parseDate = d3.timeParse('%m/%d/%y');
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 20
      }
    let width  = 2000; //adjusts the dimensions for second visualization
    let height = 1000;
    let xValue = d => d[0],
    yValue = d => d[1],
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0,
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear();
    //ourBrush = null,
    //selectableElements = d3.select(null),
    //dispatcher;


function chart(selector, data){
  
//console.log(data); //loads the data into the console
  let maxDate  = d3.max(data, function(d){return parseDate(d.Date); }); //finds the maximum date for x axis
  let minDate  = d3.min(data, function(d){return parseDate(d.Date); }); //finds the minimum date for x axis
  let maxCount = d3.max(data, function(d){return d.TCC;}); // finds the max meantemp for y axis
  console.log(maxDate, minDate, maxCount); //prints out these values in console
  
  let svg = d3.select(selector)
      .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
        .classed('svg-content', true);

    svg = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let yScale = d3.scaleLinear()
  .domain([0,maxCount]) //sets the y axis to scale humidity from min to max
  .range([height - margin.bottom, margin.top]); //formats the axis so it is between the margins

let xScale = d3.scaleBand()
  .domain(
    data.map(function(d) {
      return d.Date;
    }) // makes the x values the dates
  )
  .range([margin.left, width - margin.right]) //scales it to fit between the left and right margins
  .padding(0.5);

//Draw Axes
let yAxis = svg
  .append('g')
  .attr('transform', `translate(${margin.left},0)`) //positions the y axis on the left margin
  .call(d3.axisLeft().scale(yScale))

  //Add label
  .append('text')
  .attr('y', 15) // gives y coordinate of label
  .attr('x', 20) //gives x coordinate of label 
  .style('stroke', 'black') //styles the text to black
  .text('Count'); //adds Humidity as axis label


let xAxis = svg
  .append('g')
  .attr('transform', `translate(0,${height - margin.bottom})`) //positions the x axis on the bottom margin
  .call(d3.axisBottom().scale(xScale))
  
  //Add label
  .append('text')
  .attr('x', width - margin.left) //gives x coordinate of label to left margin
  .attr('y', -10)// gives y coordinate of lable
  .style('stroke', 'black') //styles the text to black
  .text('Dates'); //adds Dates as text

  
//Draw bars
let bar = svg
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
  .attr('fill', function(d){
    return findColor(d.TCC);

  }) //fills in the bar according to colormap
  .attr('height', function(d) {
    return height - margin.bottom - yScale(d.TCC); //makes the height of the bar match its humidity
  })
  bar.append("title")
  .text(function(d) { return d.Date + ":  " + d.TCC}); //adds a title tag to bar and displays date and humidity when hovered

  
return chart;

}


function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  // Gets or sets the  we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed('selected', d =>
      selectedData.includes(d)
    );

  };

  return chart;
}

