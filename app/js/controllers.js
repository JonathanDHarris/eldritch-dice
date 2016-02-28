'use strict';

/* Controllers */

var diceControllers = angular.module('diceControllers', []);

diceControllers.controller('diceMainCtrl', ['$scope','$timeout', 'gameFactory', function($scope, $timeout, gameFactory){
    
        var characterTexts = [];
	
	$scope.submit_dice = 1;
	$scope.submit_rerolls = 0;
	$scope.submit_nudges = 0;
	
	$scope.option_abc = "a";
	
	$scope.validated = true;
	
	$scope.header = '';
	
	$scope.resultsTable = [];
	
	$scope.game = gameFactory ;
	
	$scope.successRow = [];
	
	$scope.loading = false;
	
	$scope.newTable = function() {
		
		if ($scope.validate()) {
                    
                        $scope.randomCharacterText();
		
			$scope.loading = true;
			
			$scope.number_rows = (2 * $scope.submit_dice) + 1;
			$scope.number_cols = $scope.submit_dice * $scope.submit_rerolls;
			
			$scope.game.numDice = $scope.submit_dice;
			$scope.game.maxReRoll = $scope.submit_rerolls;
			$scope.game.maxBump = $scope.submit_nudges;
			
			if ($scope.option_abc === "b"){
				$scope.game.scoreArray = [0, 0, 0, 0, 1, 1, 1];
			}
			else if ($scope.option_abc === "c"){
				$scope.game.scoreArray = [0, 0, 0, 0, 0, 0, 1];
			}
			else {
				$scope.game.scoreArray = [0, 0, 0, 0, 0, 1, 1];
			}
				
			$scope.game.funcArray.push(funcA);
			
			$scope.game.bumpArray.push(bumpA);
			
			if ($scope.add_funcB) {
				$scope.game.funcArray.push(funcB)
			}
			
			if ($scope.add_funcC) {
				$scope.game.funcArray.push(funcC)
			}
			
			if ($scope.double_six) {
				$scope.game.scoreArray[6] = 2;
			}
			if ($scope.negative_one) {
				$scope.game.scoreArray[1] = -1;
			}
					
			$timeout($scope.runSims, 2000);
		}
	}
	
	$scope.validate = function() {
		if ($scope.submit_dice < 1
			|| $scope.submit_dice > 20
			|| !$scope.isInt($scope.submit_dice) 
			|| $scope.submit_rerolls < 0
			|| $scope.submit_rerolls > 20
			|| !$scope.isInt($scope.submit_rerolls)
			|| $scope.submit_nudges < 0
			|| $scope.submit_nudges > 20
			|| !$scope.isInt($scope.submit_nudges)){
				$scope.validated = false;
				return false;
		}
		
		$scope.validated = true;
		return true;
	}
	
	$scope.isInt = function(value) {
		return !isNaN(value)
			&& parseInt(Number(value)) == value
			&& !isNaN(parseInt(value, 10));
	}

	$scope.runSims = function() {
		$scope.resultsTable = $scope.game.doAllSims();
		
		$scope.generateColours();
		
		$scope.generateSuccessRow();
		
		$scope.loading = false;
	}
	
	$scope.generateColours = function () {
		var maxSuccesses = $scope.resultsTable.maxSuccesses();
		
		for (var j = 0; j < $scope.resultsTable.rows.length ; j++) {
			$scope.resultsTable.rows[j]['colours'] = [] ;
			for (var i = 0; i < maxSuccesses; i++) {
				var x = $scope.resultsTable.rows[j].results[i];
				
				var style = "{\"background-color\":\"" + $scope.getColor(x) + "\"}";
				
				$scope.resultsTable.rows[j].colours[i] = style;
			}
		}
	}
	
	$scope.getColor = function(value){
		//value from 0 to 1
		var hue=((value)*120).toString(10);
		return ["hsl(",hue,",100%,50%)"].join("");
	}

	
	$scope.generateSuccessRow = function() {
		$scope.successRow = [];
		
		var maxSuccesses = $scope.resultsTable.maxSuccesses();
		
		if (maxSuccesses > 0) {
			
			for (var i = 0; i < maxSuccesses; i++)
			{
				$scope.successRow.push(i);
			}
		}
	}
	
	$scope.randomCharacterText = function() {
            
            if (characterTexts.length === 0) {
                $scope.generateRandomCharacterTexts();
            }
            
            var i_text = Math.floor((Math.random() * characterTexts.length));
            
            $scope.characterText =  characterTexts[i_text];
        };
        
        $scope.generateRandomCharacterTexts = function() {
            
            characterTexts.push("Even as a child in Innsmouth, Silas had a special connection to the sea.  He's an able and well-reasoned man on land, but on the ocean he possesses a singular strength and wit.  It's earned him a sterling reputation in every port across the globe, particularly in Sydney, where Silas set ashore last night.  But this morning, the smell of the briny air carries dread as well as joy.  There is something in hsi past, something in Innsmouth, that he knows will some day catch up to him.");
            
            characterTexts.push("At first, Jacqueline's dreams of fire and destruction seemed like a curse.  Monsters ran rampant through city streets and some greater darkness loomed on the horizon.  However, she has recently learned to control her visions and observe events in detail.  Yesterday, she traveled from Boston to Minneapolis to explore an abandoned warehouse she'd seen in her dreams.  Inside, she found evidence of a terrible cult that had practice unspeakable rituals there.  Jacqueline hopes to use what she's learned to prevent the terrible future that haunts her sleep.");
            
            characterTexts.push("Hailed as a musical prodigy in her youth, Patrice has performed for royalty and society's brightest minds all around the world.  For years she thought that her conciousness simply drifted as she played, but she's come to believe that an intellligence exists behind her visions.  Somehow the notes form a brdige between her own mind and another.  The more she graps what her music exposes her to, the more afraid she's become.  After last night's concert in Sydney, she's finally decided to take action");
            
            characterTexts.push("Leo Anderson has spent his whole life getting into the deadliest and most obscue corners of the globe.  Along the way, he's lost good people.  Fever takes some; others are claimed by wild beasts.  After a recent, disastrous venture in the Yucatan, Leo barely made it back to Buenos Aires alive.  He's sick of buying the people who trusted him.  But the job's not done yet.  The world is in danger, and crying in his drink won't fix that.  He's picked up a little hired help here, and in the morning, he'll head back out into the wild.");
            
            characterTexts.push("Finn was making a good living, running liquor from Canada to cities all along the East Coast  He never got caught and never lost a delivery.  Now he has taken a job in Chicago and gave his word that he could get it done.  This time it won't be alcohol he's delivering, and it won't be the local sheriff trying to catch him.  Finn's caught up in some supernatural conspiracy, but in the end, he adheres to the same principles.  Deliver the goods.  Don't get caught.");
        };
  }]);
  