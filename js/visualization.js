// Immediately Invoked Function Expression to limit access to our
// variables and prevent
((()  => {

  d3.csv('data/project.csv').then(data =>


  barchart = barChart()
   .x (d => d.Date)
   .y1(d => +d.TCC)
   .y2(d => +d.ICC)
   .xLabel('Date')
   .yLabel('Cell Count')
   .yLabelOffset(40)
   //.selectionDispatcher(d3.dispatch(dispatchString))
  ('#barChart', data)

)

})());
