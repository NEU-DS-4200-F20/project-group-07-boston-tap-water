/* global D3 */

let dispatcher;

let c = false; // clicked
let t = d3.dispatch('start', 'hold', 'end');

t.on('start', function(){ // for single selection (one row) or start of drag
  d3.selectAll('tr').classed('selected', false); // "clear" (unselect/unhighlight) all rows
  d3.select(this).classed('selected', true); // select/highlight row that was clicked on
  c = true;

  let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0]; 
  
  groups = d3.select('table').selectAll('.selected').data()
  let set = []
  for(i=0; i < groups.length; i++) { //makes subset of data with corresponding date
      set.push(groups[i].Date)  
    }
    console.log(set)
    clear_heatmap()
    heatmap(set)
    
    
    // Get the name of our dispatcher's event
  dispatcher.call(dispatchString, this, d3.select('table').selectAll('.selected').data());
  
  
  
  // Let other charts know of selected item/row in table
})

t.on('hold', function(){ // for mouse drag action - selecting/highlighting multiple rows
  // Select/highlight each row only if mouse was already clicked previously
  if(c == true){
    d3.select(this).classed('selected', true);
  }
  let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
  
  groups = d3.select('table').selectAll('.selected').data()
  let set = []
  for(i=0; i < groups.length; i++) { //makes subset of data with corresponding date
      set.push(groups[i].Date)  
    }
    console.log(set)
    clear_heatmap()
  if(set.length !== 0) {
    
    heatmap(set)
  }
    
    // Get the name of our dispatcher's event
  dispatcher.call(dispatchString, this, d3.select('table').selectAll('.selected').data()); // Let other charts know of selected items/rows in table
})

t.on('end', function(){ // for end of click/drag, indicates end of selection(s)
  c = false;
})


function table(){

  let header = ['Date', 'Season', 'Temperature(degrees C)', 'pH', 'Chlorine(mg/L)', 'Ammonium(micromolar)', 'Nitrate(micromolar)', 'Nitrite(micromolar)']; // column names

  function tabulate(selector, data){

    let tbl = d3.select(selector).append('table')
    .style("border", "1px black solid")
    let thead = tbl.append('thead') // sets up table head (header row)
    let tbody = tbl.append('tbody'); // sets up table body

    // Appends header row
    thead.append('tr')
    .selectAll('th')
    .data(header) // loads column names initiated above
    .enter()
    .append('th')
    .text(function(column){return column;}); // adds text which displays each header name

    // Creates a row for each object in the data
    let rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')

    // Dispatches custom events defined above
    .on('mousedown', function(){t.call('start', this)}) // when mouse is down, invoke 'start' callback
    .on('mousemove', function(){t.call('hold', this)}) // when mouse is moved (i.e. dragged), invoke 'hold' callback
    .on('mouseup', function(){t.call('end', this)}) // when mouse is up/released, invoke 'end' callback

    // Creates a cell in each row for each column
    let cells = rows.selectAll('td')
    // Maps each column of data to corresponding header
    // & data value that falls under each row for each column
    .data(function(row){
      return header.map(function(column){
        return {column: column, value: row[column]};
      });
    })
    .enter()
    .append('td')
    .text(function(d){return d.value;}); // adds text to each cell that displays value from data

    return tabulate;

  }

  // Gets or sets the dispatcher we use for selection events
  tabulate.selectionDispatcher = function(_){
    if(!arguments.length) return dispatcher;
    dispatcher = _;
    return tabulate;
  };

  // Given selected data from another visualization
  // select the relevant elements here (linking)
  tabulate.updateSelection = function(selectedData){
    if(!arguments.length) return;
    // Select an element (table row) if its datum was selected
    d3.selectAll('tr').classed('selected', d =>
      selectedData.includes(d)
    );
  };

  return tabulate;

};
