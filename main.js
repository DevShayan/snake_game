let snake = document.getElementById("snake");
let food = document.getElementById("food");
let gameContainer = document.getElementById("game-container");
let header = document.getElementById("header");
let headerContent = document.getElementById("header-content");
let scoreDisplay = document.getElementById("score");

let gameLoop = null;
let headPosX = 0, headPosY = 0;
let speed = 300;
let gameStarted;
let containerWidth, containerHeight;
let foodPosX, foodPosY;
let headerHeight;
let acceptInput;
let snakes = [];

const Directions = {
    top: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    left: "ArrowLeft"
}
let movingDirection;

init();

function init() {

    headerHeight = parseInt(getComputedStyle(header).height);

    containerWidth = Math.floor((window.innerWidth/25)-2)*25;
    containerHeight = (Math.floor(((window.innerHeight-headerHeight)/25)-2)*25);

    gameContainer.style.width = containerWidth+"px";
    gameContainer.style.height = containerHeight+"px";

    headerContent.style.width = containerWidth+"px";

    snakes[0] = snake;
    score = 0;
    gameStarted = false;
    acceptInput = true;
    movingDirection = "";
    clearInterval(gameLoop);

    generateRandFood();

    headPosX = 0;
    headPosY = 0;
    snake.style.left = headPosX+"px";
    snake.style.top = headPosY+"px";
    snake.style.backgroundColor = "#4977ee";
}

function resetGame() {
    score = 0;
    headPosX = 0;
    headPosY = 0;
    snake.style.left = headPosX+"px";
    snake.style.top = headPosY+"px";
    snake.style.backgroundColor = "#4977ee";
}

function startGame() {
    resetGame();

    clearInterval(gameLoop);

    gameLoop = setInterval(function() {

        if (movingDirection == Directions.top) {
            headPosY -= 25;
            if (snakes.length > 1) {
                let poped = snakes.pop();
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
                snakes.unshift(poped);
            }
            else if (headPosY != -25) {
                snake.style.top = headPosY+"px";
            }
        }
        else if (movingDirection == Directions.right) {
            headPosX += 25;
            if (snakes.length > 1) {
                let poped = snakes.pop();
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
                snakes.unshift(poped);
            }
            else if (headPosX != containerWidth) {
                snake.style.left = headPosX+"px";
            }
        }
        else if (movingDirection == Directions.down) {
            headPosY += 25;
            if (snakes.length > 1) {
                let poped = snakes.pop();
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
                snakes.unshift(poped);
            }
            else if (headPosY != containerWidth) {
                snake.style.top = headPosY+"px";
            }
        }
        else if (movingDirection == Directions.left) {
            headPosX -= 25;
            if (snakes.length > 1) {
                let poped = snakes.pop();
                poped.style.top = headPosY + "px";
                poped.style.left = headPosX + "px";
                snakes.unshift(poped);
            }
            else if (headPosX != containerWidth) {
                snake.style.left = headPosX+"px";
            }
        }

        if (headPosX >= containerWidth ||
            headPosY >= containerHeight ||
            headPosX <= -25 ||
            headPosY <= -25) {

            clearInterval(gameLoop);
            gameOver();
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
    gameStarted = false;
    clearInterval(gameLoop);
    movingDirection = "";
    snake.style.backgroundColor = "red";
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
    snakeGrow.style.top = snake.style.top;
    snakeGrow.style.left = snake.style.left;
    gameContainer.appendChild(snakeGrow);
    snakes.push(snakeGrow);
}

/** Event Listeners */

document.addEventListener("keydown", function(event) {

    if (!(movingDirection == Directions.right && event.key == Directions.left) &&
        !(movingDirection == Directions.down && event.key == Directions.top) &&
        !(movingDirection == Directions.left && event.key == Directions.right) &&
        !(movingDirection == Directions.top && event.key == Directions.down) &&
        Object.values(Directions).includes(event.key) &&
        acceptInput) {

        movingDirection = event.key;
        acceptInput = false;
    }

    if (!gameStarted && event.key != Directions.left && event.key != Directions.top) {
        gameStarted = !gameStarted;
        startGame();
    }
    
});

window.addEventListener("resize", function() {
    init();
});


