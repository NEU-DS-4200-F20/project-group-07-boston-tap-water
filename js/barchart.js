




function barChart(){

    let xValue = d => d[0],
    y1Value = d => d[1],
    y2Value = d => d[2],
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear();
    //ourBrush = null,
    //selectableElements = d3.select(null),
    //dispatcher;
    let margin = {
      top: 100,
      bottom: 30,
      left: 90,
      right: 30
    };
  // first visualization

  let width = 1000; //adjusts the dimensions for second visualization
  let height = 550;


function chart(selector, data){
  console.log(data); //loads the data into the console
  let maxDate  = d3.max(data, d => xValue(d)); //finds the maximum date for x axis
  let minDate  = d3.min(data, d => xValue(d)); //finds the minimum date for x axis
  let maxCount = d3.max(data, d => y1Value(d)); // finds the max meantemp for y axis
  console.log(maxDate, minDate, maxCount, d3.max(data, d => y2Value(d))); //prints out these values in console

  let svg2 = d3.select('#barChart')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#fff') // change the background color to white
  .attr('viewBox', [0, 0, width + margin.left + margin.right , height + margin.top + margin.bottom].join(' '))




  yScale
  .domain([0,maxCount]) //sets the y axis to scale humidity from min to max
  .range([height - margin.bottom, margin.top]); //formats the axis so it is between the margins
  /*.domain([
    d3.min(data, d => y1Value(d)),
    d3.max(data, d => y1Value(d))
  ])
  .rangeRound([height, 0]);*/

  xScale
  .domain(
    data.map(function(d) {
      return xValue(d);
    }) // makes the x values the dates
  )
  .range([margin.left, width - margin.right]) //scales it to fit between the left and right margins
  .padding(0.5);

  /*.domain(d3.group(data, xValue).keys())
  .rangeRound([0, width]);*/

//Draw Axes
let yAxis = svg2
  .append('g')
  .attr('transform', `translate(${margin.left},0)`) //positions the y axis on the left margin
  .style("font", "20px times")
  .call(d3.axisLeft().scale(yScale))

  //Add label
  .append('text')
  .attr('y', -60) // gives y coordinate of label
  .attr('x', -195) //gives x coordinate of label
  .style('fill', 'black') //styles the text to black
  .attr('font-size', 25)
  .attr("transform", "rotate(270)")
  .text('Cell Count (cells/mL)') //adds Humidity as axis label


let xAxis = svg2
  .append('g')
  .attr('transform', `translate(0,${height - margin.bottom})`) //positions the x axis on the bottom margin
  .style("font", "20px times")
  .call(d3.axisBottom().scale(xScale))

  //Add label
  .append('text')
  /*.attr('x', width2 - margin.left) //gives x coordinate of label to left margin
  .attr('y', -10)// gives y coordinate of lable
  .style('stroke', 'black')*/
  .attr('x', 500) //gives x coordinate of label to left margin
  .attr('y', 70)// gives y coordinate of lable
  .attr('font-size', 25)
  .style('fill', 'black') //styles the text to black

  .text('Dates'); //adds Dates as text


let title = svg2
  .append('g')
  .append('text')
  .attr('x', 380) //gives x coordinate of label to left margin
  .attr('y', 25)// gives y coordinate of lable
  .style('fill', 'black') //styles the text to black
  .style("font", "30px times")
  .style("font-weight", "bold")
  .text('Cell Count Over Time'); //adds Dates as text


//Draw bars

let g = svg2.selectAll(".rect")
  .data(data)
  .enter()
  .append("g")
  .classed('rect', true)



g.append("rect")
  .attr('x', function(d) {
    return X(d); //makes the bars by date
  })
  .attr('y', function(d) {
    return Y1(d); //makes the y value humidity
  })
  .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
  .attr('fill', '#9370DB') //fills in the bar according to colormap
  .attr('height', function(d) {
    //console.log(X(d))
    return height - margin.bottom - Y1(d); //makes the height of the bar match its humidity
  })


  g.append("rect")
  .attr('x', function(d) {
   return X(d); //makes the bars by date
  })
  .attr('y', function(d) {
    return Y2(d); //makes the y value humidity
  })
  .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
  .attr('fill', '#3A1D90') //fills in the bar according to colormap
  .attr('height', function(d) {
    return height - margin.bottom - Y2(d); //makes the y value humidity
  })

  colors = ['#9370DB', '#3A1D90']
  values = [90, 113]

let legend = svg2.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(30," + values[i] + ")"; });

legend.append("rect")
  .attr("x", width - 400 )
  //.attr ("y", height2 + 20)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) {return colors[i];});

legend.append("text")
  .attr("x", width - 375 )
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .style("font", "20px times")
  .text(function(d, i) {
    switch (i) {
      case 0: return "Membrane Non-Intact Cells";
      case 1: return "Membrane Intact Cells";
    }
  });

  return chart;
}


  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor from the datum
  function Y1(d) {
    return yScale(y1Value(d));
  }

  function Y2(d) {
    return yScale(y2Value(d));
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

  chart.y1 = function (_) {
    if (!arguments.length) return y1Value;
    y1Value = _;
    return chart;
  };

  chart.y2 = function (_) {
    if (!arguments.length) return y2Value;
    y2Value = _;
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
