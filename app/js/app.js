'use strict';

/* App Module */

var diceApp = angular.module('diceApp', [
  'ngAnimate',
  'diceControllers',
]);


diceApp.factory('sheetFactory', function() {
	return new Sheet();
});

diceApp.factory('gameFactory', function() {
	return new DiceGame();
});