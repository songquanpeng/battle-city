'use strict';

main();

function main() {
    const screen = document.getElementById('canvas').getContext('2d');
    screen.canvas.width = window.innerWidth;
    screen.canvas.height = window.innerHeight;


    function tick() {

        requestAnimationFrame(tick);
    }

    tick();
}

document.onkeydown = function (e) {
    switch (e.code) {
        case "KeyA":
            break;
        case "KeyD":
            break;
        case "KeyW":
            break;
        case "KeyS":
            break;
        case "Space":
            break;
        case "F11":
            location.reload();
            break;
        case "KeyR":
            location.reload();
            break;
        default:
            break;
    }
};
