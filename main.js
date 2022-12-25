let snake = document.getElementById("snake");
let food = document.getElementById("food");
let gameContainer = document.getElementById("game-container");
let header = document.getElementById("header");
let headerContent = document.getElementById("header-content");
let scoreDisplay = document.getElementById("score");

let gameLoop = null;
let headPosX = 0, headPosY = 0;
let speed = 200;
let gameStarted;
let containerWidth, containerHeight;
let foodPosX, foodPosY;
let headerHeight;
let acceptInput;
let snakes = [];

let touchStartX, touchStartY, touchEndX, touchEndY;

const Directions = {
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    left: "ArrowLeft"
}
let movingDirection;

init();

/** Functions */

function init() {

    headerHeight = parseInt(getComputedStyle(header).height);

    containerWidth = Math.floor((window.innerWidth/25)-2)*25;
    containerHeight = (Math.floor(((window.innerHeight-headerHeight)/25)-2)*25);

    gameContainer.style.width = containerWidth+"px";
    gameContainer.style.height = containerHeight+"px";

    headerContent.style.width = containerWidth+"px";

    gameStarted = false;
    acceptInput = true;
    movingDirection = "";
    clearInterval(gameLoop);

    generateRandFood();
    resetGame();

}

function resetGame() {
    while (snakes.length > 1) {
        snakes[snakes.length-1].parentNode.removeChild(snakes[snakes.length-1]);
        snakes.pop();
    }

    scoreDisplay.innerText = "Score: 0";
    score = 0;
    headPosX = 0;
    headPosY = 0;

    if (snakes.length == 0) snakes.push(snake);

    snakes[0].style.left = headPosX+"px";
    snakes[0].style.top = headPosY+"px";
    snakes[0].style.backgroundColor = "#4977ee";
}

function startGame() {
    resetGame();

    clearInterval(gameLoop);

    gameLoop = setInterval(function() {

        let poped = snakes.pop();

        if (movingDirection == Directions.up) {
            headPosY -= 25;
            if (headPosY > -25) {
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
            }

        }
        else if (movingDirection == Directions.right) {
            headPosX += 25;
            if (headPosX < containerWidth) {
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
            }

        }
        else if (movingDirection == Directions.down) {
            headPosY += 25;
            if (headPosY < containerHeight) {
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
            }

        }
        else if (movingDirection == Directions.left) {
            headPosX -= 25;
            if (headPosX > -25) {
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
            }
        }
        snakes.unshift(poped);

        if (headPosX >= containerWidth ||
            headPosY >= containerHeight ||
            headPosX <= -25 ||
            headPosY <= -25) {

            gameOver();
        }

        for (let x=1; x<snakes.length; x++) {
            if (headPosX == parseFloat(snakes[x].style.left) &&
                headPosY == parseFloat(snakes[x].style.top)) {

                gameOver();
            }
        }

        if (headPosX == foodPosX && headPosY == foodPosY) {
            score++;
            scoreDisplay.innerText = "Score: "+score;
            growSnake();
            generateRandFood();
        }
        acceptInput = true;

    }, speed);

}

function gameOver() {
    for (let x=0; x<snakes.length; x++) {
        snakes[x].style.backgroundColor = "red";
    }

    gameStarted = false;
    clearInterval(gameLoop);
    movingDirection = "";
    scoreDisplay.innerText = "Game Over! Score: "+score;
}

function generateRandFood() {
    foodPosX = Math.floor((Math.random() * (containerWidth/25))) * 25;
    foodPosY = Math.floor((Math.random() * (containerHeight/25))) * 25;
    food.style.left = foodPosX+"px";
    food.style.top = foodPosY+"px";
}

function growSnake() {
    let snakeGrow = document.createElement("div");
    snakeGrow.className = "snake";
    snakeGrow.style.top = snakes[0].style.top;
    snakeGrow.style.left = snakes[0].style.left;
    gameContainer.appendChild(snakeGrow);
    snakes.push(snakeGrow);
}

function setTouchDirection() {
    let touchMovementX = Math.abs(touchEndX - touchStartX);
    let touchMovementY = Math.abs(touchEndY - touchStartY);
    let prevMovingDir = movingDirection;

    if (touchMovementX > touchMovementY) {
        if (touchEndX > touchStartX) {
            movingDirection = Directions.right;
        } else {
            movingDirection = Directions.left;
        }
    }
    else if (touchMovementX < touchMovementY) {
        if (touchEndY > touchStartY) {
            movingDirection = Directions.down;
        } else {
            movingDirection = Directions.up;
        }
    }
    if (!(!(prevMovingDir == Directions.right && movingDirection == Directions.left ||
        prevMovingDir == Directions.down && movingDirection == Directions.up ||
        prevMovingDir == Directions.left && movingDirection == Directions.right ||
        prevMovingDir == Directions.up && movingDirection == Directions.down) &&
        acceptInput)) {

        movingDirection = prevMovingDir;
    }
    if (!gameStarted && movingDirection != Directions.left && movingDirection != Directions.up) {
        gameStarted = !gameStarted;
        startGame();
    }
}

/** Event Listeners */

document.addEventListener("keydown", function(event) {

    if (!(movingDirection == Directions.right && event.key == Directions.left) &&
        !(movingDirection == Directions.down && event.key == Directions.up) &&
        !(movingDirection == Directions.left && event.key == Directions.right) &&
        !(movingDirection == Directions.up && event.key == Directions.down) &&
        Object.values(Directions).includes(event.key) &&
        acceptInput) {

        movingDirection = event.key;
        acceptInput = false;
    }

    if (!gameStarted && event.key != Directions.left && event.key != Directions.up) {
        gameStarted = !gameStarted;
        startGame();
    }
    
});

window.addEventListener("resize", function() {
    init();
});

document.addEventListener("touchstart", function(event) {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
}, false);

document.addEventListener("touchend", function(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    setTouchDirection();
}, false);




