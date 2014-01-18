////////////////////////////
// Innereien
////////////////////////////

var pressed = {};
var orientationEvent;
var orientationSupported = false;
document.onkeydown = function (e) {
    if (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 32) {
        e.preventDefault();
    }
    pressed[e.keyCode] = true;
};

document.onkeyup = function (e) {
    delete pressed[e.keyCode];
};

window.addEventListener("orientationchange", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("New orientation:" + window.orientation);
}, false);

if (window.DeviceOrientationEvent) {
    console.log("DeviceOrientation is supported");
    orientationSupported = true;
}

// http://www.html5rocks.com/en/tutorials/device/orientation/
window.addEventListener('deviceorientation', function(event) {
    orientationEvent = event;
    console.log(orientationEvent);
}, false);

function loop() {
    update();
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

setInterval(loop, 10);

var canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

////////////////////////////
// Euer Programm
////////////////////////////

var box = {
    x: 100,
    y: 100,
    w: 10,
    h: 10,
    color: '#608020',
    accelaration: 0.1,
    velocity: {
        x: 0,
        y: 0
    },
    past: [{x: 100,y: 100}],
    memory: 100
};

function addToPast(box) {
    box.past.push({x: box.x, y: box.y});
    if (box.past.length > box.memory) {
        box.past.splice(0, 1);
    }
}

function orientationControl(currentControl) {
    var threshold = 45,
        offsetBeta = 90;
    if (orientationEvent.beta - offsetBeta > threshold) {
        currentControl['down'] = true;
    }
    if (orientationEvent.beta - offsetBeta < -threshold) {
        currentControl['up'] = true;
    }
    if (orientationEvent.gamma > threshold) {
        currentControl['right'] = true;
    }
    if (orientationEvent.gamma < -threshold) {
        currentControl['left'] = true;
    }
}

function keyboardControl(currentControl) {
    if (38 in pressed) currentControl['up'] = true;
    if (40 in pressed) currentControl['down'] = true;
    if (37 in pressed) currentControl['left'] = true;
    if (39 in pressed) currentControl['right'] = true;
}

function control() {
    var currentControl = {};
//    if (orientationSupported && orientationEvent) {
//        orientationControl(currentControl);
//    }
    keyboardControl(currentControl);
    return currentControl;
}

function update() {
    var currentControl = control();
    if ('up' in currentControl) box.velocity.y -= box.accelaration;
    if ('down' in currentControl) box.velocity.y += box.accelaration;
    if ('left' in currentControl) box.velocity.x -= box.accelaration;
    if ('right' in currentControl) box.velocity.x += box.accelaration;

    box.x += box.velocity.x;
    box.y += box.velocity.y;

    if (box.x < box.w) {
        box.x = box.w;
        box.velocity.x = -box.velocity.x;
    }
    if (box.y < box.h) {
        box.y = box.h;
        box.velocity.y = -box.velocity.y;
    }
    if (box.x >= canvas.width - box.w) {
        box.x = canvas.width - box.w;
        box.velocity.x = -box.velocity.x;
    }
    if (box.y >= canvas.height - box.h) {
        box.y = canvas.height - box.h;
        box.velocity.y = -box.velocity.y;
    }

    // gravity
    box.velocity.y += 0.01;

    addToPast(box);
}

function draw() {
    var color = box.color;
    var radius = box.w;
    drawCircle(color, box.x, box.y, radius);
    for (var i in box.past) {
        drawCircle(color, box.past[i].x, box.past[i].y, radius);
    }
}

function drawCircle(color, x, y, radius) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
//    context.stroke();
    context.fill();
    context.closePath();
}

////////////////////////////
//
// Mögliche Erweiterungen
// - Verändere die Geschwindigkeit, Startposition, Größe und Farbe der Box
// - Box nicht am Rand stoppen lassen, sondern auf der anderen Seite wieder herauskommen lassen
// - Farbe der Box bei jedem Schritt ändern
// - Trägheit und Beschleunigung einführen
// - Hindernisse einführen und auf Kollision prüfen
// - Einen zweiten Spieler mitspielen lassen (Steuerung über andere Tasten)
////////////////////////////
