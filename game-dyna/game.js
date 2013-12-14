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
    x: 100,
    y: 100,
    w: 10,
    h: 10,
    color: 'black',
    accelaration: 0.1,
    velocity: {
        x: 0,
        y: 0
    }
};

function update() {
    if (38 in pressed) box.velocity.y -= box.accelaration; // up
    if (40 in pressed) box.velocity.y += box.accelaration; // down
    if (37 in pressed) box.velocity.x -= box.accelaration; // left
    if (39 in pressed) box.velocity.x += box.accelaration; // right

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
}

function draw() {
    context.fillStyle = box.color;
    context.beginPath();
    context.arc(box.x, box.y, box.w, 0, Math.PI * 2);
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
