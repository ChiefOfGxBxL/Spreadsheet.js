window.addEventListener('load', function() {
    var container = document.getElementById("container"), // have a div handy to hold the table
        rowInput = document.getElementById("rows"),
        colInput = document.getElementById("cols");
    
    function generateTable(row, col) {
        myTable = new Spreadsheet({
            rows: row,
            cols: col,
            context: container,
            onCellValueChanged: function(cell, old, newv) {
                console.log(old + '->' + newv);
            }
        });
    }
    
    document.getElementById('generate').addEventListener('click', function() {
        container.innerHTML = ''; // first clear the previous spreadsheet
        
        generateTable(rowInput.value, colInput.value);
    });
    
    // Page on load
    generateTable(6, 8);
});