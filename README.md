# Spreadsheet.js
_A small javascript library for creating spreadsheet style tables_


## Features
 * Create tables, large and small
 * Columns labeled by letters (A,B,...,AA,...ZZ); rows labeled with line numbers
 * Add new columns and rows
 * Easily select cells by spreadsheet-style names (A5, G15, etc.)
 * Tab through cells to quickly edit them in succession
 * Attach event-handlers to table and cell events


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

![](https://github.com/ChiefOfGxBxL/Spreadsheet.js/blob/master/screenshots/Spreadsheet_Basic.PNG)

#### Select a cell
```javascript
myTable.selectCell(0,0); // select the cell in the top-left most corner
myTable._("G7"); // select the cell in column G, row 7
```
Note that when selecting cells, you may only select "content cells". That is, it is not possible to select the header cells marked by letters or the row numberings. These are included with .getRows and .getCols, however:

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
Simply __click__ the cell and type something in.
Skip to the next cell using your 'Tab' key, or 'Shift-Tab' to go back a cell:

![](https://github.com/ChiefOfGxBxL/Spreadsheet.js/blob/master/screenshots/Spreadsheet_Tab.png)

#### Event handlers
Spreadsheet.js includes event handlers for developers to hook into. Below are the available events:
```
// Cell events
onCellValueChanged(cell,oldValue,newValue)
onCellClick(cell)
onCellDblClick(cell)
onCellFocused(cell)

// Table events
onNewRow()
onNewCol()

// USAGE EXAMPLE - Try editing a cell in your table and see the event handler in action!
myTable.onCellValueChanged = function(cell,old,new) {
	console.log("A cell value was changed from " + old + " to " + new + "!");
}
```

## Contributing
Help would be greatly appreciated. Feel free to grab a task from the issue tracker, or suggest your own improvement!

Create a fork of this repository, claim some issues and work on them, and then submit a merge request!


## License
Spreadsheet.js is available under the [MIT License](http://opensource.org/licenses/MIT).
