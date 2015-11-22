/*
    main game object is below


*/
var SnakeGame = {

    setup: function() {
        'use strict';
        // initial variables
        var canvas = document.getElementById('basic'),
            ctx = canvas.getContext('2d'),
            gameStatus = document.querySelectorAll('h3')[0],
            gameRestart = document.querySelectorAll('#restart')[0],
            snakeLength = 5,
            snakeSpeed = 300,
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
            foodCoordinates = [],
            xFoodCoordinate,
            yFoodCoordinate,
            doneMove = false,
            feeding = false,
            gameOver = false;

        // draw object, painting and clearing rectangles
        var draw = {
            fill: function(x, y) {
                ctx.fillRect(x, y, snakeWidth, snakeHeight);
            },
            clear: function(x, y) {
                ctx.clearRect(x, y, snakeWidth, snakeHeight);
            }
        };

        // gradient effects
        var grd = ctx.createLinearGradient(0, 0, 170, 0);
        grd.addColorStop(0, "yellow");
        grd.addColorStop(0.5, "green");

        ctx.fillStyle = grd;

        // initial snake coordinates
        for (var i = 0; i < snakeLength; i++) {
            draw.fill(x + (i + x * i), y);
            snake.push([x + (i + x * i), y]);
        }

        // generating the food coordinates which will be used
        for (var fcube = 0; fcube < 350; fcube++) {
            if (fcube % 11 === 10) {
                foodCoordinates.push(fcube);
            }
        }

        // event handlers
        document.onkeydown = function(key) {
            if (key.keyCode === 37 || key.keyCode === 38 || key.keyCode === 39 || key.keyCode === 40) {
                if (direction - key.keyCode != 2 && direction - key.keyCode != -2) {
                    if (doneMove) {
                        direction = key.keyCode;
                    }
                    doneMove = false; // change the direction once atleast 1 cube is drawed
                }
            }
        };

        gameRestart.onclick = function() {
            if (gameOver) {
                snake.forEach(function(el) {
                    draw.clear(el[0], el[1]);
                });
                draw.clear(xFoodCoordinate, yFoodCoordinate);
                gameStatus.className = gameStatus.className.replace(' fail', '');
                gameStatus.textContent = 'Game ON';
                SnakeGame.setup();
            }
        };

        // growing function
        var feedFunc = function(eat) {
            if (eat) {
                feeding = true;
                draw.fill(snake[0][0], snake[0][1]);
                snake.unshift([snake[0][0], snake[0][1]]);
                speedFunction();
            }
        };

        // food coordinates cleaner
        var foodCoordsCleaner = function() {
            var tempFoodCoordinates = foodCoordinates.filter(function(el) {
                for (var fi = 0; fi < snake.length; fi++) {
                    if (el === snake[fi][0] || el === snake[fi][1]) {
                        return false;
                    }
                }
                return true;
            });
            return tempFoodCoordinates;
        };

        /*
         * drawing the food cube with random x and y coordinates
         * check if there are duplicate coordinates in the snake array
         */
        var foodLoop = setInterval(function() {
            var safeFoodCoordinates = foodCoordsCleaner();
            if (!feeding) {
                draw.clear(xFoodCoordinate, yFoodCoordinate);
            }
            ctx.fillStyle = '#ffa500';
            xFoodCoordinate = safeFoodCoordinates[Math.floor(Math.random() * safeFoodCoordinates.length)];
            yFoodCoordinate = safeFoodCoordinates[Math.floor(Math.random() * safeFoodCoordinates.length)];
            draw.fill(xFoodCoordinate, yFoodCoordinate);
            ctx.fillStyle = grd;
            feeding = false;
        }, 6000);

        // end game function, clears the food loop
        var gameEndFunc = function() {
            gameOver = true;
            gameStatus.className = gameStatus.className + ' fail';
            gameStatus.textContent = 'Game Over';
            clearInterval(foodLoop);
        };

        // speed function
        var speedFunction = function() {
            switch (snake.length) {
                case 10:
                    snakeSpeed = 200;
                    break;
                case 15:
                    snakeSpeed = 150;
                    break;
                case 20:
                    snakeSpeed = 100;
                    break;
                case 25:
                    snakeSpeed = 70;
                    break;
                case 30:
                    snakeSpeed = 40;
                    break;
                default:
                    break;
            }
        };

        /*
         * snake controll, calling gameEndFunc and feedFunc
         * clear rect, eat, draw rect, add element and remove the last one
         * draw 1 cube, push one cube and shift the last one (moving forward)
         */
        var snakeFunc = function(x, y) {
            if (x > 340 || y > 340 || x < -1 || y < -1 || snake.length !== Poly.set(snake).length) {
                gameEndFunc();
            } else {
                feedFunc(x === xFoodCoordinate && y === yFoodCoordinate);
                draw.clear(snake[0][0], snake[0][1]);
                draw.fill(x, y);
                snake.push([x, y]);
                snake.shift();
                doneMove = true;
            }
        };

        /* 
         * game loop recursive function
         * moving/coloring "11px" in direction, caling the main snakeFunc
         */
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
