////////////////////////////
// Innereien
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
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    color: 'black',
    speed: 5
}

function update() {
    if (38 in pressed) box.y -= box.speed; // up
    if (40 in pressed) box.y += box.speed; // down
    if (37 in pressed) box.x -= box.speed; // left
    if (39 in pressed) box.x += box.speed; // right

    if (box.x < 0) box.x = 0;
    if (box.y < 0) box.y = 0;
    if (box.x >= canvas.width - box.w) box.x = canvas.width - box.w;
    if (box.y >= canvas.height - box.h) box.y = canvas.height - box.h;
}

function draw() {
    context.fillStyle = box.color;
    context.fillRect(box.x, box.y, box.w, box.h);
}

////////////////////////////
// Mögliche Erweiterungen
// - Farbe der Box bei jedem Schritt ändern
// - Trägheit und Beschleunigung einführen
// - Hindernisse Einführen und auf Kollision prüfen
////////////////////////////
