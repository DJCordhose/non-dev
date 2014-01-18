////////////////////////////
// Framework
////////////////////////////

var pressed = {};
document.onkeydown = function (e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
        e.preventDefault();
    }
    pressed[e.keyCode] = true;
};

document.onkeyup = function (e) {
    delete pressed[e.keyCode];
};

function loop() {
    objects.forEach(function(object) {
        object.update();
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(function(object) {
        object.draw();
    });
}

function stop() {
    clearInterval(loopId);
}

var loopId = setInterval(loop, 10);

var canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

var acceleration = 0.1;
var gravity = 0.01;

var objects = [];

function addObject(object) {
    objects.push(object);
}
function removeObject(object) {
    objects.splice(objects.indexOf(object), 1);
}

////////////////////////////
// Generic Game
////////////////////////////

// http://www.adambrookesprojects.co.uk/project/canvas-collision-elastic-collision-tutorial/
function ballsCollide(object1, object2) {
    // Pythagoras: Distance between centers of balls less than sum of their radius'es?
    return Math.sqrt(Math.pow(object2.position.x - object1.position.x, 2) + Math.pow(object2.position.y - object1.position.y, 2)) < object1.r + object2.r;
}

function updateBall () {
    if (38 in pressed) this.velocity.y -= acceleration; // up
    if (40 in pressed) this.velocity.y += acceleration; // down
    if (37 in pressed) this.velocity.x -= acceleration; // left
    if (39 in pressed) this.velocity.x += acceleration; // right

    this.position.x += player.velocity.x;
    this.position.y += player.velocity.y;

    if (this.position.x < this.r) {
        this.position.x = this.r;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.x >= canvas.width - this.r) {
        this.position.x = canvas.width - this.r;
        this.velocity.x = -this.velocity.x;
    }
    if (this.position.y < this.r) {
        this.position.y = this.r;
        this.velocity.y = -this.velocity.y;
    }
    if (this.position.y >= canvas.height - this.r) {
        this.position.y = canvas.height - this.r;
        this.velocity.y = -this.velocity.y;
    }

    player.velocity.y += gravity;
}

function drawBall() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

////////////////////////////
// Game
////////////////////////////

var player = {
    r: 10,
    color: 'blue',
    velocity: {
        x: 0,
        y: 0
    },
    position: {
        x: 100,
        y: 100
    },
    update: updateBall,
    draw: drawBall
};
addObject(player);

var logic = {
    ballsCaught: 0,
    gameOver: false,
    greenBallLikeliness: 0.1,
    redBallLikeliness: 0.01,
    createBall: function() {
        var r = 10;
        var ball = {
            r: r,
            position: {
                x: Math.round(Math.random() * (canvas.width - r) + r),
                y: Math.round(Math.random() * (canvas.height - r) + r)
            },
            draw: drawBall
        };
        objects.push(ball);
        return ball;
    },
    createGreenBall: function () {
        var thisLogic = this;
        var ball = this.createBall();
        ball.color = 'green';
        ball.update = function() {
            if (ballsCollide(ball, player)) {
                thisLogic.ballsCaught++;
                removeObject(ball);
            }
        };
    },
    createRedBall: function () {
        var thisLogic = this;
        var ball = this.createBall();
        // don't immediately collidate with player
        if (ballsCollide(ball, player)) {
            removeObject(ball);
        }
        ball.color = 'red';
        ball.update = function() {
            if (ballsCollide(ball, player)) {
                console.log(ball);
                console.log(player);
                thisLogic.gameOver = true;
            }
        };
    },
    update: function() {
        if (Math.random() < this.greenBallLikeliness) this.createGreenBall();
        if (Math.random() < this.redBallLikeliness) this.createRedBall();
        if (27 in pressed) this.gameOver = true; // esc
        if (this.gameOver) stop();
    },
    draw: function() {
        var text;
        if (this.gameOver) {
            var highScore = localStorage.getItem('balls-highscore') || 0;
            if (this.ballsCaught > highScore) {
                text = 'Game over, NEW HIGHTSCORE: ' + this.ballsCaught;
                localStorage.setItem('balls-highscore', this.ballsCaught);
            } else {
                text = 'Game over, final score: ' + this.ballsCaught;
            }
        } else {
            text = "Balls caught: " + this.ballsCaught;
        }
        context.fillStyle = 'black';
        context.fillText(text, 20, canvas.height - 20);
    }
};
objects.push(logic);

