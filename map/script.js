
import "../henry/new/timetable.js";
import { currentLessons, hovered, lessonColours } from "../henry/new/timetable.js";

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
        rooms.push({ name: room.room_name, points: JSON.parse(room.points), id: room.room_id, hovered: 0, colour: null })
    }
}

function canvasToMap(x, y) {
    return [camera.x + (x - canvas.width / 2) / camera.zoom, camera.y + (y - canvas.height / 2) / camera.zoom];
}

function mapToCanvas(x, y) {
    return [canvas.width / 2 + (x - camera.x) * camera.zoom, canvas.height / 2 + (y - camera.y) * camera.zoom];
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
    ctx.translate(-camera.x * camera.zoom, -camera.y * camera.zoom);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(canvas.width / 2 / camera.zoom, canvas.height / 2 / camera.zoom);

    ctx.drawImage(bg, -dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);

    const hoveredRoom = (hovered.v != null && currentLessons[hovered.v]) ? currentLessons[hovered.v][6] : null

    let hoverCentre = null;

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

        // console.log(roo)
        const isHovered = hoveredRoom == room.id;
        const index = currentLessons.findIndex(lesson => lesson != null && lesson[6] == room.id);

        room.colour = lessonColours[index];

        room.hovered = lerp5(room.hovered, isHovered ? 1 : (index != -1 ? 0.6 : 0), dt * 15);

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

        ctx.globalAlpha = room.hovered * 0.8;
        ctx.fillStyle = room.colour;
        ctx.fill();

        ctx.globalAlpha = 1;

        ctx.lineWidth = 5 + 5 * room.hovered;
        ctx.strokeStyle = room.colour;
        ctx.stroke();

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

            if (isHovered) {
                hoverCentre = centre;
            }

            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.strokeText(room.name, ...centre);
            ctx.fillText(room.name, ...centre);
        }
    }

    if (hoverCentre && Math.hypot(camera.x - hoverCentre[0], camera.y - hoverCentre[1]) > 100) {
        const diff = [camera.x - hoverCentre[0], camera.y - hoverCentre[1]]
        const l = Math.hypot(...diff);
        const closest = [hoverCentre[0] + diff[0] / l * 100, hoverCentre[1] + diff[1] / l * 100];
        tcamera.x = lerp5(tcamera.x, closest[0], dt * 10);
        tcamera.y = lerp5(tcamera.y, closest[1], dt * 10);
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
        const dx = e.movementX / camera.zoom;
        const dy = e.movementY / camera.zoom;
        camera.x -= dx;
        camera.y -= dy;
        tcamera.x -= dx;
        tcamera.y -= dy;
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
        const f = Math.max(1 - e.deltaY / 50, 0);

        const lastZoom = tcamera.zoom;
        tcamera.zoom *= f;

        const dx = e.offsetX - canvas.width / 2;
        const dy = e.offsetY - canvas.height / 2;

        tcamera.x += dx / lastZoom - dx / tcamera.zoom;
        tcamera.y += dy / lastZoom - dy / tcamera.zoom;
    } else {
        tcamera.x += e.deltaX / tcamera.zoom;
        tcamera.y += e.deltaY / tcamera.zoom;
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