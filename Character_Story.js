//class Character
function Character(name) {
	//PROPERTIES
	this.x = 0; 
	this.y = 0; 
	this.radius = 0; 
	this.name = name; 
	this.indexColor = 0;
	this.stories = []; 
	this.visible = false; 
	this.finalX = 0; 
	this.finalY = 0; 

	//METHODS
	//draw the object 
	this.show = function() {
		strokeWeight(2);
		circle(this.x, this.y, this.radius); 
	}

	//write name property of the object
	this.showText = function(colorText) { 
		textAlign(CENTER, CENTER);
		rectMode(CENTER);
		textSize(this.radius/5); 
		text(this.name, this.x, this.y, this.radius/0.5, this.radius/1.2);
	}
}

//class Story
function Story(name) {
	//PROPERTIES
	this.x = 0; 
	this.y = 0; 
	this.radius = 0; 
	this.name = name;
	this.colorHSB = 0;
	this.visible = false;
	this.finalX = 0; 
	this.finalY = 0;   

	//METHODS
	this.show = function(radius) {
		strokeWeight(2);
		circle(this.x, this.y, radius);
	}

	this.showText = function(colorText) { 
		textAlign(LEFT, CENTER); 
		textSize(13);
		text(this.name, this.x + this.radius + 5, this.y - 4);
	}
}