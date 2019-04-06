//GLOBAL VARIABLES
var table; //contains csv file in a table structure

var characterStories = []; //array of array where each element is in the form [character, [array of stories]]
var characters = []; //array of objects 'Character' that contains characters

//color variables 
var colors = []; //colors to use in character circles and central circle 
var backgroundColor;
var strokeColor; 
var textColor;  

//circles position 
var centralCircleX, centralCircleY; //central circle
var charactersX; //characters x position
var storiesX; //stories x position

//radius variables
var centralRadius, charactersRadius, storiesRadius;

var font; 

var isOpen = false; //flag to know if the central circle is showing characters
var isClicked = false; //flag to know if the mouse has clicked on the central circle 

var lerpValue = 0.05; 
//------------------------------------------------
function preload() {
    table = loadTable('data/mille_notte.csv', 'csv', 'header'); //load file csv in a table structure

    font = loadFont('data/GloriaHallelujah.ttf'); //load font 
}

//------------------------------------------------
function setup() {
    pixelDensity(displayDensity());
    createCanvas(windowWidth, windowHeight); 
    textFont(font);

    //radius settings relatively to window height
    centralRadius = floor(height/9); //~80 in full screen
    charactersRadius = floor(height/12); //~60 in full screen
    storiesRadius = floor(height/72); //~10 in full screen

    //central circles position settings
    centralCircleX = centralRadius + 20;
    centralCircleY = height/2;

    //characters and stories x position
    charactersX = 500;
    storiesX = 850;

    defineColor();

    getData();

    createCharacters();
}

//------------------------------------------------
function draw() {
    background(backgroundColor); 
    drawGraph(); 
}

//------------------------------------------------
function defineColor() {
    colorMode(HSB);

    colors = [
            color(60, 80, 100), //yellow (central circle)
            color(359, 89, 89), //red
            color(207, 70, 72), //blue
            color(118, 58, 69), //green
            color(292, 52, 64), //purple
            color(30, 100, 100) //orange
            ]; 

    backgroundColor = color(60, 17, 100); //the same color of the other visualization
    strokeColor = color(20, 98, 33); //the same color of the other visualization //color(0, 0, 0); //black
    textColor = color(0, 0, 100); //white
}

//------------------------------------------------
function getData() {
    //nickname columns
    var colStory = 0; 
    var colCharacter = 3;

    var isCharacterInserted; //flag to know if a character is already inside the array

    //fill the array 'characterStories'
    for(var i = 0; i < table.getRowCount(); i++) {

        //nickname values extracted from the table
        var character = table.getString(i, colCharacter); 
        var story = table.getString(i, colStory);
        isCharacterInserted = false;   

        //if the character is already in the array, add his story
        for(var j = 0; j < characterStories.length; j++) {

            if(characterStories[j][0] == character) {
                isCharacterInserted = true; 
                characterStories[j][1].push(story);
                break;
            }
        }

        //if the character is not in the array yet, add him and his story
        if(!isCharacterInserted) {
            characterStories.push(new Array(character, new Array(story)));
        }
    }

    filterData(); //delete from the array the character 'nessuno' and all the characters with only one story
}

//------------------------------------------------
function filterData() {
    //delete from the array 'characterStories' the character 'nessuno' and the characters with only one story 
    for(var i = 0; i < characterStories.length; i++) {

        //delete element with character name 'nessuno'
        if(characterStories[i][0] == "nessuno") {
            characterStories.splice(i, 1);
        }

        //delete elements with characters with only one story
        if(characterStories[i][1].length == 1) {
            characterStories.splice(i, 1);
            i--; //needed to control all indexes also when an element is removed 
        }
    }
}

//------------------------------------------------
function createCharacters() {
    //every character is an object 'Character'
    for(var i = 0; i < characterStories.length; i++) {
        var c = new Character(characterStories[i][0]); 
        var s = characterStories[i][1];
        c.indexColor = i+1;
        c.radius = charactersRadius; 
        
        //every Character story is an object 'Story' and it's pushed in the property character 'stories'
        for(var j = 0; j < s.length; j++) {
            var story = new Story(s[j])
            story.radius = storiesRadius;
            c.stories.push(story);
        }

        characters.push(c); 
    }

    setCharacters(charactersX); //update x and y characters properties 

    setStories(storiesX); //update x, y and colorHSB stories properties
}

//------------------------------------------------
function setCharacters(posX) {
    var step = height/characters.length; //vertical distance from different characters
    var posY = step - charactersRadius - 10; 

    //compute x and y properties of every object 'Character'.
    //Initially, characters are positioned behind the central circle
    //Their final position is saved in properties 'finalX' and 'finalY'
    for(var i = 0; i < characters.length; i++) {
        characters[i].x = centralCircleX; 
        characters[i].y = centralCircleY; 

        characters[i].finalX = posX;  
        characters[i].finalY = posY; 
        posY += step;
    }
}

//------------------------------------------------
function updateCharacters() {

    //compute x and y properties of every object 'Character' 
    for(var i = 0; i < characters.length; i++) {
        characters[i].x = lerp(characters[i].x, characters[i].finalX, lerpValue);  
        characters[i].y = lerp(characters[i].y, characters[i].finalY, lerpValue); 
    }
    
}

//------------------------------------------------
function rewindCharacters() {

    //compute x and y properties of every object 'Character' 
    for(var i = 0; i < characters.length; i++) {
        characters[i].x = lerp(characters[i].x, centralCircleX, lerpValue);  
        characters[i].y = lerp(characters[i].y, centralCircleY, lerpValue); 
    }
    
}

//------------------------------------------------
function setStories(posX) {
    var totalStories = countStories(); //total number of stories 
    var numStories = 0; //number of stories of a character
    var h, s, b, newS; //variables to manage color
    var step = height/totalStories; //vertical distance from different stories
    var posY = step - storiesRadius - 5; 

    for(var i = 0; i < characters.length; i++) {

        numStories = characters[i].stories.length;
        newS = floor(100/numStories);

        //update colorHSB property.
        //stories has the same color of their character with a different saturation
        h = hue(colors[characters[i].indexColor]);
        s = newS;
        b = brightness(colors[characters[i].indexColor]);

        //compute x and y properties of every object 'Story' inside each character.
        //Initially, stories are positioned behing their characters when they are visible 
        //Their final position is saved in properties 'finalX' and 'finalY'
        for(var j = 0; j < characters[i].stories.length; j++){
            characters[i].stories[j].x = characters[i].x; 
            characters[i].stories[j].y = characters[i].y;

            characters[i].stories[j].finalX = posX; 
            characters[i].stories[j].finalY = posY; 

            characters[i].stories[j].colorHSB = color(h, s, b); //update colorHSB property

            posY += step;
            s += newS; 
        }
    }
}

//------------------------------------------------
function updateStories(character) {

    //compute x and y properties of the object 'Character' 
    for(var i = 0; i < character.stories.length; i++) {
        character.stories[i].x = lerp(character.stories[i].x, character.stories[i].finalX, lerpValue);  
        character.stories[i].y = lerp(character.stories[i].y, character.stories[i].finalY, lerpValue); 
    }
    
}

//------------------------------------------------
function rewindStories(character) {

    //compute x and y properties of the object 'Character' 
    for(var i = 0; i < character.stories.length; i++) {
        character.stories[i].x = lerp(character.stories[i].x, character.x, lerpValue);  
        character.stories[i].y = lerp(character.stories[i].y, character.y, lerpValue); 
    }
    
}

//------------------------------------------------
function rewindAllStories() {

    //compute x and y properties of every object 'Character' 
    for(var i = 0; i < characters[i].length; i++) {
        for(var j = 0; j < characters[i].stories.length; j++) {
            characters[i].stories[j].x = lerp(characters[i].stories[j].x, characters[i].finalX, lerpValue);  
            characters[i].stories[j].y = lerp(characters[i].stories[j].y, characters[i].finalY, lerpValue); 
        }
    }
    
}

//------------------------------------------------
//Return the total of stories 
function countStories() {
    var counter = 0; 

    for(var i = 0; i < characters.length; i++) {
        counter += characters[i].stories.length; 
    }

    return counter; 
} 

//------------------------------------------------
function mouseClicked() {
    //check if the mouse has clicked on the central circle 
    if(checkHover(centralCircleX, centralCircleY, centralRadius)) {
        for(var i = 0; i < characters.length; i++) {
            characters[i].visible = !characters[i].visible; 
        }
        isOpen = !isOpen; 
        isClicked = true; 
    } else {
        isClicked = false; 
    } 
    
    //check if the mouse has clicked on a character circle
    for(var i = 0; i < characters.length; i++) {
        //if the mouse has clicked on a character circle AND the character is drawn
        //AND the character position is different from the central circle position 
        //AND the central circle has not clicked... 
        if(checkHover(characters[i].x, characters[i].y, characters[i].radius) && isOpen &&
            characters[i].x > centralCircleX + 30 && !isClicked) {
            for(var j = 0; j < characters[i].stories.length; j++) {
                characters[i].stories[j].visible = !characters[i].stories[j].visible;
            }
        }
    }
}

//------------------------------------------------
//Flag to know if the mouse is hover the circle with params passed as arguments 
function checkHover(x, y, r) {
    var d = dist(mouseX, mouseY, x, y); 

    if(d < r) {
        return true; 
    } else {
        return false; 
    }
}


