
import "../henry/new/timetable.js";

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const bg = new Image();
bg.src = "image.png";

const camera = { x: 0, y: 0, zoom: 1 };
const tcamera = { x: 0, y: 0, zoom: 1 };

const dimensions = { width: 2122, height: 1478 };

let lastTime = 0;

const mapSelect = document.getElementById("mapSelect");

let loadedMap = null;

const rooms = [];

async function getMaps() {
    return await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'maps' })
    })
        .then(response => response.json())
}

async function updateMapList() {
    const maps = await getMaps();

    mapSelect.innerHTML = "";

    for (const map of maps) {
        const option = document.createElement("option");
        option.value = map.id;
        option.textContent = map.name;
        mapSelect.appendChild(option);
    }

    mapSelect.value = maps[0].id;

    loadMap(maps[0].id)
}

mapSelect.onchange = () => {
    loadMap(mapSelect.value)
}

updateMapList();

async function loadMap(id) {
     const roomsData = await fetch("/api.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ request: 'rooms', map_id: id })  // Send a request to get all the rooms with the map id
    })
        //convert the response to json
        .then(response => response.json())
        //catch any errors and log them to the console
        .catch(error => console.error('Error:', error));

    if (!roomsData) return;

    rooms.length = 0;

    for (const room of roomsData) {
        rooms.push({name: room.room_name, points: JSON.parse(room.points)})
    }
}

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

     let i = 0;
    for (const room of rooms) {
        const min = [null, null];
        const max = [null, null];

        for (const point of room.points) {
            min[0] = min[0] != null ? Math.min(min[0], point[0]) : point[0];
            min[1] = min[1] != null ? Math.min(min[1], point[1]) : point[1];

            max[0] = max[0] != null ? Math.max(max[0], point[0]) : point[0];
            max[1] = max[1] != null ? Math.max(max[1], point[1]) : point[1];
        }

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

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
        ctx.lineTo(room.points[0][0], room.points[0][1]);

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

        i++;

        if (room.points.length > 2) {
            const centre = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2];

            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.strokeText(room.name, ...centre);
            ctx.fillText(room.name, ...centre);
        }
    }

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

    // const d = Math.hypot(moved.x, moved.y);
    moved.x = 0;
    moved.y = 0;
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