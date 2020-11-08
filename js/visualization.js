// Immediately Invoked Function Expression to limit access to our
// variables and prevent
((()  => {

   // Load the data from a csv file
  d3.csv('data/project.csv').then(data =>

   // Create a bar chart given x and y attributes, labels, offsets; 
   // a dispatcher (d3-dispatch) for selection events; 
   // a div id selector to put our svg in; and the data to use.
  barchart = barChart()
   .x (d => d.Date)
   .y1(d => +d.TCC)
   .y2(d => +d.ICC)
   .xLabel('Date')
   .yLabel('Cell Count')
   .yLabelOffset(40)
  ('#barChart', data)

)

})());
