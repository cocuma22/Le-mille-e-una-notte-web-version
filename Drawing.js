//------------------------------------------------
function drawGraph() {

    drawStories(); 

    drawCharacters(); //draws each character

    drawFirstCircle(); 


}

//------------------------------------------------
//draw character circles 
function drawCharacters() { 
    for(var i = 0; i < characters.length; i++) {
        //if characters are visible... 
        if(characters[i].visible) {
            updateCharacters();
        } else {
            rewindCharacters(); 
        }

        //draw circles
        stroke(strokeColor);
        fill(colors[characters[i].indexColor]);
        characters[i].show(charactersRadius); //draw a circle for each character
    
        //draw texts
        fill(textColor);
        characters[i].showText(textColor); //write the name of each character
        
        //links are drawn only if characters circles are outsize central circle position
        if(characters[i].x > centralCircleX + 20) {
            //draw link from central circle to the character 
            drawLink(centralCircleX, centralCircleY, centralRadius, characters[i]);
        }
    } 
}

////------------------------------------------------
function drawFirstCircle() {
    //color and stroke settings 
    strokeWeight(2);
    stroke(strokeColor);
    fill(colors[0]); 

    circle(centralCircleX, centralCircleY, centralRadius); //central circle

    //text settings
    fill(textColor);
    stroke(strokeColor);
    textAlign(CENTER, CENTER);
    textSize(centralRadius/4); //~20 in full screen

    text("Personaggi", centralCircleX, centralCircleY);
}

//------------------------------------------------
//draw stories circles 
function drawStories() {
    for(var i = 0; i < characters.length; i++) {

        //if characters are visible... 
        if(characters[i].visible){
            for(var j = 0; j < characters[i].stories.length; j++) { 
                //if stories of the character 'i' are visible...
                if(characters[i].stories[j].visible) {
                    updateStories(characters[i]);
                } else {
                    rewindStories(characters[i]); 
                }

                //texts are visible only if circles stories are drawn nead their final x position
                if(characters[i].stories[j].x > characters[i].stories[j].finalX - 50) {
                    //draw texts
                    fill(strokeColor);
                    noStroke();
                    characters[i].stories[j].showText(textColor);
                }

                //stories circles are drawn only if their positions is outsize their characters position
                if(characters[i].stories[j].x > characters[i].x + 20){
                    //draw circles
                    fill(characters[i].stories[j].colorHSB);
                    strokeWeight(2);
                    stroke(strokeColor);
                    characters[i].stories[j].show(storiesRadius);
                    
                    //draw link from central circle to the character 
                    drawLink(characters[i].x, characters[i].y, characters[i].radius, characters[i].stories[j]);
                }
            }
        } else {
            //if characters are not visible, stories positions are updated relatively to their characters position
            setStories(storiesX);
        }
    }
}

//------------------------------------------------
function drawLink(startX, startY, startR, circle) {
    var distort = 500; 

    //stroke and fill settings
    strokeWeight(2);
    //stroke(strokeColor);
    noFill();
    
    curve(startX + startR - distort, startY, 
            startX + startR, startY, //real start
            circle.x - circle.radius, circle.y, //real end
            circle.x - circle.radius + distort, circle.y);

}



