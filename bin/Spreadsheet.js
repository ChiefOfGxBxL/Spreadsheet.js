/**
    Spreadsheet.js
    by Greg Lang
    
    A simple javascript library to easily create
    and utilize tables that act as worksheets.

    https://github.com/ChiefOfGxBxL/Spreadsheet.js
*/

function Spreadsheet(ctx, row, col) {
    const DEBUG = false;
    
    // Public
    this.name = ctx.getAttribute('name');
    this.table = document.createElement('table'); // defined below by Initialization
    this.table.name = 'Tablejs-' + this.name;
    
    
    // Private variables
    var _rowCount = row,
        _colCount = col,
        _rowCounter = 0,
        _alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        _this = this, // set to this object; allows functions to bypass functional scope and access the Spreadsheet
        oldCellValue; // used to track value for event handler onCellValueChanged
    
    
    // Private functions
    function tdDblClick(e) {
        // e.target.contentEditable = true;
        // e.target.focus();
        
        _this.onCellClick(e.target);
    }
    
    function tdBlur(e) {
        e.target.contentEditable = false;
        e.target.className = e.target.className.replace(/cellFocus/, '').trim();
        
        // Call off event handler for onCellValueChanged
        var newCellValue = e.target.textContent;
        if(newCellValue !== oldCellValue) {
            _this.onCellValueChanged(e.target, oldCellValue, newCellValue); // only called on change
        }
        oldCellValue = null;
    }
    
    function tdClick(e) {
        // remove cellFocus class from all other cells that may have this class
        _this.unfocusCells();
        _this.focusCell(e.target);
        
        _this.onCellClick(e.target);
    }
    
    function tdKeyPress(e) {
        if(DEBUG) {
            console.log(e);
        }
        
        if(e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            e.target.blur();
            deselectAllText();
        }
        else if(e.key === 'Tab' || e.keyCode === 9) {
            e.preventDefault();
            e.target.blur();
            _this.unfocusCells();
            
            var colOfTable = e.target.cellIndex,
                rowOfTable = e.target.parentElement.rowIndex,
                rowCount = _this.getRowCount(),
                colCount = _this.getColCount(),
                prevCell, nextCell;
            
            if(e.shiftKey) {
                // go backward one cell
                if(rowOfTable === 1 && colOfTable === 1) {
                    // in top-left of table, cannot move backward any more
                    return;
                }
                else {
                    if(colOfTable > 1) {
                        prevCell = _this.selectCell(rowOfTable - 1, colOfTable - 2);
                    }
                    else {
                        prevCell = _this.selectCell(rowOfTable - 2, colCount - 1);
                    }
                    
                    _this.focusCell(prevCell);
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
                        nextCell = _this.selectCell(rowOfTable - 1, colOfTable);
                    }
                    else {
                        // overflow on column, go to next row starting at the 1st column
                        nextCell = _this.selectCell(rowOfTable, 0);
                    }
                    
                    _this.focusCell(nextCell);
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
        
        tdRowCount.className = 'Tablejs-gray';
        tdRowCount.innerHTML = ++_rowCounter;
        tr.appendChild(tdRowCount);
        
        for(colC = 0; colC < _colCount; colC++) {
            td = document.createElement('td');
            td.innerHTML = Math.floor(Math.random()*10);
            
            // event handlers
            td.ondblclick = tdDblClick;
            td.onblur = tdBlur;
            td.onclick = tdClick;
            td.onkeypress = tdKeyPress;
            
            tr.appendChild(td);
        }
        
        this.table.tBodies[0].appendChild(tr);
        _rowCount += 1;
        
        return;
    };
    
    this.addCol = function() {
        if(_colCount === 702) {
            return; // Spreadsheet.js can go up to column ZZ = 26^2 + 26
        }
        
        var newTh = document.createElement('th'),
            newTd,
            i;
        
        newTh.innerHTML = numToLetterBase(++_colCount);
        this.table.tHead.children[0].appendChild(newTh);
        
        // iterate through each row and add a td as necessary
        for(i = 0; i < this.getRowCount(); i++) {
            newTd = document.createElement('td');
            newTd.innerHTML = Math.floor(Math.random()*10);
            
            // event handlers
            newTd.ondblclick = tdDblClick;
            newTd.onblur = tdBlur;
            newTd.onclick = tdClick;
            newTd.onkeypress = tdKeyPress;
            
            this.table.tBodies[0].children[i].appendChild(newTd);
        }
        
        this.onNewCol();
        return;
        
    };
    
    this.selectCell = function(row, col) {
        // selectCell(0, 0) -> table.children[1].children[1]
        return this.table.tBodies[0].children[row].children[col+1];
    };
    
    this.cellContent = function(row, col) {
        return this.table.children[row+1].children[col+1].textContent;
    };
    
    this._ = function(cellname) {
        var cell = parseCellname(cellname),
            letterPart,
            digitPart;
        
        if(cell[1].length > 2) {
            return; // Spreadsheet.js only supports cellnames up to ZZ (which is 702 columns!)
        }
        
        // ex. [A, 4] or [ZZ, 210]
        letterPart = letterBaseToNum(cell[0]);
        digitPart = cell[1];
        
        return this.cellContent(digitPart-1, letterPart-1);
    };
    
    // this.tabulateData = function() {} // output data in a useful form, ex. CSV
    
    this.focusCell = function(cellElement) {
        _this.unfocusCells();
        
        cellElement.className += ' cellFocus';
        cellElement.contentEditable = true;
        cellElement.focus();
        
        selectText(cellElement);
        
        oldCellValue = cellElement.textContent; // start listening for a change in the cell's content for onCellValueChanged
        _this.onCellFocused(cellElement);
    };
    
    this.unfocusCells = function() {
        var cellFocusNodes = (_this.table).querySelectorAll('td.cellFocus'),
            i;
        
        if(cellFocusNodes.length === 0) {
            return; // no nodes are selected, so just exit the function
        }
        
        for(i = 0; i < cellFocusNodes.length; i++) {
            cellFocusNodes[i].className = cellFocusNodes[i].className.replace(/cellFocus/, '').trim();
        }
    };
    
    
    // Accessors and Mutators
    this.getRows = function() {
        var holder = [],
            rowChildren = [],
            rowHolder = [],
            el,
            i;
        
        for(i in this.table.children) {
            rowChildren = (this.table.children[i].children);
            
            rowHolder = [];
            for(el in rowChildren) {
                if(rowChildren[el].textContent !== undefined) {
                    rowHolder.push(rowChildren[el].textContent);
                }
            }
            
            if(rowHolder.length) { holder.push(rowHolder); }
        }
        
        return holder;
    };
    
    this.getCols = function() {
        var holder = [],
            colHolder = [],
            j, i;
        
        for(j = 0; j < _colCount+1; j++) {
            colHolder = [];
            for(i = 0; i < this.table.children.length; i++) {
                colHolder.push(this.table.children[i].children[j].textContent);
            }
            holder.push(colHolder);
        }
        return holder;
        
    };
    
    this.getRowCount = function() { return _rowCount - row; };
    this.getColCount = function() { return _colCount; };
    this.getSize = function() { return [_rowCount - row, _colCount]; };
    
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
        table.name = 'Tablejs-' + c.name;
        table.className = 'Tablejs';
        
        // header
        var thead = document.createElement('thead'),
            tbody = document.createElement('tbody'),
            tr = document.createElement('tr'),
            grayCell = document.createElement('th'),
            th,
            i,
            r;
            
        grayCell.innerHTML = ' ';
        
        tr.appendChild(grayCell);
        for(i = 0; i < col; i++) {
            th = document.createElement('th');
            th.innerHTML = numToLetterBase(i+1);
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        
        table.appendChild(thead);
        table.appendChild(tbody);
        
        // add rest of rows; self.addRow will add each new row to the <tbody>
        for(r = 0; r < row; r++) {
            self.addRow();
        }
        
        c.appendChild(table);
        
        return table;
    })(ctx, this.table, this);
    
    
    // Event-handlers
        // Cell events
    this.onCellValueChanged = function(cell, oldValue, newValue) {};
    this.onCellClick = function(cell) {};
    this.onCellDblClick = function(cell) {};
    this.onCellFocused = function(cell) {};
    
        // Table events
    this.onNewRow = function() {};
    this.onNewCol = function() {};
}
