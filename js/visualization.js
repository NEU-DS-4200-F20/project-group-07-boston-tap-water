// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((()  => {

  d3.csv('data/project.csv').then(data => 


  barchart = barChart()
   .x (d => d.Date)
   .y(d => d.TCC)
   .xLabel('Date')
   .yLabel('Cell Count')
   .yLabelOffset(40)
   //.selectionDispatcher(d3.dispatch(dispatchString))
  ('#barChart', data)

)

})());