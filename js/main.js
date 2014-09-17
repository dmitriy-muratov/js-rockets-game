$(document).ready(function () {

    var field;
    var rocket;

    //add field and rocket
    field=document.createElement("div");
    field.setAttribute("id", "field");
    document.getElementById("content").appendChild(field);
    var fieldOffsetLeft = field.offsetLeft;
    var fieldHeight = field.offsetHeight;
    var fieldWidth = field.offsetWidth;
    rocket=document.createElement("span");
    rocket.setAttribute("id", "rocket");
    document.getElementById("field").appendChild(rocket);
    var rocketHeight = field.offsetHeight;
    var rocketWidth = rocket.offsetWidth;


    // move bg
    var x = 0;
    var y = 0;
    function backgroundChange() {
        y += 1;
        document.getElementById("inner-content").style.backgroundPosition=x+'px '+y+'px';
        if (y > 1920) {
            y = 0;
        }
    }
    setInterval( backgroundChange, 60);

    //move rocket
    field.addEventListener("mousemove", moveHandler, false);
    function moveHandler(event) {
        var fieldLeft = event.clientX;
        var rocketWidth = rocket.offsetWidth;
        var rocketLeft = fieldLeft - fieldOffsetLeft - rocketWidth/2 + 'px';
        rocket.style.left = rocketLeft;
    }

    // missle
    var missleCount = 0;

    // add missle
    field.addEventListener("click", clickHandler, false);
    function clickHandler(event) {

        if(missleCount > 2) return;

        var missle = document.createElement("span");

        missle.setAttribute('class',"missle-item missle-item-" + missleCount++);
        document.getElementById("field").appendChild(missle);
        missle.style.top = rocket.offsetTop + 'px';

        var rocketLeft = rocket.offsetLeft;
        var missleWidth = missle.offsetWidth;

        var missleLeft = rocketLeft + rocketWidth/2 - missleWidth/2 + 'px';
        missle.style.left = missleLeft;
        missleMove(missle, rocket.offsetTop);
    }

    // missle movement
    function missleMove(missle, initialTop) {
        var missleTop = initialTop;

        var removeMissle = function() {
            missle.remove();
            clearInterval(currentinterval);
            missleCount--;
        };

        var moveConcreteMissle = function() {

            if(missleTop > 3) {
                missleTop -= 7;
                missle.style.top = missleTop + "px";
                checkCollision(missleTop, missle.offsetLeft, missle.offsetLeft + missle.offsetWidth, enemies, removeMissle);
            } else {
                removeMissle();
            }


        };
        var currentinterval = setInterval( moveConcreteMissle, 60);
    }

    // check coordinates of missle and enemy
    function checkCollision(missleTop, missleLeft, missleRight, enemies, removeMissle) {
        for(var i = 0; i < enemies.length; i++) {
            if((missleLeft >= enemies[i].left) && (missleRight <= enemies[i].right) && ((enemies[i].enemyElement.offsetTop + enemies[i].enemyElement.offsetHeight) >= missleTop)) {
                shot(i, removeMissle, missleTop, missleLeft);
            }
        }
    }

    // rand
    function randomFunction (min, max){
        min = parseInt(min);
        max = parseInt(max);
        return Math.floor( Math.random() * (max - min + 1)) + min;
    }

    //add enemy
    var i = 0;

    var enemies = []; // {enemyElement: DOMElement, left:  px, right:  px}
    function createEnemy() {
        if(i > 10) {
            return;
        }

        var enemy = document.createElement("span");

        enemy.setAttribute('class',"enemy-item enemy-item-" + i++);
        document.getElementById("field").appendChild(enemy);
        var enemyWidth = enemy.offsetWidth;
        enemy.style.left = randomFunction(30, fieldWidth - enemyWidth) + 'px';
        var enemyObj = {enemyElement: enemy, left: enemy.offsetLeft, right: enemy.offsetLeft + enemyWidth};
        enemies.push(enemyObj);

        enemyMove(enemyObj);

        setTimeout(createEnemy, randomFunction(500, 3000));
    }
    createEnemy();

    function enemyMove(enemyObj) {

        var enemy = enemyObj.enemyElement;
        var moveConcreteEnemy = function() {

            var enemyTop = enemy.offsetTop;

            if(enemyTop < fieldHeight) {
                enemyTop += 5;
                enemy.style.top = enemyTop + 'px';
            } else {
                deleteEnemy(enemyObj, 0);
            }

        };
        enemyObj.currentInterval = setInterval( moveConcreteEnemy, 60);
    }
    function deleteEnemy(enemyObj, index) {
        enemyObj.enemyElement.remove();
        enemies.shift();
        clearInterval(enemyObj.currentInterval);
        i--;
        createEnemy();
    }

    function shot(enemyIndex, removeMissle, missleTop, missleLeft) {
        deleteEnemy(enemies[enemyIndex], enemyIndex);
        removeMissle();
        bang(missleLeft, missleTop)
    }

    function bang(left, top) {
        var bang = document.createElement("span");
        bang.setAttribute('class',"bang bang-item-" + i+1);
        document.getElementById("field").appendChild(bang);
        var bangHeight = bang.offsetHeight;
        var bangWidth = bang.offsetWidth;

        bang.style.left = left -bangWidth/2 + 'px';
        bang.style.top = top - bangHeight/2 + 'px';

        var removeBang = function() {
            bang.remove();
        };

        setTimeout(removeBang, 300);
    }


});