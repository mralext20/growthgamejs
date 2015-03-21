var growth = require("./Growth");
var rls = require("readline-sync");
var _ = require("underscore");
var colors = require("colors");
var fs = require("fs");

function Game() {
	this.growth = new growth.Growth();
}

Game.prototype.help = function() {
	var hlp = fs.readFileSync("res/help.txt");
	console.log(hlp.toString());
};

Game.prototype.promptLoop = function() {
	if (this.growth.hunger >= 100) {
		// died of hunger
		console.log(">> You have died of hunger!".red.bold);
		console.log(">> All of your items have been lost.".red);

		this.growth.hunger = 0;
		this.growth.inventory = {};
	}
	console.log();
	console.log(">> Hunger: " + this.growth.hunger.toString().yellow + "/100");
	console.log(">> We are currently at " + this.growth.locationName().green);
	console.log(">> Available travel locations: " + this.growth.availableLocations().toString().green);
	console.log(">> We can: " + this.growth.availableActions().toString().green);
	if (this.growth.hunger > 25 && this.growth.hunger < 50) {
		console.log(">> You are a little bit hungry.".green);
	} else if (this.growth.hunger > 50 && this.growth.hunger < 75) {
		console.log(">> You are hungry. Time to eat, perhaps?".yellow);
	} else if (this.growth.hunger > 75) {
		console.log(">> You are REALLY hungry. If you don't eat soon, you'll die of starvation.".red);
	}
	var input = rls.question("> ");

	if (input === "help") {
		this.help();
	} else if (input == "stock") {
		if (Object.keys(this.growth.inventory).length == 0) {
			console.log(">> " + "Your pockets are empty.".red);
		} else {		
			var thiz = this;
			Object.keys(this.growth.inventory).forEach(function(key) {
				console.log(">> " + key.yellow + ": " + thiz.growth.inventory[key]);
			});
		}
	} else if (input == "save") {
		this.growth.save();
	} else if (input == "load") {
		this.growth.load();
	}

	if (_.include(this.growth.availableActions(), input)) {
		// action started
		this.growth.action(input);
	}

	var sw = input.split(" ");

	// global actions
	if (sw[0] === "travel") {
		loc = sw[1];
		if (loc != undefined) {
			if (_.include(this.growth.availableLocations(), loc)) {
				this.growth.travel(loc); // we can travel, so travel
			} else {
				console.log(">> Unknown location \"" + loc + "\".");
			}
		}
	} else if (sw[0] == "eat") {
		var food = sw[1];
		if (_.include(Object.keys(this.growth.inventory), food)) {
			if (this.growth.isFood(food)) {
				this.growth.hunger -= this.growth.getFoodRestorationPoints(food);
				if (this.growth.hunger < 0) this.growth.hunger = 0;
				console.log(">> Ate 1 " + food.green + ".");

				this.growth.inventory[food] -= 1;
				if (this.growth.inventory[food] == 0) {
					delete this.growth.inventory[food]; // remove food if none left
				}
			} else {
				console.log(">> " + ("Eat " + food + "?! Are you crazy?!").yellow);
			}
		} else {
			console.log(">> " + ("You don't have \"" + food + "\".").red);
		}
	}
	this.promptLoop();
};

Game.prototype.begin = function() {
	this.promptLoop();
};

new Game().begin();