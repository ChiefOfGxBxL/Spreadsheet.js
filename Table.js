/*
	Table.js (v0.7)
	by Greg Lang
	
	A simple javascript library to easily create
	and utilize tables that act as worksheets.

	https://github.com/ChiefOfGxBxL/Table.js
*/

function Table(ctx,row,col) {
	// Public
	this.name = ctx.getAttribute('name');
	this.table = document.createElement("table"); // defined below by initialization
		this.table.name = "Tablejs-" + this.name;
	
	
	
	// Protected variables
	var _rowCount = row;
	var _colCount = col;
	var _rowCounter = 0;
	var _alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	
	
	// Protected methods
	function tdDblClick(e) {
		e.target.contentEditable = true;
		e.target.focus();
	}
	function tdBlur(e) {
		e.target.contentEditable = false;
		e.target.className = e.target.className.replace(/cellFocus/,'').trim();
	}
	function tdClick(e) {
		// remove cellFocus class from all other cells that may have this class
		var cellFocusNodes = (e.target.parentNode.parentNode).querySelectorAll("td.cellFocus"); // grand-parent of <td> is <table>
		for(var i = 0; i < cellFocusNodes.length; i++) {
			cellFocusNodes[i].className = cellFocusNodes[i].className.replace(/cellFocus/,'').trim();
		}
		
		e.target.className += "cellFocus";
	}
	
	
	
	// Methods
	this.addRow = function() {
		
		var tr = document.createElement("tr");
		
		var td = document.createElement("td");
		td.className = 'Tablejs-gray'
		td.innerHTML = ++_rowCounter;
		tr.appendChild(td);
		
		for(var colC = 0; colC < _colCount; colC++) {
			var td = document.createElement("td");
			td.innerHTML = Math.floor(Math.random()*10);
			
			// event handlers
			td.ondblclick = tdDblClick;
			td.onblur = tdBlur;
			td.onclick = tdClick;
			
			tr.appendChild(td);
		}
		
		this.table.appendChild(tr);
		_rowCount += 1;
		
		return;
	};
	this.addCol = function() {
		if(_colCount == 702) return; // Table.js can go up to column ZZ = 26^2 + 26
		var newTh = document.createElement("th");
		newTh.innerHTML = numToLetterBase(++_colCount);
		this.table.children[0].appendChild(newTh);
		
		// iterate through each row and add a td as necessary
		for(var i = 1; i <= this.getRowCount(); i++) {
			var newTd = document.createElement("td");
			newTd.innerHTML = Math.floor(Math.random()*10);
			
			// event handlers
			newTd.ondblclick = tdDblClick;
			newTd.onblur = tdBlur;
			newTd.onclick = tdClick;
			
			this.table.children[i].appendChild(newTd);
		}
		
		this.onNewCol();
		return;
		
	}
	this.selectCell = function(row,col) {
		// selectCell(0,0) -> table.children[1].children[1]
		return this.table.children[row+1].children[col+1].textContent;
	}
	this._ = function(cellname) {
		var cell = parseCellname(cellname);
		if(cell[1].length > 2) return; // Table.js only supports cellnames up to ZZ (which is 702 columns!)
		
		// ex. [A,4] or [ZZ,210]
		var letterPart = letterBaseToNum(cell[0]);
		var digitPart = cell[1];
		
		return this.selectCell(digitPart-1,letterPart-1);
	}
	this.tabulateData = function() {} // output data in a useful form, ex. CSV
	
	
	
	// Accessors and Mutators
	this.getRows = function() {
		var holder = [];
		
		for(var i in this.table.children) {
			var rowChildren = (this.table.children[i].children);
			
			var rowHolder = [];
			for(var el in rowChildren) {
				if(rowChildren[el].textContent !== undefined) {
					rowHolder.push(rowChildren[el].textContent);
				}
			}
			
			if(rowHolder.length) { holder.push(rowHolder); }
		}
		
		return holder;
	};
	this.getCols = function() {
		var holder = [];
		
		for(var j = 0; j < _colCount+1; j++) {
			var colHolder = [];
			for(var i = 0; i < this.table.children.length; i++) {
				colHolder.push(this.table.children[i].children[j].textContent);
			}
			holder.push(colHolder);
		}
		return holder;
		
	};
	
	this.getRowCount = function() { return _rowCount - row; };
	this.getColCount = function() { return _colCount; };
	this.getSize = function() { return [_rowCount - row, _colCount]; };
	
	this.lock = function() {};
	this.unlock = function() {};
	
	
	
	// Helpers
	function numToLetterBase(n) {
		if(n > 702) return; // cannot go past ZZ, which is (26)^2 + 26
		var x = [0,n];
		var alphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		if(x[1] > 26) {
			while(x[1] > 26) {
				x[1] -= 26;
				x[0] += 1;
			}
		}

		return (alphabet[x[0]] + alphabet[x[1]]).trim();
	}

	function letterBaseToNum(s) {
		if(s.length > 2) return;
		
		var alphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		if(s.trim().length == 1) return alphabet.indexOf(s.trim());
		
		return alphabet.indexOf(s.substr(0,1))*26 + alphabet.indexOf(s.substr(1))
	}
	
	/* parseCellname(c)
		Takes a cell name c, and splits it up into a duple containing the
		'letterPart' and the 'numberPart'.
		
		Ex. A7 -> [A,7]
			G15 -> [G,15]
	*/
	function parseCellname(c) {
		var index = c.search(/\d/); // Finds first occurrence of digit
		
		return [c.substr(0,index), c.substr(index)];
	}
	
	
	
	// Initialization
	(function(c,table,self) {
		table.name = "Tablejs-" + ctx.name;
		table.className = "Tablejs";
		
		// header
		var tr = document.createElement("tr");
		var grayCell = document.createElement("th");
		grayCell.innerHTML = " ";
		tr.appendChild(grayCell);
		for(var i = 0; i < col; i++) {
			var th = document.createElement("th");
			th.innerHTML = _alphabet[i];
			tr.appendChild(th);
		}
		table.appendChild(tr);
		
		// add rest of rows
		for(var r = 0; r < row; r++) {
			self.addRow();
		}
		
		ctx.appendChild(table);
		
		return table;
	})(ctx,this.table,this)
	
	
	
	// Event-handlers
	// onCellEdited(cell,newValue,oldValue)
	// this.onCellClick = function(cell) {};
	// onCellFocused(cell)
	// onCellCreated(cell)
	this.onNewRow = function(){};
	this.onNewCol = function(){};
}