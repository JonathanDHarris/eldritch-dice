describe("Die constructor", function() {
	var die = new Die();
	
	it("creates a die with a value and initial value between 1 and 6 and bumped is false", function() {
		expect(die.val).not.toBe(null);
		expect(die.initialVal).not.toBeNull;
		
		expect(die.val >= 1).toBe(true);
		expect(die.val <= 6).toBe(true);
		expect(die.initialVal >= 1).toBe(true);
		expect(die.initialVal <= 6).toBe(true);
		
		expect(die.bumped).toEqual(false);
	});
	
	it("creates a die that can be bumped", function() {
		die.val = 1;
		die.bump();
		expect(die.val).toEqual(2);
		expect(die.bumped).toEqual(true);
	});
	
	it("creates a die that cannot be bumped twice in a row", function() {
		die.bump();
		expect(die.val).toEqual(2);
		expect(die.bumped).toEqual(true);
	});
	
	it("creates a die that cannot be bumped twice in a row unless it is re-rolled", function() {
		die.roll();
		expect(die.bumped).toEqual(false);
		die.val = 1;
		die.bump();
		expect(die.val).toEqual(2);
		expect(die.bumped).toEqual(true);
	});
	
	it("always results in a value between 1 and 6 when re-rolled", function () {
		for (var n = 0; n < 100; n++) {
			die.roll();
			expect(die.val >= 1).toBe(true);
			expect(die.val <= 6).toBe(true);
		}
	});
	
});


describe("Test funcA when re-rolls are available", function() {
	var diceGame, diceArray, spy = null;
	
	var intialReRolls = 3;
	
	beforeEach(function() {
		diceGame = new DiceGame();

		diceGame.numReRoll = intialReRolls;
		
		diceArray = [];
		
		var d = new Die();
		
		diceArray.push(d);
		diceArray.push(new Die());
		diceArray.push(new Die());
		diceArray.push(new Die());
		
		diceArray[0].val = 4;
		diceArray[1].val = 4;
		diceArray[2].val = 4;
		diceArray[3].val = 4;

		spy = spyOn(d, 'roll');
		
	});
	
    it("will re-roll die", function() {
		window.funcA(diceArray, diceGame);
		expect(spy).toHaveBeenCalled();
    });
	
    it("reduces game object's rerolls by one", function() {
		window.funcA(diceArray, diceGame);
		expect(diceGame.numReRoll).toEqual(intialReRolls - 1);
    });
});

describe("Test funcA when all rolls are above target", function() {
	var diceGame, diceArray, spy = null;
	
	var intialReRolls = 3;
	
	beforeEach(function() {
	diceGame = new DiceGame();

		diceGame.numReRoll = intialReRolls;
		
		diceArray = [];
		
		var d = new Die();
		
		diceArray.push(d);
		diceArray.push(new Die());
		diceArray.push(new Die());
		diceArray.push(new Die());
		
		diceArray[0].val = 5;
		diceArray[1].val = 5;
		diceArray[2].val = 6;
		diceArray[3].val = 6;

		spy = spyOn(d, 'roll');
		
	});
	
    it("does not re-roll dice", function() {
		window.funcA(diceArray, diceGame);
		expect(spy).not.toHaveBeenCalled();
    });
	
    it("does not reduce game object's re-rolls", function() {
		window.funcA(diceArray, diceGame);
		expect(diceGame.numReRoll).toEqual(intialReRolls);
    });
});

describe("Test funcA when no re-rolls are available", function() {
	var diceGame, diceArray, spy = null;
	
	var intialReRolls = 0;
	
	beforeEach(function() {
		diceGame = new DiceGame();

		diceGame.numReRoll = intialReRolls;
		
		diceArray = [];
		
		var d = new Die();
		
		diceArray.push(d);
		diceArray.push(new Die());
		diceArray.push(new Die());
		diceArray.push(new Die());
		
		diceArray[0].val = 4;
		diceArray[1].val = 4;
		diceArray[2].val = 4;
		diceArray[3].val = 4;

		spy = spyOn(d, 'roll');
		
	});
	
    it("does not re-roll dice", function() {
		window.funcA(diceArray, diceGame);
		expect(spy).not.toHaveBeenCalled();
    });
	
    it("does not reduce game object's re-rolls", function() {
		window.funcA(diceArray, diceGame);
		expect(diceGame.numReRoll).toEqual(intialReRolls);
    });
});

describe("Test funcB when no re-rolls available", function() {
	var diceGame, diceArray, spy1, spy2 = null;
	
	var intialReRolls = 0;
	
	beforeEach(function() {
		diceGame = new DiceGame();

		diceGame.numReRoll = intialReRolls;
		
		var d1 = new Die();
		var d2 = new Die();
		
		// note the actual game will expect the array to be sorted
		diceArray = [];
		
		diceArray.push(d1);
		diceArray.push(new Die());
		diceArray.push(d2);
		diceArray.push(new Die());
		
		diceArray[0].val = 1;
		diceArray[1].val = 4;
		diceArray[2].val = 1;
		diceArray[3].val = 5;

		spy1 = spyOn(d1, 'roll').and.callThrough();
		spy2 = spyOn(d2, 'roll').and.callThrough();
		
	});
	
    it("will still re-roll each 1", function() {
		window.funcB(diceArray, diceGame);
		expect(spy1).toHaveBeenCalled();
		expect(spy2).toHaveBeenCalled();
    });
	
	 it("will not allow any 1s to remain", function() {
		returnArray = window.funcB(diceArray, diceGame);
		expect(returnArray.some(x => x === 1)).toBe(false);
    });
});

describe("Test funcC when no re-rolls are available", function() {
	var diceGame, diceArray, spy1, spy2, spy3, spy4 = null;
	
	var intialReRolls = 0;
	
	var returnVal = 1;
	
	beforeEach(function() {
		diceGame = new DiceGame();

		diceGame.numReRoll = intialReRolls;
		
		var d1 = new Die();
		
		var d2 = new Die();
		
		var d3 = new Die();
		
		var d4 = new Die();
		
		diceArray = [];
		
		diceArray.push(d1);
		diceArray.push(d2);
		diceArray.push(d3);
		diceArray.push(d4);
		
		diceArray[0].val = 4;
		diceArray[1].val = 4;
		diceArray[2].val = 6;
		diceArray[3].val = 6;

		spy1 = spyOn(d1, 'roll').and.callThrough();
		spy2 = spyOn(d2, 'roll').and.callThrough();
		spy3 = spyOn(d3, 'roll').and.callThrough();
		spy4 = spyOn(d4, 'roll').and.callThrough();
		
	});
	
    it("still re-rolls dice below target", function() {
		returnArray = window.funcC(diceArray, diceGame);
		
		expect(spy1.calls.count() > 0).toBe(true);
		expect(spy2.calls.count() > 0).toBe(true);
		
		if (returnArray[0].val < diceGame.target) {
			expect(returnArray[0].val).not.toBe(returnArray[1].val);
		}
    });
	
    it("does not re-roll dice above target", function() {
		returnArray = window.funcC(diceArray, diceGame);
		
		expect(spy3.calls.count() > 0).toBe(false);
		expect(spy4.calls.count() > 0).toBe(false);
		
		expect(returnArray[2].val).toBe(6);
		expect(returnArray[3].val).toBe(6);
    });
});

describe("Test bumpA when bumps are available", function() {
	var diceGame, diceArray, spy1, spy2, spy3, spy4 = null;
	
	var initialBumps = 3;
	
	beforeEach(function() {
		diceGame = new DiceGame();

		diceGame.numBump = initialBumps;
		
		diceGame.scoreArray[1] = -1;
		
		var d1 = new Die();
		var d2 = new Die();
		var d3 = new Die();
		var d4 = new Die();
		
		diceArray = [];
		
		diceArray.push(d1);
		diceArray.push(d2);
		diceArray.push(d3);
		diceArray.push(d4);
		
		diceArray[0].val = 1;
		diceArray[1].val = 4;
		diceArray[2].val = 4;
		diceArray[3].val = 5;
		
		diceArray[1].bumped = true;
		
		spy1 = spyOn(d1, 'bump').and.callThrough();
		spy2 = spyOn(d2, 'bump').and.callThrough();
		spy3 = spyOn(d3, 'bump').and.callThrough();
	});
	
    it("bumps dice only when it will increase score", function() {
		returnArray = window.bumpA(diceArray, diceGame);
		expect(returnArray[0].val).toBe(2);
		expect(returnArray[2].val).toBe(5);
		expect(returnArray[3].val).toBe(5);
    });
	
    it("uses up game object's bumps", function() {
		window.bumpA(diceArray, diceGame);
		expect(diceGame.numBump).toBe(initialBumps - 2);
    });
	
	it("will not bump dice that have already been bumped even it would increase score", function() {
		window.bumpA(diceArray, diceGame);
		expect(returnArray[1].val).toBe(4);
    });
});

describe("Test bumpA when no bumps are available", function() {
	var diceGame, diceArray = null;
	
	var initialBumps = 0;
	
	beforeEach(function() {
		diceGame = new DiceGame();

		diceGame.numBump = initialBumps;
		
		diceGame.scoreArray[1] = -1;
		
		diceArray = [1, 4, 5];
	});
	
    it("does not bump dice even if it would increase score", function() {
		returnArray = window.bumpA(diceArray, diceGame);
		expect(returnArray[0]).toBe(1);
		expect(returnArray[1]).toBe(4);
		expect(returnArray[2]).toBe(5);
    });
	
    it("does not use up game-object's bumps", function() {
		window.bumpA(diceArray, diceGame);
		expect(diceGame.numBump).toBe(initialBumps);
    });
});

describe("Test results row constructor", function() {
	var numDice = 2;
	var testRow = null;
	
    it("returns results array of zeros with length equal to twice the number of dice + 1", function() {
		testRow = new ResultRow(numDice);
		expect(testRow.results.length).toBe((2 * numDice) + 1);
		expect(testRow.results.some(x => x != 0)).toBe(false);

    });
});

describe("The game object", function() {
	var diceGame, totalSuccesses = null;
	
	beforeEach(function () {
		diceGame = new DiceGame();

		diceGame.verbose = false;

		diceGame.maxReRoll = 0;
		diceGame.maxBump = 0;

		diceGame.numDice = 3;
		diceGame.target = 5;

		// Note we don't push any re-roll or bump functions.
	});
	
	it("each sim returns a number of successes between 0 and twice the number of dice", function() {
		
		for (var n = 0; n < 50; n++) {
			totalSuccesses = diceGame.doOneSim();
			
			expect(totalSuccesses >= 0).toBe(true);
			expect(totalSuccesses <= (2 * diceGame.numDice)).toBe(true);
		}
	});
});