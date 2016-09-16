/**
    Spreadsheet.js
    by Greg Lang
    
    A simple javascript library to easily create
    and utilize tables that act as worksheets.

    https://github.com/ChiefOfGxBxL/Spreadsheet.js
*/

function Spreadsheet(options) {
    // Public
    this.name = options.context.getAttribute('name');
    this.table = document.createElement('table'); // defined below by Initialization
    this.table.name = 'SpreadsheetJs-' + this.name;
    
    
    // Event-handlers
    this.onCellValueChanged = (options.onCellValueChanged) ? options.onCellValueChanged : function() {};
    this.onCellClick = (options.onCellClick) ? options.onCellClick : function() {};
    this.onCellDblClick = (options.onCellDblClick) ? options.onCellDblClick : function() {};
    this.onCellFocused = (options.onCellFocused) ? options.onCellFocused : function() {};
    this.onNewRow = (options.onNewRow) ? options.onNewRow : function() {};
    this.onNewCol = (options.onNewCol) ? options.onNewCol : function() {};
    
    
    // Private variables
    var _rowCount = (options.data) ? options.data.length : options.rows,
        _colCount = (options.data) ? (function() {
            var longestRow = 0;
            options.data.forEach(function(row) {
                if(row.length > longestRow) {
                    longestRow = row.length;
                }
            });
            return longestRow;
        })() : options.cols,
        _rowCounter = 0, // for labeling the rows with their row number
        _alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        self = this, // set to this object; allows functions to bypass functional scope and access the Spreadsheet
        oldCellValue; // used to track value for event handler onCellValueChanged
    
    // Private functions
    function tdDblClick(e) {
        self.onCellDblClick(e.target);
    }
    
    function tdBlur(e) {
        e.target.contentEditable = false;
        e.target.className = e.target.className.replace(/cellFocus/, '').trim();
        
        // Call off event handler for onCellValueChanged
        var newCellValue = e.target.textContent;
        if(newCellValue !== oldCellValue) {
            self.onCellValueChanged(e.target, oldCellValue, newCellValue); // only called on change
        }
        oldCellValue = null;
    }
    
    function tdClick(e) {
        // remove cellFocus class from all other cells that may have this class
        self.unfocusCells();
        self.focusCell(e.target);
        
        self.onCellClick(e.target);
    }
    
    function tdKeyPress(e) {
        if(e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            e.target.blur();
            deselectAllText();
        }
        else if(e.key === 'Tab' || e.keyCode === 9) {
            e.preventDefault();
            e.target.blur();
            self.unfocusCells();
            
            var colOfTable = e.target.cellIndex,
                rowOfTable = e.target.parentElement.rowIndex,
                rowCount = self.getRowCount(),
                colCount = self.getColCount(),
                prevCell, nextCell;
            
            if(e.shiftKey) {
                // go backward one cell
                if(rowOfTable === 1 && colOfTable === 1) {
                    // in top-left of table, cannot move backward any more
                    return;
                }
                else {
                    if(colOfTable > 1) {
                        prevCell = self.selectCell(rowOfTable - 1, colOfTable - 2);
                    }
                    else {
                        prevCell = self.selectCell(rowOfTable - 2, colCount - 1);
                    }
                    
                    self.focusCell(prevCell);
                }
            }
            else {
                // go forward one cell
                if(rowOfTable === rowCount && colOfTable === colCount) {
                    // We are on the last cell, and thus cannot tab to a next cell
                    return;
                }
                else {
                    if(colOfTable < colCount) {
                        // can select cell in next column
                        nextCell = self.selectCell(rowOfTable - 1, colOfTable);
                    }
                    else {
                        // overflow on column, go to next row starting at the 1st column
                        nextCell = self.selectCell(rowOfTable, 0);
                    }
                    
                    self.focusCell(nextCell);
                }
            }
        }
    }
    
    function deselectAllText() {
        if(document.body.createTextRange) {
            // TODO: ms
        }
        else if(window.getSelection) {
            var selection = window.getSelection();
            selection.removeAllRanges();
        }
    }
    
    function selectText(element) {
        /*    Special thanks to Eswar Rajesh Pinapala for this cross-browser snippet
            Reference: https://stackoverflow.com/questions/11128130/select-text-in-javascript
        */
        var range,
            selection;
        
        if (document.body.createTextRange) { // ms
            range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        }
        else if (window.getSelection) { // moz, opera, webkit
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    
    
    // Methods
    this.addRow = function() {
        var tr = document.createElement('tr'),
            tdRowCount = document.createElement('td'),
            colC,
            td;
        
        tdRowCount.className = 'SpreadsheetJs-gray';
        tdRowCount.innerHTML = ++_rowCounter;
        tr.appendChild(tdRowCount);
        
        for(colC = 0; colC < _colCount; colC++) {
            td = document.createElement('td');
            if(options.autofill && options.autofill === true) {
                td.innerHTML = Math.floor(Math.random() * 10);
            }
            
            // event handlers
            td.ondblclick = tdDblClick;
            td.onblur = tdBlur;
            td.onclick = tdClick;
            td.onkeypress = tdKeyPress;
            
            tr.appendChild(td);
        }
        
        this.table.tBodies[0].appendChild(tr);
        
        this.onNewRow();
    };
    
    this.addCol = function() {
        if(_colCount === 702) {
            return; // Spreadsheet.js can go up to column ZZ = 26^2 + 26
        }
        
        var newTh = document.createElement('th'),
            newTd,
            i;
        
        newTh.innerHTML = numToLetterBase(_colCount + 1);
        this.table.tHead.children[0].appendChild(newTh);
        
        // iterate through each row and add a td as necessary
        for(i = 0; i < this.getRowCount(); i++) {
            newTd = document.createElement('td');
            if(options.autofill && options.autofill === true) {
                newTd.innerHTML = Math.floor(Math.random() * 10);
            }
            
            // event handlers
            newTd.ondblclick = tdDblClick;
            newTd.onblur = tdBlur;
            newTd.onclick = tdClick;
            newTd.onkeypress = tdKeyPress;
            
            this.table.tBodies[0].children[i].appendChild(newTd);
        }
        
        _colCount += 1;
        
        this.onNewCol();
    };
    
    this.selectCell = function(row, col) {
        // selectCell(0, 0) -> table.children[1].children[1]
        return this.table.tBodies[0].children[row].children[col+1];
    };
    
    this.cellContent = function(row, col) {
        if(arguments.length === 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            // Row and col provided
            return this.table.tBodies[0].children[row].children[col+1].textContent;
        }
        else if(arguments.length === 1 && typeof arguments[0] === 'string') {
            // Cellname provided, e.g. "G15"
            var cell = parseCellname(arguments[0]), // e.g. [A, 4] or [ZZ, 157]
                letterPart = letterBaseToNum(cell[0]),
                digitPart = cell[1];
            
            if(cell[0].length > 2) { // check the length of the column
                return; // Spreadsheet.js only supports cellnames up to ZZ (which is 702 columns!)
            }
            
            return this.cellContent(digitPart-1, letterPart-1);
        }
        else {
            // Unsupported arguments supplied to this function call
            console.warn('Invalid arguments supplied to cellContent: Expected (<int> row, <int> col) OR (<string> cellname)');
        }
    };
    
    // this.tabulateData = function() {} // output data in a useful form, ex. CSV
    
    this.focusCell = function(cellElement) {
        self.unfocusCells();
        
        cellElement.classList.add('cellFocus');
        cellElement.contentEditable = true;
        cellElement.focus();
        
        selectText(cellElement);
        
        oldCellValue = cellElement.textContent; // start listening for a change in the cell's content for onCellValueChanged
        self.onCellFocused(cellElement);
    };
    
    this.unfocusCells = function() {
        var cellFocusNodes = (self.table).querySelectorAll('td.cellFocus'),
            i;
        
        if(cellFocusNodes.length === 0) {
            return; // no nodes are selected, so just exit the function
        }
        
        for(i = 0; i < cellFocusNodes.length; i++) {
            cellFocusNodes[i].classList.remove('cellFocus');
        }
    };
    
    
    // Accessors and Mutators
    this.getRows = function() {
        var arrayOfRows = [],
            tBodyRow;
        
        // Add <thead> elements to the collection
        arrayOfRows.push(self.table.tHead.children[0]);
        
        // Finally add all <tbody> rows
        for(tBodyRow in self.table.tBodies[0].children) {
            arrayOfRows.push(self.table.tBodies[0].children[tBodyRow]);
        }
        
        return arrayOfRows;
    };
    
    this.getCols = function() {
        var columns = [],
            tHeadChildren = self.table.tHead.children[0].children,
            tBodyRows = self.table.tBodies[0].children,
            i,
            row,
            colInRow;
        
        // Create an empty array for each column
        for(i = 0; i < tHeadChildren.length; i++) {
            columns.push([]);
        }
        
        for(row = 0; row < tBodyRows.length; row++) {
            // For each row, iterate through elements and add to the appropriate column
            for(colInRow = 0; colInRow < tBodyRows[row].children.length; colInRow++) {
                columns[colInRow].push(tBodyRows[row].children[colInRow]);
            }
        }
        
        return columns;
    };
    
    this.getRowCount = function() { return _rowCount - options.rows; };
    this.getColCount = function() { return _colCount; };
    this.getSize = function() { return [_rowCount - options.rows, _colCount]; };
    
    // this.lock = function() {};
    // this.unlock = function() {};
    
    
    // Helpers
    function numToLetterBase(n) {
        if(n > 702) {
            return; // cannot go past ZZ, which is (26)^2 + 26
        }
        else if(n <= 26) {
            return _alphabet[n];
        }
        else {
            var x = [0, n];
            while(x[1] > 26) {
                x[1] -= 26;
                x[0] += 1;
            }
          
            return (_alphabet[x[0]] + _alphabet[x[1]]).trim();
        }
    }
    
    function letterBaseToNum(s) {
        if(s.length > 2) {
            return;
        }
        
        if(s.trim().length === 1) {
            return _alphabet.indexOf(s.trim());
        }
        
        return _alphabet.indexOf(s.substr(0, 1))*26 + _alphabet.indexOf(s.substr(1));
    }
    
    function parseCellname(c) {
        /* parseCellname(c)
            Takes a cell name c, and splits it up into a duple containing the
            'letterPart' and the 'numberPart'.
            
            Ex. A7 -> [A, 7]
                G15 -> [G, 15]
        */
        var index = c.search(/\d/); // Finds first occurrence of digit
        return [c.substr(0, index), c.substr(index)];
    }
    
    
    // Initialization
    (function(c, table, self) {
        table.name = 'SpreadsheetJs-' + c.name;
        table.className = 'SpreadsheetJs';
        
        // header
        var thead = document.createElement('thead'),
            tbody = document.createElement('tbody'),
            tr = document.createElement('tr'),
            grayCell = document.createElement('th'),
            th,
            i,
            r,
            dataRow,
            dataCol;
            
        grayCell.innerHTML = ' ';
        
        tr.appendChild(grayCell);
        for(i = 0; i < _colCount; i++) {
            th = document.createElement('th');
            th.innerHTML = numToLetterBase(i+1);
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        
        table.appendChild(thead);
        table.appendChild(tbody);
        
        // add rest of rows; self.addRow will add each new row to the <tbody>
        for(r = 0; r < _rowCount; r++) {
            self.addRow();
        }
        
        // If data is provided, populate the spreadsheet with its values
        if(options.data) {
            for(dataRow = 0; dataRow < options.data.length; dataRow++) {
                // populate each row in the table
                for(dataCol = 0; dataCol < _colCount; dataCol++) {
                    tbody.children[dataRow].children[dataCol+1].innerHTML = (options.data[dataRow] && options.data[dataRow][dataCol]) ? options.data[dataRow][dataCol] : '';
                }
            }
        }
        
        c.appendChild(table);
    })(options.context, this.table, this);
}
