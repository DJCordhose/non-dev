canvas = document.getElementById("myCanvas");
context = canvas.getContext('2d');

centerX = canvas.width / 2;
centerY = canvas.height / 2;

paint = false;
erasure = false;

dots = [];

//endpoint = "http://localhost:8888/rest/";
endpoint = "http://zeigermann-rest.appspot.com/rest/";

canvas.onmousemove = function (e) {
    if ( paint ) {
        malen(e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop);
    }
};

canvas.onmousedown = function (e) {
    paint = true;
};

canvas.onmouseup = function (e) {
    paint = false;
};

function erase(mausX, mausY) {
    context.beginPath();
    context.arc(mausX, mausY, 20, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();
}
function draw(mausX, mausY) {
    context.beginPath();
    context.arc(mausX, mausY, 5, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();
}
function malen(mausX, mausY) {
    var dot = {
        x: mausX,
        y: mausY
    };
    if (erasure) {
        erase(mausX, mausY);
        dot.erase = true;
    } else {
        draw(mausX, mausY);
    }
    dots.push(dot);
}

function toggle() {
    erasure = !erasure;
    var toggleButton = document.getElementById("toggle");
    toggleButton.innerHTML = erasure ? "Malen" : "Radiergummi" ;
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clean() {
    clear();
    dots = [];

}

function display(dot) {
    if (dot.erase) {
        erase(dot.x, dot.y);
    } else {
        draw(dot.x, dot.y);
    }
}
function displayWithTimeout(dot, timeout) {
    window.setTimeout(function () {
        display(dot);
    }, timeout);
}

function replay() {
    clear();
    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        displayWithTimeout(dot, 10 * i);
    }
}

function save() {
    var saveId;
    var segments = window.location.pathname.split("/");
    if (segments.length >= 1) {
        saveId = segments[1];
        doRestSave(saveId, dots);
    } else {
        alert("Do not know how to save");
    }
}

function load() {
    var saveId;
    var segments = window.location.pathname.split("/");
    if (segments.length >= 1) {
        saveId = segments[1];
        doRestLoad(saveId);
    } else {
        alert("Do not know how to load");
    }
}

function doRestSave(id, data) {
    var xhr = new XMLHttpRequest();
    var url = endpoint + id;
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
//                alert("Gespeichert");
            } else {
                alert("Hat leider nicht geklappt");
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

function doRestLoad(id) {
    var xhr = new XMLHttpRequest();
    var url = endpoint + id;
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                dots = JSON.parse(response.data);
                replay();
            } else {
                // da gibt es wohl nix zu laden...
            }
        }
    };
    xhr.send();
}

load();

