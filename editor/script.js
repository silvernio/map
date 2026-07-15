fetch("/api.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ request: 'students' })  // Send a request to get crash type data
})
    //convert the response to json
    .then(response => response.json())
    //then do something with the data
    .then(data => {
        console.log(data)
    })
    //catch any errors and log them to the console
    .catch(error => console.error('Error:', error));

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "image.png";

const camera = { x: 0, y: 0, zoom: 1 };
const tcamera = { x: 0, y: 0, zoom: 1 };

const roomManage = document.getElementById("roomManage");
const createRoomBtn = document.getElementById("createRoomBtn");
const cancelRoomBtn = document.getElementById("cancelRoomBtn");
const roomNameInput = document.getElementById("roomNameInput");

// console.log(bg);

// document.body.appendChild(bg)

const rooms = [];

const dimensions = { width: 2122, height: 1478 };

let creatingRoom = false;
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

    // ctx.fillStyle = "red";
    // ctx.fillRect(0, 0, 100, 100);

    // ctx.beginPath();

    // for (const point of points) {
    //     ctx.moveTo(point[0], point[1]);
    //     ctx.arc(point[0], point[1], 10, 0, Math.PI*2);
    // }

    // ctx.fill();

    roomManage.style.opacity = creatingRoom ? 1 : 0;

    let i = 0;
    for (const room of rooms) {
        const min = [null, null];
        const max = [null, null];

        for (const point of room.points) {
            min[0] = min[0] ? Math.min(min[0], point[0]) : point[0];
            min[1] = min[1] ? Math.min(min[1], point[1]) : point[1];

            max[0] = max[0] ? Math.max(max[0], point[0]) : point[0];
            max[1] = max[1] ? Math.max(max[1], point[1]) : point[1];
        }

        room.min[0] = lerp5(room.min[0], min[0], dt * 15);
        room.min[1] = lerp5(room.min[1], min[1], dt * 15);
        room.max[0] = lerp5(room.max[0], max[0], dt * 15);
        room.max[1] = lerp5(room.max[1], max[1], dt * 15);

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (creatingRoom && i == rooms.length - 1) {
            const p = mapToCanvas(room.min[0], room.min[1]);

            const size = roomManage.getBoundingClientRect();

            p[0] = Math.max(p[0], size.width + 20);
            p[1] = Math.max(p[1], 10);
            roomManage.style.right = (canvas.width - p[0] + 10) + "px";
            roomManage.style.top = (p[1] + 50) + "px";

            createRoomBtn.disabled = !room.done || roomNameInput.value.length == 0;

            ctx.beginPath();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "black";
            ctx.setLineDash([10, 10]);
            ctx.rect(room.min[0], room.min[1], room.max[0] - room.min[0], room.max[1] - room.min[1]);
            ctx.stroke();
        }

        ctx.beginPath();
        let start = true;
        for (const point of room.points) {
            if (start) {
                ctx.moveTo(point[0], point[1])
            } else {
                ctx.lineTo(point[0], point[1])
            }
            start = false;
        }
        if (room.done) {
            ctx.lineTo(room.points[0][0], room.points[0][1]);
        } else if (creatingRoom && i == rooms.length - 1) {
            ctx.lineTo(...canvasToMap(mouse.x, mouse.y));
        }

        ctx.setLineDash([])
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.beginPath();
        for (const point of room.points) {
            ctx.moveTo(point[0], point[1]);
            ctx.arc(point[0], point[1], 5, 0, Math.PI * 2);
        }
        ctx.fillStyle = "black";
        ctx.fill();

        const m = canvasToMap(mouse.x, mouse.y);
        const d = Math.hypot(room.points[0][0] - m[0], room.points[0][1] - m[1]);
        if (d < 10 && room.points.length > 2 && !room.done) {
            ctx.beginPath();
            ctx.arc(room.points[0][0], room.points[0][1], 10, 0, Math.PI * 2);
            ctx.strokeStyle = "rgb(0, 127, 255)";
            ctx.lineWidth = 5;
            ctx.stroke();
        }


        i++;
    }

    ctx.restore();
}

requestAnimationFrame(update)

createRoomBtn.onclick = () => {
    if (!creatingRoom || rooms.length == 0) return;

    creatingRoom = false;

    rooms[rooms.length - 1].name = roomNameInput.value;

    roomNameInput.value = "";
}

cancelRoomBtn.onclick = () => {
    if (!creatingRoom || rooms.length == 0) return;

    rooms.splice(rooms.length - 1, 1);
    creatingRoom = false;
    roomNameInput.value = "";
}

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
            creatingRoom = true;
            const point = canvasToMap(mouse.x, mouse.y);
            rooms.push({ name: "New", min: [...point], max: [...point], points: [point], done: false });
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