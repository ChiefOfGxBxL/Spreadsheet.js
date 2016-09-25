window.addEventListener('load', function() {
    var container = document.getElementById("container"), // have a div handy to hold the table
        rowInput = document.getElementById("rows"),
        colInput = document.getElementById("cols");
    
    function generateTable(row, col) {
        myTable = new Spreadsheet({
            rows: row,
            cols: col,
            context: container
        });
    }
    
    document.getElementById('generate').addEventListener('click', function() {
        container.innerHTML = ''; // first clear the previous spreadsheet
        
        generateTable(rowInput.value, colInput.value);
    });
    
    generateExamples();
    
    // Page on load
    generateTable(6, 8);
});

function generateExamples() {
    // Basic example
    var container = document.getElementById("basicSpreadsheet"); // have a div handy to hold the table
    myTable = new Spreadsheet({
        rows: 5,
        cols: 10,
        context: container
    });
    
    // Pre-populated spreadsheet
    var tableData = new Spreadsheet({
        context: document.getElementById('tableDataContainer'),
        data: [[1,3,5], [2,4,6], [10,20,30,40]]
    });
    
    // Event handlers
    var log = document.getElementById('log');
    var eventTable = new Spreadsheet({
        context: document.getElementById('eventSpreadsheet'),
        rows: 5,
        cols: 5,
        autofill: true,
        onCellValueChanged: function(cell, oldValue, newValue) {
            log.innerHTML += 'Value changed: ' + oldValue + ' -> ' + newValue + '\n';
        }
    });
}