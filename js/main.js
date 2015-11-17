/*
    main game object is below


*/
var SnakeGame = {

    setup: function() {
        'use strict'
        // initial variables
        var canvas = document.getElementById('basic'),
            ctx = canvas.getContext('2d'),
            gameStat = document.querySelectorAll('h3')[0],
            gameRestart = document.querySelectorAll('#restart')[0],
            snakeLength = 5,
            snakeSpeed = 250,
            snakeWidth = 10,
            snakeHeight = 10,
            snake = [],
            x = 10,
            y = 10,
            direction = 39,
            up = 38,
            down = 40,
            left = 37,
            right = 39,
            doneMove = false,
            foodCoordinates = [],
            foodX,
            foodY,
            gameOver = false;

        // generating the food coordinates which will be used
        for (var f = 0; f < 350; f++) {
            if (f % 11 === 10) {
                foodCoordinates.push(f);
            }
        }

        // gradient effects
        var grd = ctx.createLinearGradient(0, 0, 170, 0);
        grd.addColorStop(0, "yellow");
        grd.addColorStop(0.5, "green");
        grd.addColorStop(0.5, "green");
        ctx.fillStyle = grd;

        // initial snake coordinates
        for (var i = 0; i < snakeLength; i++) {
            ctx.fillRect(x + (i + x * i), y, snakeWidth, snakeHeight);
            snake.push([x + (i + x * i), y]);
        }

        // event handlers
        document.onkeydown = function(key) {
            if (key.keyCode === 37 || key.keyCode === 38 || key.keyCode === 39 || key.keyCode === 40) {
                if ((direction === 37 && key.keyCode === 39) || (direction === 39 && key.keyCode === 37)) {
                    direction = direction
                } else if ((direction === 38 && key.keyCode === 40) || (direction === 40 && key.keyCode === 38)) {
                    direction = direction
                } else {
                    if (doneMove) {
                        direction = key.keyCode
                    }
                    doneMove = false;// change the direction once atleast 1 cube is drawed
                }
            }
        };
        
        gameRestart.onclick = function(){
            if(gameOver){
                snake.forEach(function(el){
                    ctx.clearRect(el[0], el[1], snakeWidth, snakeHeight);
                });
                ctx.clearRect(foodX, foodY, snakeWidth, snakeHeight);
                SnakeGame.setup();
                gameStat.className = gameStat.className.replace(' fail','');
                gameStat.textContent = 'Game ON';
            }
        }

        // eating food, food loop
        var feedFunc = function(eat) {
            if (eat) {
                ctx.fillRect(snake[0][0], snake[0][1], snakeWidth, snakeHeight);
                snake.unshift([snake[0][0], snake[0][1]]);
            }
        };
        
        // TODO - fix the white rectangle when eating
        var foodLoop = setInterval(function() {
            // check if there are duplicate coordinates in the snake array
            var tempFoodCoordinates = foodCoordinates.filter(function(el){
                for(var fi = 0; fi < snake.length; fi++){
                    if(el === snake[fi][0] || el === snake[fi][1]){
                        return false;
                    } else {
                        return true;
                    }
                }
            });
            if (foodX && foodY) {
                ctx.clearRect(foodX, foodY, snakeWidth, snakeHeight);
            }
            // drawing the food cube with random x and y coordinates
            ctx.fillStyle = '#ffa500';
            foodX = tempFoodCoordinates[Math.floor(Math.random() * tempFoodCoordinates.length)];
            foodY = tempFoodCoordinates[Math.floor(Math.random() * tempFoodCoordinates.length)];
            ctx.fillRect(foodX, foodY, snakeWidth, snakeHeight);
            ctx.fillStyle = grd;
        }, 6000);

        // end game function, clears the food loop
        var gameEndFunc = function() {
            gameOver = true;
            gameStat.className = gameStat.className + ' fail';
            gameStat.textContent = 'Game Over';
            clearInterval(foodLoop);
        };
        
        // TODO - Speed functions ()

        //snake controll, calling gameEndFunc and feedFunc
        var snakeFunc = function(xCoord, yCoord) {
            // clear rect, eat, draw rect, add element and remove the last one
            if (xCoord > 340 || yCoord > 340 || xCoord < -1 || yCoord < -1 || snake.length !== Poly.set(snake).length) {
                gameEndFunc();
            }
            ctx.clearRect(snake[0][0], snake[0][1], snakeWidth, snakeHeight);
            
            feedFunc(xCoord === foodX && yCoord === foodY);
            
            // draw 1 cube, push one cube and shift the last one (moving forward)
            ctx.fillRect(xCoord, yCoord, snakeWidth, snakeHeight);
            snake.push([xCoord, yCoord]);
            snake.shift();

            doneMove = true;
        };

        // game loop recursive function, moving/coloring "11px" in direction, caling the main snakeFunc
        var gameLoop = function() {
            setTimeout(function() {
                x = snake[snake.length - 1][0];
                y = snake[snake.length - 1][1];

                switch (direction) {
                    case right:
                        snakeFunc(x + 11, y);
                        break;
                    case down:
                        snakeFunc(x, y + 11);
                        break;
                    case left:
                        snakeFunc(x - 11, y);
                        break;
                    case up:
                        snakeFunc(x, y - 11);
                        break;
                    default:
                        console.log('Wrong direction/keypress');
                        break;
                }
                if (!gameOver) {
                    gameLoop();
                }
            }, snakeSpeed);
        };
        gameLoop();
    }
};
SnakeGame.setup();
