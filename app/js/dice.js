// Reroll if less than target
function funcA(dArr, diceGame) {
	if (diceGame.numReRoll > 0) {
		for (var i = 0; i < dArr.length; i++) {
			if (dArr[i].val < diceGame.target) {
				dArr[i].roll();
				diceGame.numReRoll--;
				return dArr;
			}
		}
	}
	return dArr;
}

// Reroll ones
function funcB(dArr, diceGame) {
	var i = 0;
	while (i < dArr.length) {
		if (dArr[i].val === 1) {
			dArr[i].roll();
		}
		else {
			i++;
		}
	}
	return dArr;
}

// Reroll doubles less than target
function funcC(dArr, diceGame) {
	var i = 0;
	while (i < dArr.length - 1) {
		if (dArr[i].val < diceGame.target && dArr[i].val === dArr[i+1].val) {
			dArr[i].roll();
			dArr[i+1].roll();
			dArr.sort(sortDice);
			i = 0;
		}
		else {
			i++;
		}
	}
	return dArr;
}

// Bump if higher value gives higher score (e.g. short of target, or on negative one)
function bumpA(dArr, diceGame) {
	for (var i = 0; i < dArr.length; i++) {
		if (diceGame.numBump > 0) {
			if (dArr[i].bumped === false && diceGame.scoreArray[dArr[i].val] < diceGame.scoreArray[dArr[i].val + 1]) {
				dArr[i].bump();
				diceGame.numBump--;
			}
		}
	}
	return dArr;
}

//	Constructors
function ResultRow(numDice) {
	var self = this;
	self.header = '';
	self.results = [];
	
	self.rowLength = (numDice * 2) + 1;
	
	// Initialise results array
	for (var i = 0; i < self.rowLength; i ++) {
		self.results.push(0);
	}
}

function ResultRows() {
	var self = this;
	
	self.rows = [];
	
	self.maxSuccesses = function() {
		var max = 0;
		
		var numRows = self.rows.length;
		for (var i = 0; i < numRows; i++) {
			for (var j = self.rows[i].rowLength - 1; j > 0; j--)
			{
				if (self.rows[i].results[j] > 0) {
					if (j + 1 > max) {
						max = j + 1;
						break;
					}
				}
			}
		}
		
		return max;
	}
}

function Die() {
	var self = this;
	
	self.val;
	
	self.roll = function() {
		self.bumped = false;
		self.val = Math.floor((Math.random() * 6) + 1);
	}
	
	self.roll(); // Get the inital value.
	
	self.initialVal = self.val;
	
	self.bumped = false;
	
	
	
	self.bump = function() {
		if (self.val < 6 && self.bumped === false) {
			self.val++;
			self.bumped = true;
		}
	}
}

function DiceGame() {
	var self = this;
	
	self.verbose = false;
	
	self.number_sims = 50000;

	self.maxReRoll = 0;
	self.maxBump = 0;

	self.numDice = 0;

	self.target = 5;

	self.funcArray = [];
	self.bumpArray = [];
	self.scoreArray = [0, 0, 0, 0, 0, 1, 1]; // Note zero is included as well
	
	self.doAllSims = function() {
		var self = this;
		
		self.resultsRows = new ResultRows(self.numDice);
		
		self.numReRoll = self.maxReRoll;
		self.numBump = self.maxBump;
		
		for (var nReRoll = self.maxReRoll; nReRoll >= 0; nReRoll--) {
			
			for (var nBump = self.maxBump; nBump >= 0; nBump--){
				var resultsRow = self.doSims(self.number_sims, nReRoll, nBump);
				self.resultsRows.rows.push(resultsRow);
			};
		};
				
		return self.resultsRows;
	}
	
	self.doSims = function(numSims, reRolls, bumps) {
		var self = this;
		
		var resultRow = new ResultRow(self.numDice);
		resultRow.header = 'With ' + reRolls + ' re-rolls and ' + bumps + ' nudges.'
			
		for (var i = 0; i < numSims; i++) {
			self.numReRoll = reRolls;
			self.numBump = bumps;
			var numSuccess = self.doOneSim();
			
			// Ones can count as negative, meaning negative successes.  Count this as zero successes.
			if (numSuccess >= 0) { 
				resultRow.results[numSuccess]++;
			}
			else {
				resultRow.results[0]++;
			}
		}
		
		for (var j = 0; j < resultRow.results.length; j++) {
			resultRow.results[j] /= numSims;
		}
		
		if (self.verbose) {
			document.writeln("</br>")
			document.writeln(resultRow.header);
			document.writeln("</br>")
			for (var j = 0; j < resultRow.results.length; j++) {
				document.writeln(j + ":");
				document.writeln(resultRow.results[j].toFixed(2));
				document.writeln("</br>")
			}
			document.writeln("</br>")
		}
		
		return resultRow;
	};
	
    self.doOneSim = function() {
	
		var dArray = [];
		dArray.print = function() {
			for (var i = 0; i < dArray.length; i++) {
				document.writeln(dArray[i].val) ;
			};
		}
		
		// Initial dice roll
		for (var i = 0; i < self.numDice; i++) {
			dArray.push(new Die());
		};
		
		dArray.sort(sortDice);
		
		if (self.verbose) {
			document.writeln("Intial roll:");
			document.writeln("</br>");
			dArray.print();
			document.writeln("</br>");
		};
		
		do {	
			for (var i = 0; i < self.funcArray.length; i++) {
				// Sort the dice, so ones would get rerolled first (important if ones count as negative)
				dArray.sort(sortDice);
				
				// Bump dice before applying each reroll rule
				for (j = 0; j < self.bumpArray.length; j++) {
					dArray = self.bumpArray[j](dArray, self) ;
				};
				
				// Do the next reroll rule
				dArray = self.funcArray[i](dArray, self) ;
			};
		} while ( self.numReRoll > 0  && dArray.some(x => x < self.target));
		
		if (self.verbose) {
			document.writeln("Final roll:");
			document.writeln("</br>");
			dArray.print();
			document.writeln("</br>");
			document.writeln("</br>");
		};
		
		var totalSuccess = 0;
		for (var i = 0; i < self.numDice; i++) {
			var diceResult = dArray[i].val;
			totalSuccess += self.scoreArray[diceResult];
		};
		
		return totalSuccess;
	};
}

// General functions

sortDice = function(a, b) {
	return a.val - b.val;
}

