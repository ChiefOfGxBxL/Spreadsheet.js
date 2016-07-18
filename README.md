# Spreadsheet.js
_A small javascript library for creating spreadsheet style tables_

[![](https://img.shields.io/badge/Demo-Live%20Demo-brightgreen.svg?style=flat-square)](https://chiefofgxbxl.github.io/Spreadsheet.js/) [![](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://opensource.org/licenses/MIT)

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
myTable = new Spreadsheet({
    rows: 5,
    cols: 10,
    context: container,
    onCellValueChanged: function(cell, old, newv) {
        console.log(old + '->' + newv);
    }
});
```
By default, cells will not be filled in with any data. If you'd like it to add some random numbers 0-9, set `autofill` to true.

![](https://github.com/ChiefOfGxBxL/Spreadsheet.js/blob/master/screenshots/Spreadsheet_Basic.PNG)

#### Options
Below are all of the options that can be specified when creating a spreadsheet, including event-handlers and table information. **Options preceded by an asterisk (*) are required**!
```javascript
options: {
    *rows: <Integer>,
    *cols: <Integer>,
    *context: <HTMLElement>,
    
    autofill: <Boolean>,
    
    // Event-handlers
    onCellValueChanged: <function(<HTMLElement> cell, <String> oldValue, <String> newValue)>,
    onCellClick: <function(<HTMLElement> cell)>,
    onCellDblClick: <function(<HTMLElement> cell)>,
    onCellFocused: <function(<HTMLElement> cell)>,
    onNewRow: <function()>,
    onNewCol: <function()>
}
```

#### Select a cell
```javascript
// Selecting a cell returns the <td> HTMLElement
// Note: row and col are 0-index based, so (0,0) corresponds to "A1"
myTable.selectCell(0,0); // select the cell in the top-left most corner

// Getting cell content can be done by using the below function
// Recommendation: Use the cell name when calling cellContent. While the 0-index based coordinates may be given, it can be more confusing and may lead to off-by-one errors
myTable.cellContent("G7"); // select the cell in column G, row 7
myTable.cellContent(6, 6); // select the cell in (6, 6), AKA "G7"
```
Note that when selecting cells, you may only select "content cells". That is, it is not possible to select the header cells marked by letters or the row numberings. These are included with .getRows and .getCols, however:

#### Select all rows / columns
```javascript
myTable.getRows(); // Returns an array of HTMLElement <tr>'s
myTable.getCols(); // Returns an array of columns, where each column is an array containing HTMLElement <td>'s
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
Skip to the next cell using your `Tab` key, or `Shift-Tab` to go back a cell:

![](https://github.com/ChiefOfGxBxL/Spreadsheet.js/blob/master/screenshots/Spreadsheet_Tab.png)

## Contributing
Help would be greatly appreciated. Feel free to grab a task from the issue tracker, or suggest your own improvement!

Create a fork of this repository, claim some issues and work on them, and then submit a merge request!


## License
Spreadsheet.js is available under the [MIT License](http://opensource.org/licenses/MIT).
