var colors = require("colors");
var sleep = require("sleep").sleep;
var ProgressBar = require("progress");
var fs = require("fs");
var _ = require("underscore");

function Growth() {
	this.inventory = {};
	this.money = 0;
	this.location = 0;
	this.hunger = 0;

	this.foods = ["meat"];
}

Growth.prototype.getFoodRestorationPoints = function(food) {
	switch(food) {
		case "meat":
			return 25;
			break;
	}
};

// current location as string
Growth.prototype.locationName = function() {
	switch (this.location) {
		case 0:
			return "home";
			break;
		case 1:
			return "forest";
			break;
	}
};

Growth.prototype.isFood = function(food) {
	return _.include(this.foods, food);
};

Growth.prototype.travel = function(where) {
	this.progress("Traveling...", 1);
	this.location = this.nameToLocationID(where);
	this.hunger += 2; // get more hungry
};

Growth.prototype.nameToLocationID = function(name) {
	switch (name) {
		case "home":
			return 0;
			break;
		case "forest":
			return 1;
			break;
	}
};

Growth.prototype.load = function() {
	console.log(">> " + "Reading save data...".rainbow);
	var f = fs.readFileSync("profile.json");
	console.log(">> " + "Parsing save data...".rainbow);
	var data = JSON.parse(f);

	this.inventory = data["Growth"]["player"]["inventory"];
	this.money = data["Growth"]["player"]["money"];
	this.location = data["Growth"]["global"]["location"];
	this.hunger = data["Growth"]["player"]["stats"]["hunger"];

	console.log(">> " + "Load complete!".rainbow);
};

Growth.prototype.save = function() {
	var savef = {
		Growth: {
			player: {
				inventory: this.inventory,
				money: this.money,
				stats: {
					hunger: this.hunger
				}
			},

			global: {
				location: this.location
			}
		}
	};

	console.log(">> " + "Writing save data...".rainbow);
	fs.writeFileSync("profile.json", JSON.stringify(savef, null, "\t"));
	console.log(">> " + "Save complete!".rainbow);
};

Growth.prototype.progress = function(description, seconds, callback) {
	var bar = new ProgressBar(description.blue + " [:bar]", {
		total: seconds,
		complete: "█".green,
		width: 20,
		incomplete: " ",
	});

	for (var i = 0; i != seconds; i++) {
		bar.tick();
		sleep(1);
	}

	if (callback != null && callback != undefined)
		callback();
};

Growth.prototype.action = function(action) {
	if (this.location == 0) {
		// home

		if (action == "relax") {
			this.progress("Relaxing...", 2);

			console.log(">> You kick your feet up on the couch and relax.");
		}
	} else if (this.location == 1) {
		// forest

		if (action == "gather wood") {
			// gather wood
			this.progress("Cutting down wood...", 3);

			var ga = Math.floor(Math.random() * 100);
			if (ga < 20) ga = 20;

			console.log(">> You gather wood with your ax, and you gain " + ga.toString().yellow + " pieces of wood.");
			this.give("wood", ga);
			this.hunger += 4;
		} else if (action == "kill animals") {
			// kill animals
			this.progress("Slaying animals...", 7);

			var mt = Math.floor(Math.random() * 20);
			if (mt < 5) mt = 5;

			console.log(">> You killed some animals and gained " + mt.toString().yellow + " pieces of meat.");
			this.give("meat", mt);
			this.hunger += 3;
		} 
	}
};

Growth.prototype.availableActions = function() {
	switch(this.location) {
		case 0:
			return ["relax"];
			break;
		case 1:
			return ["gather wood", "kill animals"];
			break;
	}
};

// locations available to travel
Growth.prototype.availableLocations = function() {
	var location = this.location;

	switch (location) {
		case 0:
			return ["forest"];
			break;
		case 1:
			return ["home"];
			break;
	}
};

// gives item
Growth.prototype.give = function(item, amount) {
	if (this.inventory[item] === undefined) {
		this.inventory[item] = amount;
	} else {
		if (this.inventory[item] === -1) return; // unable to give; off limits

		if (typeof this.inventory[item] == "number")
			this.inventory[item] += amount;
	}
};

// gives money
Growth.prototype.earn = function(money) {
	this.money += money;
};

module.exports = {
	Growth: Growth,

	LOCATION_HOME: 0,
	LOCATION_FOREST: 1
};