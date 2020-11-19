/* global D3 */

let dispatcher;

// Initialize a table.
function table() {
  // set the columns, selectableElements and dispatcher to their default values
  let columns = ['Date', 'Season', 'Temperature(degrees C)', 'pH', 'Chlorine(mg/L)', 'Ammonium(uM)', 'Nitrate(uM)', 'Nitrite(uM)']
  selectableElements = d3.select(null);
  
  
  // Create the chart by adding a table to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
  	var table = d3.select(selector)
  	.append('table')
  	.style("border", "1px black solid")
  	var thead = table.append('thead')
  	var	tbody = table.append('tbody');
  	
  
  	// append the header row
  	thead.append('tr')
  	  .selectAll('th')
  	  .data(columns).enter()
  	  .append('th')
  	    .text(function (column) { return column; });
  
  	// create a row for each object in the data
  	var rows = tbody.selectAll('tr')
  	  .data(data)
  	  .enter()
  	  .append('tr')
  	  .classed('selected', function(d) { return d._selected; })
  	 
      // mouse events called by dispatch
		.on('mousedown', function(d) {
		  dispatch.call('dragstarted', this)
		})
		.on('mousemove', function(d) {
		  dispatch.call('dragged', this)
		})
		.on('mouseup', function(d) {
		  dispatch.call('dragended', this)
		})
		.on('click', function(d) {
		  dispatch.call('clear', this)
		})
		
		
		
		selectableElements = rows;
      
  	// create a cell in each row for each column
  	var cells = rows.selectAll('td')
  	  .data(function (row) {
  	    return columns.map(function (d, i) {
  	      return {i: d, value: row[d]};
  	    });
  	  })
  	  .enter()
  	  .append('td')
  	    .text(function (d) { return d.value; })
  	    .enter()
  	 
  	 
  	 // declare dispatch and the fucntions called with it:   
  	  let dispatch = d3.dispatch('dragstarted', 'dragged', 'dragended', 'clear');
  	  
  	  // determines when the mouse is being held down
  	  let down= false;
  	  
  	  // mousedown function: resets all of the rows to not be selected and 
  	  // selects the given row
  	  dispatch.on('dragstarted', function() {
  	    down = true
  	    d3.selectAll('tr')
  	    .classed('selected', false)
  	    
        d3.select(this)
				.classed('selected', true);
  	  })
  	  
  	  // mousemove function: if the mouse is down and moving, the cells that are 
  	  // being dragged across are selected (and highlighted)
  	  dispatch.on('dragged', function() {
  	    if (down) {
				d3.select(this)
				.classed('selected', true)
				
				d3.selectAll('.selected')
				
				// Get the name of our dispatcher's event and tells the other graphs
				// what actions are occuring
				let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, table.selectAll('.selected').data());
        }
  	  })
  	  
  	  // mouseup function: the mouse is lifted so the down is set to false
  	  dispatch.on('dragended', function() {
        down = false
  	  })
  	  
  	  // click function: when the mouse is clicked on the table, all the rows 
  	  // should clear except the row was clicked
  	  dispatch.on('clear', function() {
  	    clicked = false
  	    
  	    d3.selectAll('tr')
			.classed('selected', false)
				
		d3.select(this)
			.classed('selected', true)
				
				// Get the name of our dispatcher's event and tells the other graphs
				// what actions are occuring
				let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
				dispatcher.call(dispatchString, this, table.selectAll('.selected').data());



  	  })
  	  
      
      
    return chart;
  }
  
  
  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) {
      
      return;
    }

    selectableElements.classed('selected', false)
    
    // Select an element if its datum was selected
    selectableElements.classed('selected', d =>
      selectedData.includes(d)
    );
  }
  
  
  return chart;
}
