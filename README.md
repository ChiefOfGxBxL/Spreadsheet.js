# Spreadsheet.js
_A small javascript library for creating spreadsheet style tables_


## Features
 * Create tables, large and small
 * Columns labeled by letters (A,B,...,AA,...ZZ); rows labeled with line numbers
 * Add new columns and rows
 * Easily select cells by spreadsheet-style names (A5, G15, etc.)
 * Tab through cells to quickly edit them in succession
 * Attach event-handlers to table events (some implemented, others still under development)


## Usage
#### Creating a table
```html
<link rel='stylesheet' type='text/css' href='Spreadsheet.css'/>
<script src='Spreadsheet.js'></script>
```
```javascript
var container = document.getElementById("container"); // have a div handy to hold the table
myTable = new Spreadsheet(container,10,5); // create a table in 'container' with 10 rows, 5 columns
```
By default, cells will be filled in with random values between 0 and 9

#### Select a cell
```javascript
myTable.selectCell(0,0); // select the cell in the top-left most corner
myTable._("G7"); // select the cell in column G, row 7
```
Note that when selecting cells, you may only select "content cells". That is, it is not possible to select the header cells marked by letters or the row numberings. These may be selected with .getRows and .getCols, however:

#### Select all rows / columns
```
myTable.getRows();
myTable.getCols();
```

#### Size of table
These should be self-explanatory
```javascript
myTable.getRowCount();
myTable.getColCount();
myTable.getSize(); // returns a duple: [row,col]
```

#### Edit a cell
Simply __double click__ the cell and type something in

## Contributing
Help would be greatly appreciated. Feel free to grab a task below or make your own improvements.
(Contributing guidelines / code guidelines will be posted soon)


## Open tasks..
 * Event handlers
 * Options object-literal (that is, myTable.options = {})
 * Delete rows, columns
 * Drag to resize column sizes
 * Lock and unlock the table (toggle read-only)
 * Copy and paste data
 * Code refactoring


## License
Spreadsheet.js is available under the [MIT License](http://opensource.org/licenses/MIT).
