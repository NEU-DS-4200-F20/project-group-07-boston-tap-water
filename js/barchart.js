// Initialize a bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function barChart(){

    let xValue = d => d[0]
    //console.log(xValue)
    let y1Value = d => d[1],
    y2Value = d => d[2],
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear();
    let margin = {
      top: 100,
      bottom: 30,
      left: 90,
      right: 30
    };
  let width = 750 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;
  let dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data){
    //loads the data into the console
    //console.log(data);

    //finds the maximum date for x axis
    let maxDate  = d3.max(data, d => xValue(d));
    //finds the minimum date for x axis
    let minDate  = d3.min(data, d => xValue(d));
     // finds the max meantemp for y axis
    let maxCount = d3.max(data, d => y1Value(d));

    //prints out these values in console
    //console.log(maxDate, minDate, maxCount, d3.max(data, d => y2Value(d)));

    let svg2 = d3.select('#barchart')
    .append('svg')
    // scale visualization according to the size of the page.
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .style('background-color', '#fff') // change the background color to white
    .attr('viewBox', [0, 0, width + margin.left + margin.right , height + margin.top + margin.bottom].join(' '))

    //Define scales
    yScale
    .domain([0,maxCount]) //sets the y axis to scale count from min to max
    .range([height - margin.bottom, margin.top]); //formats the axis so it is

    xScale
    .domain(
      data.map(function(d) {
        return xValue(d);
      }) // makes the x values the dates
    )
    .range([margin.left, width - margin.right]) //scales it to fit between the left and right margins
    .padding(0.5);


  //Draw axis
  let yAxis = svg2
    .append('g')
    .attr('transform', `translate(${margin.left},0)`) //positions the y axis on the left margin
    .style("font", "20px")
    .call(d3.axisLeft().scale(yScale))

    //Add label
    .append('text')
    .attr('y', -35) // gives y coordinate of label
    .attr('x', -135) //gives x coordinate of label
    .style('fill', 'black') //styles the text to black
    .attr('font-size', 15)
    .attr("transform", "rotate(270)")
    .text('Cell Count (cells/microliter)') //adds cell count as axis label


  let xAxis = svg2
    .append('g')
    //positions the x axis on the bottom margin
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .style("font", "20px")
    .call(d3.axisBottom().scale(xScale))

    //Add label
    .append('text')
    .attr('x', 340) //gives x coordinate of label to left margin
    .attr('y', 40)// gives y coordinate of lable
    .attr('font-size', 15)
    .style('fill', 'black') //styles the text to black

    .text('Dates'); //adds Dates as text

  // Add a title to the chart
  let title = svg2
    .append('g')
    .append('text')
    .attr('x', 260) //gives x coordinate of label to left margin
    .attr('y', 50)// gives y coordinate of lable
    .style('fill', 'black') //styles the text to black
    .style("font", "30px")
    .style("font-weight", "bold")
    .text('Cell Count Over Time'); //adds Cell Count Over Time as text

    colors = ['#9370DB', '#3A1D90']
    values = [90, 113]

  // append a legend onto the chart
  let legend = svg2.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + values[i] + ")"; });

  // append the boxes in the legenc
  legend.append("rect")
    .attr("x", 350)
    //.attr ("y", height2 + 20)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors[i];});

  // append the text to the legenc
  legend.append("text")
    .attr("x", 373)
    .attr("y", 10)
    .attr("dy", ".15em")
    .attr("font-size", "12px")
    .style("text-anchor", "start")
    .style('fill', 'black')
    .text(function(d, i) {
      switch (i) {
        case 0: return "Membrane Non-Intact Cells";
        case 1: return "Membrane Intact Cells";
      }
    });

    svg2.call(brush);

  //Draw bars
  let rects = svg2.selectAll(".rect")
    .data(data)
    .enter()
    .append("g")
    .classed('rect', true)

  selectableElements = rects;


  heatmap(['3/1/19', '3/15/19', '4/2/19', '5/7/19', '5/24/19', '6/11/19', '6/28/19', '7/16/19', '8/2/19', '8/20/19', '9/6/19']) 

  // append top bar (light purple)

  let clicked = false;

  //rects = g.enter()
    rects.append("rect")
    .attr('id', function(d){
      str = "rect1" + xValue(d)
      return str.replace(new RegExp('/', 'g'), "_")
    })
    .attr('x', function(d) {
      //console.log(X(d))
      return X(d); //makes the bars by date
    })
    .attr('y', function(d) {
      return Y1(d); //makes the y value humidity
    })
    .attr('width', xScale.bandwidth()) //spaces the bars along the xScale object
    .attr('fill', '#9370DB') //fills in the bar according to colormap
    .attr('height', function(d) {
      return height - margin.bottom - Y1(d); //makes the height of the bar match its humidity
    })
    .on('click', function(event, d) {

      //d3.select('#' + r).node().parentNode.classed('selected', true)
      d3.select(this.parentNode).classed('selected', true)
      //d3.select('#' + r).attr("class", 'selected')
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

      dispatcher.call(dispatchString, this, svg2.selectAll('.selected').data());

      groups = svg2.selectAll('.selected').data()
        let set = []
        for(i=0; i < groups.length; i++) { //makes subset of data with corresponding date
          set.push(groups[i].Date)
        }
        console.log(set)
        clear_heatmap()
        heatmap(set)
      //rects.classed('selected', d=> X(d))
      //highlight()
     /* if (clicked == true) {
        clear_heatmap()
        clicked = false
      }
      console.log(xValue(d))
      heatmap(xValue(d))
      clicked = true
*/
    })
    .on("mouseover", mouseoverTop)
    .on("mouseout", mouseoutTop);

    // append bottom bar (darker purple)
    rects.append("rect")
    .attr('id', function(d){
      str = "rect2" + xValue(d)
      return str.replace(new RegExp('/', 'g'), "_")
    })
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
    .on('click', function(data, d) {
      //console.log(d)
      d3.select(this.parentNode).classed('selected', true)
      //d3.select('#' + r).attr("class", 'selected')
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

      dispatcher.call(dispatchString, this, svg2.selectAll('.selected').data());

      groups = svg2.selectAll('.selected').data()
        let set = []
        for(i=0; i < groups.length; i++) { //makes subset of data with corresponding date
          set.push(groups[i].Date)
        }
        console.log(set)
        clear_heatmap()
        heatmap(set)
      //d3.select('#rect2' + xValue(d)).classed('selected', true)
      //rects.classed('selected', d=> X(d))
      //highlight()

      /*if (clicked == true) {
        clear_heatmap()
        clicked = false
      }
      console.log(xValue(d))
      heatmap(xValue(d))
      clicked = true
*/
    })
    .on("mouseover", mouseoverBottom)
    .on("mouseout", mouseoutBottom);


    // Highlight points when brushed
    function brush(g) {
      const brush = d3.brush()
        //.on("click", highlight)
        .on('start brush', highlight)
        .on('end', brushEnd)
        .extent([
          [-margin.left, -margin.bottom],
          [width + margin.right, height + margin.top]
        ]);

      ourBrush = brush;

      g.call(brush); // Adds the brush to this element

      // Highlight the selected circles.
      function highlight(event, d) {

        if (event.selection === null) return ;
        //if(event.selection === )
        const [
          [x0],
          [x1]
        ] = event.selection;

        rects.classed('selected', d =>
          x0 <= X(d) && X(d) <= x1
          //&& x0 >= X(d) && X(d) >= x1
          //&& y0 <= Y2(d) && Y2(d) <= y1
        );

        //console.log(d3.select(".rect").classed('selected', true))

        // Get the name of our dispatcher's event
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

        // Let other charts know
        //console.log(svg2.selectAll('.selected').data())

        /*groups = svg2.selectAll('.selected').data()
        let set = []
        for(i=0; i < groups.length; i++) { //makes subset of data with corresponding date
          set.push(groups[i].Date)
        }
        console.log(set)
        clear_heatmap()
        heatmap(set)*/

        dispatcher.call(dispatchString, this, svg2.selectAll('.selected').data());

      }

      function brushEnd(event, d) {
        // We don't want infinite recursion
        groups = svg2.selectAll('.selected').data()
        let set = []
        for(i=0; i < groups.length; i++) { //makes subset of data with corresponding date
          set.push(groups[i].Date)
        }
        console.log(set)
        clear_heatmap()
        if (set.length == 0) { 
          heatmap(['3/1/19', '3/15/19', '4/2/19', '5/7/19', '5/24/19', '6/11/19', '6/28/19', '7/16/19', '8/2/19', '8/20/19', '9/6/19']) 
        } 
        else { 
          heatmap(set)
        }

        if(event.sourceEvent !== undefined && event.sourceEvent.type!='end'){
          d3.select(this).call(brush.move, null);
        }
      }
    }


    function mouseoverTop(event,d) {
      div.transition()
      .duration(0)
      .style("opacity", 0.9);
      div.html("Non-Intact Cell Count: " + (y1Value(d) - y2Value(d)))
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("width", "100px")
      .style("height", "50px")
      .style("font-size", "16px");
    }
    function mouseoutTop(d) {
      div.transition()
      .duration(0)
      .style("opacity", 0);
    };

    function mouseoverBottom(event,d) {
      div.transition()
      .duration(0)
      .style("opacity", 0.9);
      div.html("Intact Cell Count: " + y2Value(d))
      .style("left", (event.pageX) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("width", "100px")
      .style("height", "35px")
      .style("font-size", "16px");
    }
    function mouseoutBottom(d) {
      div.transition()
      .duration(0)
      .style("opacity", 0);
    };

    return chart;
}

  // The x-accessor from the datum
  function X(d) {
    return xScale(xValue(d));
  }

  // The y1-accessor from the datum (Non-Intact cells)
  function Y1(d) {
    return yScale(y1Value(d));
  }

  // The y2-accessor from the datum (Intact cells)
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
