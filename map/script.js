const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "image.png";

const camera = { x: 0, y: 0, zoom: 1 };
const tcamera = { x: 0, y: 0, zoom: 1 };

const dimensions = { width: 2122, height: 1478 };

let lastTime = 0;

function canvasToMap(x, y) {
    return [(x + camera.x) / camera.zoom - canvas.width / 2, (y + camera.y) / camera.zoom - canvas.height / 2];
}

function mapToCanvas(x, y) {
    return [(x + canvas.width / 2) * camera.zoom - camera.x, (y + canvas.height / 2) * camera.zoom - camera.y];
}

function update(timestamp) {
    requestAnimationFrame(update)

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    camera.x = lerp5(camera.x, tcamera.x, dt * 25);
    camera.y = lerp5(camera.y, tcamera.y, dt * 25);
    camera.zoom = lerp5(camera.zoom, tcamera.zoom, dt * 25);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.drawImage(bg, -dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);

    ctx.restore();
}

requestAnimationFrame(update)

const mouse = { x: 0, y: 0, down: false }
const moved = { x: 0, y: 0 }

canvas.addEventListener("mousedown", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    mouse.down = true;
})

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    if (mouse.down) {
        camera.x -= e.movementX;
        camera.y -= e.movementY;
        tcamera.x -= e.movementX;
        tcamera.y -= e.movementY;
        moved.x -= e.movementX;
        moved.y -= e.movementY;
    }

})

canvas.addEventListener("mouseup", (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    mouse.down = false;

    const d = Math.hypot(moved.x, moved.y);
    moved.x = 0;
    moved.y = 0;

    if (d < 10) {
        if (!creatingRoom) {
            let interacted = false;
            let i = 0;
            const hadSelected = selectedRoom != null;
            selectedRoom = null;
            for (const room of rooms) {
                if (room.hovered) {
                    interacted = true;
                    selectedRoom = i;
                    roomCreateDIV.style.display = "none";
                    roomSelectDIV.style.display = "block";

                    roomNameEdit.value = room.name;
                }
                i++
            }

            if (interacted || hadSelected) return;

            roomCreateDIV.style.display = "block";
            roomSelectDIV.style.display = "none";

            creatingRoom = true;
            const point = canvasToMap(mouse.x, mouse.y);
            rooms.push({ name: "", min: [...point], max: [...point], points: [point], done: false, hover: 0, hovered: false });
        } else if (rooms.length > 0 && !rooms[rooms.length - 1].done) {
            const room = rooms[rooms.length - 1];

            const m = canvasToMap(mouse.x, mouse.y);
            const d = Math.hypot(room.points[0][0] - m[0], room.points[0][1] - m[1]);
            if (d < 10 && room.points.length > 2) {
                room.done = true;
            } else {
                room.points.push(m);
            }
        }
    }
})

canvas.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
        const f = 1 - e.deltaY / 50;

        tcamera.zoom *= f;
        tcamera.x = (tcamera.x + mouse.x) * f - mouse.x;
        tcamera.y = (tcamera.y + mouse.y) * f - mouse.y;

        // tcamera.x += (((mouse.x - w)))
    } else {
        tcamera.x += e.deltaX;
        tcamera.y += e.deltaY;
    }
    e.preventDefault();
}, { passive: false })

//

function lerpn(
    start,
    end,
    multiply,
    step,
) {
    multiply = 1 - (1 - multiply) ** step;
    if (multiply > 1) multiply = 1;
    if (multiply < 0) multiply = 0;
    return start + (end - start) * multiply;
}

function lerp5(start, end, step) {
    return lerpn(start, end, 0.5, step);
}